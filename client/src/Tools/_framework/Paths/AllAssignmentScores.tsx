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
  Link as ChakraLink,
  Tooltip,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import { lastNameFirst } from "../../../_utils/names";

type AssignmentScore = {
  activityId: number;
  score: number;
  userId: number;
  user: {
    firstNames: string | null;
    lastNames: string;
  };
};

type OrderedActivity = {
  id: number;
  name: string;
};

type StudentStructure = {
  firstNames: string | null;
  lastNames: string;
  scores: {
    [activityId: number]: {
      score: number;
    };
  }[];
};

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getAllAssignmentScores/${params.folderId ?? ""}`,
  );

  const assignmentScores: AssignmentScore[] = data.assignmentScores;

  let studentData: Record<string, StudentStructure> = {};
  assignmentScores.forEach((score) => {
    if (!(score.userId in studentData)) {
      studentData[score.userId] = { ...score.user, scores: [] };
    }
    studentData[score.userId].scores[score.activityId] = score.score;
  });

  // list of student ids (keys to studentData) ordered based on corresponding student name
  // sort by last names
  let studentIdsOrdered = Object.keys(studentData);
  studentIdsOrdered.sort((a, b) => {
    let lastNamesA = studentData[a].lastNames.trim().toLowerCase();
    let lastNamesB = studentData[b].lastNames.trim().toLowerCase();
    if (lastNamesA > lastNamesB) {
      return 1;
    } else if (lastNamesA < lastNamesB) {
      return -1;
    }
    return 0;
  });

  return {
    assignments: data.orderedActivities,
    students: studentData,
    studentIdsOrdered,
  };
}

export function AllAssignmentScores() {
  const { assignments, students, studentIdsOrdered } = useLoaderData() as {
    assignments: OrderedActivity[];
    students: Record<string, StudentStructure>;
    studentIdsOrdered: number[];
  };

  useEffect(() => {
    document.title = "My Assignments";
  });

  const linkStyle = {
    display: "block",
    color: "var(--mainBlue)",
  };

  return (
    <>
      <Heading heading={"My Assignments"} />

      <Heading subheading="Score summary" />
      <TableContainer>
        <Table>
          <Thead>
            <Tr verticalAlign={"bottom"}>
              <Th textTransform={"none"}>Student</Th>
              {assignments.map((assignment) => {
                return (
                  <Th key={`assignment${assignment.id}`} textTransform={"none"}>
                    <ChakraLink
                      as={ReactRouterLink}
                      to={`/assignmentData/${assignment.id}`}
                      style={linkStyle}
                      height="14em"
                      width="1em"
                      transform="rotate(315deg) translate(-4em, 11em)"
                      fontSize={14}
                    >
                      {assignment.name.length < 30 ? (
                        assignment.name
                      ) : (
                        <Tooltip label={assignment.name}>
                          {assignment.name.substring(
                            0,
                            assignment.name.substring(0, 27).lastIndexOf(" "),
                          ) + "..."}
                        </Tooltip>
                      )}
                    </ChakraLink>
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {studentIdsOrdered.map((studentId: number) => (
              <Tr
                key={`student${studentId}`}
                borderTopWidth={2}
                borderTopColor={"#bbb"}
              >
                <Td>
                  <ChakraLink
                    as={ReactRouterLink}
                    to={`/studentData/${studentId}`}
                    style={linkStyle}
                  >
                    {lastNameFirst(students[studentId])}
                  </ChakraLink>
                </Td>
                {
                  // if student has a score for this assignment, display it
                  assignments.map(function (assignment) {
                    if (assignment.id in students[studentId].scores) {
                      return (
                        <Td
                          key={`student${studentId}_assignment${assignment.id}`}
                        >
                          <ChakraLink
                            as={ReactRouterLink}
                            to={`/assignmentData/${assignment.id}/${studentId}`}
                            style={linkStyle}
                          >
                            {Math.round(
                              (students[studentId].scores[
                                assignment.id
                              ] as number) * 100,
                            ) / 100}
                          </ChakraLink>
                        </Td>
                      );
                    } else {
                      return (
                        <Td
                          key={`student${studentId}_assignment${assignment.id}`}
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
    </>
  );
}
