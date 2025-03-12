import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useLoaderData, useOutletContext } from "react-router";

import { DoenetViewer } from "@doenet/doenetml-iframe";

import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import {
  EnterClassCode,
  action as enterClassCodeAction,
} from "./EnterClassCode";
import { ChangeName, action as changeNameAction } from "./ChangeName";
import { SiteContext } from "./SiteHeader";
import { Content, DoenetmlVersion } from "../../../_utils/types";
import {
  ActivitySource,
  isActivitySource,
  isReportStateMessage,
} from "../../../_utils/viewerTypes";
import { compileActivityFromContent } from "../../../_utils/activity";
import { ActivityViewer as DoenetActivityViewer } from "@doenet/assignment-viewer";

type ItemScore = {
  id: string;
  score: number;
  docId?: string;
  shuffledOrder: number;
};

function isItemScore(obj: unknown): obj is ItemScore {
  const typedObj = obj as ItemScore;
  return (
    typedObj !== null &&
    typeof typedObj === "object" &&
    typeof typedObj.id === "string" &&
    typeof typedObj.score === "number" &&
    (typedObj.docId === undefined || typeof typedObj.docId === "string") &&
    typeof typedObj.shuffledOrder === "number"
  );
}

function createItemScores(obj: unknown) {
  if (Array.isArray(obj)) {
    const newItemScores: ItemScore[] = [];
    for (const item of obj) {
      if (isItemScore(item)) {
        newItemScores.push(item);
      }
    }

    return newItemScores;
  }

  return null;
}

function createScoreNumberByItem(obj: unknown) {
  if (Array.isArray(obj)) {
    const newScoreNumberByItem: number[] = [];
    for (const item of obj) {
      if (typeof item === "object" && typeof item.score === "number") {
        newScoreNumberByItem.push(item.score);
      }
    }

    return newScoreNumberByItem;
  }

  return null;
}

export async function action({ params, request }) {
  const formData = await request.formData();

  const codeResults = await enterClassCodeAction({ params, request, formData });
  if (codeResults !== null) {
    return codeResults;
  }

  const changeNameResults = await changeNameAction({
    params,
    request,
    formData,
  });
  if (changeNameResults !== null) {
    return changeNameResults;
  }

  return null;
}

export async function loader({ params }) {
  // TODO: need to select variant for each student (just once)

  const { data } = await axios.get(
    `/api/info/getAssignmentViewerDataFromCode/${params.classCode}`,
  );

  console.log(data);

  let initialScore: number = 0;
  let initialScoreNumberByItem: number[] | null = null;
  let latestAttemptScore: number = 0;
  let latestAttemptScoreNumberByItem: number[] | null = null;
  let itemAttemptNumbers: number[] = [];
  let attemptNumber = 1;

  if (!data.assignmentFound) {
    return {
      assignmentFound: false,
      assignment: null,
      code: params.classCode,
      initialScore,
      initialScoreNumberByItem,
      latestAttemptScore,
      latestAttemptScoreNumberByItem,
      itemAttemptNumbers,
      attemptNumber,
    };
  }

  if (data.scoreData.loadedState) {
    initialScore = Number(data.scoreData.score);
    initialScoreNumberByItem = createScoreNumberByItem(
      data.scoreData.itemScores,
    );
    latestAttemptScore = data.scoreData.latestAttempt.score;
    latestAttemptScoreNumberByItem = createScoreNumberByItem(
      data.scoreData.latestAttempt.itemScores,
    );
    itemAttemptNumbers = data.scoreData.latestAttempt.itemScores.map(
      (x) => x.itemAttemptNumber,
    );
    attemptNumber = data.score.latestATtempt.attemptNumber;
  }

  const assignment = data.assignment;

  if (assignment.type === "singleDoc") {
    const doenetML = assignment.doenetML;
    const doenetmlVersion: DoenetmlVersion = assignment.doenetmlVersion;

    return {
      assignmentFound: true,
      type: assignment.type,
      assignment,
      doenetML,
      doenetmlVersion,
      code: params.classCode,
      initialScore,
      initialScoreNumberByItem,
      latestAttemptScore,
      latestAttemptScoreNumberByItem,
      itemAttemptNumbers,
      attemptNumber,
    };
  } else {
    const activityJsonPrelim = assignment.activityJson
      ? JSON.parse(assignment.activityJson)
      : null;

    const activityJson = isActivitySource(activityJsonPrelim)
      ? activityJsonPrelim
      : compileActivityFromContent(assignment);

    return {
      assignmentFound: true,
      type: assignment.type,
      assignment,
      activityJson,
      code: params.classCode,
      initialScore,
      initialScoreNumberByItem,
      latestAttemptScore,
      latestAttemptScoreNumberByItem,
      itemAttemptNumbers,
      attemptNumber,
    };
  }
}

