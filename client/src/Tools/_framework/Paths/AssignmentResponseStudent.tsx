import React, { ReactElement, useEffect, useState } from "react";
import { DoenetViewer } from "@doenet/doenetml-iframe";
import { ActivityViewer as DoenetActivityViewer } from "@doenet/assignment-viewer";

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
  Content,
  UserInfo,
  DoenetmlVersion,
} from "../../../_utils/types";
import { clearQueryParameter } from "../../../_utils/explore";
import { AnswerResponseDrawer } from "../ToolPanels/AnswerResponseDrawer";
import { ActivitySource, isActivitySource } from "../../../_utils/viewerTypes";
import {
  compileActivityFromContent,
  contentTypeToName,
  getIconInfo,
} from "../../../_utils/activity";

export async function loader({ params, request }) {
  const url = new URL(request.url);

  const requestedShuffledOrder =
    (url.searchParams.get("shuffledOrder") ?? "false") !== "false";
  const requestedItemNumber = url.searchParams.get("itemNumber");
  const requestedAttemptNumber = url.searchParams.get("attemptNumber");

  let search = `?shuffledOrder=${requestedShuffledOrder}`;

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

  const shuffledOrder =
    data.mode === "summative" ? true : requestedShuffledOrder;

  const itemScores = overall.itemScores;
  const latestItemScores = overall.latestAttempt.itemScores;
  let itemNames = data.itemNames;

  // Get itemNames, itemScores, and latestItemScores in the correct order.
  // TODO: this is now quite confusing with the different modes.
  // Find a better approach, presumably by just creating them in the desired order
  // (and explaining the desired order) in the first place
  if (data.mode === "summative") {
    const itemNames2 = itemNames.map((name, i) => ({
      name,
      shuffledItemNumber:
        data.thisAttemptState.items?.findIndex((x) => x.itemNumber === i + 1) +
        1,
    }));
    itemNames = itemNames2
      .sort((a, b) => a.shuffledItemNumber - b.shuffledItemNumber)
      .map((x) => x.name);
  } else if (shuffledOrder) {
    const itemNames2 = itemNames.map((name, i) => ({
      name,
      shuffledItemNumber:
        itemScores.findIndex((x) => x.itemNumber === i + 1) + 1,
    }));
    itemNames = itemNames2
      .sort((a, b) => a.shuffledItemNumber - b.shuffledItemNumber)
      .map((x) => x.name);
  } else {
    itemScores.sort((a, b) => a.itemNumber - b.itemNumber);
    latestItemScores.sort((a, b) => a.itemNumber - b.itemNumber);
  }

  const overallScores = {
    score: overall.score,
    bestAttemptNumber: overall.bestAttemptNumber,
    itemScores,
    numContentAttempts: overall.latestAttempt.attemptNumber,
    numItemAttempts: latestItemScores.map((x) => x.itemAttemptNumber),
  };

  let responseCounts: Record<string, number> = {};
  const responseCountsByItem: Record<string, number>[] = [];
  if (data.mode === "formative" || data.assignment.type === "singleDoc") {
    responseCounts = Object.fromEntries(
      data.responseCounts.map(([_a, b, c]) => [b, c]),
    );
  } else {
    // TODO: put data.responseCounts in a better format so this isn't so opaque
    let lastNum = null;
    let lastCounts = {};
    for (const item of data.responseCounts) {
      if (item[0] !== lastNum) {
        if (lastNum !== null) {
          responseCountsByItem[lastNum - 1] = lastCounts;
        }
        lastCounts = {};
        lastNum = item[0];
      }
      Object.assign(lastCounts, { [item[1]]: item[2] });
    }
    if (lastNum !== null) {
      responseCountsByItem[lastNum - 1] = lastCounts;
    }
  }

  const baseData = {
    ...data,
    itemNames,
    overallScores,
    responseCounts,
    responseCountsByItem,
    shuffledOrder,
    content,
  };

  if (content.type === "singleDoc") {
    const doenetML = content.doenetML;
    const doenetmlVersion: DoenetmlVersion = content.doenetmlVersion;

    return {
      ...baseData,
      type: content.type,
      doenetML,
      doenetmlVersion,
    };
  } else {
    const activityJsonPrelim = content.activityJson
      ? JSON.parse(content.activityJson)
      : null;

    const activityJson = isActivitySource(activityJsonPrelim)
      ? activityJsonPrelim
      : compileActivityFromContent(content);

    return {
      ...baseData,
      type: content.type,
      activityJson,
    };
  }
}

