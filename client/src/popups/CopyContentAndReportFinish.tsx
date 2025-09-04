import React, { ReactElement, RefObject, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  HStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import {
  FetcherWithComponents,
  useNavigate,
  useOutletContext,
} from "react-router";
import { ContentDescription } from "../types";
import { contentTypeToName } from "../utils/activity";
import { SiteContext } from "../paths/SiteHeader";
import { editorUrl } from "../utils/url";

export async function copyContentAndReportFinishActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj._action === "copy content") {
    const newContentIds: string[] = [];

    try {
      const contentIds = JSON.parse(formObj.contentIds);
      const { data } = await axios.post(`/api/copyMove/copyContent`, {
        contentIds,
        parentId: formObj.parentId === "null" ? null : formObj.parentId,
        prependCopy: formObj.prependCopy === "true",
      });

      newContentIds.push(...data.newContentIds);
      return { action: "copiedContent", success: true, newContentIds };
    } catch (e) {
      console.error(e);
      let message: string | null = null;
      if (e instanceof AxiosError) {
        message = e.response?.data.details;
      }

      return { action: "copiedContent", success: false, message };
    }
  }

  return null;
}
/**
 * A modal that immediately upon opening copies source content into a parent or Activities
 * Alternatively, if the `copyToLibrary` flag is set and the user is an editor, it copies the activity into the library as a draft.
 *
 * When the copy is finished, the modal allows the user to close it or navigate to the parent.
 */
export function CopyContentAndReportFinish({
  fetcher,
  isOpen,
  onClose,
  finalFocusRef,
  contentIds,
  desiredParent,
  action,
  prependCopy = false,
}: {
  fetcher: FetcherWithComponents<any>;
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement | null>;
  contentIds: string[];
  desiredParent: ContentDescription | null;
  action: "Copy" | "Add";
  prependCopy?: boolean;
}) {
  const [newContentIds, setNewContentIds] = useState<string[] | null>(null);

  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const actionPastWord = action === "Add" ? "added" : "copied";
  const actionProgressiveWord = action === "Add" ? "Adding" : "Copying";

  const { user, setAddTo } = useOutletContext<SiteContext>();

  useEffect(() => {
    if (fetcher.data?.action === "copiedContent") {
      if (fetcher.data.success) {
        setNewContentIds(fetcher.data.newContentIds);
      } else {
        const message = fetcher.data.message;
        setErrMsg(
          `An error occurred while ${actionProgressiveWord.toLowerCase()}${message ? ": " + message : ""}.`,
        );
      }

      document.body.style.cursor = "default";
    }
  }, [fetcher.data, actionProgressiveWord]);

  useEffect(() => {
    if (isOpen) {
      if (newContentIds === null) {
        document.body.style.cursor = "wait";
        fetcher.submit(
          {
            path: "copyMove/copyContent",
            contentIds,
            parentId: desiredParent ? desiredParent.contentId : null,
            prependCopy,
          },
          { method: "post", encType: "application/json" },
        );
      }
    } else {
      setNewContentIds(null);
      setErrMsg("");
    }
    // When we included all the dependencies here, it copied content several times
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  let destinationDescription: ReactElement<any>;
  let destinationAction: string;
  let destinationUrl: string;

  if (desiredParent) {
    const typeName = contentTypeToName[desiredParent.type].toLowerCase();
    destinationDescription = (
      <>
        <strong>{desiredParent.name}</strong>
      </>
    );
    if (desiredParent.type === "folder") {
      destinationAction = "Go to folder";
      destinationUrl = `/activities/${user?.userId}/${desiredParent.contentId}`;
    } else if (
      desiredParent.type === "select" &&
      desiredParent.parent?.type === "sequence"
    ) {
      // if we have a Question Bank whose parent is a Problem Set,
      // then we don't display the Question Bank by itself, just embedded in the Problem Set
      destinationAction = `Open containing problem set`;
      destinationUrl = editorUrl(
        desiredParent.parent.contentId,
        desiredParent.parent.type,
      );
    } else {
      destinationAction = `Open ${typeName}`;
      destinationUrl = editorUrl(desiredParent.contentId, desiredParent.type);
    }
  } else {
    destinationDescription = <>My Activities</>;
    destinationAction = "Go to My Activities";
    destinationUrl = `/activities/${user?.userId}`;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="md"
      closeOnOverlayClick={newContentIds !== null}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" data-test="Copy Header">
          {newContentIds === null
            ? errMsg === ""
              ? actionProgressiveWord
              : "An error occurred"
            : `${action} finished`}
        </ModalHeader>
        {newContentIds !== null ? <ModalCloseButton /> : null}
        <ModalBody data-test="Copy Body">
          {errMsg === "" ? (
            newContentIds === null ? (
              <HStack>
                <Text>{actionProgressiveWord}...</Text>
                <Spinner />
              </HStack>
            ) : (
              <>
                {newContentIds.length} item
                {newContentIds.length > 1 ? "s " : " "}
                {actionPastWord} to: {destinationDescription}
              </>
            )
          ) : (
            <>{errMsg}</>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            data-test="Go to Destination"
            marginRight="4px"
            onClick={() => {
              onClose();
              setAddTo(null);
              navigate(destinationUrl);
            }}
            isDisabled={newContentIds === null && errMsg === ""}
          >
            {destinationAction}
          </Button>
          <Button
            data-test="Close Button"
            onClick={() => {
              onClose();
            }}
            isDisabled={newContentIds === null && errMsg === ""}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
