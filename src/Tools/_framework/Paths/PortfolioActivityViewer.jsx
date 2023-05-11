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
  //Check if signedIn
  const profileInfo = await checkIfUserClearedOut();
  let signedIn = true;
  if (profileInfo.cookieRemoved) {
    signedIn = false;
  }
  const response = await fetch(
    `/api/getPortfolioActivityView.php?doenetId=${params.doenetId}`,
  );
  const data = await response.json();

  // const doenetMLResponse = await fetch(`/media/byPageId/${data.pageDoenetId}.doenet`);
  // const doenetML = await doenetMLResponse.text();

  const cidResponse = await fetch(`/media/${data.json.assignedCid}.doenet`);
  const activityML = await cidResponse.text();

  //Find the first page's doenetML
  const regex = /<page\s+cid="(\w+)"\s+(label="[^"]+"\s+)?\/>/;
  const pageIds = activityML.match(regex);

  const doenetMLResponse = await fetch(`/media/${pageIds[1]}.doenet`);
  const doenetML = await doenetMLResponse.text();

  return {
    doenetML,
    signedIn,
    label: data.label,
    fullName: data.firstName + " " + data.lastName,
    courseId: data.courseId,
    doenetId: params.doenetId,
    pageDoenetId: data.pageDoenetId,
  };
}

const PageContainer = styled.div`
  display: grid;
  grid-template-rows: 100px auto;
  height: 100%;
  width: 100%;
  /* background: var(--solidLightBlue); */
`;

const Header = styled.header`
  grid-row: 1 / 2;
  display: flex;
  position: fixed;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  background: var(--mainGray);
  z-index: 100;
`;
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

const HeaderContent = styled.div`
  max-width: 800px;
  width: 100%;
  height: 80px;
  margin: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const HeaderSectionLeft = styled.div`
  margin: 5px;
  height: 30px;
`;
const HeaderSectionRight = styled.div`
  margin: 5px;
  height: 30px;
  display: flex;
  justify-content: flex-end;
`;
const Label = styled.div`
  font-size: 1.4em;
  font-weight: bold;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AvatarLink = styled(Link)`
  text-decoration: none;
  color: black;
  position: relative;
`;

const Byline = styled.small`
  position: absolute;
  left: 36px;
  top: 8px;
  width: 400px;
`;

export function PortfolioActivityViewer() {
  const {
    doenetML,
    signedIn,
    label,
    fullName,
    courseId,
    doenetId,
    pageDoenetId,
  } = useLoaderData();

  const navigate = useNavigate();
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
  }

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
      <PageContainer>
        <Header>
          <HeaderContent>
            <div>
              <HeaderSectionLeft>
                <Label>{label}</Label>
              </HeaderSectionLeft>
              <HeaderSectionLeft>
                <AvatarLink to={`/publicportfolio/${courseId}`}>
                  <Avatar size="sm" name={fullName} />{" "}
                  <Byline>By {fullName}</Byline>
                </AvatarLink>
              </HeaderSectionLeft>
            </div>
            <div>
              <HeaderSectionRight>
                <Button
                  value="See Inside"
                  onClick={() => {
                    navigate(`/publiceditor/${doenetId}/${pageDoenetId}`);
                    // navigateTo.current = `/public?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`;
                    // setRecoilPageToolView({
                    //   page: "public",
                    //   tool: "",
                    //   view: "",
                    //   params: { doenetId, pageId: pageDoenetId },
                    // });
                  }}
                />
              </HeaderSectionRight>
              {signedIn ? (
                <HeaderSectionRight>
                  {/* <Form method="post"> */}
                  <Button
                    value="Remix"
                    onClick={async () => {
                      let response = await fetch(
                        `/api/duplicatePortfolioActivity.php?doenetId=${doenetId}`,
                      );

                      if (response.ok) {
                        let { nextActivityDoenetId, nextPageDoenetId } =
                          await response.json();
                        navigateTo.current = `/portfolioeditor/${nextActivityDoenetId}?tool=editor&doenetId=${nextActivityDoenetId}&pageId=${nextPageDoenetId}`;
                        setRecoilPageToolView({
                          page: "portfolioeditor",
                          tool: "editor",
                          view: "",
                          params: {
                            doenetId: nextActivityDoenetId,
                            pageId: nextPageDoenetId,
                          },
                        });
                      } else {
                        throw Error(response.message);
                      }
                    }}
                  />
                  {/* </Form> */}
                </HeaderSectionRight>
              ) : (
                <Button
                  dataTest="Nav to signin"
                  size="medium"
                  value="Sign In To Remix"
                  onClick={() => {
                    navigateTo.current = "/signin";
                    setRecoilPageToolView({
                      page: "signin",
                      tool: "",
                      view: "",
                      params: {},
                    });
                  }}
                />
              )}
            </div>
          </HeaderContent>
        </Header>
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
      </PageContainer>
    </>
  );
}
