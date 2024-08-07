import React, { useEffect } from "react";
import { useLoaderData } from "react-router";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
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
  Box,
  Link as ChakraLink,
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

type Folder = {
  id: number;
  name: string;
};

// loader for when an instructor gets data about a student
export async function loader({ params }) {
  let { data } = await axios.get(
    `/api/getStudentData/${Number(params.userId)}/${params.folderId ?? ""}`,
  );

  const userData = data.userData;
  const scores = data.orderedActivityScores;
  const folder = data.folder;

  return { userData, scores, folder, isAssignedData: false };
}

// loader for when a student gets their own data
export async function assignedDataloader() {
  let { data } = await axios.get(`/api/getAssignedScores`);

  const userData = data.userData;
  const scores = data.orderedActivityScores;
  const folder = data.folder;

  return { userData, scores, folder, isAssignedData: true };
}

export function StudentData() {
  const { userData, scores, folder, isAssignedData } = useLoaderData() as {
    userData: UserData;
    scores: OrderedActivityScore[];
    folder: Folder | null;
    isAssignedData: boolean;
  };

  useEffect(() => {
    document.title = `${createFullName(userData)}'s Assignments`;
  });

  let navigate = useNavigate();

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
      <Heading heading={`${createFullName(userData)}'s Assignments`} />

      {folder ? (
        <Heading subheading={`${folder.name}`} />
      ) : (
        <Heading subheading="Score summary" />
      )}

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
