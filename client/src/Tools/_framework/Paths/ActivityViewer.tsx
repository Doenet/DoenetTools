import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  Link as ReactRouterLink,
} from "react-router";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link as ChakraLink,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Show,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { BsPlayBtnFill } from "react-icons/bs";
import { MdOutlineAdd, MdOutlineEditOff, MdOutlineInfo } from "react-icons/md";
import { useFetcher } from "react-router";

import axios from "axios";
import {} from "../ToolPanels/ContentSettingsDrawer";
import {
  ContentDescription,
  Content,
  DocHistoryItem,
  DoenetmlVersion,
} from "../../../_utils/types";
import { ActivityDoenetMLEditor } from "../ToolPanels/ActivityDoenetMLEditor";
import { CompoundActivityEditor } from "../ToolPanels/CompoundActivityEditor";
import {
  compileActivityFromContent,
  contentTypeToName,
  getAllowedParentTypes,
  getClassificationAugmentedDescription,
  getIconInfo,
  menuIcons,
} from "../../../_utils/activity";
import { ActivitySource } from "../../../_utils/viewerTypes";
import { processContributorHistory } from "../../../_utils/processRemixes";
import ContributorsMenu from "../ToolPanels/ContributorsMenu";
import { ContentInfoDrawer } from "../ToolPanels/ContentInfoDrawer";
import { createFullName } from "../../../_utils/names";
import { DisplayLicenseItem } from "../../../Widgets/Licenses";
import { SiteContext } from "./SiteHeader";
import {
  AddContentToMenu,
  addContentToMenuActions,
} from "../ToolPanels/AddContentToMenu";
import { CopyContentAndReportFinish } from "../ToolPanels/CopyContentAndReportFinish";
import { CloseIcon } from "@chakra-ui/icons";
import { BsBookmarkCheck } from "react-icons/bs";
import { ImCheckmark } from "react-icons/im";

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  const resultACM = await addContentToMenuActions({ formObj });
  if (resultACM) {
    return resultACM;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params, request }) {
  const {
    data: { activity: activityData, docHistories },
  } = await axios.get(`/api/getActivityViewerData/${params.contentId}`);

  const contentId = params.contentId;

  const url = new URL(request.url);
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

  if (activityData.type === "singleDoc") {
    const docId = activityData.documents[0].id;

    const doenetML = activityData.documents[0].source;
    const doenetmlVersion: DoenetmlVersion =
      activityData.documents[0].doenetmlVersion;

    const contributorHistory = await processContributorHistory(docHistories[0]);

    return {
      type: activityData.type,
      activityData,
      docId,
      doenetML,
      doenetmlVersion,
      contentId,
      contributorHistory,
      addTo,
    };
  } else {
    const activityJson = compileActivityFromContent(activityData);

    return {
      type: activityData.type,
      activityData,
      activityJson,
      contentId,
      contributorHistory: [],
      addTo,
    };
  }
}

