import React, { useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router";
import { DateTime } from "luxon";

import { DoenetML } from "@doenet/doenetml";

import {
  Box,
  Button,
  RadioGroup,
  Radio,
  VStack,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useFetcher } from "react-router-dom";
import axios from "axios";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import { DoenetHeading as Heading } from "./Community";
import { useLocation, useNavigate } from "react-router";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  // console.log({ formObj });

  //Don't let name be blank
  let name = formObj?.name?.trim();
  if (name == "") {
    name = "Untitled";
  }

  if (formObj._action == "update name") {
    await axios.post(`/api/updateAssignmentName`, {
      assignmentId: Number(params.assignmentId),
      name,
    });
    return true;
  }

  if (formObj._action == "update general") {
    await axios.post("/api/updateAssignmentSettings", {
      name,
      imagePath: formObj.imagePath,
      assignmentId: Number(params.assignmentId),
    });

    return true;
  }

  if (formObj._action == "open assignment") {
    const closeAt = DateTime.now().plus(JSON.parse(formObj.duration));
    await axios.post("/api/openAssignmentWithCode", {
      assignmentId: Number(params.assignmentId),
      closeAt,
    });
    return true;
  }

  if (formObj._action == "close assignment") {
    await axios.post("/api/closeAssignmentWithCode", {
      assignmentId: Number(params.assignmentId),
    });
    return true;
  }

  if (formObj._action == "go to data") {
    return redirect(`/assignmentData/${params.assignmentId}`);
  }

  return null;
}

export async function loader({ params }) {
  const { data: assignmentData } = await axios.get(
    `/api/getAssignmentEditorData/${params.assignmentId}`,
  );

  let assignmentId = Number(params.assignmentId);

  // TODO: what happens if assignment has no documents?
  let docId = assignmentData.assignmentDocuments[0].docId;

  const doenetML =
    assignmentData.assignmentDocuments[0].documentVersion.content;

  return {
    assignmentData,
    docId,
    doenetML,
    assignmentId,
  };
}

export function AssignmentEditor() {
  const { doenetML, assignmentData, assignmentId } = useLoaderData();

  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    document.title = `${assignmentData.name} - Doenet`;
  }, [assignmentData.name]);

  // duration for how long to open assignment
  const [duration, setDuration] = useState(JSON.stringify({ hours: 48 }));

  const [variants, setVariants] = useState({
    index: 1,
    numVariants: 1,
    allPossibleVariants: ["a"],
  });

  const fetcher = useFetcher();

  return (
    <>
      <Heading heading={assignmentData.name} />
      <SimpleGrid columns={2} spacing="20px" margin="20px">
        <VStack>
          <Heading subheading="Assignment Preview" />

          <Box
            background="var(--canvas)"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="doenet.mediumGray"
            width="100%"
            overflow="scroll"
          >
            <DoenetML
              doenetML={doenetML}
              flags={{
                showCorrectness: true,
                solutionDisplayMode: "button",
                showFeedback: true,
                showHints: true,
                autoSubmit: false,
                allowLoadState: false,
                allowSaveState: false,
                allowLocalState: false,
                allowSaveSubmissions: false,
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
              scrollableContainer={
                document.getElementById("viewer-container") || undefined
              }
            />
          </Box>
        </VStack>
        <Box>
          {assignmentData.stillOpen ? (
            <Box>
              <Heading subheading="Quick Assign" />
              <p>
                Assignment is currently active with code{" "}
                <strong>{assignmentData.classCode}</strong>, and open for
                students to join until{" "}
                {DateTime.fromISO(assignmentData.codeValidUntil).toLocaleString(
                  DateTime.DATETIME_MED,
                )}
                .
              </p>
              <Button
                type="submit"
                colorScheme="blue"
                mt="8px"
                mr="12px"
                size="xs"
                onClick={() => {
                  fetcher.submit(
                    { _action: "close assignment" },
                    { method: "post" },
                  );
                }}
              >
                Close assignment
              </Button>
            </Box>
          ) : (
            <Box>
              <Heading subheading="Quick Assign" />
              <p>Assign to students with a code</p>
              How long would you like this activity to remain open?
              <RadioGroup onChange={setDuration} value={duration}>
                <Stack direction="row">
                  <Radio value={JSON.stringify({ hours: 48 })}>48 Hours</Radio>
                  <Radio value={JSON.stringify({ weeks: 2 })}>2 Weeks</Radio>
                  <Radio value={JSON.stringify({ years: 1 })}>1 Year</Radio>
                </Stack>
              </RadioGroup>
              <Button
                type="submit"
                colorScheme="blue"
                mt="8px"
                mr="12px"
                size="xs"
                onClick={() => {
                  fetcher.submit(
                    { _action: "open assignment", duration },
                    { method: "post" },
                  );
                }}
              >
                Submit
              </Button>
            </Box>
          )}

          <Heading subheading="Instructor Overview" />
          <Button
            type="submit"
            colorScheme="blue"
            mt="8px"
            mr="12px"
            size="xs"
            onClick={() => {
              fetcher.submit({ _action: "go to data" }, { method: "post" });
            }}
          >
            View data
          </Button>
        </Box>
      </SimpleGrid>
    </>
  );
}
