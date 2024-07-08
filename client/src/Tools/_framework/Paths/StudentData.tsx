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
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";

type userData = {
  userId: number;
  name: string;
};
type orderedActivityScore = {
  activityId: number;
  activityName: string;
  score: number;
};

export async function loader({ params }) {
  let { data } = await axios.get(
    `/api/getStudentData/${Number(params.userId)}`,
  );

  const userData = data.userData;
  const scores = data.orderedActivityScores;

  return { userData, scores };
}

export function StudentData() {
  const { userData, scores } = useLoaderData() as {
    userData: userData;
    scores: orderedActivityScore[];
  };

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
            {scores.map((score) => {
              return (
                <Tr key={`assignment${score.activityId}`}>
                  <Td key={`assignment_title${score.activityId}`}>
                    <Link
                      href={`/assignmentData/${score.activityId}`}
                      style={linkStyle}
                    >
                      {score.activityName}
                    </Link>
                  </Td>
                  <Td key={`score${score.activityId}`}>
                    {score.score !== null ? (
                      <Link
                        href={`/assignmentData/${score.activityId}/${userData.userId}`}
                        style={linkStyle}
                      >
                        {score.score}
                      </Link>
                    ) : (
                      <Text>&#8212;</Text>
                    )}
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
