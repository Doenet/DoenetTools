import React, { useEffect, useRef, useState } from "react";
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
  Link as ChakraLink,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from "recharts";
import AssignmentPreview from "../ToolPanels/AssignmentPreview";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { createFullName } from "../../../_utils/names";

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getAssignmentData/${params.activityId}`,
  );

  let activityId = Number(params.activityId);

  // TODO: address case where don't have one document
  const doenetML = data.assignmentContent[0].assignedVersion.source;
  const doenetmlVersion =
    data.assignmentContent[0].assignedVersion.doenetmlVersion.fullVersion;

  return {
    assignmentData: data.assignmentData,
    answerList: data.answerList,
    doenetML,
    doenetmlVersion,
    activityId,
  };
}

export function AssignmentData() {
  const { activityId, assignmentData, answerList, doenetML, doenetmlVersion } =
    useLoaderData() as {
      activityId: number;
      assignmentData: any;
      answerList: any;
      doenetML: string;
      doenetmlVersion: string;
    };

  useEffect(() => {
    document.title = `${assignmentData.name} - Doenet`;
  }, [assignmentData.name]);

  let navigate = useNavigate();

  const [scoreData, setScoreData] = useState<
    { count: number; score: number }[]
  >([]);

  const [activatePreview, setActivatePreview] = useState(false);

  const lastTabIndex = useRef(0);

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
          <Label value="Number of students" angle={-90} position="insideLeft" />
        </YAxis>
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>

      <Tabs defaultIndex={lastTabIndex.current}>
        <TabList>
          <Tab
            onClick={() => {
              lastTabIndex.current = 0;
            }}
          >
            Individual scores
          </Tab>
          <Tab
            onClick={() => {
              setActivatePreview(true);
              lastTabIndex.current = 1;
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
                    <Th textTransform={"none"} fontSize="large">
                      Name
                    </Th>
                    <Th textTransform={"none"} fontSize="large">
                      Score
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {assignmentData.assignmentScores.map((assignmentScore) => {
                    const linkURL =
                      "/assignmentData/" +
                      activityId +
                      "/" +
                      assignmentScore.user.userId;
                    return (
                      <Tr key={`user${assignmentScore.user.userId}`}>
                        <Td>
                          <ChakraLink
                            as={ReactRouterLink}
                            to={linkURL}
                            style={linkStyle}
                          >
                            {createFullName(assignmentScore.user)}
                          </ChakraLink>
                        </Td>
                        <Td>
                          <ChakraLink
                            as={ReactRouterLink}
                            to={linkURL}
                            style={linkStyle}
                          >
                            {Math.round(assignmentScore.score * 100) / 100}
                          </ChakraLink>
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
                />
              </VStack>
              <Box>
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th textTransform={"none"} fontSize="large">
                          Answer name
                        </Th>
                        <Th textTransform={"none"} fontSize="large">
                          Number of
                          <br />
                          students
                          <br />
                          responded
                        </Th>
                        <Th textTransform={"none"} fontSize="large">
                          Average
                          <br />
                          correct
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {answerList.map((answerObj) => {
                        const key = `/assignmentAnswerResponses/${activityId}/${answerObj.docId}/${answerObj.docVersionNum}/${answerObj.answerId}`;
                        const linkURL = `/assignmentAnswerResponses/${activityId}/${
                          answerObj.docId
                        }/${
                          answerObj.docVersionNum
                        }?answerId=${encodeURIComponent(answerObj.answerId)}`;
                        return (
                          <Tr key={key}>
                            <Td>
                              <ChakraLink
                                as={ReactRouterLink}
                                to={linkURL}
                                style={linkStyle}
                              >
                                {answerObj.answerId}
                              </ChakraLink>
                            </Td>
                            <Td>
                              <ChakraLink
                                as={ReactRouterLink}
                                to={linkURL}
                                style={linkStyle}
                              >
                                {answerObj.count}
                              </ChakraLink>
                            </Td>
                            <Td>
                              <ChakraLink
                                as={ReactRouterLink}
                                to={linkURL}
                                style={linkStyle}
                              >
                                {Math.round(answerObj.averageCredit * 1000) /
                                  10}
                                %
                              </ChakraLink>
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
