import React, { useEffect } from "react";
import { redirect, useLoaderData } from "react-router";
import { DoenetViewer } from "@doenet/doenetml-iframe";

import { Button, Box, Link } from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import { useFetcher } from "react-router-dom";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "view max") {
    return redirect("?withMaxScore=1");
  } else if (formObj._action == "view current") {
    return redirect("?withMaxScore=0");
  }

  return null;
}

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const withMaxScore = url.searchParams.get("withMaxScore") === "0" ? 0 : 1;

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
  const doenetmlVersion =
    assignment.assignmentDocuments[0].documentVersion.doenetmlVersion
      .fullVersion;
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
    doenetmlVersion,
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
    doenetmlVersion,
    withMaxScore,
    numStatesSaved,
    documentScores,
  } = useLoaderData();

  console.log({ doenetmlVersion });

  useEffect(() => {
    document.title = `${assignment?.name} - Doenet`;
  }, [assignment?.name]);

  const fetcher = useFetcher();

  useEffect(() => {
    let messageListener = async function (event) {
      console.log("message in AssignmentStudentData", event.data);
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
      <Box style={{ marginTop: 15, marginLeft: 15 }}>
        <Link
          href={`/assignmentData/${assignmentId}`}
          style={{
            color: "var(--mainBlue)",
          }}
        >
          {" "}
          &lt; Back to assignment data
        </Link>
      </Box>
      <Heading heading={user.name} subheading={assignment.name} />

      <Box style={{ margin: 20 }}>
        {numStatesSaved === 1 ? (
          <>
            <p>Best score achieved: {Math.round(score * 1000) / 1000}</p>
            <p>Best (and latest) work:</p>
          </>
        ) : withMaxScore ? (
          <>
            <p>
              Best score achieved:{" "}
              {Math.round(documentScores.maxScore * 1000) / 1000} (Latest work
              has a score of {Math.round(documentScores.latest * 1000) / 1000}.{" "}
              <Button
                colorScheme="blue"
                mt="8px"
                mr="12px"
                size="xs"
                onClick={() => {
                  fetcher.submit(
                    { _action: "view current" },
                    { method: "post" },
                  );
                }}
              >
                Switch to latest work
              </Button>
              )
            </p>
            <p></p>
            <p>Best work:</p>
          </>
        ) : (
          <>
            <p>
              Score achieved with latest work:{" "}
              {Math.round(documentScores.latest * 1000) / 1000} (Earlier work
              achieved the best score of{" "}
              {Math.round(documentScores.maxScore * 1000) / 1000}.{" "}
              <Button
                colorScheme="blue"
                mt="8px"
                mr="12px"
                size="xs"
                onClick={() => {
                  fetcher.submit({ _action: "view max" }, { method: "post" });
                }}
              >
                Switch to best work
              </Button>
              )
            </p>
            <p>Latest work:</p>
          </>
        )}
      </Box>
      <Box>
        {withMaxScore ? (
          <DoenetViewer
            key={"maxScore"}
            doenetML={doenetML}
            doenetmlVersion={doenetmlVersion}
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
          <DoenetViewer
            doenetML={doenetML}
            key={"currentScore"}
            doenetmlVersion={doenetmlVersion}
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
