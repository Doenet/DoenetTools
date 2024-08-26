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
  LinkBox,
  LinkOverlay,
  Link as ChakraLink,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import { createFullName } from "../../../_utils/names";

type UserData = {
  userId: string;
  firstNames: string | null;
  lastNames: string;
};
type OrderedActivityScore = {
  activityId: string;
  activityName: string;
  score: number;
};

type Folder = {
  id: string;
  name: string;
};

// loader for when an instructor gets data about a student
export async function loader({ params }) {
  let { data } = await axios.get(
    `/api/getStudentData/${params.userId}/${params.folderId ?? ""}`,
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
                <LinkBox
                  as={Tr}
                  key={`assignment${score.activityId}`}
                  _hover={{ backgroundColor: "#eeeeee" }}
                >
                  <Td key={`assignment_title${score.activityId}`}>
                    {score.activityName}
                  </Td>
                  <Td key={`score${score.activityId}`}>
                    {score.score !== null ? (
                      <LinkOverlay
                        as={ReactRouterLink}
                        to={
                          isAssignedData
                            ? `/assignedData/${score.activityId}`
                            : `/assignmentData/${score.activityId}/${userData.userId}`
                        }
                      >
                        {score.score}
                      </LinkOverlay>
                    ) : (
                      <Text>&#8212;</Text>
                    )}
                  </Td>
                </LinkBox>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
