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
import { useNavigate } from "react-router";
import { ContentType } from "../../../_utils/types";
import { contentTypeToName } from "../../../_utils/activity";

/**
 * A modal that immediately upon opening copies an activity into a user's Activities.
 *
 * When the copy is finished, the modal allows the user to close it or navigate to their Activities list.
 */
export function CopyContentAndReportFinish({
  isOpen,
  onClose,
  finalFocusRef,
  sourceContent,
  desiredParent,
  action,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  sourceContent: { id: string; type: ContentType }[];
  desiredParent: { id: string; name: string; type: ContentType } | null;
  action: "Copy" | "Add";
}) {
  const [newActivityData, setNewActivityData] = useState<{
    newActivityIds: string[];
    userId: string;
  } | null>(null);

  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const actionPastWord = action === "Add" ? "added" : "copied";
  const actionProgressiveWord = action === "Add" ? "adding" : "copying";

  const numItems = sourceContent.length;

  useEffect(() => {
    async function copyContent() {
      document.body.style.cursor = "wait";

      try {
        const { data } = await axios.post(`/api/copyContent`, {
          sourceContent: sourceContent.map((s) => ({
            contentId: s.id,
            type: s.type,
          })),
          desiredParentId: desiredParent ? desiredParent.id : null,
        });

        setNewActivityData(data);
      } catch (e) {
        console.error(e);
        setErrMsg(`An error occurred while ${actionProgressiveWord}.`);
      }
      document.body.style.cursor = "default";
    }

    if (isOpen) {
      if (newActivityData === null) {
        copyContent();
      }
    } else {
      setNewActivityData(null);
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
      destinationUrl = `/activities/${newActivityData?.userId}/${desiredParent.id}`;
    } else {
      destinationAction = `Open ${typeName}`;
      destinationUrl = `/activityEditor/${desiredParent.id}`;
    }
  } else {
    destinationDescription = <>your Activities</>;
    destinationAction = "Go to Activities";
    destinationUrl = `/activities/${newActivityData?.userId}`;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="md"
      closeOnOverlayClick={newActivityData !== null}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {newActivityData === null
            ? actionProgressiveWord
            : `${action} finished`}
        </ModalHeader>
        {newActivityData !== null ? <ModalCloseButton /> : null}
        <ModalBody>
          {errMsg === "" ? (
            newActivityData === null ? (
              <HStack>
                <Text>Copying...</Text>
                <Spinner />
              </HStack>
            ) : (
              <>
                {numItems} item{numItems > 1 ? "s " : " "}
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
            isDisabled={newActivityData === null && errMsg === ""}
          >
            {destinationAction}
          </Button>
          <Button
            onClick={() => {
              onClose();
            }}
            isDisabled={newActivityData === null && errMsg === ""}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
