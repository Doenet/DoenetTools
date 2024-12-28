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
  LinkBox,
  LinkOverlay,
  Link as ChakraLink,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from "recharts";
import AssignmentPreview from "../ToolPanels/AssignmentPreview";
import { Link as ReactRouterLink, useNavigate } from "react-router";
import { createFullName } from "../../../_utils/names";
import { UserInfo } from "../../../_utils/types";

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getAssignmentData/${params.activityId}`,
  );

  let activityId = params.activityId;

  // TODO: address case where don't have one document
  const doenetML = data.assignmentContent[0].source;
  const doenetmlVersion = data.assignmentContent[0].doenetmlVersion.fullVersion;

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
      activityId: string;
      assignmentData: {
        name: string;
        assignmentScores: {
          score: number;
          user: UserInfo;
        }[];
      };
      answerList: {
        docId: string;
        docVersionNum: number;
        answerId: string;
        answerNumber: number | null;
        count: number;
        averageCredit: number;
      }[];
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
                      <LinkBox
                        as={Tr}
                        key={`user${assignmentScore.user.userId}`}
                        _hover={{ backgroundColor: "#eeeeee" }}
                      >
                        <Td>
                          <LinkOverlay as={ReactRouterLink} to={linkURL}>
                            {createFullName(assignmentScore.user)}
                          </LinkOverlay>
                        </Td>
                        <Td>{Math.round(assignmentScore.score * 100) / 100}</Td>
                      </LinkBox>
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
                          <LinkBox
                            as={Tr}
                            key={key}
                            _hover={{ backgroundColor: "#eeeeee" }}
                          >
                            <Td>
                              <LinkOverlay as={ReactRouterLink} to={linkURL}>
                                {answerObj.answerId}
                              </LinkOverlay>
                            </Td>
                            <Td>{answerObj.count}</Td>
                            <Td>
                              {Math.round(answerObj.averageCredit * 1000) / 10}%
                            </Td>
                          </LinkBox>
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
