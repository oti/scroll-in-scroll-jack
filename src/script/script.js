import $ from "jquery";

import AdjustHeight from "./module/AdjustHeight";
import ScrollJack from "./module/ScrollJack";
import ScrollHint from "./module/ScrollHint";

$(() => {
  new AdjustHeight();
  new ScrollJack();
  new ScrollHint();
});
