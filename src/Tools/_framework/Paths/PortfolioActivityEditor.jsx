import React, { useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";
import CodeMirror from "../CodeMirror";

import styled from "styled-components";
// import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import PageViewer from "../../../Viewer/PageViewer";
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from "../../../_sharedRecoil/PageViewerRecoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  GridItem,
  Input,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { BsPlayBtnFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { useFetcher } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  // console.log("formObj", formObj, params.doenetId);
  if (formObj._action == "update label") {
    let response = await fetch(
      `/api/updatePortfolioActivityLabel.php?doenetId=${params.doenetId}&label=${formObj.label}`,
    );
    let respObj = await response.json();
  }
  return true;
  // let response = await fetch(
  //   `/api/duplicatePortfolioActivity.php?doenetId=${params.doenetId}`,
  // );
  // let respObj = await response.json();

  // const { nextActivityDoenetId, nextPageDoenetId } = respObj;
  // return redirect(
  //   `/portfolioeditor/${nextActivityDoenetId}?tool=editor&doenetId=${nextActivityDoenetId}&pageId=${nextPageDoenetId}`,
  // );
}

export async function loader({ params }) {
  const response = await fetch(
    `/api/getPortfolioEditorData.php?doenetId=${params.doenetId}`,
  );
  const data = await response.json();

  const activityData = { ...data.activity };

  let pageId = params.pageId;
  if (params.pageId == "_") {
    //TODO: find pageId in data.content

    pageId = "test";
    //If we found a pageId then redirect there
    if (pageId != "_") {
      return redirect(`/portfolioeditor/${params.doenetId}/${pageId}`);
    }
  }

  //TODO: get the doenetML of the pageId.
  let doenetML = `<graph>
  <point name='p'/>
</graph>
<p>$p.x</p>`;
  // let doenetML =
  //   "<graph ><point name='p'/></graph>$p.x<graph /><graph /><graph /><graph />";

  return {
    activityData,
    pageId,
    doenetML,
  };
}

export function PortfolioActivityEditor() {
  const { doenetML, pageId, activityData } = useLoaderData();
  // const [textEditorDoenetML, setTextEditorDoenetML] = useState(doenetML);
  let textEditorDoenetML = useRef(doenetML);
  const [viewerDoenetML, setViewerDoenetML] = useState(doenetML);
  // console.log("activityData", activityData);
  // console.log("pageId", pageId);

  const fetcher = useFetcher();

  let editorRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey && event.code === "KeyS") {
        event.preventDefault();
        setViewerDoenetML(textEditorDoenetML.current);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [textEditorDoenetML]);

  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);

  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(
      JSON.stringify(generatedVariantInfo),
    );
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
    });
    setVariantInfo({
      index: cleanGeneratedVariant.index,
    });
  }

  return (
    <Grid
      minHeight="calc(100vh - 40px)" //40px header height
      templateAreas={`"header header header header header"
      "leftGutter viewer middleGutter textEditor rightGutter "
      `}
      templateRows="40px auto"
      templateColumns="minmax(10px,auto) minmax(500px,800px) minmax(10px,auto) minmax(350px,600px) minmax(10px,auto)"
      position="relative"
    >
      <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
      <GridItem area="middleGutter" background="doenet.lightBlue"></GridItem>
      <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
      <GridItem
        area="header"
        position="fixed"
        height="40px"
        background="doenet.canvas"
        width="100%"
        zIndex="500"
      >
        <Flex justifyContent="space-between">
          <Box>
            <ButtonGroup
              size="sm"
              ml="10px"
              mt="4px"
              isAttached
              variant="outline"
            >
              <Tooltip hasArrow label="View Activity CMD+V">
                <Button size="sm" leftIcon={<BsPlayBtnFill />}>
                  View
                </Button>
              </Tooltip>
              <Tooltip hasArrow label="Edit Activity CMD+E">
                <Button isActive size="sm" leftIcon={<MdModeEditOutline />}>
                  Edit
                </Button>
              </Tooltip>
            </ButtonGroup>
            <Tooltip hasArrow label="Updates Viewer CMD+S">
              <Button
                ml="10px"
                mt="-1"
                size="sm"
                variant="outline"
                leftIcon={<RxUpdate />}
                onClick={() => {
                  setViewerDoenetML(textEditorDoenetML.current);
                }}
              >
                Update
              </Button>
            </Tooltip>
          </Box>
          <Editable
            mt="4px"
            defaultValue={activityData.label}
            textAlign="center"
            // selectAllOnFocus={false}
            onSubmit={(value) => {
              console.log("new label:", value);
              fetcher.submit(
                { _action: "update label", label: value },
                { method: "post" },
              );
            }}
          >
            <EditablePreview />
            {/* <Input as="EditableInput" /> */}
            <EditableInput width="400px" />
          </Editable>
          <Tooltip hasArrow label="Toggles Controls CMD+C">
            <Button
              mt="4px"
              mr="10px"
              size="sm"
              variant="outline"
              leftIcon={<FaCog />}
            >
              Controls
            </Button>
          </Tooltip>
        </Flex>
      </GridItem>

      <GridItem
        area="viewer"
        placeSelf="center"
        minHeight="100%"
        width="100%"
        background="doenet.lightBlue"
      >
        <Box
          minHeight="calc(100vh - 100px)"
          background="var(--canvas)"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="doenet.mediumGray"
          margin="10px 0px 10px 0px" //Only need when there is an outline
          padding="20px 5px 20px 5px"
          flexGrow={1}
          overflow="scroll"
        >
          <PageViewer
            key={`HPpageViewer`}
            doenetML={viewerDoenetML}
            // cid={"bafkreibfz6m6pt4vmwlch7ok5y5qjyksomidk5f2vn2chuj4qqeqnrfrfe"}
            flags={{
              showCorrectness: true,
              solutionDisplayMode: true,
              showFeedback: true,
              showHints: true,
              autoSubmit: false,
              allowLoadState: false,
              allowSaveState: false,
              allowLocalState: false,
              allowSaveSubmissions: false,
              allowSaveEvents: false,
            }}
            // doenetId={doenetId}
            attemptNumber={1}
            generatedVariantCallback={variantCallback} //TODO:Replace
            requestedVariantIndex={variantInfo.index}
            // setIsInErrorState={setIsInErrorState}
            pageIsActive={true}
          />
        </Box>
      </GridItem>
      <GridItem
        area="textEditor"
        maxWidth="600px"
        background="doenet.lightBlue"
        height="100%"
        alignSelf="start"
        paddingTop="10px"
      >
        <Box
          position="sticky"
          top="50px"
          boxSizing="border-box"
          background="doenet.canvas"
          height="calc(100vh - 100px)"
          overflowY="scroll"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="doenet.mediumGray"
        >
          <CodeMirror
            key="codemirror"
            // readOnly={false}
            editorRef={editorRef}
            // setInternalValue={updateInternalValue}
            setInternalValue={textEditorDoenetML.current}
            // value={editorDoenetML}
            // value="starter value"
            onBeforeChange={(value) => {
              textEditorDoenetML.current = value;
              // setTextEditorDoenetML(value);
              // console.log(value);
              //   setEditorDoenetML(value);
              //   // Debounce save to server at 3 seconds
              //   clearTimeout(timeout.current);
              //   timeout.current = setTimeout(function () {
              //     saveDraft({
              //       pageId: initializedPageId,
              //       courseId,
              //       backup: backupOldDraft.current,
              //     }).then(({ success }) => {
              //       if (success) {
              //         backupOldDraft.current = false;
              //       }
              //     });
              //     timeout.current = null;
              //   }, 3000); //3 seconds
            }}
          />
        </Box>
      </GridItem>
    </Grid>
  );
}
