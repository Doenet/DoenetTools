import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import {
  atom,
  selector,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import {
  folderDictionaryFilterSelector,
  globalSelectedNodesAtom,
} from '../../../_reactComponents/Drive/NewDrive';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import IncrementMenu from '../../../_reactComponents/PanelHeaderComponents/IncrementMenu';
import useSockets from '../../../_reactComponents/Sockets';
import { pageToolViewAtom } from '../NewToolRoot';
import {
  itemHistoryAtom,
  assignmentDictionarySelector,
} from '../ToolHandlers/CourseToolHandler';
import { useAssignment } from '../../../Tools/course/CourseActions';
import { useAssignmentCallbacks } from '../../../_reactComponents/Drive/DriveActions';
import { useToast } from '../Toast';
import axios from 'axios';
import Switch from '../../_framework/Switch';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';

export const selectedVersionAtom = atom({
  key: 'selectedVersionAtom',
  default: '',
});

export default function SelectedDoenetML() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const setSelectedMenu = useSetRecoilState(selectedMenuPanelAtom);
  const selection = useRecoilValueLoadable(selectedInformation).getValue();
  const [item, setItem] = useState(selection[0]);
  const [label, setLabel] = useState(selection[0]?.label ?? '');
  const { deleteItem, renameItem } = useSockets('drive');
  const {
    addContentAssignment,
    changeSettings,
    updateVersionHistory,
    saveSettings,
    assignmentToContent,
    loadAvailableAssignment,
    publishContentAssignment,
    onAssignmentError,
  } = useAssignment();
  const { makeAssignment, convertAssignmentToContent } =
    useAssignmentCallbacks();
  const [checkIsAssigned, setIsAssigned] = useState(false);
  const addToast = useToast();
  const versionHistory = useRecoilValueLoadable(
    itemHistoryAtom(item?.doenetId),
  );

  useEffect(() => {
    if (!selection[0]) {
      setSelectedMenu('');
    } else {
      setItem(selection[0]);
      setLabel(selection[0]?.label);
    }
  }, [selection, setSelectedMenu]);

  const dIcon = <FontAwesomeIcon icon={faCode} />;
  let makeAssignmentforReleasedButton = null;

  const renameItemCallback = (newLabel) => {
    renameItem({
      driveIdFolderId: {
        driveId: item.driveId,
        folderId: item.parentFolderId,
      },
      itemId: item.itemId,
      itemType: item.itemType,
      newLabel: newLabel,
    });
  };

  let contentId = '';
  let versionId = '';
  if (versionHistory.state === 'loading') {
    return null;
  }
  if (versionHistory.state === 'hasError') {
    console.error(versionHistory.contents);
    return null;
  }
  if (versionHistory.state === 'hasValue') {
    contentId = versionHistory?.contents?.named[0]?.contentId;
    versionId = versionHistory?.contents?.named[0]?.versionId;
  }

  let assigned = (
    <>
      {versionHistory.contents.named.map((item, i) => (
        <>
          {item.isReleased == 1 ? (
            <label key={i} value={item.versionId}>
              {item.isAssigned == '1' ? '(Assigned)' : ''}
              {item.title}
            </label>
          ) : (
            ''
          )}
        </>
      ))}
    </>
  );

  // make assignment for released versions

  makeAssignmentforReleasedButton = (
    <>
      <Button
        value="Make Assignment"
        onClick={async () => {
          setIsAssigned(true);
          let isAssigned = 1;

          const versionResult = await updateVersionHistory(
            item?.doenetId,
            versionId,
            isAssigned,
          );

          const result = await addContentAssignment({
            driveIditemIddoenetIdparentFolderId: {
              driveId: item?.driveId,
              folderId: item?.parentFolderId,
              itemId: item?.itemId,
              doenetId: item?.doenetId,
              contentId: contentId,
              versionId: versionId,
            },
            doenetId: item?.doenetId,
            contentId: contentId,
            versionId: versionId,
          });
          let payload = {
            // ...aInfo,
            itemId: item?.itemId,
            isAssigned: '1',
            doenetId: item?.doenetId,
            contentId: contentId,
            driveId: item?.driveId,
            versionId: versionId,
          };
          //TODO update drive actions
          makeAssignment({
            driveIdFolderId: {
              driveId: item?.driveId,
              folderId: item?.parentFolderId,
            },
            itemId: item?.itemId,
            payload: payload,
          });
          try {
            if (result.success && versionResult) {
              addToast(`Add new assignment`);
            } else {
              onAssignmentError({ errorMessage: result.message });
            }
          } catch (e) {
            onAssignmentError({ errorMessage: e });
          }
        }}
      />

      <br />
    </>
  );

  // unassign
  let unAssignButton = '';

  unAssignButton = (
    <>
      <Button
        value="Unassign"
        onClick={async () => {
          let isAssigned = 0;
          const versionResult = await updateVersionHistory(
            item?.doenetId,
            versionId,
            isAssigned,
          );

          assignmentToContent({
            driveIditemIddoenetIdparentFolderId: {
              driveId: item?.driveId,
              folderId: item?.parentFolderId,
              itemId: item?.itemId,
              doenetId: item?.doenetId,
              contentId: contentId,
              versionId: versionId,
            },
            doenetId: item?.doenetId,
            contentId: contentId,
            versionId: versionId,
          });
          //TODO update drive actions

          convertAssignmentToContent({
            driveIdFolderId: {
              driveId: item?.driveId,
              folderId: item?.parentFolderId,
            },
            itemId: item?.itemId,
            doenetId: item?.doenetId,
            contentId: contentId,
            versionId: versionId,
          });

          const result = axios.post(`/api/handleMakeContent.php`, {
            itemId: item?.itemId,
            doenetId: item?.doenetId,
            contentId: contentId,
            versionId: versionId,
          });
          result
            .then((resp) => {
              if (resp.data.success) {
                addToast(`'UnAssigned ''`);
              } else {
                onAssignmentError({ errorMessage: resp.data.message });
              }
            })
            .catch((e) => {
              onAssignmentError({ errorMessage: e.message });
            });
        }}
      />
      <br />
      <br />
    </>
  );

  return (
    <>
      <h2 data-cy="infoPanelItemLabel">
        {dIcon} {item.label}
      </h2>

      <label>
        DoenetML Label
        <input
          type="text"
          data-cy="infoPanelItemLabelInput"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              //Only rename if label has changed
              if (item.label !== label) {
                renameItemCallback(label);
              }
            }
          }}
          onBlur={() => {
            //Only rename if label has changed
            if (item.label !== label) {
              renameItemCallback(label);
            }
          }}
        />
      </label>
      <br />
      <br />
      <Button
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
      <br />
      <Button
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
      {assigned}
      <br />
      {item?.isAssigned === '0' &&
        item?.isReleased === '1' &&
        makeAssignmentforReleasedButton}
      <br />
      {item?.isAssigned == '1' && item?.isReleased === '1' && unAssignButton}
      <br />
      {item?.isAssigned == '1' && item?.isReleased === '1' && (
        <AssignmentForm
          selection={item}
          versionId={versionId}
          contentId={contentId}
        />
      )}
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
    // let folderInfo = get(folderDictionary({driveId,folderId}));
    let folderInfo = get(folderDictionaryFilterSelector({ driveId, folderId }));
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

