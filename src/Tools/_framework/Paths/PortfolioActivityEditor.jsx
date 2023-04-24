import React, { useRef } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";
import styled from "styled-components";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import PageViewer from "../../../Viewer/PageViewer";
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from "../../../_sharedRecoil/PageViewerRecoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import { Form, Link } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import { pageToolViewAtom } from "../NewToolRoot";

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
  let doenetML = "";

  return {
    activityData,
    pageId,
    doenetML,
  };
}

// background: var(--canvas);
const ViewerOutsideContainer = styled.div`
  grid-row: 2 / 3;
  display: grid;
  grid-template-columns: auto min-content auto;
  min-height: calc(100vh - 100px);
  background: var(--solidLightBlue); //Gutter color
`;

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
    <>
      <ViewerOutsideContainer>
        <ViewerInsideContainer>
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
        </ViewerInsideContainer>
      </ViewerOutsideContainer>
    </>
  );
}
