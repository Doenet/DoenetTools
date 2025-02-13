import React, { useEffect, useRef, useState } from "react";
import {
  AssignmentStatus,
  ContentStructure,
  LicenseCode,
  UserInfo,
} from "../../../_utils/types";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { CardContent } from "../../../Widgets/Card";
import {
  FetcherWithComponents,
  redirect,
  useOutletContext,
} from "react-router";
import MoveContentToFolder, { moveContentActions } from "./MoveContentToFolder";
import { User } from "../Paths/SiteHeader";
import CardList from "../../../Widgets/CardList";
import axios from "axios";
import { ActivitySource } from "../../../_utils/viewerTypes";
import { ActivityViewer } from "@doenet/assignment-viewer";
import { contentTypeToName } from "../../../_utils/activity";

export async function nestedActivityEditorActions(
  {
    formObj,
  }: {
    [k: string]: any;
  },
  {
    params,
  }: {
    [k: string]: any;
  },
) {
  const resultMC = await moveContentActions({ formObj });
  if (resultMC) {
    return resultMC;
  }

  if (formObj?._action == "Add Activity") {
    //Create an activity and redirect to the editor for it
    const { data } = await axios.post(
      `/api/createActivity/${params.activityId}`,
      { type: formObj.type },
    );

    const { activityId } = data;

    if (formObj.type === "singleDoc") {
      return redirect(`/activityEditor/${activityId}`);
    } else {
      return true;
    }
  } else if (formObj?._action == "Delete Activity") {
    await axios.post(`/api/deleteActivity`, {
      activityId: formObj.id,
    });

    return true;
  } else if (formObj?._action == "Delete Folder") {
    await axios.post(`/api/deleteFolder`, {
      folderId: formObj.id,
    });

    return true;
  } else if (formObj?._action == "Duplicate Activity") {
    await axios.post(`/api/duplicateActivity`, {
      activityId: formObj.id,
      desiredParentId: formObj.folderId,
    });
    return true;
  } else if (formObj?._action == "Move") {
    await axios.post(`/api/moveContent`, {
      id: formObj.id,
      desiredParentId: formObj.folderId === "null" ? null : formObj.folderId,
      desiredPosition: formObj.desiredPosition,
    });
    return true;
  }

  return null;
}

