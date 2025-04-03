import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { RefObject } from "react";
import { FetcherWithComponents } from "react-router";
import axios from "axios";
import { AssignmentStatus, UserInfo } from "../../../_utils/types";

export async function developerModeModalActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj?._action == "set is developer") {
    await axios.post("/api/user/setIsDeveloper", {
      isDeveloper: formObj.isDeveloper === "true",
    });
  }

  return null;
}

export function DeveloperModeModal({
  isOpen,
  onClose,
  desiredAction,
  assignmentStatus,
  user,
  proceedCallback,
  allowNo = false,
  finalFocusRef,
  fetcher,
}: {
  isOpen: boolean;
  onClose: () => void;
  desiredAction: "edit" | "create doc";
  assignmentStatus?: AssignmentStatus;
  user: UserInfo;
  proceedCallback: () => void;
  allowNo?: boolean;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
}) {
  let promptText: string;

  if (desiredAction === "edit") {
    promptText = `You are about to ${
      (assignmentStatus ?? "Unassigned") === "Unassigned"
        ? "edit the source code"
        : "view the source code"
    }
        of this document.  Would you like to turn on developer mode?`;
  } else {
    promptText = `Writing document code requires developer mode.
    Would you like to turn on developer mode?`;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="md"
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Turn on developer mode?</ModalHeader>
        <ModalBody>
          <Text>{promptText}</Text>

          <Text marginTop="20px">
            Developer mode will make the code view be the default for documents.
          </Text>

          <Text marginTop="20px">
            You can turn developer mode on and off using the account menu in the
            upper right corner.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            marginRight="4px"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "set is developer",
                  userId: user.userId,
                  isDeveloper: !user.isDeveloper,
                },
                { method: "post" },
              );
              proceedCallback();
              onClose();
            }}
          >
            Yes
          </Button>
          {allowNo && (
            <Button
              marginRight="4px"
              onClick={() => {
                proceedCallback();
                onClose();
              }}
            >
              No
            </Button>
          )}
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
