/*!
 * Scroll in ScrollJack
 *
 *  @developer oti
 */

// import modules
import AdjustHeight   from './module/AdjustHeight';
import ScrollJack     from './module/ScrollJack';
import ScrollHint     from './module/ScrollHint';

/**
 * DOM Ready
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
$(() => {
  new AdjustHeight();
  new ScrollJack();
  new ScrollHint();
});
