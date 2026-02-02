import { useMemo } from "react";
import { ContentDescription } from "../types";
import { useFetcher } from "react-router";

type CardMovement = {
  canMoveUp: boolean;
  canMoveDown: boolean;
  moveUp: () => void;
  moveDown: () => void;
};

export function useCardMovement({
  selectedCards,
  content,
}: {
  selectedCards: Set<string>;
  content: ContentDescription[];
}): CardMovement {
  const fetcher = useFetcher();

  const contentIdToIndex = useMemo(
    () => createMapFromContentIdToIndex({ selectedCards, content }),
    [content, selectedCards],
  );

  const canMoveUp = cardsCanMoveUp({ selectedCards, contentIdToIndex });
  const canMoveDown = cardsCanMoveDown({
    selectedCards,
    contentIdToIndex,
    totalCards: content.length,
  });

  const moveUp = () => {
    if (!canMoveUp) return;
    const contentId = selectedCards.values().next().value;
    if (!contentId) return;
    const position = contentIdToIndex[contentId];
    fetcher.submit(
      {
        path: "copyMove/moveContent",
        contentId,
        desiredPosition: position - 1,
        // parentId,
      },
      { method: "post", encType: "application/json" },
    );
  };

  const moveDown = () => {
    if (!canMoveDown) return;
    const contentId = selectedCards.values().next().value;
    if (!contentId) return;
    const position = contentIdToIndex[contentId];
    fetcher.submit(
      {
        path: "copyMove/moveContent",
        contentId,
        desiredPosition: position + 1,
        // parentId,
      },
      { method: "post", encType: "application/json" },
    );
  };

  return {
    canMoveUp,
    canMoveDown,
    moveUp,
    moveDown,
  };
}

function createMapFromContentIdToIndex({
  selectedCards,
  content,
}: {
  selectedCards: Set<string>;
  content: ContentDescription[];
}): Record<string, number> {
  const record: Record<string, number> = {};
  for (const contentId of selectedCards) {
    const index = content.findIndex((obj) => obj.contentId == contentId);
    if (index != -1) {
      record[contentId] = index;
    }
  }
  return record;
}

function cardsCanMoveUp({
  selectedCards,
  contentIdToIndex,
}: {
  selectedCards: Set<string>;
  contentIdToIndex: Record<string, number>;
}) {
  if (selectedCards.size !== 1) {
    return false;
  }
  const index = contentIdToIndex[Array.from(selectedCards)[0]];
  return index > 0;
}

function cardsCanMoveDown({
  selectedCards,
  contentIdToIndex,
  totalCards,
}: {
  selectedCards: Set<string>;
  contentIdToIndex: Record<string, number>;
  totalCards: number;
}) {
  if (selectedCards.size !== 1) {
    return false;
  }
  const index = contentIdToIndex[Array.from(selectedCards)[0]];
  return index < totalCards - 1;
}
