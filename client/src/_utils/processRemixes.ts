import { DateTime } from "luxon";
import { ActivityHistoryItem, ActivityRemixItem } from "./types";

export async function processContributorHistory({
  history,
}: {
  history: any[];
}) {
  const historyItems: ActivityHistoryItem[] = history.map((historyItem) => ({
    ...historyItem,
    timestampContent: DateTime.fromISO(historyItem.timestampContent),
    timestampPrevContent: DateTime.fromISO(historyItem.timestampPrevContent),
  }));

  return historyItems;
}

export function processRemixes({
  remixes,
}: {
  remixes: any[];
}): ActivityRemixItem[] {
  const items: ActivityRemixItem[] = remixes
    .map((remix) => ({
      ...remix,
      timestampContent: DateTime.fromISO(remix.timestampContent),
      timestampPrevContent: DateTime.fromISO(remix.timestampPrevContent),
    }))
    .sort((a, b) =>
      a.directCopy === b.directCopy ? 0 : a.directCopy ? -1 : 1,
    );

  return items;
}
