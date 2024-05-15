// import axios from 'axios';
import {
  Button,
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
  MenuItem,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  redirect,
  useOutletContext,
  useLoaderData,
  useNavigate,
  useFetcher,
} from "react-router-dom";
import styled from "styled-components";

import { RiEmotionSadLine } from "react-icons/ri";
import ActivityCard from "../../../_reactComponents/PanelHeaderComponents/ActivityCard";
import { GeneralActivityControls } from "./PortfolioActivityEditor";
import axios from "axios";
import findFirstPageIdInContent from "../../../_utils/findFirstPage";

export async function action({ request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "update general") {
    //Don't let label be blank
    let label = formObj?.label?.trim();
    if (label == "") {
      label = "Untitled";
    }
    let learningOutcomes = JSON.parse(formObj.learningOutcomes);
    await axios.post("/api/updatePortfolioActivitySettings", {
      label,
      imagePath: formObj.imagePath,
      public: formObj.public,
      doenetId: formObj.doenetId,
      learningOutcomes,
    });
    return true;
  } else if (formObj?._action == "Add Activity") {
    //Create a portfolio activity and redirect to the editor for it
    let { data } = await axios.post("/api/createPortfolioActivity");

    let { docId } = data;
    return redirect(`/portfolioeditor/${docId}`);
  } else if (formObj?._action == "Delete") {
    await axios.post(`/api/deletePortfolioActivity`, {
      doenetId: formObj.doenetId,
    });

    return true;
  } else if (formObj?._action == "Make Public") {
    await axios.post(`/api/updateIsPublicActivity`, {
      doenetId: formObj.doenetId,
      isPublic: true,
    });

    return true;
  } else if (formObj?._action == "Make Private") {
    await axios.post(`/api/updateIsPublicActivity`, {
      doenetId: formObj.doenetId,
      isPublic: false,
    });

    return true;
  } else if (formObj?._action == "noop") {
    return true;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getPortfolio.php?courseId=${params.courseId}`,
  );
  if (data.notMe) {
    return redirect(`/publicportfolio/${params.courseId}`);
  }

  //Add pageDoenetId to all activities
  let publicActivities = [];
  data.publicActivities.map((activity) => {
    const pageDoenetId = findFirstPageIdInContent(activity.content);
    publicActivities.push({ ...activity, pageDoenetId });
  });
  let privateActivities = [];
  data.privateActivities.map((activity) => {
    const pageDoenetId = findFirstPageIdInContent(activity.content);
    privateActivities.push({ ...activity, pageDoenetId });
  });

  return {
    courseId: params.courseId,
    fullName: data.fullName,
    publicActivities,
    privateActivities,
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
  courseId,
}) {
  // const { pageId, activityData } = useLoaderData();
  // console.log({ doenetId, data });
  const fetcher = useFetcher();
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
              fetcher={fetcher}
              doenetId={doenetId}
              activityData={activityData}
              courseId={courseId}
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

  useEffect(() => {
    document.title = `Portfolio - Doenet`;
  }, []);

  const fetcher = useFetcher();

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null) {
    return null;
  }

  function getCardMenuList(isPublic, doenetId) {
    return (
      <>
        {" "}
        {isPublic ? (
          <MenuItem
            data-test="Make Private Menu Item"
            onClick={() => {
              fetcher.submit(
                { _action: "Make Private", doenetId },
                { method: "post" },
              );
            }}
          >
            Make Private
          </MenuItem>
        ) : (
          <MenuItem
            data-test="Make Public Menu Item"
            onClick={() => {
              fetcher.submit(
                { _action: "Make Public", doenetId },
                { method: "post" },
              );
            }}
          >
            Make Public
          </MenuItem>
        )}
        <MenuItem
          data-test="Delete Menu Item"
          onClick={() => {
            fetcher.submit({ _action: "Delete", doenetId }, { method: "post" });
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          data-test="Settings Menu Item"
          onClick={() => {
            setDoenetId(doenetId);
            onOpen();
          }}
        >
          Settings
        </MenuItem>
      </>
    );
  }

  return (
    <>
      <PortfolioSettingsDrawer
        isOpen={settingsAreOpen}
        onClose={settingsOnClose}
        finalFocusRef={controlsBtnRef}
        doenetId={doenetId}
        data={data}
        courseId={data.courseId}
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
              data-test="Add Activity"
              size="xs"
              colorScheme="blue"
              onClick={async () => {
                //Create a portfolio activity and redirect to the editor for it
                let response = await axios.post("/api/createPortfolioActivity");

                let { docId } = response;
                navigate(`/portfolioeditor/${docId}`);
              }}
            >
              Add Activity
            </Button>
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
                    <ActivityCard
                      key={`Card${activity.doenetId}`}
                      {...activity}
                      fullName={data.fullName}
                      menuItems={getCardMenuList(true, activity.doenetId)}
                      imageLink={`/portfolioeditor/${activity.doenetId}/${activity.pageDoenetId}`}
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
                    <ActivityCard
                      key={`Card${activity.doenetId}`}
                      {...activity}
                      fullName={data.fullName}
                      menuItems={getCardMenuList(false, activity.doenetId)}
                      imageLink={`/portfolioeditor/${activity.doenetId}/${activity.pageDoenetId}`}
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
