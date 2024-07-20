import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
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
  Link,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";

export async function action({ params, request }) {
  return null;
}
export async function loader({ params, request }) {
  const url = new URL(request.url);
  const answerId = url.searchParams.get("answerId");

  const { data } = await axios.get(
    `/api/getSubmittedResponses/${params.assignmentId}/${params.docId}/${
      params.docVersionNum
    }?answerId=${encodeURIComponent(answerId)}`,
  );

  let assignmentId = Number(params.assignmentId);
  let docId = Number(params.docId);
  let docVersionNum = Number(params.docVersionNum);
  let activityName = data.activityName;

  // sort response data by user name
  let responseData = data.submittedResponses.toSorted((a, b) => {
    const name1 = a.userName.toLowerCase();
    const name2 = b.userName.toLowerCase();
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
    docVersionNum,
    activityName,
    responseData,
    assignmentId,
  };
}

export function AssignmentAnswerResponses() {
  const {
    assignmentId,
    docId,
    docVersionNum,
    answerId,
    activityName,
    responseData,
  } = useLoaderData();

  useEffect(() => {
    document.title = `${activityName} - Doenet`;
  }, [activityName]);

  const [responses, setResponses] = useState([]);
  const [showNames, setShowNames] = useState(false);
  const [useBest, setUseBest] = useState(true);

  const bestOrLatest = useBest ? "Best" : "Latest";

  useEffect(() => {
    setResponses(
      responseData.map((sr) => {
        const latestResponse = parseAndFormatResponse(sr.latestResponse);
        const bestResponse = parseAndFormatResponse(sr.bestResponse);
        return { latestResponse, bestResponse };
      }),
    );
  }, [responseData]);

  return (
    <>
      <Box style={{ marginTop: 15, marginLeft: 15 }}>
        <Link
          href={`/assignmentData/${assignmentId}`}
          style={{
            color: "var(--mainBlue)",
          }}
        >
          {" "}
          &lt; Back to assignment data
        </Link>
      </Box>
      <Heading heading={activityName} />

      <Heading
        subheading={`${bestOrLatest} responses submitted for ${answerId}`}
      />
      <Box marginLeft={6}>
        <label>
          <input
            type="checkbox"
            checked={showNames}
            onChange={() => setShowNames(!showNames)}
          />{" "}
          Show names
        </label>{" "}
        <label style={{ marginLeft: 20 }}>
          <input
            type="checkbox"
            checked={!useBest}
            onChange={() => setUseBest(!useBest)}
          />{" "}
          Show latest responses
        </label>
      </Box>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>{bestOrLatest} Response</Th>
              <Th>{bestOrLatest} Percent correct</Th>
              <Th>Number of responses</Th>
            </Tr>
          </Thead>
          <Tbody>
            {responses.map((resp, i) => {
              const response = useBest
                ? resp.bestResponse
                : resp.latestResponse;
              const data = responseData[i];
              const creditAchieved = useBest
                ? data.bestCreditAchieved
                : data.latestCreditAchieved;
              return (
                <Tr key={i}>
                  <Td>{showNames ? data.userName : `Student ${i + 1}`}</Td>
                  <Td>{response}</Td>
                  <Td>{Math.round(creditAchieved * 1000) / 10}%</Td>
                  <Td>
                    <Link
                      style={{ display: "block", color: "var(--mainBlue)" }}
                      href={`/assignmentAnswerResponseHistory/${assignmentId}/${docId}/${docVersionNum}/${
                        data.userId
                      }?answerId=${encodeURIComponent(answerId)}`}
                    >
                      {data.numResponses}
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

export function parseAndFormatResponse(response) {
  let parsedResp = JSON.parse(response);

  return parsedResp.response.map((v, i) => {
    const componentType = parsedResp.componentTypes[i];
    if (componentType === "math" || componentType === "point") {
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
}
