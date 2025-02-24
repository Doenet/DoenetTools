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
  CloseButton,
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
import {
  MoveCopyContent,
  moveCopyContentActions,
} from "../ToolPanels/MoveCopyContent";
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
  ContentDescription,
  ContentFeature,
  Content,
  ContentType,
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
import {
  contentTypeToName,
  getAllowedParentTypes,
  menuIcons,
} from "../../../_utils/activity";
import {
  CreateFolderModal,
  createFolderModalActions,
} from "../ToolPanels/CreateFolderModal";
import { DeleteModal, deleteModalActions } from "../ToolPanels/DeleteModal";
import {
  AddContentToMenu,
  addContentToMenuActions,
} from "../ToolPanels/AddContentToMenu";
import { CreateContentMenu } from "../ToolPanels/CreateContentMenu";
import { CopyContentAndReportFinish } from "../ToolPanels/CopyContentAndReportFinish";

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

  const resultMC = await moveCopyContentActions({ formObj });
  if (resultMC) {
    return resultMC;
  }

  const resultTLV = await toggleViewButtonGroupActions({ formObj });
  if (resultTLV) {
    return resultTLV;
  }

  const resultCF = await createFolderModalActions({ formObj });
  if (resultCF) {
    return resultCF;
  }

  const resultDM = await deleteModalActions({ formObj });
  if (resultDM) {
    return resultDM;
  }

  const resultACM = await addContentToMenuActions({ formObj });
  if (resultACM) {
    return resultACM;
  }

  if (formObj?._action == "Add Activity") {
    //Create an activity and redirect to the editor for it
    const { data } = await axios.post(`/api/updateContent/createContent`, {
      contentType: formObj.type,
      parentId: params.parentId,
    });

    const { contentId } = data;
    return redirect(`/activityEditor/${contentId}`);
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

  console.log(data);

  const prefData = await axios.get(`/api/contentList/getPreferredFolderView`);
  const listViewPref = !prefData.data.cardView;

  const addToId = url.searchParams.get("addTo");
  let addTo: ContentDescription | undefined = undefined;

  if (addToId) {
    try {
      const { data } = await axios.get(`/api/getContentDescription/${addToId}`);
      addTo = data;
    } catch (_e) {
      console.error(`Could not get description of ${addToId}`);
    }
  }

  return {
    parentId: params.parentId ? params.parentId : null,
    content: data.content,
    allDoenetmlVersions: data.allDoenetmlVersions,
    allLicenses: data.allLicenses,
    availableFeatures: data.availableFeatures,
    userId: params.userId,
    folder: data.folder,
    listViewPref,
    query: q,
    addTo,
  };
}

