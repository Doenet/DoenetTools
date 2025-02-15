import React, { ReactElement, RefObject, useEffect, useState } from "react";
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
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useFetcher, useNavigate } from "react-router";
import MoveToSharedAlert from "./MoveToSharedAlert";
import {
  ContentStructure,
  ContentType,
  LicenseCode,
  UserInfo,
} from "../../../_utils/types";
import { contentTypeToName, getIconInfo } from "../../../_utils/activity";

type ActiveView = {
  // If folder name and id are null, the active view is the root
  // If parentId is null, then the parent of active view is the root
  folderId: string | null;
  folderName: string | null;
  folderType: ContentType;
  folderIsPublic: boolean;
  folderIsShared: boolean;
  folderSharedWith: UserInfo[];
  folderLicenseCode: LicenseCode | null;
  parentId: string | null;
  contents: {
    type: ContentType;
    canOpen: boolean;
    name: string;
    id: string;
  }[];
};

export async function moveCopyContentActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj?._action == "Move or copy") {
    try {
      const sourceContent = JSON.parse(formObj.sourceContent);
      let numItems = sourceContent.length;
      if (formObj.action === "Add") {
        const { data } = await axios.post(`/api/copyContent`, {
          sourceContent: sourceContent.map((c) => ({
            contentId: c.id,
            type: c.type,
          })),
          desiredParentId:
            formObj.folderId === "null" ? null : formObj.folderId,
        });
        numItems = data.newContentIds?.length;
      } else {
        if (sourceContent.length === 1) {
          await axios.post(`/api/moveContent`, {
            id: sourceContent[0].id,
            desiredParentId:
              formObj.folderId === "null" ? null : formObj.folderId,
            desiredPosition: formObj.desiredPosition,
          });
        } else {
          throw Error("Have not implemented moving more than one content");
        }
      }
      return { success: true, numItems };
    } catch (e) {
      return {
        success: false,
        message: "An error occurred" + ("message" in e ? `: ${e.message}` : ""),
      };
    }
  }

  return null;
}

