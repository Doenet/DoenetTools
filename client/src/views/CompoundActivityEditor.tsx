import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ContentDescription,
  Content,
  ContentType,
  LicenseCode,
  UserInfo,
} from "../types";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Grid,
  GridItem,
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
  useNavigate,
  useOutletContext,
} from "react-router";
import {
  MoveCopyContent,
  moveCopyContentActions,
} from "../popups/MoveCopyContent";
import { SiteContext } from "../paths/SiteHeader";
import CardList from "../widgets/CardList";
import axios from "axios";
import { ActivitySource } from "../viewerTypes";
// @ts-expect-error assignment-viewer doesn't publish types, see https://github.com/Doenet/assignment-viewer/issues/20
import { ActivityViewer as DoenetActivityViewer } from "@doenet/assignment-viewer";
import {
  contentTypeToName,
  getAllowedParentTypes,
  menuIcons,
} from "../utils/activity";
import {
  CopyContentAndReportFinish,
  copyContentAndReportFinishActions,
} from "../popups/CopyContentAndReportFinish";
import {
  CreateContentMenu,
  createContentMenuActions,
} from "../dropdowns/CreateContentMenu";
import { AddContentToMenu } from "../popups/AddContentToMenu";
import { DeleteContent, deleteContentActions } from "../popups/DeleteContent";
import {
  CreateLocalContent,
  createLocalContentActions,
} from "../popups/CreateLocalContent";
import {
  ActivateAuthorMode,
  activateAuthorModeActions,
} from "../popups/ActivateAuthorMode";

export async function compoundActivityEditorActions({
  formObj,
}: {
  [k: string]: any;
}) {
  const resultMC = await moveCopyContentActions({ formObj });
  if (resultMC) {
    return resultMC;
  }

  const resultDM = await deleteContentActions({ formObj });
  if (resultDM) {
    return resultDM;
  }

  const resultCC = await copyContentAndReportFinishActions({ formObj });
  if (resultCC) {
    return resultCC;
  }

  const resultCCM = await createContentMenuActions({ formObj });
  if (resultCCM) {
    return resultCCM;
  }

  const resultCF = await createLocalContentActions({ formObj });
  if (resultCF) {
    return resultCF;
  }

  const resultDMM = await activateAuthorModeActions({ formObj });
  if (resultDMM) {
    return resultDMM;
  }

  if (formObj?._action == "Add Document") {
    //Create an activity and redirect to the editor for it
    const { data } = await axios.post(`/api/updateContent/createContent`, {
      contentType: formObj.type,
      parentId: formObj.parentId,
    });

    const { contentId } = data;

    if (formObj.type === "singleDoc") {
      return { createdDoc: contentId, createNum: Number(formObj.createNum) };

      // Note: do not know why this redirect does not work when the action is call from a Card inside a CardList.
      // Returning the above {createdDoc} is a workaround
      // redirect(`/activityEditor/${contentId}`);
    } else {
      return true;
    }
  } else if (formObj?._action == "Duplicate Content") {
    await axios.post(`/api/copyMove/copyContent`, {
      contentIds: [formObj.contentId],
      parentId: formObj.parentId === "null" ? null : formObj.parentId,
      prependCopy: true,
    });
    return true;
  } else if (formObj?._action == "Move") {
    await axios.post(`/api/copyMove/moveContent`, {
      contentId: formObj.contentId,
      parentId: formObj.parentId === "null" ? null : formObj.parentId,
      desiredPosition: Number(formObj.desiredPosition),
    });
    return true;
  }

  return null;
}

