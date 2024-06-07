import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import me from "math-expressions";
import { MathJax } from "better-react-mathjax";
import { DateTime } from "luxon";

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import { parseAndFormatResponse } from "./AssignmentAnswerResponses";

export async function action({ params, request }) {
  return null;
}
export async function loader({ params, request }) {
  const url = new URL(request.url);
  const answerId = url.searchParams.get("answerId");

  const { data } = await axios.get(
    `/api/getSubmittedResponseHistory/${params.assignmentId}/${params.docId}/${
      params.docVersionId
    }/${params.userId}?answerId=${encodeURIComponent(answerId)}`,
  );

  const assignmentId = Number(params.assignmentId);
  const docId = Number(params.docId);
  const docVersionId = Number(params.docVersionId);
  const userId = Number(params.userId);
  const assignment = data.assignment;
  const responseData = data.submittedResponses;
  const maxCredit = responseData.reduce(
    (a, c) => Math.max(c.creditAchieved, a),
    0,
  );

  return {
    answerId,
    docId,
    docVersionId,
    userId,
    assignment,
    responseData,
    assignmentId,
    maxCredit,
  };
}

export function AssignmentAnswerResponseHistory() {
  const {
    assignmentId,
    docId,
    docVersionId,
    answerId,
    assignment,
    responseData,
    maxCredit,
  } = useLoaderData();

  useEffect(() => {
    document.title = `${assignment.name} - Doenet`;
  }, [assignment.name]);

  const [responses, setResponses] = useState([]);

  useEffect(() => {
    setResponses(responseData.map((sr) => parseAndFormatResponse(sr.response)));
  }, [responseData]);

  return (
    <>
      <Box style={{ marginTop: 15, marginLeft: 15 }}>
        <Link
          href={`/assignmentAnswerResponses/${assignmentId}/${docId}/${docVersionId}?answerId=${encodeURIComponent(
            answerId,
          )}`}
          style={{
            color: "var(--mainBlue)",
          }}
        >
          {" "}
          &lt; Back to answer responses
        </Link>
      </Box>

      <Heading heading={assignment.name} />

      <Heading
        subheading={`Responses submitted by ${responseData[0]?.user.name} for ${answerId}`}
      />
      <Box margin={5}>
        <p>
          Best percent correct:
          {Math.round(maxCredit * 1000) / 10}%
        </p>
      </Box>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Response</Th>
              <Th>Percent correct</Th>
              <Th>Submitted</Th>
            </Tr>
          </Thead>
          <Tbody>
            {responses.map((resp, i) => {
              const respData = responseData[i];
              const isMaxCredit = respData.creditAchieved === maxCredit;
              return (
                <Tr key={i}>
                  <Td>{resp}</Td>
                  <Td style={{ fontWeight: isMaxCredit ? "bold" : "normal" }}>
                    {Math.round(respData.creditAchieved * 1000) / 10}%
                  </Td>
                  <Td>
                    {DateTime.fromISO(respData.submittedAt).toLocaleString(
                      DateTime.DATETIME_MED,
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
