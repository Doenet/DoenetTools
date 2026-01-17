import { useState, useRef, useEffect } from "react";
import {
  Box,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Text,
  VStack,
  RadioGroup,
  Radio,
  Tooltip,
} from "@chakra-ui/react";
import { useFetcher } from "react-router";
import { optimistic } from "../../utils/optimistic_ui";
import { AssignmentMode } from "../../types";

/**
 * This widget displays the activity settings related to assignments and lets you change them.
 * Meant to be used in the editor.
 *
 * If you don't want users to be able to change formative/summative mode, set `includeMode` to false. (Do this for single docs)
 */
export function EditAssignmentSettings({
  contentId,
  maxAttempts,
  individualizeByStudent,
  mode,
  includeMode,
  isAssigned = false,
}: {
  contentId: string;
  maxAttempts: number;
  individualizeByStudent: boolean;
  mode: AssignmentMode | null;
  includeMode: boolean;
  isAssigned?: boolean;
}) {
  return (
    <VStack align="left" ml="1rem">
      {includeMode && (
        <AssignmentModeSelection
          contentId={contentId}
          mode={mode!}
          editable={!isAssigned}
        />
      )}
      <MaxAttemptsSelectionBox
        contentId={contentId}
        attempts={maxAttempts ?? 0}
      />
      <VariantSelectionBox
        contentId={contentId}
        editable={!isAssigned}
        isIndividualized={individualizeByStudent}
      />
    </VStack>
  );
}

/**
 * A number input to set an activity's max attempt count
 * If `attempts` is 0, that means unlimited
 */
export function MaxAttemptsSelectionBox({
  contentId,
  attempts,
}: {
  contentId: string;
  attempts: number;
}) {
  const fetcher = useFetcher();

  const optimisticAttempts = optimistic<number>(
    fetcher,
    "maxAttempts",
    attempts,
  );
  const isUnlimited = optimisticAttempts === 0;

  const unlimitedUpdating =
    fetcher.state !== "idle" && (attempts === 0 || optimisticAttempts === 0);
  const finiteMaxUpdating = fetcher.state !== "idle" && !unlimitedUpdating;

  function fetcherUpdate(val: number) {
    fetcher.submit(
      {
        path: "assign/updateAssignmentMaxAttempts",
        contentId,
        maxAttempts: val,
      },
      {
        method: "post",
        encType: "application/json",
        // Use the settings route so the request still resolves after navigating away
        action: `/documentEditor/${contentId}/settings`,
      },
    );
  }

  // We keep track of the latest number input just so unchecking the
  // unlimited option will revert back to the previous input value
  const [numberInputVal, setNumberInputVal] = useState<number | "">(
    attempts > 0 ? attempts : 1,
  );

  // Debounce timer for saving on onChange (for stepper clicks and typing)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Track the pending value to save if component unmounts before debounce completes
  const pendingValueRef = useRef<number | null>(null);

  // Cleanup debounce timer on unmount, but save any pending changes first
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        // Save any pending changes before unmounting
        if (pendingValueRef.current !== null && pendingValueRef.current >= 1) {
          fetcherUpdate(pendingValueRef.current);
        }
      }
    };
  }, []);

  return (
    <Box>
      <HStack>
        <Text color={unlimitedUpdating ? "gray" : "black"}>
          Allow unlimited attempts
        </Text>
        <Switch
          isChecked={isUnlimited}
          onChange={(e) => {
            const val = typeof numberInputVal === "number" ? numberInputVal : 1;
            fetcherUpdate(e.target.checked ? 0 : val);
          }}
        />
      </HStack>
      <HStack>
        <Text color={finiteMaxUpdating ? "gray" : "black"}>
          Maximum number of attempts allowed
        </Text>
        <NumberInput
          isDisabled={isUnlimited}
          width="80px"
          min={1}
          max={65535}
          data-test="max-attempts-input"
          onChange={(valueString) => {
            if (valueString === "") {
              setNumberInputVal("");
              pendingValueRef.current = null;
            } else {
              const newVal = parseInt(valueString);
              if (!isNaN(newVal)) {
                setNumberInputVal(newVal);
                // Track the pending value in case component unmounts before debounce completes
                pendingValueRef.current = newVal >= 1 ? newVal : null;
                // Debounce the save to avoid excessive API calls while typing,
                // but still save on stepper clicks
                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current);
                }
                if (newVal >= 1) {
                  debounceTimerRef.current = setTimeout(() => {
                    fetcherUpdate(newVal);
                    pendingValueRef.current = null;
                  }, 500);
                }
              }
            }
          }}
          value={isUnlimited ? "---" : numberInputVal}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const target = e.target as HTMLInputElement;
              setMaxAttemptsFromInput(target);
            }
          }}
          onBlur={(e) => {
            setMaxAttemptsFromInput(e.target);
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
    </Box>
  );

  /**
   * Set max attempts from the input field of the number input.
   * - If the value is a positive integer, set that as the new max attempts.
   * - If the value is blank and the previous value is a positive integer,
   *   reset to the last valid value and also reset the input field.
   * - Otherwise do nothing.
   */
  function setMaxAttemptsFromInput(target: HTMLInputElement) {
    const clearDebounce = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      pendingValueRef.current = null;
    };

    if (parseInt(target.value) >= 1) {
      clearDebounce();
      fetcherUpdate(parseInt(target.value));
    } else if (target.value === "" && attempts >= 1) {
      clearDebounce();
      fetcherUpdate(attempts);
      setNumberInputVal(attempts);
    }
  }
}

function VariantSelectionBox({
  contentId,
  isIndividualized,
  editable = true,
}: {
  contentId: string;
  isIndividualized: boolean;
  editable?: boolean;
}) {
  const fetcher = useFetcher();
  const optimisticIsIndividualized = optimistic<boolean>(
    fetcher,
    "individualizeByStudent",
    isIndividualized,
  );

  return (
    <Box>
      <HStack>
        <Text size="sm" color={fetcher.state === "idle" ? "black" : "gray"}>
          Assign the same variant of this activity to all students
        </Text>
        <Switch
          isChecked={!optimisticIsIndividualized}
          isDisabled={!editable}
          onChange={(e) => {
            fetcher.submit(
              {
                path: "assign/updateAssignmentSettings",
                contentId,
                individualizeByStudent: !e.target.checked,
              },
              { method: "post", encType: "application/json" },
            );
          }}
        />
      </HStack>
    </Box>
  );
}

function AssignmentModeSelection({
  contentId,
  mode,
  editable,
}: {
  contentId: string;
  mode: AssignmentMode;
  editable: boolean;
}) {
  const fetcher = useFetcher();
  const optimisticMode = optimistic<AssignmentMode>(fetcher, "mode", mode);

  return (
    <Box marginTop="20px">
      <HStack spacing="2rem">
        <Text> Assignment mode</Text>

        <RadioGroup
          isDisabled={!editable}
          onChange={(v) => {
            const mode = v === "summative" ? "summative" : "formative";
            fetcher.submit(
              {
                path: "assign/updateAssignmentSettings",
                contentId,
                mode,
              },
              { method: "post", encType: "application/json" },
            );
          }}
          value={optimisticMode}
        >
          <HStack>
            <Radio value="formative">
              <Tooltip
                openDelay={200}
                label="In a formative assessment, students can create new attempts of individual items.
                  Their overall score is the average of their best attempt for each item."
              >
                Formative
              </Tooltip>
            </Radio>

            <Radio value="summative">
              <Tooltip
                openDelay={200}
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
      </HStack>
    </Box>
  );
}
