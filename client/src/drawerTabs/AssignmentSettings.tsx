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
import { AssignmentMode, Content } from "../types";
import { MdError } from "react-icons/md";

export async function assignmentSettingsActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj._action == "update assignment settings") {
    try {
      const { data } = await axios.post(
        "/api/assign/updateAssignmentSettings",
        {
          contentId: formObj.contentId,
          mode: formObj.mode,
          individualizeByStudent: formObj.individualizeByStudent
            ? formObj.individualizeByStudent === "true"
            : undefined,
        },
      );
      return data;
    } catch (_e) {
      if (formObj.mode !== undefined) {
        return { success: false, mode: formObj.mode };
      } else {
        return {
          success: false,
          individualizeByStudent: formObj.individualizeByStudent
            ? formObj.individualizeByStudent === "true"
            : undefined,
        };
      }
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
  const [unlimitedAttempts, setUnlimitedAttempts] = useState(
    (activityData.assignmentInfo?.maxAttempts ?? 1) === 0,
  );
  const currentMaxAttempts = useRef(
    activityData.assignmentInfo?.maxAttempts ?? 1,
  );
  currentMaxAttempts.current = activityData.assignmentInfo?.maxAttempts ?? 1;

  const [statusText, setStatusText] = useState("");
  const [statusStyleIdx, setStatusStyleIdx] = useState(0);
  const [encounteredError, setEncounteredError] = useState(false);

  const maxMaxAttempt = 65535;

  const [individualizeByStudent, setIndividualizeByStudent] = useState<boolean>(
    activityData.assignmentInfo?.individualizeByStudent ?? false,
  );

  useEffect(() => {
    setEncounteredError(false);
    setStatusText("");
  }, [openTabIndex]);

  useEffect(() => {
    if (typeof fetcher.data === "object" && fetcher.data !== null) {
      if (fetcher.data.success) {
        if ("mode" in fetcher.data) {
          setEncounteredError(false);
          setStatusStyleIdx((x) => x + 1);
          setStatusText(`Changed mode to ${fetcher.data.mode}`);
        } else if ("maxAttempts" in fetcher.data) {
          const maxAttempts = fetcher.data.maxAttempts;
          setEncounteredError(false);
          setStatusStyleIdx((x) => x + 1);
          if (maxAttempts === 0) {
            setStatusText(
              "Changed the maximum number of attempts to Unlimited",
            );
          } else {
            setStatusText(
              `Changed the maximum number of attempts to ${maxAttempts}`,
            );
          }
        } else if ("individualizeByStudent" in fetcher.data) {
          setEncounteredError(false);
          setStatusStyleIdx((x) => x + 1);
          setStatusText(
            `Changed individualize by student to ${fetcher.data.individualizeByStudent}`,
          );
        }
      } else {
        if ("mode" in fetcher.data) {
          setEncounteredError(true);
          setStatusText(`Error attempting to change assignment mode`);
        } else if ("individualizeByStudent" in fetcher.data) {
          setEncounteredError(true);
          setStatusText(`Error attempting to change individualize by student`);
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
        <Box height="35px">
          {statusText !== "" ? (
            <Box
              data-test="Status message"
              border="solid 1px lightgray"
              borderRadius="5px"
              padding="5px 10px"
              backgroundColor={
                encounteredError
                  ? "red.100"
                  : ["green.100", "green.200"][statusStyleIdx % 2]
              }
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
        </Box>

        {activityData.type !== "singleDoc" ? (
          <Box marginTop="20px">
            <Heading size="sm" marginTop="20px">
              Assignment mode
            </Heading>
            <RadioGroup
              marginTop="10px"
              isDisabled={
                (activityData.assignmentInfo?.assignmentStatus ??
                  "Unassigned") !== "Unassigned"
              }
              onChange={(v) => {
                setAssignmentMode(
                  v === "summative" ? "summative" : "formative",
                );
                fetcher.submit(
                  {
                    _action: "update assignment settings",
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
            {(activityData.assignmentInfo?.assignmentStatus ?? "Unassigned") !==
            "Unassigned" ? (
              <Text>
                Note: Cannot modify assignment mode since activity is assigned.
              </Text>
            ) : null}
          </Box>
        ) : null}

        <Box>
          <Heading size="sm" marginTop="20px">
            Number of attempts allowed
          </Heading>

          <FormLabel marginTop="10px">
            Maximum number of{" "}
            {assignmentMode === "formative" && activityData.type !== "singleDoc"
              ? "item"
              : "assignment"}{" "}
            attempts
            <NumberInput
              isDisabled={unlimitedAttempts}
              width="80px"
              value={unlimitedAttempts ? "---" : maxAttemptsString}
              onChange={(valueString) => {
                const numValue = parseInt(valueString);
                let strValue = numValue.toString();
                if (!Number.isInteger(numValue) || numValue === 0) {
                  strValue = "";
                }
                setMaxAttemptsString(strValue);
              }}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  const target = e.target as HTMLInputElement;
                  submitMaxAttempt(target.value);
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
          <Checkbox
            marginTop="10px"
            isChecked={unlimitedAttempts}
            onChange={() => {
              setUnlimitedAttempts(!unlimitedAttempts);
              if (unlimitedAttempts) {
                // now unlimited attempts will be false
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
              } else {
                // no longer limiting attempts
                fetcher.submit(
                  {
                    _action: "update maximum attempts",
                    contentId: activityData.contentId,
                    maxAttempts: 0,
                  },
                  { method: "post" },
                );
              }
            }}
          >
            Unlimited attempts
          </Checkbox>
        </Box>

        <Box>
          <Heading size="sm" marginTop="20px">
            Variant selection
          </Heading>

          <Checkbox
            marginTop="10px"
            isChecked={individualizeByStudent}
            isDisabled={
              (activityData.assignmentInfo?.assignmentStatus ??
                "Unassigned") !== "Unassigned"
            }
            onChange={() => {
              setIndividualizeByStudent(!individualizeByStudent);
              fetcher.submit(
                {
                  _action: "update assignment settings",
                  contentId: activityData.contentId,
                  individualizeByStudent: !individualizeByStudent,
                },
                { method: "post" },
              );
            }}
          >
            <Tooltip label="If Individualize by Student is set, then each student receives a different variant of the assignment. Otherwise, every student receives the same variant.">
              Individualize by student
            </Tooltip>
          </Checkbox>
          {(activityData.assignmentInfo?.assignmentStatus ?? "Unassigned") !==
          "Unassigned" ? (
            <Text>
              Note: Cannot modify Individualize by Student since activity is
              assigned.
            </Text>
          ) : null}
        </Box>
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
