import React, { useEffect, useState } from "react";
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
  SimpleGrid,
  Heading,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useFetcher } from "react-router-dom";

interface activeView {
  folder: null | {
    name: string;
    id: number;
    parentFolderId: number | null;
  };
  contents: {
    isFolder: boolean;
    name: string;
    id: number;
  }[];
}

export default function MoveContentToFolder({ isOpen, onClose, id }) {
  // Set when the modal opens
  const [parentId, setParentId] = useState<number | null>(null);
  const [contentName, setContentName] = useState<string>("");
  useEffect(() => {
    if (isOpen) {
      async function saveParentId() {
        const {
          data: { parentFolderId, name },
        } = await axios.get(`/api/getMyContentInfo/${id}`);
        updateActiveView(parentFolderId);
        setParentId((_) => parentFolderId);
        setContentName((_) => name);
      }
      saveParentId();
    }
  }, [isOpen]);

  // Set whenever the user navigates to another folder
  const [activeView, setActiveView] = useState<activeView>({
    folder: null,
    contents: [],
  });
  async function updateActiveView(newActiveFolderId: number | null) {
    const {
      data: {
        folder: { content: contentFromApi },
      },
    } = await axios.get(`/api/getFolderContent/${newActiveFolderId ?? ""}`);

    const content = contentFromApi
      .map((item) => {
        return {
          isFolder: item.isFolder,
          name: item.name,
          id: item.id,
        };
      })
      .sort((a, b) => {
        if (a.isFolder && !b.isFolder) {
          return -1;
        } else if (b.isFolder && !a.isFolder) {
          return 1;
        } else {
          return 0;
        }
      });

    let folderData;
    if (newActiveFolderId) {
      const { data: contentInfo } = await axios.get(
        `/api/getMyContentInfo/${newActiveFolderId}`,
      );

      folderData = {
        name: contentInfo.name,
        id: newActiveFolderId,
        parentFolderId: contentInfo.parentFolderId,
      };
    } else {
      folderData = null;
    }

    const folder = setActiveView((_) => {
      return { folder: folderData, contents: content };
    });
  }

  const initialRef = React.useRef(null);

  const fetcher = useFetcher();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>Move "{contentName}" to folder:</Heading>
            <HStack>
              {activeView.folder ? (
                <>
                  <IconButton
                    icon={<ArrowBackIcon />}
                    aria-label="Back"
                    onClick={() =>
                      updateActiveView(activeView.folder!.parentFolderId)
                    }
                  />
                  <Text>{activeView.folder!.name}</Text>
                </>
              ) : (
                <Text>My Activities</Text>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={1} spacing={0}>
              {activeView.contents.length === 0 ? (
                <Text as="i">This folder is empty.</Text>
              ) : (
                activeView.contents.map((content) => (
                  <Button
                    key={`moveContentItem${content.id}`}
                    variant="outline"
                    width="500px"
                    height="2em"
                    onClick={() => {
                      if (content.isFolder && content.id !== id)
                        updateActiveView(content.id);
                    }}
                    isDisabled={!content.isFolder || content.id === id}
                  >
                    <Text width="50%" marginTop="auto" marginBottom="auto">
                      {content.name}
                    </Text>
                  </Button>
                ))
              )}
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button ref={initialRef} mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                fetcher.submit(
                  {
                    _action: "Move",
                    id,
                    folderId: activeView.folder ? activeView.folder.id : null,
                    desiredPosition: activeView.contents.length, // place it as the last item
                  },
                  { method: "post" },
                );
                onClose();
              }}
              // Is disabled if the content is already in this folder
              isDisabled={
                (activeView.folder === null && parentId === null) ||
                (activeView.folder !== null &&
                  parentId !== null &&
                  activeView.folder.id === parentId)
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
