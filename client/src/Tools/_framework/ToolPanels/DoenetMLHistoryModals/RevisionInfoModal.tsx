import {
  Button,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { RefObject } from "react";
import { ContentRevision } from "../../../../_utils/types";
import { DateTime } from "luxon";

export function RevisionInfoModal({
  isOpen,
  onClose,
  revision,
  finalFocusRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  revision: ContentRevision;
  finalFocusRef?: RefObject<HTMLElement>;
}) {
  const revisionInfo = revision && (
    <>
      <List>
        <ListItem marginTop="20px">
          <label style={{ fontWeight: "bold" }}>Revision name:</label>{" "}
          {revision.revisionName}
        </ListItem>
        <ListItem marginTop="20px">
          <label style={{ fontWeight: "bold" }}>Note:</label> {revision.note}
        </ListItem>
        <ListItem marginTop="20px">
          <label style={{ fontWeight: "bold" }}>Created:</label>{" "}
          {DateTime.fromISO(revision.createdAt).toLocaleString(
            DateTime.DATETIME_MED,
          )}
        </ListItem>
      </List>
    </>
  );

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
          {<>Details on revision: {revision.revisionName}</>}
        </ModalHeader>
        <ModalBody>{revisionInfo}</ModalBody>

        <ModalFooter>
          <Button
            data-test="Close Button"
            onClick={() => {
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
