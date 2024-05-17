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

    await axios.post("/api/updateActivitySettings", {
      name,
    });

    return true;
  } else if (formObj?._action == "Delete") {
    await axios.post(`/api/deleteAssignment`, {
      assignmentId: formObj.assignmentId,
    });

    return true;
  } else if (formObj?._action == "noop") {
    return true;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params }) {
  const { data } = await axios.get(`/api/getAssignments/${params.userId}`);

  return data;
}

const AssignmentsSection = styled.div`
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

const AssignmentsGrid = styled.div`
  display: grid;
  grid-template-rows: 80px min-content auto;
  /* grid-template-rows: 80px min-content min-content; */
  height: 100vh;
`;

function AssignmentSettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  activityId: assignmentId,
  data,
}) {
  const fetcher = useFetcher();
  let assignmentData;
  if (assignmentId) {
    let assignmentIndex = data.assignments.findIndex(
      (obj) => obj.assignmentId == assignmentId,
    );
    if (assignmentIndex != -1) {
      assignmentData = data.assignments[assignmentIndex];
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
          {assignmentId && (
            <GeneralActivityControls
              fetcher={fetcher}
              activityId={assignmentId}
              docId={assignmentData.docId}
              activityData={assignmentData}
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export function Assignments() {
  let context = useOutletContext();
  let data = useLoaderData();
  const [assignmentId, setAssignmentId] = useState();
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

  function getCardMenuList(assignmentId) {
    return (
      <>
        {" "}
        <MenuItem
          data-test="Delete Menu Item"
          onClick={() => {
            fetcher.submit(
              { _action: "Delete", assignmentId },
              { method: "post" },
            );
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          data-test="Settings Menu Item"
          onClick={() => {
            setAssignmentId(assignmentId);
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
      <AssignmentSettingsDrawer
        isOpen={settingsAreOpen}
        onClose={settingsOnClose}
        finalFocusRef={controlsBtnRef}
        assignmentId={assignmentId}
        data={data}
      />
      <AssignmentsGrid>
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
            {data.name}
          </Text>
          <Text fontSize="16px" fontWeight="700">
            Assignments
          </Text>
        </Box>
        <AssignmentsSection data-test="Assignments">
          <Wrap p="10px" overflow="visible">
            {data.assignments.length < 1 ? (
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
                <Text fontSize="36pt">No Assignments</Text>
              </Flex>
            ) : (
              <>
                {data.assignments.map((assignment) => {
                  return (
                    <ActivityCard
                      key={`Card${assignment.assignmentId}`}
                      {...assignment}
                      fullName={data.name}
                      menuItems={getCardMenuList(assignment.assignmentId)}
                      imageLink={`/assignmentEditor/${assignment.assignmentId}`}
                    />
                  );
                })}
              </>
            )}
          </Wrap>
        </AssignmentsSection>
      </AssignmentsGrid>
    </>
  );
}
