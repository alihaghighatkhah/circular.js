/**
 *
 * @name ensureIsElement
 * @param element {string|object} - CSS selector or DOM object
 * @returns element
 *
 */
function ensureIsElement (element) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }

  if (element == undefined) {
    return false;
  }

  return element;
}