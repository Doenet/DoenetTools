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
  Box,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router";
import axios from "axios";
import { DoenetHeading as Heading } from "../../../Widgets/Heading";
import { lastNameFirst } from "../../../_utils/names";

type AssignmentScore = {
  contentId: string;
  score: number;
  user: {
    userId: string;
    firstNames: string | null;
    lastNames: string;
    email: string;
  };
};

type OrderedActivity = {
  id: string;
  name: string;
};

type StudentStructure = {
  userId: string;
  firstNames: string | null;
  lastNames: string;
  email: string;
  scores: Record<string, number>;
};

type Folder = {
  id: string;
  name: string;
};

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getAllAssignmentScores/${params.folderId ?? ""}`,
  );

  const assignmentScores: AssignmentScore[] = data.assignmentScores;

  const studentData: Record<string, StudentStructure> = {};
  assignmentScores.forEach((score) => {
    if (!(score.user.userId in studentData)) {
      studentData[score.user.userId] = { ...score.user, scores: {} };
    }
    studentData[score.user.userId].scores[score.contentId] = score.score;
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

  return {
    assignments: data.orderedActivities,
    students: studentData,
    studentIdsOrdered,
    folder: data.folder,
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
    document.title = "My Assignments";
  });

  const navigate = useNavigate();

  const linkStyle = {
    display: "block",
    color: "var(--mainBlue)",
  };

  return (
    <>
      <Box style={{ marginTop: 15, marginLeft: 15 }}>
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
          <Heading heading={"My Assignments"} />
          <Heading subheading="Score summary" />
        </>
      )}

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
            {studentIdsOrdered.map((studentId: string) => (
              <Tr
                key={`student${studentId}`}
                borderTopWidth={2}
                borderTopColor={"#bbb"}
              >
                <Td>
                  <ChakraLink
                    as={ReactRouterLink}
                    to={`/studentData/${studentId}${folder ? "/" + folder.id : ""}`}
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
                              students[studentId].scores[assignment.id] * 100,
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