export function MoveCopyContent({
  isOpen,
  onClose,
  sourceContent,
  userId,
  currentParentId,
  finalFocusRef,
  allowedParentTypes,
  action,
}: {
  isOpen: boolean;
  onClose: () => void;
  sourceContent: {
    id: string;
    name: string;
    type: ContentType;
    isPublic?: boolean;
    isShared?: boolean;
    sharedWith?: UserInfo[];
  }[];
  userId: string;
  currentParentId: string | null;
  finalFocusRef?: RefObject<HTMLElement>;
  allowedParentTypes: ContentType[];
  action: "Move" | "Add";
}) {
  // Set when the modal opens
  const [parentId, setParentId] = useState<string | null>(null);
  const [contentName, setContentName] = useState<string>("");

  const [actionFinished, setActionFinished] = useState(false);
  const [numItems, setNumItems] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const actionPastWord = action === "Add" ? "added" : "moved";

  const {
    isOpen: sharedAlertIsOpen,
    onOpen: sharedAlertOnOpen,
    onClose: sharedAlertOnClose,
  } = useDisclosure();

  useEffect(() => {
    if (isOpen) {
      updateActiveView(currentParentId, true);
    }
    setActionFinished(false);
    setErrMsg("");
  }, [isOpen]);

  // Set whenever the user navigates to another folder
  const [activeView, setActiveView] = useState<ActiveView>({
    folderName: null,
    folderType: "folder",
    folderIsPublic: false,
    folderIsShared: false,
    folderSharedWith: [],
    folderLicenseCode: null,
    folderId: null,
    parentId: null,
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
    const folderType: ContentType = folder?.type ?? "folder";
    const folderIsPublic: boolean = folder?.isPublic ?? false;
    const folderIsShared: boolean = folder?.isShared ?? false;
    const folderSharedWith: UserInfo[] = folder?.sharedWith ?? [];
    const folderLicenseCode: LicenseCode | null = folder?.license?.code ?? null;
    const parentId: string | null = folder?.parent?.id ?? null;
    const contentFromApi: ContentStructure[] = data.content;

    const content: {
      type: ContentType;
      canOpen: boolean;
      name: string;
      id: string;
    }[] = [];

    for (const item of contentFromApi) {
      let canOpen = false;
      if (allowedParentTypes.includes(item.type)) {
        canOpen = true;
      } else if (
        item.type === "folder" ||
        (item.type === "sequence" && allowedParentTypes.includes("select"))
      ) {
        // if items is a folder or item is a sequence and we are looking for a select,
        // then it is possible that a descendant is of allowed parent type.
        // Check for that possibility
        for (const ct of allowedParentTypes) {
          const { data: containsFolderData } = await axios.get(
            `/api/checkIfFolderContains`,
            { params: { folderId: item.id, contentType: ct } },
          );

          if (containsFolderData.containsType) {
            canOpen = true;
            break;
          }
        }
      }
      content.push({
        type: item.type,
        canOpen,
        name: item.name,
        id: item.id,
      });
    }

    content.sort((a, b) => {
      if (a.type !== "singleDoc" && b.type === "singleDoc") {
        return -1;
      } else if (b.type !== "singleDoc" && a.type === "singleDoc") {
        return 1;
      } else {
        return 0;
      }
    });

    setActiveView({
      folderId: newActiveFolderId,
      folderName,
      folderType,
      folderIsPublic,
      folderIsShared,
      folderSharedWith,
      folderLicenseCode,
      parentId,
      contents: content,
    });

    if (modalJustOpened) {
      if (sourceContent.length === 1) {
        setContentName(sourceContent[0].name);
      } else {
        setContentName(`${sourceContent.length} items`);
      }
      setParentId(currentParentId);
    }
  }

  const initialRef = React.useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success === true) {
        setActionFinished(true);
        setNumItems(fetcher.data.numItems);
      } else if (fetcher.data.success === false) {
        setErrMsg(fetcher.data.message);
      }
    }
  }, [fetcher.data]);

  const optionList = (
    <SimpleGrid columns={1} spacing={0}>
      {activeView.contents.length === 0 ? (
        <Text as="i">This folder is empty.</Text>
      ) : (
        activeView.contents.map((content) => {
          const { iconImage, iconColor } = getIconInfo(content.type);
          const icon = (
            <Icon
              as={iconImage}
              color={iconColor}
              aria-label={contentTypeToName[content.type]}
            />
          );

          return (
            <Button
              key={`moveContentItem${content.id}`}
              variant="outline"
              width="500px"
              height="2em"
              leftIcon={icon}
              onClick={() => {
                if (
                  content.type !== "singleDoc" &&
                  sourceContent.every((c) => c.id !== content.id)
                )
                  updateActiveView(content.id);
              }}
              isDisabled={
                sourceContent.some((c) => c.id === content.id) ||
                !content.canOpen
              }
            >
              <Text width="100%" textAlign="left" noOfLines={1}>
                {content.name}
              </Text>
            </Button>
          );
        })
      )}
    </SimpleGrid>
  );

  const executeButtons = (
    <>
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
            activeView.folderId === parentId) ||
          !allowedParentTypes.includes(activeView.folderType)
        }
        onClick={() => {
          if (
            action === "Move" &&
            ((activeView.folderIsPublic &&
              !sourceContent.every((c) => c.isPublic)) ||
              (activeView.folderIsShared &&
                (!sourceContent.every((c) => c.isShared) ||
                  activeView.folderSharedWith.some((folderUser) =>
                    sourceContent.some(
                      (c) =>
                        !c.sharedWith ||
                        c.sharedWith.findIndex(
                          (u) => u.userId === folderUser.userId,
                        ) === -1,
                    ),
                  ))))
          ) {
            sharedAlertOnOpen();
          } else {
            performAction();
          }
        }}
      >
        <Text noOfLines={1}>
          {action} to <em>{activeView.folderName ?? "My Activities"}</em>
        </Text>
      </Button>
    </>
  );

  let destinationDescription: ReactElement;
  let destinationAction: string;
  let destinationUrl: string;

  if (activeView.folderId) {
    const typeName = contentTypeToName[activeView.folderType].toLowerCase();
    destinationDescription = (
      <>
        <strong>{activeView.folderName}</strong>
      </>
    );
    if (activeView.folderType === "folder") {
      destinationAction = "Go to folder";
      destinationUrl = `/activities/${userId}/${activeView.folderId}`;
    } else {
      destinationAction = `Open ${typeName}`;
      destinationUrl = `/activityEditor/${activeView.folderId}`;
    }
  } else {
    destinationDescription = <>your Activities</>;
    destinationAction = "Go to Activities";
    destinationUrl = `/activities/${userId}`;
  }

  return (
    <>
      <MoveToSharedAlert
        isOpen={sharedAlertIsOpen}
        onClose={sharedAlertOnClose}
        performMove={performAction}
        folderName={activeView.folderName}
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
            <Heading textAlign="center">
              {action}{" "}
              {allowedParentTypes.length === 1
                ? `to ${contentTypeToName[allowedParentTypes[0]].toLowerCase()}`
                : null}
            </Heading>
            <Heading size="me" textAlign="center">
              <em>{contentName}</em>
            </Heading>
            <HStack hidden={actionFinished || errMsg !== ""}>
              {activeView.folderId ? (
                <>
                  <IconButton
                    icon={<ArrowBackIcon />}
                    aria-label="Back"
                    onClick={() => updateActiveView(activeView.parentId)}
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
            {errMsg ? (
              errMsg
            ) : actionFinished ? (
              <>
                {`${numItems} item${numItems > 0 ? "s" : ""}`} {actionPastWord}{" "}
                to: {destinationDescription}
              </>
            ) : (
              optionList
            )}
          </ModalBody>

          <ModalFooter>
            {errMsg ? (
              <Button ref={initialRef} mr={3} onClick={onClose}>
                Close
              </Button>
            ) : actionFinished ? (
              <>
                <Button
                  data-test="Go to Activities"
                  marginRight="4px"
                  onClick={() => {
                    navigate(destinationUrl);
                  }}
                >
                  {destinationAction}
                </Button>
                <Button ref={initialRef} mr={3} onClick={onClose}>
                  Close
                </Button>
              </>
            ) : (
              executeButtons
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );

  function performAction() {
    fetcher.submit(
      {
        _action: "Move or copy",
        sourceContent: JSON.stringify(sourceContent),
        folderId: activeView.folderId,
        desiredPosition: activeView.contents.length, // place it as the last item
        action,
      },
      { method: "post" },
    );
  }
}
