import React, { useEffect } from "react";
import { useLoaderData, useOutletContext } from "react-router";

import { DoenetViewer } from "@doenet/doenetml-iframe";

import { Box, Grid, GridItem, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import {
  EnterClassCode,
  action as enterClassCodeAction,
} from "./EnterClassCode";
import { ChangeName, action as changeNameAction } from "./ChangeName";
import { User } from "./SiteHeader";
import axios from "axios";

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
  let assignment;

  // TODO: need to select variant for each student (just once)

  if (params.activityId) {
    // TODO: create this route
    const { data } = await axios.get(
      `/api/getAssignmentData/${params.activityId}`,
    );
    assignment = data;
  } else if (params.classCode) {
    const { data } = await axios.get(
      `/api/getAssignmentDataFromCode/${params.classCode}`,
    );

    if (!data.assignmentFound) {
      return {
        assignmentFound: false,
        assignment: null,
        invalidClassCode: params.classCode,
      };
    }

    assignment = data.assignment;
  }

  // TODO: what happens if assignment has no documents?
  const docId = assignment.documents[0].id;
  const docVersionNum = assignment.documents[0].assignedVersionNum;

  const doenetML = assignment.documents[0].assignedVersion.source;
  const doenetmlVersion =
    assignment.documents[0].assignedVersion.doenetmlVersion.fullVersion;

  return {
    assignmentFound: true,
    assignment,
    docId,
    docVersionNum,
    doenetML,
    doenetmlVersion,
  };
}

export function AssignmentViewer() {
  const {
    doenetML,
    assignment,
    assignmentFound,
    docId,
    docVersionNum,
    doenetmlVersion,
  } = useLoaderData() as {
    doenetML: string;
    assignment: any;
    assignmentFound: boolean;
    docId: string;
    docVersionNum: number;
    doenetmlVersion: string;
  };

  const user = useOutletContext<User>();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (assignmentFound) {
      document.title = `${assignment.name} - Doenet`;
    } else {
      document.title = `Enter class code - Doenet`;
    }
  }, [assignmentFound, assignment?.name]);

  useEffect(() => {
    if (!assignment) {
      return;
    }

    const messageListener = async function (event) {
      if (event.data.subject == "SPLICE.reportScoreAndState") {
        // TODO: generalize to multiple documents. For now, assume just have one.
        await axios.post("/api/saveScoreAndState", {
          activityId: assignment.id,
          docId: assignment.documents[0].id,
          docVersionNum: assignment.documents[0].assignedVersionNum,
          score: event.data.score,
          state: JSON.stringify(event.data.state),
          onSubmission: event.data.state.onSubmission,
        });
      } else if (event.data.subject == "SPLICE.sendEvent") {
        const data = event.data.data;
        if (data.verb === "submitted") {
          recordSubmittedEvent({
            activityId: assignment.id,
            docId,
            docVersionNum,
            data,
          });

          // TODO: check if this is a submission destined for LLM grading
          if (1) {
            // if so... then record it
            recordLLMSubmittedEvent({
              activityId: assignment.id,
              docId,
              docVersionNum,
              data,
            });
          }
        }
      } else if (event.data.subject == "SPLICE.getState") {
        try {
          const { data } = await axios.get("/api/loadState", {
            params: {
              activityId: assignment.id,
              docId: assignment.documents[0].id,
              docVersionNum: assignment.documents[0].assignedVersionNum,
              userId: event.data.userId,
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

  if (!assignmentFound) {
    return <EnterClassCode />;
  }

  if (!user?.lastNames) {
    return <ChangeName hideHomeButton />;
  }

  return (
    <>
      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header header header"
      "leftGutter centerContent rightGutter"
      `}
        templateRows="40px auto"
        templateColumns=".06fr 1fr .06fr"
        position="relative"
      >
        <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
        <GridItem
          area="header"
          position="fixed"
          height="40px"
          background="doenet.canvas"
          width="100%"
          zIndex="500"
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
              {assignment.name}
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
            templateColumns={`1fr minmax(400px,850px) 1fr`}
            overflow="hidden"
          >
            <GridItem
              area="leftGutter"
              background="doenet.lightBlue"
              width="100%"
              paddingTop="10px"
              alignSelf="start"
            ></GridItem>
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
              <VStack
                spacing={0}
                margin="10px 0px 10px 0px" //Only need when there is an outline
              >
                <Box
                  h="calc(100vh - 100px)"
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
                  <DoenetViewer
                    doenetML={doenetML}
                    doenetmlVersion={doenetmlVersion}
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
                    attemptNumber={1}
                    idsIncludeActivityId={false}
                    paginate={true}
                    location={location}
                    navigate={navigate}
                    linkSettings={{
                      viewURL: "/activityViewer",
                      editURL: "/codeViewer",
                    }}
                    apiURLs={{ postMessages: true }}
                  />
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}

async function recordSubmittedEvent({
  activityId,
  docId,
  docVersionNum,
  data,
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
    const documentCreditAchieved = context.pageCreditAchieved;

    await axios.post(`/api/recordSubmittedEvent`, {
      activityId,
      docId,
      docVersionNum,
      answerId,
      answerNumber: object.answerNumber,
      result: {
        response,
        itemNumber,
        creditAchieved,
        itemCreditAchieved,
        documentCreditAchieved,
      },
    });
  }
}

async function recordLLMSubmittedEvent({
  activityId,
  docId,
  docVersionNum,
  data,
}) {
  const object = JSON.parse(data.object);
  const answerId = object.componentName;

  if (answerId) {
    const result = JSON.parse(data.result);
    const response = JSON.stringify({
      response: result.response,
      componentTypes: result.componentTypes,
    });
    const context = JSON.parse(data.context);
    const itemNumber = context.item;

    await axios.post(`/api/recordLLMSubmittedEvent`, {
      activityId,
      docId,
      docVersionNum,
      answerId,
      answerNumber: object.answerNumber,
      // TODO: include the processed rubric from the provided `data`
      rubric: "FAKE RUBRIC",
      result: {
        response,
        itemNumber,
      },
    });
  }
}
