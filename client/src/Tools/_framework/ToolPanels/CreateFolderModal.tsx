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

export async function createFolderModalActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj?._action == "Add Folder") {
    try {
      await axios.post(`/api/createFolder/${formObj.parentFolder}`, {
        folderName: formObj.folderName,
      });
      return { folderCreated: true };
    } catch (e) {
      console.error(e);
      return {
        errorCreatingFolder: `Error creating folder`,
      };
    }
  }

  return null;
}

/**
 *
 */
export function CreateFolderModal({
  isOpen,
  onClose,
  finalFocusRef,
  parentFolder,
  fetcher,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  parentFolder: string | null;
  fetcher: FetcherWithComponents<any>;
}) {
  const [submitted, setSubmitted] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [folderName, setFolderName] = useState("Untitled Folder");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.cursor = "default";
      setFolderName("Untitled Folder");
      setSubmitted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!submitted) {
      // trigger when changing submitted to false as this happens
      // after set folder name to "Untitled Folder"
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [submitted]);

  useEffect(() => {
    if (fetcher.data?.folderCreated) {
      document.body.style.cursor = "default";
      onClose();
    } else if (fetcher.data?.errorCreatingFolder) {
      document.body.style.cursor = "default";
      setErrMsg(fetcher.data.errorCreatingFolder);
    }
  }, [fetcher.data]);

  function createFolder() {
    fetcher.submit(
      { _action: "Add Folder", folderName, parentFolder: parentFolder ?? "" },
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
        <ModalHeader textAlign="center">New Folder</ModalHeader>
        <ModalBody>
          <HStack>
            <Input
              value={folderName}
              ref={inputRef}
              maxLength={191}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  createFolder();
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
            data-test="Create Folder"
            marginRight="4px"
            onClick={() => {
              createFolder();
            }}
            isDisabled={errMsg !== ""}
          >
            Create
          </Button>
          <Button
            onClick={() => {
              // set submitted true to input select will be triggered on next open
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
