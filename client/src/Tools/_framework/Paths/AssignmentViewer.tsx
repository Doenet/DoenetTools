import React, { ReactElement, useEffect } from "react";
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
import { SiteContext } from "./SiteHeader";
import { Content, DoenetmlVersion } from "../../../_utils/types";
import { ActivitySource, isActivitySource } from "../../../_utils/viewerTypes";
import { compileActivityFromContent } from "../../../_utils/activity";
import { ActivityViewer as DoenetActivityViewer } from "@doenet/assignment-viewer";

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

  if (params.contentId) {
    // TODO: create this route
    const { data } = await axios.get(
      `/api/assign/getAssignmentData/${params.contentId}`,
    );
    assignment = data;
  } else if (params.classCode) {
    const { data } = await axios.get(
      `/api/info/getAssignmentDataFromCode/${params.classCode}`,
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

  if (assignment.type === "singleDoc") {
    const doenetML = assignment.doenetML;
    const doenetmlVersion: DoenetmlVersion = assignment.doenetmlVersion;

    return {
      assignmentFound: true,
      type: assignment.type,
      assignment,
      doenetML,
      doenetmlVersion,
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
    };
  }
}

export function AssignmentViewer() {
  const data = useLoaderData() as
    | {
        assignmentFound: false;
        invalidClassCode: string;
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
      ));

  const { assignmentFound, assignment } = data;

  const assignmentName = data.assignmentFound ? data.assignment.name : "";

  const { user } = useOutletContext<SiteContext>();

  const navigate = useNavigate();
  const location = useLocation();

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
        // TODO: generalize to multiple documents. For now, assume just have one.
        await axios.post("/api/score/saveScoreAndState", {
          contentId: assignment.contentId,
          assignedRevisionNum: assignment.revisionNum,
          score: event.data.score,
          state: JSON.stringify(event.data.state),
          onSubmission: event.data.state.onSubmission,
        });
      } else if (event.data.subject == "SPLICE.sendEvent") {
        const data = event.data.data;
        if (data.verb === "submitted") {
          recordSubmittedEvent({
            contentId: assignment.contentId,
            activityRevisionNum: assignment.revisionNum ?? 1,
            data,
          });
        }
      } else if (event.data.subject == "SPLICE.getState") {
        try {
          const { data } = await axios.get("/api/score/loadState", {
            params: {
              contentId: assignment.contentId,
              requestedUserId: event.data.userId,
            },
          });

          if (data.state) {
            window.postMessage({
              subject: "SPLICE.getState.response",
              messageId: event.data.messageId,
              success: true,
              loadedState: true,
              state: JSON.parse(data.state),
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

  if (!data.assignmentFound || !assignment) {
    return <EnterClassCode />;
  }

  if (!user?.lastNames) {
    return <ChangeName hideHomeButton />;
  }

  let viewer: ReactElement;
  if (data.type === "singleDoc") {
    viewer = (
      <DoenetViewer
        doenetML={data.doenetML}
        doenetmlVersion={data.doenetmlVersion.fullVersion}
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
        idsIncludeContentId={false}
        paginate={true}
        location={location}
        navigate={navigate}
        linkSettings={{
          viewURL: "/activityViewer",
          editURL: "/codeViewer",
        }}
        apiURLs={{ postMessages: true }}
      />
    );
  } else {
    viewer = (
      <DoenetActivityViewer
        source={data.activityJson}
        requestedVariantIndex={1}
        userId={"hi"}
        linkSettings={{ viewUrl: "", editURL: "" }}
        paginate={assignment.type === "sequence" ? assignment.paginate : false}
        activityLevelAttempts={
          assignment.type === "sequence"
            ? assignment.activityLevelAttempts
            : false
        }
        itemLevelAttempts={
          assignment.type === "sequence" ? assignment.itemLevelAttempts : false
        }
        showTitle={false}
      />
    );
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
              {data.assignment.name}
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
                  {viewer}
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
  contentId,
  activityRevisionNum,
  data,
}: {
  contentId: string;
  activityRevisionNum: number;
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
    const activityCreditAchieved = context.pageCreditAchieved;

    await axios.post(`/api/assign/recordSubmittedEvent`, {
      contentId,
      activityRevisionNum,
      answerId,
      answerNumber: object.answerNumber,
      response,
      itemNumber,
      creditAchieved,
      itemCreditAchieved,
      activityCreditAchieved,
    });
  }
}
