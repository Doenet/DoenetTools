// import axios from 'axios';
import { Box, Icon, Text, Flex, Wrap } from "@chakra-ui/react";
import React, { useRef } from "react";
import {
  redirect,
  Form,
  useOutletContext,
  useLoaderData,
} from "react-router-dom";
import styled from "styled-components";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";

import { RiEmotionSadLine } from "react-icons/ri";
import RecoilActivityCard from "../../../_reactComponents/PanelHeaderComponents/RecoilActivityCard";
import { pageToolViewAtom } from "../NewToolRoot";
import { useRecoilState } from "recoil";

export async function action({ request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj?._action == "Add Activity") {
    //Create a portfilio activity and redirect to the editor for it
    let response = await fetch("/api/createPortfolioActivity.php");

    if (response.ok) {
      let { doenetId, pageDoenetId } = await response.json();
      return redirect(
        `/portfolioeditor/${doenetId}?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`,
      );
    } else {
      throw Error(response.message);
    }
  } else if (formObj?._action == "Delete") {
    let response = await fetch(
      `/api/deletePortfolioActivity.php?doenetId=${formObj.doenetId}`,
    );

    if (response.ok) {
      // let respObj = await response.json();
      return true;
    } else {
      throw Error(response.message);
    }
  } else if (formObj?._action == "Make Public") {
    let response = await fetch(
      `/api/updateIsPublicActivity.php?doenetId=${formObj.doenetId}&isPublic=1`,
    );

    if (response.ok) {
      // let respObj = await response.json();
      return true;
    } else {
      throw Error(response.message);
    }
  } else if (formObj?._action == "Make Private") {
    let response = await fetch(
      `/api/updateIsPublicActivity.php?doenetId=${formObj.doenetId}&isPublic=0`,
    );

    if (response.ok) {
      // let respObj = await response.json();
      return true;
    } else {
      throw Error(response.message);
    }
  } else if (formObj?._action == "noop") {
    return true;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params }) {
  //If we didn't create the course yet for this user then create it
  if (params.courseId == "not_created") {
    const response = await fetch("/api/createPortfolioCourse.php");
    const data = await response.json();
    return redirect(`/portfolio/${data.portfolioCourseId}`);
  }

  const response = await fetch(
    `/api/getPortfolio.php?courseId=${params.courseId}`,
  );
  const data = await response.json();
  if (data.notMe) {
    return redirect(`/publicportfolio/${params.courseId}`);
  }

  return {
    courseId: params.courseId,
    fullName: data.fullName,
    publicActivities: data.publicActivities,
    privateActivities: data.privateActivities,
  };
}

const PublicActivitiesSection = styled.div`
  grid-row: 2/3;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: var(--lightBlue);
`;

const PrivateActivitiesSection = styled.div`
  grid-row: 3/4;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 10px;
  margin: 0px;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  background: var(--mainGray);
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-rows: 80px min-content auto;
  /* grid-template-rows: 80px min-content min-content; */
  height: 100vh;
`;

export function Portfolio() {
  let context = useOutletContext();
  let data = useLoaderData();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
  }

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null) {
    return null;
  }

  return (
    <>
      <PortfolioGrid>
        <Box
          gridRow="1/2"
          backgroundColor="#fff"
          color="#000"
          height="80px"
          position="fixed"
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          zIndex="500"
        >
          <Text fontSize="24px" fontWeight="700">
            {data.fullName}
          </Text>
          <Text fontSize="16px" fontWeight="700">
            Portfolio
          </Text>
          <div style={{ position: "absolute", top: "48px", right: "10px" }}>
            {/* <Form method="post"> */}
            <Button
              value="Add Activity"
              dataTest="Add Activity"
              onClick={async () => {
                //Create a portfilio activity and redirect to the editor for it
                let response = await fetch("/api/createPortfolioActivity.php");

                if (response.ok) {
                  let { doenetId, pageDoenetId } = await response.json();
                  navigateTo.current = `/portfolioeditor/${doenetId}?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`;
                  setRecoilPageToolView({
                    page: "portfolioeditor",
                    tool: "editor",
                    view: "",
                    params: { doenetId, pageId: pageDoenetId },
                  });
                } else {
                  throw Error(response.message);
                }
              }}
            />
            {/* <input type="hidden" name="_action" value="Add Activity" /> */}
            {/* </Form> */}
          </div>
        </Box>
        <PublicActivitiesSection data-test="Public Activities">
          <Text fontSize="20px" fontWeight="700">
            Public
          </Text>
          <Wrap p="10px" overflow="visible">
            {data.publicActivities.length < 1 ? (
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
                minHeight={200}
                background="doenet.canvas"
                padding={20}
                width="100%"
              >
                <Icon fontSize="48pt" as={RiEmotionSadLine} />
                <Text fontSize="36pt">No Public Activities</Text>
              </Flex>
            ) : (
              <>
                {data.publicActivities.map((activity) => {
                  return (
                    <RecoilActivityCard
                      key={`Card${activity.doenetId}`}
                      {...activity}
                      fullName={data.fullName}
                      isPublic={true}
                      courseId={data.courseId}
                    />
                  );
                })}
              </>
            )}
          </Wrap>
        </PublicActivitiesSection>

        <PrivateActivitiesSection data-test="Private Activities">
          <Text fontSize="20px" fontWeight="700">
            Private
          </Text>
          <Wrap p="10px" overflow="visible">
            {data.privateActivities.length < 1 ? (
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
                minHeight={200}
                background="doenet.canvas"
                padding={20}
                width="100%"
              >
                <Icon fontSize="48pt" as={RiEmotionSadLine} />
                <Text fontSize="36pt">No Private Activities</Text>
              </Flex>
            ) : (
              <>
                {data.privateActivities.map((activity) => {
                  return (
                    <RecoilActivityCard
                      key={`Card${activity.doenetId}`}
                      {...activity}
                      fullName={data.fullName}
                      isPublic={false}
                      courseId={data.courseId}
                    />
                  );
                })}
              </>
            )}
          </Wrap>
        </PrivateActivitiesSection>
      </PortfolioGrid>
    </>
  );
}
