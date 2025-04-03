// import axios from 'axios';
import { Button, Box, Flex, Heading, VStack, HStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";

import { CardContent } from "../../../Widgets/Card";
import axios from "axios";
import { createFullName } from "../../../_utils/names";
import { Content, UserInfo } from "../../../_utils/types";
import CardList from "../../../Widgets/CardList";
import { formatTime } from "../../../_utils/dateUtilityFunction";

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader() {
  const { data: assignmentData } = await axios.get(`/api/assign/getAssigned`);

  return {
    user: assignmentData.user,
    assignments: assignmentData.assignments,
  };
}

export function Assigned() {
  const { user, assignments } = useLoaderData() as {
    user: UserInfo;
    assignments: Content[];
  };

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Assigned - Doenet`;
  }, []);

  const heading = (
    <Box
      backgroundColor="#fff"
      color="#000"
      height="80px"
      width="100%"
      textAlign="center"
      padding=".5em 0"
    >
      <Heading as="h2" size="lg">
        {createFullName(user)}
      </Heading>
      <Heading as="h3" size="md" marginBottom="0.5em">
        Assigned Activities
      </Heading>
      <VStack align="flex-end" float="right" marginRight=".5em">
        <HStack>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => navigate(`/code`)}
          >
            Class code
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => navigate(`/assignedData`)}
          >
            See Scores
          </Button>
        </HStack>
      </VStack>
    </Box>
  );

  const cardContent: CardContent[] = assignments.map((assignment) => {
    return {
      content: assignment,
      cardLink:
        assignment.assignmentInfo?.assignmentStatus === "Open"
          ? `/code/${assignment.assignmentInfo?.classCode}`
          : `/assignedData/${assignment.contentId}?shuffledOrder`,
      closeTime: formatTime(assignment.assignmentInfo!.codeValidUntil),
    };
  });

  const mainPanel = (
    <CardList
      showOwnerName={false}
      showAssignmentStatus={true}
      showPublicStatus={false}
      emptyMessage={"Nothing Assigned"}
      content={cardContent}
    />
  );

  return (
    <>
      {heading}
      <Flex
        data-test="Assigned Activities"
        padding=".5em 10px"
        margin="0"
        width="100%"
        background={"white"}
        minHeight="calc(100vh - 188px)"
        flexDirection="column"
      >
        {mainPanel}
      </Flex>
    </>
  );
}
