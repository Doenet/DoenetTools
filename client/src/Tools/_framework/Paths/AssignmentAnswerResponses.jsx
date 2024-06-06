import React, { useEffect, useState } from "react";
import { redirect, useLoaderData } from "react-router";
import me from "math-expressions";
import { MathJax } from "better-react-mathjax";

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
import { Link, useFetcher } from "react-router-dom";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "back to data") {
    return redirect(`/assignmentData/${params.assignmentId}`);
  }
  return null;
}
export async function loader({ params, request }) {
  const url = new URL(request.url);
  const answerId = url.searchParams.get("answerId");

  const { data } = await axios.get(
    `/api/getSubmittedResponses/${params.assignmentId}/${params.docId}/${
      params.docVersionId
    }?answerId=${encodeURIComponent(answerId)}`,
  );

  let assignmentId = Number(params.assignmentId);
  let docId = Number(params.docId);
  let docVersionId = Number(params.docVersionId);
  let assignment = data.assignment;

  // sort response data by user name
  let responseData = data.submittedResponses.toSorted((a, b) => {
    const name1 = a.user.name.toLowerCase();
    const name2 = b.user.name.toLowerCase();
    if (name1 > name2) {
      return 1;
    }
    if (name1 < name2) {
      return -1;
    }
    return 0;
  });

  return {
    answerId,
    docId,
    docVersionId,
    assignment,
    responseData,
    assignmentId,
  };
}

export function AssignmentAnswerResponses() {
  const {
    assignmentId,
    docId,
    docVersionId,
    answerId,
    assignment,
    responseData,
  } = useLoaderData();

  useEffect(() => {
    document.title = `${assignment.name} - Doenet`;
  }, [assignment.name]);

  const fetcher = useFetcher();

  const [responses, setResponses] = useState([]);
  const [showNames, setShowNames] = useState(false);

  useEffect(() => {
    setResponses(
      responseData.map((sr) => {
        let parsedResp = JSON.parse(sr.response);

        return parsedResp.response.map((v, i) => {
          const componentType = parsedResp.componentTypes[i];
          if (componentType === "math") {
            const expr = me.fromAst(v);
            return (
              <MathJax hideUntilTypeset={"first"} inline dynamic key={i}>
                {"\\( " + expr.toLatex() + " \\)"}
              </MathJax>
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
          fetcher.submit({ _action: "back to data" }, { method: "post" });
        }}
      >
        Some UI element for going back to assignment data
      </Button>

      <Heading subheading={`Last responses submitted for ${answerId}`} />
      <div>
        <label>
          <input
            type="checkbox"
            checked={showNames}
            onChange={() => setShowNames(!showNames)}
          />
          Show names
        </label>
      </div>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              {showNames ? <Th>Name</Th> : null}
              <Th>Last Response</Th>
              <Th>Percent correct</Th>
              <Th>Number of responses</Th>
            </Tr>
          </Thead>
          <Tbody>
            {responses.map((resp, i) => (
              <Tr key={i}>
                {showNames ? <Td>{responseData[i].user.name}</Td> : null}
                <Td>{resp}</Td>
                <Td>
                  {Math.round(responseData[i].creditAchieved * 1000) / 10}%
                </Td>
                <Td>
                  <Link
                    style={{ display: "block", textDecoration: "underline" }}
                    to={`/assignmentAnswerResponseHistory/${assignmentId}/${docId}/${docVersionId}/${
                      responseData[i].userId
                    }?answerId=${encodeURIComponent(answerId)}`}
                  >
                    {responseData[i].responseCount}
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
