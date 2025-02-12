import React, { RefObject, useEffect, useState } from "react";
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
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useFetcher } from "react-router";
import { MdFolder, MdOutlineInsertDriveFile } from "react-icons/md";
import MoveToSharedAlert from "./MoveToSharedAlert";
import { ContentStructure, LicenseCode, UserInfo } from "../../../_utils/types";

type ActiveView = {
  // If folder name and id are null, the active view is the root
  // If parentFolderId is null, then the parent of active view is the root
  folderId: string | null;
  folderName: string | null;
  folderIsPublic: boolean;
  folderIsShared: boolean;
  folderSharedWith: UserInfo[];
  folderLicenseCode: LicenseCode | null;
  parentFolderId: string | null;
  contents: {
    isFolder: boolean;
    name: string;
    id: string;
  }[];
};

export async function moveContentActions({ formObj }: { [k: string]: any }) {
  if (formObj?._action == "Move to folder") {
    await axios.post(`/api/moveContent`, {
      id: formObj.id,
      desiredParentFolderId:
        formObj.folderId === "null" ? null : formObj.folderId,
      desiredPosition: formObj.desiredPosition,
    });
    return true;
  }

  return null;
}

export default function MoveContentToFolder({
  isOpen,
  onClose,
  id,
  isPublic,
  isShared,
  sharedWith,
  licenseCode,
  userId,
  currentParentId,
  finalFocusRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: UserInfo[];
  licenseCode: LicenseCode | null;
  userId: string;
  currentParentId: string | null;
  finalFocusRef: RefObject<HTMLElement>;
}) {
  // Set when the modal opens
  const [parentId, setParentId] = useState<string | null>(null);
  const [contentName, setContentName] = useState<string>("");

  const {
    isOpen: sharedAlertIsOpen,
    onOpen: sharedAlertOnOpen,
    onClose: sharedAlertOnClose,
  } = useDisclosure();

  useEffect(() => {
    if (isOpen) {
      updateActiveView(currentParentId, true);
    }
  }, [isOpen]);

  // Set whenever the user navigates to another folder
  const [activeView, setActiveView] = useState<ActiveView>({
    folderName: null,
    folderIsPublic: false,
    folderIsShared: false,
    folderSharedWith: [],
    folderLicenseCode: null,
    folderId: null,
    parentFolderId: null,
    contents: [],
  });

  async function updateActiveView(
    newActiveFolderId: string | null,
    modalJustOpened: boolean = false,
  ) {
    const { data } = await axios.get(
      `/api/getMyFolderContent/${userId}/${newActiveFolderId ?? ""}`,
    );

    const folder: ContentStructure | null = data.folder;
    const folderName: string | null = folder?.name ?? null;
    const folderIsPublic: boolean = folder?.isPublic ?? false;
    const folderIsShared: boolean = folder?.isShared ?? false;
    const folderSharedWith: UserInfo[] = folder?.sharedWith ?? [];
    const folderLicenseCode: LicenseCode | null = folder?.license?.code ?? null;
    const parentFolderId: string | null = folder?.parentFolder?.id ?? null;
    const contentFromApi: ContentStructure[] = data.content;

    const content = contentFromApi
      .map((item) => {
        return {
          isFolder: Boolean(item.isFolder),
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

    setActiveView({
      folderId: newActiveFolderId,
      folderName,
      folderIsPublic,
      folderIsShared,
      folderSharedWith,
      folderLicenseCode,
      parentFolderId,
      contents: content,
    });

    if (modalJustOpened) {
      const { name: movableContentName } = content.find(
        (item) => item.id === id,
      )!;
      setContentName(movableContentName);
      setParentId(currentParentId);
    }
  }

  const initialRef = React.useRef<HTMLButtonElement>(null);

  const fetcher = useFetcher();

  return (
    <>
      <MoveToSharedAlert
        isOpen={sharedAlertIsOpen}
        onClose={sharedAlertOnClose}
        performMove={performMove}
        folderName={activeView.folderName}
        contentIsPublic={isPublic}
        licenseChange={licenseCode !== activeView.folderLicenseCode}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        initialFocusRef={initialRef}
        finalFocusRef={finalFocusRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading noOfLines={1}>Move {contentName} to folder:</Heading>
            <HStack>
              {activeView.folderId ? (
                <>
                  <IconButton
                    icon={<ArrowBackIcon />}
                    aria-label="Back"
                    onClick={() => updateActiveView(activeView.parentFolderId)}
                  />
                  <Text noOfLines={1}>{activeView.folderName}</Text>
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
                    leftIcon={
                      content.isFolder ? (
                        <MdFolder />
                      ) : (
                        <MdOutlineInsertDriveFile />
                      )
                    }
                    onClick={() => {
                      if (content.isFolder && content.id !== id)
                        updateActiveView(content.id);
                    }}
                    isDisabled={!content.isFolder || content.id === id}
                  >
                    <Text width="100%" textAlign="left" noOfLines={1}>
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
              width="10em"
              // Is disabled if the content is already in this folder
              isDisabled={
                (activeView.folderId === null && parentId === null) ||
                (activeView.folderId !== null &&
                  parentId !== null &&
                  activeView.folderId === parentId)
              }
              onClick={() => {
                if (
                  (activeView.folderIsPublic &&
                    (!isPublic ||
                      licenseCode !== activeView.folderLicenseCode)) ||
                  (activeView.folderIsShared &&
                    (!isShared ||
                      activeView.folderSharedWith.some(
                        (folderUser) =>
                          sharedWith.findIndex(
                            (u) => u.userId === folderUser.userId,
                          ) === -1,
                      ) ||
                      licenseCode !== activeView.folderLicenseCode))
                ) {
                  sharedAlertOnOpen();
                } else {
                  performMove();
                }
              }}
            >
              <Text noOfLines={1}>
                Move to {activeView.folderName ?? "My Activities"}
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );

  function performMove() {
    fetcher.submit(
      {
        _action: "Move to folder",
        id,
        folderId: activeView.folderId,
        desiredPosition: activeView.contents.length, // place it as the last item
      },
      { method: "post" },
    );
    onClose();
  }
}
