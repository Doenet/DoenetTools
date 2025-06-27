import React from "react";
import { Checkbox, HStack, Icon, Stack, Text, Tooltip } from "@chakra-ui/react";
import { useFetcher } from "react-router";
import { optimistic } from "../../utils/optimistic_ui";
import { Category } from "../../types";
import { activityCategoryIcons } from "../../utils/activity";

export function EditCategories({
  categories,
  allCategories,
}: {
  categories: Category[];
  allCategories: Category[];
}) {
  const categoryDisplays = [];
  for (const category of allCategories) {
    const isChecked = categories.find((v) => v.code === category.code)
      ? true
      : false;

    categoryDisplays.push(
      <CategoryCheckbox
        key={category.code}
        category={category}
        isChecked={isChecked}
      />,
    );
  }
  return <Stack>{categoryDisplays}</Stack>;
}

/**
 * This widget allows owners to view and edit the content categories of their activity - 1 checkbox for each category.
 */
function CategoryCheckbox({
  category,
  isChecked,
}: {
  category: Category;
  isChecked: boolean;
}) {
  const fetcher = useFetcher();
  const fallback: Record<string, boolean> = {};
  fallback[category.code] = isChecked;
  const optimisticCheckedRecord = optimistic<Record<string, boolean>>(
    fetcher,
    "categories",
    fallback,
  );
  const optimisticChecked = optimisticCheckedRecord[category.code];
  const categoryCode = category.code as
    | "isQuestion"
    | "isInteractive"
    | "containsVideo";

  return (
    <>
      <Checkbox
        key={category.code}
        data-test={`${category.code} Checkbox`}
        isChecked={optimisticChecked}
        onChange={(event) => {
          const categories: Record<string, boolean> = {};
          categories[category.code] = event.target.checked;

          fetcher.submit(
            {
              path: "updateContent/updateCategories",
              categories,
            },
            { method: "post", encType: "application/json" },
          );
        }}
      >
        <Tooltip label={category.description}>
          <HStack>
            <Text color={fetcher.state === "idle" ? "black" : "gray"}>
              {category.term}
            </Text>
            <Icon
              paddingLeft="5px"
              as={activityCategoryIcons[categoryCode]}
              color="#666699"
              boxSize={5}
              verticalAlign="middle"
            />
          </HStack>
        </Tooltip>
      </Checkbox>
    </>
  );
}
