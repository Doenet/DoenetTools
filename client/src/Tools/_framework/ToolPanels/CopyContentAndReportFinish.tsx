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
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router";
import { ContentType } from "../../../_utils/types";
import { contentTypeToName } from "../../../_utils/activity";
import { SiteContext } from "../Paths/SiteHeader";

/**
 * A modal that immediately upon opening copies source content into a parent or Activities
 * Alternatively, if the `copyToLibrary` flag is set and the user is an admin, it copies the activity into the library as a draft.
 *
 * When the copy is finished, the modal allows the user to close it or navigate to the parent.
 */
export function CopyContentAndReportFinish({
  isOpen,
  onClose,
  finalFocusRef,
  contentIds,
  desiredParent,
  action,
  copyToLibrary,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  contentIds: string[];
  desiredParent: { contentId: string; name: string; type: ContentType } | null;
  action: "Copy" | "Add";
  copyToLibrary?: boolean;
}) {
  const [newContentIds, setNewContentIds] = useState<string[] | null>(null);

  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const actionPastWord = action === "Add" ? "added" : "copied";
  const actionProgressiveWord = action === "Add" ? "Adding" : "Copying";

  const { user } = useOutletContext<SiteContext>();

  useEffect(() => {
    async function copyContent() {
      document.body.style.cursor = "wait";

      try {
        if (copyToLibrary) {
          const newContentIds: string[] = [];
          for (const c of contentIds) {
            const { data } = await axios.post(`/api/addDraftToLibrary`, {
              contentId: c,
            });
            newContentIds.push(data.newContentId);
          }
          setNewContentIds(newContentIds);
        } else {
          const { data } = await axios.post(`/api/copyMove/copyContent`, {
            contentIds,
            parentId: desiredParent ? desiredParent.contentId : null,
          });

          setNewContentIds(data.newContentIds);
        }
      } catch (e) {
        console.error(e);
        setErrMsg(
          `An error occurred while ${actionProgressiveWord.toLowerCase()}.`,
        );
      }
      document.body.style.cursor = "default";
    }

    if (isOpen) {
      if (newContentIds === null) {
        copyContent();
      }
    } else {
      setNewContentIds(null);
      setErrMsg("");
    }
  }, [isOpen, actionProgressiveWord]);

  let destinationDescription: ReactElement;
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
    } else {
      destinationAction = `Open ${typeName}`;
      destinationUrl = `/activityEditor/${desiredParent.contentId}`;
    }
  } else {
    destinationDescription = copyToLibrary ? (
      <>the library</>
    ) : (
      <>My Activities</>
    );
    destinationAction = copyToLibrary
      ? "Go to the library"
      : "Go to Activities";
    destinationUrl = copyToLibrary
      ? "/curation"
      : `/activities/${user?.userId}`;
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
        <ModalHeader textAlign="center">
          {newContentIds === null
            ? actionProgressiveWord
            : `${action} finished`}
        </ModalHeader>
        {newContentIds !== null ? <ModalCloseButton /> : null}
        <ModalBody>
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
            data-test="Go to Activities"
            marginRight="4px"
            onClick={() => {
              navigate(destinationUrl);
            }}
            isDisabled={newContentIds === null && errMsg === ""}
          >
            {destinationAction}
          </Button>
          <Button
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
