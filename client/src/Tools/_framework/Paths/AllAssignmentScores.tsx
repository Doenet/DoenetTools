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
  Link,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";

type assignmentScore = {
  activityId: number;
  score: number;
  userId: number;
  user: {
    name: string;
  };
};

type orderedActivity = {
  id: number;
  name: string;
};

type studentStructure = {
  name: string;
  scores: {
    [assignmentId: number]: {
      score: number;
    };
  }[];
};

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getAllAssignmentScores/${params.folderId ?? ""}`,
  );

  const assignmentScores: assignmentScore[] = data.assignmentScores;

  let studentData = {};
  assignmentScores.forEach((score) => {
    if (!(score.userId in studentData)) {
      studentData[score.userId] = { name: score.user.name, scores: {} };
    }
    studentData[score.userId].scores[score.activityId] = score.score;
  });

  // list of student ids (keys to studentData) ordered based on corresponding student name
  // sort by last name if there is one; otherwise, sort by entire name
  let studentIdsOrdered = Object.keys(studentData);
  studentIdsOrdered.sort((a, b) => {
    let namea = studentData[a].name.trim();
    let nameb = studentData[b].name.trim();
    namea =
      namea.indexOf(" ") > -1 ? namea.substring(namea.indexOf(" ") + 1) : namea;
    nameb =
      nameb.indexOf(" ") > -1 ? nameb.substring(nameb.indexOf(" ") + 1) : nameb;
    if (namea > nameb) {
      return 1;
    } else if (namea < nameb) {
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
    assignments: orderedActivity[];
    students: studentStructure[];
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
              <Th>Student</Th>
              {assignments.map((assignment) => {
                return (
                  <Th
                    key={`assignment${assignment.id}`}
                    textTransform={"capitalize"}
                  >
                    <Link
                      href={`/assignmentData/${assignment.id}`}
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
                    </Link>
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
                  <Link href={`studentData/${studentId}`} style={linkStyle}>
                    {
                      // if name has a space in it, display in lastname, firstname format; otherwise, display entire name as given
                      students[studentId].name.indexOf(" ") > -1
                        ? students[studentId].name.substring(
                            students[studentId].name.indexOf(" ") + 1,
                          ) +
                          ", " +
                          students[studentId].name.substring(
                            0,
                            students[studentId].name.indexOf(" "),
                          )
                        : students[studentId].name
                    }
                  </Link>
                </Td>
                {
                  // if student has a score for this assignment, display it
                  assignments.map(function (assignment) {
                    if (assignment.id in students[studentId].scores) {
                      return (
                        <Td
                          key={`student${studentId}_assignment${assignment.id}`}
                        >
                          <Link
                            href={`/assignmentData/${assignment.id}/${studentId}`}
                            style={linkStyle}
                          >
                            {Math.round(
                              (students[studentId].scores[
                                assignment.id
                              ] as number) * 100,
                            ) / 100}
                          </Link>
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
