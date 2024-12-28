import axios from "axios";
import React, { useEffect, useState } from "react";
import { FetcherWithComponents, Form } from "react-router";
import {
  Box,
  Text,
  Flex,
  Select,
  Heading,
  Highlight,
  Spacer,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  CloseButton,
  HStack,
  Tooltip,
  Spinner,
  CardBody,
  Card,
  Button,
  Input,
} from "@chakra-ui/react";
import {
  ClassificationCategoryTree,
  ContentClassification,
  ContentStructure,
} from "../../../_utils/types";

export async function classificationSettingsActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj._action == "add content classification") {
    if (formObj.isFolder !== "true") {
      await axios.post("/api/addClassification", {
        activityId: formObj.activityId,
        classificationId: Number(formObj.classificationId),
      });
      return true;
    }
  } else if (formObj._action == "remove content classification") {
    if (formObj.isFolder !== "true") {
      await axios.post("/api/removeClassification", {
        activityId: formObj.activityId,
        classificationId: Number(formObj.classificationId),
      });
      return true;
    }
  } else if (formObj?._action == "noop") {
    return true;
  }

  return null;
}

export function ClassificationSettings({
  fetcher,
  contentData,
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: ContentStructure;
}) {
  let [categoryFilter, setCategoryFilter] = useState<{
    systemId?: number;
    systemTreeIndex?: number;
    categoryId?: number;
    categoryTreeIndex?: number;
    subCategoryId?: number;
    subCategoryTreeIndex?: number;
  }>({});

  let [queryFilter, setQueryFilter] = useState<string | undefined>(undefined);

  let [classificationOptions, setClassificationOptions] = useState<
    ContentClassification[]
  >([]);

  const fetchClassificationOptions = async ({
    query,
    systemId,
    categoryId,
    subCategoryId,
  }: {
    query?: string;
    systemId?: number;
    categoryId?: number;
    subCategoryId?: number;
  }) => {
    let searchParameters = "";
    if (subCategoryId !== undefined) {
      searchParameters = `subCategory=${subCategoryId}`;
    } else if (categoryId !== undefined) {
      searchParameters = `category=${categoryId}`;
    } else if (systemId !== undefined) {
      searchParameters = `system=${systemId}`;
    }

    if (query !== undefined) {
      if (searchParameters) {
        searchParameters += "&";
      }
      searchParameters += `q=${query}`;
    }

    let results = await axios.get(
      `/api/searchPossibleClassifications?${searchParameters}`,
    );

    let classifications: ContentClassification[] = results.data;
    setClassificationOptions(classifications);
  };

  useEffect(() => {
    fetchClassificationOptions({ ...categoryFilter, query: queryFilter });
  }, [categoryFilter, queryFilter]);

  let [classifyItemRemoveSpinner, setClassifyItemRemoveSpinner] = useState(0);
  useEffect(() => {
    setClassifyItemRemoveSpinner(0);
  }, [contentData]);

  // Non-zero if waiting for server to add/remove classification (stores id)
  let [dropdownWaitingForChange, setDropdownWaitingForChange] = useState(0);
  useEffect(() => {
    setDropdownWaitingForChange(0);
  }, [contentData]);

  let [classificationCategories, setClassificationCategories] = useState<
    ClassificationCategoryTree[]
  >([]);
  useEffect(() => {
    async function fetchClassificationCategories() {
      const { data } = await axios.get(`/api/getClassificationCategories`);
      setClassificationCategories(data);
    }
    fetchClassificationCategories();
  }, []);

  let searchTermsTimeout: NodeJS.Timeout;
  function updateSearchTerms(
    e: React.FormEvent<HTMLInputElement>,
    immediate: boolean = false,
  ) {
    clearTimeout(searchTermsTimeout);
    if (immediate) {
      setQueryFilter((e.target as HTMLInputElement).value);
    } else {
      // if not immediate, debounce at half second
      searchTermsTimeout = setTimeout(() => {
        setQueryFilter((e.target as HTMLInputElement).value);
      }, 500);
    }
  }

  const selectedClassification =
    categoryFilter.systemTreeIndex === undefined
      ? null
      : classificationCategories[categoryFilter.systemTreeIndex];

  return (
    <>
      {!contentData.isFolder ? (
        <Flex
          flexDirection={["column", "row-reverse"]}
          columnGap={5}
          height="100%"
        >
          <Flex
            flexDirection="column"
            width={["100", "40%"]}
            rowGap={6}
            height={["50%", "100%"]}
            overflowY="auto"
          >
            <Text>Existing Classifications</Text>

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
                              <Text
                                as="b"
                                data-test={`Existing Classification ${i + 1}`}
                              >
                                {code}
                              </Text>
                              <Text fontSize={"small"} pt="2px">
                                {systemName}
                              </Text>
                            </HStack>
                            <AccordionIcon marginLeft="7px" />
                          </AccordionButton>
                        </h2>
                        <Spacer />
                        <Tooltip
                          label={`Remove classification ${code}`}
                          placement="bottom-end"
                        >
                          <CloseButton
                            aria-label={`Remove classification ${code}`}
                            data-test={`Remove Existing ${code}`}
                            hidden={
                              classifyItemRemoveSpinner === classification.id
                            }
                            onClick={() => {
                              setClassifyItemRemoveSpinner(classification.id);
                              fetcher.submit(
                                {
                                  _action: "remove content classification",
                                  activityId: contentData.id,
                                  classificationId: classification.id,
                                },
                                { method: "post" },
                              );
                            }}
                          />
                        </Tooltip>
                        <Spinner
                          hidden={
                            classifyItemRemoveSpinner !== classification.id
                          }
                        />
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

          <Flex
            flexDirection="column"
            width={["100", "60%"]}
            height={["50%", "100%"]}
            overflowY="scroll"
            paddingRight={1}
            paddingLeft={1}
            borderTopWidth={["thick", "inherit"]}
            paddingTop={[1, 0]}
          >
            <Text>Add a Classification</Text>
            <Box rowGap={2}>
              <HStack>
                <Select
                  value={categoryFilter.systemTreeIndex ?? ""}
                  placeholder="Filter by system"
                  data-test="Filter By System"
                  onChange={(event) => {
                    if (event.target.value) {
                      let treeIndex = Number(event.target.value);
                      setCategoryFilter({
                        systemId: classificationCategories[treeIndex].id,
                        systemTreeIndex: treeIndex,
                      });
                    } else {
                      setCategoryFilter({});
                    }
                  }}
                >
                  {classificationCategories.map((system, i) => (
                    <option value={i}>{system.name}</option>
                  ))}
                </Select>
                <CloseButton
                  aria-label={`Stop filtering by system`}
                  data-test="Stop Filter By System"
                  disabled={selectedClassification === null}
                  onClick={() => {
                    setCategoryFilter({});
                  }}
                />
              </HStack>

              <HStack>
                <Select
                  value={categoryFilter.categoryTreeIndex ?? ""}
                  placeholder={
                    selectedClassification === null
                      ? "-"
                      : `Filter by ${selectedClassification.categoryLabel}`
                  }
                  data-test="Filter By Category"
                  isDisabled={categoryFilter.systemId === undefined}
                  onChange={(event) => {
                    if (event.target.value) {
                      let treeIndex = Number(event.target.value);
                      setCategoryFilter((was) => {
                        let obj = { ...was };
                        obj.categoryId =
                          selectedClassification!.categories[treeIndex].id;
                        obj.categoryTreeIndex = treeIndex;
                        delete obj.subCategoryId;
                        delete obj.subCategoryTreeIndex;
                        return obj;
                      });
                    } else {
                      setCategoryFilter((was) => {
                        let obj = { ...was };
                        delete obj.categoryId;
                        delete obj.categoryTreeIndex;
                        delete obj.subCategoryId;
                        delete obj.subCategoryTreeIndex;
                        return obj;
                      });
                    }
                  }}
                >
                  {selectedClassification !== null
                    ? selectedClassification.categories.map((category, i) => (
                        <option value={i}>{category.category}</option>
                      ))
                    : null}
                </Select>
                <CloseButton
                  aria-label={`Stop filtering by ${selectedClassification?.categoryLabel}`}
                  data-test="Stop Filter By Category"
                  disabled={categoryFilter.categoryId === undefined}
                  onClick={() => {
                    setCategoryFilter((was) => {
                      let obj = { ...was };
                      delete obj.categoryId;
                      delete obj.categoryTreeIndex;
                      delete obj.subCategoryId;
                      delete obj.subCategoryTreeIndex;
                      return obj;
                    });
                  }}
                />
              </HStack>

              <HStack>
                <Select
                  value={categoryFilter.subCategoryTreeIndex ?? ""}
                  placeholder={
                    categoryFilter.categoryId === undefined
                      ? "-"
                      : `Filter by ${selectedClassification!.subCategoryLabel}`
                  }
                  data-test="Filter By Subcategory"
                  isDisabled={categoryFilter.categoryId === undefined}
                  onChange={(event) => {
                    if (event.target.value) {
                      let treeIndex = Number(event.target.value);
                      setCategoryFilter((was) => {
                        let obj = { ...was };
                        obj.subCategoryId =
                          selectedClassification!.categories[
                            categoryFilter.categoryTreeIndex!
                          ].subCategories[treeIndex].id;
                        obj.subCategoryTreeIndex = treeIndex;
                        return obj;
                      });
                    } else {
                      setCategoryFilter((was) => {
                        let obj = { ...was };
                        delete obj.subCategoryId;
                        delete obj.subCategoryTreeIndex;
                        return obj;
                      });
                    }
                  }}
                >
                  {categoryFilter.categoryTreeIndex !== undefined
                    ? selectedClassification!.categories[
                        categoryFilter.categoryTreeIndex
                      ].subCategories.map((subCategory, i) => (
                        <option value={i}>{subCategory.subCategory}</option>
                      ))
                    : null}
                </Select>
                <CloseButton
                  aria-label={`Stop filtering by ${selectedClassification?.subCategoryLabel}`}
                  data-test="Stop Filter By Subcategory"
                  disabled={categoryFilter.categoryId === undefined}
                  onClick={() => {
                    setCategoryFilter((was) => {
                      let obj = { ...was };
                      delete obj.subCategoryId;
                      delete obj.subCategoryTreeIndex;
                      return obj;
                    });
                  }}
                />
              </HStack>

              <Input
                type="search"
                data-test="Search Terms"
                placeholder="Filter by search terms"
                onInput={updateSearchTerms}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    updateSearchTerms(e, true);
                  }
                }}
                marginBottom={10}
                marginTop={4}
              />

              <Box data-test="Matching Classifications">
                {classificationOptions.length === 0 ? (
                  <p>No matching classifications</p>
                ) : null}

                {classificationOptions.map((classification) => {
                  let added = contentData.classifications
                    .map((c) => c.id)
                    .includes(classification.id);
                  let buttonText = added ? "Remove" : "Add";
                  let action =
                    (added ? "remove" : "add") + " content classification";

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
                    <Card
                      backgroundColor={added ? "lightGray" : "var(--canvas)"}
                    >
                      <CardBody paddingLeft={2}>
                        <HStack>
                          <Heading size="sm">
                            {code} ({systemName})
                          </Heading>
                          <Spacer />

                          <Button
                            size="sm"
                            isDisabled={
                              dropdownWaitingForChange === classification.id
                            }
                            onClick={() => {
                              setDropdownWaitingForChange(classification.id);
                              fetcher.submit(
                                {
                                  _action: action,
                                  activityId: contentData.id,
                                  classificationId: classification.id,
                                },
                                { method: "post" },
                              );
                            }}
                            data-test={`${buttonText} ${classification.code}`}
                          >
                            {dropdownWaitingForChange === classification.id ? (
                              <Spinner />
                            ) : (
                              buttonText
                            )}
                          </Button>
                        </HStack>
                        <Box>
                          <Text>
                            <Text as="i">{categoryLabel}:</Text>{" "}
                            <Highlight
                              query={queryFilter?.split(" ") || ""}
                              styles={{ fontWeight: "bold" }}
                            >
                              {category}
                            </Highlight>
                          </Text>
                          <Text>
                            <Text as="i">{subCategoryLabel}:</Text>{" "}
                            <Highlight
                              query={queryFilter?.split(" ") || ""}
                              styles={{ fontWeight: "bold" }}
                            >
                              {subCategory}
                            </Highlight>
                          </Text>
                          <Text>
                            <Text as="i">{descriptionLabel}:</Text>{" "}
                            <Highlight
                              query={(queryFilter || "").split(" ")}
                              styles={{ fontWeight: "bold" }}
                            >
                              {description}
                            </Highlight>
                          </Text>
                        </Box>
                      </CardBody>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          </Flex>
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
