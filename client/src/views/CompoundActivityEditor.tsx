import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContentDescription,
  Content,
  ContentType,
  LicenseCode,
  UserInfo,
} from "../types";
import {
  Button,
  CloseButton,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { CardContent } from "../widgets/Card";
import {
  FetcherWithComponents,
  Link as ReactRouterLink,
  useOutletContext,
} from "react-router";
import { MoveCopyContent } from "../popups/MoveCopyContent";
import CardList from "../widgets/CardList";
import {
  contentTypeToName,
  getAllowedParentTypes,
  menuIcons,
} from "../utils/activity";
import { CopyContentAndReportFinish } from "../popups/CopyContentAndReportFinish";
import { CreateContentMenu } from "../dropdowns/CreateContentMenu";
import { AddContentToMenu } from "../popups/AddContentToMenu";
import { DeleteContent } from "../popups/DeleteContent";
import { ActivateAuthorMode } from "../popups/ActivateAuthorMode";
import { editorUrl } from "../utils/url";
import { EditorContext } from "../paths/editor/EditorHeader";

export function CompoundActivityEditor({
  activity,
  asViewer = false,
  inLibrary = false,
  fetcher,
  finalFocusRef,
}: {
  activity: Content;
  asViewer?: boolean;
  inLibrary?: boolean;
  fetcher: FetcherWithComponents<any>;
  finalFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const contentTypeName = contentTypeToName[activity.type];

  const isAssigned = activity.assignmentInfo
    ? activity.assignmentInfo.assignmentStatus !== "Unassigned"
    : false;

  // Read only: cannot edit anything about this activity
  // Read only structure: cannot add or remove sub-activities
  // NOTE: currently not used as we're limiting curation to single docs
  const readOnly = asViewer || isAssigned;
  const readOnlyStructure = readOnly || inLibrary;

  const { user, addTo, setAddTo, headerHeight } =
    useOutletContext<EditorContext>();

  const [selectedCards, setSelectedCards] = useState<ContentDescription[]>([]);
  const selectedCardsFiltered = selectedCards.filter((c) => c);
  const numSelected = selectedCardsFiltered.length;

  const [disableAsSelected, setDisableAsSelected] = useState<string[]>([]);

  const [haveContentSpinner, setHaveContentSpinner] = useState(false);

  const [contentToDelete, setContentToDelete] =
    useState<ContentDescription | null>(null);

  const [createDocumentParentId, setCreateDocumentParentId] = useState(
    activity.contentId,
  );

  useEffect(() => {
    setHaveContentSpinner(false);
  }, [activity]);

  const [moveCopyData, setMoveCopyData] = useState<{
    contentId: string;
    name: string;
    type: ContentType;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
    licenseCode: LicenseCode | null;
  }>({
    contentId: "",
    name: "",
    type: "singleDoc",
    isPublic: false,
    isShared: false,
    sharedWith: [],
    licenseCode: null,
  });

  const [moveCopyAction, setMoveCopyAction] = useState<"Move" | "Copy">("Move");

  const {
    isOpen: moveCopyContentIsOpen,
    onOpen: moveCopyContentOnOpen,
    onClose: moveCopyContentOnClose,
  } = useDisclosure();

  const moveContentModal = user ? (
    <MoveCopyContent
      isOpen={moveCopyContentIsOpen}
      onClose={moveCopyContentOnClose}
      sourceContent={[moveCopyData]}
      userId={user.userId}
      currentParentId={activity.contentId}
      finalFocusRef={finalFocusRef}
      allowedParentTypes={getAllowedParentTypes([moveCopyData.type])}
      action={moveCopyAction}
    />
  ) : null;

  const {
    isOpen: copyDialogIsOpen,
    onOpen: copyDialogOnOpen,
    onClose: copyDialogOnClose,
  } = useDisclosure();

  const copyContentModal =
    addTo !== null ? (
      <CopyContentAndReportFinish
        isOpen={copyDialogIsOpen}
        onClose={copyDialogOnClose}
        contentIds={selectedCardsFiltered.map((sc) => sc.contentId)}
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
    <DeleteContent
      isOpen={deleteContentIsOpen}
      onClose={deleteContentOnClose}
      content={contentToDelete}
      finalFocusRef={finalFocusRef}
    />
  ) : null;

  const {
    isOpen: authorModePromptIsOpen,
    onOpen: authorModePromptOnOpen,
    onClose: authorModePromptOnClose,
  } = useDisclosure();

  const authorModeModal = (
    <ActivateAuthorMode
      isOpen={authorModePromptIsOpen}
      onClose={authorModePromptOnClose}
      desiredAction="create doc"
      user={user!}
      proceedCallback={() => {
        createNewDocument(createDocumentParentId);
      }}
      fetcher={fetcher}
    />
  );

  // TODO: figure out functions inside hooks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function countCards(content: Content, init = true): number {
    const childCounts =
      content.type === "singleDoc"
        ? 1
        : content.children.reduce((a, c) => a + countCards(c, false), 0);

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

  const numCards = useMemo(() => countCards(activity), [activity, countCards]);

  let idx = 0;

  // TODO: figure out functions inside hooks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function createCardContent(
    content: Content,
    indentLevel = -1,
    positionInParent = 0,
    parentInfo?: {
      contentId: string;
      parent?: string;
      positionInParent: number;
      children: Content[];
    },
  ) {
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
      // Calculate the destination for the "Move Up" and "Move Down" actions
      let nextPositionUp: { parent: string; position: number } | null;
      let nextPositionDown: { parent: string; position: number } | null;

      if (positionInParent > 0) {
        // Not first in parent.
        // If previous sibling is a single doc, take its position.
        // Either become the last child of sibling
        const previousSibling = parentInfo.children[positionInParent - 1];
        if (previousSibling.type === "singleDoc") {
          nextPositionUp = {
            parent: parentInfo.contentId,
            position: positionInParent - 1,
          };
        } else {
          nextPositionUp = {
            parent: previousSibling.contentId,
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
            parent: parentInfo.contentId,
            position: positionInParent + 1,
          };
        } else {
          nextPositionDown = {
            parent: nextSibling.contentId,
            position: 0,
          };
        }
      } else if (parentInfo.parent) {
        // last in parent, so position down is position after parent
        nextPositionDown = {
          parent: parentInfo.parent,
          position: parentInfo.positionInParent + 1,
        };
      } else {
        // last in initial parent
        nextPositionDown = null;
      }

      cards.push({
        content: content,
        menuItems: getCardMenuList({
          contentId: content.contentId,
          content: content,
          nextPositionUp,
          nextPositionDown,
        }),
        cardLink:
          content.type === "singleDoc"
            ? asViewer
              ? `/activityViewer/${content.contentId}`
              : editorUrl(content.contentId, content.type)
            : undefined,
        indentLevel,
        repeatInProblemSet:
          content.type === "singleDoc" ? content.repeatInProblemSet : undefined,
        updateRepeatInProblemSet: (copies) => {
          fetcher.submit(
            {
              path: "updateContent/updateContentSettings",
              contentId: content.contentId,
              repeatInProblemSet: copies,
            },
            { method: "post", encType: "application/json" },
          );
        },
      });
      idx++;
    }

    if (content.type !== "singleDoc") {
      cards.push(
        ...content.children.flatMap((c, i) =>
          createCardContent(c, indentLevel + 1, i, {
            contentId: content.contentId,
            parent: content.parent?.contentId,
            positionInParent,
            children: content.children,
          }),
        ),
      );
    }

    if (
      parentInfo &&
      (content.type === "select" || content.type === "sequence")
    ) {
      idx++;
      cards.push({
        cardType: "afterParent",
        parentId: content.contentId,
        indentLevel: indentLevel + 1,
        empty: content.children.length === 0,
      });
    }

    return cards;
  }

  const cardContent = useMemo(
    () => createCardContent(activity),
    [activity, createCardContent],
  );

  type ContentRelationships = { descendants: string[]; parent: string | null };

  // TODO: figure out functions inside hooks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function extractContentById(
    content: Content,
    skipParent: string,
  ): Record<string, ContentRelationships> {
    const byId: Record<string, ContentRelationships> = {};

    let children: string[] = [];

    if (content.type !== "singleDoc") {
      children = content.children.map((c) => c.contentId);

      for (const child of content.children) {
        Object.assign(byId, extractContentById(child, skipParent));
      }
    }

    if (content.contentId !== skipParent) {
      byId[content.contentId] = {
        descendants: [
          ...children,
          ...children.flatMap((id) => byId[id].descendants),
        ],
        parent:
          content.parent!.contentId === skipParent
            ? null
            : content.parent!.contentId,
      };
    }
    return byId;
  }

  const contentById = useMemo(
    () => extractContentById(activity, activity.contentId),
    [activity, extractContentById],
  );

  useEffect(() => {
    // normalize selected cards
    const toDisable: string[] = [];
    const toDeselect: number[] = [];
    for (const [idx, card] of selectedCards.entries()) {
      if (card) {
        const descendants = contentById[card.contentId].descendants;
        toDisable.push(...descendants);
        if (toDisable.includes(card.contentId)) {
          toDeselect.push(idx);
        }
      }
    }

    if (
      toDisable.length !== disableAsSelected.length ||
      toDisable.some((v, i) => v !== disableAsSelected[i])
    ) {
      setDisableAsSelected(toDisable);
    }
    if (toDeselect.length > 0) {
      setSelectedCards((was) => {
        const arr = [...was];
        for (const idx of toDeselect) {
          delete arr[idx];
        }
        return arr;
      });
    }
  }, [contentById, disableAsSelected, selectedCards]);

  useEffect(() => {
    setSelectedCards((was) => {
      let foundMissing = false;
      const newList = Object.keys(contentById);
      for (const c of was.filter((x) => x)) {
        if (!newList.includes(c.contentId)) {
          foundMissing = true;
          break;
        }
      }
      if (foundMissing) {
        return [];
      } else {
        return was;
      }
    });
  }, [contentById]);

  function getCardMenuList({
    contentId,
    content,
    nextPositionUp,
    nextPositionDown,
  }: {
    contentId: string;
    content: Content;
    nextPositionUp: { parent: string; position: number } | null;
    nextPositionDown: { parent: string; position: number } | null;
  }) {
    return (
      <>
        {nextPositionUp ? (
          <MenuItem
            hidden={readOnly}
            data-test="Move Up Menu Item"
            onClick={() => {
              fetcher.submit(
                {
                  path: "copyMove/moveContent",
                  contentId,
                  desiredPosition: nextPositionUp.position,
                  parentId: nextPositionUp.parent,
                },
                { method: "post", encType: "application/json" },
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
                  path: "copyMove/moveContent",
                  contentId,
                  desiredPosition: nextPositionDown.position,
                  parentId: nextPositionDown.parent,
                },
                { method: "post", encType: "application/json" },
              );
            }}
          >
            Move Down
          </MenuItem>
        ) : null}
        <MenuItem
          data-test="MoveCopy"
          onClick={() => {
            setMoveCopyAction(readOnly ? "Copy" : "Move");
            setMoveCopyData({
              contentId,
              name: content.name,
              type: content.type,
              isPublic: content.isPublic,
              isShared: content.isShared,
              sharedWith: content.sharedWith,
              licenseCode: content.licenseCode ?? null,
            });
            moveCopyContentOnOpen();
          }}
        >
          {readOnly ? "Copy to" : "Move to"}&hellip;
        </MenuItem>
        <MenuItem
          hidden={readOnly}
          data-test={"Duplicate Content"}
          onClick={() => {
            fetcher.submit(
              {
                path: "copyMove/copyContent",
                contentIds: [contentId],
                parentId: activity.contentId,
                prependCopy: true,
              },
              { method: "post", encType: "application/json" },
            );
          }}
        >
          Make a copy
        </MenuItem>
        <MenuDivider />
        <MenuItem
          hidden={readOnly}
          data-test="Delete Menu Item"
          onClick={() => {
            setContentToDelete(content);
            deleteContentOnOpen();
          }}
        >
          Move to trash
        </MenuItem>
      </>
    );
  }

  const createNewDocument = useCallback(
    (contentId?: string) => {
      setHaveContentSpinner(true);

      fetcher.submit(
        {
          path: "updateContent/createContent",
          redirectNewContentId: true,
          contentType: "singleDoc",
          parentId: contentId || activity.contentId,
        },
        { method: "post", encType: "application/json" },
      );
    },
    [activity.contentId, fetcher],
  );

  const cardList = (
    <CardList
      showOwnerName={false}
      showBlurb={false}
      showPublicStatus={true}
      showActivityCategories={true}
      showAddButton={!readOnlyStructure}
      emptyMessage={`${contentTypeName} is empty. Add documents ${activity.type === "sequence" ? "or question banks " : ""}here to begin.`}
      content={cardContent}
      selectedCards={user ? selectedCards : undefined}
      setSelectedCards={setSelectedCards}
      disableSelectFor={addTo ? [addTo.contentId] : undefined}
      disableAsSelectedFor={disableAsSelected}
      isAuthor={user?.isAuthor}
      addDocumentCallback={(contentId) => {
        if (user?.isAuthor) {
          createNewDocument(contentId);
        } else {
          setCreateDocumentParentId(contentId);
          authorModePromptOnOpen();
        }
      }}
    />
  );

  const cardListHeaderHieght = "40px";

  const heading = (
    <Flex
      backgroundColor="#fff"
      color="#000"
      height={cardListHeaderHieght}
      width="100%"
      textAlign="center"
      paddingX="10px"
      alignItems="center"
    >
      <Spacer />

      <Flex
        height="30px"
        width="100%"
        alignContent="center"
        hidden={numSelected === 0 && addTo === null}
        backgroundColor="gray.100"
        justifyContent="center"
      >
        {addTo !== null ? (
          <HStack hidden={numSelected > 0}>
            <CloseButton
              size="sm"
              onClick={() => {
                setAddTo(null);
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
          <HStack hidden={addTo !== null}>
            <AddContentToMenu
              fetcher={fetcher}
              sourceContent={selectedCardsFiltered}
              size="xs"
              colorScheme="blue"
              label="Add selected to"
            />
            <CreateContentMenu
              sourceContent={selectedCardsFiltered}
              size="xs"
              colorScheme="blue"
              label="Create from selected"
            />
          </HStack>
          {addTo !== null ? (
            <Button
              data-test="Add Selected To Button"
              size="xs"
              colorScheme="blue"
              onClick={() => {
                copyDialogOnOpen();
              }}
            >
              Add selected to: {menuIcons[addTo.type]}
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
          hidden={readOnlyStructure}
          as={Button}
          size="sm"
          colorScheme="blue"
          data-test="New Button"
        >
          {haveContentSpinner ? <Spinner size="sm" /> : "Add"}
        </MenuButton>
        <MenuList>
          <MenuItem
            as={ReactRouterLink}
            data-test="Add Explore Items"
            to={`/explore`}
            onClick={() => {
              setAddTo(activity);
            }}
          >
            Items from Explore
          </MenuItem>
          <MenuItem
            as={ReactRouterLink}
            data-test="Add My Activities Items"
            to={`/activities/${user!.userId}`}
            onClick={() => {
              setAddTo(activity);
            }}
          >
            Items from My Activities
          </MenuItem>
          <MenuItem
            data-test="Add Document Button"
            onClick={() => {
              if (user?.isAuthor) {
                createNewDocument();
              } else {
                setCreateDocumentParentId(activity.contentId);
                authorModePromptOnOpen();
              }
            }}
          >
            Blank Document {!user?.isAuthor && <>(with source code)</>}
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
      {authorModeModal}
      {heading}
      <Flex
        data-test="Activities"
        padding="0 10px"
        margin="0px"
        width="100%"
        minHeight={`calc(100vh - ${headerHeight} - ${cardListHeaderHieght})`}
        background={numCards > 0 ? "white" : "var(--lightBlue)"}
        direction="column"
      >
        {cardList}
      </Flex>
    </>
  );
}
