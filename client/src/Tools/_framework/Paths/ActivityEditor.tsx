import React, { ReactElement, useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router";

import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link as ChakraLink,
  Show,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { BsPlayBtnFill } from "react-icons/bs";
import { IoGitCompareOutline } from "react-icons/io5";
import {
  MdDataset,
  MdInfoOutline,
  MdModeEditOutline,
  MdOutlineAssignment,
  MdOutlineContentCopy,
  MdOutlineEditOff,
  MdOutlineGroup,
} from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { useFetcher, Link as ReactRouterLink, useNavigate } from "react-router";
import axios from "axios";
import {
  contentSettingsActions,
  ContentSettingsDrawer,
} from "../ToolPanels/ContentSettingsDrawer";
import { InfoIcon } from "@chakra-ui/icons";
import { AssignmentInvitation } from "../ToolPanels/AssignmentInvitation";
import {
  assignmentControlsActions,
  AssignmentControlsDrawer,
} from "../ToolPanels/AssignmentControlsDrawer";
import { ShareDrawer, shareDrawerActions } from "../ToolPanels/ShareDrawer";
import {
  ContentFeature,
  Content,
  DoenetmlVersion,
  License,
  ContentRevision,
} from "../../../_utils/types";
import {
  ActivityDoenetMLEditor,
  activityDoenetMLEditorActions,
} from "../ToolPanels/ActivityDoenetMLEditor";
import {
  CompoundActivityEditor,
  compoundActivityEditorActions,
} from "../ToolPanels/CompoundActivityEditor";
import {
  compileActivityFromContent,
  contentTypeToName,
  getIconInfo,
} from "../../../_utils/activity";
import { ActivitySource } from "../../../_utils/viewerTypes";
import { CopyContentAndReportFinish } from "../ToolPanels/CopyContentAndReportFinish";

export async function action({ params, request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  if (formObj._action == "update name") {
    //Don't let name be blank
    let name = formObj?.name?.trim();
    if (name === "") {
      name = "Untitled";
    }

    await axios.post(`/api/updateContent/updateContentSettings`, {
      contentId: params.contentId,
      name,
    });
    return true;
  } else if (formObj._action === "go to data") {
    return redirect(`/assignmentData/${params.contentId}`);
  }

  const resultCS = await contentSettingsActions({ formObj });
  if (resultCS) {
    return resultCS;
  }

  const resultSD = await shareDrawerActions({ formObj });
  if (resultSD) {
    return resultSD;
  }

  const resultAS = await assignmentControlsActions({ formObj });
  if (resultAS) {
    return resultAS;
  }

  const resultNAE = await compoundActivityEditorActions({ formObj });
  if (resultNAE) {
    return resultNAE;
  }

  const resultADE = await activityDoenetMLEditorActions({ formObj });
  if (resultADE) {
    return resultADE;
  }

  return null;
}

export async function loader({ params, request }) {
  const {
    data: {
      editableByMe,
      activity: activityData,
      availableFeatures,
      revisions,
    },
  } = await axios.get(
    `/api/activityEditView/getActivityEditorData/${params.contentId}`,
  );

  if (!editableByMe) {
    return redirect(`/activityViewer/${params.contentId}`);
  }

  const contentId = params.contentId;

  // const supportingFileResp = await axios.get(
  //   `/api/loadSupportingFileInfo/${contentId}`,
  // );

  // const supportingFileData = supportingFileResp.data;

  // //Win, Mac or Linux
  // let platform = "Linux";
  // if (navigator.platform.indexOf("Win") != -1) {
  //   platform = "Win";
  // } else if (navigator.platform.indexOf("Mac") != -1) {
  //   platform = "Mac";
  // }

  const {
    data: { allLicenses },
  } = await axios.get("/api/info/getAllLicenses");

  const {
    data: { allDoenetmlVersions },
  } = await axios.get("/api/info/getAllDoenetmlVersions");

  const url = new URL(request.url);
  const modePar = url.searchParams.get("mode")?.toLowerCase();
  const mode =
    modePar === "view" ? "View" : modePar === "compare" ? "Compare" : "Edit";

  const comparePar = url.searchParams.get("compare")?.toLowerCase();
  const compare =
    comparePar === "revisions"
      ? "revisions"
      : comparePar === "remixedfrom"
        ? "remixedFrom"
        : comparePar === "remixes"
          ? "remixes"
          : "";

  const remixId = url.searchParams.get("remix") ?? "";

  let revNum = 0;
  if (remixId === "") {
    const revNumPar = url.searchParams.get("revNum");
    if (revNumPar) {
      revNum = Number(revNumPar);
      if (!Number.isInteger(revNum) || revNum <= 0) {
        revNum = 0;
      }
    }
  }

  if (activityData.type === "singleDoc") {
    const doenetML = activityData.doenetML;
    const doenetmlVersion: DoenetmlVersion = activityData.doenetmlVersion;

    return {
      type: activityData.type,
      // platform,
      activityData,
      doenetML,
      doenetmlVersion,
      contentId,
      // supportingFileData,
      allDoenetmlVersions,
      allLicenses,
      availableFeatures,
      revisions,
      mode,
      compare,
      revNum,
      remixId,
    };
  } else {
    const activityJson = compileActivityFromContent(activityData);

    return {
      type: activityData.type,
      // platform,
      activityData,
      activityJson,
      contentId,
      // supportingFileData,
      allDoenetmlVersions,
      allLicenses,
      availableFeatures,
      revisions,
      mode,
      compare,
      revNum,
      remixId,
    };
  }
}

//This is separate as <Editable> wasn't updating when defaultValue was changed
function EditableName({ dataTest }) {
  const { activityData } = useLoaderData() as {
    activityData: Content;
  };

  const [name, setName] = useState(activityData.name);
  const fetcher = useFetcher();

  const lastBaseDataName = useRef(activityData.name);

  //Update when something else updates the name
  if (activityData.name != lastBaseDataName.current) {
    if (name != activityData.name) {
      setName(activityData.name);
    }
  }
  lastBaseDataName.current = activityData.name;

  return (
    <Editable
      data-test={dataTest}
      mt="4px"
      value={name}
      textAlign="center"
      onChange={(value) => {
        setName(value);
      }}
      onSubmit={(value) => {
        const submitValue = value;

        fetcher.submit(
          { _action: "update name", name: submitValue },
          { method: "post" },
        );
      }}
    >
      <Tooltip label={name}>
        <EditablePreview data-test="Editable Title" noOfLines={1} />
      </Tooltip>
      <EditableInput
        maxLength={191}
        width={{ base: "100%", lg: "450px" }}
        data-test="Editable Input"
      />
    </Editable>
  );
}

export function ActivityEditor() {
  const data = useLoaderData() as {
    contentId: string;
    allDoenetmlVersions: DoenetmlVersion[];
    allLicenses: License[];
    availableFeatures: ContentFeature[];
    activityData: Content;
    revisions: ContentRevision[];
    mode: "Edit" | "View" | "Compare";
    compare: "revisions" | "remixedFrom" | "remixes" | "";
    revNum: number;
    remixId: string;
  } & (
    | {
        type: "singleDoc";
        doenetML: string;
        doenetmlVersion: DoenetmlVersion;
      }
    | {
        type: "select" | "sequence";
        activityJson: ActivitySource;
      }
  );

  const {
    contentId,
    activityData,
    allDoenetmlVersions,
    allLicenses,
    availableFeatures,
    revisions,
    mode,
    compare,
    revNum,
    remixId,
  } = data;

  const finalFocusRef = useRef<HTMLElement | null>(null);
  const curateBtnRef = useRef<HTMLButtonElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const sharingBtnRef = useRef<HTMLButtonElement>(null);
  const assignBtnRef = useRef<HTMLButtonElement>(null);

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
    isOpen: invitationIsOpen,
    onOpen: invitationOnOpen,
    onClose: invitationOnClose,
  } = useDisclosure();

  const {
    isOpen: copyDialogIsOpen,
    onOpen: copyDialogOnOpen,
    onClose: copyDialogOnClose,
  } = useDisclosure();

  const assignmentInfo = activityData.assignmentInfo;
  const assignmentStatus = assignmentInfo?.assignmentStatus ?? "Unassigned";
  const isSubActivity = (activityData.parent?.type ?? "folder") !== "folder";

  const readOnly = assignmentStatus !== "Unassigned";
  const readOnlyRef = useRef(readOnly);
  readOnlyRef.current = readOnly;

  const fetcher = useFetcher();
  const navigate = useNavigate();

  function setMode(newMode: "Edit" | "View" | "Compare") {
    const newSearch = `?mode=${newMode}`;
    navigate(`.${newSearch}`, { replace: true });
  }

  const isLibraryActivity = Boolean(activityData.libraryActivityInfo);

  useEffect(() => {
    document.title = `${activityData.name} - Doenet`;
  }, [activityData.name]);

  const [displaySettingsTab, setSettingsDisplayTab] =
    useState<"general">("general");
  const [highlightRename, setHighlightRename] = useState(false);

  const [editLabel, editTooltip, editIcon] =
    assignmentStatus === "Unassigned"
      ? ["Edit", "Edit activity", <MdModeEditOutline />]
      : ["See Inside", "See read-only view of source", <MdOutlineEditOff />];

  const [settingsContentId, setSettingsContentId] = useState<string | null>(
    null,
  );

  let contentData: Content | undefined;
  if (settingsContentId) {
    if (settingsContentId === contentId) {
      contentData = activityData;
    } else {
      if (data.type !== "singleDoc") {
        function matchSettingsContentId(content: Content): Content | undefined {
          if (content.contentId === settingsContentId) {
            return content;
          }
          if (content.type !== "singleDoc") {
            for (const child of content.children) {
              const res = matchSettingsContentId(child);
              if (res) {
                return res;
              }
            }
          }
        }
        contentData = matchSettingsContentId(data.activityData);
      }
    }
  }

  let editor: ReactElement | null;

  if (data.type === "singleDoc") {
    editor = (
      <ActivityDoenetMLEditor
        doenetML={data.doenetML}
        doenetmlVersion={data.doenetmlVersion}
        assignmentStatus={assignmentStatus}
        revisions={revisions}
        mode={mode}
        contentId={contentId}
        activityName={activityData.name}
        headerHeight={`${readOnly ? 120 : 80}px`}
        fetcher={fetcher}
        compare={compare}
        revNum={revNum}
        remixId={remixId}
      />
    );
  } else {
    editor =
      mode !== "Compare" ? (
        <CompoundActivityEditor
          activity={data.activityData}
          activityJson={data.activityJson}
          mode={mode}
          fetcher={fetcher}
          setSettingsContentId={setSettingsContentId}
          settingsOnOpen={settingsOnOpen}
          sharingOnOpen={sharingOnOpen}
          finalFocusRef={finalFocusRef}
          setSettingsDisplayTab={setSettingsDisplayTab}
          setHighlightRename={setHighlightRename}
          headerHeight={`${readOnly ? 120 : 80}px`}
        />
      ) : null;
  }

  const settingsDrawer = contentData ? (
    <ContentSettingsDrawer
      isOpen={settingsAreOpen}
      onClose={settingsOnClose}
      finalFocusRef={finalFocusRef}
      fetcher={fetcher}
      contentData={contentData}
      allDoenetmlVersions={allDoenetmlVersions}
      availableFeatures={availableFeatures}
      displayTab={displaySettingsTab}
      highlightRename={highlightRename}
    />
  ) : null;

  const shareDrawer = contentData ? (
    <ShareDrawer
      inCurationLibrary={isLibraryActivity}
      isOpen={sharingIsOpen}
      onClose={sharingOnClose}
      finalFocusRef={finalFocusRef}
      fetcher={fetcher}
      contentData={contentData}
      allLicenses={allLicenses}
    />
  ) : null;

  const assignmentDrawers = !isLibraryActivity ? (
    <>
      <AssignmentControlsDrawer
        isOpen={assignmentSettingsAreOpen}
        onClose={assignmentSettingsOnClose}
        finalFocusRef={finalFocusRef}
        fetcher={fetcher}
        contentId={contentId}
        contentData={activityData}
      />
      <AssignmentInvitation
        isOpen={invitationIsOpen}
        onClose={invitationOnClose}
        activityData={activityData}
      />
    </>
  ) : null;

  const copyContentModal = (
    <CopyContentAndReportFinish
      fetcher={fetcher}
      isOpen={copyDialogIsOpen}
      onClose={copyDialogOnClose}
      contentIds={[activityData.contentId]}
      desiredParent={
        activityData.parent ? { parent: null, ...activityData.parent } : null
      }
      action="Copy"
      prependCopy={true}
    />
  );

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

  return (
    <>
      {settingsDrawer}
      {shareDrawer}
      {assignmentDrawers}
      {copyContentModal}

      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header"
      "centerContent"
      `}
        templateRows="40px auto"
        position="relative"
      >
        <GridItem
          area="header"
          position="fixed"
          height="40px"
          background="doenet.canvas"
          width="100%"
          zIndex="500"
          borderBottom={mode === "View" ? "1px solid" : undefined}
          borderColor="doenet.mediumGray"
        >
          <Grid
            templateAreas={`"leftControls label rightControls"`}
            templateColumns={{
              base: "115px 1fr 115px",
              sm: "120px 1fr 120px",
              md: "200px 1fr 200px",
              lg: "325px 1fr 325px",
            }}
            width="100%"
          >
            <GridItem area="leftControls">
              <HStack ml={{ base: "5px", sm: "10px" }} mt="4px">
                <Show above="md">
                  <Box width="50px" marginLeft="5px">
                    <ChakraLink
                      as={ReactRouterLink}
                      to={".."}
                      style={{
                        color: "var(--mainBlue)",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(-1);
                      }}
                    >
                      {" "}
                      &lt; Back
                    </ChakraLink>
                  </Box>
                </Show>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Tooltip hasArrow label="View Activity">
                    <Button
                      data-test="View Mode Button"
                      isActive={mode == "View"}
                      size="sm"
                      pr={{ base: "0px", lg: "10px" }}
                      leftIcon={<BsPlayBtnFill />}
                      onClick={() => {
                        setMode("View");
                      }}
                    >
                      <Show above="lg">View</Show>
                    </Button>
                  </Tooltip>
                  <Tooltip hasArrow label={editTooltip}>
                    <Button
                      isActive={mode == "Edit"}
                      data-test="Edit Mode Button"
                      size="sm"
                      pr={{ base: "0px", lg: "10px" }}
                      leftIcon={editIcon}
                      onClick={() => {
                        setMode("Edit");
                      }}
                    >
                      <Show above="lg">{editLabel}</Show>
                    </Button>
                  </Tooltip>
                  {data.type === "singleDoc" && (
                    <Tooltip
                      hasArrow
                      label="Compare with revisions and remixes"
                    >
                      <Button
                        data-test="Compare with revisions and remixes"
                        isActive={mode == "Compare"}
                        size="sm"
                        pr={{ base: "0px", lg: "10px" }}
                        leftIcon={<IoGitCompareOutline />}
                        onClick={() => {
                          setMode("Compare");
                        }}
                      >
                        <Show above="lg">Compare</Show>
                      </Button>
                    </Tooltip>
                  )}
                </ButtonGroup>
              </HStack>
            </GridItem>
            <GridItem area="label">
              <Flex justifyContent="center" alignItems="center">
                {typeIcon}
                <EditableName dataTest="Activity Name Editable" />
              </Flex>
            </GridItem>
            <GridItem
              area="rightControls"
              display="flex"
              justifyContent="flex-end"
            >
              <HStack mr={{ base: "5px", sm: "10px" }}>
                <ButtonGroup size="sm" isAttached variant="outline">
                  {isLibraryActivity ? (
                    <Tooltip
                      hasArrow
                      label="Open Curation Controls"
                      placement="bottom-end"
                    >
                      <Button
                        data-test="Curate Button"
                        size="sm"
                        pr={{ base: "0px", lg: "10px" }}
                        leftIcon={<MdOutlineGroup />}
                        onClick={() => {
                          finalFocusRef.current = curateBtnRef.current;
                          sharingOnOpen();
                        }}
                        ref={curateBtnRef}
                      >
                        <Show above="lg">Curate</Show>
                      </Button>
                    </Tooltip>
                  ) : (
                    <>
                      {isSubActivity ? null : (
                        <Tooltip
                          hasArrow
                          label={
                            assignmentStatus === "Unassigned"
                              ? "Assign Activity"
                              : "Manage Assignment"
                          }
                          placement="bottom-end"
                        >
                          <Button
                            data-test="Assign Activity Button"
                            size="sm"
                            pr={{ base: "0px", lg: "10px" }}
                            leftIcon={<MdOutlineAssignment />}
                            onClick={() => {
                              finalFocusRef.current = assignBtnRef.current;
                              assignmentSettingsOnOpen();
                            }}
                            ref={assignBtnRef}
                          >
                            <Show above="lg">
                              {assignmentStatus === "Unassigned"
                                ? "Assign"
                                : "Assigned"}
                            </Show>
                          </Button>
                        </Tooltip>
                      )}

                      <Tooltip
                        hasArrow
                        label="Open Sharing Controls"
                        placement="bottom-end"
                      >
                        <Button
                          data-test="Sharing Button"
                          size="sm"
                          pr={{ base: "0px", lg: "10px" }}
                          leftIcon={<MdOutlineGroup />}
                          onClick={() => {
                            finalFocusRef.current = sharingBtnRef.current;
                            setSettingsContentId(activityData.contentId);
                            sharingOnOpen();
                          }}
                          ref={sharingBtnRef}
                        >
                          <Show above="lg">Share</Show>
                        </Button>
                      </Tooltip>
                    </>
                  )}
                  <Tooltip
                    hasArrow
                    label="Open Settings"
                    placement="bottom-end"
                  >
                    <Button
                      data-test="Settings Button"
                      size="sm"
                      pr={{ base: "0px", lg: "10px" }}
                      leftIcon={<FaCog />}
                      onClick={() => {
                        finalFocusRef.current = settingsBtnRef.current;
                        setSettingsDisplayTab("general");
                        setSettingsContentId(activityData.contentId);
                        settingsOnOpen();
                      }}
                      ref={settingsBtnRef}
                    >
                      <Show above="lg">Settings</Show>
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </HStack>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem area="centerContent">
          <VStack gap={0}>
            {readOnly ? (
              <Center
                background="orange.100"
                width="100%"
                height={{ base: "60px", sm: "40px" }}
                pl="4px"
                pr="4px"
              >
                <InfoIcon color="orange.500" mr="6px" />

                {assignmentInfo?.assignmentStatus === "Open" ? (
                  isSubActivity ? (
                    <Text size="xs">
                      {`Activity is part of an open assignment. ${mode == "Edit" ? "It cannot be edited." : ""}`}
                    </Text>
                  ) : (
                    <>
                      <Text size="xs">
                        {`Assignment is open with code ${assignmentInfo.classCode}. ${mode == "Edit" ? "Make a copy to create an editable version." : ""}`}
                      </Text>

                      <Tooltip label="Activity Invitation">
                        <Button
                          onClick={invitationOnOpen}
                          colorScheme="blue"
                          mt="4px"
                          ml="4px"
                          size="xs"
                          leftIcon={<MdInfoOutline />}
                          pr={{ base: "0px", md: "10px" }}
                        >
                          <Show above="md">Activity Invitation</Show>
                        </Button>
                      </Tooltip>
                    </>
                  )
                ) : (
                  <Text size="xs">
                    {`Activity is ${isSubActivity ? "part of " : ""}a closed assignment. ${mode == "Edit" ? "Make a copy to create an editable version." : "."}`}
                  </Text>
                )}
                {assignmentInfo?.hasScoreData ? (
                  <Tooltip label="View data">
                    <Button
                      data-test="View Data Button"
                      colorScheme="blue"
                      mt="4px"
                      ml="4px"
                      size="xs"
                      leftIcon={<MdDataset />}
                      pr={{ base: "0px", md: "10px" }}
                      onClick={() => {
                        fetcher.submit(
                          { _action: "go to data", contentId },
                          { method: "post" },
                        );
                      }}
                    >
                      <Show above="md">View data</Show>
                    </Button>
                  </Tooltip>
                ) : null}
                {isSubActivity ? null : (
                  <Tooltip label="Make a copy">
                    <Button
                      data-test="Make Copy Button"
                      colorScheme="blue"
                      mt="4px"
                      ml="4px"
                      size="xs"
                      leftIcon={<MdOutlineContentCopy />}
                      pr={{ base: "0px", md: "10px" }}
                      onClick={() => {
                        copyDialogOnOpen();
                      }}
                    >
                      <Show above="md">Make a copy</Show>
                    </Button>
                  </Tooltip>
                )}
              </Center>
            ) : null}
            {editor}
            <Box
              hidden={mode !== "View"}
              maxWidth="850px"
              width="100%"
              height="30vh"
              background="var(--canvas)"
              padding="0px"
              margin="0px"
            />
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
}
