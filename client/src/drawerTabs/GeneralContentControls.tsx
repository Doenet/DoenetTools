import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FetcherWithComponents } from "react-router";
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import {
  Content,
  ContentCategory,
  ContentCategoryGroup,
  DoenetmlVersion,
} from "../types";
import { MdError } from "react-icons/md";

export async function generalContentActions({ formObj }: { [k: string]: any }) {
  try {
    if (formObj._action === "update name in settings") {
      await axios.post("/api/updateContent/updateContentSettings", {
        contentId: formObj.contentId,
        name: formObj.name,
      });
      return { updatedSettingMessage: `updated name to: ${formObj.name}` };
    } else if (formObj._action === "update doenetmlVersionId") {
      await axios.post("/api/updateContent/updateContentSettings", {
        contentId: formObj.contentId,
        doenetmlVersionId: Number(formObj.doenetmlVersionId),
      });
      return { updatedSettingMessage: "updated DoenetML version" };
    } else if (formObj._action === "update numToSelect") {
      await axios.post("/api/updateContent/updateContentSettings", {
        contentId: formObj.contentId,
        numToSelect: Number(formObj.numToSelect),
      });
      return {
        updatedSettingMessage: `updated Number to Select to ${formObj.numToSelect}`,
      };
    } else if (formObj._action === "update selectByVariant") {
      await axios.post("/api/updateContent/updateContentSettings", {
        contentId: formObj.contentId,
        selectByVariant: formObj.selectByVariant === "true",
      });
      return {
        updatedSettingMessage: `updated Select by Variant to ${formObj.selectByVariant}`,
      };
    } else if (formObj._action === "update shuffle") {
      await axios.post("/api/updateContent/updateContentSettings", {
        contentId: formObj.contentId,
        shuffle: formObj.shuffle === "true",
      });
      return {
        updatedSettingMessage: `updated Shuffle Items to ${formObj.shuffle}`,
      };
    } else if (formObj._action === "update paginate") {
      await axios.post("/api/updateContent/updateContentSettings", {
        contentId: formObj.contentId,
        paginate: formObj.paginate === "true",
      });
      return {
        updatedSettingMessage: `updated Paginate to ${formObj.paginate}`,
      };
    } else if (formObj?._action === "add category") {
      await axios.post("/api/updateContent/addCategory", {
        contentId: formObj.contentId,
        categoryCode: formObj.code,
      });
      return {
        updatedSettingMessage: `added activity category`,
      };
    } else if (formObj?._action === "remove category") {
      await axios.post("/api/updateContent/removeCategory", {
        contentId: formObj.contentId,
        categoryCode: formObj.code,
      });
      return {
        updatedSettingMessage: `removed activity category`,
      };
    }
  } catch (_e) {
    return { updatedSettingError: true };
  }
  return null;
}

