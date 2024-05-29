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
  }
  return null;
}

export async function loader({ params }) {
  const { data: assignmentData } = await axios.get(
    `/api/getAssignmentStudentData/${params.assignmentId}/${params.userId}`,
  );

  let assignmentId = Number(params.assignmentId);
  let assignment = assignmentData.assignment;
  let userId = Number(params.userId);
  let user = assignmentData.user;
  let score = assignmentData.score;

  const doenetML = assignment.assignmentDocuments[0].documentVersion.content;

  return {
    assignmentId,
    assignment,
    userId,
    user,
    score,
    doenetML,
  };
}

export function AssignmentStudentData() {
  const { assignmentId, assignment, userId, user, score, doenetML } =
    useLoaderData();

  useEffect(() => {
    document.title = `${assignment.name} - Doenet`;
  }, [assignment.name]);

  const fetcher = useFetcher();

  useEffect(() => {
    addEventListener("message", async (event) => {
      if (event.data.subject == "SPLICE.getState") {
        try {
          let { data } = await axios.get("/api/loadState", {
            params: {
              assignmentId,
              docId: assignment.assignmentDocuments[0].docId,
              docVersionId: assignment.assignmentDocuments[0].docVersionId,
              userId,
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
    });
  }, []);

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

      <p>Maximum score achieved: {score}</p>

      <p>Current work:</p>
      <Box>
        <DoenetML
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
          attemptNumber={1}
          idsIncludeActivityId={false}
          paginate={true}
          linkSettings={{
            viewURL: "/activityViewer",
            editURL: "/publicEditor",
          }}
          apiURLs={{ postMessages: true }}
        />
      </Box>
    </>
  );
}
