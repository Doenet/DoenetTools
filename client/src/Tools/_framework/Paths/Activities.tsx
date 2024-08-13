import {
  Button,
  Box,
  Icon,
  Text,
  Flex,
  Wrap,
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
} from "react-router-dom";

import { RiEmotionSadLine } from "react-icons/ri";
import ContentCard, { contentCardActions } from "../../../Widgets/ContentCard";
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
  ContentStructure,
  DoenetmlVersion,
  License,
  LicenseCode,
  UserInfo,
} from "./ActivityEditor";
import { DateTime } from "luxon";
import { MdClose, MdOutlineSearch } from "react-icons/md";
import { ShareDrawer, shareDrawerActions } from "../ToolPanels/ShareDrawer";

// what is a better solution than this?
let folderJustCreated = -1; // if a folder was just created, set autoFocusName true for the card with the matching id

export async function action({ request, params }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  let resultCS = await contentSettingsActions({ formObj });
  if (resultCS) {
    return resultCS;
  }

  let resultSD = await shareDrawerActions({ formObj });
  if (resultSD) {
    return resultSD;
  }
  let resultAS = await assignmentSettingsActions({ formObj });
  if (resultAS) {
    return resultAS;
  }

  let resultCC = await contentCardActions({ formObj });
  if (resultCC) {
    return resultCC;
  }

  let resultMC = await moveContentActions({ formObj });
  if (resultMC) {
    return resultMC;
  }

  if (formObj?._action == "Add Activity") {
    //Create an activity and redirect to the editor for it
    let { data } = await axios.post(
      `/api/createActivity/${params.folderId ?? ""}`,
    );

    let { activityId, docId } = data;
    return redirect(`/activityEditor/${activityId}`);
  } else if (formObj?._action == "Add Folder") {
    let { data } = await axios.post(
      `/api/createFolder/${params.folderId ?? ""}`,
    );
    folderJustCreated = data.folderId;

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
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  let data;
  if (q) {
    let results = await axios.get(
      `/api/searchMyFolderContent/${params.userId}/${params.folderId ?? ""}?q=${q}`,
    );
    data = results.data;
  } else {
    let results = await axios.get(
      `/api/getMyFolderContent/${params.userId}/${params.folderId ?? ""}`,
    );
    data = results.data;

    if (data.notMe) {
      return redirect(
        `/sharedActivities/${params.userId}${params.folderId ? "/" + params.folderId : ""}`,
      );
    }
  }

  return {
    folderId: params.folderId ? Number(params.folderId) : null,
    content: data.content,
    allDoenetmlVersions: data.allDoenetmlVersions,
    allLicenses: data.allLicenses,
    userId: params.userId,
    folder: data.folder,
    query: q,
  };
}

export function Activities() {
  let {
    folderId,
    content,
    allDoenetmlVersions,
    allLicenses,
    userId,
    folder,
    query,
  } = useLoaderData() as {
    folderId: number | null;
    content: ContentStructure[];
    allDoenetmlVersions: DoenetmlVersion[];
    allLicenses: License[];
    userId: number;
    folder: ContentStructure | null;
    query: string | null;
  };
  const [settingsContentId, setSettingsContentId] = useState<number | null>(
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

  const contentCardRefs = useRef(new Array());
  const folderSettingsRef = useRef(null);
  const finalFocusRef = useRef(null);

  const [haveContentSpinner, setHaveContentSpinner] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchString, setSearchString] = useState(query ?? "");
  const searchRef = useRef<HTMLInputElement>(null);
  const searchBlurTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const haveQuery = Boolean(query);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    setHaveContentSpinner(false);
  }, [content]);

  const navigate = useNavigate();

  const [moveToFolderContent, setMoveToFolderContent] = useState<{
    id: number;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
    licenseCode: LicenseCode | null;
  }>({
    id: -1,
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
    id: number;
    position: number;
    numCards: number;
    assignmentStatus: AssignmentStatus;
    isFolder?: boolean;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
    licenseCode: LicenseCode | null;
    parentFolderId: number | null;
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
            Move Left
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
            Move Right
          </MenuItem>
        ) : null}
        {haveQuery ? null : (
          <MenuItem
            data-test="Move to Folder"
            onClick={() => {
              setMoveToFolderContent({
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

  let headingText = folder ? (
    <>
      {folder.isPublic ? "Public " : ""}Folder: {folder.name}
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
      let index = content.findIndex((obj) => obj.id == settingsContentId);
      if (index != -1) {
        contentData = content[index];
        finalFocusRef.current = contentCardRefs.current[index];
      } else {
        //Throw error not found
      }
    }
  }

  let settingsDrawer =
    contentData && settingsContentId ? (
      <ContentSettingsDrawer
        isOpen={settingsAreOpen}
        onClose={settingsOnClose}
        id={settingsContentId}
        contentData={contentData}
        allDoenetmlVersions={allDoenetmlVersions}
        finalFocusRef={finalFocusRef}
        fetcher={fetcher}
        displayTab={displaySettingsTab}
      />
    ) : null;

  let shareDrawer =
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
  let assignmentDrawer =
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
  return (
    <>
      {settingsDrawer}
      {shareDrawer}
      {assignmentDrawer}

      <MoveContentToFolder
        isOpen={moveToFolderIsOpen}
        onClose={moveToFolderOnClose}
        id={moveToFolderContent.id}
        isPublic={moveToFolderContent.isPublic}
        isShared={moveToFolderContent.isShared}
        sharedWith={moveToFolderContent.sharedWith}
        licenseCode={moveToFolderContent.licenseCode}
        userId={userId}
        currentParentId={folderId}
        finalFocusRef={finalFocusRef}
      />

      <Box
        backgroundColor="#fff"
        color="#000"
        height="80px"
        width="100%"
        textAlign="center"
      >
        <Tooltip label={headingText}>
          <Heading as="h2" size="lg" paddingTop=".5em" noOfLines={1}>
            {headingText}
          </Heading>
        </Tooltip>
        <Flex float="right">
          <Flex>
            <Form>
              <Input
                type="search"
                hidden={!searchOpen}
                size="xs"
                margin="3px"
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
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                  }
                }}
                onBlur={() => {
                  searchBlurTimeout.current = setTimeout(() => {
                    setSearchOpen(false);
                  }, 200);
                }}
              />
              <Tooltip
                label={folder ? `Search in folder` : `Search my activities`}
                placement="bottom-end"
              >
                <IconButton
                  size="xs"
                  margin="3px"
                  icon={<MdOutlineSearch />}
                  aria-label={
                    folder ? `Search in folder` : `Search my activities`
                  }
                  type="submit"
                  onClick={(e) => {
                    if (searchOpen) {
                      clearTimeout(searchBlurTimeout.current);
                      searchRef.current?.focus();
                    } else {
                      setSearchOpen(true);
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
              size="xs"
              margin="3px"
              hidden={searchOpen || haveQuery}
            >
              {haveContentSpinner ? <Spinner size="sm" /> : "New"}
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={async () => {
                  setHaveContentSpinner(true);
                  //Create an activity and redirect to the editor for it
                  // let { data } = await axios.post("/api/createActivity");
                  // let { activityId } = data;
                  // navigate(`/activityEditor/${activityId}`);

                  // TODO - review this, elsewhere the fetcher is being used, and
                  // there was code up in the action() method for this action
                  // that was unused. This appears to work okay though? And it
                  // would make it consistent with how API requests are done elsewhere
                  fetcher.submit(
                    { _action: "Add Activity" },
                    { method: "post" },
                  );
                }}
              >
                Activity
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setHaveContentSpinner(true);
                  fetcher.submit({ _action: "Add Folder" }, { method: "post" });
                }}
              >
                Folder
              </MenuItem>
            </MenuList>
          </Menu>

          {folderId !== null ? (
            <Button
              margin="3px"
              size="xs"
              ref={folderSettingsRef}
              onClick={() => {
                setSettingsContentId(folderId);
                sharingOnOpen();
              }}
              hidden={searchOpen || haveQuery}
            >
              Share
            </Button>
          ) : null}
          <Button
            margin="3px"
            size="xs"
            onClick={() =>
              navigate(`/allAssignmentScores${folderId ? "/" + folderId : ""}`)
            }
            hidden={searchOpen || haveQuery}
          >
            See Scores
          </Button>
        </Flex>
      </Box>
      {folder && !haveQuery ? (
        <Box style={{ marginLeft: "15px", marginTop: "-30px", float: "left" }}>
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
      {haveQuery ? (
        <Flex
          width="100%"
          background="lightgray"
          fontSize="large"
          justifyContent="center"
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
      ) : null}
      <Flex
        data-test="Activities"
        padding="10px"
        margin="0px"
        width="100%"
        justifyContent="center"
        background="var(--lightBlue)"
        minHeight="calc(100vh - 120px)"
      >
        <Wrap p="10px" overflow="visible">
          {content.length < 1 ? (
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              minHeight={200}
              background="doenet.canvas"
              padding={20}
              width="100%"
              backgroundColor="transparent"
            >
              <Icon fontSize="48pt" as={RiEmotionSadLine} />
              <Text fontSize="36pt">
                {haveQuery ? "No Results Found" : "No Activities Yet"}
              </Text>
            </Flex>
          ) : (
            <>
              {content.map((activity, position) => {
                const getCardRef = (element) => {
                  contentCardRefs.current[position] = element;
                };
                return (
                  <ContentCard
                    key={`Card${activity.id}`}
                    ref={getCardRef}
                    {...activity}
                    title={activity.name}
                    menuItems={getCardMenuList({
                      id: activity.id,
                      position,
                      numCards: content.length,
                      assignmentStatus: activity.assignmentStatus,
                      isFolder: activity.isFolder,
                      isPublic: activity.isPublic,
                      isShared: activity.isShared,
                      sharedWith: activity.sharedWith,
                      licenseCode: activity.license?.code ?? null,
                      parentFolderId: activity.parentFolder?.id ?? null,
                    })}
                    suppressAvatar={true}
                    showOwnerName={false}
                    cardLink={
                      activity.isFolder
                        ? `/activities/${activity.ownerId}/${activity.id}`
                        : `/activityEditor/${activity.id}`
                    }
                    editableTitle={true}
                    autoFocusTitle={folderJustCreated === activity.id}
                  />
                );
              })}
            </>
          )}
        </Wrap>
      </Flex>
    </>
  );
}
