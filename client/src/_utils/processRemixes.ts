import { DateTime } from "luxon";
import { ActivityHistoryItem, ActivityRemixItem } from "./types";

export async function processContributorHistory({
  history,
}: {
  history: any[];
}) {
  const historyItems: ActivityHistoryItem[] = history.map((historyItem) => ({
    ...historyItem,
    timestampActivity: DateTime.fromISO(historyItem.timestampActivity),
    timestampPrevActivity: DateTime.fromISO(historyItem.timestampPrevActivity),
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
      timestampActivity: DateTime.fromISO(remix.timestampActivity),
      timestampPrevActivity: DateTime.fromISO(remix.timestampPrevActivity),
    }))
    .sort((a, b) =>
      a.directCopy === b.directCopy ? 0 : a.directCopy ? -1 : 1,
    );

  return items;
}
