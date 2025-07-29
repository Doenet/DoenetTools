import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Card,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useFetcher } from "react-router";
import { optimistic } from "../../utils/optimistic_ui";
import { Category, CategoryGroup } from "../../types";
import { activityCategoryIcons } from "../../utils/activity";

export function EditCategories({
  categories,
  allCategories,
  showRequired = false,
}: {
  categories: Category[];
  allCategories: CategoryGroup[];
  showRequired?: boolean;
}) {
  const output = [];

  for (const group of allCategories) {
    const groupBox = [];
    if (showRequired && group.isRequired) {
      groupBox.push(
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Required</AlertTitle>
        </Alert>,
      );
    }

    groupBox.push(
      <Heading size="md" mb="0.5rem">
        {group.name}
      </Heading>,
    );

    for (const category of group.categories) {
      const isChecked = categories.find((v) => v.code === category.code)
        ? true
        : false;

      groupBox.push(
        <CategoryCheckbox
          key={category.code}
          category={category}
          isChecked={isChecked}
        />,
      );
    }
    output.push(
      <Card
        align="flex-start"
        width="15rem"
        minHeight="12rem"
        p="1rem"
        m="0.5rem"
      >
        {groupBox}
      </Card>,
    );
  }
  return (
    <Flex justify="center" direction="row" wrap="wrap">
      {output}
    </Flex>
  );
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
        ml="1rem"
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
        <Tooltip label={category.description} openDelay={100}>
          <HStack>
            <Text color={fetcher.state === "idle" ? "black" : "gray"}>
              {category.term}
            </Text>
            {activityCategoryIcons[categoryCode] && (
              <Icon
                paddingLeft="5px"
                as={activityCategoryIcons[categoryCode]}
                color="#666699"
                boxSize={5}
                verticalAlign="middle"
              />
            )}
          </HStack>
        </Tooltip>
      </Checkbox>
    </>
  );
}
