export function textFromComponent(component) {
  if (typeof component !== "object") {
    return component.toString();
  } else if (typeof component.stateValues.text === "string") {
    return component.stateValues.text;
  } else {
    return " ";
  }
}

// Concatenate the text from children into one string.
// If displayCommasBetweenCompositeReplacements is true,
// then add commas between the components that are all from one composite.
export function textFromChildren(
  children,
  displayCommasBetweenCompositeReplacements = true,
  textFromComponentConverter = textFromComponent,
) {
  let compositeReplacementRange = children.compositeReplacementRange;

  let nextCompositeInd = undefined;
  let nextCompositeChildInd = undefined;

  if (
    displayCommasBetweenCompositeReplacements &&
    compositeReplacementRange?.length > 0
  ) {
    nextCompositeInd = 0;
    nextCompositeChildInd =
      compositeReplacementRange[nextCompositeInd].firstInd;
  }

  let text = "";

  for (let childInd = 0; childInd < children.length; childInd++) {
    if (childInd === nextCompositeChildInd) {
      let nextTexts = children
        .slice(
          nextCompositeChildInd,
          compositeReplacementRange[nextCompositeInd].lastInd + 1,
        )
        .map(textFromComponentConverter);
      if (compositeReplacementRange[nextCompositeInd].displayWithCommas) {
        text += nextTexts.filter((v) => v.trim() !== "").join(", ");
      } else {
        text += nextTexts.join("");
      }

      childInd = compositeReplacementRange[nextCompositeInd].lastInd;

      while (nextCompositeChildInd <= childInd) {
        nextCompositeInd += 1;
        nextCompositeChildInd =
          compositeReplacementRange[nextCompositeInd]?.firstInd;
      }
    } else {
      text += textFromComponentConverter(children[childInd]);
    }
  }

  return text;
}
