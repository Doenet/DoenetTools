import {
  faCode,
  faCalendarPlus,
  faCalendarTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import DateTime from '../../../_reactComponents/PanelHeaderComponents/DateTime';
import {
  DateToUTCDateString,
  DateToDateString,
} from '../../../_utils/dateUtilityFunction';
import Increment from '../../../_reactComponents/PanelHeaderComponents/IncrementMenu';

import {
  atom,
  selector,
  useRecoilValue,
  useRecoilValueLoadable,
  // useRecoilState,
  useSetRecoilState,
  useRecoilCallback,
} from 'recoil';
import {
  // folderDictionaryFilterSelector,
  loadAssignmentSelector,
  folderDictionary,
  globalSelectedNodesAtom,
} from '../../../_reactComponents/Drive/NewDrive';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';
// import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
// import Increment from '../../../_reactComponents/PanelHeaderComponents/IncrementMenu';
import useSockets from '../../../_reactComponents/Sockets';
import { pageToolViewAtom } from '../NewToolRoot';
// import {
//   itemHistoryAtom,
//   assignmentDictionarySelector,
//   useAssignment,
// } from '../ToolHandlers/CourseToolHandler';
// import { useAssignmentCallbacks } from '../../../_reactComponents/Drive/DriveActions';
// import { useToast } from '../Toast';
import Switch from '../../_framework/Switch';
// import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
// import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import axios from 'axios';
import { nanoid } from 'nanoid';

import {
  itemHistoryAtom,
  fileByContentId,
} from '../ToolHandlers/CourseToolHandler';
import { useToast, toastType } from '@Toast';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import CalendarToggle from '../../../_reactComponents/PanelHeaderComponents/CalendarToggle';
import Checkbox from '../../../_reactComponents/PanelHeaderComponents/Checkbox';

export const selectedVersionAtom = atom({
  key: 'selectedVersionAtom',
  default: '',
});

export default function SelectedDoenetML() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const item = useRecoilValue(selectedInformation)[0];
  let [label, setLabel] = useState('');
  const { deleteItem, renameItem } = useSockets('drive');
  const addToast = useToast();

  useEffect(() => {
    setLabel(item?.label);
  }, [item?.label]);

  const assignUnassign = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ label, doenetId, parentFolderId, driveId }) => {
        const versionId = nanoid();
        const timestamp = DateToUTCDateString(new Date());
        //Get contentId of draft
        let itemHistory = await snapshot.getPromise(itemHistoryAtom(doenetId));
        const contentId = itemHistory.draft.contentId;

        //Get doenetML
        let doenetML = await snapshot.getPromise(fileByContentId(contentId));

        const { data } = await axios.post('/api/releaseDraft.php', {
          doenetId,
          doenetML,
          timestamp,
          versionId,
        });

        const { success, message, title } = data;
        if (success) {
          addToast(`${label}'s "${title}" is Released.`, toastType.SUCCESS);
        } else {
          addToast(message, toastType.ERROR);
        }

        //Update data structures
        set(itemHistoryAtom(doenetId), (was) => {
          let newObj = { ...was };
          let newNamed = [...was.named];
          //Retract all other named versions
          for (const [i, version] of newNamed.entries()) {
            let newVersion = { ...version };
            newVersion.isReleased = '0';
            newNamed[i] = newVersion;
          }

          let newVersion = {
            title,
            versionId,
            timestamp,
            isReleased: '1',
            isDraft: '0',
            isNamed: '1',
            contentId,
          };
          newNamed.unshift(newVersion);

          newObj.named = newNamed;
          return newObj;
        });

        set(folderDictionary({ driveId, folderId: parentFolderId }), (was) => {
          let newFolderInfo = { ...was };
          //TODO: once path has itemId fixed delete this code
          //Find itemId
          let itemId = null;
          for (let testItemId of newFolderInfo.contentIds.defaultOrder) {
            if (
              newFolderInfo.contentsDictionary[testItemId].doenetId === doenetId
            ) {
              itemId = testItemId;
              break;
            }
          }
          newFolderInfo.contentsDictionary = { ...was.contentsDictionary };
          newFolderInfo.contentsDictionary[itemId] = {
            ...was.contentsDictionary[itemId],
          };
          newFolderInfo.contentsDictionary[itemId].isReleased = '1';

          newFolderInfo.contentsDictionaryByDoenetId = {
            ...was.contentsDictionaryByDoenetId,
          };
          newFolderInfo.contentsDictionaryByDoenetId[doenetId] = {
            ...was.contentsDictionaryByDoenetId[doenetId],
          };
          newFolderInfo.contentsDictionaryByDoenetId[doenetId].isReleased = '1';

          return newFolderInfo;
        });
      },
  );

  if (!item) {
    return null;
  }

  if (effectiveRole === 'student') {
    return (
      <>
        <h2 data-cy="infoPanelItemLabel">
          <FontAwesomeIcon icon={faCode} /> {item?.label}
        </h2>
        <ActionButton
          width="menu"
          value="Take Assignment"
          onClick={() => {
            setPageToolView({
              page: 'course',
              tool: 'assignment',
              view: '',
              params: {
                doenetId: item?.doenetId,
              },
            });
          }}
        />
        <AssignmentSettings role={effectiveRole} doenetId={item.doenetId} />
      </>
    );
  }
  let assignDraftLabel = 'Release Current Draft';
  // if (item.isReleased === "1"){ assignDraftLabel = "Unassign Content";}

  function renameItemCallback(newLabel, item) {
    renameItem({
      driveIdFolderId: {
        driveId: item.driveId,
        folderId: item.parentFolderId,
      },
      itemId: item.itemId,
      itemType: item.itemType,
      newLabel: newLabel,
    });
  }

  let surveyButton = null;
  // console.log(">>>>item",item)
  //TODO: Need info about points (or flag for survey)
  // if (item.isReleased === '1'){
  //   surveyButton = <ActionButton
  //   width="menu"
  //   value="View Survey"
  //   onClick={() => {
  //     setPageToolView({
  //       page: 'course',
  //       tool: 'surveyData',
  //       view: '',
  //       params: {
  //         doenetId: item.doenetId,
  //         driveId: item.driveId,
  //       },
  //     });
  //   }}
  // />
  // }

  return (
    <>
      <h2 data-cy="infoPanelItemLabel">
        <FontAwesomeIcon icon={faCode} /> {item.label}
      </h2>
      <ActionButtonGroup vertical>
        <ActionButton
          width="menu"
          value="Edit DoenetML"
          onClick={() => {
            setPageToolView({
              page: 'course',
              tool: 'editor',
              view: '',
              params: {
                doenetId: item.doenetId,
                path: `${item.driveId}:${item.parentFolderId}:${item.itemId}:DoenetML`,
              },
            });
          }}
        />
        <ActionButton
          width="menu"
          value="Take Assignment"
          onClick={() => {
            setPageToolView({
              page: 'course',
              tool: 'assignment',
              view: '',
              params: {
                doenetId: item.doenetId,
              },
            });
          }}
        />
        {surveyButton}
      </ActionButtonGroup>
      <Textfield
        label="DoenetML Label"
        width="menu"
        vertical
        data-cy="infoPanelItemLabelInput"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            let effectiveLabel = label;
            if (label === '') {
              effectiveLabel = 'Untitled';
              addToast("Label for the doenetML can't be blank.");
              setLabel(effectiveLabel);
            }
            //Only rename if label has changed
            if (item.label !== effectiveLabel) {
              renameItemCallback(effectiveLabel, item);
            }
          }
        }}
        onBlur={() => {
          let effectiveLabel = label;
          if (label === '') {
            effectiveLabel = 'Untitled';
            addToast("Label for the doenetML can't be blank.");
            setLabel(effectiveLabel);
          }
          //Only rename if label has changed
          if (item.label !== effectiveLabel) {
            renameItemCallback(effectiveLabel, item);
          }
        }}
      />

      {/* <label>
        DoenetML Label
        <input
          type="text"
          data-cy="infoPanelItemLabelInput"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              let effectiveLabel = label;
              if (label === '') {
                effectiveLabel = 'Untitled';
                addToast("Label for the doenetML can't be blank.");
                setLabel(effectiveLabel);
              }
              //Only rename if label has changed
              if (item.label !== effectiveLabel) {
                renameItemCallback(effectiveLabel, item);
              }
            }
          }}
          onBlur={() => {
            let effectiveLabel = label;
            if (label === '') {
              effectiveLabel = 'Untitled';
              addToast("Label for the doenetML can't be blank.");
              setLabel(effectiveLabel);
            }
            //Only rename if label has changed
            if (item.label !== effectiveLabel) {
              renameItemCallback(effectiveLabel, item);
            }
          }}
        />
      </label> */}
      <br />
      <Button
        width="menu"
        value={assignDraftLabel}
        onClick={() => assignUnassign(item)}
      />

      <br />
      <AssignmentSettings role={effectiveRole} doenetId={item.doenetId} />
      {/* <br /> */}
      <br />
      <Button
        alert
        width="menu"
        data-cy="deleteDoenetMLButton"
        value="Delete DoenetML"
        onClick={() => {
          deleteItem({
            driveIdFolderId: {
              driveId: item.driveId,
              folderId: item.parentFolderId,
            },
            itemId: item.itemId,
            driveInstanceId: item.driveInstanceId,
            label: item.label,
          });
        }}
      />
      {/* <br /> */}
    </>
  );
}

