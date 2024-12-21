import React, { useEffect } from "react";
import { redirect, replace, useLoaderData } from "react-router";
import { DoenetViewer } from "@doenet/doenetml-iframe";

import { Button, Box, Link as ChakraLink } from "@chakra-ui/react";
import axios from "axios";
import { DoenetHeading as Heading } from "./Community";
import {
  Link as ReactRouterLink,
  useFetcher,
  useNavigate,
} from "react-router-dom";
import { createFullName } from "../../../_utils/names";
import { UserInfo } from "../../../_utils/types";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  // Note: currently not using these actions but using navigate directly to avoid adding to browser history

  if (formObj._action == "view max") {
    return redirect("?withMaxScore=1");
  } else if (formObj._action == "view current") {
    return redirect("?withMaxScore=0");
  }

  return null;
}

export async function loader({ params, request, isAssignedData = false }) {
  const url = new URL(request.url);
  const withMaxScore = url.searchParams.get("withMaxScore") === "0" ? 0 : 1;

  const { data: assignmentData } = await axios.get(
    `/api/getAssignmentStudentData/${params.activityId}/${params.userId ?? ""}`,
  );

  const assignment = assignmentData.activity;
  const user = assignmentData.user;
  const score = assignmentData.score;

  // TODO: deal with case where don't have exactly 1 document
  const doenetML = assignment.documents[0].source;
  const doenetmlVersion = assignment.documents[0].doenetmlVersion.fullVersion;
  const numStatesSaved = assignmentData.documentScores.length;
  let documentScores: { latest: number; maxScore?: number } = {
    latest: assignmentData.documentScores[0].score,
  };
  if (numStatesSaved === 2) {
    documentScores.maxScore = assignmentData.documentScores[1].score;
  }

  return {
    assignment,
    user,
    score,
    doenetML,
    doenetmlVersion,
    withMaxScore,
    numStatesSaved,
    documentScores,
    isAssignedData,
  };
}

export async function assignedAssignmentDataloader({ params, request }) {
  return await loader({ params, request, isAssignedData: true });
}

export function AssignmentStudentData() {
  const {
    assignment,
    user,
    score,
    doenetML,
    doenetmlVersion,
    withMaxScore,
    numStatesSaved,
    documentScores,
    isAssignedData,
  } = useLoaderData() as {
    assignment: {
      name: string;
      id: string;
      documents: ({
        docId: string;
        source: string;
        doenetmlVersion: {
          fullVersion: string;
        };
        versionNum: number;
      } | null)[];
    };
    user: UserInfo;
    score: number;
    doenetML: string;
    doenetmlVersion: string;
    withMaxScore: boolean;
    numStatesSaved: number;
    documentScores: { latest: number; maxScore?: number };
    isAssignedData: boolean;
  };

  useEffect(() => {
    document.title = `${assignment?.name} - Doenet`;
  }, [assignment?.name]);

  const fetcher = useFetcher();
  let navigate = useNavigate();

  useEffect(() => {
    let messageListener = async function (event) {
      if (event.data.subject == "SPLICE.getState") {
        try {
          let { data } = await axios.get("/api/loadState", {
            params: {
              activityId: assignment.id,
              docId: assignment.documents[0]!.docId,
              docVersionNum: assignment.documents[0]!.versionNum,
              userId: user.userId,
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
      <Heading heading={createFullName(user)} />
      <Heading subheading={assignment.name} />

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
              {Math.round(documentScores.maxScore! * 1000) / 1000} (Latest work
              has a score of {Math.round(documentScores.latest * 1000) / 1000}.{" "}
              <Button
                colorScheme="blue"
                mt="8px"
                mr="12px"
                size="xs"
                onClick={() => {
                  // Using navigate rather than action so doesn't add to history.
                  // TODO: is there a way to use action and not add to history?
                  navigate("?withMaxScore=0", { replace: true });
                  // fetcher.submit(
                  //   { _action: "view current" },
                  //   { method: "post" },
                  // );
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
              {Math.round(documentScores.maxScore! * 1000) / 1000}.{" "}
              <Button
                colorScheme="blue"
                mt="8px"
                mr="12px"
                size="xs"
                onClick={() => {
                  // Using navigate rather than action so doesn't add to history.
                  // TODO: is there a way to use action and not add to history?
                  navigate("?withMaxScore=1", { replace: true });
                  // fetcher.submit({ _action: "view max" }, { method: "post" });
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
              editURL: "/codeViewer",
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
              editURL: "/codeViewer",
            }}
            apiURLs={{ postMessages: true }}
          />
        )}
      </Box>
    </>
  );
}
