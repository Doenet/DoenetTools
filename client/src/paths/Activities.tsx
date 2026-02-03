import {
  Button,
  Box,
  Text,
  Flex,
  useDisclosure,
  MenuItem,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  Input,
  HStack,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  Form,
  Link as ReactRouterLink,
  redirect,
  useLoaderData,
  useFetcher,
  useOutletContext,
  useNavigate,
} from "react-router";
import axios from "axios";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import {
  MdClose,
  MdOutlineSearch,
  MdDriveFileMoveOutline,
} from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { LuDessert } from "react-icons/lu";
import { FiCopy, FiTrash2 } from "react-icons/fi";

import { CardContent } from "../widgets/Card";
import CardList from "../widgets/CardList";
import { MoveCopyContent } from "../popups/MoveCopyContent";
import { Content, ContentType, LicenseCode, UserInfo } from "../types";

import { getAllowedParentTypes, getIconInfo } from "../utils/activity";
import { CreateLocalContent } from "../popups/CreateLocalContent";
import { DeleteContent } from "../popups/DeleteContent";
import { CopyContentAndReportFinish } from "../popups/CopyContentAndReportFinish";
import { SiteContext } from "../paths/SiteHeader";
import { ActivateAuthorMode } from "../popups/ActivateAuthorMode";
import { formatAssignmentBlurb } from "../utils/assignment";
import { editorUrl } from "../utils/url";
import { ShareMyContentModal } from "../popups/ShareMyContentModal";
import { NameBar } from "../widgets/NameBar";
import { ActionBar } from "../widgets/ActionBar";
import { useCardSelections } from "../utils/cardSelections";
import { useCardMovement } from "../utils/cardMovement";

export async function loader({ params, request }: any) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  let data;
  if (q) {
    const results = await axios.get(
      `/api/contentList/searchMyContent/${params.userId}/${params.parentId ?? ""}?query=${q}`,
    );
    data = results.data;
  } else {
    const results = await axios.get(
      `/api/contentList/getMyContent/${params.userId}/${params.parentId ?? ""}`,
    );
    data = results.data;
  }

  if (data.notMe) {
    return redirect(
      `/sharedActivities/${params.userId}${params.parentId ? "/" + params.parentId : ""}`,
    );
  }

  return {
    parentId: params.parentId ? params.parentId : null,
    content: data.content,
    userId: params.userId,
    parent: data.parent,
    query: q,
  };
}