//For item we just need label and doenetId
export function AssignmentSettings({ role, doenetId }) {
  //Use aInfo to check if values have changed
  let aInfoRef = useRef({});
  const aInfo = aInfoRef?.current;

  const addToast = useToast();
  //Note if aLoadable is not loaded then these will default to undefined
  let [assignedDate, setAssignedDate] = useState('');
  let [dueDate, setDueDate] = useState('');
  let [pinnedUntilDate, setPinnedUntilDate] = useState('');
  let [pinnedAfterDate, setPinnedAfterDate] = useState('');
  let [limitAttempts, setLimitAttempts] = useState(true);
  let [numberOfAttemptsAllowed, setNumberOfAttemptsAllowed] = useState(1);
  let [timeLimit, setTimeLimit] = useState(60);
  let [attemptAggregation, setAttemptAggregation] = useState('');
  let [totalPointsOrPercent, setTotalPointsOrPercent] = useState(100);
  let [gradeCategory, setGradeCategory] = useState('');
  let [individualize, setIndividualize] = useState(true);
  let [showSolution, setShowSolution] = useState(true);
  let [showSolutionInGradebook, setShowSolutionInGradebook] = useState(true);
  let [showFeedback, setShowFeedback] = useState(true);
  let [showHints, setShowHints] = useState(true);
  let [showCorrectness, setShowCorrectness] = useState(true);
  let [showCreditAchievedMenu, setShowCreditAchievedMenu] = useState(true);
  let [proctorMakesAvailable, setProctorMakesAvailable] = useState(true);

  const updateAssignment = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({
        doenetId,
        keyToUpdate,
        value,
        description,
        valueDescription = null,
        secondKeyToUpdate = null,
        secondValue,
      }) => {
        const oldAInfo = await snapshot.getPromise(
          loadAssignmentSelector(doenetId),
        );
        let newAInfo = { ...oldAInfo, [keyToUpdate]: value };

        if (secondKeyToUpdate) {
          newAInfo[secondKeyToUpdate] = secondValue;
        }

        set(loadAssignmentSelector(doenetId), newAInfo);
        let dbAInfo = { ...newAInfo };

        if (dbAInfo.assignedDate !== null) {
          dbAInfo.assignedDate = DateToUTCDateString(
            new Date(dbAInfo.assignedDate),
          );
        }

        if (dbAInfo.dueDate !== null) {
          dbAInfo.dueDate = DateToUTCDateString(new Date(dbAInfo.dueDate));
        }

        if (dbAInfo.pinnedUntilDate !== null) {
          dbAInfo.pinnedUntilDate = DateToUTCDateString(
            new Date(dbAInfo.pinnedUntilDate),
          );
        }

        if (dbAInfo.pinnedAfterDate !== null) {
          dbAInfo.pinnedAfterDate = DateToUTCDateString(
            new Date(dbAInfo.pinnedAfterDate),
          );
        }

        const resp = await axios.post(
          '/api/saveAssignmentToDraft.php',
          dbAInfo,
        );

        if (resp.data.success) {
          if (valueDescription) {
            addToast(`Updated ${description} to ${valueDescription}`);
          } else {
            if (
              description === 'Assigned Date' ||
              description === 'Due Date' ||
              description === 'Pinned Until Date' ||
              description === 'Pinned After Date'
            ) {
              addToast(
                `Updated ${description} to ${new Date(value).toLocaleString()}`,
              );
            } else {
              addToast(`Updated ${description} to ${value}`);
            }
          }
        }
        // set(loadAssignmentSelector(doenetId),(was)=>{
        //   return {...was,[keyToUpdate]:value}
        // });
      },
    [addToast],
  );

  const loadRecoilAssignmentValues = useRecoilCallback(
    ({ snapshot }) =>
      async (doenetId) => {
        const aLoadable = await snapshot.getPromise(
          loadAssignmentSelector(doenetId),
        );

        aInfoRef.current = { ...aLoadable };

        setAssignedDate(aLoadable?.assignedDate);
        setDueDate(aLoadable?.dueDate);
        setLimitAttempts(aLoadable?.numberOfAttemptsAllowed !== null);
        setNumberOfAttemptsAllowed(aLoadable?.numberOfAttemptsAllowed);
        setAttemptAggregation(aLoadable?.attemptAggregation);
        setTotalPointsOrPercent(aLoadable?.totalPointsOrPercent);
        setGradeCategory(aLoadable?.gradeCategory);
        setIndividualize(aLoadable?.individualize);
        setShowSolution(aLoadable?.showSolution);
        setShowSolutionInGradebook(aLoadable?.showSolutionInGradebook);
        setShowFeedback(aLoadable?.showFeedback);
        setShowHints(aLoadable?.showHints);
        setShowCorrectness(aLoadable?.showCorrectness);
        setShowCreditAchievedMenu(aLoadable?.showCreditAchievedMenu);
        setProctorMakesAvailable(aLoadable?.proctorMakesAvailable);
        setTimeLimit(aLoadable?.timeLimit);
        setPinnedUntilDate(aLoadable?.pinnedUntilDate);
        setPinnedAfterDate(aLoadable?.pinnedAfterDate);
      },
    [],
  );

  if (Object.keys(aInfo).length === 0) {
    loadRecoilAssignmentValues(doenetId);
    return null;
  }

  //Student JSX
  if (role === 'student') {
    let nAttemptsAllowed = aInfo?.numberOfAttemptsAllowed;
    if (nAttemptsAllowed === null) {
      nAttemptsAllowed = 'unlimited';
    }
    let timeLimitJSX = null;
    if (aInfo?.timeLimit !== null) {
      timeLimitJSX = <p>Time Limit: {aInfo?.timeLimit} minutes</p>;
    }
    let assignedDateJSX = null;
    if (aInfo?.assignedDate !== null) {
      assignedDateJSX = <p>Assigned: {aInfo?.assignedDate}</p>;
    }
    let dueDateJSX = <p>No Due Date</p>;
    if (aInfo?.dueDate !== null) {
      dueDateJSX = <p>Due: {aInfo?.dueDate}</p>;
    }
    return (
      <>
        <div>
          {assignedDateJSX}
          {dueDateJSX}
          {timeLimitJSX}
          <p>Attempts Allowed: {nAttemptsAllowed}</p>
          <p>Points: {aInfo?.totalPointsOrPercent}</p>
        </div>
      </>
    );
  }
  //Instructor JSX
  return (
    <>
      <div>
        <label>
          Assigned Date
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              checkedIcon={<FontAwesomeIcon icon={faCalendarPlus} />}
              uncheckedIcon={<FontAwesomeIcon icon={faCalendarTimes} />}
              style={{ margin: '2px' }}
              checked={assignedDate !== null && assignedDate !== undefined}
              onClick={(e) => {
                let valueDescription = 'None';
                let value = null;

                if (assignedDate === null || assignedDate === undefined) {
                  valueDescription = 'Now';
                  value = DateToDateString(new Date());
                }

                setAssignedDate(value);

                updateAssignment({
                  doenetId,
                  keyToUpdate: 'assignedDate',
                  value,
                  description: 'Assigned Date',
                  valueDescription,
                });
              }}
            />

            <DateTime
              style={{ marginTop: '2px' }}
              disabled={assignedDate === null || assignedDate === undefined}
              value={assignedDate ? new Date(assignedDate) : null}
              disabledText="No Assigned Day"
              disabledOnClick={(e) => {
                let valueDescription = 'Now';
                let value = DateToDateString(new Date());
                setAssignedDate(value);

                updateAssignment({
                  doenetId,
                  keyToUpdate: 'assignedDate',
                  value,
                  description: 'Assigned Date',
                  valueDescription,
                });
              }}
              onBlur={({ valid, value }) => {
                if (valid) {
                  try {
                    value = value.toDate();
                  } catch (e) {
                    // console.log('value not moment');
                  }
                  if (
                    new Date(DateToDateString(value)).getTime() !==
                    new Date(assignedDate).getTime()
                  ) {
                    setAssignedDate(DateToDateString(value));

                    updateAssignment({
                      doenetId,
                      keyToUpdate: 'assignedDate',
                      value: DateToDateString(value),
                      description: 'Assigned Date',
                    });
                  }
                } else {
                  addToast('Invalid Assigned Date');
                }
              }}
            />
          </div>
        </label>
      </div>
      <div>
        <label>
          Due Date
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              checkedIcon={<FontAwesomeIcon icon={faCalendarPlus} />}
              uncheckedIcon={<FontAwesomeIcon icon={faCalendarTimes} />}
              style={{ margin: '2px' }}
              checked={dueDate !== null && dueDate !== undefined}
              onClick={(e) => {
                let valueDescription = 'None';
                let value = null;

                if (dueDate === null || dueDate === undefined) {
                  valueDescription = 'Next Week';
                  let nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  value = DateToDateString(nextWeek);
                }
                setDueDate(value);

                updateAssignment({
                  doenetId,
                  keyToUpdate: 'dueDate',
                  value,
                  description: 'Due Date',
                  valueDescription,
                });
              }}
            />

            <DateTime
              style={{ marginTop: '2px' }}
              disabled={dueDate === null || dueDate === undefined}
              value={dueDate ? new Date(dueDate) : null}
              onBlur={({ valid, value }) => {
                if (valid) {
                  try {
                    value = value.toDate();
                  } catch (e) {
                    // console.log('value not moment');
                  }
                  if (
                    new Date(DateToDateString(value)).getTime() !==
                    new Date(dueDate).getTime()
                  ) {
                    setDueDate(DateToDateString(value));
                    updateAssignment({
                      doenetId,
                      keyToUpdate: 'dueDate',
                      value: DateToDateString(value),
                      description: 'Due Date',
                    });
                  }
                } else {
                  addToast('Invalid Due Date');
                }
              }}
              disabledText="No Due Date"
              disabledOnClick={(e) => {
                let valueDescription = 'Next Week';
                let nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                let value = DateToDateString(nextWeek);
                setDueDate(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'dueDate',
                  value,
                  description: 'Due Date',
                  valueDescription,
                });
              }}
            />
          </div>
        </label>
      </div>
      <div>
        <label>
          Time Limit
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              style={{ margin: '2px' }}
              checked={timeLimit !== null}
              onClick={(e) => {
                let valueDescription = 'Not Limited';
                let value = null;
                if (timeLimit === null) {
                  valueDescription = '60 Minutes';
                  value = 60;
                }
                setTimeLimit(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'timeLimit',
                  value,
                  description: 'Time Limit ',
                  valueDescription,
                });
              }}
            />
            <Increment
              style={{ marginTop: '2px' }}
              disabled={timeLimit === null}
              value={timeLimit}
              min={0}
              onBlur={(newValue) => {
                if (aInfo.timeLimit !== timeLimit) {
                  let timelimitlocal = null;
                  if (timeLimit < 0 || timeLimit === '' || isNaN(timeLimit)) {
                    setTimeLimit(0);
                    timelimitlocal = 0;
                  } else {
                    timelimitlocal = parseInt(timeLimit);
                    setTimeLimit(parseInt(timeLimit));
                  }
                  let valueDescription = `${timelimitlocal} Minutes`;

                  updateAssignment({
                    doenetId,
                    keyToUpdate: 'timeLimit',
                    value: timelimitlocal,
                    description: 'Time Limit',
                    valueDescription,
                  });
                }
              }}
              onChange={(newValue) => setTimeLimit(newValue)}
            />
          </div>
        </label>
      </div>

      {/* <div>aInfo = {aInfo?.limitAttempts ? 'true' : 'false'}</div>
<div>limitAttempts = {limitAttempts ? 'true' : 'false'}</div> */}
      <div>
        <label>
          Attempts
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              style={{ margin: '2px' }}
              checked={limitAttempts !== null}
              onClick={(e) => {
                let valueDescription = 'Not Limited';
                let value = null;
                if (limitAttempts === null) {
                  valueDescription = '1';
                  value = 1;
                }
                setLimitAttempts(value);
                setNumberOfAttemptsAllowed(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'numberOfAttemptsAllowed',
                  value,
                  description: 'Attempts Allowed ',
                  valueDescription,
                });
              }}
            />
            <Increment
              style={{ marginTop: '2px' }}
              disabled={limitAttempts === null}
              value={numberOfAttemptsAllowed}
              min={0}
              onBlur={() => {
                if (aInfo.numberOfAttemptsAllowed !== numberOfAttemptsAllowed) {
                  let numberOfAttemptsAllowedLocal = null;
                  if (
                    numberOfAttemptsAllowed < 0 ||
                    numberOfAttemptsAllowed === '' ||
                    isNaN(numberOfAttemptsAllowed)
                  ) {
                    setNumberOfAttemptsAllowed(0);
                    numberOfAttemptsAllowedLocal = 0;
                  } else {
                    numberOfAttemptsAllowedLocal = parseInt(
                      numberOfAttemptsAllowed,
                    );
                    setNumberOfAttemptsAllowed(
                      parseInt(numberOfAttemptsAllowed),
                    );
                  }

                  updateAssignment({
                    doenetId,
                    keyToUpdate: 'numberOfAttemptsAllowed',
                    value: numberOfAttemptsAllowedLocal,
                    description: 'Attempts Allowed',
                  });
                }
              }}
              onChange={(newValue) => setNumberOfAttemptsAllowed(newValue)}
            />
          </div>
        </label>
      </div>
      <div>
        <label>
          Attempt Aggregation
          <DropdownMenu
            width="menu"
            valueIndex={attemptAggregation === 'm' ? 1 : 2}
            items={[
              ['m', 'Maximum'],
              ['l', 'Last Attempt'],
            ]}
            onChange={({ value: val }) => {
              let valueDescription = 'Maximum';
              if (val === 'l') {
                valueDescription = 'Last Attempt';
              }
              setAttemptAggregation(val);
              updateAssignment({
                doenetId,
                keyToUpdate: 'attemptAggregation',
                value: val,
                description: 'Attempt Aggregation',
                valueDescription,
              });
            }}
          />
        </label>
      </div>

      <div>
        Total Points Or Percent
        <Increment
          value={totalPointsOrPercent}
          min={0}
          onBlur={() => {
            if (aInfo.totalPointsOrPercent !== totalPointsOrPercent) {
              let totalPointsOrPercentLocal = null;
              if (
                totalPointsOrPercent < 0 ||
                totalPointsOrPercent === '' ||
                isNaN(totalPointsOrPercent)
              ) {
                setTotalPointsOrPercent(0);
                totalPointsOrPercentLocal = 0;
              } else {
                totalPointsOrPercentLocal = parseInt(totalPointsOrPercent);
                setTotalPointsOrPercent(parseInt(totalPointsOrPercent));
              }

              updateAssignment({
                doenetId,
                keyToUpdate: 'totalPointsOrPercent',
                value: totalPointsOrPercentLocal,
                description: 'Total Points Or Percent',
              });
            }
          }}
          onChange={(newValue) => setTotalPointsOrPercent(newValue)}
        />
      </div>

      <div>
        <label>
          Grade Category
          <DropdownMenu
            width="menu"
            valueIndex={
              {
                gateway: 1,
                exams: 2,
                quizzes: 3,
                'problem sets': 4,
                projects: 5,
                participation: 6,
              }[gradeCategory]
            }
            items={[
              ['gateway', 'gateway'],
              ['exams', 'exams'],
              ['quizzes', 'qizzes'],
              ['problem sets', 'problem sets'],
              ['projects', 'projects'],
              ['participation', 'participation'],
            ]}
            onChange={({ value: val }) => {
              console.log('on change');
              if (aInfo.gradeCategory !== val) {
                aInfoRef.current.gradeCategory = val;
                setGradeCategory(val);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'gradeCategory',
                  value: val,
                  description: 'Grade Category',
                });
              }
            }}
          />
        </label>
      </div>

      <div>
        <label>
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              style={{ margin: '2px' }}
              checked={individualize}
              onClick={(e) => {
                let valueDescription = 'False';
                let value = false;
                if (!individualize) {
                  valueDescription = 'True';
                  value = true;
                }
                setIndividualize(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'individualize',
                  value: value,
                  description: 'Individualize',
                  valueDescription,
                });
              }}
            />
            Individualize
          </div>
        </label>
      </div>

      <div>
        <label>
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              style={{ margin: '2px' }}
              checked={showSolution}
              onClick={(e) => {
                let valueDescription = 'False';
                let value = false;
                if (!showSolution) {
                  valueDescription = 'True';
                  value = true;
                }
                setShowSolution(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'showSolution',
                  value: value,
                  description: 'Show Solution',
                  valueDescription,
                });
              }}
            />
            Show Solution
          </div>
        </label>
      </div>

      <div>
        <label>
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              style={{ margin: '2px' }}
              checked={showSolutionInGradebook}
              onClick={(e) => {
                let valueDescription = 'False';
                let value = false;
                if (!showSolutionInGradebook) {
                  valueDescription = 'True';
                  value = true;
                }
                setShowSolutionInGradebook(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'showSolutionInGradebook',
                  value: value,
                  description: 'Show Solution In Gradebook',
                  valueDescription,
                });
              }}
            />
            Show Solution In Gradebook
          </div>
        </label>
      </div>

      <div>
        <label>
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              style={{ margin: '2px' }}
              checked={showFeedback}
              onClick={(e) => {
                let valueDescription = 'False';
                let value = false;
                if (!showFeedback) {
                  valueDescription = 'True';
                  value = true;
                }
                setShowFeedback(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'showFeedback',
                  value: value,
                  description: 'Show Feedback',
                  valueDescription,
                });
              }}
            />
            Show Feedback
          </div>
        </label>
      </div>

      <div>
        <label>
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              style={{ margin: '2px' }}
              checked={showHints}
              onClick={(e) => {
                let valueDescription = 'False';
                let value = false;
                if (!showHints) {
                  valueDescription = 'True';
                  value = true;
                }
                setShowHints(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'showHints',
                  value: value,
                  description: 'Show Hints',
                  valueDescription,
                });
              }}
            />
            Show Hints
          </div>
        </label>
      </div>

      <div>
        <label>
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              style={{ margin: '2px' }}
              checked={showCorrectness}
              onClick={(e) => {
                let valueDescription = 'False';
                let value = false;
                if (!showCorrectness) {
                  valueDescription = 'True';
                  value = true;
                }
                setShowCorrectness(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'showCorrectness',
                  value: value,
                  description: 'Show Correctness',
                  valueDescription,
                });
              }}
            />
            Show Correctness
          </div>
        </label>
      </div>

      <div>
        <label>
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              style={{ margin: '2px' }}
              checked={showCreditAchievedMenu}
              onClick={(e) => {
                let valueDescription = 'False';
                let value = false;
                if (!showCreditAchievedMenu) {
                  valueDescription = 'True';
                  value = true;
                }
                setShowCreditAchievedMenu(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'showCreditAchievedMenu',
                  value: value,
                  description: 'Show Credit Achieved Menu',
                  valueDescription,
                });
              }}
            />
            Show Credit Achieved Menu
          </div>
        </label>
      </div>

      <div>
        <label>
          <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              style={{ margin: '2px' }}
              checked={proctorMakesAvailable}
              onClick={(e) => {
                let valueDescription = 'False';
                let value = false;
                if (!proctorMakesAvailable) {
                  valueDescription = 'True';
                  value = true;
                }
                setProctorMakesAvailable(value);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'proctorMakesAvailable',
                  value: value,
                  description: 'Proctor Makes Available',
                  valueDescription,
                });
              }}
            />
            Proctor Makes Available
          </div>
        </label>
      </div>

      <div>
        <label>
          Pin Assignment
          <div
            style={{ display: 'flex', flexFlow: 'row wrap' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Checkbox
              checkedIcon={<FontAwesomeIcon icon={faCalendarPlus} />}
              uncheckedIcon={<FontAwesomeIcon icon={faCalendarTimes} />}
              style={{ margin: '2px' }}
              checked={
                pinnedUntilDate !== null && pinnedUntilDate !== undefined
              }
              onClick={(e) => {
                let valueDescription = 'None';
                let value = null;
                let secondValue = null;

                if (pinnedUntilDate === null || pinnedUntilDate === undefined) {
                  valueDescription = 'Now to Next Year';
                  let today = new Date();
                  let nextYear = new Date();
                  nextYear.setDate(nextYear.getDate() + 365);
                  value = DateToDateString(today);
                  secondValue = DateToDateString(nextYear);
                }
                setPinnedAfterDate(value);
                setPinnedUntilDate(secondValue);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'pinnedAfterDate',
                  value,
                  description: 'Pinned Dates ',
                  valueDescription,
                  secondKeyToUpdate: 'pinnedUntilDate',
                  secondValue,
                });
              }}
            />
            <DateTime
              style={{ marginTop: '2px' }}
              disabled={
                pinnedAfterDate === null || pinnedAfterDate === undefined
              }
              disabledText="No Pinned After Date"
              disabledOnClick={(e) => {
                let valueDescription = 'None';
                let value = null;
                let secondValue = null;

                if (pinnedAfterDate === null || pinnedAfterDate === undefined) {
                  valueDescription = 'Now to Next Year';
                  let today = new Date();
                  let nextYear = new Date();
                  nextYear.setDate(nextYear.getDate() + 365);
                  value = DateToDateString(today);
                  secondValue = DateToDateString(nextYear);
                }
                setPinnedAfterDate(value);
                setPinnedUntilDate(secondValue);
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'pinnedAfterDate',
                  value,
                  description: 'Pinned Dates ',
                  valueDescription,
                  secondKeyToUpdate: 'pinnedUntilDate',
                  secondValue,
                });
              }}
              value={pinnedAfterDate ? new Date(pinnedAfterDate) : null}
              onBlur={({ valid, value }) => {
                if (valid) {
                  try {
                    value = value.toDate();
                  } catch (e) {
                    // console.log('value not moment');
                  }
                  if (
                    new Date(DateToDateString(value)).getTime() !==
                    new Date(pinnedAfterDate).getTime()
                  ) {
                    setPinnedAfterDate(DateToDateString(value));
                    updateAssignment({
                      doenetId,
                      keyToUpdate: 'pinnedAfterDate',
                      value: DateToDateString(value),
                      description: 'Pinned After Date',
                    });
                  }
                } else {
                  addToast('Invalid Pin After Date');
                }
              }}
            />
            <div
              style={{ marginLeft: '33px' }}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <DateTime
                style={{ marginTop: '2px' }}
                disabled={
                  pinnedUntilDate === null || pinnedUntilDate === undefined
                }
                disabledText="No Pinned Until Date"
                disabledOnClick={(e) => {
                  let valueDescription = 'None';
                  let value = null;
                  let secondValue = null;

                  if (
                    pinnedUntilDate === null ||
                    pinnedUntilDate === undefined
                  ) {
                    valueDescription = 'Now to Next Year';
                    let today = new Date();
                    let nextYear = new Date();
                    nextYear.setDate(nextYear.getDate() + 365);
                    value = DateToDateString(today);
                    secondValue = DateToDateString(nextYear);
                  }
                  setPinnedAfterDate(value);
                  setPinnedUntilDate(secondValue);
                  updateAssignment({
                    doenetId,
                    keyToUpdate: 'pinnedAfterDate',
                    value,
                    description: 'Pinned Dates ',
                    valueDescription,
                    secondKeyToUpdate: 'pinnedUntilDate',
                    secondValue,
                  });
                }}
                value={pinnedUntilDate ? new Date(pinnedUntilDate) : null}
                onBlur={({ valid, value }) => {
                  if (valid) {
                    try {
                      value = value.toDate();
                    } catch (e) {
                      // console.log('value not moment');
                    }
                    if (
                      new Date(DateToDateString(value)).getTime() !==
                      new Date(pinnedUntilDate).getTime()
                    ) {
                      setPinnedUntilDate(DateToDateString(value));

                      updateAssignment({
                        doenetId,
                        keyToUpdate: 'pinnedUntilDate',
                        value: DateToDateString(value),
                        description: 'Pinned Until Date',
                      });
                    }
                  } else {
                    addToast('Invalid Pin Until Date');
                  }
                }}
              />
            </div>
          </div>
        </label>
      </div>
    </>
  );
}

export const selectedInformation = selector({
  key: 'selectedInformation',
  get: ({ get }) => {
    const globalSelected = get(globalSelectedNodesAtom);
    if (globalSelected.length !== 1) {
      return globalSelected;
    }
    //Find information if only one item selected
    const driveId = globalSelected[0].driveId;
    const folderId = globalSelected[0].parentFolderId;
    const driveInstanceId = globalSelected[0].driveInstanceId;
    let folderInfo = get(folderDictionary({ driveId, folderId }));
    const itemId = globalSelected[0].itemId;
    let itemInfo = {
      ...(folderInfo.contentsDictionary[itemId] ?? {
        ...folderInfo.folderInfo,
      }),
    };
    itemInfo['driveId'] = driveId;
    itemInfo['driveInstanceId'] = driveInstanceId;

    return [itemInfo];
  },
});
