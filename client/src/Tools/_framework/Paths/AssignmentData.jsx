import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  VStack,
  Box,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from "recharts";
import AssignmentPreview from "../ToolPanels/AssignmentPreview";

export async function action({ params, request }) {
  return null;
}

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getAssignmentData/${params.assignmentId}`,
  );

  let assignmentId = Number(params.assignmentId);

  // TODO: address case where don't have one document
  const doenetML = data.assignmentContent[0].assignedVersion.source;
  const doenetmlVersion =
    data.assignmentContent[0].assignedVersion.doenetmlVersion.fullVersion;

  return {
    assignmentData: data.assignmentData,
    answerList: data.answerList,
    doenetML,
    doenetmlVersion,
    assignmentId,
  };
}

export function AssignmentData() {
  const {
    assignmentId,
    assignmentData,
    answerList,
    doenetML,
    doenetmlVersion,
  } = useLoaderData();

  useEffect(() => {
    document.title = `${assignmentData.name} - Doenet`;
  }, [assignmentData.name]);

  const [scoreData, setScoreData] = useState([]);

  const [activatePreview, setActivatePreview] = useState(false);

  // TODO: delete previewKey if it turns out we no longer need to reload the DoenetViewer
  // (The reload is currently disabled)
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
    color: "var(--mainBlue)",
  };

  return (
    <>
      <Box style={{ marginTop: 15, marginLeft: 15 }}>
        <Link
          href={`/assignmentEditor/${assignmentId}`}
          style={{
            color: "var(--mainBlue)",
          }}
        >
          {" "}
          &lt; Back to assignment editor
        </Link>
      </Box>
      <Heading heading={assignmentData.name} />

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
              // TODO: delete this commented out refresh if it turns out it is no longer needed
              // setPreviewKey(previewKey + 1);
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
                          <Link href={linkURL} style={linkStyle}>
                            {assignmentScore.user.name}
                          </Link>
                        </Td>
                        <Td>
                          <Link href={linkURL} style={linkStyle}>
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
                  doenetmlVersion={doenetmlVersion}
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
                        const key = `/assignmentAnswerResponses/${assignmentId}/${answerObj.docId}/${answerObj.docVersionNum}/${answerObj.answerId}`;
                        const linkURL = `/assignmentAnswerResponses/${assignmentId}/${
                          answerObj.docId
                        }/${
                          answerObj.docVersionNum
                        }?answerId=${encodeURIComponent(answerObj.answerId)}`;
                        return (
                          <Tr key={key}>
                            <Td>
                              <Link href={linkURL} style={linkStyle}>
                                {answerObj.answerId}
                              </Link>
                            </Td>
                            <Td>
                              <Link href={linkURL} style={linkStyle}>
                                {answerObj.count}
                              </Link>
                            </Td>
                            <Td>
                              <Link href={linkURL} style={linkStyle}>
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
