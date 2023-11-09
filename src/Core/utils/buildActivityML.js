import { cidFromText } from "./cid";


//Returns success and pageCID
//TODO: Currently only works for single page. Make it work with multipage
export async function buildSinglePageActivityML({
  activityId,
  isAssigned,
  courseId,
  version,
  doenetML,
  itemWeights, //optional
  shuffleItemWeights, //optional
  numVariants, //optional
}) {

  const pageCID = await cidFromText(doenetML);
  console.log("new pageCID", pageCID)

  let attributeString = ` xmlns="https://doenet.org/spec/doenetml/v${version}" type="activity"`;
  if (itemWeights) {
    attributeString += ` itemWeights = "${itemWeights.join(" ")}"`;
  }
  if (shuffleItemWeights) {
    attributeString += ` shuffleItemWeights="true"`;
  }
  if (numVariants !== undefined) {
    attributeString += ` numVariants="${numVariants}"`;
  }

  attributeString += ` isSinglePage="true"`;


  const pageML = ` <page cid="${pageCID}" label="Untitled" />\n`;


  let activityDoenetML = `<document${attributeString}>\n${pageML}</document>`;


  return { success: true, pageCID, activityDoenetML };
}

