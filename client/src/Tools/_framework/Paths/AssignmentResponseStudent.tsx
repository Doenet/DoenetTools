import React, { ReactElement, useEffect } from "react";

import {
  Box,
  Link as ChakraLink,
  Tooltip,
  Flex,
  Grid,
  GridItem,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import {
  Link as ReactRouterLink,
  useNavigate,
  useLoaderData,
} from "react-router";
import {
  AssignmentMode,
  ContentType,
  Doc,
  UserInfo,
  DoenetmlVersion,
} from "../../../_utils/types";
import { contentTypeToName, getIconInfo } from "../../../_utils/activity";
import { AssignmentItemResponseStudent } from "../ToolPanels/AssignmentItemResponseStudent";
import { AssignmentStudentResponseSummary } from "./AssignmentStudentResponseSummary";

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
    `/api/assign/getAssignmentResponseStudent/${params.contentId}/${params.studentUserId ? params.studentUserId : ""}${search}`,
  );

  const overall = data.overallScores;

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
    if (itemScores) {
      itemScores.sort((a, b) => a.itemNumber - b.itemNumber);
    }
  }

  const overallScores = {
    score: overall.score,
    bestAttemptNumber: overall.bestAttemptNumber,
    itemScores: overallItemScores,
    numContentAttempts: overall.latestAttempt.attemptNumber,
    numItemAttempts: latestItemScores.map((x) => x.itemAttemptNumber),
  };

  if (data.singleItemAttempt) {
    const responseCounts: Record<string, number> = Object.fromEntries(
      data.responseCounts,
    );
    const doenetML = data.content.doenetML;
    const doenetmlVersion: DoenetmlVersion = data.content.doenetmlVersion;

    return {
      ...data,
      requestedItemNumber,
      itemNames,
      itemScores,
      overallScores,
      responseCounts,
      shuffledOrder,
      doenetML,
      doenetmlVersion,
    };
  } else {
    return {
      ...data,
      itemNames,
      itemScores,
      overallScores,
      shuffledOrder,
    };
  }
}

export function AssignmentResponseStudent() {
  const {
    assignment,
    itemNames,
    mode,
    user,
    overallScores,
    allStudents,
    shuffledOrder,
    ...data
  } = useLoaderData() as {
    assignment: {
      name: string;
      type: ContentType;
      contentId: string;
      shuffledOrder: boolean;
    };
    mode: AssignmentMode;
    user: UserInfo;
    overallScores: {
      score: number;
      bestAttemptNumber: number;
      itemScores: { itemNumber: number; score: number }[] | null;
      numContentAttempts: number;
      numItemAttempts: number[] | null;
    };
    itemNames: string[];
    shuffledOrder: boolean;
    allStudents: {
      userId: string;
      firstNames: string | null;
      lastNames: string;
    }[];
  } & (
    | {
        singleItemAttempt: true;
        requestedItemNumber: number;
        content: Doc;
        itemAttemptState: {
          state: string | null;
          score: number;
          variant: number;
          itemNumber?: number;
          shuffledItemNumber?: number;
        };
        attemptScores: { attemptNumber: number; score: number }[];
        itemScores: { itemNumber: number; score: number }[];
        attemptNumber: number;
        responseCounts: Record<string, number>;
        doenetML: string;
        doenetmlVersion: DoenetmlVersion;
      }
    | {
        singleItemAttempt: false;
        allAttemptScores:
          | {
              byItem: true;
              itemAttemptScores: {
                itemNumber: number;
                shuffledItemNumber: number;
                attempts: {
                  itemAttemptNumber: number;
                  score: number;
                }[];
              }[];
            }
          | {
              byItem: false;
              attemptScores: {
                attemptNumber: number;
                score: number;
                items: {
                  itemNumber: number;
                  shuffledItemNumber: number;
                  score: number;
                }[];
              }[];
            };
      }
  );

  useEffect(() => {
    document.title = `${assignment?.name} - Doenet`;
  }, [assignment?.name]);

  const navigate = useNavigate();

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

  let mainPanel: ReactElement;

  if (data.singleItemAttempt) {
    mainPanel = (
      <AssignmentItemResponseStudent
        assignment={assignment}
        mode={mode}
        user={user}
        itemNames={itemNames}
        shuffledOrder={shuffledOrder}
        allStudents={allStudents}
        itemAttemptState={data.itemAttemptState}
        attemptScores={data.attemptScores}
        itemScores={data.itemScores}
        requestedItemNumber={data.requestedItemNumber}
        attemptNumber={data.attemptNumber}
        responseCounts={data.responseCounts}
        doenetML={data.doenetML}
        doenetmlVersion={data.doenetmlVersion}
      />
    );
  } else {
    mainPanel = (
      <AssignmentStudentResponseSummary
        assignment={assignment}
        user={user}
        shuffledOrder={shuffledOrder}
        itemNames={itemNames}
        allStudents={allStudents}
        overallScores={overallScores}
        allAttemptScores={data.allAttemptScores}
      />
    );
  }

  return (
    <>
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
                {assignment.name} &mdash;{" "}
                {data.singleItemAttempt ? "Item Details" : "Student Summary"}
              </Flex>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="centerContent">{mainPanel}</GridItem>
      </Grid>
    </>
  );
}
