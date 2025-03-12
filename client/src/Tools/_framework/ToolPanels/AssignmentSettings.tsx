import React, { useEffect, useRef, useState } from "react";
import { FetcherWithComponents } from "react-router";
import {
  Box,
  Heading,
  RadioGroup,
  Radio,
  HStack,
  Text,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  FormLabel,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import { AssignmentMode, Content } from "../../../_utils/types";
import { MdError } from "react-icons/md";

export async function assignmentSettingsActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj._action == "update assignment mode") {
    try {
      const { data } = await axios.post("/api/assign/updateAssignmentMode", {
        contentId: formObj.contentId,
        mode: formObj.mode,
      });
      return data;
    } catch (_e) {
      return { success: false, mode: formObj.mode };
    }
  } else if (formObj._action == "update maximum attempts") {
    try {
      const { data } = await axios.post(
        "/api/assign/updateAssignmentMaxAttempts",
        {
          contentId: formObj.contentId,
          maxAttempts: parseInt(formObj.maxAttempts),
        },
      );
      return data;
    } catch (_e) {
      return { success: false, maxAttempts: formObj.maxAttempts };
    }
  }

  return null;
}

export function AssignmentSettings({
  fetcher,
  activityData,
  openTabIndex,
}: {
  fetcher: FetcherWithComponents<any>;
  activityData: Content;
  openTabIndex: number;
}) {
  const [assignmentMode, setAssignmentMode] = useState<AssignmentMode>(
    activityData.assignmentInfo?.mode ?? "formative",
  );
  const [maxAttemptsString, setMaxAttemptsString] = useState<string>(
    (activityData.assignmentInfo?.maxAttempts || 1).toString(),
  );
  const [limitAttempts, setLimitAttempts] = useState(
    (activityData.assignmentInfo?.maxAttempts ?? 1) > 0,
  );
  const currentMaxAttempts = useRef(
    activityData.assignmentInfo?.maxAttempts ?? 1,
  );
  currentMaxAttempts.current = activityData.assignmentInfo?.maxAttempts ?? 1;

  const [statusText, setStatusText] = useState("");
  const [encounteredError, setEncounteredError] = useState(false);

  const maxMaxAttempt = 65535;

  useEffect(() => {
    setEncounteredError(false);
    setStatusText("");
  }, [openTabIndex]);

  useEffect(() => {
    if (typeof fetcher.data === "object") {
      if (fetcher.data.success) {
        if ("mode" in fetcher.data) {
          setEncounteredError(false);
          setStatusText(`Changed mode to ${fetcher.data.mode}`);
        } else if ("maxAttempts" in fetcher.data) {
          const maxAttempts = fetcher.data.maxAttempts;
          setEncounteredError(false);
          if (maxAttempts === 0) {
            setStatusText(
              "Changed the maximum number of attempts to Unlimited",
            );
          } else {
            setStatusText(
              `Changed the maximum number of attempts to ${maxAttempts}`,
            );
          }
        }
      } else {
        if ("mode" in fetcher.data) {
          setEncounteredError(true);
          setStatusText(`Error attempting to change assignment mode`);
        } else if ("maxAttempts" in fetcher.data) {
          setEncounteredError(true);
          setStatusText(
            `Error attempting to change maximum number of attempts`,
          );
        }
      }
    }
  }, [fetcher.data]);

  return (
    <>
      <Box>
        {statusText !== "" ? (
          <Box
            data-test="Status message"
            border="solid 1px lightgray"
            borderRadius="5px"
            padding="5px 10px"
            marginTop="10px"
            backgroundColor={encounteredError ? "red.100" : "orange.100"}
          >
            {encounteredError ? (
              <Icon
                fontSize="24pt"
                color="red.800"
                as={MdError}
                verticalAlign="middle"
                marginRight="5px"
              />
            ) : null}
            {statusText}
          </Box>
        ) : null}

        <Box marginTop="20px">
          <Heading size="sm" marginTop="20px">
            Assignment mode
          </Heading>
          <RadioGroup
            marginTop="10px"
            isDisabled={activityData.type === "singleDoc"}
            onChange={(v) => {
              setAssignmentMode(v === "summative" ? "summative" : "formative");
              fetcher.submit(
                {
                  _action: "update assignment mode",
                  contentId: activityData.contentId,
                  mode: v,
                },
                { method: "post" },
              );
            }}
            value={assignmentMode}
          >
            <HStack>
              <Radio value="formative">
                <Tooltip
                  label="In a formative assessment, students can create new attempts of individual items.
                  Their overall score is the average of their best attempt for each item."
                >
                  Formative
                </Tooltip>
              </Radio>

              <Radio value="summative">
                <Tooltip
                  label="In a summative assessment, students can create new attempts of the entire assignment.
                Their score for an attempt is the average of their scores for each item.
                Their overall score is their best attempt score.
                "
                >
                  Summative
                </Tooltip>
              </Radio>
            </HStack>
          </RadioGroup>
          <Text hidden={activityData.type !== "singleDoc"} marginTop="10px">
            Note: for documents, which don't have items, there is currently no
            functional difference between formative and summative assessments.
          </Text>
        </Box>
        <Heading size="sm" marginTop="20px">
          Number of attempts allowed
        </Heading>
        <Checkbox
          marginTop="10px"
          isChecked={limitAttempts}
          onChange={() => {
            setLimitAttempts(!limitAttempts);
            if (limitAttempts) {
              // not longer limiting attempts
              fetcher.submit(
                {
                  _action: "update maximum attempts",
                  contentId: activityData.contentId,
                  maxAttempts: 0,
                },
                { method: "post" },
              );
            } else {
              let maxAttempts = parseInt(maxAttemptsString);
              if (!Number.isFinite(maxAttempts)) {
                maxAttempts = 1;
                setMaxAttemptsString("1");
              }
              fetcher.submit(
                {
                  _action: "update maximum attempts",
                  contentId: activityData.contentId,
                  maxAttempts,
                },
                { method: "post" },
              );
            }
          }}
        >
          Limit attempts
        </Checkbox>
        <FormLabel marginTop="10px">
          Maximum number of{" "}
          {assignmentMode === "formative" ? "item" : "assignment"} attempts
          <NumberInput
            isDisabled={!limitAttempts}
            width="150px"
            value={limitAttempts ? maxAttemptsString : "Unlimited"}
            onChange={(valueString) => {
              const numValue = parseInt(valueString);
              let strValue = numValue.toString();
              if (!Number.isInteger(numValue)) {
                strValue = "";
              }
              setMaxAttemptsString(strValue);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                submitMaxAttempt((e.target as HTMLInputElement).value);
              }
            }}
            min={1}
            max={maxMaxAttempt}
            onBlur={(e) => {
              const valueString = e.target.value;
              submitMaxAttempt(valueString);
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormLabel>
      </Box>
    </>
  );

  function submitMaxAttempt(valueString: string) {
    const numValue = parseInt(valueString);
    if (Number.isInteger(numValue) && numValue > 0) {
      if (numValue <= maxMaxAttempt) {
        fetcher.submit(
          {
            _action: "update maximum attempts",
            contentId: activityData.contentId,
            maxAttempts: numValue,
          },
          { method: "post" },
        );
      } else {
        fetcher.submit(
          {
            _action: "update maximum attempts",
            contentId: activityData.contentId,
            maxAttempts: maxMaxAttempt,
          },
          { method: "post" },
        );
        setMaxAttemptsString(maxMaxAttempt.toString());
      }
    } else {
      setMaxAttemptsString(currentMaxAttempts.current.toString());
    }
  }
}
