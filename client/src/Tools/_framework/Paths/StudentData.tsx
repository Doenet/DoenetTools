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
import { createFullName } from "../../../_utils/names";

type UserData = {
  userId: number;
  firstNames: string | null;
  lastNames: string;
};
type OrderedActivityScore = {
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

  return { userData, scores, isAssignedData: false };
}

export async function assignedDataloader() {
  let { data } = await axios.get(`/api/getAssignedScores`);

  const userData = data.userData;
  const scores = data.orderedActivityScores;

  return { userData, scores, isAssignedData: true };
}

export function StudentData() {
  const { userData, scores, isAssignedData } = useLoaderData() as {
    userData: UserData;
    scores: OrderedActivityScore[];
    isAssignedData: boolean;
  };

  useEffect(() => {
    document.title = `${createFullName(userData)}'s Assignments`;
  });

  const linkStyle = {
    display: "block",
    color: "var(--mainBlue)",
  };

  return (
    <>
      <Heading heading={`${createFullName(userData)}'s Assignments`} />

      <Heading subheading="Score summary" />
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th textTransform={"none"} fontSize="large">
                Assignment
              </Th>
              <Th textTransform={"none"} fontSize="large">
                Score
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {scores.map((score) => {
              return (
                <Tr key={`assignment${score.activityId}`}>
                  <Td key={`assignment_title${score.activityId}`}>
                    {isAssignedData ? (
                      score.activityName
                    ) : (
                      <Link
                        href={`/assignmentData/${score.activityId}`}
                        style={linkStyle}
                      >
                        {score.activityName}
                      </Link>
                    )}
                  </Td>
                  <Td key={`score${score.activityId}`}>
                    {score.score !== null ? (
                      <Link
                        href={
                          isAssignedData
                            ? `assignedData/${score.activityId}`
                            : `/assignmentData/${score.activityId}/${userData.userId}`
                        }
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
