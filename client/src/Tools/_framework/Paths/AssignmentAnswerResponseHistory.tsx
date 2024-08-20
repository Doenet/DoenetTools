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
  Link as ChakraLink,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import { parseAndFormatResponse } from "./AssignmentAnswerResponses";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { createFullName } from "../../../_utils/names";
import { UserInfo } from "../../../_utils/types";

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
    `/api/getSubmittedResponseHistory/${params.activityId}/${params.docId}/${
      params.docVersionNum
    }/${params.userId}?answerId=${encodeURIComponent(answerId)}`,
  );

  const activityId = params.activityId;
  const docId = params.docId;
  const docVersionNum = Number(params.docVersionNum);
  const userId = params.userId;
  const activityName = data.activityName;
  const responseData = data.submittedResponses;
  const maxCredit = responseData.reduce(
    (a, c) => Math.max(c.creditAchieved, a),
    0,
  );

  return {
    answerId,
    docId,
    docVersionNum,
    userId,
    activityName,
    responseData,
    activityId,
    maxCredit,
  };
}

export function AssignmentAnswerResponseHistory() {
  const {
    activityId,
    docId,
    docVersionNum,
    answerId,
    activityName,
    responseData,
    maxCredit,
  } = useLoaderData() as {
    activityId: string;
    docId: string;
    docVersionNum: number;
    answerId: string;
    activityName: string;
    responseData: {
      user: UserInfo;
      response: string;
      creditAchieved: number;
      submittedAt: string;
    }[];
    maxCredit: number;
  };

  useEffect(() => {
    document.title = `${activityName} - Doenet`;
  }, [activityName]);

  let navigate = useNavigate();

  const [responses, setResponses] = useState<React.JSX.Element[]>([]);

  useEffect(() => {
    setResponses(responseData.map((sr) => parseAndFormatResponse(sr.response)));
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
        subheading={`Responses submitted by ${createFullName(responseData[0]?.user)} for ${answerId}`}
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
              <Th textTransform={"none"} fontSize="large">
                Response
              </Th>
              <Th textTransform={"none"} fontSize="large">
                Percent correct
              </Th>
              <Th textTransform={"none"} fontSize="large">
                Submitted
              </Th>
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
