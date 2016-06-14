/**
* @name removeClass
* @summary removes given className from given element
*
**/
function removeClass (element, className) {
  element = ensureIsElement(element);

  if (hasClass(element, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      element.className = element.className.replace(reg, ' ');
  }
  element.className = trim(element.className);
  return element;

}