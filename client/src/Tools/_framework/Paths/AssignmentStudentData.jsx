import React, { useEffect } from "react";
import { redirect, useLoaderData } from "react-router";
import { DoenetML } from "@doenet/doenetml";

import { Button, Box } from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import { useFetcher } from "react-router-dom";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "back to data") {
    return redirect(`/assignmentData/${params.assignmentId}`);
  } else if (formObj._action == "view max") {
    return redirect("?withMaxScore=1");
  } else if (formObj._action == "view current") {
    return redirect("?withMaxScore=0");
  }

  return null;
}

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const withMaxScore = url.searchParams.get("withMaxScore") === "1" ? 1 : 0;

  const { data: assignmentData } = await axios.get(
    `/api/getAssignmentStudentData/${params.assignmentId}/${params.userId}`,
  );

  let assignmentId = Number(params.assignmentId);
  let assignment = assignmentData.assignment;
  let userId = Number(params.userId);
  let user = assignmentData.user;
  let score = assignmentData.score;

  // TODO: deal with case where don't have exactly 1 document
  const doenetML = assignment.assignmentDocuments[0].documentVersion.content;
  const numStatesSaved = assignmentData.documentScores.length;
  let documentScores = { latest: assignmentData.documentScores[0].score };
  if (numStatesSaved === 2) {
    documentScores.maxScore = assignmentData.documentScores[1].score;
  }

  return {
    assignmentId,
    assignment,
    userId,
    user,
    score,
    doenetML,
    withMaxScore,
    numStatesSaved,
    documentScores,
  };
}

export function AssignmentStudentData() {
  const {
    assignmentId,
    assignment,
    userId,
    user,
    score,
    doenetML,
    withMaxScore,
    numStatesSaved,
    documentScores,
  } = useLoaderData();

  useEffect(() => {
    document.title = `${assignment?.name} - Doenet`;
  }, [assignment?.name]);

  const fetcher = useFetcher();

  useEffect(() => {
    let messageListener = async function (event) {
      if (event.data.subject == "SPLICE.getState") {
        try {
          let { data } = await axios.get("/api/loadState", {
            params: {
              assignmentId,
              docId: assignment.assignmentDocuments[0].docId,
              docVersionId: assignment.assignmentDocuments[0].docVersionId,
              userId,
              withMaxScore,
            },
          });

          if (data.state) {
            window.postMessage({
              subject: "SPLICE.getState.response",
              messageId: event.data.messageId,
              success: true,
              loadedState: true,
              state: data.state,
            });
          } else {
            window.postMessage({
              subject: "SPLICE.getState.response",
              messageId: event.data.messageId,
              success: true,
              loadedState: false,
            });
          }
        } catch (e) {
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
  }, [withMaxScore]);

  return (
    <>
      <Heading heading={user.name} subheading={assignment.name} />

      <Button
        type="submit"
        colorScheme="blue"
        mt="8px"
        mr="12px"
        size="xs"
        onClick={() => {
          fetcher.submit({ _action: "back to data" }, { method: "post" });
        }}
      >
        Some UI element for going back to assignment data
      </Button>

      {numStatesSaved === 1 ? (
        <>
          <p>Score achieved: {score}</p>
          <p>Latest work:</p>
        </>
      ) : withMaxScore ? (
        <>
          <p>Maximum score achieved: {documentScores.maxScore}</p>
          <p>
            <Button
              colorScheme="blue"
              mt="8px"
              mr="12px"
              size="xs"
              onClick={() => {
                fetcher.submit({ _action: "view current" }, { method: "post" });
              }}
            >
              Show current work
            </Button>
          </p>
          <p>Work obtaining maximum score:</p>
        </>
      ) : (
        <>
          <p>Latest score achieved: {documentScores.latest}</p>
          <p>
            <Button
              colorScheme="blue"
              mt="8px"
              mr="12px"
              size="xs"
              onClick={() => {
                fetcher.submit({ _action: "view max" }, { method: "post" });
              }}
            >
              Show work achieving maximum score
            </Button>
          </p>
          <p>Latest work:</p>
        </>
      )}

      <Box>
        {withMaxScore ? (
          <DoenetML
            key={"maxScore"}
            doenetML={doenetML}
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
              allowSaveSubmissions: false,
              allowSaveEvents: false,
            }}
            forceDisable={true}
            //   forceShowCorrectness={true}
            forceShowSolution={true}
            forceUnsuppressCheckwork={true}
            attemptNumber={1}
            idsIncludeActivityId={false}
            paginate={true}
            linkSettings={{
              viewURL: "/activityViewer",
              editURL: "/publicEditor",
            }}
            apiURLs={{ postMessages: true }}
          />
        ) : (
          <DoenetML
            doenetML={doenetML}
            key={"currentScore"}
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
              allowSaveSubmissions: false,
              allowSaveEvents: false,
            }}
            forceDisable={true}
            //   forceShowCorrectness={true}
            forceShowSolution={true}
            forceUnsuppressCheckwork={true}
            attemptNumber={1}
            idsIncludeActivityId={false}
            paginate={true}
            linkSettings={{
              viewURL: "/activityViewer",
              editURL: "/publicEditor",
            }}
            apiURLs={{ postMessages: true }}
          />
        )}
      </Box>
    </>
  );
}
