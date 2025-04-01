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
import { ActivityRemixItem, ContentRevision } from "../../../../_utils/types";
import { DateTime } from "luxon";
import { createFullName } from "../../../../_utils/names";

export function RevisionRemixInfoModal({
  isOpen,
  onClose,
  revision,
  remix,
  isRemixSource,
  finalFocusRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  revision: ContentRevision | null;
  remix: ActivityRemixItem | null;
  isRemixSource?: boolean;
  finalFocusRef?: RefObject<HTMLElement>;
}) {
  const revisionInfo = revision && (
    <>
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
          <label style={{ fontWeight: "bold" }}>Note:</label> {revision.note}
        </ListItem>
        <ListItem marginTop="20px">
          <label style={{ fontWeight: "bold" }}>Snapshot taken at:</label>{" "}
          {DateTime.fromISO(revision.createdAt).toLocaleString(
            DateTime.DATETIME_MED,
          )}
        </ListItem>
      </List>
    </>
  );

  const remixItem =
    !revision &&
    remix &&
    (isRemixSource ? remix.originContent : remix.remixContent);

  const remixInfo = remixItem && (
    <>
      <Text>
        The scratchpad has been prepopulated with a remix{" "}
        {isRemixSource ? "source " : ""} of the current activity.
      </Text>
      <List>
        <ListItem marginTop="20px">
          <label style={{ fontWeight: "bold" }}>
            Remix {isRemixSource ? "source " : ""} name:
          </label>{" "}
          {remixItem.name}
        </ListItem>
        <ListItem marginTop="20px">
          <label style={{ fontWeight: "bold" }}>Author:</label>{" "}
          {createFullName(remixItem.owner)}
        </ListItem>
        <ListItem marginTop="20px">
          <label style={{ fontWeight: "bold" }}>Direct remix:</label>{" "}
          {remix.directCopy.toString()}
          <Text marginTop="5px">
            {isRemixSource
              ? `Your activity was
            ${
              remix.directCopy
                ? "directly remixed from this source."
                : "remixed through other activities that were remixed from this source."
            }`
              : `The remix
            ${
              remix.directCopy
                ? "directly remixed your activity."
                : "remixed other activities that remixed your activity."
            }`}
          </Text>
        </ListItem>
        <ListItem marginTop="20px">
          <label style={{ fontWeight: "bold" }}>Updated:</label>{" "}
          {remixItem.changed.toString()} {remixItem.changed && <>&#x1f534; </>}
          <Text marginTop="5px">
            The remix {isRemixSource ? "source " : ""} has{" "}
            {!remixItem.changed && "not"} been updated since{" "}
            {isRemixSource
              ? remix.directCopy
                ? "you remixed it"
                : "you remixed"
              : remix.directCopy
                ? "they remixed your activity"
                : "they remixed"}{" "}
            (or since you last ignored the changes).
          </Text>
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
          {revision && <>Details on revision: {revision.revisionName}</>}
          {remixItem && isRemixSource && <>Details on remix source</>}
          {remixItem && !isRemixSource && <>Details on remixed activity</>}
        </ModalHeader>
        <ModalBody>
          {revisionInfo}
          {remixInfo}
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
