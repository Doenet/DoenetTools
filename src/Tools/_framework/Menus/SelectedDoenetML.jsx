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
}

//For item we just need label and doenetId
export function AssignmentSettings({role, doenetId}) {
  
  //Consider getValue() but need Suspense
  const aLoadable = useRecoilValueLoadable(loadAssignmentSelector(doenetId))
  const aInfo = aLoadable.contents;
  const addToast = useToast();

  //Note if aLoadable is not loaded then these will default to undefined
  let [assignedDate,setAssignedDate] = useState('')
  let [dueDate,setDueDate] = useState('')
  let [multipleAttempts,setMultipleAttempts] = useState(true)
  let [numberOfAttemptsAllowed,setNumberOfAttemptsAllowed] = useState(1)
  let [attemptAggregation,setAttemptAggregation] = useState('')
  let [totalPointsOrPercent,setTotalPointsOrPercent] = useState(100)
  let [gradeCategory,setGradeCategory] = useState('')
  let [individualize,setIndividualize] = useState(true)
  let [showSolution,setShowSolution] = useState(true)
  let [showFeedback,setShowFeedback] = useState(true)
  let [showHints,setShowHints] = useState(true)
  let [showCorrectness,setShowCorrectness] = useState(true)
  let [proctorMakesAvailable,setProctorMakesAvailable] = useState(true)
  

  const updateAssignment = useRecoilCallback(({set,snapshot})=> async ({doenetId,keyToUpdate,value,description,valueDescription=null})=>{
    const oldAInfo = await snapshot.getPromise(loadAssignmentSelector(doenetId))
    let newAInfo = {...oldAInfo,[keyToUpdate]:value}
    set(loadAssignmentSelector(doenetId),newAInfo);

    const resp = await axios.post('/api/saveAssignmentToDraft.php', newAInfo)

    if (resp.data.success){
      if (valueDescription){
        addToast(`Updated ${description} to ${valueDescription}`)

      }else{
        addToast(`Updated ${description} to ${value}`)
      }
    }
    // set(loadAssignmentSelector(doenetId),(was)=>{
    //   return {...was,[keyToUpdate]:value}
    // });

  },[addToast])

  //Update assignment values when selection changes
  useEffect(()=>{
      setAssignedDate(aInfo?.assignedDate)
      setDueDate(aInfo?.dueDate)
      setMultipleAttempts(aInfo?.multipleAttempts)
      setNumberOfAttemptsAllowed(aInfo?.numberOfAttemptsAllowed)
      setAttemptAggregation(aInfo?.attemptAggregation)
      setTotalPointsOrPercent(aInfo?.totalPointsOrPercent)
      setGradeCategory(aInfo?.gradeCategory)
      setIndividualize(aInfo?.individualize)
      setShowSolution(aInfo?.showSolution)
      setShowFeedback(aInfo?.showFeedback)
      setShowHints(aInfo?.showHints)
      setShowCorrectness(aInfo?.showCorrectness)
      setProctorMakesAvailable(aInfo?.proctorMakesAvailable)
      // console.log(">>>>aInfo?.multipleAttempts",aInfo?.multipleAttempts)
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
      updateAssignment({doenetId,keyToUpdate:'assignedDate',value:assignedDate,description:'Assigned Date'})
    }}}
  onChange={(e)=>setAssignedDate(e.currentTarget.value)}
  onKeyDown={(e)=>{
    if (e.key === 'Enter' && aInfo.assignedDate !== assignedDate){
      updateAssignment({doenetId,keyToUpdate:'assignedDate',value:assignedDate,description:'Assigned Date'})
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
      updateAssignment({doenetId,keyToUpdate:'dueDate',value:dueDate,description:'Due Date'})
    }}}
  onChange={(e)=>setDueDate(e.currentTarget.value)}
  onKeyDown={(e)=>{
    if (e.key === 'Enter' && aInfo.dueDate !== dueDate){
      updateAssignment({doenetId,keyToUpdate:'dueDate',value:dueDate,description:'Due Date'})
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
  // onBlur={}
  // onChange={}
/>
</label>
</div> */}
{/* <div>aInfo = {aInfo?.multipleAttempts ? 'true' : 'false'}</div>
<div>multipleAttempts = {multipleAttempts ? 'true' : 'false'}</div> */}
<div>
  <label>Multiple Attempts 
  <Switch
    name="multipleAttempts"
    onChange={(e)=>{
      let valueDescription = 'False';
      if (e.currentTarget.checked){
        valueDescription = 'True'
        //TODO: Set Number of Attempts allowed to 1 ???
      }
      updateAssignment({doenetId,keyToUpdate:'multipleAttempts',value:e.currentTarget.checked,description:'Multiple Attempts',valueDescription})
      }}
    checked={multipleAttempts}
  ></Switch>
  </label>
</div>
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
        updateAssignment({doenetId,keyToUpdate:'numberOfAttemptsAllowed',value:numberOfAttemptsAllowed,description:'Attempts Allowed'})
      }
    }}
    onKeyDown={(e)=>{
      if (e.key === 'Enter' && aInfo.numberOfAttemptsAllowed !== numberOfAttemptsAllowed){
        updateAssignment({doenetId,keyToUpdate:'numberOfAttemptsAllowed',value:numberOfAttemptsAllowed,description:'Attempts Allowed'})
      }
    }}
    onChange={(e)=>setNumberOfAttemptsAllowed(e.currentTarget.value)}
  />
  </label>
