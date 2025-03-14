import React, { ReactElement, useEffect, useState } from "react";
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
  Box,
  Link as ChakraLink,
  Flex,
  List,
  ListItem,
  HStack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "../../../Widgets/Heading";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from "recharts";
import { Link as ReactRouterLink, useNavigate } from "react-router";
import { createFullName } from "../../../_utils/names";
import {
  AssignmentMode,
  Content,
  DoenetmlVersion,
  UserInfo,
} from "../../../_utils/types";
import { isActivitySource } from "@doenet/assignment-viewer";
import { compileActivityFromContent } from "../../../_utils/activity";
import { ActivitySource } from "../../../_utils/viewerTypes";

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/assign/getAssignmentResponseOverview/${params.contentId}`,
  );

  const contentId = params.contentId;

  const assignment = data.content as Content;
  const mode = data.scoreSummary.mode;
  const scores = data.scoreSummary.scores.map((s) => ({
    score: s.score,
    bestAttemptNumber: s.bestAttemptNumber,
    itemScores: s.itemScores
      ? s.itemScores.sort((a, b) => a.itemNumber - b.itemNumber)
      : null,
    numContentAttempts: s.latestAttempt?.attemptNumber ?? 1,
    numItemAttempts:
      s.latestAttempt?.itemScores.map((x) => x.itemAttemptNumber) ?? null,
    user: s.user,
  })) as {
    score: number;
    bestAttemptNumber: number;
    itemScores: { itemNumber: number; score: number }[] | null;
    numContentAttempts: number;
    numItemAttempts: number[] | null;
    user: UserInfo;
  }[];

  const numItems = scores[0]?.itemScores?.length ?? 1;

  const numStudents = scores.length;
  const scoreNumbers = scores.map((s) => s.score);

  const averageScore = numStudents > 0 ? me.math.mean(...scoreNumbers) : 0;
  const medianScore = numStudents > 0 ? me.math.median(...scoreNumbers) : 0;
  const stdScores = numStudents > 0 ? me.math.std(...scoreNumbers) : 0;

  const baseData = {
    assignment,
    scores,
    numItems,
    numStudents,
    scoreStats: {
      averageScore,
      medianScore,
      stdScores,
    },
    mode,
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
  } else if (assignment.type !== "folder") {
    const activityJsonPrelim = assignment.activityJson
      ? JSON.parse(assignment.activityJson)
      : null;

    const activityJson = isActivitySource(activityJsonPrelim)
      ? activityJsonPrelim
      : compileActivityFromContent(assignment);

    const itemNames: string[] = [];

    if (assignment.type === "sequence") {
      for (const child of assignment.children) {
        if (child.type === "singleDoc") {
          itemNames.push(child.name);
        } else if (child.type === "select") {
          if (child.numToSelect === 1) {
            itemNames.push(child.name);
          } else {
            for (let i = 0; i < child.numToSelect; i++) {
              itemNames.push(`${child.name} (${i})`);
            }
          }
        }
      }
    }

    return {
      type: assignment.type,
      ...baseData,
      activityJson,
      itemNames,
    };
  }
}

export function AssignmentData() {
  const data = useLoaderData() as {
    contentId: string;
    assignment: Content;
    scores: {
      score: number;
      bestAttemptNumber: number;
      itemScores?:
        | { itemNumber: number; score: number; itemAttemptNumber: number }[]
        | null;
      numContentAttempts: number;
      numItemAttempts: number[] | null;
      user: UserInfo;
    }[];
    numItems: number;
    numStudents: number;
    scoreStats: {
      averageScore: number;
      medianScore: number;
      stdScores: number;
    };
    mode: AssignmentMode;
  } & (
    | {
        type: "singleDoc";
        doenetML: string;
        doenetmlVersion: DoenetmlVersion;
      }
    | {
        type: "select" | "sequence";
        activityJson: ActivitySource;
        itemNames: string[];
      }
  );

  const {
    contentId,
    assignment,
    scores,
    numItems,
    numStudents,
    scoreStats,
    mode,
  } = data;

  useEffect(() => {
    document.title = `${assignment.name} - Doenet`;
  }, [assignment.name]);

  const navigate = useNavigate();

  const [scoreData, setScoreData] = useState<
    { count: number; score: number }[]
  >([]);

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

  let scoresChart: ReactElement;

  if (data.type !== "singleDoc" && numItems > 1) {
    const itemNames = data.itemNames;

    scoresChart = (
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th textTransform={"none"} fontSize="large">
                Name
              </Th>
              {itemNames.map((name, i) => {
                return (
                  <Th
                    textTransform={"none"}
                    fontSize="large"
                    key={i}
                    maxWidth="100px"
                  >
                    <Tooltip label={`${i + 1}. ${name}`} openDelay={500}>
                      <Text noOfLines={1}>
                        {i + 1}. {name}
                      </Text>
                    </Tooltip>
                  </Th>
                );
              })}
              <Th textTransform={"none"} fontSize="large">
                Total
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
              const numAttempts = assignmentScore.numContentAttempts;
              const studentName = createFullName(assignmentScore.user);
              const bestAttemptNumber = assignmentScore.bestAttemptNumber;
              const nameLinkUrl =
                linkURL +
                (mode === "summative"
                  ? `?attemptNumber=${bestAttemptNumber}`
                  : "");
              return (
                <Tr key={`user${assignmentScore.user.userId}`}>
                  <Td>
                    <HStack>
                      <ChakraLink
                        as={ReactRouterLink}
                        to={nameLinkUrl}
                        textDecoration="underline"
                      >
                        {studentName}
                      </ChakraLink>
                      {mode === "summative" && numAttempts > 1 ? (
                        <Tooltip
                          label={`${studentName} took ${numAttempts} attempts on the assignment`}
                        >
                          ({numAttempts}x)
                        </Tooltip>
                      ) : null}
                    </HStack>
                  </Td>
                  {assignmentScore.itemScores?.map((item, i) => {
                    const numItemAttempts =
                      assignmentScore.numItemAttempts?.[i] ?? 1;
                    const attemptNumberForScore =
                      mode === "summative"
                        ? bestAttemptNumber
                        : item.itemAttemptNumber;
                    return (
                      <Td key={i}>
                        <ChakraLink
                          as={ReactRouterLink}
                          to={`${linkURL}?itemNumber=${i + 1}&attemptNumber=${attemptNumberForScore}`}
                          textDecoration="underline"
                        >
                          &nbsp;
                          {Math.round(item.score * 100) / 100}
                          &nbsp;
                          {mode === "formative" && numItemAttempts > 1 ? (
                            <Tooltip
                              label={`${studentName} took ${numItemAttempts} attempts on item: ${itemNames[i]}`}
                            >
                              ({numItemAttempts}x)
                            </Tooltip>
                          ) : null}
                        </ChakraLink>
                      </Td>
                    );
                  })}
                  <Td>{Math.round(assignmentScore.score * 100) / 100}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    );
  } else {
    scoresChart = (
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
                <Tr key={`user${assignmentScore.user.userId}`}>
                  <Td>
                    <ChakraLink
                      as={ReactRouterLink}
                      to={linkURL}
                      textDecoration="underline"
                    >
                      {createFullName(assignmentScore.user)}
                    </ChakraLink>
                  </Td>
                  <Td>{Math.round(assignmentScore.score * 100) / 100}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }

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
            <ListItem>Number of students: {numStudents}</ListItem>
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
      <Box marginTop="20px">
        <Heading subheading="Best scores per student" />

        {scoresChart}
      </Box>
    </>
  );
}
