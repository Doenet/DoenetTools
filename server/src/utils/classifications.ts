import { ContentClassification } from "../types";

export function sortClassifications(classifications: ContentClassification[]) {
  // Sort based on the subcategory of the first description of the classification.

  function comparator(a: ContentClassification, b: ContentClassification) {
    return (
      a.descriptions[0].subCategory.sortIndex -
      b.descriptions[0].subCategory.sortIndex
    );
  }

  classifications.sort(comparator);

  return classifications;
}
