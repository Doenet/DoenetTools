import React, { useEffect, useState } from "react";
import { DoenetViewer } from "@doenet/doenetml-iframe";

import {
  Box,
  Link as ChakraLink,
  Tooltip,
  Flex,
  Select,
  useDisclosure,
  Grid,
  GridItem,
  Spacer,
  Checkbox,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
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
  DoenetmlVersion,
} from "../../../_utils/types";
import { clearQueryParameter } from "../../../_utils/explore";
import { AnswerResponseDrawer } from "../ToolPanels/AnswerResponseDrawer";
import { contentTypeToName, getIconInfo } from "../../../_utils/activity";

export async function loader({ params, request }) {
  const url = new URL(request.url);

  const shuffledOrder =
    (url.searchParams.get("shuffledOrder") ?? "false") !== "false";
  const requestedItemNumber = url.searchParams.get("itemNumber");
  const requestedAttemptNumber = url.searchParams.get("attemptNumber");

  let search = `?shuffledOrder=${shuffledOrder}`;

  if (requestedItemNumber !== null) {
    search += `&itemNumber=${requestedItemNumber}`;
  }
  if (requestedAttemptNumber !== null) {
    search += `&attemptNumber=${requestedAttemptNumber}`;
  }

  const { data } = await axios.get(
    `/api/assign/getAssignmentResponseStudent/${params.contentId}/${params.studentUserId}${search}`,
  );

  const overall = data.overallScores;
  const content = data.content;

  const overallItemScores = overall.itemScores;
  const latestItemScores = overall.latestAttempt.itemScores;
  let itemNames = data.itemNames;
  const itemScores = data.itemScores;

  // Get itemNames, itemScores, and latestItemScores in the correct order.
  // TODO: this is now quite confusing with the different modes.
  // Find a better approach, presumably by just creating them in the desired order
  // (and explaining the desired order) in the first place
  if (shuffledOrder) {
    const itemNames2 = itemNames.map((name, i) => ({
      name,
      shuffledItemNumber:
        overallItemScores.findIndex((x) => x.itemNumber === i + 1) + 1,
    }));
    itemNames = itemNames2
      .sort((a, b) => a.shuffledItemNumber - b.shuffledItemNumber)
      .map((x) => x.name);
  } else {
    overallItemScores.sort((a, b) => a.itemNumber - b.itemNumber);
    latestItemScores.sort((a, b) => a.itemNumber - b.itemNumber);
    itemScores.sort((a, b) => a.itemNumber - b.itemNumber);
  }

  const overallScores = {
    score: overall.score,
    bestAttemptNumber: overall.bestAttemptNumber,
    itemScores: overallItemScores,
    numContentAttempts: overall.latestAttempt.attemptNumber,
    numItemAttempts: latestItemScores.map((x) => x.itemAttemptNumber),
  };

  const responseCounts: Record<string, number> = Object.fromEntries(
    data.responseCounts,
  );

  const doenetML = content.doenetML;
  const doenetmlVersion: DoenetmlVersion = content.doenetmlVersion;

  return {
    ...data,
    itemNames,
    itemScores,
    overallScores,
    responseCounts,
    shuffledOrder,
    content,
    doenetML,
    doenetmlVersion,
  };
}

