import React, { useEffect, useState } from "react";
import { DoenetViewer } from "@doenet/doenetml-iframe";

import {
  Box,
  Link as ChakraLink,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Tooltip,
  Flex,
  Select,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading } from "../../../Widgets/Heading";
import {
  Link as ReactRouterLink,
  useNavigate,
  useLoaderData,
  useLocation,
} from "react-router";
import { createFullName } from "../../../_utils/names";
import {
  AssignmentMode,
  ContentType,
  Doc,
  UserInfo,
} from "../../../_utils/types";
import { clearQueryParameter } from "../../../_utils/explore";
import { AnswerResponseDrawer } from "../ToolPanels/AnswerResponseDrawer";

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const requestedItemNumber = url.searchParams.get("itemNumber");
  const requestedAttemptNumber = url.searchParams.get("attemptNumber");
  //   const shuffledOrder =
  //     (url.searchParams.get("shuffledOrder") ?? "false") !== "false";

  let search = "";

  if (requestedItemNumber !== null) {
    search = `?itemNumber=${requestedItemNumber}`;
  }
  if (requestedAttemptNumber !== null) {
    if (search) {
      search += "&";
    } else {
      search = "?";
    }
    search += `attemptNumber=${requestedAttemptNumber}`;
  }

  const { data } = await axios.get(
    `/api/assign/getAssignmentResponseStudent/${params.contentId}/${params.studentUserId}${search}`,
  );

  const overall = data.overallScores;

  const overallScores = {
    score: overall.score,
    bestAttemptNumber: overall.bestAttemptNumber,
    itemScores: overall.itemScores
      ? overall.itemScores.sort((a, b) => a.itemNumber - b.itemNumber)
      : null,
    numContentAttempts: overall.latestAttempt?.attemptNumber ?? 1,
    numItemAttempts:
      overall.latestAttempt?.itemScores.map((x) => x.itemAttemptNumber) ?? null,
  };

  const responseCounts = Object.fromEntries(data.responseCounts);

  return {
    ...data,
    overallScores,
    responseCounts,
  };
}