export function AssignmentResponseStudent() {
  const {
    assignment,
    content,
    mode,
    user,
    thisAttemptState,
    attemptScores,
    overallScores,
    itemNames,
    attemptNumber,
    allStudents,
    responseCounts,
    responseCountsByItem,
    shuffledOrder,
    ...data
  } = useLoaderData() as {
    assignment: {
      name: string;
      type: ContentType;
      contentId: string;
      shuffledOrder: boolean;
    };
    content: Content;
    mode: AssignmentMode;
    user: UserInfo;
    thisAttemptState: {
      state: string | null;
      score: number;
      variant: number;
      itemNumber?: number;
      shuffledItemNumber?: number;
      items?: {
        score: number;
        state: string | null;
        itemNumber: number;
        shuffledItemNumber: number;
        itemAttemptNumber: number;
        variant: number;
        docId: string;
      }[];
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
    attemptNumber: number;
    allStudents: {
      userId: string;
      firstNames: string | null;
      lastNames: string;
    }[];
    responseCounts: Record<string, number>;
    responseCountsByItem: Record<string, number>[];
    shuffledOrder: boolean;
  } & (
    | { type: "singleDoc"; doenetML: string; doenetmlVersion: DoenetmlVersion }
    | { type: "sequence" | "select"; activityJson: ActivitySource }
  );

  useEffect(() => {
    document.title = `${assignment?.name} - Doenet`;
  }, [assignment?.name]);

  const { search } = useLocation();
  const navigate = useNavigate();

  const [responseAnswerId, setResponseAnswerId] = useState<string | null>(null);
  const [responseItem, setResponseItem] = useState(
    thisAttemptState.itemNumber ?? null,
  );

  useEffect(() => {
    const messageListener = async function (event) {
      if (event.data.subject == "SPLICE.getState") {
        if (thisAttemptState.state) {
          const state = JSON.parse(thisAttemptState.state);

          if (thisAttemptState.items && thisAttemptState.items.length > 0) {
            // add back in state from items
            state.itemAttemptNumbers = thisAttemptState.items.map(
              (x) => x.itemAttemptNumber,
            );
            state.doenetStates = thisAttemptState.items.map((x) =>
              x.state ? JSON.parse(x.state) : null,
            );
          }
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
          const [id, suffix] = event.data.docId.split("|");
          if (
            thisAttemptState.items &&
            thisAttemptState.itemNumber === undefined
          ) {
            const matchedItem = thisAttemptState.items.find(
              (v) =>
                v.docId === id &&
                (suffix === undefined || v.variant === Number(suffix)),
            );
            if (matchedItem) {
              setResponseItem(
                shuffledOrder
                  ? matchedItem.shuffledItemNumber
                  : matchedItem.itemNumber,
              );
            }
          } else {
            setResponseItem(thisAttemptState.itemNumber ?? null);
          }
          setResponseAnswerId(event.data.answerId);
          answerResponsesOnOpen();
        }
      }
    };

    addEventListener("message", messageListener);

    return () => {
      removeEventListener("message", messageListener);
    };
  }, [user.userId, thisAttemptState, attemptNumber]);

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
        itemName={responseItem ? itemNames[responseItem - 1] : null}
        assignment={assignment}
        student={user}
        answerId={responseAnswerId}
        itemNumber={responseItem}
        shuffledOrder={shuffledOrder}
        contentAttemptNumber={contentAttemptNumber}
        itemAttemptNumber={itemAttemptNumber}
      />
    ) : null;

  let viewer: ReactElement;

  if (data.type === "singleDoc") {
    viewer = (
      <DoenetViewer
        doenetML={data.doenetML}
        key={`${user.userId}|${thisAttemptState.itemNumber ?? ""}|${attemptNumber}`}
        doenetmlVersion={data.doenetmlVersion.fullVersion}
        requestedVariantIndex={thisAttemptState.variant}
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
  } else {
    viewer = (
      <DoenetActivityViewer
        source={data.activityJson}
        activityId={assignment.contentId}
        requestedVariantIndex={thisAttemptState.variant}
        userId={user.userId}
        linkSettings={{ viewUrl: "", editURL: "" }}
        paginate={content.type === "sequence" ? content.paginate : false}
        showTitle={false}
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
        showAnswerResponseMenu={true}
        answerResponseCountsByItem={responseCountsByItem}
      />
    );
  }

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
              {assignment.type !== "singleDoc" && mode === "formative" ? (
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
                        ? thisAttemptState.shuffledItemNumber
                        : (thisAttemptState.itemNumber ?? 1)
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
                        {i + 1}. {name}
                      </option>
                    ))}
                  </Select>
                </Flex>
              ) : null}
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
                      Attempt {attempt.attemptNumber} (score:{" "}
                      {Math.round(attempt.score * 100) / 100})
                    </option>
                  ))}
                </Select>
              </Flex>
            </Flex>

            {assignment.shuffledOrder && mode === "formative" ? (
              <Flex marginLeft="10px" marginTop="10px" alignItems="center">
                <Box>Original item number: {thisAttemptState.itemNumber}</Box>
                <Box marginLeft="10px">
                  Student's item number: {thisAttemptState.shuffledItemNumber}{" "}
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
