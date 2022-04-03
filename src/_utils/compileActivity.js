export function compileActivity({ activity, itemsByDoenetId }) {


  let attributeString = ` xmlns="https://doenet.org/spec/doenetml/v${activity.version}" type="activity"`

  if(activity.itemWeights) {
    attributeString += ` itemWeights = "${activity.itemWeights.join(" ")}"`;
  }

  if(activity.shuffleItemWeights) {
    attributeString += ` shuffleItemWeights`;
  }

  let childrenString = ``;

  childrenString += orderToDoenetML({ order: activity.order, itemsByDoenetId });

  if (activity.variantControl) {
    childrenString += variantControlToDoenetML(activity.variantControl);
  }

  return `<document${attributeString}>\n${childrenString}</document>`

}


function orderToDoenetML({ order, indentLevel = 1, itemsByDoenetId }) {

  // TODO: list of possible order attributes
  let attributes = ["behavior", "numberToSelect", "withReplacement"];

  let orderParameters = attributes.filter(x => x in order)
    .map(x => `${x}="${order[x]}"`).join(" ");

  let contentStrings = order.content
    .map(x => contentToDoenetML({ content: x, indentLevel: indentLevel + 1, itemsByDoenetId }))
    .join("");

  let indentSpacing = "  ".repeat(indentLevel);

  return `${indentSpacing}<order ${orderParameters}>\n${contentStrings}${indentSpacing}</order>\n`;

}

function contentToDoenetML({ content, indentLevel = 1, itemsByDoenetId }) {
  if (content.type === "order") {
    return orderToDoenetML({ order: content, indentLevel, itemsByDoenetId });
  } else if (typeof content === "string") {
    return pageToDoenetML({ pageDoenetId: content, indentLevel, itemsByDoenetId });
  } else {
    throw Error("Invalid activity definition: content must be an order or a doenetId specifying a page")
  }
}

function pageToDoenetML({ pageDoenetId, indentLevel = 1, itemsByDoenetId }) {

  let indentSpacing = "  ".repeat(indentLevel);

  let pageCid = itemsByDoenetId[pageDoenetId]?.cid;

  if (!pageCid) {
    throw Error(`Invalid page doenetId in order: ${pageDoenetId}`);
  }

  return `${indentSpacing}<page cid="${pageCid}" />\n`;

}

function variantControlToDoenetML(variantControl) {

  let parameterString = "";

  if (variantControl.nVariants) {
    parameterString += ` nVariants="${variantControl.nVariants}"`
  }

  if (variantControl.seeds) {
    parameterString += ` seeds="${variantControl.seeds.join(" ")}"`
  }

  return `  <variantControl${parameterString} />\n`;

}