export function CompoundActivityEditor({
  activity,
  activityJson,
  asViewer = false,
  inLibrary = false,
  mode,
  fetcher,
  setSettingsContentId,
  settingsOnOpen,
  sharingOnOpen,
  finalFocusRef,
  setSettingsDisplayTab,
  setHighlightRename,
  headerHeight,
}: {
  activity: Content;
  activityJson: ActivitySource;
  asViewer?: boolean;
  inLibrary?: boolean;
  mode: "Edit" | "View";
  fetcher: FetcherWithComponents<any>;
  setSettingsContentId?: (value: React.SetStateAction<string | null>) => void;
  settingsOnOpen?: () => void;
  sharingOnOpen?: () => void;
  finalFocusRef?: React.MutableRefObject<HTMLElement | null>;
  setSettingsDisplayTab?: (arg: "general") => void;
  setHighlightRename?: (arg: boolean) => void;
  headerHeight: string;
}) {
  const contentTypeName = contentTypeToName[activity.type];

  // refs to the menu button of each content card,
  // which should be given focus when drawers are closed
  const cardMenuRefs = useRef<HTMLButtonElement[]>([]);

  const isAssigned = activity.assignmentInfo
    ? activity.assignmentInfo.assignmentStatus !== "Unassigned"
    : false;

  // Read only: cannot edit anything about this activity
  // Read only structure: cannot add or remove sub-activities
  // NOTE: currently not used as we're limiting curation to single docs
  const readOnly = asViewer || isAssigned;
  const readOnlyStructure = readOnly || inLibrary;

  const { user, addTo, setAddTo } = useOutletContext<SiteContext>();
  const navigate = useNavigate();

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

  // Note: this is a workaround for the the `redirect` inside the action, above,
  // not working when called from a Card inside a CardList
  const [creatingDoc, setCreatingDoc] = useState<{
    n: number;
    creating: boolean;
  }>({ n: 0, creating: false });
  useEffect(() => {
    if (typeof fetcher.data === "object" && fetcher.data !== null) {
      if (
        fetcher.data.createdDoc &&
        creatingDoc.creating &&
        creatingDoc.n === fetcher.data.createNum
      ) {
        setCreatingDoc((was) => ({
          creating: false,
          n: was.n,
        }));
        navigate(`/activityEditor/${fetcher.data.createdDoc}`);
      }
    }
  }, [fetcher.data, creatingDoc, navigate]);

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
        fetcher={fetcher}
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
      fetcher={fetcher}
      finalFocusRef={finalFocusRef}
    />
  ) : null;

  const {
    isOpen: createQuestionBankIsOpen,
    onOpen: createQuestionBankOnOpen,
    onClose: createQuestionBankOnClose,
  } = useDisclosure();

  const createQuestionBankModal = (
    <CreateLocalContent
      isOpen={createQuestionBankIsOpen}
      onClose={createQuestionBankOnClose}
      contentType="select"
      parentId={activity.contentId}
      fetcher={fetcher}
      finalFocusRef={finalFocusRef}
    />
  );

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
        menuRef: getCardMenuRef,
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
              : `/activityEditor/${content.contentId}`
            : undefined,
        indentLevel,
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
        <MenuItem
          hidden={readOnly}
          data-test="Rename Menu Item"
          onClick={() => {
            setSettingsContentId?.(contentId);
            setSettingsDisplayTab?.("general");
            setHighlightRename?.(true);
            settingsOnOpen?.();
          }}
        >
          Rename
        </MenuItem>
        {nextPositionUp ? (
          <MenuItem
            hidden={readOnly}
            data-test="Move Up Menu Item"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "Move",
                  contentId,
                  desiredPosition: nextPositionUp.position,
                  parentId: nextPositionUp.parent,
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
                  contentId,
                  desiredPosition: nextPositionDown.position,
                  parentId: nextPositionDown.parent,
                },
                { method: "post" },
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
              licenseCode: content.license?.code ?? null,
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
                _action: "Duplicate Content",
                contentId,
                parentId: activity.contentId,
              },
              { method: "post" },
            );
          }}
        >
          Make a copy
        </MenuItem>
        <MenuDivider />
        <MenuItem
          hidden={readOnly}
          data-test="Share Menu Item"
          onClick={() => {
            setSettingsContentId?.(content.contentId);
            sharingOnOpen?.();
          }}
        >
          Share
        </MenuItem>
        <MenuItem
          data-test="Settings Menu Item"
          onClick={() => {
            setSettingsDisplayTab?.("general");
            setSettingsContentId?.(content.contentId);
            setHighlightRename?.(false);
            settingsOnOpen?.();
          }}
        >
          Settings
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

      const createNum = Math.round(Math.random() * 1000000);

      setCreatingDoc({
        creating: true,
        n: createNum,
      });

      fetcher.submit(
        {
          _action: "Add Document",
          type: "singleDoc",
          parentId: contentId || activity.contentId,
          createNum,
        },
        { method: "post" },
      );
    },
    [activity.contentId, fetcher],
  );

  const cardList = (
    <CardList
      showOwnerName={false}
      showBlurb={false}
      showPublicStatus={true}
      showActivityFeatures={true}
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

  const viewer = (
    <DoenetActivityViewer
      source={activityJson}
      requestedVariantIndex={1}
      userId={"hi"}
      linkSettings={{ viewUrl: "", editURL: "" }}
      paginate={activity.type === "sequence" ? activity.paginate : false}
      activityLevelAttempts={activity.assignmentInfo?.mode === "summative"}
      itemLevelAttempts={activity.assignmentInfo?.mode === "formative"}
      maxAttemptsAllowed={activity.assignmentInfo?.maxAttempts}
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
              fetcher={fetcher}
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
          {activity.type === "sequence" ? (
            <MenuItem
              data-test="Add Question Bank Button"
              onClick={() => {
                createQuestionBankOnOpen();
              }}
            >
              Empty Question Bank
            </MenuItem>
          ) : null}
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
      {createQuestionBankModal}
      {authorModeModal}
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
