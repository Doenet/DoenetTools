import React, { ReactElement } from "react";
import { Category, CategoryGroup, ContentClassification } from "../types";
import {
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import {
  getClassificationAugmentedDescription,
  reformatClassificationData,
} from "./activity";

export function returnClassificationsAccordionPanel(
  classification: ContentClassification,
) {
  const {
    categoryLabel,
    category,
    subCategoryLabel,
    subCategory,
    description,
    descriptionLabel,
  } = reformatClassificationData(classification);

  let aliasNote: ReactElement<any> | null = null;
  if (classification.descriptions.length > 1) {
    aliasNote = (
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            Aliases: <AccordionIcon marginLeft="7px" />
          </AccordionButton>
          <AccordionPanel>
            <UnorderedList>
              {classification.descriptions.slice(1).map((description, i) => {
                return (
                  <ListItem key={i}>
                    &quot;
                    {getClassificationAugmentedDescription(
                      classification,
                      i + 1,
                    )}
                    &quot; from {description.subCategory.category.system.name}
                  </ListItem>
                );
              })}
            </UnorderedList>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }
  return (
    <AccordionPanel>
      <Text>
        <Text as="i">{categoryLabel}: </Text>
        {category}
      </Text>
      <Text>
        <Text as="i">{subCategoryLabel}: </Text>
        {subCategory}
      </Text>
      <Text>
        <Text as="i">{descriptionLabel}: </Text>
        {description}
      </Text>
      {aliasNote}
    </AccordionPanel>
  );
}

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
