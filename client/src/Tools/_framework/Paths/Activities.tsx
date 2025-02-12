import {
  Button,
  Box,
  Text,
  Flex,
  useDisclosure,
  MenuItem,
  Heading,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
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
  redirect,
  useLoaderData,
  useNavigate,
  useFetcher,
  Link,
  Form,
} from "react-router";

import { CardContent } from "../../../Widgets/Card";
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
  assignmentSettingsActions,
  AssignmentSettingsDrawer,
} from "../ToolPanels/AssignmentSettingsDrawer";
import {
  AssignmentStatus,
  ContentFeature,
  ContentStructure,
  DoenetmlVersion,
  License,
  LicenseCode,
  UserInfo,
} from "./../../../_utils/types";
import { MdClose, MdOutlineSearch } from "react-icons/md";
import { ShareDrawer, shareDrawerActions } from "../ToolPanels/ShareDrawer";
import { formatTime } from "../../../_utils/dateUtilityFunction";
import {
  ToggleViewButtonGroup,
  toggleViewButtonGroupActions,
} from "../ToolPanels/ToggleViewButtonGroup";

export async function action({ request, params }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  const resultCS = await contentSettingsActions({ formObj });
  if (resultCS) {
    return resultCS;
  }

  const resultSD = await shareDrawerActions({ formObj });
  if (resultSD) {
    return resultSD;
  }
  const resultAS = await assignmentSettingsActions({ formObj });
  if (resultAS) {
    return resultAS;
  }

  const resultMC = await moveContentActions({ formObj });
  if (resultMC) {
    return resultMC;
  }

  const resultTLV = await toggleViewButtonGroupActions({ formObj });
  if (resultTLV) {
    return resultTLV;
  }

  if (formObj?._action == "Add Activity") {
    //Create an activity and redirect to the editor for it
    const { data } = await axios.post(
      `/api/createActivity/${params.folderId ?? ""}`,
      { type: formObj.type },
    );

    const { activityId } = data;
    return redirect(`/activityEditor/${activityId}`);
  } else if (formObj?._action == "Add Folder") {
    await axios.post(`/api/createFolder/${params.folderId ?? ""}`);

    return true;
  } else if (formObj?._action == "Delete Activity") {
    await axios.post(`/api/deleteActivity`, {
      activityId: formObj.id,
    });

    return true;
  } else if (formObj?._action == "Delete Folder") {
    await axios.post(`/api/deleteFolder`, {
      folderId: formObj.id === "null" ? null : formObj.id,
    });

    return true;
  } else if (formObj?._action == "Duplicate Activity") {
    await axios.post(`/api/duplicateActivity`, {
      activityId: formObj.id,
      desiredParentFolderId:
        formObj.folderId === "null" ? null : formObj.folderId,
    });
    return true;
  } else if (formObj?._action == "Move") {
    await axios.post(`/api/moveContent`, {
      id: formObj.id,
      desiredParentFolderId:
        formObj.folderId === "null" ? null : formObj.folderId,
      desiredPosition: formObj.desiredPosition,
    });
    return true;
  } else if (formObj?._action == "Set List View Preferred") {
    await axios.post(`/api/setPreferredFolderView`, {
      cardView: formObj.listViewPref === "false",
    });
    return true;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  let data;
  if (q) {
    const results = await axios.get(
      `/api/searchMyFolderContent/${params.userId}/${params.folderId ?? ""}?q=${q}`,
    );
    data = results.data;
  } else {
    const results = await axios.get(
      `/api/getMyFolderContent/${params.userId}/${params.folderId ?? ""}`,
    );
    data = results.data;
  }

  if (data.notMe) {
    return redirect(
      `/sharedActivities/${params.userId}${params.folderId ? "/" + params.folderId : ""}`,
    );
  }

  const prefData = await axios.get(`/api/getPreferredFolderView`);
  const listViewPref = !prefData.data.cardView;

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

export function Activities() {
  const {
    folderId,
    content,
    allDoenetmlVersions,
    allLicenses,
    availableFeatures,
    userId,
    folder,
    listViewPref,
    query,
  } = useLoaderData() as {
    folderId: string | null;
    content: ContentStructure[];
    allDoenetmlVersions: DoenetmlVersion[];
    allLicenses: License[];
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
    isOpen: sharingIsOpen,
    onOpen: sharingOnOpen,
    onClose: sharingOnClose,
  } = useDisclosure();

  const {
    isOpen: assignmentSettingsAreOpen,
    onOpen: assignmentSettingsOnOpen,
    onClose: assignmentSettingsOnClose,
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
    document.title = `Activities - Doenet`;
  }, []);

  const fetcher = useFetcher();

  function getCardMenuList({
    id,
    position,
    numCards,
    assignmentStatus,
    isFolder,
    isPublic,
    isShared,
    sharedWith,
    licenseCode,
    parentFolderId,
  }: {
    id: string;
    position: number;
    numCards: number;
    assignmentStatus: AssignmentStatus;
    isFolder?: boolean;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
    licenseCode: LicenseCode | null;
    parentFolderId: string | null;
  }) {
    return (
      <>
        {!isFolder ? (
          <>
            <MenuItem
              data-test={"Duplicate Activity"}
              onClick={() => {
                fetcher.submit(
                  { _action: "Duplicate Activity", id, folderId },
                  { method: "post" },
                );
              }}
            >
              Duplicate Activity
            </MenuItem>
          </>
        ) : null}
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
        <MenuItem
          data-test="Delete Menu Item"
          onClick={() => {
            fetcher.submit(
              { _action: isFolder ? "Delete Folder" : "Delete Activity", id },
              { method: "post" },
            );
          }}
        >
          Delete
        </MenuItem>
        {!isFolder ? (
          <MenuItem
            data-test="Assign Activity Menu Item"
            onClick={() => {
              setSettingsContentId(id);
              assignmentSettingsOnOpen();
            }}
          >
            {assignmentStatus === "Unassigned"
              ? "Assign Activity"
              : "Manage Assignment"}
          </MenuItem>
        ) : null}
        <MenuItem
          data-test="Share Menu Item"
          onClick={() => {
            setSettingsContentId(id);
            sharingOnOpen();
          }}
        >
          Share
        </MenuItem>
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
                `/activities/${userId}${parentFolderId ? "/" + parentFolderId : ""}`,
              );
            }}
          >
            Go to containing folder
          </MenuItem>
        ) : null}
      </>
    );
  }

  const folderType =
    folder?.type === "select"
      ? "Select Activity"
      : folder?.type === "sequence"
        ? "Sequence Activity"
        : "Folder";

  const headingText = folder ? (
    <>
      {folder.isPublic ? "Public " : ""}
      {folderType}: {folder.name}
    </>
  ) : (
    `My Activities`
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

  const shareDrawer =
    contentData && settingsContentId ? (
      <ShareDrawer
        isOpen={sharingIsOpen}
        onClose={sharingOnClose}
        contentData={contentData}
        allLicenses={allLicenses}
        finalFocusRef={finalFocusRef}
        fetcher={fetcher}
      />
    ) : null;
  const assignmentDrawer =
    contentData && settingsContentId ? (
      <AssignmentSettingsDrawer
        isOpen={assignmentSettingsAreOpen}
        onClose={assignmentSettingsOnClose}
        id={settingsContentId}
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
                  placeholder={
                    folder ? `Search in folder` : `Search my activities`
                  }
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
                  label={folder ? `Search in folder` : `Search my activities`}
                  placement="bottom-end"
                >
                  <IconButton
                    size="sm"
                    colorScheme="blue"
                    icon={<MdOutlineSearch />}
                    aria-label={
                      folder ? `Search in folder` : `Search my activities`
                    }
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
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                colorScheme="blue"
                hidden={searchOpen}
                data-test="New Button"
              >
                {haveContentSpinner ? <Spinner size="sm" /> : "New"}
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
                  Document
                </MenuItem>
                <MenuItem
                  data-test="Add Problem Set Button"
                  onClick={async () => {
                    setHaveContentSpinner(true);
                    fetcher.submit(
                      { _action: "Add Activity", type: "sequence" },
                      { method: "post" },
                    );
                  }}
                >
                  Problem Set
                </MenuItem>
                <MenuItem
                  data-test="Add Folder Button"
                  onClick={() => {
                    setHaveContentSpinner(true);
                    fetcher.submit(
                      { _action: "Add Folder" },
                      { method: "post" },
                    );
                  }}
                >
                  Folder
                </MenuItem>
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
                  Question Bank
                </MenuItem>
              </MenuList>
            </Menu>

            {folderId !== null ? (
              <Button
                colorScheme="blue"
                size="sm"
                ref={folderSettingsRef}
                onClick={() => {
                  setSettingsContentId(folderId);
                  sharingOnOpen();
                }}
                hidden={searchOpen}
              >
                Share
              </Button>
            ) : null}
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() =>
                navigate(
                  `/allAssignmentScores${folderId ? "/" + folderId : ""}`,
                )
              }
              hidden={searchOpen}
            >
              See Scores
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
                to={`/activities/${userId}${folder.parentFolder ? "/" + folder.parentFolder.id : ""}`}
                style={{
                  color: "var(--mainBlue)",
                }}
              >
                <Text noOfLines={1} maxWidth={{ sm: "200px", md: "400px" }}>
                  <Show above="sm">
                    &lt; Back to{" "}
                    {folder.parentFolder
                      ? folder.parentFolder.name
                      : `My Activities`}
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

    return {
      menuRef: getCardMenuRef,
      content: activity,
      closeTime: formatTime(activity.codeValidUntil),
      menuItems: getCardMenuList({
        id: activity.id,
        position,
        numCards: content.length,
        assignmentStatus: activity.assignmentStatus,
        isPublic: activity.isPublic,
        isFolder: activity.isFolder,
        isShared: activity.isShared,
        sharedWith: activity.sharedWith,
        licenseCode: activity.license?.code ?? null,
        parentFolderId: activity.parentFolder?.id ?? null,
      }),
      cardLink:
        activity.type === "folder"
          ? `/activities/${activity.ownerId}/${activity.id}`
          : `/activityEditor/${activity.id}`,
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
    />
  );

  return (
    <>
      {settingsDrawer}
      {shareDrawer}
      {assignmentDrawer}
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
