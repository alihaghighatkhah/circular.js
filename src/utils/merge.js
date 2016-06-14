/**
* @name merge
* @summary merges two given objects and returned the result
*
**/
function merge (obj1, obj2) {
  var obj = {};

  for (var x1 in obj1) {
    if (obj1.hasOwnProperty(x1)) {
      obj[x1] = obj1[x1];
    }
  }

  for (var x2 in obj2) {
    if (obj2.hasOwnProperty(x2) && x2 != '$attr' && x2 != '$$element') {
      obj[x2] = obj2[x2];
    }
  }
  return obj;
};