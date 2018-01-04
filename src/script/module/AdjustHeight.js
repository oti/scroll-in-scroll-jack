/**
 * AdjustHeight Class
 */
class AdjustHeight {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
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
  init() {
    this.adjustHeight(window.matchMedia(this.breakpoint.sp).matches);
  }


  /**
   * イベントリスナ登録
   * @return {[type]} [ブレークポイントでSP幅かどうか真偽値を投げる]
   */
  attachEvent() {
    window.matchMedia(this.breakpoint.sp).addListener((e) => {
      this.adjustHeight(e.matches);
    });
    window.addEventListener('resize', (e) => {
      this.adjustHeight(window.matchMedia(this.breakpoint.sp).matches);
    });
  }


  /**
   * 処理部
   * @return {[type]} [trueなら画面のinnerHeihgtをstyle属性で挿入する]
   */
  adjustHeight(sp) {
    this.$target.css('height', (sp) ? window.innerHeight : '');
  }
}


export default AdjustHeight;

