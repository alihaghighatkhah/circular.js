/**
 * @ngdoc method
 * @name has
 * @param {string} name property name to check.
 * @param {object} object to chck if has a property named name
 */
function has (object, name) {
  return object.hasOwnProperty(name);
}