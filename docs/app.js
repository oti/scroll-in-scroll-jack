(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _AdjustHeight = require('./module/AdjustHeight');

var _AdjustHeight2 = _interopRequireDefault(_AdjustHeight);

var _ScrollJack = require('./module/ScrollJack');

var _ScrollJack2 = _interopRequireDefault(_ScrollJack);

var _ScrollHint = require('./module/ScrollHint');

var _ScrollHint2 = _interopRequireDefault(_ScrollHint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * DOM Ready
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
$(function () {
  new _AdjustHeight2.default();
  new _ScrollJack2.default();
  new _ScrollHint2.default();
}); /*!
     * Scroll in ScrollJack
     *
     *  @developer oti
     */

// import modules

},{"./module/AdjustHeight":2,"./module/ScrollHint":3,"./module/ScrollJack":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * AdjustHeight Class
 */
var AdjustHeight = function () {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  function AdjustHeight() {
    _classCallCheck(this, AdjustHeight);

    this.$target = $('.section');

    this.breakpoint = {
      pc: '(min-width: 960px)',
      sp: '(max-width: 959px)'
    };

    this.init();
    this.attachEvent();
  }

  /**
   * 初期実行
   * @return {[type]} [初期読み込み時の画面高をとる]
   */


  _createClass(AdjustHeight, [{
    key: 'init',
    value: function init() {
      this.adjustHeight(window.matchMedia(this.breakpoint.sp).matches);
    }

    /**
     * イベントリスナ登録
     * @return {[type]} [ブレークポイントでSP幅かどうか真偽値を投げる]
     */

  }, {
    key: 'attachEvent',
    value: function attachEvent() {
      var _this = this;

      window.matchMedia(this.breakpoint.sp).addListener(function (e) {
        _this.adjustHeight(e.matches);
      });
      window.addEventListener('resize', function (e) {
        _this.adjustHeight(window.matchMedia(_this.breakpoint.sp).matches);
      });
    }

    /**
     * 処理部
     * @return {[type]} [trueなら画面のinnerHeihgtをstyle属性で挿入する]
     */

  }, {
    key: 'adjustHeight',
    value: function adjustHeight(sp) {
      this.$target.css('height', sp ? window.innerHeight : '');
    }
  }]);

  return AdjustHeight;
}();

exports.default = AdjustHeight;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ScrollHint Class
 */
var ScrollHint = function () {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  function ScrollHint() {
    _classCallCheck(this, ScrollHint);

    this.$section = $('.section');
    this.$scrollable = this.$section.find('.scrollable');
    this.$hint = this.$scrollable.siblings('.scrollhint');
    this.$hintTop = this.$hint.find('.scrollhint__top');
    this.$hintBottom = this.$hint.find('.scrollhint__bottom');
    this.$hint.length && this.init();
  }

  /**
   * 初期実行
   * @return {[type]} [description]
   */


  _createClass(ScrollHint, [{
    key: 'init',
    value: function init() {
      this.attachEvent();
    }
  }, {
    key: 'attachEvent',
    value: function attachEvent() {
      var _this = this;

      this.scrollhintBind();
      $(window).on('resize.hint', function () {
        return _this.scrollhintBind();
      });
    }
  }, {
    key: 'scrollhintBind',
    value: function scrollhintBind() {
      var _this2 = this;

      this.$scrollable.each(function (i, v) {
        var $base = $(v);
        var $inner = $base.find('.scrollable__inner');

        // overflow: scrollのラッパーの高さ（paddingが無いと楽）
        var baseHeight = $base.height();
        // スクロールで動く要素の高さ
        var childHeight = $inner.outerHeight();
        // スクロールで閲覧する分量の高さ
        var extraHeight = childHeight - baseHeight;

        $base.off('.hint').on('scroll.hint', function () {
          return _this2.scrollHandler(i, $base.scrollTop() / extraHeight);
        });
      });
    }
  }, {
    key: 'scrollHandler',
    value: function scrollHandler(i, ratio) {
      // .scrollableの配列と.scrollhintの配列はインデックスで対応している。
      // ratioはスクロール量に応じて0~1で入って来る。topは最初0でいい。bottomは逆転数なので1から引く。
      this.$hintTop.eq(i).css('opacity', ratio);
      this.$hintBottom.eq(i).css('opacity', 1 - ratio);
    }
  }]);

  return ScrollHint;
}();

exports.default = ScrollHint;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ScrollJack Class
 */
var ScrollJack = function () {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  function ScrollJack() {
    _classCallCheck(this, ScrollJack);

    // ジャックする要素
    this.$doc = $(document);
    this.$body = $('body');
    // スクロールできる要素
    this.$scrollable = $('.scrollable');
    // ホイールイベントのフォールバック
    this.wheelEvent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    // セクション移動の域値（Safariだけ大きくする）
    this.thresholdWheelDefault = this.ua() === 'safari' ? 150 : 50;
    this.thresholdWheel = this.ua() === 'safari' ? 150 : 50;
    this.thresholdTouchDefault = 20;
    this.thresholdTouch = 20;
    // タッチイベントの座標（Y座標しか使わない）
    this.touchPos = {
      start: null,
      end: null
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

  /**
   * 初期実行
   * @return {[type]} [description]
   */


  _createClass(ScrollJack, [{
    key: 'attachEvent',
    value: function attachEvent() {
      var _this = this;

      // 監視員を起動
      $(window).on('resize.scrollJack', function () {
        return _this.sectionRestoration();
      });

      // キー操作をバインド
      this.$doc.on('keyup.scrollJack', function (ev) {
        return _this.keyHandler(ev);
      });

      // マウススクロールジャックはホイールイベントを奪う
      this.$doc.on(this.wheelEvent + '.scrollJack', function (ev) {
        // ジャック域値を戻す
        _this.thresholdWheel = _this.thresholdWheelDefault;
        _this.wheelHandler(ev);
      });

      // タッチデバイス
      this.$doc.on({
        'touchstart.scrollJack': function touchstartScrollJack(ev) {
          ev.preventDefault();
          // ジャック域値を戻す
          _this.thresholdTouch = _this.thresholdTouchDefault;
          _this.setTouchstartPos(ev.originalEvent.targetTouches[0]);
        },
        'touchend.scrollJack': function touchendScrollJack(ev) {
          ev.preventDefault();
          _this.setTouchendPos(ev.originalEvent.changedTouches[0]);
          _this.touchHandler();
        },
        'touchmove.scrollJack': function touchmoveScrollJack(ev) {
          return ev.preventDefault();
        }
      });

      // 中身をスクロールさせたいので要素の中では特殊な処理をする
      $(this.$scrollable).on(this.wheelEvent + '.scrollable', function (ev) {
        _this.thresholdWheel = _this.$scrollable.scrollHeight;
        // startのdocumentへの伝播を止める
        ev.stopPropagation();
      });
      $(this.$scrollable).on({
        'touchstart.scrollable': function touchstartScrollable(ev) {
          // ジャック域値を自身の中身分にしてみる
          // 高さ小さい時：そのままさらにスワイプすればジャック側が発火
          // 高さ大きい時：値によってはジャック側は永久に発火しない（画面の2倍とかをスワイプすることになったりする）
          _this.thresholdTouch = _this.$scrollable.scrollHeight;
          // startのdocumentへの伝播を止める
          ev.stopPropagation();
        },
        // moveのdocumentへの伝搬を止める
        'touchmove.scrollable': function touchmoveScrollable(ev) {
          return ev.stopPropagation();
        }
      });
    }

    /**
     * マウスホイールイベントのハンドラー
     * @return {[type]} [description]
     */

  }, {
    key: 'wheelHandler',
    value: function wheelHandler(ev) {
      if (this.moving) return;

      var oriEv = ev.originalEvent;
      var delta = oriEv.deltaY ? -oriEv.deltaY : oriEv.wheelDelta ? oriEv.wheelDelta : -oriEv.detail;
      var deltaAbs = Math.abs(delta);

      // Safariだとdeltaが小さいので無理矢理でっかくする
      if (this.ua() === 'safari') {
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

    /**
     * キーイベントのハンドラー
     * @return {[type]} [description]
     */

  }, {
    key: 'keyHandler',
    value: function keyHandler(ev) {
      if (this.moving) return;
      ev.preventDefault();
      ev.stopPropagation();

      // Tabでは移動しない
      if (ev.keyCode === 9) return false;

      // PageUp, ↑, k, ESC
      if (ev.keyCode === 33 || ev.keyCode === 38 || ev.keyCode === 75 || ev.keyCode === 27) {
        this.sectionPrev();
      }
      // Space, PageDown, ↓, j
      if (ev.keyCode === 32 || ev.keyCode === 34 || ev.keyCode === 40 || ev.keyCode === 74) {
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

    /**
     * タッチの始まりの座標をとる
     * @return {[type]} [description]
     */

  }, {
    key: 'setTouchstartPos',
    value: function setTouchstartPos(touches) {
      this.touchPos.start = touches.pageY;
    }

    /**
     * タッチの終わりの座標をとる
     * @return {[type]} [description]
     */

  }, {
    key: 'setTouchendPos',
    value: function setTouchendPos(touches) {
      this.touchPos.end = touches.pageY;
    }

    /**
     * タッチエンドのハンドラー
     * @return {[type]} [description]
     */

  }, {
    key: 'touchHandler',
    value: function touchHandler() {
      if (this.moving) return;

      var start = this.touchPos.start;
      var end = this.touchPos.end;
      var over = Math.abs(start - end) > this.thresholdTouch;

      if (start > end && over) {
        this.sectionNext();
      } else if (start < end && over) {
        this.sectionPrev();
      }
    }

    /**
     * セクションをひとつ後ろ送り
     * @return {[type]} [description]
     */

  }, {
    key: 'sectionPrev',
    value: function sectionPrev() {
      var _section = this.section = this.section === this.sectionStart ? this.sectionStart : this.section - 1;
      this.sectionMove(_section);
    }

    /**
     * セクションをひとつ前送り
     * @return {[type]} [description]
     */

  }, {
    key: 'sectionNext',
    value: function sectionNext() {
      var _section = this.section = this.section === this.sectionEnd ? this.sectionEnd : this.section + 1;
      this.sectionMove(_section);
    }

    /**
     * 特定ナンバーのセクションに送る
     * @return {[type]} [description]
     */

  }, {
    key: 'sectionMove',
    value: function sectionMove(_section) {
      this.$body.removeClass(function (index, className) {
        return (className.match(/\bis-\S+/g) || []).join(' ');
      }).addClass('is-' + _section);

      // スロットル〜
      this.throttle();
    }

    /**
     * 画面リサイズの時にセクションが戻るので、それを復元する
     * @return {[type]} [description]
     */

  }, {
    key: 'sectionRestoration',
    value: function sectionRestoration(section) {
      var _this2 = this;

      // 鬼の監視
      var interval = setInterval(function () {
        _this2.$body.removeClass(function (index, className) {
          return (className.match(/\bis-\S+/g) || []).join(' ');
        }).addClass('is-' + _this2.section);
      }, 1);

      // 監視を止める
      var timer = setTimeout(function () {
        clearTimeout(timer);
        clearInterval(interval);
      }, 2000);
    }

    /**
     * ホイールイベントを間引くための処理
     * @return {[type]} [description]
     */

  }, {
    key: 'throttle',
    value: function throttle() {
      var _this3 = this;

      this.moving = true;
      var timer = setTimeout(function () {
        clearTimeout(timer);
        _this3.moving = false;
      }, this.throttleTime);
    }

    /**
     * UserAgent判定
     * @return {[type]} [description]
     */

  }, {
    key: 'ua',
    value: function ua() {
      var ua = window.navigator.userAgent.toLowerCase();
      return (/msie/.test(ua) || /triden/.test(ua) ? 'ie' : /edge/.test(ua) ? 'edge' : /chrome/.test(ua) ? 'chrome' : /safari/.test(ua) ? 'safari' : /firefox/.test(ua) ? 'firefox' : /opera/.test(ua) ? 'opera' : 'other'
      );
    }
  }]);

  return ScrollJack;
}();

exports.default = ScrollJack;

},{}]},{},[1])
//# sourceMappingURL=app.js.map
