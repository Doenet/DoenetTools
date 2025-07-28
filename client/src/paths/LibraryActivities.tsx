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
  MenuDivider,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useFetcher,
  Link,
  Form,
  ActionFunctionArgs,
} from "react-router";

import { CardContent } from "../widgets/Card";
import CardList from "../widgets/CardList";
import axios from "axios";
import {
  MoveCopyContent,
  moveCopyContentActions,
} from "../popups/MoveCopyContent";
import { Content, LicenseCode, UserInfo, ContentType } from "../types";
import { MdClose, MdOutlineSearch } from "react-icons/md";
import { getAllowedParentTypes } from "../utils/activity";
import {
  CreateLocalContent,
  createLocalContentActions,
} from "../popups/CreateLocalContent";
import { editorUrl } from "../utils/url";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  const resultMC = await moveCopyContentActions({ formObj });
  if (resultMC) {
    return resultMC;
  }

  const resultCF = await createLocalContentActions({ formObj });
  if (resultCF) {
    return resultCF;
  }

  if (formObj?._action == "Delete Draft") {
    await axios.post(`/api/curate/deleteDraftFromLibrary`, {
      contentId: formObj.contentId,
      contentType: formObj.contentType,
    });
    return true;

    // TODO: Figure out how to delete folders in library (some activities may be published)
    // One idea is that you can only delete folders that are empty (or have only drafts?)

    // } else if (formObj?._action == "Delete Folder") {
    //   await axios.post(`/api/deleteCurationFolder`, {
    //     folderId: formObj.contentId === "null" ? null : formObj.contentId,
    //   });
    //   return true;
  } else if (formObj?._action == "Move") {
    await axios.post(`/api/copyMove/moveContent`, {
      contentId: formObj.contentId,
      parentId: formObj.folderId === "null" ? null : formObj.folderId,
      desiredPosition: Number(formObj.desiredPosition),
    });
    return true;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({
  params,
  request,
}: {
  params: any;
  request: any;
}) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  let data;
  if (q) {
    const results = await axios.get(
      `/api/curate/searchCurationFolderContent/${params.parentId ?? ""}?query=${q}`,
    );
    data = results.data;
  } else {
    const results = await axios.get(
      `/api/curate/getCurationFolderContent/${params.parentId ?? ""}`,
    );
    data = results.data;
  }

  return {
    folderId: params.parentId ?? null,
    content: data.content,
    libraryRelations: data.libraryRelations,
    allDoenetmlVersions: data.allDoenetmlVersions,
    allLicenses: data.allLicenses,
    allContentFeatures: data.allContentFeatures,
    userId: params.userId,
    parent: data.parent,
    query: q,
  };
}

