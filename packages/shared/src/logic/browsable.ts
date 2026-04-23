import type { Category, CategoryGroup } from "../types/categories.js";

/**
 * Detect whether or not this activity has the required categories filled out.
 * For each group that is required, make sure this activity has at least 1 category in that group.
 * Returns true if all required groups have at least one category filled out, false otherwise.
 */
export function isActivityFullyCategorized({
  allCategories,
  categories,
}: {
  allCategories: CategoryGroup[];
  categories: Category[];
}) {
  const existingCodes = new Set(categories.map((c) => c.code));

  for (const group of allCategories.filter((g) => g.isRequired)) {
    const hasMatch = group.categories.some((category) =>
      existingCodes.has(category.code),
    );
    if (!hasMatch) {
      return false;
    }
  }

  return true;
}
