import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import {
  atom,
  selector,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilState,
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
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';
import Increment from '../../../_reactComponents/PanelHeaderComponents/IncrementMenu';
import useSockets from '../../../_reactComponents/Sockets';
import { pageToolViewAtom } from '../NewToolRoot';
import {
  itemHistoryAtom,
  assignmentDictionarySelector,
  useAssignment,
} from '../ToolHandlers/CourseToolHandler';
import { useAssignmentCallbacks } from '../../../_reactComponents/Drive/DriveActions';
import { useToast } from '../Toast';
import Switch from '../../_framework/Switch';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import axios from 'axios';

export const selectedVersionAtom = atom({
  key: 'selectedVersionAtom',
  default: '',
});


export default function SelectedDoenetML() {
  const [pageToolView,setPageToolView] = useRecoilState(pageToolViewAtom);
  const role = pageToolView.view;
  const item = useRecoilValue(selectedInformation)[0];
  let [label,setLabel] = useState('');
  const { deleteItem, renameItem } = useSockets('drive');

  useEffect(()=>{
    setLabel(item?.label)
  },[item?.label])


  const assignUnassign = useRecoilCallback(({set,snapshot})=> async (doenetId)=>{
    console.log(">>>>assignUnassign doenetId",doenetId)
  })

  if (!item){ return null;}

  if (role === 'student'){
    return <>
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
    <AssignmentSettings role={role} item={item} />
    </>
  }
  let assignDraftLabel = "Assign Current Draft";
  if (item.isReleased === "1"){ assignDraftLabel = "Unassign Content";}

  function renameItemCallback(newLabel,item){
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
  return <>
  <h2 data-cy="infoPanelItemLabel">
      <FontAwesomeIcon icon={faCode} /> {item.label}
    </h2>
  <ActionButtonGroup vertical >
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
<br />
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
                renameItemCallback(label,item);
              }
            }
          }}
          onBlur={() => {
            //Only rename if label has changed
            if (item.label !== label) {
              renameItemCallback(label,item);
            }
          }}
        />
      </label>
<br />
<br />
<Button 
width="menu" 
value={assignDraftLabel}
onClick={()=>assignUnassign(item.doenetId)}
/>

<br />
<AssignmentSettings role={role} item={item} />
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
}

//For item we just need label and doenetId
export function AssignmentSettings({role, item}) {
  
  const aLoadable = useRecoilValueLoadable(loadAssignmentSelector(item.doenetId))
  const aInfo = aLoadable.contents;
  const addToast = useToast();

  //Note if aLoadable is not loaded then these will default to undefined
  let [assignedDate,setAssignedDate] = useState('')
  let [dueDate,setDueDate] = useState('')
  let [numberOfAttemptsAllowed,setNumberOfAttemptsAllowed] = useState(1)
  

  const updateAssignment = useRecoilCallback(({set,snapshot})=> async (doenetId,keyToUpdate,value)=>{
    const oldAInfo = await snapshot.getPromise(loadAssignmentSelector(doenetId))
    let newAInfo = {...oldAInfo,[keyToUpdate]:value}
    set(loadAssignmentSelector(doenetId),newAInfo);

    const resp = await axios.post('/api/saveAssignmentToDraft.php', newAInfo)
    
    if (resp.data.success){
      addToast(`Updated ${keyToUpdate} to ${value}`)
    }
    // set(loadAssignmentSelector(doenetId),(was)=>{
    //   return {...was,[keyToUpdate]:value}
    // });

  },[addToast])

  //Update assignment values when selection changes
  useEffect(()=>{
      setAssignedDate(aInfo?.assignedDate)
      setDueDate(aInfo?.dueDate)
      setNumberOfAttemptsAllowed(aInfo?.numberOfAttemptsAllowed)
  },[aInfo])

  if (aLoadable.state === "loading"){ return null;}
    if (aLoadable.state === "hasError"){ 
      console.error(aLoadable.contents)
      return null;}

  // console.log(">>>>SelectedDoenetML role",role)
  // console.log(">>>>SelectedDoenetML item",item)
  // console.log(">>>>SelectedDoenetML aInfo",aInfo)


  //Student JSX
  if (role === 'student'){
    return <>
    <div>
        <p>Due: {aInfo?.dueDate}</p>
        <p>Time Limit: {aInfo?.timeLimit} minutes</p>
        <p>Attempts Allowed: {aInfo?.numberOfAttemptsAllowed}</p>
        <p>Points: {aInfo?.totalPointsOrPercent}</p>
      </div>
  </>
  }


  //Instructor JSX
  return <>

<div>
<label>Assigned Date
<input
  required
  type="text"
  name="assignedDate"
  value={assignedDate}
  // placeholder="0001-01-01 01:01:01 "
  onBlur={()=>{
    if (aInfo.assignedDate !== assignedDate){
      updateAssignment(item.doenetId,'assignedDate',assignedDate)
    }}}
  onChange={(e)=>setAssignedDate(e.currentTarget.value)}
  onKeyDown={(e)=>{
    if (e.key === 'Enter' && aInfo.assignedDate !== assignedDate){
      updateAssignment(item.doenetId,'assignedDate',assignedDate)
    }
  }}
/>
</label>
</div>

<div>
<label>Due Date
  <br />
<input
  required
  type="text"
  name="dueDate"
  value={dueDate}
  // placeholder="0001-01-01 01:01:01 "
  onBlur={()=>{
    if (aInfo.dueDate !== dueDate){
      updateAssignment(item.doenetId,'dueDate',dueDate)
    }}}
  onChange={(e)=>setDueDate(e.currentTarget.value)}
  onKeyDown={(e)=>{
    if (e.key === 'Enter' && aInfo.dueDate !== dueDate){
      updateAssignment(item.doenetId,'dueDate',dueDate)
    }
  }}
/>
</label>
</div>
{/* <div>
<label>Time Limit:
<input
  required
  type="number"
  name="timeLimit"
  value={timeLimit}
  // placeholder="01:01:01"
  // onBlur={}
  // onChange={}
/>
</label>
</div> */}
<div>
  <label>Number of Attempts Allowed
  {/* <Increment
  key={`numAtt${aInfo?.doenetId}`}
    value={aInfo ? aInfo?.numberOfAttemptsAllowed : ''} 
    range={[0, 20]} 
  //  onChange={handleChange}
    /> */}
  <input
    required
    type="number"
    name="numberOfAttemptsAllowed"
    value={numberOfAttemptsAllowed}
    onBlur={()=>{
      if (aInfo.numberOfAttemptsAllowed !== numberOfAttemptsAllowed){
        updateAssignment(item.doenetId,'numberOfAttemptsAllowed',numberOfAttemptsAllowed)
      }
    }}
    onKeyDown={(e)=>{
      if (e.key === 'Enter' && aInfo.numberOfAttemptsAllowed !== numberOfAttemptsAllowed){
        updateAssignment(item.doenetId,'numberOfAttemptsAllowed',numberOfAttemptsAllowed)
      }
    }}
    onChange={(e)=>setNumberOfAttemptsAllowed(e.currentTarget.value)}
  />
  </label>
</div>
         {/*  <div>
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
          </div> */}

</>
}


