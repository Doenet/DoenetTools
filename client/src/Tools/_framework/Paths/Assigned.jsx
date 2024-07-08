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
import ContentCard from "../../../_reactComponents/PanelHeaderComponents/ContentCard";
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
  const { data: assignmentData } = await axios.get(`/api/getAssigned`);

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

export function Assigned() {
  let context = useOutletContext();
  let { user, assignments } = useLoaderData();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Assigned - Doenet`;
  }, []);

  const fetcher = useFetcher();

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null) {
    return null;
  }

  return (
    <>
      <AssignmentsGrid>
        <Box
          backgroundColor="#fff"
          color="#000"
          height="80px"
          width="100%"
          textAlign="center"
        >
          <Heading as="h2" size="lg">
            {user.name}
          </Heading>
          <Heading as="h3" size="md">
            Assigned Activities
          </Heading>
          <div style={{ float: "right", marginTop: "-10px" }}>
            <Button
              margin="3px"
              size="xs"
              colorScheme="blue"
              onClick={() => navigate(`/classCode`)}
            >
              Class code
            </Button>
            <Button
              margin="3px"
              size="xs"
              colorScheme="blue"
              onClick={() => navigate(`/assignedData`)}
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
                <Text fontSize="36pt">Nothing Assigned</Text>
              </Flex>
            ) : (
              <>
                {assignments.map((assignment) => {
                  const isInstructor = assignment.ownerId === user.userId;
                  return (
                    <ContentCard
                      key={`Card${assignment.assignmentId}`}
                      imagePath={assignment.imagePath}
                      name={assignment.name}
                      fullName={"Quick assign activity"}
                      imageLink={`/classCode/${assignment.classCode}`}
                      suppressAvatar={true}
                      showStatus={false}
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
