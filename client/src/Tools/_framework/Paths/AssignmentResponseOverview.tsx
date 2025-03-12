import React, { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import me from "math-expressions";

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
  Flex,
  List,
  ListItem,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "../../../Widgets/Heading";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from "recharts";
import AssignmentPreview from "../ToolPanels/AssignmentPreview";
import { Link as ReactRouterLink, useNavigate } from "react-router";
import { createFullName } from "../../../_utils/names";
import { Content, DoenetmlVersion, UserInfo } from "../../../_utils/types";
import { isActivitySource } from "@doenet/assignment-viewer";
import { compileActivityFromContent } from "../../../_utils/activity";
import { ActivitySource } from "../../../_utils/viewerTypes";

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/assign/getAssignmentResponseOverview/${params.contentId}`,
  );

  console.log(data);
  const contentId = params.contentId;

  const assignment = data.content;
  const scores = data.scores as {
    score: number;
    scoreByItem: number[] | null;
    user: UserInfo;
  }[];

  const numItems = scores[0]?.scoreByItem?.length ?? 1;

  const numStudents = scores.length;
  const scoreNumbers = scores.map((s) => s.score);
  const averageScore = me.math.mean(...scoreNumbers);
  const medianScore = me.math.median(...scoreNumbers);
  const stdScores = me.math.std(...scoreNumbers);

  const baseData = {
    assignment,
    answerList: data.answerList,
    scores,
    numItems,
    numStudents,
    scoreStats: {
      averageScore,
      medianScore,
      stdScores,
    },
    contentId,
  };

  if (assignment.type === "singleDoc") {
    const doenetML = assignment.doenetML;
    const doenetmlVersion: DoenetmlVersion = assignment.doenetmlVersion;

    return {
      type: assignment.type,
      ...baseData,
      doenetML,
      doenetmlVersion,
    };
  } else {
    const activityJsonPrelim = assignment.activityJson
      ? JSON.parse(assignment.activityJson)
      : null;

    const activityJson = isActivitySource(activityJsonPrelim)
      ? activityJsonPrelim
      : compileActivityFromContent(assignment);

    return {
      type: assignment.type,
      ...baseData,
      answerList: data.answerList,
      activityJson,
    };
  }
}

export function AssignmentData() {
  const data = useLoaderData() as {
    contentId: string;
    assignment: Content;
    answerList: {
      answerId: string;
      answerNumber: number | null;
      itemNumber: number;
      count: number;
      averageCredit: number;
    }[];
    scores: {
      score: number;
      scoreByItem: number[] | null;
      user: UserInfo;
    }[];
    numItems: number;
    numStudents: number;
    scoreStats: {
      averageScore: number;
      medianScore: number;
      stdScores: number;
    };
  } & (
    | {
        type: "singleDoc";
        doenetML: string;
        doenetmlVersion: DoenetmlVersion;
      }
    | {
        type: "select" | "sequence";
        activityJson: ActivitySource;
      }
  );

  const {
    contentId,
    assignment,
    answerList,
    scores,
    numItems,
    numStudents,
    scoreStats,
  } = data;

  useEffect(() => {
    document.title = `${assignment.name} - Doenet`;
  }, [assignment.name]);

  const navigate = useNavigate();

  const [scoreData, setScoreData] = useState<
    { count: number; score: number }[]
  >([]);

  const [activatePreview, setActivatePreview] = useState(false);

  const [itemNumber, setItemNumber] = useState(1);

  const lastTabIndex = useRef(0);

  useEffect(() => {
    const minScore = 0;
    const numBins = 11;
    const size = 1 / (numBins - 1);

    const hist = new Array(numBins).fill(0);
    for (const item of scores) {
      hist[Math.round((item.score - minScore) / size)]++;
    }

    setScoreData(
      hist.map((v, i) => ({ count: v, score: Math.round(i * size * 10) / 10 })),
    );
  }, [scores]);

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
      <Heading heading={assignment.name} />

      <Heading subheading="Score summary" />

      <Flex>
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
            <Label
              value="Number of students"
              angle={-90}
              position="insideLeft"
            />
          </YAxis>
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
        <Box>
          <List>
            <ListItem>Number of students: {numItems}</ListItem>
            <ListItem>
              Average score: {Math.round(scoreStats.averageScore * 100) / 100}
            </ListItem>
            <ListItem>
              Median score: {Math.round(scoreStats.medianScore * 100) / 100}
            </ListItem>
            <ListItem>
              Score standard deviation:{" "}
              {Math.round(scoreStats.stdScores * 100) / 100}
            </ListItem>
          </List>
        </Box>
      </Flex>
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
                  {scores.map((assignmentScore) => {
                    const linkURL =
                      "/assignmentData/" +
                      contentId +
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
                  data={data}
                  active={activatePreview}
                  itemNumber={itemNumber}
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
                      {answerList
                        .filter(
                          (answerObj) => answerObj.itemNumber === itemNumber,
                        )
                        .map((answerObj) => {
                          const key = `/assignmentAnswerResponses/${contentId}/${answerObj.itemNumber}/${answerObj.answerNumber}/${answerObj.answerId}`;
                          const linkURL = `/assignmentAnswerResponses/${contentId}/${
                            answerObj.itemNumber
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
                                {Math.round(answerObj.averageCredit * 1000) /
                                  10}
                                %
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
