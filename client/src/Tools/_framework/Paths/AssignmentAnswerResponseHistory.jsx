import React, { useEffect, useState } from "react";
import { redirect, useLoaderData } from "react-router";
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
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import { useFetcher } from "react-router-dom";

export async function action({ params, request }) {
  const url = new URL(request.url);
  const answerId = url.searchParams.get("answerId");
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "back to responses") {
    return redirect(
      `/assignmentAnswerResponses/${params.assignmentId}/${params.docId}/${
        params.docVersionId
      }?answerId=${encodeURIComponent(answerId)}`,
    );
  }
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

  const fetcher = useFetcher();

  const [responses, setResponses] = useState([]);

  useEffect(() => {
    setResponses(
      responseData.map((sr) => {
        let parsedResp = JSON.parse(sr.response);

        return parsedResp.response.map((v, i) => {
          const componentType = parsedResp.componentTypes[i];
          if (componentType === "math") {
            const expr = me.fromAst(v);
            return (
              <div>
                <MathJax hideUntilTypeset={"first"} inline dynamic key={i}>
                  {"\\(" + expr.toLatex() + "\\)"}
                </MathJax>
              </div>
            );
          } else {
            return (
              <div style={{ whiteSpace: "pre-line" }} key={i}>
                {String(v)}
              </div>
            );
          }
        });
      }),
    );
  }, [responseData]);

  return (
    <>
      <Heading heading={assignment.name} />

      <Button
        type="submit"
        colorScheme="blue"
        mt="8px"
        mr="12px"
        size="xs"
        onClick={() => {
          fetcher.submit({ _action: "back to responses" }, { method: "post" });
        }}
      >
        Some UI element for going back to answer responses
      </Button>

      <Heading
        subheading={`Responses submitted by ${responseData[0]?.user.name} for ${answerId}`}
      />
      <p>
        Best percent correct:
        {Math.round(maxCredit * 1000) / 10}%
      </p>
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