export function Activities() {
  const { parentId, content, userId, parent, query } = useLoaderData() as {
    parentId: string | null;
    content: Content[];
    userId: string;
    parent: Content | null;
    query: string | null;
  };
  const [settingsContentId, setSettingsContentId] = useState<string | null>(
    null,
  );

  const {
    isOpen: createFolderIsOpen,
    onOpen: createFolderOnOpen,
    onClose: createFolderOnClose,
  } = useDisclosure();

  const {
    isOpen: deleteContentIsOpen,
    onOpen: deleteContentOnOpen,
    onClose: deleteContentOnClose,
  } = useDisclosure();

  const {
    isOpen: shareFolderIsOpen,
    onOpen: shareFolderOnOpen,
    onClose: shareFolderOnClose,
  } = useDisclosure();

  const { addTo, setAddTo, user } = useOutletContext<SiteContext>();

  // refs to the menu button of each content card,
  // which should be given focus when drawers are closed
  const cardMenuRefs = useRef<HTMLButtonElement[]>([]);

  const finalFocusRef = useRef<HTMLElement | null>(null);

  const [haveContentSpinner, setHaveContentSpinner] = useState(false);

  const [searchString, setSearchString] = useState(query ?? "");
  const searchRef = useRef<HTMLInputElement>(null);
  const haveQuery = Boolean(query);

  useEffect(() => {
    setHaveContentSpinner(false);
  }, [content]);

  const cardSelections = useCardSelections({
    ids: content.map((c) => c.contentId),
  });
  const cardMovement = useCardMovement({
    selectedCards: cardSelections.ids,
    ids: content.map((c) => c.contentId),
  });

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

  const {
    isOpen: moveCopyContentIsOpen,
    onOpen: moveCopyContentOnOpen,
    onClose: moveCopyContentOnClose,
  } = useDisclosure();

  useEffect(() => {
    document.title = `${parent?.name ?? "My Activities"} - Doenet`;
  }, [parent]);

  // Used for card actions (move up/down, duplicate)
  const contentActionsFetcher = useFetcher();

  // Used for creating new documents and problem sets
  const createContentFetcher = useFetcher();

  // Used by MoveCopyContent modal
  const moveContentFetcher = useFetcher();

  // Used by CreateLocalContent modal (folder creation)
  const createFolderFetcher = useFetcher();

  // Used by CopyContentAndReportFinish modal
  const copyContentFetcher = useFetcher();

  // Used by ActivateAuthorMode modal
  const authorModeFetcher = useFetcher();

  // Used by AddContentToMenu component
  const addContentFetcher = useFetcher();

  // Used by CreateContentMenu component
  const createContentMenuCreateFetcher = useFetcher();
  const createContentMenuSaveNameFetcher = useFetcher();

  // Used by DeleteContent modal
  const deleteContentFetcher = useFetcher();

  const navigate = useNavigate();

  const { iconImage: folderIcon, iconColor: folderColor } = getIconInfo(
    "folder",
    false,
  );

  const parentName = parent?.name ?? "My Activities";

  const titleIcon = (
    <Tooltip label={parentName}>
      <Box>
        <Icon
          as={parent ? folderIcon : LuDessert}
          color={parent ? folderColor : "black"}
          boxSizing="content-box"
          width="24px"
          height="24px"
          mr="0.5rem"
          verticalAlign="middle"
          aria-label={"Folder"}
        />
      </Box>
    </Tooltip>
  );

  const headingText = (
    <NameBar
      contentName={parentName}
      isEditable={parent !== null}
      contentId={parentId}
      leftIcon={titleIcon}
      dataTest="Folder Title"
      fontSizeMode={"folder"}
    />
  );

  let contentData: Content | undefined;
  if (settingsContentId) {
    const index = content.findIndex(
      (obj) => obj.contentId == settingsContentId,
    );
    if (index != -1) {
      contentData = content[index];
      finalFocusRef.current = cardMenuRefs.current[index];
    } else {
      //Throw error not found
    }
  }

  function createNewDocument() {
    setHaveContentSpinner(true);
    createContentFetcher.submit(
      {
        path: "updateContent/createContent",
        redirectNewContentId: true,
        parentId,
        contentType: "singleDoc",
      },
      { method: "post", encType: "application/json" },
    );
  }

  const moveCopyContentModal = (
    <MoveCopyContent
      isOpen={moveCopyContentIsOpen}
      onClose={moveCopyContentOnClose}
      fetcher={moveContentFetcher}
      onNavigate={(url) => navigate(url)}
      sourceContent={[moveCopyData]}
      userId={userId}
      currentParentId={parentId}
      finalFocusRef={finalFocusRef}
      allowedParentTypes={getAllowedParentTypes([moveCopyData.type])}
      action="Move"
    />
  );

  const createFolderModal = (
    <CreateLocalContent
      isOpen={createFolderIsOpen}
      onClose={createFolderOnClose}
      contentType="folder"
      parentId={parentId}
      fetcher={createFolderFetcher}
      finalFocusRef={finalFocusRef}
    />
  );

  const deleteModal =
    contentData && settingsContentId ? (
      <DeleteContent
        isOpen={deleteContentIsOpen}
        onClose={deleteContentOnClose}
        content={contentData}
        finalFocusRef={finalFocusRef}
        fetcher={deleteContentFetcher}
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
        contentIds={[...cardSelections.ids]}
        desiredParent={addTo}
        action="Add"
        setAddTo={setAddTo}
        user={user ?? null}
        fetcher={copyContentFetcher}
        onNavigate={navigate}
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
      proceedCallback={createNewDocument}
      fetcher={authorModeFetcher}
    />
  );

  const shareFolderModal = parent && (
    <ShareMyContentModal
      contentId={parent.contentId}
      contentType={parent.type}
      isOpen={shareFolderIsOpen}
      onClose={shareFolderOnClose}
    />
  );

  const createNewButton = (
    <Menu>
      <MenuButton
        as={Button}
        size="sm"
        colorScheme="blue"
        data-test="New Button"
      >
        {haveContentSpinner ? (
          <Spinner size="sm" />
        ) : (
          <HStack>
            <FaPlus />
            <Text>New</Text>
          </HStack>
        )}
      </MenuButton>
      <MenuList>
        <MenuItem
          data-test="Add Document Button"
          onClick={() => {
            if (user?.isAuthor) {
              createNewDocument();
            } else {
              authorModePromptOnOpen();
            }
          }}
        >
          Document {!user?.isAuthor && <>(with source code)</>}
        </MenuItem>
        <MenuItem
          data-test="Add Problem Set Button"
          onClick={() => {
            setHaveContentSpinner(true);
            createContentFetcher.submit(
              {
                path: "updateContent/createContent",
                redirectNewContentId: true,
                parentId,
                contentType: "sequence",
              },
              { method: "post", encType: "application/json" },
            );
          }}
        >
          Problem Set
        </MenuItem>
        <MenuItem
          data-test="Add Folder Button"
          onClick={() => {
            createFolderOnOpen();
          }}
        >
          Folder
        </MenuItem>
      </MenuList>
    </Menu>
  );

  const heading = (
    <Flex
      justify="flex-start"
      align={{ base: "left", md: "center" }}
      flexDirection={{ base: "column", md: "row" }}
      pt="30px"
      pb="30px"
      gap="5px"
    >
      {headingText}
      <HStack>
        <Form>
          <HStack gap="1px">
            <Input
              type="search"
              size="sm"
              colorScheme="blue"
              width={{ base: "5rem", md: "10rem", lg: "200px" }}
              ref={searchRef}
              placeholder={parent ? `Search in folder` : `Search my activities`}
              value={searchString}
              name="q"
              onInput={(e) => {
                setSearchString((e.target as HTMLInputElement).value);
              }}
              data-test="Search Input"
            />
            <Tooltip
              label={parent ? `Search in folder` : `Search my activities`}
              placement="bottom-end"
            >
              <IconButton
                size="sm"
                colorScheme="blue"
                icon={<MdOutlineSearch />}
                aria-label={
                  parent ? `Search in folder` : `Search my activities`
                }
                type="submit"
                data-test="Search Button"
              />
            </Tooltip>
          </HStack>
        </Form>

        <HStack gap="7px">
          {createNewButton}
          {parent && (
            <>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={shareFolderOnOpen}
                data-test="Share Folder Button"
              >
                Share
              </Button>
              <Button
                as={ReactRouterLink}
                to={`/students/${parentId}`}
                colorScheme="blue"
                size="sm"
              >
                Students
              </Button>
            </>
          )}
        </HStack>
      </HStack>
    </Flex>
  );

  const searchResultsHeading = haveQuery ? (
    <Flex
      width="100%"
      background="lightgray"
      fontSize="large"
      alignItems="center"
      padding="5px"
      paddingLeft={[".1em", "1em"]}
      paddingRight={[".1em", "1em"]}
    >
      <Flex width="100%" alignItems="center" ml="2rem">
        {/* left offset to align with card content (checkbox + icon + title padding) */}
        Search results for: {query}
      </Flex>
      <Form>
        <Tooltip label="Close search results" placement="bottom-end">
          <IconButton
            icon={<MdClose />}
            background="lightgray"
            aria-label="Close search results"
            type="submit"
            onClick={() => {
              setSearchString("");
            }}
          />
        </Tooltip>
      </Form>
    </Flex>
  ) : null;

  const actions = addTo
    ? []
    : [
        {
          label: "Move up",
          onClick: cardMovement.moveUp,
          isDisabled: !cardMovement.canMoveUp || haveQuery,
          icon: <FaArrowUp />,
        },
        {
          label: "Move down",
          onClick: cardMovement.moveDown,
          isDisabled: !cardMovement.canMoveDown || haveQuery,
          icon: <FaArrowDown />,
        },
        {
          label: "Move to",
          onClick: () => {
            const selectedContent = content.find(
              (c) => c.contentId === cardSelections.ids.values().next().value,
            );
            if (selectedContent) {
              setMoveCopyData({
                contentId: selectedContent.contentId,
                name: selectedContent.name,
                type: selectedContent.type,
                isPublic: selectedContent.isPublic,
                isShared: selectedContent.isShared,
                sharedWith: selectedContent.sharedWith,
                licenseCode: selectedContent.licenseCode ?? null,
              });
              moveCopyContentOnOpen();
            }
          },
          isDisabled: cardSelections.count !== 1 || haveQuery,
          icon: <MdDriveFileMoveOutline />,
        },
        {
          label: "Make a copy",
          onClick: () => {
            contentActionsFetcher.submit(
              {
                path: "copyMove/copyContent",
                contentIds: [...cardSelections.ids],
                parentId,
                prependCopy: true,
              },
              { method: "post", encType: "application/json" },
            );
          },
          isDisabled: cardSelections.count === 0 || haveQuery,
          icon: <FiCopy />,
        },
        {
          label: "Move to trash",
          onClick: () => {
            setSettingsContentId(
              cardSelections.ids.values().next().value ?? null,
            );
            deleteContentOnOpen();
          },
          isDisabled: cardSelections.count !== 1 || haveQuery,
          icon: <FiTrash2 />,
        },
      ];

  const selectedItemsActions = (
    <ActionBar
      context={{
        description: `${cardSelections.count} item${
          cardSelections.count === 1 ? "" : "s"
        } selected`,
        closeLabel: "Deselect all",
        onClose: cardSelections.clear,
      }}
      actions={actions}
      isActive={cardSelections.areActive}
    />
  );

  const emptyMessage = haveQuery
    ? "No Results Found"
    : "Find activities from the Explore tab or create your own with the New button";

  const cardContent: CardContent[] = content.map((activity, position) => {
    const getCardMenuRef = (element: HTMLButtonElement) => {
      cardMenuRefs.current[position] = element;
    };

    let cardLink: string;
    if (activity.type === "folder") {
      cardLink = `/activities/${activity.ownerId}/${activity.contentId}`;
    } else if (activity.assignmentInfo) {
      cardLink = `/assignmentData/${activity.contentId}`;
    } else {
      cardLink = editorUrl(activity.contentId, activity.type);
    }

    return {
      menuRef: getCardMenuRef,
      content: activity,
      blurb: formatAssignmentBlurb(activity),
      cardLink,
    };
  });

  const mainPanel = (
    <CardList
      showOwnerName={false}
      showBlurb={true}
      showPublicStatus={true}
      showActivityCategories={true}
      emptyMessage={emptyMessage}
      cardContent={cardContent}
      includeSelectionBox={true}
      selectedCards={cardSelections.ids}
      onCardSelected={cardSelections.add}
      onCardDeselected={cardSelections.remove}
      disableSelectFor={addTo ? [addTo.contentId] : undefined}
    />
  );

  return (
    <Box
      data-test="Activities"
      width={{ base: "100%", md: "calc(100% - 40px)" }}
      background={"white"}
      ml={{ base: "0px", md: "20px" }}
      mr={{ base: "0px", md: "20px" }}
    >
      {moveCopyContentModal}
      {createFolderModal}
      {deleteModal}
      {copyContentModal}
      {authorModeModal}
      {shareFolderModal}

      {heading}
      {searchResultsHeading}
      {selectedItemsActions}

      {mainPanel}
    </Box>
  );
}
