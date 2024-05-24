import React, { useEffect } from "react";
import { redirect, useLoaderData } from "react-router";

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import { useFetcher } from "react-router-dom";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  // console.log({ formObj });

  if (formObj._action == "back to editor") {
    return redirect(`/assignmentEditor/${params.assignmentId}`);
  }
  return null;
}

export async function loader({ params }) {
  const { data: assignmentData } = await axios.get(
    `/api/getAssignmentScoreData/${params.assignmentId}`,
  );

  let assignmentId = Number(params.assignmentId);

  return {
    assignmentData,
    assignmentId,
  };
}

export function AssignmentData() {
  const { assignmentId, assignmentData } = useLoaderData();

  useEffect(() => {
    document.title = `${assignmentData.name} - Doenet`;
  }, [assignmentData.name]);

  const fetcher = useFetcher();

  return (
    <>
      <Heading heading={assignmentData.name} />

      <Button
        type="submit"
        colorScheme="blue"
        mt="8px"
        mr="12px"
        size="xs"
        onClick={() => {
          fetcher.submit({ _action: "back to editor" }, { method: "post" });
        }}
      >
        Some UI element for going back to assignment editor
      </Button>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Score</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assignmentData.assignmentScores.map((assignmentScore) => (
              <Tr key={`user${assignmentScore.user.userId}`}>
                <Td>{assignmentScore.user.name}</Td>
                <Td>{Math.round(assignmentScore.score * 100) / 100}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
