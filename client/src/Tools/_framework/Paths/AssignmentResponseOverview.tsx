import React, { ReactElement, useEffect, useState } from "react";
import { ActionFunctionArgs, useLoaderData } from "react-router";
// @ts-expect-error math-expression doesn't have types
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
  Icon,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "../../../Widgets/Heading";
import "../../../_utils/score-table.css";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from "recharts";
import { Link as ReactRouterLink, useNavigate } from "react-router";
import { createNameNoCurateTag, lastNameFirst } from "../../../_utils/names";
import {
  AssignmentMode,
  Content,
  DoenetmlVersion,
  UserInfo,
} from "../../../_utils/types";
// @ts-expect-error assignment-viewer doesn't publish types, see https://github.com/Doenet/assignment-viewer/issues/20
import { isActivitySource } from "@doenet/assignment-viewer";
import {
  compileActivityFromContent,
  contentTypeToName,
  getIconInfo,
} from "../../../_utils/activity";
import { BiDownArrowAlt, BiUpArrowAlt } from "react-icons/bi";
import { ActivitySource } from "../../../_utils/viewerTypes";

type ScoreItem = {
  score: number;
  bestAttemptNumber: number;
  itemScores?:
    | { itemNumber: number; score: number; itemAttemptNumber: number }[]
    | null;
  numContentAttempts: number;
  numItemAttempts: number[] | null;
  user: UserInfo;
};

