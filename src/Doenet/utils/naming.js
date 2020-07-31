export function createUniqueName(componentType, longNameId) {

  console.log(componentType, longNameId)

  return "__" + componentType + "_" + hashStringToInteger(longNameId).toString(36);

}

export function getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed) {

  let postfix = 1;
  let uniqueIdentifier = uniqueIdentifierBase + postfix;

  while (uniqueIdentifiersUsed.includes(uniqueIdentifier)) {
    postfix += 1;
    uniqueIdentifier = uniqueIdentifierBase + postfix;
  }

  uniqueIdentifiersUsed.push(uniqueIdentifier);

  return uniqueIdentifier;

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