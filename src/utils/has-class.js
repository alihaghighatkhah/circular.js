/**
* @name hasClass
* @summary checks if given elemen has the given className
*
**/
function hasClass (element, className) {
  element = ensureIsElement(element);

  if (element.className) {
    return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  } else {
    return false;
  }
}