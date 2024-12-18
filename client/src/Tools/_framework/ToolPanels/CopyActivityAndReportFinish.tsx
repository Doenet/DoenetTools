import React, { RefObject, useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { ContentStructure } from "../../../_utils/types";

/**
 * A modal that immediately upon opening copies an activity into a user's Activities.
 *
 * When the copy is finished, the modal allows the user to close it or navigate to their Activities list.
 */
export function CopyActivityAndReportFinish({
  isOpen,
  onClose,
  finalFocusRef,
  activityData,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  activityData: ContentStructure;
}) {
  const [newActivityData, setNewActivityData] = useState<{
    newActivityId: string;
    userId: string;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function copyActivity() {
      document.body.style.cursor = "wait";

      const { data } = await axios.post(`/api/duplicateActivity`, {
        activityId: activityData.id,
      });

      setNewActivityData(data);
      document.body.style.cursor = "default";
    }

    if (isOpen) {
      if (newActivityData === null) {
        copyActivity();
      }
    } else {
      setNewActivityData(null);
    }
  }, [isOpen]);

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
          {newActivityData === null ? `Copying Activity` : `Activity copied`}
        </ModalHeader>
        {newActivityData !== null ? <ModalCloseButton /> : null}
        <ModalBody>
          {newActivityData === null ? (
            <HStack>
              <Text>Copying...</Text>
              <Spinner />
            </HStack>
          ) : (
            <>
              The activity <strong>{activityData.name}</strong> has been copied
              to your activities.
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            data-test="Go to Activities"
            marginRight="4px"
            onClick={() => {
              navigate(`/activities/${newActivityData?.userId}`);
            }}
            isDisabled={newActivityData === null}
          >
            Go to Activities
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