export function AssignmentResponseStudent() {
  const {
    assignment,
    content,
    mode,
    user,
    itemAttemptState,
    attemptScores,
    overallScores,
    itemNames,
    itemScores,
    attemptNumber,
    allStudents,
    responseCounts,
    shuffledOrder,
    ...data
  } = useLoaderData() as {
    assignment: {
      name: string;
      type: ContentType;
      contentId: string;
      shuffledOrder: boolean;
    };
    content: Doc;
    mode: AssignmentMode;
    user: UserInfo;
    itemAttemptState: {
      state: string | null;
      score: number;
      variant: number;
      itemNumber?: number;
      shuffledItemNumber?: number;
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
    itemScores: { itemNumber: number; score: number }[];
    attemptNumber: number;
    allStudents: {
      userId: string;
      firstNames: string | null;
      lastNames: string;
    }[];
    responseCounts: Record<string, number>;
    shuffledOrder: boolean;
    doenetML: string;
    doenetmlVersion: DoenetmlVersion;
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
        if (itemAttemptState.state) {
          const state = JSON.parse(itemAttemptState.state);
          window.postMessage({
            subject: "SPLICE.getState.response",
            messageId: event.data.messageId,
            success: true,
            loadedState: true,
            state,
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
  }, [user.userId, itemAttemptState, attemptNumber]);

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
        itemName={
          itemAttemptState.itemNumber
            ? itemNames[itemAttemptState.itemNumber - 1]
            : null
        }
        assignment={assignment}
        student={user}
        answerId={responseAnswerId}
        itemNumber={itemAttemptState.itemNumber ?? null}
        shuffledOrder={shuffledOrder}
        contentAttemptNumber={contentAttemptNumber}
        itemAttemptNumber={itemAttemptNumber}
      />
    ) : null;

  const viewer = (
    <DoenetViewer
      doenetML={data.doenetML}
      key={`${user.userId}|${itemAttemptState.itemNumber ?? ""}|${attemptNumber}`}
      doenetmlVersion={data.doenetmlVersion.fullVersion}
      requestedVariantIndex={itemAttemptState.variant}
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
      linkSettings={{
        viewURL: "/activityViewer",
        editURL: "/codeViewer",
      }}
      showAnswerResponseMenu={true}
      answerResponseCounts={responseCounts}
    />
  );

  const contentTypeName = contentTypeToName[assignment.type];
  const { iconImage, iconColor } = getIconInfo(assignment.type);

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

  const itemSelect = (
    <Flex alignItems="center" marginLeft="10px">
      <label htmlFor="item-select" style={{ fontSize: "large" }}>
        Item:
      </label>{" "}
      <Select
        maxWidth="350px"
        marginLeft="5px"
        id="item-select"
        size="lg"
        value={
          shuffledOrder
            ? itemAttemptState.shuffledItemNumber
            : (itemAttemptState.itemNumber ?? 1)
        }
        onChange={(e) => {
          let newSearch = clearQueryParameter(
            "itemNumber",
            clearQueryParameter("attemptNumber", search),
          );
          if (newSearch === "") {
            newSearch = "?";
          } else {
            newSearch += "&";
          }
          newSearch += `itemNumber=${e.target.value}`;
          navigate(`.${newSearch}`, { replace: true });
        }}
      >
        {itemNames.map((name, i) => (
          <option value={i + 1} key={i}>
            {i + 1} (score: {Math.round(itemScores[i].score * 1000) / 10}):{" "}
            {name}
          </option>
        ))}
      </Select>
    </Flex>
  );

  return (
    <>
      {answerResponseDrawer}

      <Grid
        height="calc(100vh - 40px)" //40px header height
        templateAreas={`"header"
      "centerContent"
      `}
        templateRows="40px auto"
        position="relative"
        overflow="scroll"
      >
        <GridItem
          area="header"
          position="fixed"
          height="40px"
          background="doenet.canvas"
          width="100%"
          zIndex="500"
          alignContent="center"
        >
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
                {assignment.name} &mdash; Item Details
              </Flex>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="centerContent">
          <Box marginLeft="10px" marginTop="10px" marginRight="20px">
            <Flex alignItems="center" marginTop="20px" justifyContent="center">
              {allStudents.length > 1 ? (
                <Flex alignItems="center" marginLeft="10px">
                  <label htmlFor="student-select" style={{ fontSize: "large" }}>
                    Student:
                  </label>{" "}
                  <Select
                    maxWidth="350px"
                    marginLeft="5px"
                    id="student-select"
                    size="lg"
                    value={user.userId}
                    onChange={(e) => {
                      const newSearch = clearQueryParameter(
                        "attemptNumber",
                        search,
                      );
                      navigate(`../${e.target.value}${newSearch}`, {
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
              ) : null}
              {assignment.type !== "singleDoc" && mode === "formative"
                ? itemSelect
                : null}
              <Flex alignItems="center" marginLeft="10px">
                <label htmlFor="attempt-select" style={{ fontSize: "large" }}>
                  Attempt:
                </label>{" "}
                <Select
                  maxWidth="350px"
                  marginLeft="5px"
                  id="attempt-select"
                  size="lg"
                  value={attemptNumber}
                  onChange={(e) => {
                    let newSearch = clearQueryParameter(
                      "attemptNumber",
                      search,
                    );
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
                      {attempt.attemptNumber} (score:{" "}
                      {Math.round(attempt.score * 1000) / 10})
                    </option>
                  ))}
                </Select>
              </Flex>
              {assignment.type !== "singleDoc" && mode === "summative"
                ? itemSelect
                : null}
            </Flex>

            {assignment.shuffledOrder && assignment.type !== "singleDoc" ? (
              <Flex marginLeft="10px" marginTop="10px" alignItems="center">
                <Box>Original item number: {itemAttemptState.itemNumber}</Box>
                <Box marginLeft="10px">
                  Student's item number: {itemAttemptState.shuffledItemNumber}{" "}
                </Box>
                <Spacer />

                <Flex>
                  <Tooltip
                    label="Display items in the shuffled order seen by the student"
                    openDelay={500}
                    placement="bottom-end"
                  >
                    <label htmlFor="shuffle-checkbox">
                      Display in student order
                    </label>
                  </Tooltip>{" "}
                  <Checkbox
                    id="shuffle-checkbox"
                    marginLeft="5px"
                    isChecked={shuffledOrder}
                    onChange={() => {
                      let newSearch = clearQueryParameter(
                        "shuffledOrder",
                        clearQueryParameter("attemptNumber", search),
                      );
                      if (!shuffledOrder) {
                        if (newSearch === "") {
                          newSearch = "?";
                        } else {
                          newSearch += "&";
                        }
                        newSearch += `shuffledOrder`;
                      }
                      navigate(`.${newSearch}`, { replace: true });
                    }}
                  />
                </Flex>
              </Flex>
            ) : null}
          </Box>

          <Box marginTop="10px" borderTop="1px" borderColor="doenet.mediumGray">
            <Grid
              width="100%"
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
                maxWidth="850px"
                overflow="hidden"
              >
                <Box
                  minHeight="calc(100vh - 80px)"
                  background="var(--canvas)"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="doenet.mediumGray"
                  padding="20px 5px 50vh 5px"
                  flexGrow={1}
                  w="100%"
                  id="viewer-container"
                >
                  {viewer}
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}
