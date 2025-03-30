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
  Text,
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
          Details on revision: {revision.revisionName}
        </ModalHeader>
        <ModalBody>
          <Text>
            The scratchpad has been prepopulated with a revision of the current
            activity.
          </Text>

          <List>
            <ListItem marginTop="20px">
              <label style={{ fontWeight: "bold" }}>Revision name:</label>{" "}
              {revision.revisionName}
            </ListItem>
            <ListItem marginTop="20px">
              <label style={{ fontWeight: "bold" }}>Note:</label>{" "}
              {revision.note}
            </ListItem>
            <ListItem marginTop="20px">
              <label style={{ fontWeight: "bold" }}>Snapshot taken at:</label>{" "}
              {DateTime.fromISO(revision.createdAt).toLocaleString(
                DateTime.DATETIME_MED,
              )}
            </ListItem>
          </List>
        </ModalBody>

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
