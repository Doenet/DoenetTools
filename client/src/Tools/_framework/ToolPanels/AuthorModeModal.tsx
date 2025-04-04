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
import React, { RefObject, useRef } from "react";
import { FetcherWithComponents } from "react-router";
import axios from "axios";
import { AssignmentStatus, UserInfo } from "../../../_utils/types";

export async function authorModeModalActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj?._action == "set is author") {
    await axios.post("/api/user/setIsAuthor", {
      isAuthor: formObj.isAuthor === "true",
    });
  }

  return null;
}

export function AuthorModeModal({
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

  const editVerb =
    (assignmentStatus ?? "Unassigned") === "Unassigned" ? "edit" : "view";

  if (desiredAction === "edit") {
    promptText = `You are about to ${editVerb} the source code
        of this document.  Would you like to turn on author mode?`;
  } else {
    promptText = `Writing document source code requires author mode.
    Would you like to turn on author mode?`;
  }

  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="md"
      returnFocusOnClose={false}
      initialFocusRef={cancelRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Turn on author mode?</ModalHeader>
        <ModalBody>
          <Text>{promptText}</Text>

          <Text marginTop="20px">
            Author mode will make the source code view be the default for
            documents.
          </Text>

          <Text marginTop="20px">
            You can turn author mode on and off using the account menu in the
            upper right corner.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            marginRight="4px"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "set is author",
                  userId: user.userId,
                  isAuthor: !user.isAuthor,
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
              No, {editVerb} the source code anyway
            </Button>
          )}
          <Button
            data-test="Cancel Button"
            onClick={() => {
              onClose();
            }}
            ref={cancelRef}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