const AssignmentForm = (props) => {
  const { changeSettings, saveSettings, onAssignmentError } = useAssignment();
  const { updateAssignmentTitle } = useAssignmentCallbacks();
  const addToast = useToast();

  const [oldValue, setoldValue] = useState();

  const assignmentInfoSettings = useRecoilValueLoadable(
    assignmentDictionarySelector({
      driveId: props.selection?.driveId,
      folderId: props.selection?.parentFolderId,
      itemId: props.selection?.itemId,
      doenetId: props.selection?.doenetId,
      versionId: props.versionId,
      contentId: props.contentId,
    }),
  );

  let aInfo = '';

  if (assignmentInfoSettings?.state === 'hasValue') {
    aInfo = assignmentInfoSettings?.contents;
  }
  // form update functions
  const handleOnBlur = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value;
    if (value !== oldValue) {
      const result = saveSettings({
        [name]: value,
        driveIditemIddoenetIdparentFolderId: {
          driveId: props.selection?.driveId,
          folderId: props.selection?.parentFolderId,
          itemId: props.selection?.itemId,
          doenetId: props.selection?.doenetId,
          versionId: props.versionId,
          contentId: props.contentId,
        },
      });
      let payload = {
        ...aInfo,
        itemId: props.selection?.itemId,
        isAssigned: '1',
        [name]: value,
        doenetId: props.selection?.doenetId,
        contentId: props.contentId,
      };
      updateAssignmentTitle({
        driveIdFolderId: {
          driveId: props.selection?.driveId,
          folderId: props.selection?.parentFolderId,
        },
        itemId: props.selection?.itemId,
        payloadAssignment: payload,
        doenetId: props.selection?.doenetId,
        contentId: props.contentId,
      });

      result
        .then((resp) => {
          if (resp.data.success) {
            addToast(`Updated '${name}' to '${value}'`);
          } else {
            onAssignmentError({ errorMessage: resp.data.message });
          }
        })
        .catch((e) => {
          onAssignmentError({ errorMessage: e.message });
        });
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    let name = event.target.name;
    let value = event.target.value;
    const result = changeSettings({
      [name]: value,
      driveIditemIddoenetIdparentFolderId: {
        driveId: props.selection?.driveId,
        folderId: props.selection?.parentFolderId,
        itemId: props.selection?.itemId,
        doenetId: props.selection?.doenetId,
        versionId: props.versionId,
        contentId: props.contentId,
      },
    });
  };
  const handleOnfocus = (event) => {
    event.preventDefault();
    let name = event.target.name;
    let value = event.target.value;
    setoldValue(event.target.value);
  };
  // Assignment Info
  let assignmentForm = (
    <>
      {
        <>
          <h3>Assignment Info</h3>
          <div>
            <label>Assigned Date:</label>
            <input
              required
              type="text"
              name="assignedDate"
              value={aInfo ? aInfo?.assignedDate : ''}
              placeholder="0001-01-01 01:01:01 "
              onBlur={handleOnBlur}
              onChange={handleChange}
              onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Due date: </label>
            <input
              required
              type="text"
              name="dueDate"
              value={aInfo ? aInfo?.dueDate : ''}
              placeholder="0001-01-01 01:01:01"
              onBlur={handleOnBlur}
              onChange={handleChange}
              onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Time Limit:</label>
            <input
              required
              type="time"
              name="timeLimit"
              value={aInfo ? aInfo?.timeLimit : ''}
              placeholder="01:01:01"
              onBlur={handleOnBlur}
              onChange={handleChange}
              onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Number Of Attempts:</label>
            <IncrementMenu range={[0, 20]} />
            <input
              required
              type="number"
              name="numberOfAttemptsAllowed"
              value={aInfo ? aInfo?.numberOfAttemptsAllowed : ''}
              onBlur={handleOnBlur}
              onChange={handleChange}
              onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Attempt Aggregation :</label>
            <select name="attemptAggregation" onChange={handleOnBlur}>
              <option
                value="m"
                selected={aInfo?.attemptAggregation === 'm' ? 'selected' : ''}
              >
                Maximum
              </option>
              <option
                value="l"
                selected={aInfo?.attemptAggregation === 'l' ? 'selected' : ''}
              >
                Last Attempt
              </option>
            </select>
          </div>
          <div>
            <label>Total Points Or Percent: </label>
            <input
              required
              type="number"
              name="totalPointsOrPercent"
              value={aInfo ? aInfo?.totalPointsOrPercent : ''}
              onBlur={handleOnBlur}
              onChange={handleChange}
              onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Grade Category: </label>
            <input
              required
              type="select"
              name="gradeCategory"
              value={aInfo ? aInfo?.gradeCategory : ''}
              onBlur={handleOnBlur}
              onChange={handleChange}
              onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Individualize: </label>
            <Switch
              name="individualize"
              onChange={handleOnBlur}
              checked={aInfo ? aInfo?.individualize : false}
            ></Switch>
          </div>
          <div>
            <label>Multiple Attempts: </label>
            <Switch
              name="multipleAttempts"
              onChange={handleOnBlur}
              checked={aInfo ? aInfo?.multipleAttempts : false}
            ></Switch>
          </div>
          <div>
            <label>Show solution: </label>
            <Switch
              name="showSolution"
              onChange={handleOnBlur}
              checked={aInfo ? aInfo?.showSolution : false}
            ></Switch>
          </div>
          <div>
            <label>Show feedback: </label>
            <Switch
              name="showFeedback"
              onChange={handleOnBlur}
              checked={aInfo ? aInfo?.showFeedback : false}
            ></Switch>
          </div>
          <div>
            <label>Show hints: </label>
            <Switch
              name="showHints"
              onChange={handleOnBlur}
              checked={aInfo ? aInfo?.showHints : false}
            ></Switch>
          </div>
          <div>
            <label>Show correctness: </label>
            <Switch
              name="showCorrectness"
              onChange={handleOnBlur}
              checked={aInfo ? aInfo?.showCorrectness : false}
            ></Switch>
          </div>
          <div>
            <label>Proctor make available: </label>
            <Switch
              name="proctorMakesAvailable"
              onChange={handleOnBlur}
              checked={aInfo ? aInfo?.proctorMakesAvailable : false}
            ></Switch>
          </div>
          <br />
        </>
      }
    </>
  );
  return <>{assignmentForm}</>;
};
