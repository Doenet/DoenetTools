import React, { useRef } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";
import CodeMirror from "../CodeMirror";

import styled from "styled-components";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import PageViewer from "../../../Viewer/PageViewer";
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from "../../../_sharedRecoil/PageViewerRecoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Box,
  Card,
  Center,
  Flex,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";

export async function action({ params }) {
  let response = await fetch(
    `/api/duplicatePortfolioActivity.php?doenetId=${params.doenetId}`,
  );
  let respObj = await response.json();

  const { nextActivityDoenetId, nextPageDoenetId } = respObj;
  return redirect(
    `/portfolioeditor/${nextActivityDoenetId}?tool=editor&doenetId=${nextActivityDoenetId}&pageId=${nextPageDoenetId}`,
  );
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
  // let doenetML = "<graph ><point name='p'/></graph>$p.x";
  let doenetML =
    "<graph ><point name='p'/></graph>$p.x<graph /><graph /><graph /><graph />";

  return {
    activityData,
    pageId,
    doenetML,
  };
}

const ViewerInsideContainer = styled.div`
  grid-column: 2 / 3;
  width: 850px;
  max-width: 850px;
  min-width: 600px;
  min-height: calc(100vh - 100px);
  background: var(--canvas);
  border: 1px solid #949494; //Viewer Outline
  margin: 20px 0px 20px 0px; //Only need when there is an outline
  padding: 20px 5px 20px 5px;
  @media (max-width: 850px) {
    width: 100vw;
  }
`;

export function PortfolioActivityEditor() {
  const { doenetML, pageId, activityData } = useLoaderData();
  console.log("activityData", activityData);
  console.log("pageId", pageId);
  console.log("doenetML", doenetML);
  const updateInternalValue = doenetML;
  let editorDoenetML = doenetML;

  let editorRef = useRef(null);

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
      // background="grey"
      templateAreas={`"header header header header header"
      "leftGutter viewer middleGutter textEditor rightGutter "
      `}
      templateRows="40px auto"
      templateColumns="auto minmax(400px,600px) auto minmax(300px,600px) auto"
      // templateColumns="auto minmax(400px,600px) auto minmax(300px,auto)"
      // templateColumns="auto minMax('400px','850px') auto min-content"
      // templateColumns="auto max-content auto min-content"
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
        <Flex>
          <Text>Icon Buttons</Text>
          <Text>Label Here</Text>
        </Flex>
      </GridItem>
      <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
      <GridItem area="middleGutter" background="doenet.lightBlue"></GridItem>
      <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
      <GridItem
        area="viewer"
        placeSelf="center"
        // background="blue.400"
        // minWidth="400px"
        minHeight="100%"
        width="100%"
        background="doenet.lightBlue"
        overflow="scroll"
        // maxWidth="850px"
      >
        <Box
          // width="850px"
          maxWidth="850px"
          minWidth="600px"
          minHeight="calc(100vh - 100px)"
          background="var(--canvas)"
          border="1px solid #949494" //Viewer Outline
          margin="20px 0px 20px 0px" //Only need when there is an outline
          padding="20px 5px 20px 5px"
          flexGrow={1}
        >
          <PageViewer
            key={`HPpageViewer`}
            doenetML={doenetML}
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
        paddingTop="30px"
        background="doenet.lightBlue"
        height="100%"
        // justifySelf="stretch"
        position="relative"
        placeSelf="stretch"
      >
        <Box
          position="fixed"
          // top={0}
          // bottom={0}
          // left={0}
          // right={0}
          // background="black"
          background="doenet.canvas"
          height="calc(100vh - 120px)"
          // height="200px"
          // width="inherit"
          width="600px" //This should change with
          overflowY="scroll"
        >
          <CodeMirror
            key="codemirror"
            // readOnly={false}
            editorRef={editorRef}
            // setInternalValue={updateInternalValue}
            setInternalValue={`one
two
three`}
            // value={editorDoenetML}
            // value="starter value"
            onBeforeChange={(value) => {
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
