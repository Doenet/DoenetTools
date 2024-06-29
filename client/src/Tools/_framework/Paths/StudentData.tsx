import React, { useEffect, FunctionComponent } from "react";
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
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";

type userDataStructure = {
  assignmentScores: {
    assignment: {
      name: string;
    };
    assignmentId: number;
    score: number;
  }[];
  name: string;
  userId: number;
};

export async function loader({ params }) {
  let { data } = await axios.get(
    `/api/getStudentData/${Number(params.userId)}`,
  );
  return { data };
}

export function StudentData() {
  const { userData } = useLoaderData() as { userData: userDataStructure };

  useEffect(() => {
    document.title = `${userData.name}'s Assignments`;
  });

  const linkStyle = {
    display: "block",
    color: "var(--mainBlue)",
  };

  return (
    <>
      <Heading heading={`${userData.name}'s Assignments`} />

      <Heading subheading="Score summary" />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Assignment</Th>
              <Th>Score</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userData.assignmentScores.map((score) => {
              return (
                <Tr key={`assignment${score.assignmentId}`}>
                  <Td key={`assignment_title${score.assignmentId}`}>
                    <Link
                      href={`/assignmentData/${score.assignmentId}`}
                      style={linkStyle}
                    >
                      {score.assignment.name}
                    </Link>
                  </Td>
                  <Td key={`score${score.assignmentId}`}>
                    <Link
                      href={`/assignmentData/${score.assignmentId}/${userData.userId}`}
                      style={linkStyle}
                    >
                      {score.score}
                    </Link>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