export function AssignmentViewer() {
  const data = useLoaderData() as {
    initialScore: number;
    initialScoreNumberByItem: number[] | null;
    latestAttemptScore: number;
    latestAttemptScoreNumberByItem: number[] | null;
    itemAttemptNumbers: number[];
    attemptNumber: number;
    code: string;
  } & (
    | {
        assignmentFound: false;
        assignment: null;
      }
    | ({
        assignmentFound: true;
        assignment: Content;
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
      ))
  );

  console.log(data);
  const { assignmentFound, assignment, code } = data;

  const assignmentName = data.assignmentFound ? data.assignment.name : "";

  const { user } = useOutletContext<SiteContext>();

  const navigate = useNavigate();
  const location = useLocation();

  const [attemptNumber, setAttemptNumber] = useState<number>(
    data.attemptNumber,
  );
  const [itemAttemptNumbers, setItemAttemptNumbers] = useState<number[]>(
    data.itemAttemptNumbers,
  );

  // create refs so that is updated inside callbacks
  const attemptNumberRef = useRef<number | null>(attemptNumber);
  attemptNumberRef.current = attemptNumber;
  const itemAttemptNumbersRef = useRef<number[] | null>(itemAttemptNumbers);
  itemAttemptNumbersRef.current = itemAttemptNumbers;

  const [scoresCurrentAttempt, setScoresCurrentAttempt] = useState<{
    scoreNumberByItem: number[] | null;
    score: number;
  }>({
    scoreNumberByItem: data.latestAttemptScoreNumberByItem,
    score: data.latestAttemptScore,
  });

  // used to look up item order in callbacks
  const currentItemScores = useRef<ItemScore[] | null>(null);

  const [scores, setScores] = useState<{
    scoreNumberByItem: number[] | null;
    score: number;
  }>({
    scoreNumberByItem: data.initialScoreNumberByItem,
    score: data.initialScore,
  });

  console.log({
    scores,
    scoresCurrentAttempt,
    attemptNumber,
    itemAttemptNumbers,
  });

  useEffect(() => {
    if (assignmentFound) {
      document.title = `${assignmentName} - Doenet`;
    } else {
      document.title = `Enter class code - Doenet`;
    }
  }, [assignmentFound, assignmentName]);

  useEffect(() => {
    if (!assignment) {
      return;
    }

    const messageListener = async function (event) {
      if (event.data.subject == "SPLICE.reportScoreAndState") {
        console.log("record score and state", event.data);

        const data = event.data;

        if (isReportStateMessage(data)) {
          if (data.activityId !== assignment.contentId) {
            return;
          }
          const itemScores = data.itemScores;

          currentItemScores.current = itemScores;

          const score = data.score;

          if (data.newAttempt === true) {
            await createNewAttempt({
              newAttemptForItem: data.newAttemptForItem,
              shuffledItemOrder: itemScores.map((s) => s.shuffledOrder),
            });
          } else {
            const { doenetStates, itemAttemptNumbers, ...otherState } =
              data.state;

            let item: {
              shuffledItemNumber: number | undefined;
              itemAttemptNumber: number;
              shuffledItemOrder: number[];
              score: number;
              state: any;
            } | null = null;
            if (
              data.itemUpdated !== undefined &&
              data.newDoenetStateIdx !== undefined
            ) {
              const shuffledItemOrder = itemScores.map((s) => s.shuffledOrder);
              const shuffledItemNumber = data.itemUpdated;
              const itemAttemptNumber =
                itemAttemptNumbers[data.itemUpdated - 1];
              const score = itemScores.find(
                (s) => s.shuffledOrder === shuffledItemNumber,
              )?.score;
              const state = doenetStates[data.newDoenetStateIdx];

              if (score !== undefined) {
                item = {
                  shuffledItemNumber,
                  itemAttemptNumber,
                  shuffledItemOrder,
                  score,
                  state: JSON.stringify(state),
                };
              }
            }

            try {
              const { data: saveData } = await axios.post(
                "/api/score/saveScoreAndState",
                {
                  contentId: assignment.contentId,
                  attemptNumber: otherState.activityState.attemptNumber,
                  score: item ? null : score,
                  code,
                  state: JSON.stringify(otherState),
                  item: item ?? undefined,
                },
              );

              setScoreInfo(saveData);
            } catch (e) {
              if (
                e.status === 400 &&
                e.response?.data?.error === "Invalid request" &&
                e.response.data.details.includes("non-maximal")
              ) {
                alert(
                  "Unable to save data due to attempt number changing. Reload page to update to the current attempt.",
                );
              } else {
                alert("Unable to save data");
              }
            }
          }
        } else {
          // should be single doc
          if (data.docId !== assignment.contentId) {
            return;
          }

          const { data: saveData } = await axios.post(
            "/api/score/saveScoreAndState",
            {
              contentId: assignment.contentId,
              attemptNumber: data.state.attemptNumber,
              score: data.score,
              code,
              state: JSON.stringify(data.state),
            },
          );

          setScoreInfo(saveData);
        }
      } else if (event.data.subject == "SPLICE.sendEvent") {
        const data = event.data.data;
        if (data.verb === "submitted") {
          recordSubmittedEvent({
            assignment: assignment,
            docId: event.data.docId ?? null,
            contentAttemptNumber: attemptNumberRef.current,
            itemAttemptNumbers: itemAttemptNumbersRef.current,
            itemScores: currentItemScores.current,
            data,
          });
        }
      } else if (event.data.subject == "SPLICE.reportScoreByItem") {
        console.log("report score by item", event.data);
        const itemScores = createItemScores(event.data.itemScores);

        currentItemScores.current = itemScores;

        if (itemScores) {
          if (scores.score === 0 && scores.scoreNumberByItem === null) {
            setScores({
              score: 0,
              scoreNumberByItem: itemScores.map(() => 0),
            });
          }
          if (
            scoresCurrentAttempt.score === 0 &&
            scoresCurrentAttempt.scoreNumberByItem === null
          ) {
            setScoresCurrentAttempt({
              score: 0,
              scoreNumberByItem: itemScores.map(() => 0),
            });
          }
          if (itemAttemptNumbers.length === 0) {
            setItemAttemptNumbers(itemScores.map(() => 1));
          }
        }
      } else if (event.data.subject == "SPLICE.getState") {
        try {
          const { data } = await axios.get("/api/score/loadState", {
            params: {
              contentId: assignment.contentId,
            },
          });

          if (data.loadedState && data.state !== null) {
            const state = JSON.parse(data.state);

            if (data.items.length > 0) {
              // add back in state from items
              state.itemAttemptNumbers = data.items.map(
                (x) => x.itemAttemptNumber,
              );
              state.doenetStates = data.items.map((x) => JSON.parse(x.state));
            }

            console.log("loaded state", state);
            window.postMessage({
              subject: "SPLICE.getState.response",
              messageId: event.data.messageId,
              success: true,
              loadedState: true,
              state,
            });
            setAttemptNumber(data.attemptNumber);
          } else {
            window.postMessage({
              subject: "SPLICE.getState.response",
              messageId: event.data.messageId,
              success: true,
              loadedState: false,
            });
          }
        } catch (e) {
          console.error("error loading state", e);
          window.postMessage({
            subject: "SPLICE.getState.response",
            messageId: event.data.messageId,
            success: false,
            message: "Server error loading page state.",
          });
        }
      }
    };

    addEventListener("message", messageListener);

    return () => {
      removeEventListener("message", messageListener);
    };
  }, [assignment]);

  if (!data.assignmentFound || !assignment) {
    return <EnterClassCode />;
  }

  if (!user?.lastNames) {
    return <ChangeName hideHomeButton />;
  }

  let viewer: ReactElement;
  if (data.type === "singleDoc") {
    const maxAttempts = assignment.assignmentInfo?.maxAttempts ?? 0;
    const attemptsLeft =
      maxAttempts === 0 ? Infinity : maxAttempts - attemptNumber;

    viewer = (
      <Box>
        {assignment.assignmentInfo?.maxAttempts !== 1 ? (
          <Box>
            <Button
              marginLeft="20px"
              onClick={() => createNewAttempt({})}
              isDisabled={attemptsLeft < 1}
            >
              New attempt {maxAttempts > 0 ? `(${attemptsLeft} left)` : null}
            </Button>
          </Box>
        ) : null}
        <DoenetViewer
          doenetML={data.doenetML}
          doenetmlVersion={data.doenetmlVersion.fullVersion}
          docId={assignment.contentId}
          userId={user.userId}
          flags={{
            showCorrectness: true,
            solutionDisplayMode: "button",
            showFeedback: true,
            showHints: true,
            autoSubmit: false,
            allowLoadState: true,
            allowSaveState: true,
            allowLocalState: false,
            allowSaveEvents: true,
          }}
          attemptNumber={attemptNumber ?? undefined}
          location={location}
          navigate={navigate}
          linkSettings={{
            viewURL: "/activityViewer",
            editURL: "/codeViewer",
          }}
        />
      </Box>
    );
  } else {
    console.log(
      assignment.assignmentInfo?.mode === "summative",
      assignment.assignmentInfo?.mode === "formative",
      assignment.assignmentInfo?.maxAttempts,
    );
    viewer = (
      <DoenetActivityViewer
        source={data.activityJson}
        activityId={assignment.contentId}
        requestedVariantIndex={1}
        userId={user.userId}
        linkSettings={{ viewUrl: "", editURL: "" }}
        paginate={assignment.type === "sequence" ? assignment.paginate : false}
        activityLevelAttempts={assignment.assignmentInfo?.mode === "summative"}
        itemLevelAttempts={assignment.assignmentInfo?.mode === "formative"}
        maxAttemptsAllowed={assignment.assignmentInfo?.maxAttempts}
        showTitle={false}
        flags={{
          showCorrectness: true,
          solutionDisplayMode: "button",
          showFeedback: true,
          showHints: true,
          autoSubmit: false,
          allowLoadState: true,
          allowSaveState: true,
          allowLocalState: false,
          allowSaveSubmissions: true,
          allowSaveEvents: true,
        }}
      />
    );
  }

  return (
    <>
      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header"
      "centerContent"
      `}
        templateRows="40px auto"
        position="relative"
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
            templateAreas={`"leftControls label rightControls"`}
            templateColumns="1fr 400px 1fr"
            width="100%"
          >
            <GridItem area="leftControls"></GridItem>
            <GridItem
              area="label"
              justifyContent="center"
              display="flex"
              fontSize={20}
            >
              {data.assignment.name} ({code})
            </GridItem>
            <GridItem
              area="rightControls"
              display="flex"
              justifyContent="flex-end"
            ></GridItem>
          </Grid>
        </GridItem>

        <GridItem area="centerContent">
          <Grid
            width="100%"
            height="calc(100vh - 80px)"
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
                h="calc(100vh - 80px)"
                background="var(--canvas)"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="doenet.mediumGray"
                padding="20px 5px 20px 5px"
                flexGrow={1}
                overflow="scroll"
                w="100%"
                id="viewer-container"
              >
                {viewer}
              </Box>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );

  async function createNewAttempt({
    newAttemptForItem,
    shuffledItemOrder,
  }: {
    newAttemptForItem?: number;
    shuffledItemOrder?: number[] | null;
  }) {
    if (!assignment) {
      return;
    }

    const { data } = await axios.post("/api/score/createNewAttempt", {
      contentId: assignment.contentId,
      itemNumber: newAttemptForItem,
      shuffledItemOrder,
      code,
    });

    setScoreInfo(data);
  }

  function setScoreInfo(scoreData: {
    loadedScore: boolean;
    score: number;
    itemScores?: {
      score: number;
      itemNumber: number;
      shuffledItemNumber: number;
    }[];
    latestAttempt: {
      attemptNumber: number;
      score: number;
      itemScores: {
        score: number;
        itemAttemptNumber: number;
        itemNumber: number;
        shuffledItemNumber: number;
      }[];
    };
  }) {
    console.log("set score info", scoreData);
    setScores({
      scoreNumberByItem: createScoreNumberByItem(scoreData.itemScores),
      score: Number(scoreData.score),
    });

    setScoresCurrentAttempt({
      scoreNumberByItem: createScoreNumberByItem(
        scoreData.latestAttempt.itemScores,
      ),
      score: Number(scoreData.latestAttempt.score),
    });

    if (Number.isInteger(scoreData.latestAttempt.attemptNumber)) {
      setAttemptNumber(scoreData.latestAttempt.attemptNumber);
    }

    if (Array.isArray(scoreData.latestAttempt.itemScores)) {
      setItemAttemptNumbers(
        scoreData.latestAttempt.itemScores.map((v) => v.itemAttemptNumber),
      );
    }
  }
}

async function recordSubmittedEvent({
  assignment,
  contentAttemptNumber,
  itemAttemptNumbers,
  docId,
  itemScores,

  data,
}: {
  assignment: Content;
  contentAttemptNumber: number | null;
  itemAttemptNumbers: number[] | null;
  docId: string | null;
  itemScores: ItemScore[] | null;
  data: {
    object: string;
    result: string;
    context: string;
  };
}) {
  console.log("record submitted", data);

  const object = JSON.parse(data.object);
  const answerId = object.componentName;

  if (answerId) {
    const result = JSON.parse(data.result);
    const answerCreditAchieved = result.creditAchieved;
    const response = JSON.stringify({
      response: result.response,
      componentTypes: result.componentTypes,
    });
    const context = JSON.parse(data.context);
    const componentNumber = context.componentNumber;
    const componentCreditAchieved = context.componentCreditAchieved;
    const itemCreditAchieved = context.docCreditAchieved;

    console.log(docId, itemScores);

    const itemIdx = itemScores?.findIndex((v) => v.docId === docId);
    console.log(docId, itemScores, itemIdx);
    const itemNumber = (itemIdx ?? 0) + 1;
    const shuffledItemNumber = itemScores?.[itemNumber - 1].shuffledOrder ?? 1;
    const itemAttemptNumber = itemAttemptNumbers
      ? itemAttemptNumbers[itemIdx ?? 0]
      : null;

    await axios.post(`/api/assign/recordSubmittedEvent`, {
      contentId: assignment.contentId,
      contentAttemptNumber,
      itemAttemptNumber,
      answerId,
      answerNumber: object.answerNumber,
      response,
      itemNumber,
      shuffledItemNumber,
      componentNumber,
      answerCreditAchieved,
      componentCreditAchieved,
      itemCreditAchieved,
    });
  }
}
