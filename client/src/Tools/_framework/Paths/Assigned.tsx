// import axios from 'axios';
import {
  Button,
  Box,
  Icon,
  Text,
  Flex,
  Wrap,
  Heading,
  ButtonGroup,
  Tooltip,
  VStack,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useFetcher } from "react-router-dom";

import { RiEmotionSadLine } from "react-icons/ri";
import { FaListAlt, FaRegListAlt } from "react-icons/fa";
import { IoGrid, IoGridOutline } from "react-icons/io5";
import ContentCard from "../../../Widgets/ContentCard";
import axios from "axios";
import { createFullName } from "../../../_utils/names";
import { DateTime } from "luxon";
import ActivityTable from "../../../Widgets/ActivityTable";
import { ContentStructure, UserInfo } from "../../../_utils/types";

export async function action({ request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj?._action == "Set List View Preferred") {
    await axios.post(`/api/setPreferredFolderView`, {
      cardView: formObj.listViewPref === "false",
    });
    return true;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params }) {
  const { data: assignmentData } = await axios.get(`/api/getAssigned`);

  let prefData = await axios.get(`/api/getPreferredFolderView`);
  let listViewPref = !prefData.data.cardView;

  return {
    user: assignmentData.user,
    assignments: assignmentData.assignments,
    listViewPref,
  };
}

export function Assigned() {
  let { user, assignments, listViewPref } = useLoaderData() as {
    user: UserInfo;
    assignments: ContentStructure[];
    listViewPref: Boolean;
  };

  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [listView, setListView] = useState(listViewPref);

  useEffect(() => {
    document.title = `Assigned - Doenet`;
  }, []);

  function formatTime(time: string | null) {
    let timeFormatted: string | undefined;

    if (time !== null) {
      const sameDay = (a: DateTime, b: DateTime): boolean => {
        return (
          a.hasSame(b, "day") && a.hasSame(b, "month") && a.hasSame(b, "year")
        );
      };

      let closeDateTime = DateTime.fromISO(time);
      let now = DateTime.now();
      let tomorrow = now.plus({ day: 1 });

      if (sameDay(closeDateTime, now)) {
        if (closeDateTime.minute === 0) {
          timeFormatted = `today, ${closeDateTime.toLocaleString({ hour: "2-digit" })}`;
        } else {
          timeFormatted = `today, ${closeDateTime.toLocaleString({ hour: "2-digit", minute: "2-digit" })}`;
        }
      } else if (sameDay(closeDateTime, tomorrow)) {
        if (closeDateTime.minute === 0) {
          timeFormatted = `tomorrow, ${closeDateTime.toLocaleString({ hour: "2-digit" })}`;
        } else {
          timeFormatted = `tomorrow, ${closeDateTime.toLocaleString({ hour: "2-digit", minute: "2-digit" })}`;
        }
      } else if (closeDateTime.year === now.year) {
        if (closeDateTime.minute === 0) {
          timeFormatted = closeDateTime.toLocaleString({
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
          });
        } else {
          timeFormatted = closeDateTime.toLocaleString({
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      } else {
        timeFormatted = closeDateTime.toLocaleString(DateTime.DATETIME_MED);
      }
    }

    return timeFormatted;
  }

  return (
    <>
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
        <Heading as="h3" size="md">
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
          <ButtonGroup
            size="sm"
            isAttached
            variant="outline"
            marginBottom=".5em"
          >
            <Tooltip label="Toggle List View">
              <Button isActive={listView === true}>
                <Icon
                  as={listView ? FaListAlt : FaRegListAlt}
                  boxSize={10}
                  p=".5em"
                  cursor="pointer"
                  onClick={() => {
                    if (listView === false) {
                      setListView(true);
                      fetcher.submit(
                        {
                          _action: "Set List View Preferred",
                          listViewPref: true,
                        },
                        { method: "post" },
                      );
                    }
                  }}
                />
              </Button>
            </Tooltip>
            <Tooltip label="Toggle Card View">
              <Button isActive={listView === false}>
                <Icon
                  as={listView ? IoGridOutline : IoGrid}
                  boxSize={10}
                  p=".5em"
                  cursor="pointer"
                  onClick={() => {
                    if (listView === true) {
                      setListView(false);
                      fetcher.submit(
                        {
                          _action: "Set List View Preferred",
                          listViewPref: false,
                        },
                        { method: "post" },
                      );
                    }
                  }}
                />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </VStack>
      </Box>
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
        {assignments.length < 1 ? (
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            minHeight={200}
            padding={20}
            width="100%"
          >
            <Icon fontSize="48pt" as={RiEmotionSadLine} />
            <Text fontSize="36pt">Nothing Assigned</Text>
          </Flex>
        ) : listView ? (
          <ActivityTable
            suppressAvatar={true}
            showPublicStatus={false}
            showAssignmentStatus={true}
            content={assignments.map((assignment) => {
              return {
                id: assignment.id,
                title: assignment.name,
                cardLink:
                  assignment.assignmentStatus === "Open"
                    ? `/code/${assignment.classCode}`
                    : `/assignedData/${assignment.id}`,
                assignmentStatus: assignment.assignmentStatus,
                closeTime: formatTime(assignment.codeValidUntil),
              };
            })}
          />
        ) : (
          <Flex
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            <Wrap p="10px" overflow="visible">
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
                    closeTime={formatTime(assignment.codeValidUntil)}
                  />
                );
              })}
            </Wrap>
          </Flex>
        )}
      </Flex>
    </>
  );
}
