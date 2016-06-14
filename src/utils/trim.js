/**
* @name trim
* @summary removes non blank spaces from both sides of string
*
**/
function trim (str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}