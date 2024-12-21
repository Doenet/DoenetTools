import React from "react";
import {
  Text,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
} from "@chakra-ui/react";
import { ContentClassification, ContentStructure } from "../../../_utils/types";

export function ClassificationInfo({
  contentData,
}: {
  contentData: ContentStructure;
}) {
  return (
    <>
      {!contentData.isFolder ? (
        <Flex
          flexDirection="column"
          width="100%"
          rowGap={6}
          height="100%"
          overflowY="auto"
        >
          <Text>Classifications</Text>

          {contentData.classifications.length === 0 ? (
            <Text as="i" mt="-5" ml="3">
              None added yet.
            </Text>
          ) : (
            <Accordion allowMultiple>
              {contentData.classifications.map((classification, i) => {
                const {
                  code,
                  systemName,
                  categoryLabel,
                  category,
                  subCategoryLabel,
                  subCategory,
                  description,
                  descriptionLabel,
                } = extraClassificationData(classification);
                return (
                  <AccordionItem key={`classification${i}`}>
                    <HStack>
                      <h2>
                        <AccordionButton>
                          <HStack flex="1" textAlign="left" direction={"row"}>
                            <Text as="b" data-test={`Classification ${i + 1}`}>
                              {code}
                            </Text>
                            <Text pt="2px">{systemName}</Text>
                          </HStack>
                          <AccordionIcon marginLeft="7px" />
                        </AccordionButton>
                      </h2>
                    </HStack>
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
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </Flex>
      ) : null}
    </>
  );
}

function extraClassificationData(classification: ContentClassification) {
  // For now, we don't have a classification that shares multiple system.
  // If we add one that does, we need a better system than concatenating their names,
  // but this concatenation will at least show that this combination occurred and a change is needed.
  const systemName = classification.subCategories
    .map((sc) => sc.category.system.name)
    .reduce((acc: string[], c) => (acc.includes(c) ? acc : [...acc, c]), [])
    .join(" / ");

  const categories = classification.subCategories
    .map((sc) => sc.category.category)
    .reduce((acc: string[], c) => (acc.includes(c) ? acc : [...acc, c]), []);
  let categoryLabel =
    classification.subCategories[0].category.system.categoryLabel;
  if (categories.length > 1) {
    // for now, all our category labels are pluralized by adding an s...
    categoryLabel += "s";
  }
  const category = categories.join(" / ");

  const subCategories = classification.subCategories
    .map((sc) => sc.subCategory)
    .reduce((acc: string[], c) => (acc.includes(c) ? acc : [...acc, c]), []);
  let subCategoryLabel =
    classification.subCategories[0].category.system.subCategoryLabel;
  if (subCategories.length > 1) {
    // for now, all our sub-category labels are pluralized by adding an s...
    subCategoryLabel += "s";
  }
  const subCategory = subCategories.join(" / ");

  const descriptionLabel =
    classification.subCategories[0].category.system.descriptionLabel;

  return {
    code: classification.code,
    systemName,
    categoryLabel,
    category,
    subCategoryLabel,
    subCategory,
    description: classification.description,
    descriptionLabel,
  };
}