export  function SelectedDoenetML2() {
  const [pageToolView,setPageToolView] = useRecoilState(pageToolViewAtom);
  const role = pageToolView.view;
  // const setSelectedMenu = useSetRecoilState(selectedMenuPanelAtom);
  const selection = useRecoilValueLoadable(selectedInformation).getValue();
  const item = selection[0];
  // console.log(">>>>SelectedDoenetML selection",selection)
  // const [item, setItem] = useState(selection[0]); 
  const [label, setLabel] = useState(item?.label ?? '');
  console.log(">>>>SelectedDoenetML role",role)
  console.log(">>>>SelectedDoenetML item",item)
  console.log(">>>>SelectedDoenetML label",label)

  const { deleteItem, renameItem } = useSockets('drive');
  const {
    addContentAssignment,
    // changeSettings,
    updateVersionHistory,
    // saveSettings,
    assignmentToContent,
    // loadAvailableAssignment,
    // publishContentAssignment,
    onAssignmentError,
  } = useAssignment();
  const { 
    makeAssignment, 
    convertAssignmentToContent } = useAssignmentCallbacks();
  const [checkIsAssigned, setIsAssigned] = useState(false);
  const addToast = useToast();
  const versionHistory = useRecoilValueLoadable(
    itemHistoryAtom(item?.doenetId),
  );

  // useEffect(() => {
  //   if (!selection[0]) {
  //     setSelectedMenu('');
  //   } else {
  //     setItem(selection[0]);
  //     setLabel(selection[0]?.label);
  //   }
  // }, [selection, setSelectedMenu]);

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

  let doenetMLActions = <ActionButtonGroup vertical >
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
  

  if (role === 'student'){
    return <>
    <h2 data-cy="infoPanelItemLabel">
      {dIcon} {item.label}
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
          doenetId: item.doenetId,
        },
      });
    }}
    />
  </>
  }

  let assigned = (
    <>
      {versionHistory.contents.named.map((item, i) => (
        <>
          {item.isReleased == '1' ? (
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
  );

  // unassign
  let unAssignButton = null;

  unAssignButton = (
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
  );

  return (
    <>
      <h2 data-cy="infoPanelItemLabel">
        {dIcon} {item.label}
      </h2>
      {doenetMLActions}
    <br />
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

      {assigned}
      <ButtonGroup vertical>
        {item?.isAssigned === '0' &&
          item?.isReleased === '1' &&
          makeAssignmentforReleasedButton}
        {item?.isAssigned == '1' && item?.isReleased === '1' && unAssignButton}
      </ButtonGroup>
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
    let folderInfo = get(folderDictionary({driveId,folderId}));
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

const AssignmentForm2 = (props) => {
  const { changeSettings, saveSettings, onAssignmentError } = useAssignment();
  const { updateAssignmentTitle } = useAssignmentCallbacks();
  const addToast = useToast();
  const pageToolView = useRecoilValue(pageToolViewAtom);
  console.log(">>>>pageToolView?.view",pageToolView?.view)

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
            <Increment
            key={`numAtt${aInfo?.doenetId}`}
             value={aInfo ? aInfo?.numberOfAttemptsAllowed : ''} 
             range={[0, 20]} 
            //  onChange={handleChange}
             />
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
  let studentAInfo = (
    <>
      <div>
        <p>Due: {aInfo?.dueDate}</p>
        <p>Time Limit: {aInfo?.timeLimit}</p>
        <p>Number of Attempts Allowed: {aInfo?.numberOfAttemptsAllowed}</p>
        <p>Points: {aInfo?.totalPointsOrPercent}</p>
      </div>
    </>
  );

  return (
    <>
      {pageToolView?.view == 'student' ? <>{studentAInfo}</> : ''}
      {pageToolView?.view == 'instructor' ? <>{assignmentForm}</> : ' '}
    </>
  );
};