export async function loader({ params, request }: ActionFunctionArgs) {
  const { data } = await axios.get(
    `/api/assign/getAssignmentResponseOverview/${params.contentId}`,
  );

  const url = new URL(request.url);
  let sort = (url.searchParams.get("sort") ?? "name").trim();
  let sortDir: "asc" | "desc" = "asc";
  if (sort.slice(-1) === "-") {
    sort = sort.slice(0, -1);
    sortDir = "desc";
  }

  if (!(Number.isInteger(Number(sort)) || ["name", "total"].includes(sort))) {
    sort = "name";
  }

  function sortFunction(a: ScoreItem, b: ScoreItem) {
    let res;

    if (sort === "name") {
      const nameA = lastNameFirst(a.user).toLowerCase();
      const nameB = lastNameFirst(b.user).toLowerCase();
      if (nameA < nameB) {
        res = -1;
      } else if (nameA > nameB) {
        res = 1;
      } else {
        res = 0;
      }
    } else if (sort === "total") {
      res = a.score - b.score;
    } else {
      const idx = Number(sort) - 1;
      res = (a.itemScores?.[idx].score ?? 0) - (b.itemScores?.[idx].score ?? 0);
    }
    if (sortDir === "desc") {
      return -res;
    } else {
      return res;
    }
  }

  const contentId = params.contentId;

  const assignment = data.content as Content;
  const mode = data.scoreSummary.mode;
  const scores = data.scoreSummary.scores
    .map((s: any) => ({
      score: s.score,
      bestAttemptNumber: s.bestAttemptNumber,
      itemScores: s.itemScores
        ? s.itemScores.sort((a: any, b: any) => a.itemNumber - b.itemNumber)
        : null,
      numContentAttempts: s.latestAttempt?.attemptNumber ?? 1,
      numItemAttempts:
        s.latestAttempt?.itemScores
          .sort((a: any, b: any) => a.itemNumber - b.itemNumber)
          .map((x: any) => x.itemAttemptNumber) ?? null,
      user: s.user,
    }))
    .sort(sortFunction) as ScoreItem[];

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
    sort,
    sortDir,
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

    const itemNames = data.itemNames;

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
    scores: ScoreItem[];
    numItems: number;
    numStudents: number;
    scoreStats: {
      averageScore: number;
      medianScore: number;
      stdScores: number;
    };
    mode: AssignmentMode;
    sort: string;
    sortDir: "asc" | "desc";
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
    sort,
    sortDir,
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

  const sortArrow = (
    <Tooltip
      label="Reverse sort direction"
      openDelay={500}
      placement="bottom-end"
    >
      <Text>
        <Icon as={sortDir === "asc" ? BiDownArrowAlt : BiUpArrowAlt} />
      </Text>
    </Tooltip>
  );

  const sortLink = (text: string) =>
    `.?sort=${text}${sort === `${text}` && sortDir === "asc" ? "-" : ""}`;

  let scoresChart: ReactElement;
  const nameWidth = 150;
  const totalWidth = 70;

  if (data.type !== "singleDoc" && numItems > 1) {
    const itemNames: string[] = data.itemNames;

    const itemWidth = 50;

    scoresChart = (
      <TableContainer>
        <Table
          size="sm"
          className="score-table"
          layout="fixed"
          width={`${nameWidth + itemWidth * numItems + totalWidth}px`}
        >
          <Thead>
            <Tr className="no-bottom-padding">
              <Th
                textTransform={"none"}
                fontSize="large"
                rowSpan={2}
                alignContent="end"
                width={`${nameWidth}px`}
              >
                <Box>
                  <ChakraLink
                    as={ReactRouterLink}
                    to={sortLink("name")}
                    replace={true}
                    _hover={{
                      textDecoration: "none",
                      color: "gray.400",
                    }}
                  >
                    <HStack gap={0}>
                      <Text height="21px">Name</Text>
                      {sort === "name" ? sortArrow : null}
                    </HStack>
                  </ChakraLink>
                </Box>
              </Th>

              <Th
                textTransform={"none"}
                fontSize="large"
                justifyItems="center"
                rowSpan={2}
                alignContent="end"
                width={`${totalWidth}px`}
              >
                <Box width="64px" justifyItems="center">
                  <Box>
                    <ChakraLink
                      as={ReactRouterLink}
                      to={sortLink("total")}
                      replace={true}
                      _hover={{
                        textDecoration: "none",
                        color: "gray.400",
                      }}
                    >
                      <HStack gap={0}>
                        <Text height="21px">Total</Text>
                        {sort === "total" ? sortArrow : null}
                      </HStack>
                    </ChakraLink>
                  </Box>
                </Box>
              </Th>
              <Th
                textTransform={"none"}
                fontSize="large"
                colSpan={itemNames.length}
                borderBottom="none"
              >
                Item
              </Th>
            </Tr>
            <Tr className="no-bottom-padding">
              {itemNames.map((name, i) => {
                return (
                  <Th
                    textTransform={"none"}
                    fontSize="large"
                    key={i}
                    maxWidth="100px"
                    justifyItems="center"
                  >
                    <Box>
                      <ChakraLink
                        as={ReactRouterLink}
                        to={sortLink(`${i + 1}`)}
                        replace={true}
                        _hover={{
                          textDecoration: "none",
                          color: "gray.400",
                        }}
                      >
                        <HStack gap={0}>
                          <Tooltip label={`${i + 1}. ${name}`} openDelay={500}>
                            <Text height="21px">{i + 1}</Text>
                          </Tooltip>
                          {sort === `${i + 1}` ? sortArrow : null}
                        </HStack>
                      </ChakraLink>
                    </Box>
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {scores.map((assignmentScore) => {
              const linkURL =
                "/assignmentData/" +
                contentId +
                "/" +
                assignmentScore.user.userId;
              const studentName = createNameNoCurateTag(assignmentScore.user);
              const bestAttemptNumber = assignmentScore.bestAttemptNumber;
              return (
                <Tr key={`user${assignmentScore.user.userId}`}>
                  <Td>
                    <HStack>
                      <ChakraLink
                        as={ReactRouterLink}
                        to={linkURL}
                        textDecoration="underline"
                      >
                        {studentName}
                      </ChakraLink>
                    </HStack>
                  </Td>
                  <Td justifyItems="center">
                    <Text>
                      <Tooltip
                        label={`Total for ${studentName}`}
                        openDelay={500}
                      >
                        <ChakraLink
                          as={ReactRouterLink}
                          to={linkURL}
                          textDecoration="underline"
                        >
                          &nbsp;
                          {Math.round(assignmentScore.score * 1000) / 10}
                          &nbsp;
                        </ChakraLink>
                      </Tooltip>
                    </Text>
                  </Td>
                  {assignmentScore.itemScores?.map((item, i) => {
                    const attemptNumberForScore =
                      mode === "summative"
                        ? bestAttemptNumber
                        : item.itemAttemptNumber;
                    return (
                      <Td key={i} justifyItems="center">
                        <Text>
                          <Tooltip
                            label={`Item ${i + 1} for ${studentName}`}
                            openDelay={500}
                          >
                            <ChakraLink
                              as={ReactRouterLink}
                              to={`${linkURL}?itemNumber=${i + 1}&attemptNumber=${attemptNumberForScore}`}
                              textDecoration="underline"
                            >
                              &nbsp;
                              {Math.round(item.score * 1000) / 10}
                              &nbsp;
                            </ChakraLink>
                          </Tooltip>
                        </Text>
                      </Td>
                    );
                  })}
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
        <Table
          size="sm"
          className="score-table"
          layout="fixed"
          width={`${nameWidth + totalWidth}px`}
        >
          <Thead>
            <Tr>
              <Th
                textTransform={"none"}
                fontSize="large"
                rowSpan={2}
                alignContent="end"
                width={`${nameWidth}px`}
              >
                <Box>
                  <ChakraLink
                    as={ReactRouterLink}
                    to={sortLink("name")}
                    replace={true}
                    _hover={{
                      textDecoration: "none",
                      color: "gray.400",
                    }}
                  >
                    <HStack gap={0}>
                      <Text height="21px">Name</Text>
                      {sort === "name" ? sortArrow : null}
                    </HStack>
                  </ChakraLink>
                </Box>
              </Th>
              <Th
                textTransform={"none"}
                fontSize="large"
                justifyItems="center"
                rowSpan={2}
                alignContent="end"
                width={`${totalWidth}px`}
              >
                <Box width="64px" justifyItems="center">
                  <Box>
                    <ChakraLink
                      as={ReactRouterLink}
                      to={sortLink("total")}
                      replace={true}
                      _hover={{
                        textDecoration: "none",
                        color: "gray.400",
                      }}
                    >
                      <HStack gap={0}>
                        <Text height="21px">Score</Text>
                        {sort === "total" ? sortArrow : null}
                      </HStack>
                    </ChakraLink>
                  </Box>
                </Box>
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
              const studentName = createNameNoCurateTag(assignmentScore.user);
              return (
                <Tr key={`user${assignmentScore.user.userId}`}>
                  <Td>
                    <ChakraLink
                      as={ReactRouterLink}
                      to={linkURL}
                      textDecoration="underline"
                    >
                      {studentName}
                    </ChakraLink>
                  </Td>
                  <Td justifyItems="center">
                    <Text>
                      <Tooltip
                        label={`Total for ${studentName}`}
                        openDelay={500}
                      >
                        <ChakraLink
                          as={ReactRouterLink}
                          to={`${linkURL}?itemNumber=1`}
                          textDecoration="underline"
                        >
                          &nbsp;
                          {Math.round(assignmentScore.score * 1000) / 10}
                          &nbsp;
                        </ChakraLink>
                      </Tooltip>
                    </Text>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }

  const contentTypeName = contentTypeToName[data.type];
  const { iconImage, iconColor } = getIconInfo(data.type);

  const typeIcon = (
    <Tooltip label={contentTypeName}>
      <Box>
        <Icon
          as={iconImage}
          color={iconColor}
          boxSizing="content-box"
          width="24px"
          height="24px"
          paddingRight="10px"
          verticalAlign="middle"
          aria-label={contentTypeName}
        />
      </Box>
    </Tooltip>
  );

  return (
    <>
      <Grid
        height="40px"
        background="doenet.canvas"
        width="100%"
        borderBottom={"1px solid"}
        borderColor="doenet.mediumGray"
        templateAreas={`"leftControls label rightControls"`}
        templateColumns={{
          base: "82px calc(100% - 197px) 115px",
          sm: "87px calc(100% - 217px) 120px",
          md: "1fr 350px 1fr",
          lg: "1fr 450px 1fr",
        }}
        alignContent="center"
      >
        <GridItem area="leftControls" marginLeft="15px">
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
        </GridItem>
        <GridItem area="label">
          <Flex justifyContent="center" alignItems="center">
            {typeIcon}
            <Text noOfLines={1}>{assignment.name}</Text> &mdash; Data (
            {assignment.assignmentInfo?.classCode})
          </Flex>
        </GridItem>
      </Grid>
      <Tabs>
        <TabList>
          <Tab>Scores</Tab>
          <Tab>Statistics</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{scoresChart}</TabPanel>
          <TabPanel>
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
                  Average score:{" "}
                  {Math.round(scoreStats.averageScore * 100) / 100}
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
