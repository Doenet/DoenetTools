import {
  Button,
  Box,
  Text,
  Flex,
  useDisclosure,
  MenuItem,
  Heading,
  Tooltip,
  IconButton,
  Input,
  Spacer,
  Show,
  HStack,
  VStack,
  Hide,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useFetcher,
  Link,
  Form,
} from "react-router";

import { cardActions, CardContent } from "../../../Widgets/Card";
import CardList from "../../../Widgets/CardList";
import axios from "axios";
import MoveContentToFolder, {
  moveContentActions,
} from "../ToolPanels/MoveContentToFolder";
import {
  contentSettingsActions,
  ContentSettingsDrawer,
} from "../ToolPanels/ContentSettingsDrawer";
import {
  LibraryInfo,
  AssignmentStatus,
  ContentFeature,
  ContentStructure,
  DoenetmlVersion,
  LicenseCode,
  UserInfo,
} from "./../../../_utils/types";
import { MdClose, MdOutlineSearch } from "react-icons/md";
import { formatTime } from "../../../_utils/dateUtilityFunction";
import {
  ToggleViewButtonGroup,
  toggleViewButtonGroupActions,
} from "../ToolPanels/ToggleViewButtonGroup";
import { CurateDrawer, curateDrawerActions } from "../ToolPanels/CurateDrawer";

// what is a better solution than this?
let folderJustCreated = ""; // if a folder was just created, set autoFocusName true for the card with the matching id

