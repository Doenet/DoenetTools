import { DateTime } from "luxon";
import { cidFromText } from "./cid";
import { DocHistoryItem, DocRemixItem } from "./types";

export async function processContributorHistory(hist: {
  contributorHistory: any[];
}) {
  const historyItems: DocHistoryItem[] = [];

  for (const ch of hist.contributorHistory) {
    const { prevDoc, ...historyItem } = ch;
    const prevActivity = prevDoc.activity;
    const prevCid = prevDoc.cid;
    const prevDocCurrentCid = await cidFromText(prevDoc.source);

    historyItems.push({
      ...historyItem,
      timestampDoc: DateTime.fromISO(ch.timestampDoc),
      timestampPrevDoc: DateTime.fromISO(ch.timestampPrevDoc),
      prevContentId: prevActivity.id,
      prevActivityName: prevActivity.name,
      prevOwner: prevActivity.owner,
      prevChanged: prevDocCurrentCid !== prevCid,
      prevCid,
    });
  }

  return historyItems;
}

export function processRemixes(docRemixes: {
  documentVersions: { versionNumber: number; remixes: any[] }[];
  id: string;
}): DocRemixItem[] {
  const items = docRemixes.documentVersions
    .flatMap((dv) =>
      dv.remixes.map((remix) => {
        const activity = remix.activity;
        const remixItem: DocRemixItem = {
          ...remix,
          prevDocId: docRemixes.id,
          prevDocVersionNum: dv.versionNumber,
          isDirect: remix.timestampDoc === remix.timestampPrevDoc,
          timestampDoc: DateTime.fromISO(remix.timestampDoc),
          timestampPrevDoc: DateTime.fromISO(remix.timestampPrevDoc),
          contentId: activity.id,
          activityName: activity.name,
          owner: activity.owner,
        };
        return remixItem;
      }),
    )
    .sort((a, b) => (a.isDirect === b.isDirect ? 0 : a.isDirect ? -1 : 1));

  return items;
}
