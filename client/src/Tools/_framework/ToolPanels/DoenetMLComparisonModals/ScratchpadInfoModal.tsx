import {
  Button,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import React, { RefObject } from "react";

export function ScratchpadInfoModal({
  isOpen,
  onClose,
  finalFocusRef,
}: {
  isOpen: boolean;
  onClose: () => void;
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
          Information about the scratchpad
        </ModalHeader>
        <ModalBody>
          <Text>
            Use the scratchpad to view different versions of a document and
            experiment with changes without saving.
          </Text>
          <Text marginTop="10px">
            You can prepopulate the scratchpad with
            <OrderedList>
              <ListItem>a document revision,</ListItem>
              <ListItem>
                an activity that the current activity was remixed from, or
              </ListItem>
              <ListItem>
                an activity that the remixed the current activity.
              </ListItem>
            </OrderedList>
          </Text>
          <Text marginTop="10px">
            Changes to the scratchpad are <b>not</b> saved. Copy changes to the
            Current Activity editor to save.
          </Text>
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
