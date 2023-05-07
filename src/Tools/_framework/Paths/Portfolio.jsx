// import axios from 'axios';
import {
  Box,
  Icon,
  Text,
  Flex,
  Wrap,
  useDisclosure,
  Center,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Drawer,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import {
  redirect,
  Form,
  useOutletContext,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";

import { RiEmotionSadLine } from "react-icons/ri";
import RecoilActivityCard from "../../../_reactComponents/PanelHeaderComponents/RecoilActivityCard";
import { GeneralActivityControls } from "./PortfolioActivityEditor";

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

function PortfolioSettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  doenetId,
  data,
}) {
  // const { pageId, activityData } = useLoaderData();
  // console.log({ doenetId, data });
  let activityData;
  if (doenetId) {
    let publicIndex = data.publicActivities.findIndex(
      (obj) => obj.doenetId == doenetId,
    );
    if (publicIndex != -1) {
      activityData = data.publicActivities[publicIndex];
    } else {
      let privateIndex = data.privateActivities.findIndex(
        (obj) => obj.doenetId == doenetId,
      );
      if (privateIndex != -1) {
        activityData = data.privateActivities[privateIndex];
      } else {
        //Throw error not found
      }
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Center>
            <Text>Activity Settings</Text>
          </Center>
        </DrawerHeader>

        <DrawerBody>
          {doenetId && (
            <GeneralActivityControls
              doenetId={doenetId}
              activityData={activityData}
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export function Portfolio() {
  let context = useOutletContext();
  let data = useLoaderData();
  const [doenetId, setDoenetId] = useState();
  const controlsBtnRef = useRef(null);

  const navigate = useNavigate();
  const {
    isOpen: settingsAreOpen,
    onOpen: settingsOnOpen,
    onClose: settingsOnClose,
  } = useDisclosure();

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null) {
    return null;
  }

  return (
    <>
      <PortfolioSettingsDrawer
        isOpen={settingsAreOpen}
        onClose={settingsOnClose}
        finalFocusRef={controlsBtnRef}
        doenetId={doenetId}
        data={data}
      />
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
            <Button
              value="Add Activity"
              dataTest="Add Activity"
              onClick={async () => {
                //Create a portfilio activity and redirect to the editor for it
                let response = await fetch("/api/createPortfolioActivity.php");

                if (response.ok) {
                  let { doenetId, pageDoenetId } = await response.json();
                  navigate(`/portfolioeditor/${doenetId}/${pageDoenetId}`);
                } else {
                  throw Error(response.message);
                }
              }}
            />
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
                      setDoenetId={setDoenetId}
                      onClose={settingsOnClose}
                      onOpen={settingsOnOpen}
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
                      setDoenetId={setDoenetId}
                      onClose={settingsOnClose}
                      onOpen={settingsOnOpen}
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
