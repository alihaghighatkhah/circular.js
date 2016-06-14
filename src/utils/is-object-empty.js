// check object emptiness
function isObjectEmpty (object) {
  var i = 0;
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      i++;
    }
  }
  return (i == 0);
}