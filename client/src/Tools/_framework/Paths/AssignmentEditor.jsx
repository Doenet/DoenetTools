import React, { useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router";
import { DateTime } from "luxon";

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
import { DoenetHeading as Heading } from "./Community";
import AssignmentPreview from "../ToolPanels/AssignmentPreview";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  // console.log({ formObj });

  //Don't let name be blank
  let name = formObj?.name?.trim();
  if (name == "") {
    name = "Untitled";
  }

  // TODO: add a way to change an assignment name
  if (formObj._action == "update name") {
    await axios.post(`/api/updateAssignmentName`, {
      assignmentId: Number(params.assignmentId),
      name,
    });
    return true;
  }

  // TODO: do we want to have images for assignments?
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
    `/api/getActivityEditorData/${params.assignmentId}`,
  );

  console.log(assignmentData);

  let assignmentId = Number(params.assignmentId);

  // TODO: what happens if assignment has no documents?
  let docId = assignmentData.documents[0].docId;

  const doenetML = assignmentData.documents[0].source;
  const doenetmlVersion =
    assignmentData.documents[0].doenetmlVersion.fullVersion;

  return {
    assignmentData,
    docId,
    doenetML,
    doenetmlVersion,
    assignmentId,
  };
}

export function AssignmentEditor() {
  const { doenetML, doenetmlVersion, assignmentData, assignmentId } =
    useLoaderData();

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

  let subheading;
  if (assignmentData.classCode) {
    if (assignmentData.stillOpen) {
      subheading = `Class code: ${assignmentData.classCode}`;
    } else {
      subheading = `Class code (inactive): ${assignmentData.classCode}`;
    }
  } else {
    subheading = `Inactive`;
  }

  return (
    <>
      <Heading heading={assignmentData.name} />
      <Heading subheading={subheading} />
      <SimpleGrid columns={2} spacing="20px" margin="20px">
        <VStack>
          <Heading subheading="Assignment Preview" />

          <AssignmentPreview
            doenetML={doenetML}
            doenetmlVersion={doenetmlVersion}
          />
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
