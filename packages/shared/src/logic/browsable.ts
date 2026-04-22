import { CategoryGroup, Category } from "../types/categories.js";

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
  const existingCodes = categories.map((c) => c.code);

  for (const group of allCategories.filter((g) => g.isRequired)) {
    const groupCategoryCodes = group.categories.map((c) => c.code);
    const intersection = existingCodes.filter((code) =>
      groupCategoryCodes.includes(code),
    );
    if (intersection.length === 0) {
      return false;
    }
  }

  return true;
}
