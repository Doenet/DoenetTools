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

import { RiEmotionSadLine } from "react-icons/ri";
import ContentCard from "../../../Widgets/ContentCard";
import axios from "axios";
import { createFullName } from "../../../_utils/names";
import { ContentStructure } from "./ActivityEditor";

export async function loader({ params }) {
  const { data: assignmentData } = await axios.get(`/api/getAssigned`);

  return {
    user: assignmentData.user,
    assignments: assignmentData.assignments,
  };
}

export function Assigned() {
  let context = useOutletContext();
  let { user, assignments } = useLoaderData() as {
    user: {
      userId: number;
      firstNames: string | null;
      lastNames: string;
    };
    assignments: ContentStructure[];
  };

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Assigned - Doenet`;
  }, []);

  const fetcher = useFetcher();

  //Don't do more processing if we don't know if we are signed in or not
  //@ts-ignore
  if (context.signedIn == null) {
    return null;
  }

  return (
    <>
      <Box
        backgroundColor="#fff"
        color="#000"
        height="80px"
        width="100%"
        textAlign="center"
      >
        <Heading as="h2" size="lg">
          {createFullName(user)}
        </Heading>
        <Heading as="h3" size="md">
          Assigned Activities
        </Heading>
        <div style={{ float: "right", marginTop: "-10px" }}>
          <Button
            margin="3px"
            size="xs"
            colorScheme="blue"
            onClick={() => navigate(`/code`)}
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
      <Flex
        data-test="Assigned Activities"
        padding="10px"
        margin="0px"
        width="100%"
        justifyContent="center"
        background="var(--lightBlue)"
        minHeight="calc(100vh - 120px)"
      >
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
                return (
                  <ContentCard
                    key={`Card${assignment.id}`}
                    id={assignment.id}
                    imagePath={assignment.imagePath}
                    title={assignment.name}
                    ownerName={"Quick assign activity"}
                    cardLink={
                      assignment.assignmentStatus === "Open"
                        ? `/code/${assignment.classCode}`
                        : `/assignedData/${assignment.id}`
                    }
                    suppressAvatar={true}
                    showPublicStatus={false}
                    showAssignmentStatus={true}
                    assignmentStatus={assignment.assignmentStatus}
                  />
                );
              })}
            </>
          )}
        </Wrap>
      </Flex>
    </>
  );
}
