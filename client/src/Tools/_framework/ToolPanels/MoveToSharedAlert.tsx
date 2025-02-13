import React from "react";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

export default function MoveToSharedAlert({
  isOpen,
  onClose,
  performMove,
  folderName,
}: {
  isOpen: boolean;
  onClose: () => void;
  performMove: () => void;
  folderName: string | null;
}) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading noOfLines={1} size="lg">
              <WarningIcon color="orange.500" /> Confirm move to shared folder
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              The target location{" "}
              <Text
                noOfLines={1}
                textAlign="center"
                fontWeight={800}
                fontStyle="italic"
              >
                {folderName}
              </Text>
              is a shared folder.
            </p>
            <p style={{ marginTop: "10px" }}>
              {" "}
              Moving to this folder will share the content with the same people.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Back
            </Button>
            <Button
              onClick={() => {
                performMove();
                onClose();
              }}
            >
              Confirm Move
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
