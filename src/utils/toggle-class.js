/**
* @name ToggleClass
* @summary adds given className to given element
*
**/
function toggleClass (element, className) {
  if (element != undefined && hasClass(element, className)) {
    removeClass(element, className);
  } else if (element != undefined && !hasClass(element, className)) {
    addClass(element, className);
  }
}