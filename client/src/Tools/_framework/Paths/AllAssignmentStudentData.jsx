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
  const { data } = await axios.get("/api/getAllAssignmentStudentData");

  let studentData = {};
  data.forEach(function(assignment) {
    assignment.assignmentScores.forEach(function(score) {
        if(!(score.userId in studentData)) {
            studentData[score.userId] = {name: score.user.name, scores: {}}
        }
        studentData[score.userId].scores[assignment.assignmentId] = score.score;
    })
  })

  return {
    assignments: data,
    students: studentData
  };
}

export function AllAssignmentStudentData() {
  const { assignments, students } =
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
                {Object.keys(students).map((studentId) => 
                    <Tr key={`student${studentId}`}>
                        <Td>
                            <Link href={""} style={linkStyle}>
                                {students[studentId].name}
                            </Link>
                        </Td>
                        {
                            // if student has a score for this assignment, display it
                            assignments.map(function(assignment) {
                                if(assignment.assignmentId in students[studentId].scores) {
                                    return <Td key={`student${studentId}_assignment${assignment.assignmentId}`}>
                                                <Link href={`/assignmentData/${assignment.assignmentId}/${studentId}`} style={linkStyle}>
                                                    {Math.round(students[studentId].scores[assignment.assignmentId] * 100) / 100}
                                                </Link>
                                            </Td>
                                }
                                else {
                                    return <Td key={`student${studentId}_assignment${assignment.assignmentId}`}>--</Td>;
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