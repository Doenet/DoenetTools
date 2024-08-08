import React, { useCallback, useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router";

import { DoenetEditor, DoenetViewer } from "@doenet/doenetml-iframe";

import {
  Box,
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
} from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { useFetcher } from "react-router-dom";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { ContentSettingsDrawer } from "../ToolPanels/ContentSettingsDrawer";
import { DateTime } from "luxon";
import { InfoIcon } from "@chakra-ui/icons";
import { AssignmentInvitation } from "../ToolPanels/AssignmentInvitation";
import { AssignmentSettingsDrawer } from "../ToolPanels/AssignmentSettingsDrawer";

export type DoenetmlVersion = {
  id: number;
  displayedVersion: string;
  fullVersion: string;
  default: boolean;
  deprecated: boolean;
  removed: boolean;
  deprecationMessage: string;
};

export type LicenseCode = "CCDUAL" | "CCBYSA" | "CCBYNCSA";

export type License = {
  code: LicenseCode;
  name: string;
  description: string;
  imageURL: string | null;
  smallImageURL: string | null;
  licenseURL: string | null;
  isComposition: boolean;
  composedOf: {
    code: LicenseCode;
    name: string;
    description: string;
    imageURL: string | null;
    smallImageURL: string | null;
    licenseURL: string | null;
  }[];
};

export type AssignmentStatus = "Unassigned" | "Closed" | "Open";

export type ContentClassification = {
  id: number;
  code: string;
  grade: string | null;
  category: string;
  description: string;
  system: {
    id: number;
    name: string;
  };
};

export type ContentStructure = {
  id: number;
  ownerId: number;
  name: string;
  imagePath: string | null;
  assignmentStatus: AssignmentStatus;
  isFolder?: boolean;
  classCode: string | null;
  codeValidUntil: string | null;
  isPublic: boolean;
  license: License | null;
  classifications: ContentClassification[];
  documents: {
    id: number;
    versionNum?: number;
    name?: string;
    source?: string;
    doenetmlVersion: DoenetmlVersion;
  }[];
  hasScoreData: boolean;
  parentFolder: {
    id: number;
    name: string;
    isPublic: boolean;
  } | null;
};

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  //Don't let name be blank
  let name = formObj?.name?.trim();
  if (name == "") {
    name = "Untitled";
  }

  if (formObj._action == "update name") {
    await axios.post(`/api/updateContentName`, {
      id: Number(params.activityId),
      name,
    });
    return true;
  }

  if (formObj._action == "update general") {
    let learningOutcomes;
    if (formObj.learningOutcomes) {
      learningOutcomes = JSON.parse(formObj.learningOutcomes);
    }

    await axios.post("/api/updateContentSettings", {
      name,
      imagePath: formObj.imagePath,
      id: Number(params.activityId),
      learningOutcomes,
    });

    if (formObj.doenetmlVersionId) {
      // TODO: handle other updates to just a document
      await axios.post("/api/updateDocumentSettings", {
        docId: formObj.docId,
        doenetmlVersionId: formObj.doenetmlVersionId,
      });
    }
    return true;
  }
  if (formObj._action == "update description") {
    await axios.get("/api/updateFileDescription", {
      params: {
        activityId: Number(params.activityId),
        cid: formObj.cid,
        description: formObj.description,
      },
    });
    return true;
  }
  if (formObj._action == "remove file") {
    let resp = await axios.get("/api/deleteFile", {
      params: { activityId: Number(params.activityId), cid: formObj.cid },
    });

    return {
      _action: formObj._action,
      fileRemovedCid: formObj.cid,
      success: resp.data.success,
    };
  }

  if (formObj._action == "open assignment") {
    let closeAt: DateTime;
    if (formObj.duration === "custom") {
      closeAt = DateTime.fromISO(formObj.customCloseAt);
    } else {
      closeAt = DateTime.fromSeconds(
        Math.round(DateTime.now().toSeconds() / 60) * 60,
      ).plus(JSON.parse(formObj.duration));
    }
    await axios.post("/api/openAssignmentWithCode", {
      activityId: Number(params.activityId),
      closeAt,
    });
    return true;
  }

  if (formObj._action == "update assignment close time") {
    const closeAt = DateTime.fromISO(formObj.closeAt);
    await axios.post("/api/updateAssignmentSettings", {
      activityId: Number(params.activityId),
      closeAt,
    });
    return true;
  }

  if (formObj._action == "close assignment") {
    await axios.post("/api/closeAssignmentWithCode", {
      activityId: Number(params.activityId),
    });
    return true;
  }

  if (formObj._action == "unassign activity") {
    try {
      await axios.post("/api/unassignActivity", {
        activityId: Number(formObj.activityId),
      });
    } catch (e) {
      alert("Unable to unassign activity");
    }
    return true;
  }

  if (formObj._action == "make content public") {
    if (formObj.isFolder === "true") {
      await axios.post("/api/makeFolderPublic", {
        id: Number(formObj.id),
        licenseCode: formObj.licenseCode,
      });
    } else {
      await axios.post("/api/makeActivityPublic", {
        id: Number(formObj.id),
        licenseCode: formObj.licenseCode,
      });
    }
    return true;
  }

  if (formObj._action == "make content private") {
    if (formObj.isFolder === "true") {
      await axios.post("/api/makeFolderPrivate", {
        id: Number(formObj.id),
      });
    } else {
      await axios.post("/api/makeActivityPrivate", {
        id: Number(formObj.id),
      });
    }
    return true;
  }

  if (formObj._action == "add content classification") {
    if (formObj.isFolder !== "true") {
      await axios.post("/api/addClassification", {
        activityId: Number(formObj.activityId),
        classificationId: Number(formObj.classificationId),
      });
      return true;
    }
  }
  if (formObj._action == "remove content classification") {
    if (formObj.isFolder !== "true") {
      await axios.post("/api/removeClassification", {
        activityId: Number(formObj.activityId),
        classificationId: Number(formObj.classificationId),
      });
      return true;
    }
  }

  if (formObj._action == "go to data") {
    return redirect(`/assignmentData/${params.activityId}`);
  }

  return null;
}

