import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FetcherWithComponents, Form } from "react-router";
import {
  Box,
  FormControl,
  FormLabel,
  Icon,
  VStack,
  Text,
  Input,
  FormErrorMessage,
  Select,
  Checkbox,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import {
  ContentFeature,
  Content,
  DoenetmlVersion,
} from "../../../_utils/types";
import { activityFeatureIcons } from "../../../_utils/activity";

export async function generalContentActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "update general") {
    let activityLevelAttempts: boolean | undefined = undefined;
    let itemLevelAttempts: boolean | undefined = undefined;
    if (formObj.attemptButtons) {
      if (formObj.attemptButtons === "none") {
        activityLevelAttempts = itemLevelAttempts = false;
      } else if (formObj.attemptButtons === "activity") {
        activityLevelAttempts = true;
        itemLevelAttempts = false;
      } else if (formObj.attemptButtons === "item") {
        itemLevelAttempts = true;
        activityLevelAttempts = false;
      }
    }
    await axios.post("/api/updateContent/updateContentSettings", {
      name: formObj.name,
      contentId: formObj.contentId,
      doenetmlVersionId: formObj.doenetmlVersionId
        ? Number(formObj.doenetmlVersionId)
        : undefined,
      shuffle: formObj.shuffle ? formObj.shuffle === "true" : undefined,
      numToSelect: formObj.numToSelect
        ? Number(formObj.numToSelect)
        : undefined,
      selectByVariant: formObj.selectByVariant
        ? formObj.selectByVariant === "true"
        : undefined,
      paginate: formObj.paginate ? formObj.paginate === "true" : undefined,
      activityLevelAttempts,
      itemLevelAttempts,
    });

    return true;
  } else if (formObj?._action === "update features") {
    const features: Record<string, boolean> = {};

    const {
      contentId: _contentId,
      _action: __action,
      ...formFeatures
    } = formObj;

    for (const feature in formFeatures) {
      features[feature] = formFeatures[feature] === "true";
    }

    await axios.post("/api/updateContent/updateContentFeatures", {
      contentId: formObj.contentId,
      features,
    });
    return true;
  } else if (formObj?._action == "noop") {
    return true;
  }

  return null;
}

