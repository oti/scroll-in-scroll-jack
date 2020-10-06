import $ from "jquery";

class AdjustHeight {
  constructor() {
    this.$target = $(".section");

    this.breakpoint = {
      pc: "(min-width: 960px)",
      sp: "(max-width: 959px)",
    };

    if (window.matchMedia(this.breakpoint.sp).matches) {
      this.adjustHeight();
    }
    this.attachEvent();
  }

  attachEvent() {
    window.matchMedia(this.breakpoint.sp).addListener((e) => {
      this.adjustHeight(e.matches);
    });
    window.addEventListener("resize", (e) => {
      if (window.matchMedia(this.breakpoint.sp).matches) {
        this.adjustHeight();
      }
    });
  }

  adjustHeight() {
    this.$target.css("height", window.innerHeight);
  }
}

export default AdjustHeight;
