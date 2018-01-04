/**
 * ScrollHint Class
 */
class ScrollHint {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
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
  init() {
    this.attachEvent();
  }

  attachEvent() {
    this.scrollhintBind();
    $(window).on('resize.hint', () => this.scrollhintBind());
  }

  scrollhintBind() {
    this.$scrollable.each((i,v) => {
      const $base = $(v);
      const $inner = $base.find('.scrollable__inner');

      // overflow: scrollのラッパーの高さ（paddingが無いと楽）
      const baseHeight = $base.height();
      // スクロールで動く要素の高さ
      const childHeight = $inner.outerHeight();
      // スクロールで閲覧する分量の高さ
      const extraHeight = childHeight - baseHeight;

      $base.off('.hint').on('scroll.hint', () => this.scrollHandler(i, $base.scrollTop() / extraHeight));
    });
  }

  scrollHandler(i, ratio) {
    // .scrollableの配列と.scrollhintの配列はインデックスで対応している。
    // ratioはスクロール量に応じて0~1で入って来る。topは最初0でいい。bottomは逆転数なので1から引く。
    this.$hintTop.eq(i).css('opacity', ratio);
    this.$hintBottom.eq(i).css('opacity', 1-ratio);
  }
}


export default ScrollHint;

