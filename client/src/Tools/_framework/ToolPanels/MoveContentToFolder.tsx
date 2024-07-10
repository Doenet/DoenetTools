import React, { useState } from "react";
import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  UnorderedList,
  ListIcon,
  ListItem,
  Stack,
  SimpleGrid,
  Center,
  Heading,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";

interface contentPiece {
  isFolder: boolean;
  name: string;
  id: number;
}
interface folderData {
  name: string;
  id: number;
  parentFolderId: number | null;
}

interface selectedContentData {
  id: number;
}

export default function MoveContentToFolder({}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // These are set when the modal opens
  const [selectedContent, setSelectedContent] = useState<number>();
  const [selectedContentParent, setSelectedContentParent] = useState<
    number | null
  >(null);

  // These are set whenever the user navigates to another folder
  const [viewData, setViewData] = useState<contentPiece[]>([]);
  const [currentFolder, setCurrentFolder] = useState<folderData | null>(null);

  async function updateView(currentFolderId: number | null) {
    setViewData((_) => []);
    const {
      data: { currentFolder, content },
    } = await axios.get(
      `/api/getMyFolderContentSparse/${currentFolderId ?? ""}`,
    );
    setViewData((_) => content);
    setCurrentFolder(currentFolder);
  }

  return (
    <>
      <Button
        onClick={async () => {
          const id = 298;

          onOpen();
          setSelectedContent((_) => id);
          const {
            data: { parentFolderId },
          } = await axios.get(`/api/getParentFolder/${id}`);
          setSelectedContentParent((_) => parentFolderId);

          updateView(selectedContentParent);
        }}
      >
        Open Modal
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>Move to Folder</Heading>
            <HStack>
              {currentFolder ? (
                <>
                  <IconButton
                    icon={<ArrowBackIcon />}
                    aria-label="Back"
                    onClick={() => updateView(currentFolder.parentFolderId)}
                  />
                  <Text>{currentFolder.name}</Text>
                </>
              ) : null}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={1} spacing={0}>
              {viewData.map((content) => (
                <Button
                  key={`moveContentItem${content.id}`}
                  variant="outline"
                  width="500px"
                  height="2em"
                  // bg="red"
                  onClick={() => {
                    if (content.isFolder) updateView(content.id);
                  }}
                  isDisabled={!content.isFolder}
                >
                  <Text width="50%" marginTop="auto" marginBottom="auto">
                    {content.name}
                  </Text>
                </Button>
              ))}
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onClose}
              isDisabled={
                (currentFolder === null && selectedContentParent === null) ||
                (currentFolder !== null &&
                  selectedContentParent !== null &&
                  currentFolder.id === selectedContentParent)
              }
            >
              Move
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
