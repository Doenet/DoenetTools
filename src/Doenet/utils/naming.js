export function createUniqueName(componentType, longNameId) {

  console.log(longNameId)

  return "__" + componentType + "_" + hashStringToInteger(longNameId);

}

// from https://stackoverflow.com/a/7616484
function hashStringToInteger(s) {
  var hash = 0, i, chr;
  if (s.length === 0)
    return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash >>>= 0; // Convert to 32bit unsigned integer
  }
  return hash;
};