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
import { ContentDescription } from "../types";
import { contentTypeToName } from "../utils/activity";

export async function deleteContentActions({ formObj }: { [k: string]: any }) {
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
export function DeleteContent({
  isOpen,
  onClose,
  finalFocusRef,
  content,
  fetcher,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement | null>;
  content: ContentDescription;
  fetcher: FetcherWithComponents<any>;
}) {
  const [errMsg, setErrMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  //TODO: YET: cleanup
  // Is this still necessary?
  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isDeleting) {
      if (fetcher.data?.contentDeleted) {
        setIsDeleting(false);
        onClose();
      } else if (fetcher.data?.errorDeletingContent) {
        setIsDeleting(false);
        setErrMsg(fetcher.data.errorDeletingContent);
      }
    }
  }, [fetcher.data, isDeleting, onClose]);

  function deleteContent() {
    setIsDeleting(true);
    // document.body.style.cursor = "wait";
    fetcher.submit(
      {
        path: "updateContent/deleteContent",
        contentId: content.contentId,
      },
      { method: "post", encType: "application/json" },
    );
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
            <>Error moving to trash</>
          ) : (
            <>Move to trash? {isDeleting ? <Spinner /> : null}</>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {errMsg ? (
            <>{errMsg}</>
          ) : (
            <Box data-test="Confirm Delete Message">
              The {contentTypeToName[content.type].toLowerCase()}{" "}
              <em>{content.name}</em> will be deleted forever after 30 days.
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            marginRight="4px"
            data-test="Delete Button"
            onClick={() => {
              deleteContent();
            }}
            isDisabled={errMsg !== ""}
          >
            Move to trash
          </Button>
          <Button
            data-test="Cancel Button"
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
