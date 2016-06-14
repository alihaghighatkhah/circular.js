/**
* @name addClass
* @summary adds given className to given element
*
**/
function addClass (element, className) {
  element = ensureIsElement(element);

  if (!hasClass(element, className)) {
    element.className += " " + className;
    element.className = trim(element.className);
  }
  return element;
}