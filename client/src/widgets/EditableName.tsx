import React, { useState, useRef, ReactElement } from "react";
import {
  Editable,
  EditablePreview,
  EditableInput,
  Box,
  Show,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useFetcher } from "react-router";
import "../utils/editor-header.css";

/**
 * This is separate as <Editable> wasn't updating when defaultValue was changed
 *
 * If the contentId is null, this name won't be editable
 */
export function EditableName({
  contentId,
  contentName,
  leftIcon,
  dataTest,
  widthLargeScreen = "300px",
  widthBaseScreen = "100%",
}: {
  contentId: string | null;
  contentName: string;
  leftIcon: ReactElement;
  dataTest: string;
  widthLargeScreen?: string;
  widthBaseScreen?: string;
}) {
  const [name, setName] = useState(contentName);
  const fetcher = useFetcher();

  const lastBaseDataName = useRef(contentName);

  //Update when something else updates the name
  if (contentName != lastBaseDataName.current) {
    if (name != contentName) {
      setName(contentName);
    }
  }
  lastBaseDataName.current = contentName;

  // Special case: My Activities root folder
  // A null content id means we're at top-level folder, "My Activities"
  // We can't edit the name of that, so just show read-only text
  if (contentId === null) {
    return (
      <HStack position="relative" textAlign="left" spacing="0">
        <Box height="100%" alignContent="baseline" top="0" pointerEvents="none">
          {leftIcon}
        </Box>
        <Text data-test={dataTest} mt="4px" fontWeight="bold">
          {name}
        </Text>
      </HStack>
    );
  }

  return (
    <Box position="relative">
      <Editable
        data-test={dataTest}
        mt="4px"
        value={name}
        width={{ base: widthBaseScreen, lg: widthLargeScreen }}
        fontWeight="bold"
        textAlign="left"
        onChange={(value) => {
          setName(value);
        }}
        onSubmit={(value) => {
          let submitValue = value;
          if (submitValue.trim() === "") {
            submitValue = "Untitled";
          }

          fetcher.submit(
            {
              path: "updateContent/updateContentSettings",
              contentId,
              name: submitValue,
            },
            { method: "post", encType: "application/json" },
          );
        }}
      >
        <EditablePreview
          className="editable-name"
          data-test="Editable Title"
          noOfLines={1}
          pl={{ base: "0rem", md: "2rem" }}
        />
        <EditableInput
          data-test="Editable Input"
          maxLength={191}
          pl={{ base: "0rem", md: "2rem" }}
        />
      </Editable>

      <Show above="md">
        <Box
          height="100%"
          alignContent="baseline"
          padding="0.5rem 3px"
          position="absolute"
          top="0"
          pointerEvents="none"
        >
          {leftIcon}
        </Box>
      </Show>
    </Box>
  );
}
