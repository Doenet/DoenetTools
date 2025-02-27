import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  HStack,
  Spinner,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { FetcherWithComponents } from "react-router";
import { ContentType } from "../../../_utils/types";
import { contentTypeToName } from "../../../_utils/activity";

export async function createLocalContentModalActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj?._action == "Add Content") {
    try {
      await axios.post(`/api/updateContent/createContent`, {
        name: formObj.contentName,
        parentId: formObj.parentId === "null" ? null : formObj.parentId,
        contentType: formObj.contentType,
      });
      return { contentCreated: true };
    } catch (e) {
      console.error(e);
      return {
        errorCreatingContent: `Error creating ${contentTypeToName[formObj.contentType].toLowerCase()}`,
      };
    }
  }

  return null;
}

/**
 * A model designed for creating content locally, i.e., in the current folder.
 * Prompts for the name before creating. Simply closes after the creation.
 */
export function CreateLocalContentModal({
  isOpen,
  onClose,
  finalFocusRef,
  contentType,
  parentId,
  fetcher,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  contentType: ContentType;
  parentId: string | null;
  fetcher: FetcherWithComponents<any>;
}) {
  const [submitted, setSubmitted] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [contentName, setContentName] = useState(
    `Untitled ${contentTypeToName[contentType]}`,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.cursor = "default";
      setContentName(`Untitled ${contentTypeToName[contentType]}`);
      setSubmitted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!submitted) {
      // trigger when changing submitted to false as this happens
      // after set content name to `Untitled ${contentTypeToName[contentType]}`
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [submitted]);

  useEffect(() => {
    if (fetcher.data?.contentCreated) {
      document.body.style.cursor = "default";
      onClose();
    } else if (fetcher.data?.errorCreatingContent) {
      document.body.style.cursor = "default";
      setErrMsg(fetcher.data.errorCreatingContent);
    }
  }, [fetcher.data]);

  function createContent() {
    fetcher.submit(
      {
        _action: "Add Content",
        contentName,
        contentType,
        parentId,
      },
      { method: "post" },
    );
    document.body.style.cursor = "wait";
    setSubmitted(true);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          New {contentTypeToName[contentType]}{" "}
        </ModalHeader>
        <ModalBody>
          <HStack>
            <Input
              value={contentName}
              ref={inputRef}
              maxLength={191}
              data-test="New Content Input"
              onChange={(e) => setContentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  createContent();
                }
              }}
              isDisabled={errMsg !== ""}
            />
            {submitted && errMsg === "" ? <Spinner /> : null}
          </HStack>
          {errMsg ? <>{errMsg}</> : null}
        </ModalBody>

        <ModalFooter>
          <Button
            data-test="Create Content"
            marginRight="4px"
            onClick={() => {
              createContent();
            }}
            isDisabled={errMsg !== ""}
          >
            Create
          </Button>
          <Button
            data-test="Cancel Button"
            onClick={() => {
              // set submitted true so input select will be triggered on next open
              setSubmitted(true);
              onClose();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
