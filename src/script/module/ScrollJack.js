import $ from "jquery";

class ScrollJack {
  constructor() {
    // ジャックする要素
    this.$doc = $(document);
    this.$body = $("body");
    // スクロールできる要素
    this.$scrollable = $(".scrollable");
    // ホイールイベントのフォールバック
    this.wheelEvent =
      "onwheel" in document
        ? "wheel"
        : "onmousewheel" in document
        ? "mousewheel"
        : "DOMMouseScroll";
    // セクション移動の域値（Safariだけ大きくする）
    this.thresholdWheelDefault = this.ua() === "safari" ? 150 : 50;
    this.thresholdWheel = this.ua() === "safari" ? 150 : 50;
    this.thresholdTouchDefault = 20;
    this.thresholdTouch = 20;
    // タッチイベントの座標（Y座標しか使わない）
    this.touchPos = {
      start: null,
      end: null,
    };
    // 操作するセクションID
    this.section = 1;
    // セクションの最初と最後のID
    this.sectionStart = 1;
    this.sectionEnd = 5;
    // セクション移動中のフラグ
    this.moving = false;
    // ジャックのスロットル
    this.throttleTime = 1000;

    // 初期実行
    this.attachEvent();
  }

  attachEvent() {
    // 監視員を起動
    $(window).on("resize.scrollJack", () => this.sectionRestoration());

    // キー操作をバインド
    this.$doc.on("keyup.scrollJack", (ev) => this.keyHandler(ev));

    // マウススクロールジャックはホイールイベントを奪う
    this.$doc.on(this.wheelEvent + ".scrollJack", (ev) => {
      // ジャック域値を戻す
      this.thresholdWheel = this.thresholdWheelDefault;
      this.wheelHandler(ev);
    });

    // タッチデバイス
    this.$doc.on({
      "touchstart.scrollJack": (ev) => {
        ev.preventDefault();
        // ジャック域値を戻す
        this.thresholdTouch = this.thresholdTouchDefault;
        this.setTouchstartPos(ev.originalEvent.targetTouches[0]);
      },
      "touchend.scrollJack": (ev) => {
        ev.preventDefault();
        this.setTouchendPos(ev.originalEvent.changedTouches[0]);
        this.touchHandler();
      },
      "touchmove.scrollJack": (ev) => ev.preventDefault(),
    });

    // 中身をスクロールさせたいので要素の中では特殊な処理をする
    $(this.$scrollable).on(this.wheelEvent + ".scrollable", (ev) => {
      this.thresholdWheel = this.$scrollable.scrollHeight;
      // startのdocumentへの伝播を止める
      ev.stopPropagation();
    });
    $(this.$scrollable).on({
      "touchstart.scrollable": (ev) => {
        // ジャック域値を自身の中身分にしてみる
        // 高さ小さい時：そのままさらにスワイプすればジャック側が発火
        // 高さ大きい時：値によってはジャック側は永久に発火しない（画面の2倍とかをスワイプすることになったりする）
        this.thresholdTouch = this.$scrollable.scrollHeight;
        // startのdocumentへの伝播を止める
        ev.stopPropagation();
      },
      // moveのdocumentへの伝搬を止める
      "touchmove.scrollable": (ev) => ev.stopPropagation(),
    });
  }

  wheelHandler(ev) {
    if (this.moving) return;

    let oriEv = ev.originalEvent;
    let delta = oriEv.deltaY
      ? -oriEv.deltaY
      : oriEv.wheelDelta
      ? oriEv.wheelDelta
      : -oriEv.detail;
    let deltaAbs = Math.abs(delta);

    // Safariだとdeltaが小さいので無理矢理でっかくする
    if (this.ua() === "safari") {
      deltaAbs = deltaAbs * 151;
    }

    // 域値以上に下にスクロール動かした時
    if (delta < 0 && this.thresholdWheel < deltaAbs) {
      this.sectionNext();
    }
    // 域値以上に上にスクロール動かした時
    else if (delta > 0 && deltaAbs > this.thresholdWheel) {
      this.sectionPrev();
    }
  }

  keyHandler(ev) {
    if (this.moving) return;
    ev.preventDefault();
    ev.stopPropagation();

    // Tabでは移動しない
    if (ev.keyCode === 9) return false;

    // PageUp, ↑, k, ESC
    if (
      ev.keyCode === 33 ||
      ev.keyCode === 38 ||
      ev.keyCode === 75 ||
      ev.keyCode === 27
    ) {
      this.sectionPrev();
    }
    // Space, PageDown, ↓, j
    if (
      ev.keyCode === 32 ||
      ev.keyCode === 34 ||
      ev.keyCode === 40 ||
      ev.keyCode === 74
    ) {
      this.sectionNext();
    }
    // Home, h
    if (ev.keyCode === 35 || ev.keyCode === 72) {
      this.section = this.sectionStart;
      this.sectionMove(this.section);
    }
    // End, e
    if (ev.keyCode === 36 || ev.keyCode === 69) {
      this.section = this.sectionEnd;
      this.sectionMove(this.section);
    }
  }

  setTouchstartPos(touches) {
    this.touchPos.start = touches.pageY;
  }

  setTouchendPos(touches) {
    this.touchPos.end = touches.pageY;
  }

  touchHandler() {
    if (this.moving) return;

    let start = this.touchPos.start;
    let end = this.touchPos.end;
    let over = Math.abs(start - end) > this.thresholdTouch;

    if (start > end && over) {
      this.sectionNext();
    } else if (start < end && over) {
      this.sectionPrev();
    }
  }

  sectionPrev() {
    let _section = (this.section =
      this.section === this.sectionStart
        ? this.sectionStart
        : this.section - 1);
    this.sectionMove(_section);
  }

  sectionNext() {
    let _section = (this.section =
      this.section === this.sectionEnd ? this.sectionEnd : this.section + 1);
    this.sectionMove(_section);
  }

  sectionMove(_section) {
    this.$body
      .removeClass((index, className) => {
        return (className.match(/\bis-\S+/g) || []).join(" ");
      })
      .addClass("is-" + _section);

    // スロットル〜
    this.throttle();
  }

  sectionRestoration(section) {
    // 鬼の監視
    let interval = setInterval(() => {
      this.$body
        .removeClass((index, className) => {
          return (className.match(/\bis-\S+/g) || []).join(" ");
        })
        .addClass("is-" + this.section);
    }, 1);

    // 監視を止める
    let timer = setTimeout(() => {
      clearTimeout(timer);
      clearInterval(interval);
    }, 2000);
  }

  throttle() {
    this.moving = true;
    let timer = setTimeout(() => {
      clearTimeout(timer);
      this.moving = false;
    }, this.throttleTime);
  }

  ua() {
    let ua = window.navigator.userAgent.toLowerCase();
    return /msie/.test(ua) || /triden/.test(ua)
      ? "ie"
      : /edge/.test(ua)
      ? "edge"
      : /chrome/.test(ua)
      ? "chrome"
      : /safari/.test(ua)
      ? "safari"
      : /firefox/.test(ua)
      ? "firefox"
      : /opera/.test(ua)
      ? "opera"
      : "other";
  }
}

export default ScrollJack;