export function GeneralContentControls({
  fetcher,
  contentData,
  allDoenetmlVersions,
  availableFeatures,
  highlightRename = false,
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: Content;
  allDoenetmlVersions: DoenetmlVersion[];
  availableFeatures: ContentFeature[];
  highlightRename?: boolean;
}) {
  const { name } = contentData;

  // TODO: if saveDataToServer is unsuccessful, then doenetmlVersion from the server
  // will not match doenetmlVersion on the client and the client will not be notified.
  // (And same for other variables using this pattern)
  // It appears this file is using optimistic UI without a recourse
  // should the optimism be unmerited.
  const doenetmlVersionInit: DoenetmlVersion | null =
    contentData.type === "singleDoc" ? contentData.doenetmlVersion : null;

  const [nameValue, setName] = useState(name);
  const lastAcceptedNameValue = useRef(name);
  const [nameIsInvalid, setNameIsInvalid] = useState(false);

  const [selectedFeatures, setSelectedFeatures] = useState(
    contentData.contentFeatures.map((feature) => feature.code),
  );

  const [doenetmlVersion, setDoenetmlVersion] = useState(doenetmlVersionInit);

  const [shuffle, setShuffle] = useState(
    contentData.type === "sequence" ? contentData.shuffle : false,
  );
  const [numToSelectText, setNumToSelectText] = useState(
    contentData.type === "select" ? contentData.numToSelect.toString() : "1",
  );
  const [selectByVariant, setSelectByVariant] = useState(
    contentData.type === "select" ? contentData.selectByVariant : false,
  );
  const [paginate, setPaginate] = useState(
    contentData.type === "sequence" ? contentData.paginate : false,
  );

  const nameInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (highlightRename) {
      nameInput.current?.focus();
      nameInput.current?.select();
    }
  }, [highlightRename]);

  const contentType = contentData.type === "folder" ? "Folder" : "Activity";
  const contentTypeLower =
    contentData.type === "folder" ? "folder" : "activity";

  function saveDataToServer({
    nextDoenetmlVersionId,
    isQuestion,
    isInteractive,
    containsVideo,
  }: {
    nextDoenetmlVersionId?: number;
    isQuestion?: boolean;
    isInteractive?: boolean;
    containsVideo?: boolean;
  } = {}) {
    const data: {
      name?: string;
      doenetmlVersionId?: number;
      isQuestion?: boolean;
      isInteractive?: boolean;
      containsVideo?: boolean;
    } = { isQuestion, isInteractive, containsVideo };

    // Turn on/off name error messages and
    // use the latest valid name
    let nameToSubmit = nameValue;
    if (nameValue == "") {
      nameToSubmit = lastAcceptedNameValue.current;
      setNameIsInvalid(true);
    } else {
      if (nameIsInvalid) {
        setNameIsInvalid(false);
      }
    }
    lastAcceptedNameValue.current = nameToSubmit;

    data.name = nameToSubmit;

    if (nextDoenetmlVersionId) {
      data.doenetmlVersionId = nextDoenetmlVersionId;
    }

    fetcher.submit(
      {
        _action: "update general",
        contentId: contentData.contentId,
        ...data,
      },
      { method: "post" },
    );
  }

  function saveNumToSelect(text: string) {
    let num = Math.round(Number(text));
    if (!Number.isInteger(num) && num >= 1) {
      num = 1;
    }
    setNumToSelectText(num.toString());
    fetcher.submit(
      {
        _action: "update general",
        contentId: contentData.contentId,
        numToSelect: num,
      },
      { method: "post" },
    );
  }

  return (
    <>
      <Form method="post">
        <FormControl isInvalid={nameIsInvalid}>
          <FormLabel mt="16px">Name</FormLabel>

          <Input
            maxLength={191}
            ref={nameInput}
            name="name"
            size="sm"
            // width="392px"
            width="100%"
            placeholder={`${contentType} 1`}
            data-test="Content Name"
            value={nameValue}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onBlur={() => saveDataToServer()}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                saveDataToServer();
              }
            }}
          />
          <FormErrorMessage>
            Error - A name for the {contentTypeLower} is required.
          </FormErrorMessage>
        </FormControl>

        <input type="hidden" name="_action" value="update general" />
        <input type="hidden" name="contentId" value={contentData.contentId} />
      </Form>

      {contentData.type !== "folder" ? (
        <Box padding="10px" marginTop="20px">
          <Heading size="sm">Activity features</Heading>
          <VStack alignItems="flex-start" gap={0}>
            {availableFeatures.map((feature) => {
              const isPresent = selectedFeatures.includes(feature.code);
              return (
                <Checkbox
                  key={feature.code}
                  marginTop="10px"
                  isChecked={isPresent}
                  data-test={`${feature.code} Checkbox`}
                  onChange={() => {
                    setSelectedFeatures((was) => {
                      const newFeatures = [...was];
                      const ind = newFeatures.indexOf(feature.code);
                      if (ind === -1) {
                        newFeatures.push(feature.code);
                      } else {
                        newFeatures.splice(ind, 1);
                      }
                      return newFeatures;
                    });
                    fetcher.submit(
                      {
                        _action: "update features",
                        contentId: contentData.contentId,
                        [feature.code]: !isPresent,
                      },
                      { method: "post" },
                    );
                  }}
                >
                  <Tooltip label={feature.description}>
                    {feature.term}
                    <Icon
                      paddingLeft="5px"
                      as={activityFeatureIcons[feature.code]}
                      color="#666699"
                      boxSize={5}
                      verticalAlign="middle"
                    />
                  </Tooltip>
                </Checkbox>
              );
            })}
          </VStack>
        </Box>
      ) : null}

      {contentData.type === "singleDoc" ? (
        <>
          <FormControl>
            <FormLabel mt="16px">DoenetML version</FormLabel>
            <Select
              value={doenetmlVersion?.id}
              isDisabled={
                (contentData.assignmentInfo?.assignmentStatus ??
                  "Unassigned") !== "Unassigned"
              }
              onChange={(e) => {
                // TODO: do we worry about this pattern?
                // If saveDataToServer is unsuccessful, the client doenetmlVersion
                // will no match what's on the server.
                // (See TODO from near where doenetmlVersion is defined)
                const nextDoenetmlVersionId = Number(e.target.value);
                const nextDoenetmlVersion = allDoenetmlVersions.find(
                  (v) => v.id == nextDoenetmlVersionId,
                );
                if (nextDoenetmlVersion) {
                  setDoenetmlVersion(nextDoenetmlVersion);
                  saveDataToServer({ nextDoenetmlVersionId });
                }
              }}
            >
              {allDoenetmlVersions.map((version) => (
                <option value={version.id} key={version.id}>
                  {version.displayedVersion}
                </option>
              ))}
            </Select>
          </FormControl>

          {(contentData.assignmentInfo?.assignmentStatus ?? "Unassigned") !==
          "Unassigned" ? (
            <p>
              <strong>Note</strong>: Cannot modify DoenetML version since
              activity is assigned.
            </p>
          ) : null}
          {doenetmlVersion?.deprecated && (
            <p>
              <strong>Warning</strong>: DoenetML version{" "}
              {doenetmlVersion.displayedVersion} is deprecated.{" "}
              {doenetmlVersion.deprecationMessage}
            </p>
          )}
        </>
      ) : null}

      {contentData.type === "singleDoc" && contentData.numVariants > 1 ? (
        <Box marginTop="20px">
          This document has {contentData.numVariants} variants.
        </Box>
      ) : null}

      {contentData.type === "sequence" ? (
        <Box marginTop="20px">
          <Heading size="sm">Problem set settings</Heading>

          <Checkbox
            marginTop="10px"
            isChecked={paginate}
            data-test={`Paginate Checkbox`}
            onChange={() => {
              setPaginate(!paginate);

              fetcher.submit(
                {
                  _action: "update general",
                  contentId: contentData.contentId,
                  paginate: !paginate,
                },
                { method: "post" },
              );
            }}
          >
            Paginate
          </Checkbox>

          <VStack alignItems="flex-start" gap={0}>
            <Checkbox
              marginTop="10px"
              isChecked={shuffle}
              isDisabled={
                (contentData.assignmentInfo?.assignmentStatus ??
                  "Unassigned") !== "Unassigned"
              }
              data-test={`Shuffle Checkbox`}
              onChange={() => {
                setShuffle(!shuffle);

                fetcher.submit(
                  {
                    _action: "update general",
                    contentId: contentData.contentId,
                    shuffle: !shuffle,
                  },
                  { method: "post" },
                );
              }}
            >
              Shuffle items
            </Checkbox>
          </VStack>
        </Box>
      ) : null}
      {contentData.type === "select" ? (
        <Box marginTop="20px">
          <Heading size="sm" marginBottom="10px">
            Question bank settings
          </Heading>

          <VStack alignItems="flex-start" gap={0}>
            <p>
              Number to select:{" "}
              <Input
                name="numToSelect"
                size="sm"
                width="50px"
                data-test="Number To Select"
                isDisabled={
                  (contentData.assignmentInfo?.assignmentStatus ??
                    "Unassigned") !== "Unassigned"
                }
                value={numToSelectText}
                onChange={(e) => {
                  setNumToSelectText(e.target.value);
                }}
                onBlur={() => saveNumToSelect(numToSelectText)}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    saveNumToSelect(numToSelectText);
                  }
                }}
              />
            </p>

            <Checkbox
              marginTop="10px"
              isChecked={selectByVariant}
              data-test={`Select By Variant Checkbox`}
              isDisabled={
                (contentData.assignmentInfo?.assignmentStatus ??
                  "Unassigned") !== "Unassigned"
              }
              onChange={() => {
                setSelectByVariant(!selectByVariant);

                fetcher.submit(
                  {
                    _action: "update general",
                    contentId: contentData.contentId,
                    selectByVariant: !selectByVariant,
                  },
                  { method: "post" },
                );
              }}
            >
              Select by variant
            </Checkbox>
          </VStack>
        </Box>
      ) : null}
      {contentData.type !== "singleDoc" &&
      (contentData.assignmentInfo?.assignmentStatus ?? "Unassigned") !==
        "Unassigned" ? (
        <Text marginTop="10px">
          <strong>Note</strong>: Cannot modify some settings since activity is
          assigned.
        </Text>
      ) : null}
    </>
  );
}
