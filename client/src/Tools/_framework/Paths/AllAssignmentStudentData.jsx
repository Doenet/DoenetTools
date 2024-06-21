import React, { useEffect, useState } from "react";
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
  Tooltip
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";

export async function action({ params, request }) {
  return null;
}

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getAllAssignmentStudentData/${params.userId}`,
  );

  let userId = Number(params.userId);

  return {
    userId,
    studentScores: data.userScores,
    assignments: data.assignments
  };
}

export function AllAssignmentStudentData() {
  const { userId, studentScores, assignments } =
    useLoaderData();

  useEffect(() => {
    document.title = "Your Assignments";
  });

  const linkStyle = {
    display: "block",
    color: "var(--mainBlue)",
  };

  return (
    <>
        <Heading heading={"Your Assignments"} />

        <Heading subheading="Score summary" />
        <TableContainer>
            <Table>
            <Thead>
                <Tr verticalAlign={"bottom"}>
                    <Th>Student</Th>
                    {assignments.map((assignment) => {
                        return (
                            <Th key={`assignment${assignment.assignmentId}`}>
                                <Link href={`/assignmentData/${assignment.assignmentId}`} 
                                    style={linkStyle}
                                    height="15em"
                                    width="1em"
                                    transform="rotate(315deg) translate(-4em, 11em)">
                                    {
                                        assignment.name.length < 30 ? 
                                        assignment.name
                                        : <Tooltip label={assignment.name}>
                                                {assignment.name.substring(0, assignment.name.substring(0, 27).lastIndexOf(" "))+"..."}
                                            </Tooltip>
                                    }
                                </Link>
                            </Th>
                        );
                    })}
                </Tr>
            </Thead>
            <Tbody>
                {studentScores.map((student) => 
                    <Tr key={`student${student.userId}`}>
                        <Td>
                            <Link href={""} style={linkStyle}>
                                {student.name}
                            </Link>
                        </Td>
                        {
                            // if student has a score for this assignment, display it
                            assignments.map(function(assignment) {
                                let score = -1;
                                for(let i=0; i<student.assignmentScores.length; i++) {
                                    if(student.assignmentScores[i].assignmentId === assignment.assignmentId) {
                                        score = student.assignmentScores[i].score;
                                        break;
                                    }
                                }
                                if(score > -1) {
                                    return <Td key={`student${student.userId}_assignment${assignment.assignmentId}`}>
                                                <Link href={`/assignmentData/${assignment.assignmentId}/${student.userId}`} style={linkStyle}>
                                                    {Math.round(score * 100) / 100}
                                                </Link>
                                            </Td>
                                }
                                else {
                                    return <Td key={`student${student.userId}_assignment${assignment.assignmentId}`}>--</Td>;
                                }
                            })
                        }
                    </Tr>
                )}
            </Tbody>
            </Table>
        </TableContainer>
    </>
  );
}
