import React, { useEffect, useState } from "react";
import { FetcherWithComponents } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  RadioGroup,
  Stack,
  Radio,
  Input,
  FormLabel,
  useDisclosure,
} from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { DateTime } from "luxon";
import { ActivityStructure } from "../Paths/ActivityEditor";
import { AssignmentInvitation } from "./AssignmentInvitation";
import { MdOutlineContentCopy } from "react-icons/md";

export function AssignActivityControls({
  fetcher,
  activityId,
  activityData,
  openTabIndex,
}: {
  fetcher: FetcherWithComponents<any>;
  activityId: number;
  activityData: ActivityStructure;
  openTabIndex: number;
}) {
  // duration for how long to open assignment
  const [duration, setDuration] = useState(JSON.stringify({ hours: 48 }));
  const [closeAt, setCloseAt] = useState(activityData.codeValidUntil);
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    setCloseAt(activityData.codeValidUntil);
  }, [activityData]);

  useEffect(() => {
    setUrlCopied(false);
  }, [openTabIndex, activityData]);

  const {
    isOpen: invitationIsOpen,
    onOpen: invitationOnOpen,
    onClose: invitationOnClose,
  } = useDisclosure();

  let assignmentStatus = activityData.assignmentStatus;

  function saveCloseTimeToServer() {
    fetcher.submit(
      {
        _action: "update assignment close time",
        activityId,
        closeAt,
      },
      { method: "post" },
    );
  }

  return (
    <>
      <AssignmentInvitation
        isOpen={invitationIsOpen}
        onClose={invitationOnClose}
        activityData={activityData}
      />
      <Box>
        {assignmentStatus === "Open" ? (
          <Box>
            <Heading size="md" marginTop="10px">
              Activity is an open assignment (code {activityData.classCode})
            </Heading>

            <Heading size="sm" marginTop="20px">
              Closing time
            </Heading>

            <p>
              Activity is open until{" "}
              {DateTime.fromISO(activityData.codeValidUntil!).toLocaleString(
                DateTime.DATETIME_MED,
              )}
              .
            </p>

            <FormLabel mt="16px">Adjust closing time</FormLabel>
            <Input
              name="name"
              type="datetime-local"
              size="sm"
              step="60"
              width="220px"
              value={
                DateTime.fromISO(closeAt!).toISO({
                  includeOffset: false,
                  suppressSeconds: true,
                  suppressMilliseconds: true,
                })!
              }
              onChange={(e) => {
                setCloseAt(e.target.value);
              }}
              onBlur={() => saveCloseTimeToServer()}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  saveCloseTimeToServer();
                }
              }}
            />
            <p style={{ marginTop: "15px" }}>
              Close assignment to immediately end its availability.
            </p>
            <p>
              <Button
                type="submit"
                colorScheme="blue"
                mt="10px"
                mr="12px"
                size="xs"
                onClick={() => {
                  fetcher.submit(
                    { _action: "close assignment", activityId },
                    { method: "post" },
                  );
                }}
              >
                Close assignment
              </Button>
            </p>
            <Heading size="sm" marginTop="20px">
              Invite students
            </Heading>
            <p>Invite students to engage in this activity.</p>
            <Button
              onClick={() => {
                setUrlCopied(false);
                invitationOnOpen();
              }}
              colorScheme="blue"
              mt="10px"
              mr="12px"
              size="xs"
            >
              Invitation Screen
            </Button>

            <CopyToClipboard
              onCopy={() => {
                setUrlCopied(true);
              }}
              text={`https://doenet.org/code/${activityData.classCode}`}
            >
              <Button
                colorScheme="blue"
                mt="10px"
                mr="12px"
                size="xs"
                leftIcon={<MdOutlineContentCopy />}
              >
                {urlCopied ? "URL copied" : "Copy Activity URL"}
              </Button>
            </CopyToClipboard>
          </Box>
        ) : assignmentStatus === "Closed" ? (
          <Box>
            <Heading size="md" marginTop="10px">
              Activity is a closed assignment
            </Heading>
            <Box>
              <Heading size="sm" marginTop="10px">
                Reopen assignment
              </Heading>
              <p>
                You can re-open assignment to allow students to again access it
                with code {activityData.classCode}.
              </p>
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
                    { _action: "open assignment", duration, activityId },
                    { method: "post" },
                  );
                }}
              >
                Re-open Activity
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Heading size="md" marginTop="10px">
              Activity is not assigned
            </Heading>
            <Box>
              <Heading size="sm" marginTop="10px">
                Quick assign
              </Heading>
              <p>Assign to students with a code.</p>
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
                    { _action: "open assignment", duration, activityId },
                    { method: "post" },
                  );
                }}
              >
                Assign Activity
              </Button>
            </Box>
          </Box>
        )}

        {activityData.hasScoreData ? (
          <>
            <Heading size="sm" marginTop="20px">
              Student data available
            </Heading>
            <p>
              <Button
                type="submit"
                colorScheme="blue"
                mt="8px"
                mr="12px"
                size="xs"
                onClick={() => {
                  fetcher.submit(
                    { _action: "go to data", activityId },
                    { method: "post" },
                  );
                }}
              >
                View data
              </Button>{" "}
            </p>

            {assignmentStatus === "Closed" ? (
              <Box marginTop="20px">
                <p>
                  Since students have taken the assignment, you can no longer
                  reset the activity to edit it again.
                </p>
              </Box>
            ) : null}
          </>
        ) : null}

        {assignmentStatus === "Closed" && !activityData.hasScoreData ? (
          <Box marginTop="20px">
            <Heading size="sm" marginTop="20px">
              Reset activity
            </Heading>
            <p>
              The assignment has closed but no students have taken the
              assignment. You can reset the activity to allow you edit it again.
            </p>
            <Button
              type="submit"
              colorScheme="blue"
              mt="8px"
              mr="12px"
              size="xs"
              onClick={() => {
                fetcher.submit(
                  { _action: "unassign activity", activityId },
                  { method: "post" },
                );
              }}
            >
              Reset activity
            </Button>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
