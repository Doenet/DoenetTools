import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, AlertQueue } from "./AlertQueue";
import { FetcherWithComponents, Form } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Text,
  Flex,
  Select,
  Heading,
  Tag,
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
} from "@chakra-ui/react";
import AsyncSelect from "react-select/async";
import { ContentClassification, ContentStructure } from "../../../_utils/types";

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
  id,
  contentData,
}: {
  fetcher: FetcherWithComponents<any>;
  id: string;
  contentData: ContentStructure;
}) {
  let [alerts, setAlerts] = useState<Alert[]>([]);

  let [classifySelectorInput, setClassifySelectorInput] = useState<string>("");
  const classificationsAlreadyAdded = contentData.classifications.map(
    (c2) => c2.id,
  );

  const getClassificationOptions = async (inputValue: string) => {
    let results = await axios.get(
      `/api/searchPossibleClassifications?q=${inputValue}`,
    );
    let classifications: ContentClassification[] = results.data;
    let options = classifications
      .filter((c) => !classificationsAlreadyAdded.includes(c.id))
      .map((c) => ({
        value: c.id,
        label: c,
      }));
    return options;
  };

  let [classifySpinnerHidden, setClassifySpinnerHidden] = useState(true);
  let [classifyItemRemoveSpinner, setClassifyItemRemoveSpinner] = useState(0);
  useEffect(() => {
    setClassifySpinnerHidden(true);
    setClassifyItemRemoveSpinner(0);
  }, [contentData]);

  let [allClassifications, setAllClassifications] = useState();
  useEffect(() => {
    async function getAllClassifications() {
      const { data } = await axios.get(
        `/api/getContributorHistory/${contentData.id}`,
      );
    }

    if (!contentData.isFolder) {
      getAllClassifications();
    }
  }, []);

  return (
    <>
      <AlertQueue alerts={alerts} />

      <Form method="post">
        {!contentData.isFolder ? (
          <FormControl>
            <Flex flexDirection="column" width="100%" rowGap={6}>
              {/* <FormLabel mt="16px">Content Classifications</FormLabel> */}

              <Text>Existing Classifications</Text>

              {contentData.classifications.length === 0 ? (
                <Text as="i" mt="-5" ml='3'>None added yet.</Text>
              ) : (
                <Accordion allowMultiple>
                  {contentData.classifications.map((classification, i) => (
                    <AccordionItem key={`classification${i}`}>
                      <HStack>
                        <h2>
                          <AccordionButton>
                            <HStack flex="1" textAlign="left" direction={"row"}>
                              ;<Text as="b">{classification.code}</Text>
                              <Text fontSize={"small"} pt="2px">
                                {classification.subCategory.category.system.name}
                              </Text>
                            </HStack>
                            <AccordionIcon marginLeft="7px" />
                          </AccordionButton>
                        </h2>
                        <Spacer />
                        <Tooltip
                          label={`Remove classification ${classification.code}`}
                        >
                          <CloseButton
                            aria-label={`Remove classification ${classification.code}`}
                            hidden={
                              classifyItemRemoveSpinner === classification.id
                            }
                            onClick={() => {
                              setClassifyItemRemoveSpinner(classification.id);
                              fetcher.submit(
                                {
                                  _action: "remove content classification",
                                  activityId: id,
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
                          <Text as="b">
                            {classification.subCategory.category.system.categoryLabel}:{" "}
                          </Text>
                          {classification.subCategory.category.category}
                        </Text>
                        <Text>
                          <Text as="b">
                            {classification.subCategory.category.system.subCategoryLabel}:{" "}
                          </Text>
                          {classification.subCategory.subCategory}
                        </Text>
                        <Text>
                          <Text as="b">Description: </Text>
                          {classification.description}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              <Text>Add a Classification</Text>
              <Box rowGap={2}>
                <Select placeholder="Choose a system"></Select>
                <Select placeholder="-" isDisabled></Select>
                <Select placeholder="-" isDisabled></Select>
              </Box>

              <HStack>
                <Box flex={1} pr="10px">
                  <AsyncSelect
                    key={`addClassification_${contentData.classifications.map((c) => c.id).join(",")}`} // force this component to reload when classifications change
                    placeholder="...or search by keyword"
                    defaultOptions
                    isClearable
                    value={null}
                    loadOptions={getClassificationOptions}
                    onInputChange={(newVal) => {
                      setClassifySelectorInput(newVal);
                    }}
                    onChange={(newValueLabel) => {
                      if (newValueLabel) {
                        setClassifySpinnerHidden(false);
                        fetcher.submit(
                          {
                            _action: "add content classification",
                            activityId: id,
                            classificationId: newValueLabel.value,
                          },
                          { method: "post" },
                        );
                      }
                    }}
                    formatOptionLabel={(val) =>
                      val ? (
                        <Box>
                          <Flex>
                            <Heading size="sm">
                              <Highlight
                                query={classifySelectorInput.split(" ")}
                                styles={{ fontWeight: 900 }}
                              >
                                {val.label.code +
                                  (val.label.subCategory.category.category
                                    ? " (" + val.label.subCategory.category.category + ")"
                                    : "")}
                              </Highlight>
                            </Heading>
                            <Spacer />
                            <Tag>
                              <Highlight
                                query={classifySelectorInput.split(" ")}
                                styles={{ fontWeight: "bold" }}
                              >
                                {val.label.subCategory.category.system.name}
                              </Highlight>
                            </Tag>
                          </Flex>
                          <Text>
                            <Text as="i">
                              {val.label.subCategory.category.system.categoryLabel}:
                            </Text>{" "}
                            <Highlight
                              query={classifySelectorInput.split(" ")}
                              styles={{ fontWeight: "bold" }}
                            >
                              {val.label.subCategory.category.category}
                            </Highlight>
                          </Text>
                          <Text>
                            <Text as="i">
                              {val.label.subCategory.category.system.subCategoryLabel}:
                            </Text>{" "}
                            <Highlight
                              query={classifySelectorInput.split(" ")}
                              styles={{ fontWeight: "bold" }}
                            >
                              {val.label.subCategory.subCategory}
                            </Highlight>
                          </Text>
                          <Text>
                            <Text as="i">Description: </Text>
                            <Highlight
                              query={classifySelectorInput.split(" ")}
                              styles={{ fontWeight: "bold" }}
                            >
                              {val.label.description}
                            </Highlight>
                          </Text>
                        </Box>
                      ) : null
                    }
                  />
                </Box>
                <Spinner hidden={classifySpinnerHidden} />
              </HStack>
            </Flex>
          </FormControl>
        ) : null}
      </Form>
    </>
  );
}
