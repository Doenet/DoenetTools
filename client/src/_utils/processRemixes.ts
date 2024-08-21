import { DateTime } from "luxon";
import { cidFromText } from "./cid";
import { DocHistoryItem, DocRemixItem } from "./types";

export async function processContributorHistory(hist: {
  contributorHistory: any[];
}) {
  let historyItems: DocHistoryItem[] = [];

  for (let ch of hist.contributorHistory) {
    const { prevDoc, ...historyItem } = ch;
    let prevActivity = prevDoc.activity;
    let prevCid = prevDoc.cid;
    let prevDocCurrentCid = await cidFromText(prevDoc.source);

    historyItems.push({
      ...historyItem,
      timestampDoc: DateTime.fromISO(ch.timestampDoc),
      timestampPrevDoc: DateTime.fromISO(ch.timestampPrevDoc),
      prevActivityId: prevActivity.id,
      prevActivityName: prevActivity.name,
      prevOwner: prevActivity.owner,
      prevChanged: prevDocCurrentCid !== prevCid,
      prevCid,
    });
  }

  return historyItems;
}

export function processRemixes(remixes: {
  documentVersions: { contributorHistory: any[] }[];
}): DocRemixItem[] {
  let items = remixes.documentVersions
    .flatMap((dv) =>
      dv.contributorHistory.map((ch) => {
        const { document, ...item } = ch;
        const activity = document.activity;
        const remixItem: DocRemixItem = {
          ...item,
          isDirect: ch.timestampDoc === ch.timestampPrevDoc,
          timestampDoc: DateTime.fromISO(ch.timestampDoc),
          timestampPrevDoc: DateTime.fromISO(ch.timestampPrevDoc),
          activityId: activity.id,
          activityName: activity.name,
          owner: activity.owner,
        };
        return remixItem;
      }),
    )
    .sort((a, b) => (a.isDirect === b.isDirect ? 0 : a.isDirect ? -1 : 1));

  return items;
}
