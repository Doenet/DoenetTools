import React, { ReactElement, useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router";

import {
  Button,
  ButtonGroup,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Grid,
  GridItem,
  HStack,
  Show,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { BsPlayBtnFill } from "react-icons/bs";
import {
  MdDataset,
  MdModeEditOutline,
  MdOutlineAssignment,
  MdOutlineEditOff,
  MdOutlineGroup,
} from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { useFetcher } from "react-router";
import axios from "axios";
import {
  contentSettingsActions,
  ContentSettingsDrawer,
} from "../ToolPanels/ContentSettingsDrawer";
import { InfoIcon } from "@chakra-ui/icons";
import { AssignmentInvitation } from "../ToolPanels/AssignmentInvitation";
import {
  assignmentSettingsActions,
  AssignmentSettingsDrawer,
} from "../ToolPanels/AssignmentSettingsDrawer";
import { ShareDrawer, shareDrawerActions } from "../ToolPanels/ShareDrawer";
import {
  ContentFeature,
  ContentStructure,
  ContentType,
  DoenetmlVersion,
  License,
  NestedActivity,
} from "../../../_utils/types";
import { ActivityDoenetMLEditor } from "../ToolPanels/ActivityDoenetMLEditor";
import {
  NestedActivityEditor,
  nestedActivityEditorActions,
} from "../ToolPanels/NestedActivityEditor";
import { compileActivityFromContent } from "../../../_utils/activity";
import { ActivitySource } from "../../../_utils/viewerTypes";

export async function action({ params, request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  //Don't let name be blank
  let name = formObj?.name?.trim();
  if (name == "") {
    name = "Untitled";
  }

  if (formObj._action == "update name") {
    await axios.post(`/api/updateContentName`, {
      id: params.activityId,
      name,
    });
    return true;
  }

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

  const resultNAE = await nestedActivityEditorActions({ formObj }, { params });
  if (resultNAE) {
    return resultNAE;
  }

  if (formObj._action == "go to data") {
    return redirect(`/assignmentData/${params.activityId}`);
  }

  return null;
}

export async function loader({ params }) {
  const {
    data: { notMe, activity: activityData, availableFeatures },
  } = await axios.get(`/api/getActivityEditorData/${params.activityId}`);

  if (notMe) {
    return redirect(`/codeViewer/${params.activityId}`);
  }

  const activityId = params.activityId;

  // const supportingFileResp = await axios.get(
  //   `/api/loadSupportingFileInfo/${activityId}`,
  // );

  // const supportingFileData = supportingFileResp.data;

  // //Win, Mac or Linux
  // let platform = "Linux";
  // if (navigator.platform.indexOf("Win") != -1) {
  //   platform = "Win";
  // } else if (navigator.platform.indexOf("Mac") != -1) {
  //   platform = "Mac";
  // }

  const { data: allLicenses } = await axios.get("/api/getAllLicenses");

  if (activityData.type === "nested") {
    const activityJson = compileActivityFromContent(activityData);

    return {
      type: activityData.type,
      // platform,
      activityData,
      activityJson,
      activityId,
      // supportingFileData,
      allDoenetmlVersions: [],
      allLicenses,
      availableFeatures,
    };
  } else {
    const docId = activityData.documents[0].id;

    const doenetML = activityData.documents[0].source;
    const doenetmlVersion: DoenetmlVersion =
      activityData.documents[0].doenetmlVersion;

    const { data: allDoenetmlVersions } = await axios.get(
      "/api/getAllDoenetmlVersions",
    );

    return {
      type: activityData.type,
      // platform,
      activityData,
      docId,
      doenetML,
      doenetmlVersion,
      activityId,
      // supportingFileData,
      allDoenetmlVersions,
      allLicenses,
      availableFeatures,
    };
  }
}

//This is separate as <Editable> wasn't updating when defaultValue was changed
function EditableName({ dataTest }) {
  const { activityData } = useLoaderData() as {
    activityData: ContentStructure | NestedActivity;
  };
  const baseData =
    activityData.type === "nested" ? activityData.structure : activityData;

  const [name, setName] = useState(baseData.name);
  const fetcher = useFetcher();

  const lastBaseDataName = useRef(baseData.name);

  //Update when something else updates the name
  if (baseData.name != lastBaseDataName.current) {
    if (name != baseData.name) {
      setName(baseData.name);
    }
  }
  lastBaseDataName.current = baseData.name;

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
        width={{ base: "100%", md: "350px", lg: "450px" }}
        data-test="Editable Input"
      />
    </Editable>
  );
}

export function ActivityEditor() {
  const data = useLoaderData() as {
    activityId: string;
    allDoenetmlVersions: DoenetmlVersion[];
    allLicenses: License[];
    availableFeatures: ContentFeature[];
  } & (
    | {
        type: ContentType;
        doenetML: string;
        doenetmlVersion: DoenetmlVersion;
        docId: string;
        activityData: ContentStructure;
      }
    | {
        type: "nested";
        activityData: NestedActivity;
        activityJson: ActivitySource;
      }
  );

  const {
    activityId,
    activityData,
    allDoenetmlVersions,
    allLicenses,
    availableFeatures,
  } = data;

  const baseData =
    activityData.type === "nested" ? activityData.structure : activityData;

  const finalFocusRef = useRef<HTMLElement | null>(null);
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

  const assignmentStatus = baseData.assignmentStatus;

  const readOnly = assignmentStatus !== "Unassigned";
  const readOnlyRef = useRef(readOnly);
  readOnlyRef.current = readOnly;

  const [mode, setMode] = useState<"Edit" | "View">(readOnly ? "View" : "Edit");

  useEffect(() => {
    if (readOnly) {
      setMode("View");
    } else {
      setMode("Edit");
    }
  }, [readOnly]);

  useEffect(() => {
    document.title = `${baseData.name} - Doenet`;
  }, [baseData.name]);

  const [displaySettingsTab, setSettingsDisplayTab] =
    useState<"general">("general");

  const fetcher = useFetcher();

  const [editLabel, editTooltip, editIcon] =
    assignmentStatus === "Unassigned"
      ? ["Edit", "Edit activity", <MdModeEditOutline />]
      : ["See Inside", "See read-only view of source", <MdOutlineEditOff />];

  const textEditorDoenetML = useRef("Need to get DoenetML in some cases");

  const [settingsContentId, setSettingsContentId] = useState<string | null>(
    null,
  );

  let contentData: ContentStructure | undefined;
  let contentDataIsChild = false;
  if (settingsContentId) {
    if (settingsContentId === baseData.id) {
      contentData = baseData;
    } else {
      if (data.type === "nested") {
        function matchSettingsContentId(
          na: NestedActivity,
        ): ContentStructure | undefined {
          if (na.structure.id === settingsContentId) {
            return na.structure;
          }
          for (const child of na.children) {
            const res = matchSettingsContentId(child);
            if (res) {
              return res;
            }
          }
        }
        contentData = matchSettingsContentId(data.activityData);
        contentDataIsChild = true;
      }
    }
  }

  let editor: ReactElement;

  if (data.type === "nested") {
    editor = (
      <NestedActivityEditor
        activity={data.activityData}
        activityJson={data.activityJson}
        assignmentStatus={assignmentStatus}
        mode={mode}
        fetcher={fetcher}
        setSettingsContentId={setSettingsContentId}
        settingsOnOpen={settingsOnOpen}
        sharingOnOpen={sharingOnOpen}
        finalFocusRef={finalFocusRef}
      />
    );
  } else {
    editor = (
      <ActivityDoenetMLEditor
        doenetML={data.doenetML}
        doenetmlVersion={data.doenetmlVersion}
        assignmentStatus={assignmentStatus}
        mode={mode}
        docId={data.docId}
      />
    );
  }

  const settingsDrawer = contentData ? (
    <ContentSettingsDrawer
      isOpen={settingsAreOpen}
      onClose={settingsOnClose}
      finalFocusRef={finalFocusRef}
      fetcher={fetcher}
      contentData={contentData}
      contentDataIsChild={contentDataIsChild}
      allDoenetmlVersions={allDoenetmlVersions}
      availableFeatures={availableFeatures}
      displayTab={displaySettingsTab}
    />
  ) : null;

  const shareDrawer = contentData ? (
    <ShareDrawer
      isOpen={sharingIsOpen}
      onClose={sharingOnClose}
      finalFocusRef={finalFocusRef}
      fetcher={fetcher}
      contentData={contentData}
      allLicenses={allLicenses}
      currentDoenetML={textEditorDoenetML}
    />
  ) : null;

  return (
    <>
      {settingsDrawer}
      {shareDrawer}

      <AssignmentSettingsDrawer
        isOpen={assignmentSettingsAreOpen}
        onClose={assignmentSettingsOnClose}
        finalFocusRef={finalFocusRef}
        fetcher={fetcher}
        id={activityId}
        contentData={baseData}
      />
      <AssignmentInvitation
        isOpen={invitationIsOpen}
        onClose={invitationOnClose}
        activityData={baseData}
      />
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
        >
          <Grid
            templateAreas={`"leftControls label rightControls"`}
            templateColumns={{
              base: "82px calc(100% - 197px) 115px",
              sm: "87px calc(100% - 217px) 120px",
              md: "1fr 350px 1fr",
              lg: "1fr 450px 1fr",
            }}
            width="100%"
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
              <EditableName dataTest="Activity Name Editable" />
            </GridItem>
            <GridItem
              area="rightControls"
              display="flex"
              justifyContent="flex-end"
            >
              <HStack mr={{ base: "5px", sm: "10px" }}>
                <ButtonGroup size="sm" isAttached variant="outline">
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
                      pr={{ base: "0px", md: "10px" }}
                      leftIcon={<MdOutlineAssignment />}
                      onClick={() => {
                        finalFocusRef.current = assignBtnRef.current;
                        assignmentSettingsOnOpen();
                      }}
                      ref={assignBtnRef}
                    >
                      <Show above="md">Assign</Show>
                    </Button>
                  </Tooltip>

                  <Tooltip
                    hasArrow
                    label="Open Sharing Controls"
                    placement="bottom-end"
                  >
                    <Button
                      data-test="Sharing Button"
                      size="sm"
                      pr={{ base: "0px", md: "10px" }}
                      leftIcon={<MdOutlineGroup />}
                      onClick={() => {
                        finalFocusRef.current = sharingBtnRef.current;
                        setSettingsContentId(baseData.id);
                        sharingOnOpen();
                      }}
                      ref={sharingBtnRef}
                    >
                      <Show above="md">Share</Show>
                    </Button>
                  </Tooltip>

                  <Tooltip
                    hasArrow
                    label="Open Settings"
                    placement="bottom-end"
                  >
                    <Button
                      data-test="Settings Button"
                      size="sm"
                      pr={{ base: "0px", md: "10px" }}
                      leftIcon={<FaCog />}
                      onClick={() => {
                        finalFocusRef.current = settingsBtnRef.current;
                        setSettingsDisplayTab("general");
                        setSettingsContentId(baseData.id);
                        settingsOnOpen();
                      }}
                      ref={settingsBtnRef}
                    >
                      <Show above="md">Settings</Show>
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
                height="40px"
                pl="4px"
                pr="4px"
              >
                <InfoIcon color="orange.500" mr="6px" />

                {assignmentStatus === "Open" ? (
                  <>
                    <Text size="xs">
                      {` Assignment is open with code ${baseData.classCode}. ${mode == "Edit" ? "It cannot be edited." : ""}`}
                    </Text>
                    <Button
                      onClick={invitationOnOpen}
                      colorScheme="blue"
                      mt="4px"
                      ml="4px"
                      size="xs"
                    >
                      Activity Invitation
                    </Button>
                  </>
                ) : (
                  <Text size="xs">
                    {`Activity is a closed assignment${mode == "Edit" ? " and cannot be edited." : "."}`}
                  </Text>
                )}
                {baseData.hasScoreData ? (
                  <Tooltip label="View data">
                    <Button
                      data-test="Assignment Setting Button"
                      colorScheme="blue"
                      mt="4px"
                      ml="4px"
                      size="xs"
                      leftIcon={<MdDataset />}
                      pr={{ base: "0px", md: "10px" }}
                      onClick={() => {
                        fetcher.submit(
                          { _action: "go to data", activityId },
                          { method: "post" },
                        );
                      }}
                    >
                      <Show above="md">View data</Show>
                    </Button>
                  </Tooltip>
                ) : null}
              </Center>
            ) : null}
            {editor}
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
}
