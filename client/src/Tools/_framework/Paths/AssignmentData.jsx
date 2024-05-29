import React, { useEffect, useState } from "react";
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
import { useFetcher, Link } from "react-router-dom";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from "recharts";

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

  const [scoreData, setScoreData] = useState([]);

  useEffect(() => {
    const scores = assignmentData.assignmentScores.map((obj) => obj.score);
    const minScore = 0;
    const maxScore = 1;
    const numBins = 11;
    const size = 1 / (numBins - 1);

    const hist = new Array(numBins).fill(0);
    for (const item of assignmentData.assignmentScores) {
      hist[Math.round((item.score - minScore) / size)]++;
    }

    setScoreData(
      hist.map((v, i) => ({ count: v, score: Math.round(i * size * 10) / 10 })),
    );
  }, assignmentData);

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
      <Heading subheading="Score summary" />
      <BarChart
        width={600}
        height={300}
        data={scoreData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="score">
          <Label value="Score" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Number of students" angle="-90" position="insideLeft" />
        </YAxis>
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
      <Heading subheading="Individual scores" />
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
                <Td>
                  <Link
                    to={
                      "/assignmentData/" +
                      assignmentId +
                      "/" +
                      assignmentScore.user.userId
                    }
                  >
                    {assignmentScore.user.name}
                  </Link>
                </Td>
                <Td>
                  <Link
                    to={
                      "/assignmentData/" +
                      assignmentId +
                      "/" +
                      assignmentScore.user.userId
                    }
                  >
                    {Math.round(assignmentScore.score * 100) / 100}
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
