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
  Link as ChakraLink,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { createFullName } from "../../../_utils/names";

export async function action({ params, request }) {
  return null;
}
export async function loader({ params, request }) {
  const url = new URL(request.url);
  const answerId = url.searchParams.get("answerId");

  if (answerId === null) {
    throw Error("Must supply answerId parameters");
  }

  const { data } = await axios.get(
    `/api/getSubmittedResponses/${params.activityId}/${params.docId}/${
      params.docVersionNum
    }?answerId=${encodeURIComponent(answerId)}`,
  );

  let activityId = Number(params.activityId);
  let docId = Number(params.docId);
  let docVersionNum = Number(params.docVersionNum);
  let activityName = data.activityName;

  // sort response data by user name
  let responseData = data.submittedResponses.toSorted((a, b) => {
    const name1 = createFullName(a).toLowerCase();
    const name2 = createFullName(b).toLowerCase();
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
    activityId,
  };
}

export function AssignmentAnswerResponses() {
  const {
    activityId,
    docId,
    docVersionNum,
    answerId,
    activityName,
    responseData,
  } = useLoaderData() as {
    activityId: number;
    docId: number;
    docVersionNum: number;
    answerId: string;
    activityName: string;
    responseData: any;
  };

  useEffect(() => {
    document.title = `${activityName} - Doenet`;
  }, [activityName]);

  let navigate = useNavigate();

  const [responses, setResponses] = useState<
    { latestResponse: React.JSX.Element; bestResponse: React.JSX.Element }[]
  >([]);
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
              <Th textTransform={"none"} fontSize="large">
                Name
              </Th>
              <Th textTransform={"none"} fontSize="large">
                {bestOrLatest} Response
              </Th>
              <Th textTransform={"none"} fontSize="large">
                {bestOrLatest} Percent correct
              </Th>
              <Th textTransform={"none"} fontSize="large">
                Number of responses
              </Th>
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
                  <Td>
                    {showNames ? createFullName(data) : `Student ${i + 1}`}
                  </Td>
                  <Td>{response}</Td>
                  <Td>{Math.round(creditAchieved * 1000) / 10}%</Td>
                  <Td>
                    <ChakraLink
                      as={ReactRouterLink}
                      style={{ display: "block", color: "var(--mainBlue)" }}
                      to={`/assignmentAnswerResponseHistory/${activityId}/${docId}/${docVersionNum}/${
                        data.userId
                      }?answerId=${encodeURIComponent(answerId)}`}
                    >
                      {data.numResponses}
                    </ChakraLink>
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

export function parseAndFormatResponse(response: string): React.JSX.Element {
  let parsedResp = JSON.parse(response);

  return parsedResp.response.map((v, i) => {
    const componentType = parsedResp.componentTypes[i];
    if (componentType === "math" || componentType === "point") {
      const expr = me.fromAst(v);
      return (
        <div>
          <MathJax hideUntilTypeset={"first"} inline dynamic key={i}>
            {
              //@ts-ignore
              "\\(" + expr.toLatex() + "\\)"
            }
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
