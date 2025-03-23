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
  Content,
  ContentType,
  LicenseCode,
  UserInfo,
} from "../../../_utils/types";
import { contentTypeToName, getIconInfo } from "../../../_utils/activity";

type ActiveView = {
  // If parentName and parentId are null, the active view is the root
  // If grandparentId is null, then the parent of active view is the root
  parentId: string | null;
  parentName: string | null;
  parentType: ContentType;
  parentIsPublic: boolean;
  parentIsShared: boolean;
  parentSharedWith: UserInfo[];
  parentLicenseCode: LicenseCode | null;
  grandparentId: string | null;
  grandparentType: ContentType;
  contents: {
    type: ContentType;
    canOpen: boolean;
    name: string;
    contentId: string;
  }[];
};

export async function moveCopyContentActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj?._action == "Move or copy") {
    try {
      const contentIds = JSON.parse(formObj.contentIds);
      let numItems = contentIds.length;
      if (formObj.action === "Move") {
        if (contentIds.length === 1) {
          await axios.post(`/api/copyMove/moveContent`, {
            contentId: contentIds[0],
            parentId: formObj.parentId === "null" ? null : formObj.parentId,
            desiredPosition: Number(formObj.desiredPosition),
          });
        } else {
          throw Error("Have not implemented moving more than one content");
        }
      } else {
        const { data } = await axios.post(`/api/copyMove/copyContent`, {
          contentIds,
          parentId: formObj.parentId === "null" ? null : formObj.parentId,
        });
        numItems = data.newContentIds?.length;
      }
      return { success: true, numItems };
    } catch (e) {
      let message = "An error occurred";
      if (e.response?.data?.error) {
        message += `: ${e.response.data.error}`;
        if (e.response.data.details) {
          message += `: ${e.response.data.details}`;
        }
      }
      return {
        success: false,
        message,
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
  inCurationLibrary = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  sourceContent: {
    contentId: string;
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
  action: "Move" | "Add" | "Copy";
  inCurationLibrary?: boolean;
}) {
  // Set when the modal opens
  const [parentId, setParentId] = useState<string | null>(null);
  const [contentName, setContentName] = useState<string>("");

  const [actionFinished, setActionFinished] = useState(false);
  const [numItems, setNumItems] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const actionPastWord =
    action === "Add" ? "added" : action === "Move" ? "moved" : "copied";

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

  // Set whenever the user navigates to another parent
  const [activeView, setActiveView] = useState<ActiveView>({
    parentName: null,
    parentType: "folder",
    parentIsPublic: false,
    parentIsShared: false,
    parentSharedWith: [],
    parentLicenseCode: null,
    parentId: null,
    grandparentId: null,
    grandparentType: "folder",
    contents: [],
  });

  async function updateActiveView(
    newActiveParentId: string | null,
    modalJustOpened: boolean = false,
  ) {
    const { data } = inCurationLibrary
      ? await axios.get(
          `/api/curate/getCurationFolderContent/${newActiveParentId ?? ""}`,
        )
      : await axios.get(
          `/api/contentList/getMyContent/${userId}/${newActiveParentId ?? ""}`,
        );

    const parent: Content | null = data.parent;
    const parentName: string | null = parent?.name ?? null;
    const parentType: ContentType = parent?.type ?? "folder";
    const parentIsPublic: boolean = parent?.isPublic ?? false;
    const parentIsShared: boolean = parent?.isShared ?? false;
    const parentSharedWith: UserInfo[] = parent?.sharedWith ?? [];
    const parentLicenseCode: LicenseCode | null = parent?.license?.code ?? null;
    const grandparentId: string | null = parent?.parent?.contentId ?? null;
    const grandparentType: ContentType = parent?.parent?.type ?? "folder";
    const contentFromApi: Content[] = data.content;

    const content: {
      type: ContentType;
      canOpen: boolean;
      name: string;
      contentId: string;
    }[] = [];

    for (const item of contentFromApi) {
      let canOpen = false;
      if (allowedParentTypes.includes(item.type)) {
        if (
          (item.assignmentInfo?.assignmentStatus ?? "Unassigned") ===
          "Unassigned"
        ) {
          canOpen = true;
        }
      } else if (
        (item.type === "folder" ||
          (item.type === "sequence" &&
            allowedParentTypes.includes("select"))) &&
        (item.assignmentInfo?.assignmentStatus ?? "Unassigned") === "Unassigned"
      ) {
        // if items is a folder or item is a sequence and we are looking for a select,
        // then it is possible that a descendant is of allowed parent type.
        // Check for that possibility
        for (const ct of allowedParentTypes) {
          const { data: containsData } = await axios.get(
            `/api/copyMove/checkIfContentContains`,
            { params: { contentId: item.contentId, contentType: ct } },
          );

          if (containsData.containsType) {
            canOpen = true;
            break;
          }
        }
      }
      content.push({
        type: item.type,
        canOpen,
        name: item.name,
        contentId: item.contentId,
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
      parentId: newActiveParentId,
      parentName,
      parentType,
      parentIsPublic,
      parentIsShared,
      parentSharedWith,
      parentLicenseCode,
      grandparentId,
      grandparentType,
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
        <Text as="i" data-test="Empty Message">
          This item is empty.
        </Text>
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
              data-test="Select Item Option"
              key={`moveContentItem${content.contentId}`}
              variant="outline"
              width="500px"
              height="2em"
              leftIcon={icon}
              onClick={() => {
                if (
                  content.type !== "singleDoc" &&
                  sourceContent.every((c) => c.contentId !== content.contentId)
                )
                  updateActiveView(content.contentId);
              }}
              isDisabled={
                sourceContent.some((c) => c.contentId === content.contentId) ||
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
      <Button
        ref={initialRef}
        mr={3}
        onClick={onClose}
        data-test="Cancel Button"
      >
        Cancel
      </Button>
      <Button
        data-test="Execute MoveCopy Button"
        width="10em"
        // Is disabled if the content is already in this parent
        isDisabled={
          (activeView.parentId === null && parentId === null) ||
          (activeView.parentId !== null &&
            parentId !== null &&
            activeView.parentId === parentId) ||
          !allowedParentTypes.includes(activeView.parentType)
        }
        onClick={() => {
          if (
            action === "Move" &&
            ((activeView.parentIsPublic &&
              !sourceContent.every((c) => c.isPublic)) ||
              (activeView.parentIsShared &&
                (!sourceContent.every((c) => c.isShared) ||
                  activeView.parentSharedWith.some((parentUser) =>
                    sourceContent.some(
                      (c) =>
                        !c.sharedWith ||
                        c.sharedWith.findIndex(
                          (u) => u.userId === parentUser.userId,
                        ) === -1,
                    ),
                  ))))
          ) {
            // moving non-public content into a public parent
            // or moving moving content into a parent that is shared with additional users
            sharedAlertOnOpen();
          } else {
            performAction();
          }
        }}
      >
        <Text noOfLines={1}>
          {action} to{" "}
          <em>
            {activeView.parentName ??
              (inCurationLibrary ? "Curation" : "My Activities")}
          </em>
        </Text>
      </Button>
    </>
  );

  let destinationDescription: ReactElement;
  let destinationAction: string;
  let destinationUrl: string;

  if (activeView.parentId) {
    const typeName = contentTypeToName[activeView.parentType].toLowerCase();
    destinationDescription = (
      <>
        <strong>{activeView.parentName}</strong>
      </>
    );
    if (activeView.parentType === "folder") {
      destinationAction = "Go to folder";

      if (inCurationLibrary) {
        destinationUrl = `/curation/${activeView.parentId}`;
      } else {
        destinationUrl = `/activities/${userId}/${activeView.parentId}`;
      }
    } else if (
      activeView.parentType === "select" &&
      activeView.grandparentType === "sequence"
    ) {
      // if we have a Question Bank whose parent is a Problem Set,
      // then we don't display the Question Bank by itself, just embedded in the Problem Set
      destinationAction = `Open containing problem set`;
      destinationUrl = `/activityEditor/${activeView.grandparentId}`;
    } else {
      destinationAction = `Open ${typeName}`;
      destinationUrl = `/activityEditor/${activeView.parentId}`;
    }
  } else if (inCurationLibrary) {
    destinationDescription = <>Curation</>;
    destinationAction = "Go to Curation";
    destinationUrl = `/curation`;
  } else {
    destinationDescription = <>My Activities</>;
    destinationAction = "Go to My Activities";
    destinationUrl = `/activities/${userId}`;
  }

  return (
    <>
      <MoveToSharedAlert
        isOpen={sharedAlertIsOpen}
        onClose={sharedAlertOnClose}
        performMove={performAction}
        parentName={activeView.parentName}
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
            <Heading textAlign="center" data-test="MoveCopy Heading 1">
              {action}{" "}
              {allowedParentTypes.length === 1
                ? `to ${contentTypeToName[allowedParentTypes[0]].toLowerCase()}`
                : null}
            </Heading>
            <Heading
              size="me"
              textAlign="center"
              data-test="MoveCopy Heading 2"
            >
              <em>{contentName}</em>
            </Heading>
            <HStack hidden={actionFinished || errMsg !== ""}>
              {activeView.parentId ? (
                <>
                  <IconButton
                    data-test="Back Arrow"
                    icon={<ArrowBackIcon />}
                    aria-label="Back"
                    onClick={() => updateActiveView(activeView.grandparentId)}
                  />
                  <Text noOfLines={1} data-test="Current destination">
                    {activeView.parentName}
                  </Text>
                </>
              ) : (
                <Text data-test="Current destination">
                  {inCurationLibrary ? "Curation" : "My Activities"}
                </Text>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody data-test="MoveCopy Body">
            {errMsg ? (
              errMsg
            ) : actionFinished ? (
              <>
                {`${numItems} item${numItems > 1 ? "s" : ""}`} {actionPastWord}{" "}
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
                  data-test="Go to Destination"
                  marginRight="4px"
                  onClick={() => {
                    onClose();
                    navigate(destinationUrl);
                  }}
                >
                  {destinationAction}
                </Button>
                <Button
                  ref={initialRef}
                  mr={3}
                  onClick={onClose}
                  data-test="Close Button"
                >
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
        contentIds: JSON.stringify(sourceContent.map((sc) => sc.contentId)),
        parentId: activeView.parentId,
        desiredPosition: activeView.contents.length, // place it as the last item
        action,
      },
      { method: "post" },
    );
  }
}