export function GeneralContentControls({
  fetcher,
  contentData,
  allDoenetmlVersions,
  availableCategories,
  highlightRename = false,
  isOpen,
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: Content;
  allDoenetmlVersions: DoenetmlVersion[];
  availableCategories: ContentCategoryGroup[];
  highlightRename?: boolean;
  isOpen: boolean;
}) {
  const { name } = contentData;

  // TODO: if saveDataToServer is unsuccessful, then doenetmlVersion from the server
  // will not match doenetmlVersion on the client and the client will not be notified.
  // (And same for other variables using this pattern)
  // It appears this file is using optimistic UI without a recourse
  // should the optimism be unmerited.
  const doenetmlVersionInit: DoenetmlVersion | null =
    contentData.type === "singleDoc" ? contentData.doenetmlVersion : null;

  const [statusText, setStatusText] = useState("");
  const [statusStyleIdx, setStatusStyleIdx] = useState(0);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (typeof fetcher.data === "object" && fetcher.data !== null) {
      if ("updatedSettingMessage" in fetcher.data) {
        setStatusStyleIdx((x) => x + 1);
        setStatusText(`Successfully ${fetcher.data.updatedSettingMessage}`);
      } else if (fetcher.data.updatedSettingError === true) {
        setErrMsg("An error occurred attempting to update setting!");
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    setStatusText("");
    setErrMsg("");
  }, [isOpen]);

  const [nameValue, setName] = useState(name);
  const lastAcceptedNameValue = useRef(name);
  const [nameIsInvalid, setNameIsInvalid] = useState(false);

  // const [selectedCategories, setSelectedCategories] = useState(
  //   contentData.categories.map((category) => category.code),
  // );

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

  function saveName() {
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

    fetcher.submit(
      {
        _action: "update name in settings",
        contentId: contentData.contentId,
        name: nameToSubmit,
      },
      { method: "post" },
    );
  }

  function saveNumToSelect(text: string) {
    let num = Math.round(Number(text));
    if (!(Number.isInteger(num) && num >= 1)) {
      num = 1;
    }
    setNumToSelectText(num.toString());
    fetcher.submit(
      {
        _action: "update numToSelect",
        contentId: contentData.contentId,
        numToSelect: num,
      },
      { method: "post" },
    );
  }

  const statusTextDisplay = (
    <Box height="35px">
      {statusText !== "" || errMsg !== "" ? (
        <Box
          data-test="Status message"
          border="solid 1px lightgray"
          borderRadius="5px"
          padding="5px 10px"
          backgroundColor={
            errMsg !== ""
              ? "red.100"
              : ["green.100", "green.200"][statusStyleIdx % 2]
          }
        >
          {errMsg !== "" ? (
            <Text>
              <Icon
                fontSize="24pt"
                color="red.800"
                as={MdError}
                verticalAlign="middle"
                marginRight="5px"
              />
              {errMsg}
            </Text>
          ) : null}
          {statusText}
        </Box>
      ) : null}
    </Box>
  );

  const titleInputDisplay = (
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
        onBlur={() => saveName()}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            saveName();
          }
        }}
      />
      <FormErrorMessage>
        Error - A name for the {contentTypeLower} is required.
      </FormErrorMessage>
    </FormControl>
  );

  function getCategoryIcon(category: ContentCategory) {
    return (
      <Tooltip label={category.description}>
        {category.term}
        {/* <Icon
          paddingLeft="5px"
          as={activityCategoryIcons[category.code]}
          color="#666699"
          boxSize={5}
          verticalAlign="middle"
        /> */}
      </Tooltip>
    );
  }

  function fetcherAdd(code: string) {
    fetcher.submit(
      {
        _action: "add category",
        contentId: contentData.contentId,
        code,
      },
      { method: "post" },
    );
  }

  function fetcherRemove(code: string) {
    fetcher.submit(
      {
        _action: "remove category",
        contentId: contentData.contentId,
        code,
      },
      { method: "post" },
    );
  }

  function displayCategoryGroup(group: ContentCategoryGroup) {
    if (group.isExclusive) {
      return (
        <>
          <Text>{group.name}</Text>
          <RadioGroup onChange={fetcherAdd}>
            <Stack>
              {group.categories.map((category) => (
                <Radio
                  key={category.code}
                  value={category.code}
                  data-test={`${category.code} Radio`}
                >
                  {getCategoryIcon(category)}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </>
      );
    } else {
      return (
        <>
          <Text>{group.name}</Text>
          {group.categories.map((category) => {
            const isChecked = contentData.categories
              .map((c) => c.code)
              .includes(category.code);

            return (
              <Checkbox
                key={category.code}
                isChecked={isChecked}
                data-test={`${category.code} Checkbox`}
                onChange={() => {
                  if (isChecked) {
                    fetcherRemove(category.code);
                  } else {
                    fetcherAdd(category.code);
                  }
                }}
              >
                {getCategoryIcon(category)}
              </Checkbox>
            );
          })}
        </>
      );
    }
  }

  const allCategoriesDisplay = (
    <Box padding="10px" marginTop="20px">
      <Heading size="sm">Activity categories</Heading>
      <VStack alignItems="flex-start" gap={0}>
        {availableCategories.map(displayCategoryGroup)}
      </VStack>
    </Box>
  );

  return (
    <>
      {statusTextDisplay}
      {titleInputDisplay}
      {contentData.type !== "folder" && allCategoriesDisplay}

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
                const nextDoenetmlVersionId = Number(e.target.value);
                const nextDoenetmlVersion = allDoenetmlVersions.find(
                  (v) => v.id == nextDoenetmlVersionId,
                );
                if (nextDoenetmlVersion) {
                  setDoenetmlVersion(nextDoenetmlVersion);

                  fetcher.submit(
                    {
                      _action: "update doenetmlVersionId",
                      contentId: contentData.contentId,
                      doenetmlVersionId: nextDoenetmlVersionId,
                    },
                    { method: "post" },
                  );
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
                  _action: "update paginate",
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
                    _action: "update shuffle",
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
            <FormLabel marginTop="10px">
              Number to select
              <NumberInput
                width="80px"
                value={numToSelectText}
                onChange={(valueString) => {
                  const numValue = parseInt(valueString);
                  let strValue = numValue.toString();
                  if (!Number.isInteger(numValue) || numValue === 0) {
                    strValue = "";
                  }
                  setNumToSelectText(strValue);
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    const target = e.target as HTMLInputElement;
                    saveNumToSelect(target.value);
                  }
                }}
                min={1}
                onBlur={(e) => {
                  const valueString = e.target.value;
                  saveNumToSelect(valueString);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormLabel>

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
                    _action: "update selectByVariant",
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