export function ActivityViewer() {
  const data = useLoaderData() as {
    contentId: string;
    activityData: Content;
    contributorHistory: DocHistoryItem[];
    addTo?: ContentDescription;
  } & (
    | {
        type: "singleDoc";
        doenetML: string;
        doenetmlVersion: DoenetmlVersion;
        docId: string;
      }
    | {
        type: "select" | "sequence";
        activityJson: ActivitySource;
      }
  );

  const {
    contentId,
    type: contentType,
    activityData,
    contributorHistory,
    addTo,
  } = data;

  const { user } = useOutletContext<SiteContext>();
  const navigate = useNavigate();

  const infoBtnRef = useRef<HTMLButtonElement>(null);

  const [mode, setMode] = useState<"Edit" | "View">(
    contentType === "select" ? "Edit" : "View",
  );

  useEffect(() => {
    if (contentType === "select") {
      setMode("Edit");
    } else {
      setMode("View");
    }
  }, [contentType, contentId]);

  useEffect(() => {
    document.title = `${activityData.name} - Doenet`;
  }, [activityData.name]);

  const [displayInfoTab, setDisplayInfoTab] = useState<
    "general" | "classifications"
  >("general");

  const [settingsContentId, setSettingsContentId] = useState<string | null>(
    null,
  );

  let contentData: Content | undefined;
  if (settingsContentId) {
    if (settingsContentId === activityData.id) {
      contentData = activityData;
    } else {
      if (data.type !== "singleDoc") {
        function matchSettingsContentId(content: Content): Content | undefined {
          if (content.id === settingsContentId) {
            return content;
          }
          for (const child of content.children) {
            const res = matchSettingsContentId(child);
            if (res) {
              return res;
            }
          }
        }
        contentData = matchSettingsContentId(data.activityData);
      }
    }
  }

  const {
    isOpen: infoIsOpen,
    onOpen: infoOnOpen,
    onClose: infoOnClose,
  } = useDisclosure();

  const infoDrawer = contentData ? (
    <ContentInfoDrawer
      isOpen={infoIsOpen}
      onClose={infoOnClose}
      contentData={contentData}
      displayTab={displayInfoTab}
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
        sourceContent={[activityData]}
        desiredParent={addTo ?? null}
        action="Add"
      />
    ) : null;

  const fetcher = useFetcher();

  const [editLabel, editTooltip, editIcon] = [
    "See Inside",
    "See read-only view of source",
    <MdOutlineEditOff />,
  ];

  const haveClassifications = activityData.classifications.length > 0;

  let editor: ReactElement;

  if (data.type === "singleDoc") {
    editor = (
      <ActivityDoenetMLEditor
        doenetML={data.doenetML}
        doenetmlVersion={data.doenetmlVersion}
        asViewer={true}
        mode={mode}
        docId={data.docId}
        headerHeight="140px"
      />
    );
  } else {
    editor = (
      <CompoundActivityEditor
        activity={activityData}
        activityJson={data.activityJson}
        asViewer={true}
        mode={mode}
        fetcher={fetcher}
        headerHeight="140px"
        setSettingsContentId={setSettingsContentId}
        settingsOnOpen={infoOnOpen}
        setSettingsDisplayTab={setDisplayInfoTab}
        addTo={addTo}
      />
    );
  }

  const contentTypeName = contentTypeToName[data.type];

  const { iconImage, iconColor } = getIconInfo(data.type);

  const typeIcon = (
    <Tooltip label={contentTypeName}>
      <Box>
        <Icon
          as={iconImage}
          color={iconColor}
          boxSizing="content-box"
          width="24px"
          height="24px"
          paddingRight="10px"
          verticalAlign="middle"
          aria-label={contentTypeName}
        />
      </Box>
    </Tooltip>
  );

  const allowedParents = getAllowedParentTypes([activityData.type]);

  const allowedParentWords = allowedParents.map((ct) =>
    contentTypeToName[ct].toLowerCase(),
  );

  let allowedParentsPhrase = allowedParentWords
    .slice(0, Math.max(1, allowedParentWords.length - 1))
    .join(", ");
  if (allowedParentWords.length > 1) {
    allowedParentsPhrase +=
      " or " + allowedParentWords[allowedParentWords.length - 1];
  }

  let addToMenu: ReactElement;

  if (addTo) {
    addToMenu = (
      <Menu>
        <MenuButton
          as={Button}
          size="sm"
          colorScheme="blue"
          leftIcon={<MdOutlineAdd />}
          paddingRight={{ base: "0px", md: "10px" }}
        >
          <Show above="md">Add to</Show>
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              copyDialogOnOpen();
            }}
          >
            {menuIcons[addTo.type]}{" "}
            {addTo.name.substring(0, 20) +
              (addTo.name.length > 20 ? "..." : "")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(".");
            }}
          >
            <CloseIcon marginRight="10px" />
            Stop adding to:{" "}
            {addTo.name.substring(0, 20) +
              (addTo.name.length > 20 ? "..." : "")}
          </MenuItem>
        </MenuList>
      </Menu>
    );
  } else {
    addToMenu = (
      <AddContentToMenu
        sourceContent={[activityData]}
        size="sm"
        label={<Show above="md">Add to</Show>}
        addRightPadding={true}
        colorScheme="blue"
        toolTip={`Add ${contentTypeName.toLowerCase()} to ${allowedParentsPhrase}`}
        leftIcon={<MdOutlineAdd />}
        addCopyToLibraryOption={
          user?.isAdmin &&
          !activityData.librarySourceInfo?.contentId &&
          !activityData.libraryActivityInfo
        }
      />
    );
  }

  return (
    <>
      {infoDrawer}
      {copyContentModal}
      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header"
      "centerContent"
      `}
        templateRows="100px auto"
        position="relative"
      >
        <GridItem
          area="header"
          height="100px"
          background="doenet.mainGray"
          width="100%"
        >
          <Flex flexDirection="column" alignItems="flex-start" mt="10px">
            <Grid
              templateAreas={`"leftControls label rightControls"`}
              templateColumns={{
                base: "82px calc(100% - 197px) 115px",
                sm: "87px calc(100% - 217px) 120px",
                md: "1fr 350px 1fr",
                lg: "1fr 450px 1fr",
              }}
              width="100%"
              height="40px"
            >
              <GridItem area="leftControls">
                <HStack ml={{ base: "5px", sm: "10px" }} mt="4px">
                  <ButtonGroup size="sm" isAttached variant="outline">
                    <Tooltip hasArrow label="View Activity">
                      <Button
                        data-test="View Mode Button"
                        isActive={mode == "View"}
                        size="sm"
                        pr={{ base: "0px", md: "10px" }}
                        colorScheme="blue"
                        leftIcon={<BsPlayBtnFill />}
                        onClick={() => {
                          setMode("View");
                        }}
                      >
                        <Show above="md">View</Show>
                      </Button>
                    </Tooltip>
                    <Tooltip hasArrow label={editTooltip}>
                      <Button
                        isActive={mode == "Edit"}
                        data-test="Edit Mode Button"
                        size="sm"
                        pr={{ base: "0px", md: "10px" }}
                        colorScheme="blue"
                        leftIcon={editIcon}
                        onClick={() => {
                          setMode("Edit");
                        }}
                      >
                        <Show above="md">{editLabel}</Show>
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </HStack>
              </GridItem>
              <GridItem area="label">
                <Flex justifyContent="center" alignItems="center">
                  {typeIcon}
                  <Text fontSize="1.4em" fontWeight="bold" noOfLines={1}>
                    {activityData.name}
                  </Text>

                  {activityData.libraryActivityInfo?.status === "PUBLISHED" ? (
                    <>
                      <Tooltip label="This activity is curated.">
                        <Box marginLeft="5px">
                          <ImCheckmark color="green" />
                        </Box>
                      </Tooltip>
                    </>
                  ) : null}
                  {activityData.librarySourceInfo?.status === "PUBLISHED" ? (
                    <Popover>
                      <PopoverTrigger>
                        <IconButton
                          marginLeft="5px"
                          variant="unstyled"
                          icon={
                            <BsBookmarkCheck
                              style={{ color: "var(--mainBlue)" }}
                            />
                          }
                          aria-label="A peer-reviewed version is available."
                          data-test="Library source"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader style={{ fontWeight: "bold" }}>
                          This activity has been peer-reviewed!
                        </PopoverHeader>
                        <PopoverBody>
                          A{" "}
                          <ChakraLink
                            as={ReactRouterLink}
                            to={`/activityViewer/${activityData.librarySourceInfo.contentId}`}
                            style={{ color: "var(--mainBlue)" }}
                          >
                            peer-reviewed
                          </ChakraLink>{" "}
                          version is available.
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <></>
                  )}
                  {user?.isAdmin &&
                  activityData.librarySourceInfo?.contentId &&
                  activityData.librarySourceInfo?.status !== "PUBLISHED" ? (
                    <Button
                      marginLeft="10px"
                      data-test="Go to curated draft"
                      size="sm"
                      colorScheme="blue"
                      as={ReactRouterLink}
                      to={`/activityViewer/${activityData.librarySourceInfo.contentId}`}

                      // style={{ color: "var(--mainBlue)" }}
                    >
                      Go to curated draft
                    </Button>
                  ) : (
                    <></>
                  )}
                </Flex>
              </GridItem>
              <GridItem
                area="rightControls"
                display="flex"
                justifyContent="flex-end"
              >
                <HStack mr={{ base: "5px", sm: "10px" }}>
                  <ButtonGroup size="sm" isAttached variant="outline">
                    {user ? (
                      addToMenu
                    ) : (
                      <Button
                        data-test="Nav to signIn"
                        colorScheme="blue"
                        size="sm"
                        onClick={() => {
                          navigate("/signIn");
                        }}
                      >
                        Sign In To Add Content
                      </Button>
                    )}

                    <Tooltip
                      hasArrow
                      label={`${contentTypeName} Information`}
                      placement="bottom-end"
                    >
                      <Button
                        data-test="Info Button"
                        size="sm"
                        pr={{ base: "0px", md: "10px" }}
                        colorScheme="blue"
                        leftIcon={<MdOutlineInfo />}
                        onClick={() => {
                          setDisplayInfoTab("general");
                          setSettingsContentId(activityData.id);
                          infoOnOpen();
                        }}
                        ref={infoBtnRef}
                      >
                        <Show above="md">Info</Show>
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </HStack>
              </GridItem>
            </Grid>

            <ContributorsMenu
              activity={activityData}
              contributorHistory={contributorHistory}
            />
          </Flex>
        </GridItem>

        <GridItem area="centerContent">
          <VStack gap={0}>
            <Box
              background="var(--canvas)"
              width={mode === "Edit" ? "100%" : undefined}
              height="100%"
            >
              {editor}
            </Box>
            <Box
              hidden={mode === "Edit"}
              maxWidth="850px"
              width="100%"
              height="30vh"
              background="var(--canvas)"
              padding="0px"
              margin="0px"
            />
            <Flex
              hidden={mode === "Edit"}
              background="gray"
              maxWidth="850px"
              width="100%"
              color="var(--canvas)"
              padding="20px"
              minHeight="20vh"
            >
              <Box width={haveClassifications ? "70%" : "100%"}>
                {activityData.license ? (
                  activityData.license.isComposition ? (
                    <>
                      <p>
                        <strong>{activityData.name}</strong> by{" "}
                        {createFullName(activityData.owner!)} is shared with
                        these licenses:
                      </p>
                      <List spacing="20px" marginTop="10px">
                        {activityData.license.composedOf.map((comp) => (
                          <DisplayLicenseItem
                            licenseItem={comp}
                            key={comp.code}
                          />
                        ))}
                      </List>
                      <p style={{ marginTop: "10px" }}>
                        You are free to use either license when reusing this
                        work.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>{activityData.name}</strong> by{" "}
                        {createFullName(activityData.owner!)} is shared using
                        the license:
                      </p>
                      <List marginTop="10px">
                        <DisplayLicenseItem
                          licenseItem={activityData.license}
                        />
                      </List>
                    </>
                  )
                ) : (
                  <p>
                    <strong>{activityData.name}</strong> by{" "}
                    {createFullName(activityData.owner!)} is shared, but a
                    license was not specified. Contact the author to determine
                    in what ways you can reuse this activity.
                  </p>
                )}
              </Box>
              {haveClassifications ? (
                <Box
                  cursor="pointer"
                  onClick={() => {
                    setDisplayInfoTab("classifications");
                    setSettingsContentId(activityData.id);
                    infoOnOpen();
                  }}
                  marginLeft="40px"
                >
                  <Heading size="sm">Classifications</Heading>
                  <List data-test="Classifications Footer">
                    {activityData.classifications.map((classification, i) => {
                      return (
                        <Tooltip
                          key={i}
                          label={getClassificationAugmentedDescription(
                            classification,
                          )}
                        >
                          <ListItem>
                            {classification.code} (
                            {
                              classification.descriptions[0].subCategory
                                .category.system.shortName
                            }
                            )
                          </ListItem>
                        </Tooltip>
                      );
                    })}
                  </List>
                </Box>
              ) : null}
            </Flex>
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
}
