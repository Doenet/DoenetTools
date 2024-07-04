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
    return redirect(`/activityEditor/${activityId}`);
  } else if (formObj?._action == "Add Folder") {
    console.log("new folder created");
    await axios.post(`/api/createFolder`, { parentFolderId: formObj.folderId });

  } else if (formObj?._action == "Delete") {
    await axios.post(`/api/deleteActivity`, {
      activityId: formObj.activityId,
    });

    return true;
  } else if (formObj?._action == "Update Public") {
    await axios.post(`/api/updateIsPublicContent`, {
      id: formObj.activityId,
      isPublic: formObj.isPublic,
    });

    return true;
  } else if (formObj?._action == "Create Assignment") {
    await axios.post(`/api/assignActivity`, {
      activityId: formObj.activityId,
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
  height: 100%;
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
  let { folderId, data } = useLoaderData();
  const [activityId, setActivityId] = useState();
  const [content, setContent] = useState(data.folder);
  const controlsBtnRef = useRef(null);

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

  function getCardMenuList(isPublic, activityId) {
    return (
      <>
        {" "}
        {isPublic ? (
          <MenuItem
            data-test="Make Private Menu Item"
            onClick={() => {
              fetcher.submit(
                { _action: "Update Public", isPublic, activityId },
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
                { _action: "Update Public", isPublic, activityId },
                { method: "post" },
              );
            }}
          >
            Make Public
          </MenuItem>
        )}
        <MenuItem
          data-test="Create Assignment Menu Item"
          onClick={() => {
            fetcher.submit(
              { _action: "Create Assignment", activityId },
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
              margin="2px"
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
                  { _action: "Add Activity", activityId },
                  { method: "post" },
                );
              }}
            >
              + Add Activity
            </Button>
          </div>
        </Box>
        <ActivitiesSection data-test="Public Activities">
          <Wrap p="10px" overflow="visible">
            {content.length < 1 ? (
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
                {content.map((activity) => {
                  return (
                    <ActivityCard
                      key={`Card${activity.id}`}
                      {...activity}
                      fullName={activity.owner.name}
                      menuItems={getCardMenuList(activity.isPublic, activity.id)}
                      imageLink={`/activityEditor/${activity.activityId}`}
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
