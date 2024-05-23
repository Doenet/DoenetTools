import React, { useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router";

import { DoenetML } from "@doenet/doenetml";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import { useLocation, useNavigate } from "react-router";
import { EnterClassCode } from "./EnterClassCode";
import { Form, useFetcher } from "react-router-dom";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  // console.log({ formObj });

  if (formObj._action == "submit code") {
    return redirect(`/classCode/${formObj.classCode}`);
  } else if (formObj._action == "submit user name") {
    await axios.post(`/api/updateUser`, { name: formObj.name });
    return true;
  }

  return null;
}

export async function loader({ params }) {
  let assignment;
  let userName;

  if (params.assignmentId) {
    let { data } = await axios.get(
      `/api/getAssignmentData/${params.assignmentId}`,
    );
    assignment = data;
  } else if (params.classCode) {
    let { data } = await axios.get(
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
    userName = data.name;
  }

  let assignmentId = params.assignmentId;

  // TODO: what happens if assignment has no documents?
  let docId = assignment.assignmentDocuments[0].docId;

  let doenetML = assignment.assignmentDocuments[0].documentVersion.content;

  return {
    assignmentFound: true,
    assignment,
    docId,
    doenetML,
    assignmentId,
    userName,
  };
}

export function AssignmentViewer() {
  const { doenetML, assignment, assignmentFound, userName } = useLoaderData();

  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (assignmentFound) {
      document.title = `${assignment.name} - Doenet`;
    } else {
      document.title = `Enter class code - Doenet`;
    }
  }, [assignmentFound, assignment?.name]);

  useEffect(() => {
    addEventListener("message", async (event) => {
      if (event.data.subject == "SPLICE.reportScoreAndState") {
        // TODO: generalize to multiple documents. For now, assume just have one.
        await axios.post("/api/saveScoreAndState", {
          assignmentId: assignment.assignmentId,
          docId: assignment.assignmentDocuments[0].docId,
          docVersionId: assignment.assignmentDocuments[0].docVersionId,
          score: event.data.score,
          state: JSON.stringify(event.data.state),
        });
      } else if (event.data.subject == "SPLICE.getState") {
        // get state from database
        // send message "SPLICE.getState.response" with same message id
      }
    });
  }, []);

  const [variants, setVariants] = useState({
    index: 1,
    numVariants: 1,
    allPossibleVariants: ["a"],
  });

  const fetcher = useFetcher();

  if (!assignmentFound) {
    return <EnterClassCode />;
  }

  if (!userName) {
    return (
      <Box margin="20px">
        <Form method="post">
          <FormControl isRequired>
            <FormLabel mt="16px">Enter your name:</FormLabel>
            <Input placeholder="Name" name="name" size="sm" width={40} />
          </FormControl>
          <Button type="submit" colorScheme="blue" mt="8px" mr="12px" size="xs">
            Start assignment
          </Button>
          <input type="hidden" name="_action" value="submit user name" />
        </Form>
      </Box>
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
                {variants.numVariants > 1 && (
                  <Box bg="doenet.lightBlue" h="32px" width="100%">
                    <VariantSelect
                      size="sm"
                      menuWidth="140px"
                      syncIndex={variants.index}
                      array={variants.allPossibleVariants}
                      onChange={(index) =>
                        setVariants((prev) => {
                          let next = { ...prev };
                          next.index = index + 1;
                          return next;
                        })
                      }
                    />
                  </Box>
                )}
                <Box
                  h={
                    variants.numVariants > 1
                      ? "calc(100vh - 132px)"
                      : "calc(100vh - 100px)"
                  }
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
                  <DoenetML
                    doenetML={doenetML}
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
                      allowSaveEvents: false,
                    }}
                    attemptNumber={1}
                    generatedVariantCallback={setVariants}
                    requestedVariantIndex={variants.index}
                    idsIncludeActivityId={false}
                    paginate={true}
                    location={location}
                    navigate={navigate}
                    linkSettings={{
                      viewURL: "/activityViewer",
                      editURL: "/publicEditor",
                    }}
                    apiURLs={{ postMessages: true }}
                    scrollableContainer={
                      document.getElementById("viewer-container") || undefined
                    }
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