export function Activities() {
  const {
    parentId,
    content,
    allDoenetmlVersions,
    allLicenses,
    availableFeatures,
    userId,
    folder,
    listViewPref,
    query,
    addTo,
  } = useLoaderData() as {
    parentId: string | null;
    content: Content[];
    allDoenetmlVersions: DoenetmlVersion[];
    allLicenses: License[];
    availableFeatures: ContentFeature[];
    userId: string;
    folder: Content | null;
    listViewPref: boolean;
    query: string | null;
    addTo: ContentDescription | undefined;
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

  const [selectedCards, setSelectedCards] = useState<ContentDescription[]>([]);
  const numSelected = selectedCards.length;

  useEffect(() => {
    setSelectedCards((was) => {
      let foundMissing = false;
      const newList = content.map((c) => c.contentId);
      for (const c of was) {
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
  }, [content]);

  function selectCardCallback({
    contentId,
    name,
    checked,
    type,
  }: {
    contentId: string;
    name: string;
    checked: boolean;
    type: ContentType;
  }) {
    setSelectedCards((was) => {
      const arr = [...was];
      const idx = was.findIndex((c) => c.contentId === contentId);
      if (checked) {
        if (idx === -1) {
          arr.push({ contentId, name, type });
        } else {
          arr[idx] = { contentId, name, type };
        }
      } else if (idx !== -1) {
        arr.splice(idx, 1);
      }
      return arr;
    });
  }

  const [moveToFolderData, setMoveToFolderData] = useState<{
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

  const [displaySettingsTab, setSettingsDisplayTab] =
    useState<"general">("general");
  const [highlightRename, setHighlightRename] = useState(false);

  useEffect(() => {
    document.title = `Activities - Doenet`;
  }, []);

  const fetcher = useFetcher();

  function getCardMenuList({
    contentId,
    name,
    position,
    numCards,
    assignmentStatus,
    contentType,
    isPublic,
    isShared,
    sharedWith,
    licenseCode,
    parentId,
  }: {
    contentId: string;
    name: string;
    position: number;
    numCards: number;
    assignmentStatus: AssignmentStatus;
    contentType: ContentType;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
    licenseCode: LicenseCode | null;
    parentId: string | null;
  }) {
    const contentTypeName = contentTypeToName[contentType];

    return (
      <>
        <MenuItem
          data-test="Rename Menu Item"
          onClick={() => {
            setSettingsContentId(contentId);
            setSettingsDisplayTab("general");
            setHighlightRename(true);
            settingsOnOpen();
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          data-test={"Duplicate Content"}
          onClick={() => {
            fetcher.submit(
              {
                _action: "Duplicate Content",
                contentId,
                parentId,
              },
              { method: "post" },
            );
          }}
        >
          Duplicate {contentTypeName}
        </MenuItem>
        {position > 0 && !haveQuery ? (
          <MenuItem
            data-test="Move Left Menu Item"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "Move",
                  contentId,
                  desiredPosition: position - 1,
                  parentId,
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
                  contentId,
                  desiredPosition: position + 1,
                  parentId,
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
                contentId,
                name,
                type: contentType,
                isPublic,
                isShared,
                sharedWith,
                licenseCode,
              });
              moveCopyContentOnOpen();
            }}
          >
            Move&hellip;
          </MenuItem>
        )}
        <MenuItem
          data-test="Delete Menu Item"
          onClick={() => {
            setSettingsContentId(contentId);
            deleteContentOnOpen();
          }}
        >
          Delete
        </MenuItem>
        {contentType !== "folder" ? (
          <MenuItem
            data-test="Assign Activity Menu Item"
            onClick={() => {
              setSettingsContentId(contentId);
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
            setSettingsContentId(contentId);
            sharingOnOpen();
          }}
        >
          Share
        </MenuItem>
        <MenuItem
          data-test="Settings Menu Item"
          onClick={() => {
            setSettingsContentId(contentId);
            setSettingsDisplayTab("general");
            setHighlightRename(false);
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
                `/activities/${userId}${parentId ? "/" + parentId : ""}`,
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

  let contentData: Content | undefined;
  if (settingsContentId) {
    if (folder && settingsContentId === parentId) {
      contentData = folder;
      finalFocusRef.current = folderSettingsRef.current;
    } else {
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
        highlightRename={highlightRename}
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
        contentId={settingsContentId}
        contentData={contentData}
        finalFocusRef={finalFocusRef}
        fetcher={fetcher}
      />
    ) : null;

  const moveCopyContentModal = (
    <MoveCopyContent
      isOpen={moveCopyContentIsOpen}
      onClose={moveCopyContentOnClose}
      sourceContent={[moveToFolderData]}
      userId={userId}
      currentParentId={parentId}
      finalFocusRef={finalFocusRef}
      allowedParentTypes={getAllowedParentTypes([moveToFolderData.type])}
      action="Move"
    />
  );

  const createFolderModal = (
    <CreateFolderModal
      isOpen={createFolderIsOpen}
      onClose={createFolderOnClose}
      parentFolder={parentId}
      fetcher={fetcher}
      finalFocusRef={finalFocusRef}
    />
  );

  const deleteModal =
    contentData && settingsContentId ? (
      <DeleteModal
        isOpen={deleteContentIsOpen}
        onClose={deleteContentOnClose}
        content={contentData}
        fetcher={fetcher}
        finalFocusRef={finalFocusRef}
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
        contentIds={selectedCards.map((sc) => sc.contentId)}
        desiredParent={addTo}
        action="Add"
      />
    ) : null;

  const heading = (
    <Box
      backgroundColor="#fff"
      color="#000"
      height={{ base: "170px", md: "180px" }}
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
        <Flex
          width="100%"
          height="40px"
          justifyContent="center"
          alignItems="center"
        >
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
                  label="Copy selected to"
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
        </Flex>
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
                    createFolderOnOpen();
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

            {parentId !== null ? (
              <Button
                colorScheme="blue"
                size="sm"
                ref={folderSettingsRef}
                onClick={() => {
                  setSettingsContentId(parentId);
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
                  `/allAssignmentScores${parentId ? "/" + parentId : ""}`,
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
                to={`/activities/${userId}${folder.parent ? "/" + folder.parent.contentId : ""}`}
                style={{
                  color: "var(--mainBlue)",
                }}
              >
                <Text noOfLines={1} maxWidth={{ sm: "200px", md: "400px" }}>
                  <Show above="sm">
                    &lt; Back to{" "}
                    {folder.parent ? folder.parent.name : `My Activities`}
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
      closeTime: formatTime(activity.assignmentInfo?.codeValidUntil ?? null),
      menuItems: getCardMenuList({
        contentId: activity.contentId,
        name: activity.name,
        position,
        numCards: content.length,
        assignmentStatus:
          activity.assignmentInfo?.assignmentStatus ?? "Unassigned",
        contentType: activity.type,
        isPublic: activity.isPublic,
        isShared: activity.isShared,
        sharedWith: activity.sharedWith,
        licenseCode: activity.license?.code ?? null,
        parentId: activity.parent?.contentId ?? null,
      }),
      cardLink:
        activity.type === "folder"
          ? `/activities/${activity.ownerId}/${activity.contentId}`
          : `/activityEditor/${activity.contentId}`,
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
      selectedCards={selectedCards.map((c) => c.contentId)}
      selectCallback={selectCardCallback}
      disableSelectFor={addTo ? [addTo.contentId] : undefined}
    />
  );

  return (
    <>
      {settingsDrawer}
      {shareDrawer}
      {assignmentDrawer}
      {moveCopyContentModal}
      {createFolderModal}
      {deleteModal}
      {copyContentModal}

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
        minHeight={{ base: "calc(100vh - 225px)", md: "calc(100vh - 235px)" }}
        direction="column"
      >
        {mainPanel}
      </Flex>
    </>
  );
}