export function AssignmentResponseStudent() {
  const {
    assignment,
    doc,
    mode,
    user,
    thisAttemptState,
    attemptScores,
    overallScores,
    itemNames,
    itemNumber,
    attemptNumber,
    allStudents,
    responseCounts,
  } = useLoaderData() as {
    assignment: { name: string; type: ContentType; contentId: string };
    doc: Doc;
    mode: AssignmentMode;
    user: UserInfo;
    thisAttemptState: {
      state: null | string;
      score: number;
      docId: string;
    };
    attemptScores: { attemptNumber: number; score: number }[];
    overallScores: {
      score: number;
      bestAttemptNumber: number;
      itemScores: { itemNumber: number; score: number }[] | null;
      numContentAttempts: number;
      numItemAttempts: number[] | null;
    };
    itemNames: string[];
    itemNumber: number;
    attemptNumber: number;
    allStudents: {
      userId: string;
      firstNames: string | null;
      lastNames: string;
    }[];
    responseCounts: Record<string, number>;
  };

  useEffect(() => {
    document.title = `${assignment?.name} - Doenet`;
  }, [assignment?.name]);

  const { search } = useLocation();
  const navigate = useNavigate();

  const [responseAnswerId, setResponseAnswerId] = useState<string | null>(null);

  useEffect(() => {
    const messageListener = async function (event) {
      if (event.data.subject == "SPLICE.getState") {
        if (thisAttemptState.state) {
          window.postMessage({
            subject: "SPLICE.getState.response",
            messageId: event.data.messageId,
            success: true,
            loadedState: true,
            state: JSON.parse(thisAttemptState.state),
          });
        } else {
          window.postMessage({
            subject: "SPLICE.getState.response",
            messageId: event.data.messageId,
            success: true,
            loadedState: false,
          });
        }
      } else if (event.data.subject === "requestAnswerResponses") {
        console.log("requested responses:", event.data);
        if (typeof event.data.answerId === "string") {
          setResponseAnswerId(event.data.answerId);
          answerResponsesOnOpen();
        }
      }
    };

    addEventListener("message", messageListener);

    return () => {
      removeEventListener("message", messageListener);
    };
  }, [user.userId, thisAttemptState, itemNumber, attemptNumber]);

  const {
    isOpen: answerResponsesAreOpen,
    onOpen: answerResponsesOnOpen,
    onClose: answerResponsesOnClose,
  } = useDisclosure();

  const [contentAttemptNumber, itemAttemptNumber] =
    assignment.type === "singleDoc"
      ? [attemptNumber, null]
      : mode === "formative"
        ? [1, attemptNumber]
        : [attemptNumber, 1];

  const answerResponseDrawer =
    typeof responseAnswerId === "string" ? (
      <AnswerResponseDrawer
        isOpen={answerResponsesAreOpen}
        onClose={answerResponsesOnClose}
        doc={doc}
        assignment={assignment}
        student={user}
        answerId={responseAnswerId}
        itemNumber={itemNumber}
        contentAttemptNumber={contentAttemptNumber}
        itemAttemptNumber={itemAttemptNumber}
      />
    ) : null;

  const numAttempts = overallScores.numContentAttempts;
  const studentName = createFullName(user);

  return (
    <>
      {answerResponseDrawer}
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
      <DoenetHeading heading={assignment.name} />
      <DoenetHeading subheading={createFullName(user)} />

      {allStudents.length > 1 ? (
        <Box marginLeft="20px" marginTop="20px">
          <Flex alignItems="center">
            <label htmlFor="student-select">Select student:</label>{" "}
            <Select
              width="200px"
              marginLeft="5px"
              id="student-select"
              size="sm"
              value={user.userId}
              onChange={(e) => {
                navigate(`../${e.target.value}`, {
                  replace: true,
                  relative: "path",
                });
              }}
            >
              {allStudents.map((user) => (
                <option value={user.userId} key={user.userId}>
                  {createFullName(user)}
                </option>
              ))}
            </Select>
          </Flex>
        </Box>
      ) : null}

      <Box marginLeft="20px" marginTop="20px">
        <Heading as="h3" size="md">
          {assignment.type === "singleDoc" ? (
            <>Total score: {Math.round(overallScores.score * 100) / 100}</>
          ) : (
            <>Score summary</>
          )}
        </Heading>

        {assignment.type === "singleDoc" ? (
          <Text marginTop="10px">
            (based on {numAttempts} attempt{numAttempts === 1 ? "" : "s"})
          </Text>
        ) : (
          <TableContainer marginTop="10px">
            <Table>
              <Thead>
                <Tr>
                  {itemNames.map((name, i) => {
                    return (
                      <Th
                        textTransform={"none"}
                        fontSize="medium"
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

                  <Th textTransform={"none"} fontSize="medium">
                    <strong>Total</strong>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  {overallScores.itemScores?.map((item, i) => {
                    const numItemAttempts =
                      overallScores.numItemAttempts?.[i] ?? 1;
                    return (
                      <Td key={i}>
                        <ChakraLink
                          as={ReactRouterLink}
                          to={`.?itemNumber=${i + 1}`}
                          textDecoration="underline"
                          replace={true}
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
                  <Td>
                    {Math.round(overallScores.score * 100) / 100}{" "}
                    {mode === "summative" && numAttempts > 1 ? (
                      <Tooltip
                        label={`${studentName} took ${numAttempts} attempts on the assignment`}
                      >
                        ({numAttempts}x)
                      </Tooltip>
                    ) : null}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Box marginLeft="20px" marginTop="40px">
        <Heading as="h3" size="md">
          Item details
        </Heading>
        <Flex alignItems="center" marginTop="20px" justifyContent="center">
          {assignment.type !== "singleDoc" ? (
            <Flex alignItems="center">
              <label htmlFor="item-select" style={{ fontSize: "large" }}>
                Select item:
              </label>{" "}
              <Select
                width="250px"
                marginLeft="5px"
                id="item-select"
                size="lg"
                value={itemNumber}
                onChange={(e) => {
                  const newSearch = `?itemNumber=${e.target.value}`;
                  navigate(`.${newSearch}`, { replace: true });
                }}
              >
                {itemNames.map((name, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}. {name}
                  </option>
                ))}
              </Select>
            </Flex>
          ) : null}
          <Flex alignItems="center" marginLeft="10px">
            <label htmlFor="attempt-select" style={{ fontSize: "large" }}>
              Select attempt:
            </label>{" "}
            <Select
              width="250px"
              marginLeft="5px"
              id="attempt-select"
              size="lg"
              value={attemptNumber}
              onChange={(e) => {
                let newSearch = clearQueryParameter("attemptNumber", search);
                if (newSearch === "") {
                  newSearch = "?";
                } else {
                  newSearch += "&";
                }
                newSearch += `attemptNumber=${e.target.value}`;
                navigate(`.${newSearch}`, { replace: true });
              }}
            >
              {attemptScores.map((attempt) => (
                <option
                  value={attempt.attemptNumber}
                  key={attempt.attemptNumber}
                >
                  Attempt {attempt.attemptNumber} (score:{" "}
                  {Math.round(attempt.score * 100) / 100})
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Box>

      <Box marginTop="20px" borderTop="4px" borderColor="doenet.mediumGray">
        <Grid
          width="100%"
          //   height="calc(100vh - 80px)"
          background="doenet.lightBlue"
          templateAreas={`"leftGutter viewer rightGutter"`}
          templateColumns={`1fr minmax(340px,850px) 1fr`}
          overflow="hidden"
        >
          <GridItem
            area="leftGutter"
            background="doenet.lightBlue"
            width="100%"
            paddingTop="10px"
            alignSelf="start"
          />
          <GridItem
            area="rightGutter"
            background="doenet.lightBlue"
            width="100%"
            paddingTop="10px"
            alignSelf="start"
          />
          <GridItem
            area="viewer"
            width="100%"
            placeSelf="center"
            minHeight="100%"
            maxWidth="850px"
            overflow="hidden"
          >
            <Box
              //   h="calc(100vh - 80px)"
              background="var(--canvas)"
              borderWidth="1px"
              borderStyle="solid"
              borderColor="doenet.mediumGray"
              padding="20px 5px 50vh 5px"
              flexGrow={1}
              //   overflow="scroll"
              w="100%"
              id="viewer-container"
            >
              <DoenetViewer
                doenetML={doc.doenetML}
                key={`${user.userId}|${itemNumber}|${attemptNumber}`}
                doenetmlVersion={doc.doenetmlVersion.fullVersion}
                flags={{
                  showCorrectness: true,
                  solutionDisplayMode: "button",
                  showFeedback: true,
                  showHints: true,
                  autoSubmit: false,
                  readOnly: true,
                  allowLoadState: true,
                  allowSaveState: false,
                  allowLocalState: false,
                  allowSaveEvents: false,
                }}
                forceDisable={true}
                //   forceShowCorrectness={true}
                forceShowSolution={true}
                forceUnsuppressCheckwork={true}
                attemptNumber={1}
                linkSettings={{
                  viewURL: "/activityViewer",
                  editURL: "/codeViewer",
                }}
                showAnswerResponseMenu={true}
                answerResponseCounts={responseCounts}
              />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
