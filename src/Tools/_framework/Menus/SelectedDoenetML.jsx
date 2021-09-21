import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import {
  atom,
  selector,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilState,
  // useSetRecoilState,
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
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
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

import { DateToUTCDateString } from '../../../_utils/dateUtilityFunction';
import {
  itemHistoryAtom,
  fileByContentId,
} from '../ToolHandlers/CourseToolHandler';
import { useToast, toastType } from '@Toast';

export const selectedVersionAtom = atom({
  key: 'selectedVersionAtom',
  default: '',
});

export default function SelectedDoenetML() {
  const [pageToolView, setPageToolView] = useRecoilState(pageToolViewAtom);
  const role = pageToolView.view;
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

  if (role === 'student') {
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
        <AssignmentSettings role={role} doenetId={item.doenetId} />
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
      <br/>
      <Button
        width="menu"
        value={assignDraftLabel}
        onClick={() => assignUnassign(item)}
      />

      <br />
      <AssignmentSettings role={role} doenetId={item.doenetId} />
      <br />
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
      <br />
    </>
  );
}

//For item we just need label and doenetId
export function AssignmentSettings({ role, doenetId }) {
  //Consider getValue() but need Suspense
  const aLoadable = useRecoilValueLoadable(loadAssignmentSelector(doenetId));
  const aInfo = aLoadable.contents;
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

        if (secondKeyToUpdate){
          newAInfo[secondKeyToUpdate] = secondValue;
        }

        set(loadAssignmentSelector(doenetId), newAInfo);
        let dbAInfo = { ...newAInfo };

     
        if (dbAInfo.assignedDate !== null){
          dbAInfo.assignedDate = DateToUTCDateString(
            new Date(dbAInfo.assignedDate),
          );
        }
        
        if (dbAInfo.dueDate !== null){
          dbAInfo.dueDate = DateToUTCDateString(
            new Date(dbAInfo.dueDate)
          );
        }

        if (dbAInfo.pinnedUntilDate !== null){
          dbAInfo.pinnedUntilDate = DateToUTCDateString(
            new Date(dbAInfo.pinnedUntilDate)
          );
        }

        if (dbAInfo.pinnedAfterDate !== null){
          dbAInfo.pinnedAfterDate = DateToUTCDateString(
            new Date(dbAInfo.pinnedAfterDate)
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
            addToast(`Updated ${description} to ${value}`);
          }
        }
        // set(loadAssignmentSelector(doenetId),(was)=>{
        //   return {...was,[keyToUpdate]:value}
        // });
      },
    [addToast],
  );

  // function datestring(d){
  //   return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
  //   d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  // }

  //Update assignment values when selection changes
  useEffect(() => {
    setAssignedDate(aInfo?.assignedDate);
    setDueDate(aInfo?.dueDate);
    setLimitAttempts(aInfo?.numberOfAttemptsAllowed !== null);
    setNumberOfAttemptsAllowed(aInfo?.numberOfAttemptsAllowed);
    setAttemptAggregation(aInfo?.attemptAggregation);
    setTotalPointsOrPercent(aInfo?.totalPointsOrPercent);
    setGradeCategory(aInfo?.gradeCategory);
    setIndividualize(aInfo?.individualize);
    setShowSolution(aInfo?.showSolution);
    setShowSolutionInGradebook(aInfo?.showSolutionInGradebook);
    setShowFeedback(aInfo?.showFeedback);
    setShowHints(aInfo?.showHints);
    setShowCorrectness(aInfo?.showCorrectness);
    setProctorMakesAvailable(aInfo?.proctorMakesAvailable);
    setTimeLimit(aInfo?.timeLimit);
    setPinnedUntilDate(aInfo?.pinnedUntilDate);
    setPinnedAfterDate(aInfo?.pinnedAfterDate);
    
  }, [aInfo]);

  if (aLoadable.state === 'loading') {
    return null;
  }
  if (aLoadable.state === 'hasError') {
    console.error(aLoadable.contents);
    return null;
  }

  //Student JSX
  if (role === 'student') {
    let nAttemptsAllowed = aInfo?.numberOfAttemptsAllowed;
    if (nAttemptsAllowed === null) {
      nAttemptsAllowed = 'unlimited';
    }
    let timeLimitJSX = null;
    if (aInfo?.timeLimit !== null){
      timeLimitJSX = <p>Time Limit: {aInfo?.timeLimit} minutes</p>
    }
    let assignedDateJSX = null;
    if (aInfo?.assignedDate !== null){
      assignedDateJSX = <p>Assigned: {aInfo?.assignedDate}</p>
    }
    let dueDateJSX = <p>No Due Date</p>
    if (aInfo?.dueDate !== null){
      dueDateJSX = <p>Due: {aInfo?.dueDate}</p>
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
        Limit Assigned
          <Switch
            onChange={(e) => {
              let valueDescription = 'Always';
              let value = null;
              if (e.currentTarget.checked) {

                valueDescription = 'Now';
                value = new Date().toLocaleString();
              }

              updateAssignment({
                doenetId,
                keyToUpdate: 'assignedDate',
                value,
                description: 'Assigned ',
                valueDescription,
              });
            }}
            checked={aInfo.assignedDate !== null}
          ></Switch>
        </label>
      </div>
      {aInfo.assignedDate !== null ? 
      <div>
        <label>
          Assigned Date
          <input
            required
            type="text"
            name="assignedDate"
            value={assignedDate}
            // placeholder="0001-01-01 01:01:01 "
            onBlur={() => {
              if (aInfo.assignedDate !== assignedDate) {
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'assignedDate',
                  value: assignedDate,
                  description: 'Assigned Date',
                });
              }
            }}
            onChange={(e) => setAssignedDate(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && aInfo.assignedDate !== assignedDate) {
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'assignedDate',
                  value: assignedDate,
                  description: 'Assigned Date',
                });
              }
            }}
          />
        </label>
      </div>
      : null }
       <div>
        <label>
        Has Due Date
          <Switch
            onChange={(e) => {
              let valueDescription = 'None';
              let value = null;
              if (e.currentTarget.checked) {

                valueDescription = 'Next Week';
                let nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7); //Default due seven days in the future
                value = nextWeek.toLocaleString();
              }

              updateAssignment({
                doenetId,
                keyToUpdate: 'dueDate',
                value,
                description: 'Due Date ',
                valueDescription,
              });
            }}
            checked={aInfo.dueDate !== null}
          ></Switch>
        </label>
      </div>
      {aInfo.dueDate !== null ? 
      <div>
        <label>
          Due Date
          <br />
          <input
            required
            type="text"
            name="dueDate"
            value={dueDate}
            // placeholder="0001-01-01 01:01:01 "
            onBlur={() => {
              if (aInfo.dueDate !== dueDate) {
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'dueDate',
                  value: dueDate,
                  description: 'Due Date',
                });
              }
            }}
            onChange={(e) => setDueDate(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && aInfo.dueDate !== dueDate) {
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'dueDate',
                  value: dueDate,
                  description: 'Due Date',
                });
              }
            }}
          />
        </label>
      </div> : null}

      <div>
        <label>
          Time Limit
          <Switch
            onChange={(e) => {
              let valueDescription = 'Not Limited';
              let value = null;
              if (e.currentTarget.checked) {
                valueDescription = '60 Minutes';
                value = '60';
              }

              updateAssignment({
                doenetId,
                keyToUpdate: 'timeLimit',
                value,
                description: 'Time Limit ',
                valueDescription,
              });
            }}
            checked={aInfo.timeLimit > 0}
          ></Switch>
        </label>
      </div>
      {aInfo.timeLimit > 0 ? (
        <div>
          <label>
            Time Limit in Minutes
            <input
              type="number"
              value={timeLimit}
              onBlur={() => {
                if (aInfo.timeLimit !== timeLimit) {
                  let valueDescription = `${timeLimit} Minutes`;
                  updateAssignment({
                    doenetId,
                    keyToUpdate: 'timeLimit',
                    value: timeLimit,
                    description: 'Time Limit',
                    valueDescription,
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && aInfo.timeLimit !== timeLimit) {
                  let valueDescription = `${timeLimit} Minutes`;
                  updateAssignment({
                    doenetId,
                    keyToUpdate: 'timeLimit',
                    value: timeLimit,
                    description: 'Time Limit',
                    valueDescription,
                  });
                }
              }}
              onChange={(e) => setTimeLimit(e.currentTarget.value)}
            />
            {/* <Increment
  key={`numAtt${aInfo?.doenetId}`}
    value={aInfo ? aInfo?.timeLimit : ''} 
    range={[0, 20]} 
    //Would be great if we could set the minimum range={[0,]} and max range={[,10]}
  //  onChange={handleChange}
    />  */}
          </label>
        </div>
      ) : null}

      {/* <div>aInfo = {aInfo?.limitAttempts ? 'true' : 'false'}</div>
<div>limitAttempts = {limitAttempts ? 'true' : 'false'}</div> */}
      <div>
        <label>
          Attempts Limit
          <Switch
            name="limitAttempts"
            onChange={(e) => {
              let valueDescription = 'Not Limited';
              let value = null;
              if (e.currentTarget.checked) {
                valueDescription = '1';
                value = '1';
              }

              updateAssignment({
                doenetId,
                keyToUpdate: 'numberOfAttemptsAllowed',
                value,
                description: 'Attempts Allowed ',
                valueDescription,
              });
            }}
            checked={aInfo.numberOfAttemptsAllowed > 0}
          ></Switch>
        </label>
      </div>
      {aInfo.numberOfAttemptsAllowed > 0 ? (
        <div>
          <label>
            Number of Attempts Allowed
            <input
              type="number"
              name="numberOfAttemptsAllowed"
              value={numberOfAttemptsAllowed}
              onBlur={() => {
                if (aInfo.numberOfAttemptsAllowed !== numberOfAttemptsAllowed) {
                  updateAssignment({
                    doenetId,
                    keyToUpdate: 'numberOfAttemptsAllowed',
                    value: numberOfAttemptsAllowed,
                    description: 'Attempts Allowed',
                  });
                }
              }}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  aInfo.numberOfAttemptsAllowed !== numberOfAttemptsAllowed
                ) {
                  updateAssignment({
                    doenetId,
                    keyToUpdate: 'numberOfAttemptsAllowed',
                    value: numberOfAttemptsAllowed,
                    description: 'Attempts Allowed',
                  });
                }
              }}
              onChange={(e) =>
                setNumberOfAttemptsAllowed(e.currentTarget.value)
              }
            />
            {/* <Increment
  key={`numAtt${aInfo?.doenetId}`}
    value={aInfo ? aInfo?.numberOfAttemptsAllowed : ''} 
    range={[0, 20]} 
    //Would be great if we could set the minimum range={[0,]} and max range={[,10]}
  //  onChange={handleChange}
    /> */}
          </label>
        </div>
      ) : null}
      <div>
        <label>
          Attempt Aggregation
          {/* {attemptAggregation} */}
          <select
            name="attemptAggregation"
            value={attemptAggregation}
            onChange={(e) => {
              let valueDescription = 'Maximum';
              if (e.currentTarget.value === 'l') {
                valueDescription = 'Last Attempt';
              }
              updateAssignment({
                doenetId,
                keyToUpdate: 'attemptAggregation',
                value: e.currentTarget.value,
                description: 'Attempt Aggregation',
                valueDescription,
              });
            }}
          >
            <option value="m">Maximum</option>
            <option value="l">Last Attempt</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Total Points Or Percent
          <input
            required
            type="number"
            name="totalPointsOrPercent"
            value={totalPointsOrPercent}
            onBlur={() => {
              if (aInfo.totalPointsOrPercent !== totalPointsOrPercent) {
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'totalPointsOrPercent',
                  value: totalPointsOrPercent,
                  description: 'Total Points Or Percent',
                });
              }
            }}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                aInfo.totalPointsOrPercent !== totalPointsOrPercent
              ) {
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'totalPointsOrPercent',
                  value: totalPointsOrPercent,
                  description: 'Total Points Or Percent',
                });
              }
            }}
            onChange={(e) => setTotalPointsOrPercent(e.currentTarget.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Grade Category
          <input
            required
            type="select"
            name="gradeCategory"
            value={gradeCategory}
            onBlur={() => {
              if (aInfo.gradeCategory !== gradeCategory) {
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'gradeCategory',
                  value: gradeCategory,
                  description: 'Grade Category',
                });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && aInfo.gradeCategory !== gradeCategory) {
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'gradeCategory',
                  value: gradeCategory,
                  description: 'Grade Category',
                });
              }
            }}
            onChange={(e) => setGradeCategory(e.currentTarget.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Individualize
          <Switch
            name="individualize"
            onChange={(e) => {
              let valueDescription = 'False';
              if (e.currentTarget.checked) {
                valueDescription = 'True';
              }
              updateAssignment({
                doenetId,
                keyToUpdate: 'individualize',
                value: e.currentTarget.checked,
                description: 'Individualize',
                valueDescription,
              });
            }}
            checked={individualize}
          ></Switch>
        </label>
      </div>

      <div>
        <label>
          Show Solution
          <Switch
            name="showSolution"
            onChange={(e) => {
              let valueDescription = 'False';
              if (e.currentTarget.checked) {
                valueDescription = 'True';
              }
              updateAssignment({
                doenetId,
                keyToUpdate: 'showSolution',
                value: e.currentTarget.checked,
                description: 'Show Solution',
                valueDescription,
              });
            }}
            checked={showSolution}
          ></Switch>
        </label>
      </div>

      <div>
        <label>
          Show Solution In Gradebook
          <Switch
            name="showSolutionInGradebook"
            onChange={(e) => {
              let valueDescription = 'False';
              if (e.currentTarget.checked) {
                valueDescription = 'True';
              }
              updateAssignment({
                doenetId,
                keyToUpdate: 'showSolutionInGradebook',
                value: e.currentTarget.checked,
                description: 'Show Solution In Gradebook',
                valueDescription,
              });
            }}
            checked={showSolutionInGradebook}
          ></Switch>
        </label>
      </div>

      <div>
        <label>
          Show Feedback
          <Switch
            name="showFeedback"
            onChange={(e) => {
              let valueDescription = 'False';
              if (e.currentTarget.checked) {
                valueDescription = 'True';
              }
              updateAssignment({
                doenetId,
                keyToUpdate: 'showFeedback',
                value: e.currentTarget.checked,
                description: 'Show Feedback',
                valueDescription,
              });
            }}
            checked={showFeedback}
          ></Switch>
        </label>
      </div>

      <div>
        <label>
          Show Hints
          <Switch
            name="showHints"
            onChange={(e) => {
              let valueDescription = 'False';
              if (e.currentTarget.checked) {
                valueDescription = 'True';
              }
              updateAssignment({
                doenetId,
                keyToUpdate: 'showHints',
                value: e.currentTarget.checked,
                description: 'Show Hints',
                valueDescription,
              });
            }}
            checked={showHints}
          ></Switch>
        </label>
      </div>

      <div>
        <label>
          Show Correctness
          <Switch
            name="showCorrectness"
            onChange={(e) => {
              let valueDescription = 'False';
              if (e.currentTarget.checked) {
                valueDescription = 'True';
              }
              updateAssignment({
                doenetId,
                keyToUpdate: 'showCorrectness',
                value: e.currentTarget.checked,
                description: 'Show Correctness',
                valueDescription,
              });
            }}
            checked={showCorrectness}
          ></Switch>
        </label>
      </div>

      <div>
        <label>
          Proctor Makes Available
          <Switch
            name="proctorMakesAvailable"
            onChange={(e) => {
              let valueDescription = 'False';
              if (e.currentTarget.checked) {
                valueDescription = 'True';
              }
              updateAssignment({
                doenetId,
                keyToUpdate: 'proctorMakesAvailable',
                value: e.currentTarget.checked,
                description: 'Proctor Makes Available',
                valueDescription,
              });
            }}
            checked={proctorMakesAvailable}
          ></Switch>
        </label>
      </div>

      

      <div>
        Pin Assignment
          <Switch
          onChange={(e) => {
            let valueDescription = 'None';
            let value = null;
            let secondValue = null;
            //Start date
            if (e.currentTarget.checked) {

              valueDescription = 'Now to Next Year';
              let today = new Date(); //Default start now
              value = today.toLocaleString();

              let nextWeek = new Date();
              nextWeek.setDate(nextWeek.getDate() + 365); //Default due seven days in the future
              secondValue = nextWeek.toLocaleString();
            }

            updateAssignment({
              doenetId,
              keyToUpdate: 'pinnedAfterDate',
              value,
              description: 'Pinned Dates ',
              valueDescription,
              secondKeyToUpdate: 'pinnedUntilDate',
              secondValue
            });

            //End Date
            // if (e.currentTarget.checked) {

           
            // }

            // updateAssignment({
            //   doenetId,
            //   keyToUpdate: 'pinnedUntilDate',
            //   value,
            //   description: 'Pinned Until Date ',
            //   valueDescription,
            // });


          }}
          
            checked={aInfo.pinnedUntilDate !== null}
          ></Switch>
      </div>
      {aInfo.pinnedUntilDate !== null ? 
      <>
      <div>
      <label>
        Pinned After Date
        <input
          required
          type="text"
          name="pinnedAfterDate"
          value={pinnedAfterDate}
          // placeholder="0001-01-01 01:01:01 "
          onBlur={() => {
            if (aInfo.pinnedAfterDate !== pinnedAfterDate) {
              updateAssignment({
                doenetId,
                keyToUpdate: 'pinnedAfterDate',
                value: pinnedAfterDate,
                description: 'Pinned After Date',
              });
            }
          }}
          onChange={(e) => setPinnedAfterDate(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && aInfo.pinnedAfterDate !== pinnedAfterDate) {
              updateAssignment({
                doenetId,
                keyToUpdate: 'pinnedAfterDate',
                value: pinnedAfterDate,
                description: 'Pinned After Date',
              });
            }
          }}
        />
      </label>
    </div>
      <div>
        <label>
          Pinned Until Date
          <input
            required
            type="text"
            name="pinnedUntilDate"
            value={pinnedUntilDate}
            // placeholder="0001-01-01 01:01:01 "
            onBlur={() => {
              if (aInfo.pinnedUntilDate !== pinnedUntilDate) {
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'pinnedUntilDate',
                  value: pinnedUntilDate,
                  description: 'Pinned Until Date',
                });
              }
            }}
            onChange={(e) => setPinnedUntilDate(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && aInfo.pinnedUntilDate !== pinnedUntilDate) {
                updateAssignment({
                  doenetId,
                  keyToUpdate: 'pinnedUntilDate',
                  value: pinnedUntilDate,
                  description: 'Pinned Until Date',
                });
              }
            }}
          />
        </label>
      </div>
      </>
      : null }


      
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
