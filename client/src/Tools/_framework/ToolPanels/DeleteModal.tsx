import React, { RefObject, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  ModalCloseButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { FetcherWithComponents } from "react-router";
import { ContentDescription } from "../../../_utils/types";
import { contentTypeToName } from "../../../_utils/activity";

export async function deleteModalActions({ formObj }: { [k: string]: any }) {
  if (formObj?._action == "Delete Content") {
    try {
      const contentId = formObj.contentId;

      await axios.post(`/api/updateContent/deleteContent`, {
        contentId,
      });

      return { contentDeleted: true };
    } catch (e) {
      console.error(e);
      return {
        errorDeletingContent: `Error deleting content`,
      };
    }
  }

  return null;
}

/**
 *
 */
export function DeleteModal({
  isOpen,
  onClose,
  finalFocusRef,
  content,
  fetcher,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  content: ContentDescription;
  fetcher: FetcherWithComponents<any>;
}) {
  const [errMsg, setErrMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.cursor = "default";
      setIsDeleting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (fetcher.data?.contentDeleted) {
      document.body.style.cursor = "default";
      onClose();
    } else if (fetcher.data?.errorDeletingContent) {
      document.body.style.cursor = "default";
      setErrMsg(fetcher.data.errorDeletingContent);
    }
  }, [fetcher.data]);

  function deleteContent() {
    fetcher.submit(
      {
        _action: "Delete Content",
        contentId: content.contentId,
      },
      { method: "post" },
    );
    setIsDeleting(true);
    document.body.style.cursor = "wait";
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
          {errMsg ? (
            <>Error deleting</>
          ) : (
            <>Confirm delete {isDeleting ? <Spinner /> : null}</>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {errMsg ? (
            <>{errMsg}</>
          ) : (
            <Box>
              Are you sure want to delete the{" "}
              {contentTypeToName[content.type].toLowerCase()}:{" "}
              <em>{content.name}</em>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            data-test="Go to Activities"
            marginRight="4px"
            onClick={() => {
              deleteContent();
            }}
            isDisabled={errMsg !== ""}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
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