export function LibraryActivities() {
  const { folderId, content, userId, parent, query } = useLoaderData() as {
    folderId: string | null;
    content: Content[];
    userId: string;
    parent: Content | null;
    query: string | null;
  };
  const {
    isOpen: createFolderIsOpen,
    onOpen: createFolderOnOpen,
    onClose: createFolderOnClose,
  } = useDisclosure();

  // refs to the menu button of each content card,
  // which should be given focus when drawers are closed
  const cardMenuRefs = useRef<HTMLButtonElement[]>([]);

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

  const [moveToParentData, setMoveToParentData] = useState<{
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
    document.title = `${parent?.name ?? "Library Activities"} - Doenet`;
  }, [parent]);

  const fetcher = useFetcher();

  function getCardMenuList({
    contentId,
    name,
    position,
    numCards,
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
    contentType: ContentType;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
    licenseCode: LicenseCode | null;
    parentId: string | null;
  }) {
    return (
      <>
        {position > 0 && !haveQuery ? (
          <MenuItem
            data-test="Move Up Menu Item"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "Move",
                  contentId,
                  desiredPosition: position - 1,
                  folderId,
                },
                { method: "post" },
              );
            }}
          >
            Move Up
          </MenuItem>
        ) : null}
        {position < numCards - 1 && !haveQuery ? (
          <MenuItem
            data-test="Move Down Menu Item"
            onClick={() => {
              fetcher.submit(
                {
                  _action: "Move",
                  contentId,
                  desiredPosition: position + 1,
                  folderId,
                },
                { method: "post" },
              );
            }}
          >
            Move Down
          </MenuItem>
        ) : null}
        {haveQuery ? null : (
          <MenuItem
            data-test="Move to Parent"
            onClick={() => {
              setMoveToParentData({
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
        {haveQuery ? (
          <MenuItem
            data-test="Go to containing folder"
            onClick={() => {
              navigate(`/libraryActivities/${parentId ? "/" + parentId : ""}`);
            }}
          >
            Go to containing folder
          </MenuItem>
        ) : null}
        <MenuDivider />
        {contentType !== "folder" && !isPublic ? (
          <>
            <MenuDivider />
            <MenuItem
              data-test="Delete Draft"
              onClick={() => {
                fetcher.submit(
                  {
                    _action: "Delete Draft",
                    contentId,
                    contentType,
                  },
                  { method: "post" },
                );
              }}
            >
              Move to trash
            </MenuItem>
          </>
        ) : null}
      </>
    );
  }

  const folderType =
    parent?.type === "select"
      ? "Select Activity"
      : parent?.type === "sequence"
        ? "Sequence Activity"
        : "Folder";

  const headingText = parent ? (
    <>
      Library {parent.isPublic ? "Public " : ""}
      {folderType}: {parent.name}
    </>
  ) : (
    `Library Activities`
  );

  const moveCopyContentModal = (
    <MoveCopyContent
      inCurationLibrary={true}
      isOpen={moveCopyContentIsOpen}
      onClose={moveCopyContentOnClose}
      sourceContent={[moveToParentData]}
      userId={userId}
      currentParentId={folderId}
      finalFocusRef={finalFocusRef}
      allowedParentTypes={getAllowedParentTypes([moveToParentData.type])}
      action="Move"
    />
  );

  const createLocalContentModal = (
    <CreateLocalContent
      inCurationLibrary={true}
      isOpen={createFolderIsOpen}
      onClose={createFolderOnClose}
      contentType="folder"
      parentId={folderId}
      fetcher={fetcher}
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
      <Flex
        width="100%"
        paddingRight="0.5em"
        paddingLeft="1em"
        alignItems="middle"
      >
        <Box marginTop="5px" height="24px">
          {parent && !haveQuery ? (
            <Link
              to={`/libraryActivities${parent.parent ? "/" + parent.parent.contentId : ""}`}
              style={{
                color: "var(--mainBlue)",
              }}
            >
              <Text
                noOfLines={1}
                maxWidth={{ sm: "200px", md: "400px" }}
                textAlign="left"
              >
                <Show above="sm">
                  &lt; Back to{" "}
                  {parent.parent ? parent.parent.name : `Library Activities`}
                </Show>
                <Hide above="sm">&lt; Back</Hide>
              </Text>
            </Link>
          ) : null}
        </Box>
      </Flex>

      <Heading
        as="h2"
        size="lg"
        marginBottom=".5em"
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
                    parent ? `Search in folder` : `Search library activities`
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
                  label={
                    parent ? `Search in folder` : `Search library activities`
                  }
                  placement="bottom-end"
                >
                  <IconButton
                    size="sm"
                    colorScheme="blue"
                    icon={<MdOutlineSearch />}
                    aria-label={
                      parent ? `Search in folder` : `Search library activities`
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
            <Button
              as={Button}
              size="sm"
              colorScheme="blue"
              hidden={searchOpen}
              data-test="New Folder Button"
              onClick={() => {
                createFolderOnOpen();
              }}
            >
              {haveContentSpinner ? <Spinner size="sm" /> : "New Folder"}
            </Button>
            <Button
              as={Link}
              size="sm"
              colorScheme="blue"
              // hidden={searchOpen}
              data-test="See Curation Queue Button"
              to="/curate"
            >
              See Curation Queue
            </Button>
          </HStack>
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

  const emptyMessage = haveQuery
    ? "No Results Found"
    : "No Published Activities Yet";

  const cardContent: CardContent[] = content.map((activity, position) => {
    const getCardMenuRef = (element: HTMLButtonElement) => {
      cardMenuRefs.current[position] = element;
    };

    return {
      menuRef: getCardMenuRef,
      content: activity,
      menuItems: getCardMenuList({
        contentId: activity.contentId,
        name: activity.name,
        position,
        numCards: content.length,
        contentType: activity.type,
        isPublic: activity.isPublic,
        isShared: activity.isShared,
        sharedWith: activity.sharedWith,
        licenseCode: activity.licenseCode ?? null,
        parentId: activity.parent?.contentId ?? null,
      }),
      cardLink:
        activity.type === "folder"
          ? `/libraryActivities/${activity.contentId}`
          : editorUrl(activity.contentId, activity.type, "edit", true),
    };
  });

  const mainPanel = (
    <CardList
      showOwnerName={false}
      showBlurb={false}
      showPublicStatus={true}
      showActivityFeatures={true}
      emptyMessage={emptyMessage}
      content={cardContent}
    />
  );

  return (
    <>
      {moveCopyContentModal}
      {createLocalContentModal}

      {heading}

      {searchResultsHeading}

      <Flex
        data-test="Activities"
        padding="0 10px"
        margin="0px"
        width="100%"
        background={"white"}
        minHeight="calc(100vh - 189px)"
        direction="column"
      >
        {mainPanel}
      </Flex>
    </>
  );
}
