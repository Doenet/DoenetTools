
export default function findFirstPageIdInContent(content) {
  let pageId = null;

  for (let item of content) {
    if (item?.type == "order") {
      let recursivePageId = findFirstPageIdInContent(item.content);
      if (recursivePageId != null) {
        pageId = recursivePageId;
        break;
      }
    } else if (item?.type == "collectionLink") {
      //Skip
    } else {
      pageId = item;
      break;
    }
  }
  return pageId;
}