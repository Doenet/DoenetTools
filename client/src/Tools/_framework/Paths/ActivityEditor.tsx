import React, { useCallback, useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router";

import { DoenetEditor, DoenetViewer } from "@doenet/doenetml-iframe";

import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Grid,
  GridItem,
  HStack,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { BsPlayBtnFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { useFetcher } from "react-router-dom";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { ActivitySettingsDrawer } from "../ToolPanels/ActivitySettingsDrawer";

export type DoenetmlVersion = {
  id: number;
  displayedVersion: string;
  fullVersion: string;
  default: boolean;
  deprecated: boolean;
  removed: boolean;
  deprecationMessage: string;
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
    let isPublic;

    if (formObj.isPublic) {
      isPublic = formObj.isPublic === "true";
    }

    await axios.post("/api/updateContentSettings", {
      name,
      imagePath: formObj.imagePath,
      isPublic,
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

  return null;
}

export async function loader({ params }) {
  const { data: activityData } = await axios.get(
    `/api/getActivityEditorData/${params.activityId}`,
  );

  if (activityData.notMe) {
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

  return {
    platform,
    activityData,
    docId,
    doenetML,
    doenetmlVersion,
    activityId,
    supportingFileData,
    allDoenetmlVersions,
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
      <EditablePreview data-test="Editable Preview" />
      <EditableInput width="400px" data-test="Editable Input" />
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
  } = useLoaderData() as {
    platform: "Win" | "Mac" | "Linux";
    activityId: number;
    doenetML: string;
    doenetmlVersion: DoenetmlVersion;
    docId: number;
    activityData: any;
    allDoenetmlVersions: DoenetmlVersion[];
  };

  const {
    isOpen: controlsAreOpen,
    onOpen: controlsOnOpen,
    onClose: controlsOnClose,
  } = useDisclosure();

  let initializeEditorDoenetML = useRef(doenetML);

  let textEditorDoenetML = useRef(doenetML);
  const [mode, setMode] = useState("Edit");

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

  let inTheMiddleOfSaving = useRef(false);
  let postponedSaving = useRef(false);

  let navigate = useNavigate();
  let location = useLocation();

  const handleSaveDoc = useCallback(async () => {
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

  //Need fetcher at this level to get name refresh
  //when close drawer after changing name
  const fetcher = useFetcher();

  return (
    <>
      <ActivitySettingsDrawer
        isOpen={controlsAreOpen}
        onClose={controlsOnClose}
        finalFocusRef={controlsBtnRef}
        fetcher={fetcher}
        activityId={activityId}
        docId={docId}
        activityData={activityData}
        allDoenetmlVersions={allDoenetmlVersions}
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
            templateColumns="1fr 400px 1fr"
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
                      leftIcon={<BsPlayBtnFill />}
                      onClick={() => {
                        setMode("View");
                      }}
                    >
                      View
                    </Button>
                  </Tooltip>
                  <Tooltip hasArrow label="Edit Activity">
                    <Button
                      isActive={mode == "Edit"}
                      data-test="Edit Mode Button"
                      size="sm"
                      leftIcon={<MdModeEditOutline />}
                      onClick={() => {
                        initializeEditorDoenetML.current =
                          textEditorDoenetML.current;
                        setMode("Edit");
                      }}
                    >
                      Edit
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
                <Tooltip
                  hasArrow
                  label={
                    platform == "Mac"
                      ? "Open Controls cmd+u"
                      : "Open Controls ctrl+u"
                  }
                >
                  <Button
                    data-test="Controls Button"
                    mt="4px"
                    size="sm"
                    variant="outline"
                    leftIcon={<FaCog />}
                    onClick={controlsOnOpen}
                    ref={controlsBtnRef}
                  >
                    Controls
                  </Button>
                </Tooltip>
              </HStack>
            </GridItem>
          </Grid>
        </GridItem>

        {mode == "Edit" && (
          <GridItem area="centerContent">
            <DoenetEditor
              height={`calc(100vh - 80px)`}
              width="100%"
              doenetML={textEditorDoenetML.current}
              doenetmlChangeCallback={handleSaveDoc}
              immediateDoenetmlChangeCallback={(newDoenetML) => {
                textEditorDoenetML.current = newDoenetML;
              }}
              doenetmlVersion={doenetmlVersion.fullVersion}
              initialWarnings={initialWarnings}
              border="none"
            />
          </GridItem>
        )}

        {mode == "View" && (
          <>
            <GridItem area="centerContent">
              <Grid
                width="100%"
                height="calc(100vh - 80px)"
                templateAreas={`"leftGutter viewer rightGutter"`}
                templateColumns={`1fr minmax(400px,850px) 1fr`}
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
            </GridItem>
          </>
        )}
      </Grid>
    </>
  );
}