export async function loader({ params }) {
  const {
    data: { notMe, activity: activityData },
  } = await axios.get(`/api/getActivityEditorData/${params.activityId}`);

  if (notMe) {
    return redirect(
      `/publicEditor/${params.activityId}${params.docId ? "/" + params.docId : ""}`,
    );
  }

  let activityId = Number(params.activityId);
  let docId = Number(params.docId);
  if (!docId) {
    // If docId was not supplied in the url,
    // then use the first docId from the activity.
    // TODO: what happens if activity has no documents?
    docId = activityData.documents[0].id;
  }

  // If docId isn't in the activity, use the first docId
  let docInOrder = activityData.documents.map((x) => x.id).indexOf(docId);
  if (docInOrder === -1) {
    docInOrder = 0;
    docId = activityData.documents[docInOrder].id;
  }

  const doenetML = activityData.documents[docInOrder].source;
  const doenetmlVersion: DoenetmlVersion =
    activityData.documents[docInOrder].doenetmlVersion;

  const supportingFileResp = await axios.get(
    `/api/loadSupportingFileInfo/${activityId}`,
  );

  let supportingFileData = supportingFileResp.data;

  //This code isn't depreciated but only works on Chrome
  //navigator.userAgentData.platform.indexOf("linux") != -1
  // let platform = "Linux";
  // if (navigator.userAgentData.platform.indexOf("win") != -1) {
  //   platform = "Win";
  // } else if (navigator.userAgentData.platform.indexOf("mac") != -1) {
  //   platform = "Mac";
  // }
  //Win, Mac or Linux
  let platform = "Linux";
  if (navigator.platform.indexOf("Win") != -1) {
    platform = "Win";
  } else if (navigator.platform.indexOf("Mac") != -1) {
    platform = "Mac";
  }

  const { data: allDoenetmlVersions } = await axios.get(
    "/api/getAllDoenetmlVersions",
  );

  const { data: allLicenses } = await axios.get("/api/getAllLicenses");

  return {
    platform,
    activityData,
    docId,
    doenetML,
    doenetmlVersion,
    activityId,
    supportingFileData,
    allDoenetmlVersions,
    allLicenses,
  };
}

