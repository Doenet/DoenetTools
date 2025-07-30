import React, { useState, useRef } from "react";
import {
  Editable,
  EditablePreview,
  EditableInput,
  Tooltip,
} from "@chakra-ui/react";
import { useLoaderData, useFetcher } from "react-router";

/**
 * This is separate as <Editable> wasn't updating when defaultValue was changed
 */
export function EditableName({ dataTest }: { dataTest: string }) {
  const { contentName } = useLoaderData();

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

  return (
    <Editable
      data-test={dataTest}
      mt="4px"
      value={name}
      textAlign="center"
      onChange={(value) => {
        setName(value);
      }}
      onSubmit={(value) => {
        let submitValue = value;
        if (submitValue.trim() === "") {
          submitValue = "Untitled";
        }

        fetcher.submit(
          { path: "updateContent/updateContentSettings", name: submitValue },
          { method: "post", encType: "application/json" },
        );
      }}
    >
      <Tooltip label={name}>
        <EditablePreview data-test="Editable Title" noOfLines={1} />
      </Tooltip>
      <EditableInput
        maxLength={191}
        width={{ base: "100%", lg: "450px" }}
        data-test="Editable Input"
      />
    </Editable>
  );
}
