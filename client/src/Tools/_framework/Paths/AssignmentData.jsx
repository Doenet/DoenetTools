import React, { useEffect, useState } from "react";
import { redirect, useLoaderData } from "react-router";
import { parseAndCompile } from "@doenet/doenetml";

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  VStack,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import { useFetcher, Link } from "react-router-dom";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from "recharts";
import AssignmentPreview from "../ToolPanels/AssignmentPreview";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "back to editor") {
    return redirect(`/assignmentEditor/${params.assignmentId}`);
  }
  return null;
}

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getAssignmentData/${params.assignmentId}`,
  );

  let assignmentId = Number(params.assignmentId);

  // TODO: address case where don't have one document
  const doenetML = data.assignmentContent[0].documentVersion.content;

  return {
    assignmentData: data.assignmentData,
    answerList: data.answerList,
    doenetML,
    assignmentId,
  };
}

export function AssignmentData() {
  const { assignmentId, assignmentData, answerList, doenetML } =
    useLoaderData();

  useEffect(() => {
    document.title = `${assignmentData.name} - Doenet`;
  }, [assignmentData.name]);

  const fetcher = useFetcher();

  const [scoreData, setScoreData] = useState([]);

  const [activatePreview, setActivatePreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(1);

  useEffect(() => {
    const minScore = 0;
    const numBins = 11;
    const size = 1 / (numBins - 1);

    const hist = new Array(numBins).fill(0);
    for (const item of assignmentData.assignmentScores) {
      hist[Math.round((item.score - minScore) / size)]++;
    }

    setScoreData(
      hist.map((v, i) => ({ count: v, score: Math.round(i * size * 10) / 10 })),
    );
  }, [assignmentData]);

  const linkStyle = {
    display: "block",
    textDecoration: "underline",
  };

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
          <Label value="Maximum Score" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Number of students" angle="-90" position="insideLeft" />
        </YAxis>
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>

      <Tabs>
        <TabList>
          <Tab>Individual scores</Tab>
          <Tab
            onClick={() => {
              setActivatePreview(true);
              setPreviewKey(previewKey + 1);
            }}
          >
            Item summary
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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
                  {assignmentData.assignmentScores.map((assignmentScore) => {
                    const linkURL =
                      "/assignmentData/" +
                      assignmentId +
                      "/" +
                      assignmentScore.user.userId;
                    return (
                      <Tr key={`user${assignmentScore.user.userId}`}>
                        <Td>
                          <Link to={linkURL} style={linkStyle}>
                            {assignmentScore.user.name}
                          </Link>
                        </Td>
                        <Td>
                          <Link to={linkURL} style={linkStyle}>
                            {Math.round(assignmentScore.score * 100) / 100}
                          </Link>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <Heading subheading="Item summary" />

            <SimpleGrid columns={2} spacing="20px" margin="20px">
              <VStack>
                {/* <Heading subheading="Assignment Preview" /> */}

                <p>
                  Note: hover over an answer submit button to reveal answer
                  name.
                </p>
                <AssignmentPreview
                  doenetML={doenetML}
                  active={activatePreview}
                  key={`preview${previewKey}`}
                />
              </VStack>
              <Box>
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Answer name</Th>
                        <Th>
                          Number of
                          <br />
                          students
                          <br />
                          responded
                        </Th>
                        <Th>
                          Average
                          <br />
                          correct
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {answerList.map((answerObj) => {
                        const key = `/assignmentAnswerResponses/${assignmentId}/${answerObj.docId}/${answerObj.docVersionId}/${answerObj.answerId}`;
                        const linkURL = `/assignmentAnswerResponses/${assignmentId}/${
                          answerObj.docId
                        }/${
                          answerObj.docVersionId
                        }?answerId=${encodeURIComponent(answerObj.answerId)}`;
                        return (
                          <Tr key={key}>
                            <Td>
                              <Link to={linkURL} style={linkStyle}>
                                {answerObj.answerId}
                              </Link>
                            </Td>
                            <Td>
                              <Link to={linkURL} style={linkStyle}>
                                {answerObj.count}
                              </Link>
                            </Td>
                            <Td>
                              <Link to={linkURL} style={linkStyle}>
                                {Math.round(answerObj.averageCredit * 1000) /
                                  10}
                                %
                              </Link>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
