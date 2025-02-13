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
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  sourceContent: { id: string; type: ContentType }[];
  desiredParent: { id: string; name: string; type: ContentType } | null;
}) {
  const [newActivityData, setNewActivityData] = useState<{
    newActivityIds: string[];
    userId: string;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function copyContent() {
      document.body.style.cursor = "wait";

      const { data } = await axios.post(`/api/copyContent`, {
        sourceContent: sourceContent.map((s) => ({
          contentId: s.id,
          type: s.type,
        })),
        desiredParentId: desiredParent ? desiredParent.id : null,
      });

      setNewActivityData(data);
      document.body.style.cursor = "default";
    }

    if (isOpen) {
      if (newActivityData === null) {
        copyContent();
      }
    } else {
      setNewActivityData(null);
    }
  }, [isOpen]);

  let destinationDescription: ReactElement;
  let destinationAction: string;
  let destinationUrl: string;

  if (desiredParent) {
    const typeName = contentTypeToName[desiredParent.type].toLowerCase();
    destinationDescription = (
      <>
        the {typeName} <strong>{desiredParent.name}</strong>
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
          {newActivityData === null ? `Copying` : `Copy finished`}
        </ModalHeader>
        {newActivityData !== null ? <ModalCloseButton /> : null}
        <ModalBody>
          {newActivityData === null ? (
            <HStack>
              <Text>Copying...</Text>
              <Spinner />
            </HStack>
          ) : (
            <>The content has been copied to {destinationDescription}.</>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            data-test="Go to Activities"
            marginRight="4px"
            onClick={() => {
              navigate(destinationUrl);
            }}
            isDisabled={newActivityData === null}
          >
            {destinationAction}
          </Button>
          <Button
            onClick={() => {
              onClose();
            }}
            isDisabled={newActivityData === null}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
