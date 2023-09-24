import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useLocation,
} from "react-router";
import { DoenetML } from "../../../Viewer/DoenetML";
import CodeMirror from "../CodeMirror";

import { Form, useFetcher } from "react-router-dom";
import {
  Link,
  Box,
  Button,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Select,
  Spacer,
  Tooltip,
  VStack,
  useEditableControls,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import findFirstPageIdInContent from "../../../_utils/findFirstPage";
import AccountMenu from "../ChakraBasedComponents/AccountMenu";
import {
  CheckIcon,
  CloseIcon,
  EditIcon,
  ExternalLinkIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { SlLayers } from "react-icons/sl";
import { FaCog } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import ErrorWarningPopovers from "../ChakraBasedComponents/ErrorWarningPopovers";
import { useSetRecoilState } from "recoil";
import { textEditorDoenetMLAtom } from "../../../_sharedRecoil/EditorViewerRecoil";
import { useSaveDraft } from "../../../_utils/hooks/useSaveDraft";
import { RxUpdate } from "react-icons/rx";
import { cidFromText } from "../../../Core/utils/cid";

export async function loader({ params }) {
  let doenetId = params.doenetId;
  let pageId = params.pageId;

  try {
    const { data } = await axios.get(
      `/api/getPortfolioActivity.php?doenetId=${doenetId}`,
    );

    const { label, courseId, isDeleted, isBanned, isPublic, json, imagePath } =
      data;

    let publicDoenetML = null;
    let draftDoenetML = "";

    //Links to activity shouldn't need to know the pageId so they use and underscore
    if (pageId == "_") {
      let nextPageId = findFirstPageIdInContent(json.content);

      //TODO: code what should happen when there are only orders and no pageIds
      if (nextPageId != "_") {
        return redirect(`/portfolioActivity/${doenetId}/${nextPageId}`);
      }
    }

    const response = await axios.get("/api/getPorfolioCourseId.php");
    let { firstName, lastName, email } = response.data;

    if (data.json.assignedCid != null) {
      const { data: activityML } = await axios.get(
        `/media/${data.json.assignedCid}.doenet`,
      );

      // console.log("activityML", activityML);
      //Find the first page's doenetML
      const regex = /<page\s+cid="(\w+)"\s+(label="[^"]+"\s+)?\/>/;
      const pageIds = activityML.match(regex);

      const pageCId = pageIds[1];

      //Get the doenetML of the pageId.
      //we need transformResponse because
      //large numbers are simplified with toString if used on doenetMLResponse.data
      //which was causing errors

      const publicDoenetMLResponse = await axios.get(
        `/media/${pageCId}.doenet`,
        {
          transformResponse: (data) => data.toString(),
        },
      );
      publicDoenetML = publicDoenetMLResponse.data;
    }

    const draftDoenetMLResponse = await axios.get(
      `/media/byPageId/${pageId}.doenet`,
      { transformResponse: (data) => data.toString() },
    );
    draftDoenetML = draftDoenetMLResponse.data;

    const lastKnownCid = await cidFromText(draftDoenetML);

    //Win, Mac or Linux
    let platform = "Linux";
    if (navigator.platform.indexOf("Win") != -1) {
      platform = "Win";
    } else if (navigator.platform.indexOf("Mac") != -1) {
      platform = "Mac";
    }

    return {
      success: true,
      message: "",
      pageId,
      doenetId,
      publicDoenetML,
      draftDoenetML,
      label,
      courseId,
      isDeleted,
      isBanned,
      isPublic,
      json,
      imagePath,
      firstName,
      lastName,
      email,
      platform,
      lastKnownCid,
    };
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

//TODO: stub for future features
export async function action({ request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  console.log("action formObj", formObj);
  return formObj;
}

//This is separate as <Editable> wasn't updating when defaultValue was changed
function EditableActivityLabel() {
  const { label: loaderLabel } = useLoaderData();
  const [label, setLabel] = useState(loaderLabel);
  const fetcher = useFetcher();

  let lastActivityDataLabel = useRef(loaderLabel);

  //Update when something else updates the label
  if (loaderLabel != lastActivityDataLabel.current) {
    if (label != loaderLabel) {
      setLabel(loaderLabel);
    }
  }
  lastActivityDataLabel.current = loaderLabel;

  function EditableControls() {
    const { isEditing, getEditButtonProps } = useEditableControls();

    return isEditing ? (
      <IconButton
        size="sm"
        ml="5px"
        mt="4px"
        rounded="full"
        icon={<CheckIcon />}
        {...getEditButtonProps()}
      />
    ) : (
      <IconButton
        size="sm"
        ml="5px"
        mt="4px"
        rounded="full"
        icon={<EditIcon />}
        {...getEditButtonProps()}
      />
    );
  }

  return (
    <Editable
      data-test="Activity Label"
      isPreviewFocusable={false}
      value={label}
      display="flex" //Need this or the button isn't idependent of the preview
      onChange={(value) => {
        setLabel(value);
      }}
      onSubmit={(value) => {
        let submitValue = value;

        fetcher.submit(
          { _action: "update label", label: submitValue },
          { method: "post" },
        );
      }}
    >
      <EditablePreview
        mt="2px"
        fontSize="1.2em"
        // whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        data-test="Activity Label Editable Preview"
      />
      <EditableInput
        fontSize="1.2em"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        data-test="Activity Label Editable Input"
      />
      <EditableControls />
    </Editable>
  );
}

export function PortfolioActivity() {
  const {
    success,
    message,
    pageId,
    doenetId,
    publicDoenetML,
    draftDoenetML,
    label,
    courseId,
    isDeleted,
    isBanned,
    isPublic,
    json,
    imagePath,
    firstName,
    lastName,
    email,
    platform,
    lastKnownCid,
  } = useLoaderData();

  // const { signedIn } = useOutletContext();

  if (!success) {
    throw new Error(message);
  }

  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  let editorRef = useRef(null);
  let timeout = useRef(null);
  //Warning: this will reboot codeMirror Editor sending cursor to the top
  let initializeEditorDoenetML = useRef(draftDoenetML);
  let textEditorDoenetML = useRef(draftDoenetML);

  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  let [codeChanged, setCodeChanged] = useState(false);
  const codeChangedRef = useRef(null); //To keep value up to date in the code mirror function
  codeChangedRef.current = codeChanged;
  const [viewerDoenetML, setViewerDoenetML] = useState(draftDoenetML);
  const [layer, setLayer] = useState("draft");

  const [errorsAndWarnings, setErrorsAndWarningsCallback] = useState({
    errors: [],
    warnings: [],
  });

  const warningsLevel = 1; //TODO: eventually give user ability adjust warning level filter
  const warningsObjs = errorsAndWarnings.warnings.filter(
    (w) => w.level <= warningsLevel,
  );
  const errorsObjs = [...errorsAndWarnings.errors];

  let lastKnownCidRef = useRef(lastKnownCid);
  let backupOldDraft = useRef(true);
  let inTheMiddleOfSaving = useRef(false);
  let postponedSaving = useRef(false);

  const { saveDraft } = useSaveDraft();

  const handleSaveDraft = useCallback(async () => {
    const doenetML = textEditorDoenetML.current;
    const lastKnownCid = lastKnownCidRef.current;
    const backup = backupOldDraft.current;

    if (inTheMiddleOfSaving.current) {
      postponedSaving.current = true;
    } else {
      inTheMiddleOfSaving.current = true;
      let result = await saveDraft({
        pageId,
        courseId,
        backup,
        lastKnownCid,
        doenetML,
      });

      if (result.success) {
        backupOldDraft.current = false;
        lastKnownCidRef.current = result.cid;
      }
      inTheMiddleOfSaving.current = false;
      timeout.current = null;

      //If we postponed then potentially
      //some changes were saved again while we were saving
      //so save again
      if (postponedSaving.current) {
        postponedSaving.current = false;
        handleSaveDraft();
      }
    }
  }, [pageId, courseId, saveDraft]);

  useEffect(() => {
    const handleEditorKeyDown = (event) => {
      if (
        (platform == "Mac" && event.metaKey && event.code === "KeyS") ||
        (platform != "Mac" && event.ctrlKey && event.code === "KeyS")
      ) {
        event.preventDefault();
        event.stopPropagation();
        setViewerDoenetML(textEditorDoenetML.current);
        setCodeChanged(false);
        clearTimeout(timeout.current);
        handleSaveDraft();
      }
    };

    // const handleDocumentKeyDown = (event) => {
    //   if (
    //     (platform == "Mac" && event.metaKey && event.code === "KeyU") ||
    //     (platform != "Mac" && event.ctrlKey && event.code === "KeyU")
    //   ) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     // controlsOnOpen();
    //   }
    // };

    // window.addEventListener("keydown", handleDocumentKeyDown);
    window.addEventListener("keydown", handleEditorKeyDown);

    return () => {
      // window.removeEventListener("keydown", handleDocumentKeyDown);
      window.removeEventListener("keydown", handleEditorKeyDown);
    };
  }, [textEditorDoenetML, platform, handleSaveDraft]);

  useEffect(() => {
    document.title = `${label} - Doenet`;
  }, [label]);

  const [variants, setVariants] = useState({
    index: 1,
    numVariants: 1,
    allPossibleVariants: ["a"],
  });

  let viewerPanel = (
    <VStack mt="0px" height="calc(100vh - 50px)" spacing={0} width="100%">
      <HStack
        w="100%"
        h="32px"
        mb="2px"
        justifyContent={variants.numVariants > 1 ? "space-between" : "flex-end"}
      >
        {variants.numVariants > 1 && (
          <VariantSelect
            size="sm"
            menuWidth="140px"
            array={variants.allPossibleVariants}
            onChange={(index) =>
              setVariants((prev) => {
                let next = { ...prev };
                next.index = index + 1;
                return next;
              })
            }
          />
        )}
        {editMode || layer == "public" ? (
          <Spacer h="32px" />
        ) : (
          <Button
            size="sm"
            data-test="Edit"
            rightIcon={<EditIcon />}
            onClick={() => {
              setEditMode(true);
            }}
          >
            Edit
          </Button>
        )}
      </HStack>

      <Box
        h="calc(100vh - 80px)"
        background="var(--canvas)"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="doenet.mediumGray"
        width="100%"
        overflow="scroll"
      >
        <DoenetML
          key={`ActivityOverviewPageViewer`}
          doenetML={viewerDoenetML}
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
          setErrorsAndWarningsCallback={setErrorsAndWarningsCallback}
          // doenetId={doenetId}
          attemptNumber={1}
          idsIncludeActivityId={false}
          generatedVariantCallback={setVariants}
          requestedVariantIndex={variants.index}
          // setIsInErrorState={setIsInErrorState}
          location={location}
          navigate={navigate}
          linkSettings={{
            viewURL: "/portfolioviewer",
            editURL: "/publiceditor",
          }}
        />
      </Box>
    </VStack>
  );

  let editorPanel = (
    <VStack mt="5px" height="calc(100vh - 50px)" spacing={0} width="100%">
      <HStack w="100%" h="32px" mb="2px" justifyContent="flex-end">
        <Box>
          <Tooltip
            hasArrow
            label={
              platform == "Mac"
                ? "Updates Viewer cmd+s"
                : "Updates Viewer ctrl+s"
            }
          >
            <Button
              size="sm"
              variant="outline"
              data-test="Viewer Update Button"
              bg="doenet.canvas"
              leftIcon={<RxUpdate />}
              rightIcon={
                codeChanged ? (
                  <WarningTwoIcon color="doenet.mainBlue" fontSize="18px" />
                ) : (
                  ""
                )
              }
              isDisabled={!codeChanged}
              onClick={() => {
                setViewerDoenetML(textEditorDoenetML.current);
                setCodeChanged(false);
                clearTimeout(timeout.current);
                handleSaveDraft();
              }}
            >
              Update
            </Button>
          </Tooltip>
        </Box>
        <Link
          borderRadius="lg"
          p="4px 5px 0px 5px"
          h="32px"
          bg="#EDF2F7"
          href="https://www.doenet.org/publicOverview/_7KL7tiBBS2MhM6k1OrPt4"
          isExternal
          data-test="Documentation Link"
        >
          Documentation <ExternalLinkIcon mx="2px" />
        </Link>

        <Button
          size="sm"
          data-test="Edit"
          rightIcon={<CloseIcon />}
          onClick={() => {
            initializeEditorDoenetML.current = textEditorDoenetML.current;
            setEditMode(false);
          }}
        >
          Close
        </Button>
      </HStack>

      <Box
        top="50px"
        boxSizing="border-box"
        background="doenet.canvas"
        height={`calc(100vh - 84px)`}
        overflowY="scroll"
        borderRight="solid 1px"
        borderTop="solid 1px"
        borderBottom="solid 1px"
        borderColor="doenet.mediumGray"
        w="100%"
      >
        <Box height={`calc(100vh - 118px)`} w="100%" overflow="scroll">
          <CodeMirror
            editorRef={editorRef}
            setInternalValueTo={initializeEditorDoenetML.current}
            onBeforeChange={(value) => {
              textEditorDoenetML.current = value;
              setEditorDoenetML(value);
              if (!codeChangedRef.current) {
                setCodeChanged(true);
              }
              // Debounce save to server at 3 seconds
              clearTimeout(timeout.current);
              timeout.current = setTimeout(async function () {
                handleSaveDraft();
              }, 3000); //3 seconds
            }}
          />
        </Box>

        <Box bg="doenet.mainGray" h="32px" w="100%">
          <Flex ml="0px" h="32px" bg="doenet.mainGray" pl="10px" pt="1px">
            <ErrorWarningPopovers
              warningsObjs={warningsObjs}
              errorsObjs={errorsObjs}
            />
          </Flex>
        </Box>
      </Box>
    </VStack>
  );

  return (
    <Grid
      background="doenet.lightBlue"
      minHeight="100vh"
      templateAreas={`"header header header"
      "leftGutter centerContent rightGutter"
      `}
      templateRows="40px auto"
      templateColumns=".06fr 1fr .06fr"
      position="relative"
    >
      <GridItem area="header" zIndex="500">
        <Grid
          width="100%"
          height="40px"
          templateAreas={`"leftHeader rightHeader"`}
          templateColumns={`1fr 300px`}
          overflow="hidden"
          background="doenet.canvas"
        >
          <GridItem area="leftHeader" pl="10px" pr="10px">
            <EditableActivityLabel />
          </GridItem>
          <GridItem area="rightHeader">
            <HStack spacing="5" mr="10px" justifyContent="flex-end">
              <HStack spacing="2">
                <Icon as={SlLayers} />
                {editMode ? (
                  <Text>Draft</Text>
                ) : (
                  <Select
                    size="sm"
                    onChange={(e) => {
                      setLayer(e.target.value);
                      if (e.target.value == "draft") {
                        setViewerDoenetML(draftDoenetML);
                      } else {
                        setViewerDoenetML(publicDoenetML);
                      }
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="public">Public</option>
                  </Select>
                )}
              </HStack>

              <Tooltip
                hasArrow
                label={
                  platform == "Mac"
                    ? "Open Settings cmd+u"
                    : "Open Settings ctrl+u"
                }
              >
                <Button
                  data-test="Settings Button"
                  mt="4px"
                  size="sm"
                  variant="outline"
                  leftIcon={<FaCog />}
                  // onClick={controlsOnOpen}
                  // ref={controlsBtnRef}
                >
                  Settings
                </Button>
              </Tooltip>

              <AccountMenu
                firstName={firstName}
                lastName={lastName}
                email={email}
              />
            </HStack>
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
      <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
      <GridItem area="centerContent">
        <MainContent
          viewerPanel={viewerPanel}
          editorPanel={editorPanel}
          editMode={editMode}
        />
      </GridItem>
    </Grid>
  );
}

const clamp = (
  value,
  min = Number.POSITIVE_INFINITY,
  max = Number.NEGATIVE_INFINITY,
) => {
  return Math.min(Math.max(value, min), max);
};

const MainContent = ({ viewerPanel, editorPanel, editMode }) => {
  const centerWidth = "10px";
  const wrapperRef = useRef();
  const [hideLeft, setHideLeft] = useState(false);
  const [hideRight, setHideRight] = useState(false);

  useEffect(() => {
    let templateAreas = `"viewer"`;
    let templateColumns = `1fr`;
    if (editMode) {
      templateAreas = `"viewer middleGutter textEditor"`;
      templateColumns = `.5fr ${centerWidth} .5fr`;
    }

    wrapperRef.current.style.gridTemplateColumns = templateColumns;
    wrapperRef.current.style.gridTemplateAreas = templateAreas;
  }, [editMode]);

  useEffect(() => {
    wrapperRef.current.handleClicked = false;
    wrapperRef.current.handleDragged = false;
  }, []);

  const onMouseDown = (event) => {
    event.preventDefault();
    wrapperRef.current.handleClicked = true;
  };

  const onMouseMove = (event) => {
    //TODO: minimum movment calc
    if (wrapperRef.current.handleClicked) {
      event.preventDefault();
      wrapperRef.current.handleDragged = true;

      let proportion = clamp(
        (event.clientX - wrapperRef.current.offsetLeft) /
          wrapperRef.current.clientWidth,
        0,
        1,
      );
      const leftPixels = proportion * wrapperRef.current.clientWidth;
      const rightPixels = wrapperRef.current.clientWidth - leftPixels;
      if (leftPixels < 150 && !hideLeft) {
        setHideLeft(true);
      } else if (leftPixels >= 150 && hideLeft) {
        setHideLeft(false);
      }
      if (leftPixels < 150) {
        proportion = 0;
      }
      if (rightPixels < 300 && !hideRight) {
        setHideRight(true);
      } else if (rightPixels >= 300 && hideRight) {
        setHideRight(false);
      }
      if (rightPixels < 300) {
        proportion = 1;
      }

      //using a ref to save without react refresh
      wrapperRef.current.style.gridTemplateColumns = `${proportion}fr ${centerWidth} ${
        1 - proportion
      }fr`;
      wrapperRef.current.proportion = proportion;
    }
  };

  const onMouseUp = () => {
    if (wrapperRef.current.handleClicked) {
      wrapperRef.current.handleClicked = false;
      if (wrapperRef.current.handleDragged) {
        wrapperRef.current.handleDragged = false;
      }
    }
  };

  const onDoubleClick = () => {
    setHideRight(false);
    setHideLeft(false);
    const proportion = 0.5;

    //using a ref to save without react refresh
    wrapperRef.current.style.gridTemplateColumns = `${proportion}fr ${centerWidth} ${
      1 - proportion
    }fr`;
    wrapperRef.current.proportion = proportion;
  };

  return (
    <Grid
      width="100vw"
      height={`calc(100vh - 40px)`}
      templateAreas={`"viewer"`}
      templateColumns={`1fr`}
      overflow="hidden"
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      ref={wrapperRef}
    >
      <GridItem
        area="viewer"
        width="100%"
        placeSelf="center"
        maxWidth="850px"
        overflow="hidden"
      >
        {hideLeft ? null : viewerPanel}
      </GridItem>
      {editMode && (
        <>
          <GridItem
            area="middleGutter"
            background="doenet.lightBlue"
            width="100%"
            paddingTop="39px"
            alignSelf="start"
          >
            <Center
              cursor="col-resize"
              background="doenet.mainGray"
              borderLeft="solid 1px"
              borderTop="solid 1px"
              borderBottom="solid 1px"
              borderColor="doenet.mediumGray"
              height={`calc(100vh - 84px)`}
              width="10px"
              onMouseDown={onMouseDown}
              data-test="contentPanelDragHandle"
              paddingLeft="1px"
              onDoubleClick={onDoubleClick}
            >
              <Icon ml="0" as={BsGripVertical} />
            </Center>
          </GridItem>

          <GridItem
            area="textEditor"
            width="100%"
            background="doenet.lightBlue"
            alignSelf="start"
          >
            {hideRight ? null : editorPanel}
          </GridItem>
        </>
      )}
    </Grid>
  );
};
