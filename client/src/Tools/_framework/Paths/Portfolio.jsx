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

export async function action({ request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "update general") {
    //Don't let name be blank
    let name = formObj?.name?.trim();
    if (name == "") {
      name = "Untitled";
    }

    let learningOutcomes;
    if (formObj.learningOutcomes) {
      learningOutcomes = JSON.parse(formObj.learningOutcomes);
    }
    let isPublic;

    if (formObj.isPublic) {
      isPublic = formObj.isPublic === "true";
    }

    await axios.post("/api/updateActivitySettings", {
      name,
      imagePath: formObj.imagePath,
      isPublic,
      activityId: formObj.activityId,
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
  } else if (formObj?._action == "Add Activity") {
    //Create a portfolio activity and redirect to the editor for it
    let { data } = await axios.post("/api/createActivity");

    let { activityId } = data;
    return redirect(`/portfolioeditor/${activityId}`);
  } else if (formObj?._action == "Delete") {
    await axios.post(`/api/deletePortfolioActivity`, {
      activityId: formObj.activityId,
    });

    return true;
  } else if (formObj?._action == "Make Public") {
    await axios.post(`/api/updateIsPublicActivity`, {
      activityId: formObj.activityId,
      isPublic: true,
    });

    return true;
  } else if (formObj?._action == "Make Private") {
    await axios.post(`/api/updateIsPublicActivity`, {
      activityId: formObj.activityId,
      isPublic: false,
    });

    return true;
  } else if (formObj?._action == "noop") {
    return true;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params }) {
  const { data } = await axios.get(`/api/getPortfolio/${params.userId}`);
  if (data.notMe) {
    return redirect(`/publicportfolio/${params.userId}`);
  }

  return data;
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
  activityId,
  data,
}) {
  const fetcher = useFetcher();
  let activityData;
  if (activityId) {
    let publicIndex = data.publicActivities.findIndex(
      (obj) => obj.activityId == activityId,
    );
    if (publicIndex != -1) {
      activityData = data.publicActivities[publicIndex];
    } else {
      let privateIndex = data.privateActivities.findIndex(
        (obj) => obj.activityId == activityId,
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
          {activityId && (
            <GeneralActivityControls
              fetcher={fetcher}
              activityId={activityId}
              docId={activityData.docId}
              activityData={activityData}
              allDoenetmlVersions={data.allDoenetmlVersions}
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
  const [activityId, setActivityId] = useState();
  const controlsBtnRef = useRef(null);

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

  function getCardMenuList(isPublic, activityId) {
    return (
      <>
        {" "}
        {isPublic ? (
          <MenuItem
            data-test="Make Private Menu Item"
            onClick={() => {
              fetcher.submit(
                { _action: "Make Private", activityId },
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
                { _action: "Make Public", activityId },
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
            fetcher.submit(
              { _action: "Delete", activityId },
              { method: "post" },
            );
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          data-test="Settings Menu Item"
          onClick={() => {
            setActivityId(activityId);
            settingsOnOpen();
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
        activityId={activityId}
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
              data-test="Add Activity"
              size="xs"
              colorScheme="blue"
              onClick={async () => {
                //Create a portfolio activity and redirect to the editor for it
                // let { data } = await axios.post("/api/createActivity");
                // let { activityId } = data;
                // navigate(`/portfolioeditor/${activityId}`);

                // TODO - review this, elsewhere the fetcher is being used, and
                // there was code up in the action() method for this action
                // that was unused. This appears to work okay though? And it
                // would make it consistent with how API requests are done elsewhere
                fetcher.submit(
                  { _action: "Add Activity", activityId },
                  { method: "post" },
                );
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
                      key={`Card${activity.activityId}`}
                      {...activity}
                      fullName={data.fullName}
                      menuItems={getCardMenuList(true, activity.activityId)}
                      imageLink={`/portfolioeditor/${activity.activityId}`}
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
                      key={`Card${activity.activityId}`}
                      {...activity}
                      fullName={data.fullName}
                      menuItems={getCardMenuList(false, activity.activityId)}
                      imageLink={`/portfolioeditor/${activity.activityId}`}
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
