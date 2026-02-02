import { useEffect, useState } from "react";
import { ContentDescription } from "../types";

type CardSelections = {
  contentIds: Set<string>;
  areActive: boolean;
  add: (contentId: string) => void;
  remove: (contentId: string) => void;
  clear: () => void;
};

export function useCardSelections({
  content,
}: {
  content: ContentDescription[];
}): CardSelections {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  function add(contentId: string) {
    setSelectedCards((was) => {
      const newSet = new Set(was);
      newSet.add(contentId);
      return newSet;
    });
  }

  function remove(contentId: string) {
    setSelectedCards((was) => {
      const newSet = new Set(was);
      newSet.delete(contentId);
      return newSet;
    });
  }

  /*
   * Every time the `content` changes, we check if any of the selected cards
   * are no longer present in the current content list. If any are missing,
   * we clear the selection to avoid referencing non-existent content.
   */
  useEffect(() => {
    setSelectedCards((was) => {
      return updateSelectionGivenNewContent({
        selectedCards: was,
        newContentIds: content.map((c) => c.contentId),
      });
    });
  }, [content]);

  return {
    contentIds: selectedCards,
    areActive: selectedCards.size > 0,
    add,
    remove,
    clear: () => setSelectedCards(new Set()),
  };
}

function updateSelectionGivenNewContent({
  selectedCards,
  newContentIds,
}: {
  selectedCards: Set<string>;
  newContentIds: string[];
}) {
  let foundMissing = false;
  for (const selectedCard of selectedCards) {
    if (!newContentIds.includes(selectedCard)) {
      foundMissing = true;
      break;
    }
  }
  if (foundMissing) {
    return new Set([]);
  } else {
    return selectedCards;
  }
}
