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
  Heading,
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
import Draggable from "../../../_reactComponents/Draggable/Draggable";
import { GeneralActivityControls } from "./ActivityEditor";
import axios from "axios";

export async function action({ request, params }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  console.log(formObj);

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
      id: formObj.id,
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

    let { id } = data;
    return redirect(`/activityEditor/${id}`);
  } else if (formObj?._action == "Add Folder") {
    console.log("new folder created");
    await axios.post(`/api/createFolder`, { parentFolderId: formObj.folderId });

    return true;
  } else if (formObj?._action == "Delete") {
    await axios.post(`/api/deleteActivity`, {
      id: formObj.id,
    });

    return true;
  } else if (formObj?._action == "Update Public") {
    await axios.post(`/api/updateIsPublicContent`, {
      id: formObj.id,
      isPublic: formObj.isPublic,
    });

    return true;
  } else if (formObj?._action == "Create Assignment") {
    await axios.post(`/api/assignActivity`, {
      id: formObj.id,
    });
    return redirect(`/assignments`);
  } else if (formObj?._action == "noop") {
    return true;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params }) {

  const { data } = await axios.get(`/api/getFolderContent/${params.folderId}`);
  if (data.notMe) {
    return redirect(`/publicPortfolio/${params.userId}`);
  }

  console.log(data);

  return { folderId: params.folderId, data };
}

const ActivitiesSection = styled.div`
  padding: 10px;
  margin: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: var(--lightBlue);
  height: 100vh;
`;

function PortfolioSettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  id,
  content,
}) {
  const fetcher = useFetcher();
  let activityData;
  if (id) {
    let index = content.findIndex(
      (obj) => obj.id == id,
    );
    if (index != -1) {
      activityData = content[index];
    } else {
      //Throw error not found
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
          {id && (
            <GeneralActivityControls
              fetcher={fetcher}
              activityId={id}
              docId={activityData.docId}
              activityData={activityData}
              allDoenetmlVersions={content.allDoenetmlVersions}
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export function Portfolio() {
  let context = useOutletContext();
  let { folderId, data } = useLoaderData();
  const [activityId, setActivityId] = useState();
  const controlsBtnRef = useRef(null);
  const navigate = useNavigate();

  const {
    isOpen: settingsAreOpen,
    onOpen: settingsOnOpen,
    onClose: settingsOnClose,
  } = useDisclosure();

  useEffect(() => {
    document.title = `Activities - Doenet`;
  }, []);

  const fetcher = useFetcher();

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null) {
    return null;
  }

  function getCardMenuList(isPublic, id) {
    return (
      <>
        <MenuItem
          data-test={`Make ${isPublic ? "Private" : "Public"} Menu Item`}
          onClick={() => {
            fetcher.submit(
              { _action: "Update Public", isPublic, id },
              { method: "post" },
            );
          }}
        >
          Make {isPublic ? "Private" : "Public"}
        </MenuItem>
        <MenuItem
          data-test="Create Assignment Menu Item"
          onClick={() => {
            fetcher.submit(
              { _action: "Create Assignment", id },
              { method: "post" },
            );
          }}
        >
          Create Assignment
        </MenuItem>
        <MenuItem
          data-test="Delete Menu Item"
          onClick={() => {
            fetcher.submit(
              { _action: "Delete", id },
              { method: "post" },
            );
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          data-test="Settings Menu Item"
          onClick={() => {
            setActivityId(id);
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
        id={activityId}
        content={data.folder}
      />
      <Box
        backgroundColor="#fff"
        color="#000"
        height="80px"
        width="100%"
        textAlign="center"
      >
        <Heading as="h2" size="lg" paddingTop=".5em">My Activities</Heading>
        <div style={{float: 'right'}}>
          <Button
              margin="3px"
              size="xs"
              colorScheme="blue"
              onClick={async () => {
                fetcher.submit(
                  { _action: "Add Folder", folderId },
                  { method: "post" },
                );
              }}
            >
              + Add Folder
            </Button>
            <Button
              margin="3px"
              data-test="Add Activity"
              size="xs"
              colorScheme="blue"
              onClick={async () => {
                //Create a portfolio activity and redirect to the editor for it
                // let { data } = await axios.post("/api/createActivity");
                // let { activityId } = data;
                // navigate(`/activityEditor/${activityId}`);

                // TODO - review this, elsewhere the fetcher is being used, and
                // there was code up in the action() method for this action
                // that was unused. This appears to work okay though? And it
                // would make it consistent with how API requests are done elsewhere
                fetcher.submit(
                  { _action: "Add Activity", id },
                  { method: "post" },
                );
              }}
            >
              + Add Activity
            </Button>
            <Button
              margin="3px"
              size="xs"
              colorScheme="blue"
              onClick={() => navigate(`/allAssignmentScores/${folderId}`)}
            >
              See Scores
            </Button>
          </div>
        </Box>
        <ActivitiesSection data-test="Public Activities">
          <Wrap p="10px" overflow="visible">
            {data.folder.length < 1 ? (
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
                minHeight={200}
                background="doenet.canvas"
                padding={20}
                width="100%"
                backgroundColor="transparent"
              >
                <Icon fontSize="48pt" as={RiEmotionSadLine} />
                <Text fontSize="36pt">No Activities Yet</Text>
              </Flex>
            ) : (
              <>
                {data.folder.map((activity) => {
                  return (
                    <ActivityCard
                      key={`Card${activity.id}`}
                      {...activity}
                      fullName={activity.owner.name}
                      menuItems={getCardMenuList(activity.isPublic, activity.id)}
                      imageLink={activity.isFolder ? `/portfolio/${activity.ownerId}/${activity.id}` : `/activityEditor/${activity.id}`}
                    />
                  );
                })}
              </>
            )}
          </Wrap>
        </ActivitiesSection>
    </>
  );
}
