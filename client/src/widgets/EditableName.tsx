import React, { useState, useRef, ReactElement } from "react";
import {
  Editable,
  EditablePreview,
  EditableInput,
  Box,
  Show,
  Text,
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
    // Read-only header for root folder: icon sits inside the title box (non-editable)
    return (
      <Box
        position="relative"
        width={{ base: widthBaseScreen, lg: widthLargeScreen }}
      >
        <Show above="md">
          <Box
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            display="flex"
            alignItems="center"
            padding="0 0.75rem"
          >
            {leftIcon}
          </Box>
        </Show>
        <Text
          data-test={dataTest}
          fontWeight="bold"
          noOfLines={1}
          lineHeight="1.2"
          pl={{ base: "0rem", md: "2.5rem" }}
          isTruncated
        >
          {name}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      position="relative"
      width={{ base: widthBaseScreen, lg: widthLargeScreen }}
    >
      <Show above="md">
        <Box
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
          display="flex"
          alignItems="center"
          padding="0 0.75rem"
        >
          {leftIcon}
        </Box>
      </Show>

      <Editable
        data-test={dataTest}
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
          lineHeight="1.2"
          pl={{ base: "0rem", md: "2.5rem" }}
        />
        <EditableInput
          data-test="Editable Input"
          maxLength={191}
          lineHeight="1.2"
          pl={{ base: "0rem", md: "2.5rem" }}
        />
      </Editable>
    </Box>
  );
}