export function NestedActivityEditor({
  activity,
  activityJson,
  assignmentStatus,
  mode,
  fetcher,
  setSettingsContentId,
  settingsOnOpen,
  sharingOnOpen,
  finalFocusRef,
  setSettingsDisplayTab,
  setHighlightRename,
}: {
  activity: ContentStructure;
  activityJson: ActivitySource;
  assignmentStatus: AssignmentStatus;
  mode: "Edit" | "View";
  fetcher: FetcherWithComponents<any>;
  setSettingsContentId: (value: React.SetStateAction<string | null>) => void;
  settingsOnOpen: () => void;
  sharingOnOpen: () => void;
  finalFocusRef: React.MutableRefObject<HTMLElement | null>;
  setSettingsDisplayTab: (arg: "general") => void;
  setHighlightRename: (arg: boolean) => void;
}) {
  const contentTypeName = contentTypeToName[activity.type];

  // refs to the menu button of each content card,
  // which should be given focus when drawers are closed
  const cardMenuRefs = useRef<HTMLButtonElement[]>([]);

  const readOnly = assignmentStatus !== "Unassigned";

  const user = useOutletContext<User>();

  const [haveContentSpinner, setHaveContentSpinner] = useState(false);

  useEffect(() => {
    setHaveContentSpinner(false);
  }, [activity]);

  const [moveToFolderData, setMoveToFolderData] = useState<{
    id: string;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
    licenseCode: LicenseCode | null;
  }>({
    id: "",
    isPublic: false,
    isShared: false,
    sharedWith: [],
    licenseCode: null,
  });

  const {
    isOpen: moveToFolderIsOpen,
    onOpen: moveToFolderOnOpen,
    onClose: moveToFolderOnClose,
  } = useDisclosure();

  const moveContentModal = (
    <MoveContentToFolder
      isOpen={moveToFolderIsOpen}
      onClose={moveToFolderOnClose}
      id={moveToFolderData.id}
      isPublic={moveToFolderData.isPublic}
      isShared={moveToFolderData.isShared}
      sharedWith={moveToFolderData.sharedWith}
      licenseCode={moveToFolderData.licenseCode}
      userId={user!.userId}
      currentParentId={activity.id}
      finalFocusRef={finalFocusRef}
    />
  );

  function countCards(content: ContentStructure, init = true): number {
    const childCounts = content.children.reduce(
      (a, c) => a + countCards(c, false),
      0,
    );

    if (init) {
      // don't count the initial activity
      return childCounts;
    } else if (content.type === "select" || content.type === "sequence") {
      // for non-initial select and sequence, count the activity and the blank after them
      return childCounts + 2;
    } else {
      // otherwise, count the activity
      return childCounts + 1;
    }
  }

  const numCards = countCards(activity);

  let idx = 0;

  function createCardContent(
    content: ContentStructure,
    indentLevel = -1,
    positionInParent = 0,
    parentInfo?: {
      id: string;
      parent?: string;
      positionInParent: number;
      children: ContentStructure[];
    },
  ) {
    const getCardMenuRef = (element: HTMLButtonElement) => {
      cardMenuRefs.current[idx] = element;
    };

    const cards: (
      | CardContent
      | {
          cardType: "afterParent";
          parentId: string;
          indentLevel: number;
          empty: boolean;
        }
    )[] = [];

    // skip the first activity, which doesn't have parent info
    if (parentInfo) {
      let nextPositionUp: { parent: string; position: number } | null;
      let nextPositionDown: { parent: string; position: number } | null;

      if (positionInParent > 0) {
        // Not first in parent.
        // If previous sibling is a single doc, take its position.
        // Either become the last child of sibling
        const previousSibling = parentInfo.children[positionInParent - 1];
        if (previousSibling.type === "singleDoc") {
          nextPositionUp = {
            parent: parentInfo.id,
            position: positionInParent - 1,
          };
        } else {
          nextPositionUp = {
            parent: previousSibling.id,
            position: previousSibling.children.length,
          };
        }
      } else if (idx === 0) {
        // no position up
        nextPositionUp = null;
      } else {
        // first in parent, so position up is parent's position
        nextPositionUp = {
          parent: parentInfo.parent!,
          position: parentInfo.positionInParent,
        };
      }

      if (positionInParent < parentInfo.children.length - 1) {
        // Not last in parent.
        // If next sibling is a single doc, take its position.
        // Either become the first child of sibling
        const nextSibling = parentInfo.children[positionInParent + 1];
        if (nextSibling.type === "singleDoc") {
          nextPositionDown = {
            parent: parentInfo.id,
            position: positionInParent + 1,
          };
        } else {
          nextPositionDown = {
            parent: nextSibling.id,
            position: 0,
          };
        }
      } else if (parentInfo.parent) {
        // last in parent, so position down is position after parent
        nextPositionDown = {
          parent: parentInfo.parent!,
          position: parentInfo.positionInParent + 1,
        };
      } else {
        // last in parent of initial
        nextPositionDown = null;
      }

      cards.push({
        menuRef: getCardMenuRef,
        content: content,
        menuItems: getCardMenuList({
          id: content.id,
          content: content,
          nextPositionUp,
          nextPositionDown,
        }),
        cardLink:
          content.type === "singleDoc"
            ? `/activityEditor/${content.id}`
            : undefined,
        indentLevel,
      });

      idx++;
    }

    cards.push(
      ...content.children.flatMap((c, i) =>
        createCardContent(c, indentLevel + 1, i, {
          id: content.id,
          parent: content.parent?.id,
          positionInParent,
          children: content.children,
        }),
      ),
    );

    if (
      parentInfo &&
      (content.type === "select" || content.type === "sequence")
    ) {
      idx++;
      cards.push({
        cardType: "afterParent",
        parentId: content.id,
        indentLevel: indentLevel + 1,
        empty: content.children.length === 0,
      });
    }

    return cards;
  }

  const cardContent = createCardContent(activity);

  function getCardMenuList({
    id,
    content,
    nextPositionUp,
    nextPositionDown,
  }: {
    id: string;
    content: ContentStructure;
    nextPositionUp: { parent: string; position: number } | null;
    nextPositionDown: { parent: string; position: number } | null;
  }) {
    return (
      <>
        <MenuItem
          data-test="Rename Menu Item"
          onClick={() => {
            setSettingsContentId(id);
            setSettingsDisplayTab("general");
            setHighlightRename(true);
            settingsOnOpen();
          }}
        >
          Rename
        </MenuItem>
        {!content.isFolder ? (
          <>
            <MenuItem
              data-test={"Duplicate Activity"}
              onClick={() => {
                fetcher.submit(
                  {
                    _action: "Duplicate Activity",
                    id,
                    folderId: activity.id,
                  },
                  { method: "post" },
                );
              }}
            >
              Duplicate Activity
            </MenuItem>
          </>
        ) : null}
        {nextPositionUp ? (
          <MenuItem
            data-test="Move Up Menu Item"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "Move",
                  id,
                  desiredPosition: nextPositionUp.position,
                  folderId: nextPositionUp.parent,
                },
                { method: "post" },
              );
            }}
          >
            Move Up
          </MenuItem>
        ) : null}
        {nextPositionDown ? (
          <MenuItem
            data-test="Move Down Menu Item"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "Move",
                  id,
                  desiredPosition: nextPositionDown.position,
                  folderId: nextPositionDown.parent,
                },
                { method: "post" },
              );
            }}
          >
            Move Down
          </MenuItem>
        ) : null}
        <MenuItem
          data-test="Move to Folder"
          onClick={() => {
            setMoveToFolderData({
              id,
              isPublic: content.isPublic,
              isShared: content.isShared,
              sharedWith: content.sharedWith,
              licenseCode: content.license?.code ?? null,
            });
            moveToFolderOnOpen();
          }}
        >
          Move to Folder
        </MenuItem>
        <MenuItem
          data-test="Delete Menu Item"
          onClick={() => {
            fetcher.submit(
              { _action: "Delete Activity", id },
              { method: "post" },
            );
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          data-test="Share Menu Item"
          onClick={() => {
            setSettingsContentId(content.id);
            sharingOnOpen();
          }}
        >
          Share
        </MenuItem>
        <MenuItem
          data-test="Settings Menu Item"
          onClick={() => {
            setSettingsDisplayTab("general");
            setSettingsContentId(content.id);
            setHighlightRename(false);
            settingsOnOpen();
          }}
        >
          Settings
        </MenuItem>
      </>
    );
  }

  const cardList = (
    <CardList
      showOwnerName={false}
      showAssignmentStatus={true}
      showPublicStatus={true}
      showActivityFeatures={true}
      emptyMessage={`${contentTypeName} is empty. Add or move documents ${activity.type === "sequence" ? "or question banks " : null}here to begin.`}
      listView={true}
      content={cardContent}
    />
  );

  const viewer = (
    <ActivityViewer
      source={activityJson}
      requestedVariantIndex={1}
      userId={"hi"}
      linkSettings={{ viewUrl: "", editURL: "" }}
      paginate={activity.paginate}
      activityLevelAttempts={activity.activityLevelAttempts}
      itemLevelAttempts={activity.itemLevelAttempts}
      showTitle={false}
    />
  );

  const heading = (
    <Flex
      backgroundColor="#fff"
      color="#000"
      height="40px"
      width="100%"
      textAlign="center"
      paddingRight="10px"
    >
      <Spacer />
      <Menu>
        <MenuButton
          as={Button}
          size="sm"
          colorScheme="blue"
          data-test="New Button"
        >
          {haveContentSpinner ? <Spinner size="sm" /> : "Add"}
        </MenuButton>
        <MenuList>
          <MenuItem
            data-test="Add Document Button"
            onClick={async () => {
              setHaveContentSpinner(true);
              fetcher.submit(
                { _action: "Add Activity", type: "singleDoc" },
                { method: "post" },
              );
            }}
          >
            Blank Document
          </MenuItem>
          {activity.type === "sequence" ? (
            <MenuItem
              data-test="Add Question Bank Button"
              onClick={async () => {
                setHaveContentSpinner(true);
                fetcher.submit(
                  { _action: "Add Activity", type: "select" },
                  { method: "post" },
                );
              }}
            >
              Empty Question Bank
            </MenuItem>
          ) : null}
        </MenuList>
      </Menu>
    </Flex>
  );

  return (
    <>
      {moveContentModal}
      {mode === "Edit" ? (
        <>
          {heading}
          <Flex
            data-test="Activities"
            padding="0 10px"
            margin="0px"
            width="100%"
            background={numCards > 0 ? "white" : "var(--lightBlue)"}
            minHeight="calc(100vh - 120px)"
            direction="column"
          >
            {cardList}
          </Flex>
        </>
      ) : null}
      {mode === "View" ? (
        <Grid
          width="100%"
          height={`calc(100vh - ${readOnly ? 120 : 80}px)`}
          templateAreas={`"leftGutter viewer rightGutter"`}
          templateColumns={`1fr minmax(300px,850px) 1fr`}
          overflow="hidden"
        >
          <GridItem
            area="leftGutter"
            background="doenet.lightBlue"
            width="100%"
            paddingTop="10px"
            alignSelf="start"
          ></GridItem>
          <GridItem
            area="rightGutter"
            background="doenet.lightBlue"
            width="100%"
            paddingTop="10px"
            alignSelf="start"
          />
          <GridItem
            area="viewer"
            width="100%"
            placeSelf="center"
            minHeight="100%"
            maxWidth="850px"
            overflow="hidden"
          >
            <Box
              h={`calc(100vh - ${readOnly ? 120 : 80}px)`}
              background="var(--canvas)"
              borderWidth="1px"
              borderStyle="solid"
              borderColor="doenet.mediumGray"
              padding="0px 0px 20px 0px"
              flexGrow={1}
              overflowY="scroll"
              w="100%"
              id="viewer-container"
            >
              {viewer}
            </Box>
          </GridItem>
        </Grid>
      ) : null}
    </>
  );
}
