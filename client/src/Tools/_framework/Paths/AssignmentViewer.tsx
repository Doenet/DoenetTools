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
import { ActivitySource, isActivitySource } from "../../../_utils/viewerTypes";
import { compileActivityFromContent } from "../../../_utils/activity";
import { ActivityViewer as DoenetActivityViewer } from "@doenet/assignment-viewer";

type ItemScore = { id: string; score: number; docId?: string };

function isItemScore(obj: unknown): obj is ItemScore {
  const typedObj = obj as ItemScore;
  return (
    typedObj !== null &&
    typeof typedObj === "object" &&
    typeof typedObj.id === "string" &&
    typeof typedObj.score === "number" &&
    (typedObj.docId === undefined || typeof typedObj.docId === "string")
  );
}

function createScoreByItem(obj: unknown) {
  if (Array.isArray(obj)) {
    const newScoreByItem: ItemScore[] = [];
    for (const item of obj) {
      if (isItemScore(item)) {
        newScoreByItem.push(item);
      }
    }

    return newScoreByItem;
  }

  return null;
}

function createScoreNumberByItem(obj: unknown) {
  if (Array.isArray(obj)) {
    const newScoreNumberByItem: number[] = [];
    for (const item of obj) {
      if (typeof item === "number") {
        newScoreNumberByItem.push(item);
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

  if (!data.assignmentFound) {
    return {
      assignmentFound: false,
      assignment: null,
      code: params.classCode,
    };
  }

  const initialScore = data.scoreData.loadedScore
    ? Number(data.scoreData.score)
    : 0;
  const initialScoreNumberByItem = data.scoreData.loadedScore
    ? createScoreNumberByItem(data.scoreData.scoreByItem)
    : null;

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
    };
  } else {
    const activityJsonFromRevision = assignment.activityJson
      ? JSON.parse(assignment.activityJson)
      : null;

    const activityJson = isActivitySource(activityJsonFromRevision)
      ? activityJsonFromRevision
      : compileActivityFromContent(assignment);

    return {
      assignmentFound: true,
      type: assignment.type,
      assignment,
      activityJson,
      code: params.classCode,
      initialScore,
      initialScoreNumberByItem,
    };
  }
}

export function AssignmentViewer() {
  const data = useLoaderData() as
    | {
        assignmentFound: false;
        code: string;
        assignment: null;
      }
    | ({
        assignmentFound: true;
        assignment: Content;
        code: string;
        initialScore: number;
        initialScoreNumberByItem: number[] | null;
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
      ));

  const { assignmentFound, assignment, code } = data;

  const assignmentName = data.assignmentFound ? data.assignment.name : "";

  const { user } = useOutletContext<SiteContext>();

  const navigate = useNavigate();
  const location = useLocation();

  const [attemptNumber, setAttemptNumber] = useState<number | null>(null);

  // create ref so that is updated inside callbacks
  const attemptNumberRef = useRef<number | null>(attemptNumber);
  attemptNumberRef.current = attemptNumber;

  const [scoresCurrentAttempt, setScoresCurrentAttempt] = useState<{
    scoreByItem: ItemScore[] | null;
    score: number;
  }>({ scoreByItem: null, score: 0 });

  // create ref so that is updated inside callbacks
  const scoresCurrentAttemptRef = useRef<{
    scoreByItem: ItemScore[] | null;
    score: number;
  }>(scoresCurrentAttempt);
  scoresCurrentAttemptRef.current = scoresCurrentAttempt;

  const [scores, setScores] = useState<{
    scoreNumberByItem: number[] | null;
    score: number;
  }>(
    data.assignmentFound
      ? {
          scoreNumberByItem: data.initialScoreNumberByItem,
          score: data.initialScore,
        }
      : { scoreNumberByItem: null, score: 0 },
  );

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
        const scoreByItem = createScoreByItem(event.data.scoreByItem);
        const score: number =
          typeof event.data.score === "number" ? event.data.score : 0;
        setScoresCurrentAttempt({ scoreByItem, score });

        if (event.data.newAttempt === true) {
          await createNewAttempt({
            newAttemptForItem: event.data.newAttemptForItem,
            scoreByItem,
            score,
            state: event.data.state,
          });
        } else {
          try {
            const { data } = await axios.post("/api/score/saveScoreAndState", {
              contentId: assignment.contentId,
              attemptNumber: attemptNumberRef.current,
              score,
              scoreByItem: scoreByItem?.map((s) => s.score) ?? null,
              state: JSON.stringify(event.data.state),
            });
            setScores({
              scoreNumberByItem: createScoreNumberByItem(data.scoreByItem),
              score: Number(data.score),
            });
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
      } else if (event.data.subject == "SPLICE.sendEvent") {
        const data = event.data.data;
        if (data.verb === "submitted") {
          recordSubmittedEvent({
            assignment: assignment,
            docId: event.data.docId ?? null,
            attemptNumber: attemptNumberRef.current,
            scores: scoresCurrentAttemptRef.current,
            data,
          });
        }
      } else if (event.data.subject == "SPLICE.reportScoreByItem") {
        const scoreByItem = createScoreByItem(event.data.scoreByItem);
        const score: number =
          typeof event.data.score === "number" ? event.data.score : 0;
        setScoresCurrentAttempt({ scoreByItem, score });
        if (scoreByItem && !scores.scoreNumberByItem) {
          setScores((was) => {
            const obj = { ...was };
            obj.scoreNumberByItem = scoreByItem.map((s) => s.score);
            return obj;
          });
        }
      } else if (event.data.subject == "SPLICE.getState") {
        try {
          const { data } = await axios.get("/api/score/loadState", {
            params: {
              contentId: assignment.contentId,
            },
          });

          if (data.loadedState && data.state !== null) {
            window.postMessage({
              subject: "SPLICE.getState.response",
              messageId: event.data.messageId,
              success: true,
              loadedState: true,
              state: JSON.parse(data.state),
            });
            setAttemptNumber(data.attemptNumber);
          } else {
            window.postMessage({
              subject: "SPLICE.getState.response",
              messageId: event.data.messageId,
              success: true,
              loadedState: false,
            });
            setAttemptNumber(data.attemptNumber ?? 1);
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
    viewer = (
      <Box>
        {assignment.assignmentInfo?.activityLevelAttempts ? (
          <Box>
            <Button
              marginLeft="20px"
              onClick={() => createNewAttempt({ score: 0, state: null })}
            >
              New attempt
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
    viewer = (
      <DoenetActivityViewer
        source={data.activityJson}
        requestedVariantIndex={1}
        userId={user.userId}
        linkSettings={{ viewUrl: "", editURL: "" }}
        paginate={assignment.type === "sequence" ? assignment.paginate : false}
        activityLevelAttempts={
          assignment.type === "sequence"
            ? assignment.assignmentInfo?.activityLevelAttempts
            : false
        }
        itemLevelAttempts={
          assignment.type === "sequence"
            ? assignment.assignmentInfo?.itemLevelAttempts
            : false
        }
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
    scoreByItem,
    score,
    state,
  }: {
    newAttemptForItem?: number;
    scoreByItem?: ItemScore[] | null;
    score: number;
    state: unknown;
  }) {
    if (!assignment) {
      return;
    }

    const { data } = await axios.post("/api/score/createNewAttempt", {
      contentId: assignment.contentId,
      itemNumber: newAttemptForItem,
      numItems: scoreByItem?.length,
      score,
      scoreByItem: scoreByItem?.map((s) => s.score) ?? null,
      state: state ? JSON.stringify(state) : null,
    });

    if (Number.isInteger(data.attemptNumber)) {
      setAttemptNumber(data.attemptNumber);
    }
    setScores({
      scoreNumberByItem: createScoreNumberByItem(data.scoreByItem),
      score: Number(data.score),
    });
  }
}

async function recordSubmittedEvent({
  assignment,
  attemptNumber,
  docId,
  scores,
  data,
}: {
  assignment: Content;
  attemptNumber: number | null;
  docId: string | null;
  scores: {
    scoreByItem: ItemScore[] | null;
    score: number;
  };
  data: {
    object: string;
    result: string;
    context: string;
  };
}) {
  const object = JSON.parse(data.object);
  const answerId = object.componentName;

  if (answerId) {
    const result = JSON.parse(data.result);
    const creditAchieved = result.creditAchieved;
    const response = JSON.stringify({
      response: result.response,
      componentTypes: result.componentTypes,
    });
    const context = JSON.parse(data.context);
    const itemNumber = context.item;
    const itemCreditAchieved = context.itemCreditAchieved;
    const docCreditAchieved = context.pageCreditAchieved;

    const questionNumber =
      (scores.scoreByItem?.findIndex((item) => item.docId === docId) ?? 0) + 1;

    await axios.post(`/api/assign/recordSubmittedEvent`, {
      contentId: assignment.contentId,
      attemptNumber,
      answerId,
      answerNumber: object.answerNumber,
      response,
      questionNumber,
      itemNumber,
      creditAchieved,
      itemCreditAchieved,
      docCreditAchieved,
    });
  }
}
