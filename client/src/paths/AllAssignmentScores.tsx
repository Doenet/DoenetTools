import React, { useEffect } from "react";
import { useLoaderData } from "react-router";

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Link as ChakraLink,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router";
import axios from "axios";
import { DoenetHeading as Heading } from "../widgets/Heading";
import { lastNameFirst } from "../utils/names";

type AssignmentScore = {
  contentId: string;
  userScores: {
    score: number;
    user: {
      userId: string;
      firstNames: string | null;
      lastNames: string;
      email: string;
    };
  }[];
};

type OrderedActivity = {
  contentId: string;
  name: string;
  hasScores: boolean;
};

type StudentStructure = {
  userId: string;
  firstNames: string | null;
  lastNames: string;
  email: string;
  scores: Record<string, number>;
};

type Folder = {
  contentId: string;
  name: string;
};

export async function loader({
  params,
}: {
  params: {
    parentId?: string;
  };
}) {
  const { data } = await axios.get(
    `/api/assign/getAllAssignmentScores/${params.parentId ?? ""}`,
  );

  const { orderedActivities, assignmentScores, folder } = data as {
    orderedActivities: OrderedActivity[];
    assignmentScores: AssignmentScore[];
    folder: Folder;
  };

  const assignmentHasScores = new Set<string>([]);

  const studentData: Record<string, StudentStructure> = {};
  assignmentScores.forEach((scoreObj) => {
    if (scoreObj.userScores.length > 0) {
      assignmentHasScores.add(scoreObj.contentId);
    }
    scoreObj.userScores.forEach((score) => {
      if (!(score.user.userId in studentData)) {
        studentData[score.user.userId] = { ...score.user, scores: {} };
      }
      studentData[score.user.userId].scores[scoreObj.contentId] = score.score;
    });
  });

  // list of student ids (keys to studentData) ordered based on corresponding student name
  // sort by last names
  const studentIdsOrdered = Object.keys(studentData);
  studentIdsOrdered.sort((a, b) => {
    const nameA = lastNameFirst(studentData[a]).trim().toLowerCase();
    const nameB = lastNameFirst(studentData[b]).trim().toLowerCase();
    if (nameA > nameB) {
      return 1;
    } else if (nameA < nameB) {
      return -1;
    }
    return 0;
  });

  const assignments = orderedActivities.map((activity) => ({
    contentId: activity.contentId,
    name: activity.name,
    hasScores: assignmentHasScores.has(activity.contentId),
  }));

  return {
    assignments,
    students: studentData,
    studentIdsOrdered,
    folder,
  };
}

export function AllAssignmentScores() {
  const { assignments, students, studentIdsOrdered, folder } =
    useLoaderData() as {
      assignments: OrderedActivity[];
      students: Record<string, StudentStructure>;
      studentIdsOrdered: string[];
      folder: Folder | null;
    };

  useEffect(() => {
    document.title = "Assignment Scores";
  });

  const navigate = useNavigate();

  const nameWidth = 150;
  const itemWidth = 50;

  return (
    <>
      <Box height="100px" marginTop="15px">
        <Box marginLeft="15px">
          <ChakraLink
            as={ReactRouterLink}
            to={".."}
            style={{
              color: "var(--mainBlue)",
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            {" "}
            &lt; Back
          </ChakraLink>
        </Box>
        {folder ? (
          <>
            <Heading heading={"Assignment Scores"} />
            <Heading subheading={`${folder.name}`} />
          </>
        ) : (
          <>
            <Heading heading={"Assignment Scores"} />
            <Heading subheading="My Activities" />
          </>
        )}
      </Box>
      <Box
        overflowX="scroll"
        height="calc(100vh - 155px)"
        paddingLeft="20px"
        boxSizing="content-box"
      >
        <Box width={`${nameWidth + itemWidth * assignments.length + 100}px`}>
          <TableContainer
            width={`${nameWidth + itemWidth * assignments.length + 100}px`}
            overflowX="hidden"
          >
            <Table
              size="sm"
              className="score-table"
              layout="fixed"
              width={`${nameWidth + itemWidth * assignments.length}px`}
            >
              <Thead>
                <Tr verticalAlign={"bottom"}>
                  <Th
                    textTransform={"none"}
                    fontSize="large"
                    width={`${nameWidth}px`}
                  >
                    Student
                  </Th>
                  {assignments.map((assignment) => {
                    const assignmentNameShortened =
                      assignment.name.length < 30
                        ? assignment.name
                        : assignment.name.substring(
                            0,
                            assignment.name.substring(0, 27).lastIndexOf(" "),
                          ) + "...";
                    return (
                      <Th
                        key={`assignment${assignment.contentId}`}
                        textTransform={"none"}
                      >
                        {assignment.hasScores ? (
                          <ChakraLink
                            as={ReactRouterLink}
                            to={`/assignmentData/${assignment.contentId}`}
                            display="block"
                            textDecoration="underline"
                            height="14em"
                            width="1em"
                            transform="rotate(315deg) translate(-4em, 11em)"
                            fontSize={14}
                          >
                            <Tooltip
                              label={assignment.name}
                              placement="bottom-end"
                              openDelay={500}
                            >
                              <Text textDecoration="underline">
                                {assignmentNameShortened}
                              </Text>
                            </Tooltip>
                          </ChakraLink>
                        ) : (
                          <Text
                            display="block"
                            height="14em"
                            width="1em"
                            transform="rotate(315deg) translate(-4em, 11em)"
                            fontSize={14}
                          >
                            <Tooltip
                              label={assignment.name}
                              placement="bottom-end"
                              openDelay={500}
                            >
                              {assignmentNameShortened}{" "}
                            </Tooltip>
                          </Text>
                        )}
                      </Th>
                    );
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {studentIdsOrdered.map((studentId: string) => (
                  <Tr
                    key={`student${studentId}`}
                    borderTopWidth={2}
                    borderTopColor={"#bbb"}
                  >
                    <Td>
                      <ChakraLink
                        as={ReactRouterLink}
                        to={`/studentAssignmentScores/${studentId}${folder ? "/" + folder.contentId : ""}`}
                        textDecoration="underline"
                      >
                        {lastNameFirst(students[studentId])}
                      </ChakraLink>
                    </Td>
                    {
                      // if student has a score for this assignment, display it
                      assignments.map(function (assignment) {
                        if (
                          assignment.contentId in students[studentId].scores
                        ) {
                          return (
                            <Td
                              key={`student${studentId}_assignment${assignment.contentId}`}
                            >
                              <ChakraLink
                                as={ReactRouterLink}
                                to={`/assignmentData/${assignment.contentId}/${studentId}`}
                                textDecoration="underline"
                              >
                                &nbsp;
                                {Math.round(
                                  students[studentId].scores[
                                    assignment.contentId
                                  ] * 1000,
                                ) / 10}
                                &nbsp;
                              </ChakraLink>
                            </Td>
                          );
                        } else {
                          return (
                            <Td
                              key={`student${studentId}_assignment${assignment.contentId}`}
                            >
                              &#8212;
                            </Td>
                          );
                        }
                      })
                    }
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        {studentIdsOrdered.length === 0 ? (
          <Box marginTop="20px">No students have taken assignments yet</Box>
        ) : null}
      </Box>
    </>
  );
}