export async function action({ request, params }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  const resultsCurate = await curateDrawerActions({ formObj });
  if (resultsCurate) {
    return resultsCurate;
  }

  const resultCS = await contentSettingsActions({ formObj });
  if (resultCS) {
    return resultCS;
  }

  const resultCC = await cardActions({ formObj });
  if (resultCC) {
    return resultCC;
  }

  const resultMC = await moveContentActions({ formObj });
  if (resultMC) {
    return resultMC;
  }

  const resultTLV = await toggleViewButtonGroupActions({ formObj });
  if (resultTLV) {
    return resultTLV;
  }

  if (formObj?._action == "Add Folder") {
    const { data } = await axios.post(
      `/api/createCurationFolder/${params.folderId ?? ""}`,
    );
    folderJustCreated = data.folderId;
    return true;
  } else if (formObj?._action == "Delete Draft") {
    await axios.post(`/api/deleteDraftFromLibrary`, {
      activityId: formObj.id,
    });
    return true;

    // TODO: Figure out how to delete folders in library (some activities may be published)
    // One idea is that you can only delete folders that are empty (or have only drafts?)

    // } else if (formObj?._action == "Delete Folder") {
    //   await axios.post(`/api/deleteCurationFolder`, {
    //     folderId: formObj.id === "null" ? null : formObj.id,
    //   });
    //   return true;
  } else if (formObj?._action == "Move") {
    await axios.post(`/api/moveCurationContent`, {
      id: formObj.id,
      desiredParentFolderId:
        formObj.folderId === "null" ? null : formObj.folderId,
      desiredPosition: formObj.desiredPosition,
    });
    return true;

    // } else if (formObj?._action == "Set List View Preferred") {
    //   await axios.post(`/api/setPreferredFolderView`, {
    //     cardView: formObj.listViewPref === "false",
    //   });
    //   return true;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  let data;
  if (q) {
    const results = await axios.get(
      `/api/searchCurationFolderContent/${params.folderId ?? ""}?q=${q}`,
    );
    data = results.data;
  } else {
    const results = await axios.get(
      `/api/getCurationFolderContent/${params.folderId ?? ""}`,
    );
    data = results.data;
  }

  const prefData = await axios.get(`/api/getPreferredFolderView`);
  const listViewPref = !prefData.data.cardView;

  console.log(data.content);

  return {
    folderId: params.folderId ? params.folderId : null,
    content: data.content,
    allDoenetmlVersions: data.allDoenetmlVersions,
    allLicenses: data.allLicenses,
    availableFeatures: data.availableFeatures,
    userId: params.userId,
    folder: data.folder,
    listViewPref,
    query: q,
  };
}

export function Curation() {
  const {
    folderId,
    content,
    allDoenetmlVersions,
    availableFeatures,
    userId,
    folder,
    listViewPref,
    query,
  } = useLoaderData() as {
    folderId: string | null;
    content: ContentStructure[];
    allDoenetmlVersions: DoenetmlVersion[];
    availableFeatures: ContentFeature[];
    userId: string;
    folder: ContentStructure | null;
    listViewPref: boolean;
    query: string | null;
  };

  const [settingsContentId, setSettingsContentId] = useState<string | null>(
    null,
  );
  const {
    isOpen: settingsAreOpen,
    onOpen: settingsOnOpen,
    onClose: settingsOnClose,
  } = useDisclosure();

  const {
    isOpen: curateIsOpen,
    onOpen: curateOnOpen,
    onClose: curateOnClose,
  } = useDisclosure();

  // refs to the menu button of each content card,
  // which should be given focus when drawers are closed
  const cardMenuRefs = useRef<HTMLButtonElement[]>([]);

  const folderSettingsRef = useRef(null);
  const finalFocusRef = useRef<HTMLElement | null>(null);

  const [haveContentSpinner, setHaveContentSpinner] = useState(false);

  const [focusSearch, setFocusSearch] = useState(false);
  const [searchString, setSearchString] = useState(query ?? "");
  const searchRef = useRef<HTMLInputElement>(null);
  const searchBlurTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const haveQuery = Boolean(query);
  const searchOpen = focusSearch || haveQuery;

  useEffect(() => {
    if (focusSearch) {
      searchRef.current?.focus();
    }
  }, [focusSearch]);

  useEffect(() => {
    setHaveContentSpinner(false);
  }, [content]);

  const navigate = useNavigate();

  const [listView, setListView] = useState(listViewPref);

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

  const [displaySettingsTab, setSettingsDisplayTab] =
    useState<"general">("general");

  useEffect(() => {
    document.title = `Curation - Doenet`;
  }, []);

  const fetcher = useFetcher();

  function getCardMenuList({
    id,
    position,
    numCards,
    isFolder,
    isPublic,
    isShared,
    sharedWith,
    licenseCode,
    parentFolderId,
  }: {
    id: string;
    name: string;
    position: number;
    numCards: number;
    assignmentStatus: AssignmentStatus;
    isFolder: boolean;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
    licenseCode: LicenseCode | null;
    parentFolderId: string | null;
    libraryActivity: LibraryInfo;
  }) {
    return (
      <>
        {position > 0 && !haveQuery ? (
          <MenuItem
            data-test="Move Left Menu Item"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "Move",
                  id,
                  desiredPosition: position - 1,
                  folderId,
                },
                { method: "post" },
              );
            }}
          >
            {listView ? "Move Up" : "Move Left"}
          </MenuItem>
        ) : null}
        {position < numCards - 1 && !haveQuery ? (
          <MenuItem
            data-test="Move Right Menu Item"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "Move",
                  id,
                  desiredPosition: position + 1,
                  folderId,
                },
                { method: "post" },
              );
            }}
          >
            {listView ? "Move Down" : "Move Right"}
          </MenuItem>
        ) : null}
        {haveQuery ? null : (
          <MenuItem
            data-test="Move to Folder"
            onClick={() => {
              setMoveToFolderData({
                id,
                isPublic,
                isShared,
                sharedWith,
                licenseCode,
              });
              moveToFolderOnOpen();
            }}
          >
            Move to Folder
          </MenuItem>
        )}
        {!isFolder && !isPublic ? (
          <MenuItem
            data-test="Delete Draft"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "Delete Draft",
                  id,
                },
                { method: "post" },
              );
            }}
          >
            Delete Draft
          </MenuItem>
        ) : null}
        {isFolder ? null : (
          <MenuItem
            data-test="Curate Menu Item"
            onClick={() => {
              setSettingsContentId(id);
              curateOnOpen();
            }}
          >
            Curate
          </MenuItem>
        )}

        <MenuItem
          data-test="Settings Menu Item"
          onClick={() => {
            setSettingsContentId(id);
            setSettingsDisplayTab("general");
            settingsOnOpen();
          }}
        >
          Settings
        </MenuItem>
        {haveQuery ? (
          <MenuItem
            data-test="Go to containing folder"
            onClick={() => {
              navigate(
                `/curation/${parentFolderId ? "/" + parentFolderId : ""}`,
              );
            }}
          >
            Go to containing folder
          </MenuItem>
        ) : null}
      </>
    );
  }

  const headingText = folder ? (
    <>
      {folder.isPublic ? "Public " : ""}Folder: {folder.name}
    </>
  ) : (
    `Curation`
  );

  let contentData: ContentStructure | undefined;
  if (settingsContentId) {
    if (folder && settingsContentId === folderId) {
      contentData = folder;
      finalFocusRef.current = folderSettingsRef.current;
    } else {
      const index = content.findIndex((obj) => obj.id == settingsContentId);
      if (index != -1) {
        contentData = content[index];
        finalFocusRef.current = cardMenuRefs.current[index];
      } else {
        //Throw error not found
      }
    }
  }

  const settingsDrawer =
    contentData && settingsContentId ? (
      <ContentSettingsDrawer
        isOpen={settingsAreOpen}
        onClose={settingsOnClose}
        contentData={contentData}
        allDoenetmlVersions={allDoenetmlVersions}
        availableFeatures={availableFeatures}
        finalFocusRef={finalFocusRef}
        fetcher={fetcher}
        displayTab={displaySettingsTab}
      />
    ) : null;

  const curateDrawer =
    contentData && settingsContentId ? (
      <CurateDrawer
        isOpen={curateIsOpen}
        onClose={curateOnClose}
        contentData={contentData}
        finalFocusRef={finalFocusRef}
        fetcher={fetcher}
      />
    ) : null;

  const moveContentModal = (
    <MoveContentToFolder
      isOpen={moveToFolderIsOpen}
      onClose={moveToFolderOnClose}
      id={moveToFolderData.id}
      isPublic={moveToFolderData.isPublic}
      isShared={moveToFolderData.isShared}
      sharedWith={moveToFolderData.sharedWith}
      licenseCode={moveToFolderData.licenseCode}
      userId={userId}
      currentParentId={folderId}
      finalFocusRef={finalFocusRef}
      inCurationLibrary={true}
    />
  );

  const heading = (
    <Box
      backgroundColor="#fff"
      color="#000"
      height="130px"
      width="100%"
      textAlign="center"
    >
      <Heading
        as="h2"
        size="lg"
        margin=".5em"
        noOfLines={1}
        maxHeight="1.5em"
        lineHeight="normal"
        data-test="Folder Heading"
      >
        <Tooltip label={headingText}>{headingText}</Tooltip>
      </Heading>
      <VStack width="100%">
        <Flex marginRight="1em" width="100%">
          <Spacer />
          <HStack>
            <Flex>
              <Form>
                <Input
                  type="search"
                  hidden={!searchOpen}
                  size="sm"
                  colorScheme="blue"
                  width="250px"
                  ref={searchRef}
                  placeholder={folder ? `Search in folder` : `Search curation`}
                  value={searchString}
                  name="q"
                  onInput={(e) => {
                    setSearchString((e.target as HTMLInputElement).value);
                  }}
                  onBlur={() => {
                    searchBlurTimeout.current = setTimeout(() => {
                      setFocusSearch(false);
                    }, 200);
                  }}
                />
                <Tooltip
                  label={folder ? `Search in folder` : `Search curation`}
                  placement="bottom-end"
                >
                  <IconButton
                    size="sm"
                    colorScheme="blue"
                    icon={<MdOutlineSearch />}
                    aria-label={folder ? `Search in folder` : `Search curation`}
                    type="submit"
                    onClick={(e) => {
                      if (focusSearch) {
                        clearTimeout(searchBlurTimeout.current);
                        searchRef.current?.focus();
                      } else {
                        setFocusSearch(true);
                      }
                      if (!searchOpen) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Tooltip>
              </Form>
            </Flex>
            <Button
              as={Button}
              size="sm"
              colorScheme="blue"
              hidden={searchOpen}
              data-test="New Folder Button"
              onClick={() => {
                setHaveContentSpinner(true);
                fetcher.submit({ _action: "Add Folder" }, { method: "post" });
              }}
            >
              {haveContentSpinner ? <Spinner size="sm" /> : "New Folder"}
            </Button>
          </HStack>
        </Flex>

        <Flex
          width="100%"
          paddingRight="0.5em"
          paddingLeft="1em"
          alignItems="middle"
        >
          {folder && !haveQuery ? (
            <Box>
              <Link
                to={`/curation${folder.parentFolder ? "/" + folder.parentFolder.id : ""}`}
                style={{
                  color: "var(--mainBlue)",
                }}
              >
                <Text noOfLines={1} maxWidth={{ sm: "200px", md: "400px" }}>
                  <Show above="sm">
                    &lt; Back to{" "}
                    {folder.parentFolder
                      ? folder.parentFolder.name
                      : `Curation`}
                  </Show>
                  <Hide above="sm">&lt; Back</Hide>
                </Text>
              </Link>
            </Box>
          ) : null}
          <Spacer />
          <ToggleViewButtonGroup
            listView={listView}
            setListView={setListView}
            fetcher={fetcher}
          />
        </Flex>
      </VStack>
    </Box>
  );

  const searchResultsHeading = haveQuery ? (
    <Flex
      width="100%"
      background="lightgray"
      fontSize="large"
      alignItems="center"
      padding="5px"
    >
      <Spacer />
      Search results for: {query}
      <Spacer />
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

  const emptyMessage = haveQuery ? "No Results Found" : "No Activities Yet";

  const cardContent: CardContent[] = content.map((activity, position) => {
    const getCardMenuRef = (element: HTMLButtonElement) => {
      cardMenuRefs.current[position] = element;
    };
    const justCreated = folderJustCreated === activity.id;
    if (justCreated) {
      folderJustCreated = "";
    }

    return {
      menuRef: getCardMenuRef,
      ...activity,
      title: activity.name,
      closeTime: formatTime(activity.codeValidUntil),
      menuItems: getCardMenuList({
        id: activity.id,
        name: activity.name,
        position,
        numCards: content.length,
        assignmentStatus: activity.assignmentStatus,
        isPublic: activity.isPublic,
        isShared: activity.isShared,
        sharedWith: activity.sharedWith,
        licenseCode: activity.license?.code ?? null,
        parentFolderId: activity.parentFolder?.id ?? null,
        libraryActivity: activity.libraryActivity!,
        isFolder: activity.isFolder!,
      }),
      cardLink: activity.isFolder
        ? `/curation/${activity.id}`
        : `/activityEditor/${activity.id}`,
      editableTitle: true,
      autoFocusTitle: justCreated,
      cardType: activity.isFolder ? "folder" : "activity",
    };
  });

  const mainPanel = (
    <CardList
      showOwnerName={false}
      showAssignmentStatus={true}
      showPublicStatus={true}
      showActivityFeatures={true}
      emptyMessage={emptyMessage}
      listView={listView}
      content={cardContent}
      editableTitles={true}
    />
  );

  return (
    <>
      {settingsDrawer}
      {curateDrawer}
      {moveContentModal}

      {heading}

      {searchResultsHeading}

      <Flex
        data-test="Activities"
        padding="0 10px"
        margin="0px"
        width="100%"
        background={
          listView && content.length > 0 ? "white" : "var(--lightBlue)"
        }
        minHeight="calc(100vh - 189px)"
        direction="column"
      >
        {mainPanel}
      </Flex>
    </>
  );
}