//This is separate as <Editable> wasn't updating when defaultValue was changed
function EditableName({ dataTest }) {
  const { activityData } = useLoaderData() as { activityData: any };
  const [name, setName] = useState(activityData.name);
  const fetcher = useFetcher();

  let lastActivityDataName = useRef(activityData.name);

  //Update when something else updates the name
  if (activityData.name != lastActivityDataName.current) {
    if (name != activityData.name) {
      setName(activityData.name);
    }
  }
  lastActivityDataName.current = activityData.name;

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
        let submitValue = value;

        fetcher.submit(
          { _action: "update name", name: submitValue },
          { method: "post" },
        );
      }}
    >
      <Tooltip label={name}>
        <EditablePreview data-test="Editable Preview" noOfLines={1} />
      </Tooltip>
      <EditableInput
        width={{ base: "200px", sm: "300px", md: "400px" }}
        data-test="Editable Input"
      />
    </Editable>
  );
}

export function ActivityEditor() {
  const {
    platform,
    activityId,
    doenetML,
    doenetmlVersion,
    docId,
    activityData,
    allDoenetmlVersions,
    allLicenses,
  } = useLoaderData() as {
    platform: "Win" | "Mac" | "Linux";
    activityId: number;
    doenetML: string;
    doenetmlVersion: DoenetmlVersion;
    docId: number;
    activityData: ContentStructure;
    allDoenetmlVersions: DoenetmlVersion[];
    allLicenses: License[];
  };

  const {
    isOpen: settingsAreOpen,
    onOpen: settingsOnOpen,
    onClose: settingsOnClose,
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

  const initializeEditorDoenetML = useRef(doenetML);
  const textEditorDoenetML = useRef(doenetML);
  const savedDoenetML = useRef(doenetML);

  const assignmentStatus = activityData.assignmentStatus;

  const readOnly = assignmentStatus !== "Unassigned";
  const readOnlyRef = useRef(readOnly);
  readOnlyRef.current = readOnly;

  const [mode, setMode] = useState<"Edit" | "View">(readOnly ? "View" : "Edit");

  const initialWarnings = doenetmlVersion.deprecated
    ? [
        {
          level: 1,
          message: `DoenetML version
            ${doenetmlVersion.displayedVersion} is deprecated.
            ${doenetmlVersion.deprecationMessage}`,
        },
      ]
    : [];

  const inTheMiddleOfSaving = useRef(false);
  const postponedSaving = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (readOnly) {
      setMode("View");
    } else {
      setMode("Edit");
    }
  }, [readOnly]);

  const handleSaveDoc = useCallback(async () => {
    if (
      readOnlyRef.current ||
      savedDoenetML.current === textEditorDoenetML.current
    ) {
      // do not attempt to save doenetml if assigned
      return;
    }

    const newDoenetML = textEditorDoenetML.current;
    if (inTheMiddleOfSaving.current) {
      postponedSaving.current = true;
    } else {
      inTheMiddleOfSaving.current = true;

      //Save in localStorage
      // localStorage.setItem(cid,doenetML)

      try {
        const params = {
          doenetML: newDoenetML,
          docId,
        };
        await axios.post("/api/saveDoenetML", params);
        savedDoenetML.current = newDoenetML;
      } catch (error) {
        alert(error.message);
      }

      inTheMiddleOfSaving.current = false;

      //If we postponed then potentially
      //some changes were saved again while we were saving
      //so save again
      if (postponedSaving.current) {
        postponedSaving.current = false;
        handleSaveDoc();
      }
    }
  }, [docId]);

  // save draft when leave page
  useEffect(() => {
    return () => {
      handleSaveDoc();
    };
  }, [handleSaveDoc]);

  useEffect(() => {
    document.title = `${activityData.name} - Doenet`;
  }, [activityData.name]);

  const controlsBtnRef = useRef<HTMLButtonElement>(null);
  const [displaySettingsTab, setSettingsDisplayTab] =
    useState<"general">("general");

  const fetcher = useFetcher();

  const [editLabel, editTooltip, editIcon] =
    assignmentStatus === "Unassigned"
      ? ["Edit", "Edit activity", <MdModeEditOutline />]
      : ["See Inside", "See read-only view of source", <MdOutlineEditOff />];

  return (
    <>
      <ContentSettingsDrawer
        isOpen={settingsAreOpen}
        onClose={settingsOnClose}
        finalFocusRef={controlsBtnRef}
        fetcher={fetcher}
        id={activityId}
        contentData={activityData}
        allDoenetmlVersions={allDoenetmlVersions}
        allLicenses={allLicenses}
        displayTab={displaySettingsTab}
      />
      <AssignmentSettingsDrawer
        isOpen={assignmentSettingsAreOpen}
        onClose={assignmentSettingsOnClose}
        finalFocusRef={controlsBtnRef}
        fetcher={fetcher}
        id={activityId}
        contentData={activityData}
      />
      <AssignmentInvitation
        isOpen={invitationIsOpen}
        onClose={invitationOnClose}
        activityData={activityData}
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
              base: "1fr 200px 1fr",
              sm: "1fr 300px 1fr",
              md: "1fr 400px 1fr",
            }}
            width="100%"
          >
            <GridItem area="leftControls">
              <HStack ml="10px" mt="4px">
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
                        initializeEditorDoenetML.current =
                          textEditorDoenetML.current;
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
              <HStack mr="10px">
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
                        assignmentSettingsOnOpen();
                      }}
                    >
                      <Show above="md">Assign</Show>
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
                        setSettingsDisplayTab("general");
                        settingsOnOpen();
                      }}
                      ref={controlsBtnRef}
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
                      {` Assignment is open with code ${activityData.classCode}. ${mode == "Edit" ? "It cannot be edited." : ""}`}
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
                {activityData.hasScoreData ? (
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
            {mode == "Edit" && (
              <DoenetEditor
                height={`calc(100vh - ${readOnly ? 120 : 80}px)`}
                width="100%"
                doenetML={textEditorDoenetML.current}
                doenetmlChangeCallback={handleSaveDoc}
                immediateDoenetmlChangeCallback={(newDoenetML: string) => {
                  textEditorDoenetML.current = newDoenetML;
                }}
                doenetmlVersion={doenetmlVersion.fullVersion}
                initialWarnings={initialWarnings}
                border="none"
                readOnly={readOnly}
              />
            )}

            {mode == "View" && (
              <Grid
                width="100%"
                height={`calc(100vh - ${readOnly ? 120 : 80}px)`}
                templateAreas={`"leftGutter viewer rightGutter"`}
                templateColumns={`1fr minmax(300px,850px) 1fr`}
                overflow="hidden"
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
                  <VStack
                    spacing={0}
                    margin="10px 0px 10px 0px" //Only need when there is an outline
                  >
                    <Box
                      h={"calc(100vh - 100px)"}
                      background="var(--canvas)"
                      borderWidth="1px"
                      borderStyle="solid"
                      borderColor="doenet.mediumGray"
                      padding="0px 0px 20px 0px"
                      flexGrow={1}
                      overflow="scroll"
                      w="100%"
                      id="viewer-container"
                    >
                      <DoenetViewer
                        doenetML={textEditorDoenetML.current}
                        doenetmlVersion={doenetmlVersion.fullVersion}
                        flags={{
                          showCorrectness: true,
                          solutionDisplayMode: "button",
                          showFeedback: true,
                          showHints: true,
                          autoSubmit: false,
                          allowLoadState: false,
                          allowSaveState: false,
                          allowLocalState: false,
                          allowSaveSubmissions: false,
                          allowSaveEvents: false,
                        }}
                        attemptNumber={1}
                        idsIncludeActivityId={false}
                        paginate={true}
                        location={location}
                        navigate={navigate}
                        linkSettings={{
                          viewURL: "/activityViewer",
                          editURL: "/publicEditor",
                        }}
                        includeVariantSelector={true}
                      />
                    </Box>
                  </VStack>
                </GridItem>
              </Grid>
            )}
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
}