</div>
<div>
<label>Attempt Aggregation 
  {/* {attemptAggregation} */}
<select name="attemptAggregation" value={attemptAggregation} onChange={(e)=>{
  let valueDescription = 'Maximum';
  if (e.currentTarget.value === 'l'){
    valueDescription = 'Last Attempt'
  }
  updateAssignment({doenetId,keyToUpdate:'attemptAggregation',value:e.currentTarget.value,description:'Attempt Aggregation',valueDescription})
}}>
  <option
    value="m"
  >
    Maximum
  </option>
  <option
    value="l"
  >
    Last Attempt
  </option>
</select>
</label>
</div>

      
<div>
  <label>Total Points Or Percent: 
  <input
    required
    type="number"
    name="totalPointsOrPercent"
    value={totalPointsOrPercent}
    onBlur={()=>{
      if (aInfo.totalPointsOrPercent !== totalPointsOrPercent){
        updateAssignment({doenetId,keyToUpdate:'totalPointsOrPercent',value:totalPointsOrPercent,description:'Total Points Or Percent'})
      }
    }}
    onKeyDown={(e)=>{
      if (e.key === 'Enter' && aInfo.totalPointsOrPercent !== totalPointsOrPercent){
        updateAssignment({doenetId,keyToUpdate:'totalPointsOrPercent',value:totalPointsOrPercent,description:'Total Points Or Percent'})
      }
    }}
    onChange={(e)=>setTotalPointsOrPercent(e.currentTarget.value)}
  />
  </label>
</div>

              
<div>
  <label>Grade Category
  <input
    required
    type="select"
    name="gradeCategory"
    value={gradeCategory}
    onBlur={()=>{
      if (aInfo.gradeCategory !== gradeCategory){
        updateAssignment({doenetId,keyToUpdate:'gradeCategory',value:gradeCategory,description:'Grade Category'})
      }
    }}
    onKeyDown={(e)=>{
      if (e.key === 'Enter' && aInfo.gradeCategory !== gradeCategory){
        updateAssignment({doenetId,keyToUpdate:'gradeCategory',value:gradeCategory,description:'Grade Category'})
      }
    }}
    onChange={(e)=>setGradeCategory(e.currentTarget.value)}
  />
  </label>
</div>
          
<div>
  <label>Individualize
  <Switch
    name="individualize"
    onChange={(e)=>{
      let valueDescription = 'False';
      if (e.currentTarget.checked){
        valueDescription = 'True'
      }
      updateAssignment({doenetId,keyToUpdate:'individualize',value:e.currentTarget.checked,description:'Individualize',valueDescription})
     }}
    checked={individualize}
  ></Switch>
</label>
</div>
          

<div>
  <label>Show Solution
  <Switch
    name="showSolution"
    onChange={(e)=>{
      let valueDescription = 'False';
      if (e.currentTarget.checked){
        valueDescription = 'True'
      }
      updateAssignment({doenetId,keyToUpdate:'showSolution',value:e.currentTarget.checked,description:'Show Solution',valueDescription})
      }}
    checked={showSolution}
  ></Switch>
  </label>
</div>

<div>
  <label>Show Feedback
  <Switch
    name="showFeedback"
    onChange={(e)=>{
      let valueDescription = 'False';
      if (e.currentTarget.checked){
        valueDescription = 'True'
      }
      updateAssignment({doenetId,keyToUpdate:'showFeedback',value:e.currentTarget.checked,description:'Show Feedback',valueDescription})
      }}
    checked={showFeedback}
  ></Switch>
  </label>
</div>

<div>
  <label>Show Hints
  <Switch
    name="showHints"
    onChange={(e)=>{
      let valueDescription = 'False';
      if (e.currentTarget.checked){
        valueDescription = 'True'
      }
      updateAssignment({doenetId,keyToUpdate:'showHints',value:e.currentTarget.checked,description:'Show Hints',valueDescription})
      }}
    checked={showHints}
  ></Switch>
  </label>
</div>

<div>
  <label>Show Correctness
  <Switch
    name="showCorrectness"
    onChange={(e)=>{
      let valueDescription = 'False';
      if (e.currentTarget.checked){
        valueDescription = 'True'
      }
      updateAssignment({doenetId,keyToUpdate:'showCorrectness',value:e.currentTarget.checked,description:'Show Correctness',valueDescription})
      }}
    checked={showCorrectness}
  ></Switch>
  </label>
</div>

<div>
  <label>Proctor Makes Available
  <Switch
    name="proctorMakesAvailable"
    onChange={(e)=>{
      let valueDescription = 'False';
      if (e.currentTarget.checked){
        valueDescription = 'True'
      }
      updateAssignment({doenetId,keyToUpdate:'proctorMakesAvailable',value:e.currentTarget.checked,description:'Proctor Makes Available',valueDescription})
      }}
    checked={proctorMakesAvailable}
  ></Switch>
  </label>
</div>

</>
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


