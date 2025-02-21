// import axios from 'axios';
import { Button, Box, Flex, Heading, VStack, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useFetcher } from "react-router";

import { CardContent } from "../../../Widgets/Card";
import axios from "axios";
import { createFullName } from "../../../_utils/names";
import { ContentStructure, UserInfo } from "../../../_utils/types";
import CardList from "../../../Widgets/CardList";
import { formatTime } from "../../../_utils/dateUtilityFunction";
import {
  ToggleViewButtonGroup,
  toggleViewButtonGroupActions,
} from "../ToolPanels/ToggleViewButtonGroup";

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  const resultTLV = await toggleViewButtonGroupActions({ formObj });
  if (resultTLV) {
    return resultTLV;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader() {
  const { data: assignmentData } = await axios.get(`/api/assign/getAssigned`);

  const prefData = await axios.get(`/api/getPreferredFolderView`);
  const listViewPref = !prefData.data.cardView;

  return {
    user: assignmentData.user,
    assignments: assignmentData.assignments,
    listViewPref,
  };
}

export function Assigned() {
  const { user, assignments, listViewPref } = useLoaderData() as {
    user: UserInfo;
    assignments: ContentStructure[];
    listViewPref: boolean;
  };

  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [listView, setListView] = useState(listViewPref);

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
        <ToggleViewButtonGroup
          listView={listView}
          setListView={setListView}
          fetcher={fetcher}
        />
      </VStack>
    </Box>
  );

  const cardContent: CardContent[] = assignments.map((assignment) => {
    return {
      content: assignment,
      cardLink:
        assignment.assignmentStatus === "Open"
          ? `/code/${assignment.classCode}`
          : `/assignedData/${assignment.id}`,
      closeTime: formatTime(assignment.codeValidUntil),
    };
  });

  const mainPanel = (
    <CardList
      showOwnerName={false}
      showAssignmentStatus={true}
      showPublicStatus={false}
      emptyMessage={"Nothing Assigned"}
      listView={listView}
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
        background={
          listView && assignments.length > 0 ? "white" : "var(--lightBlue)"
        }
        minHeight="calc(100vh - 188px)"
        flexDirection="column"
      >
        {mainPanel}
      </Flex>
    </>
  );
}
