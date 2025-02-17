import React, { useEffect, useRef, useState } from "react";
import {
  AssignmentStatus,
  ContentDescription,
  ContentStructure,
  ContentType,
  LicenseCode,
  UserInfo,
} from "../../../_utils/types";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Grid,
  GridItem,
  Hide,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { CardContent } from "../../../Widgets/Card";
import {
  FetcherWithComponents,
  Link,
  redirect,
  useNavigate,
  useOutletContext,
} from "react-router";
import { MoveCopyContent, moveCopyContentActions } from "./MoveCopyContent";
import { SiteContext } from "../Paths/SiteHeader";
import CardList from "../../../Widgets/CardList";
import axios from "axios";
import { ActivitySource } from "../../../_utils/viewerTypes";
import { ActivityViewer } from "@doenet/assignment-viewer";
import {
  contentTypeToName,
  getAllowedParentTypes,
  menuIcons,
} from "../../../_utils/activity";
import { CopyContentAndReportFinish } from "./CopyContentAndReportFinish";
import { CreateContentMenu } from "./CreateContentMenu";
import { AddContentToMenu } from "./AddContentToMenu";
import { DeleteModal, deleteModalActions } from "./DeleteModal";

export async function compoundActivityEditorActions(
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
  const resultMC = await moveCopyContentActions({ formObj });
  if (resultMC) {
    return resultMC;
  }

  const resultDM = await deleteModalActions({ formObj });
  if (resultDM) {
    return resultDM;
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
  } else if (formObj?._action == "Duplicate Content") {
    await axios.post(`/api/copyContent`, {
      sourceContent: [{ contentId: formObj.id, type: formObj.contentType }],
      desiredParentId: formObj.folderId === "null" ? null : formObj.folderId,
      prependCopy: true,
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

export function CompoundActivityEditor({
  activity,
  activityJson,
  assignmentStatus = "Unassigned",
  asViewer,
  mode,
  fetcher,
  setSettingsContentId,
  settingsOnOpen,
  sharingOnOpen,
  finalFocusRef,
  setSettingsDisplayTab,
  setHighlightRename,
  headerHeight,
  addTo,
}: {
  activity: ContentStructure;
  activityJson: ActivitySource;
  assignmentStatus?: AssignmentStatus;
  asViewer?: boolean;
  mode: "Edit" | "View";
  fetcher: FetcherWithComponents<any>;
  setSettingsContentId?: (value: React.SetStateAction<string | null>) => void;
  settingsOnOpen?: () => void;
  sharingOnOpen?: () => void;
  finalFocusRef?: React.MutableRefObject<HTMLElement | null>;
  setSettingsDisplayTab?: (arg: "general") => void;
  setHighlightRename?: (arg: boolean) => void;
  headerHeight: string;
  addTo?: ContentDescription;
}) {
  const contentTypeName = contentTypeToName[activity.type];

  // refs to the menu button of each content card,
  // which should be given focus when drawers are closed
  const cardMenuRefs = useRef<HTMLButtonElement[]>([]);

  const readOnly = asViewer || assignmentStatus !== "Unassigned";

  const { user } = useOutletContext<SiteContext>();
  const navigate = useNavigate();

  const [selectedCards, setSelectedCards] = useState<ContentDescription[]>([]);
  const numSelected = selectedCards.length;

  const [haveContentSpinner, setHaveContentSpinner] = useState(false);

  const [contentToDelete, setContentToDelete] =
    useState<ContentDescription | null>(null);

  useEffect(() => {
    setHaveContentSpinner(false);
  }, [activity]);

  const [moveToFolderData, setMoveToFolderData] = useState<{
    id: string;
    name: string;
    type: ContentType;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
    licenseCode: LicenseCode | null;
  }>({
    id: "",
    name: "",
    type: "singleDoc",
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

  const moveContentModal = user ? (
    <MoveCopyContent
      isOpen={moveToFolderIsOpen}
      onClose={moveToFolderOnClose}
      sourceContent={[moveToFolderData]}
      userId={user.userId}
      currentParentId={activity.id}
      finalFocusRef={finalFocusRef}
      allowedParentTypes={getAllowedParentTypes([moveToFolderData.type])}
      action="Move"
    />
  ) : null;

  const {
    isOpen: copyDialogIsOpen,
    onOpen: copyDialogOnOpen,
    onClose: copyDialogOnClose,
  } = useDisclosure();

  const copyContentModal =
    addTo !== undefined ? (
      <CopyContentAndReportFinish
        isOpen={copyDialogIsOpen}
        onClose={copyDialogOnClose}
        sourceContent={selectedCards}
        desiredParent={addTo}
        action="Add"
      />
    ) : null;

  const {
    isOpen: deleteContentIsOpen,
    onOpen: deleteContentOnOpen,
    onClose: deleteContentOnClose,
  } = useDisclosure();

  const deleteModal = contentToDelete ? (
    <DeleteModal
      isOpen={deleteContentIsOpen}
      onClose={deleteContentOnClose}
      content={contentToDelete}
      fetcher={fetcher}
      finalFocusRef={finalFocusRef}
    />
  ) : null;

  function selectCardCallback({
    id,
    name,
    checked,
    type,
  }: {
    id: string;
    name: string;
    checked: boolean;
    type: ContentType;
  }) {
    setSelectedCards((was) => {
      const arr = [...was];
      const idx = was.findIndex((c) => c.id === id);
      if (checked) {
        if (idx === -1) {
          arr.push({ id, name, type });
        } else {
          arr[idx] = { id, name, type };
        }
      } else if (idx !== -1) {
        arr.splice(idx, 1);
      }
      return arr;
    });
  }

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
            ? asViewer
              ? `/activityViewer/${content.id}`
              : `/activityEditor/${content.id}`
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
          hidden={readOnly}
          data-test="Rename Menu Item"
          onClick={() => {
            setSettingsContentId?.(id);
            setSettingsDisplayTab?.("general");
            setHighlightRename?.(true);
            settingsOnOpen?.();
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          hidden={readOnly}
          data-test={"Duplicate Content"}
          onClick={() => {
            fetcher.submit(
              {
                _action: "Duplicate Content",
                id,
                folderId: activity.id,
                contentType: content.type,
              },
              { method: "post" },
            );
          }}
        >
          Duplicate {contentTypeToName[content.type]}
        </MenuItem>
        {nextPositionUp ? (
          <MenuItem
            hidden={readOnly}
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
            hidden={readOnly}
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
          hidden={readOnly}
          data-test="Move to Folder"
          onClick={() => {
            setMoveToFolderData({
              id,
              name: content.name,
              type: content.type,
              isPublic: content.isPublic,
              isShared: content.isShared,
              sharedWith: content.sharedWith,
              licenseCode: content.license?.code ?? null,
            });
            moveToFolderOnOpen();
          }}
        >
          Move&hellip;
        </MenuItem>
        <MenuItem
          hidden={readOnly}
          data-test="Delete Menu Item"
          onClick={() => {
            setContentToDelete(content);
            deleteContentOnOpen();
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          hidden={readOnly}
          data-test="Share Menu Item"
          onClick={() => {
            setSettingsContentId?.(content.id);
            sharingOnOpen?.();
          }}
        >
          Share
        </MenuItem>
        <MenuItem
          data-test="Settings Menu Item"
          onClick={() => {
            setSettingsDisplayTab?.("general");
            setSettingsContentId?.(content.id);
            setHighlightRename?.(false);
            settingsOnOpen?.();
          }}
        >
          {readOnly
            ? contentTypeToName[content.type] + " Information"
            : "Settings"}
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
      emptyMessage={`${contentTypeName} is empty. Add or move documents ${activity.type === "sequence" ? "or question banks " : ""}here to begin.`}
      listView={true}
      content={cardContent}
      selectedCards={user ? selectedCards.map((c) => c.id) : undefined}
      selectCallback={selectCardCallback}
      disableSelectFor={addTo ? [addTo.id] : undefined}
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

  let parentLink: string;

  if (activity.parent) {
    if (activity.parent.type === "folder") {
      parentLink = `/activities/${user?.userId}/${activity.parent.id}`;
    } else {
      parentLink = `/activityEditor/${activity.parent.id}`;
    }
  } else {
    parentLink = `/activities/${user?.userId}`;
  }

  const heading = (
    <Flex
      backgroundColor="#fff"
      color="#000"
      height="40px"
      width="100%"
      textAlign="center"
      paddingX="10px"
      alignItems="center"
    >
      <Box hidden={asViewer}>
        <Link
          to={parentLink}
          style={{
            color: "var(--mainBlue)",
          }}
        >
          <Text noOfLines={1} maxWidth={{ sm: "200px", md: "400px" }}>
            <Show above="sm">
              &lt; Back to{" "}
              {activity.parent ? activity.parent.name : `My Activities`}
            </Show>
            <Hide above="sm">&lt; Back</Hide>
          </Text>
        </Link>
      </Box>
      <Spacer />

      <Flex
        height="30px"
        width="100%"
        alignContent="center"
        hidden={numSelected === 0 && addTo === undefined}
        backgroundColor="gray.100"
        justifyContent="center"
      >
        {addTo !== undefined ? (
          <HStack hidden={numSelected > 0}>
            <CloseButton
              size="sm"
              onClick={() => {
                navigate(`.`);
              }}
            />{" "}
            <Text noOfLines={1}>
              Adding items to: {menuIcons[addTo.type]}
              <strong>{addTo.name}</strong>
            </Text>
          </HStack>
        ) : null}
        <HStack hidden={numSelected === 0}>
          <CloseButton size="sm" onClick={() => setSelectedCards([])} />{" "}
          <Text>{numSelected} selected</Text>
          <HStack hidden={addTo !== undefined}>
            <AddContentToMenu
              sourceContent={selectedCards}
              size="xs"
              colorScheme="blue"
              label="Add selected to"
            />
            <CreateContentMenu
              sourceContent={selectedCards}
              size="xs"
              colorScheme="blue"
              label="Create from selected"
            />
          </HStack>
          {addTo !== undefined ? (
            <Button
              hidden={addTo === undefined}
              size="xs"
              colorScheme="blue"
              onClick={() => {
                copyDialogOnOpen();
              }}
            >
              Add selected to {menuIcons[addTo.type]}
              <strong>
                {addTo.name.substring(0, 10)}
                {addTo.name.length > 10 ? "..." : ""}
              </strong>
            </Button>
          ) : null}
        </HStack>
      </Flex>

      <Spacer />
      <Menu>
        <MenuButton
          hidden={asViewer}
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
          <MenuItem
            data-test="Add Explore Items"
            onClick={async () => {
              navigate(`/explore?addTo=${activity.id}`);
            }}
          >
            Items from Explore
          </MenuItem>
          <MenuItem
            data-test="Add My Activities Items"
            onClick={async () => {
              navigate(`/activities/${user!.userId}?addTo=${activity.id}`);
            }}
          >
            Items from My Activities
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );

  return (
    <>
      {moveContentModal}
      {copyContentModal}
      {deleteModal}
      {mode === "Edit" ? (
        <>
          {heading}
          <Flex
            data-test="Activities"
            padding="0 10px"
            margin="0px"
            width="100%"
            background={numCards > 0 ? "white" : "var(--lightBlue)"}
            minHeight={`calc(100vh - ${headerHeight} - 40px)`}
            direction="column"
          >
            {cardList}
          </Flex>
        </>
      ) : null}
      {mode === "View" ? (
        <Grid
          width="100%"
          templateAreas={`"leftGutter viewer rightGutter"`}
          templateColumns={`1fr minmax(300px,850px) 1fr`}
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
              background="var(--canvas)"
              padding="0px 0px 20px 0px"
              flexGrow={1}
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
