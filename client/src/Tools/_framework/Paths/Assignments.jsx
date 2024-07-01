// import axios from 'axios';
import {
  Button,
  Box,
  Icon,
  Text,
  Flex,
  Wrap,
  MenuItem,
  Heading,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
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
  const { data: assignmentData } = await axios.get(`/api/getAssignments`);

  return {
    user: assignmentData.user,
    assignments: assignmentData.assignments,
  };
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

export function Assignments() {
  let context = useOutletContext();
  let { user, assignments } = useLoaderData();

  const navigate = useNavigate();

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
      </>
    );
  }

  return (
    <>
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
          <Heading as="h2" size="lg">
            {user.name}
          </Heading>
          <Heading as="h3" size="md">
            Assignments
          </Heading>
          <div style={{ position: "absolute", top: "48px", right: "10px" }}>
            <Button
              size="xs"
              colorScheme="blue"
              onClick={() => navigate("/allAssignmentScores")}
            >
              See Scores
            </Button>
          </div>
        </Box>
        <AssignmentsSection data-test="Assignments">
          <Wrap p="10px" overflow="visible">
            {assignments.length < 1 ? (
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
                {assignments.map((assignment) => {
                  const isInstructor = assignment.ownerId === user.userId;
                  return (
                    <ActivityCard
                      key={`Card${assignment.assignmentId}`}
                      {...assignment}
                      fullName={isInstructor ? "Instructor" : "Student"}
                      menuItems={getCardMenuList(assignment.assignmentId)}
                      imageLink={
                        isInstructor
                          ? `/assignmentEditor/${assignment.assignmentId}`
                          : `/classCode/${assignment.classCode}`
                      }
                      suppressAvatar={true}
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
