import nanoid from 'nanoid';
// import DoenetBox from '../Tools/DoenetBox';
// import DoenetAssignmentTree from "./DoenetAssignmentTree"
import DoenetEditor from './DoenetEditor';
import React, { useState, useEffect, useCallback } from "react";
import { getCourses_CI, setSelected_CI } from "../imports/courseInfo";
import Enrollment from './Enrollment';
import LearnerGrades from './LearnerGrades';
import LearnerGradesAttempts from './LearnerGradesAttempts';
import { CourseAssignments, CourseAssignmentControls } from "./courseAssignments";
import LearnerAssignment from './LearnerAssignment';
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import CollapseSection from "../imports/CollapseSection";
import ActionButton from "../imports/PanelHeaderComponents/ActionButton";
import Button from "../imports/PanelHeaderComponents/Button";
import ToggleButton from "../imports/PanelHeaderComponents/ToggleButton";
import TextField from "../imports/PanelHeaderComponents/TextField";

import MenuItem from "../imports/PanelHeaderComponents/MenuItem";
import Menu, { useMenuContext } from "../imports/PanelHeaderComponents/Menu";
import axios from "axios";
import Drive, { folderDictionarySelector } from "../imports/Drive";
import DoenetViewer from './DoenetViewer';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  RecoilRoot,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import Switch from "../imports/Switch";
import AddItem from '../imports/AddItem'


export const roleAtom = atom({
  key: "roleAtom",
  default: 'Instructor'

})
const fileByContent = atomFamily({
  key:"fileByContent",
  default: selectorFamily({
    key:"fileByContent/Default",
    get:(contentId)=> async ({get})=>{
      if (!contentId){
        return "";
      }
      return await axios.get(`/media/${contentId}`) 
    }
  })
  
})


const itemIdToDoenetML = selectorFamily({
  key:"itemIdToDoenetML",
  get: (driveIdcourseIditemIdparentFolderId) => async ({get}) => {
   let folderInfoQueryKey = {
    driveId:driveIdcourseIditemIdparentFolderId.driveId,
    folderId:driveIdcourseIditemIdparentFolderId.folderId
  }
    let folderInfo = get(folderDictionarySelector(folderInfoQueryKey));
    console.log(">>>> folderInfo", folderInfo);
    const contentId = folderInfo?.contentsDictionary?.[driveIdcourseIditemIdparentFolderId.itemId]?.contentId;
    const doenetML = get(fileByContent(contentId));
  //  console.log(">>>> doenetML", doenetML);
     return doenetML;
  }
})




const DisplayCourseContent = (props) => {
let itemId = props.itemId;
let courseId = props.courseId;
let driveId = props.driveId;
let folderId = props.parentFolderId;

  const doenetMLInfo = useRecoilValueLoadable(itemIdToDoenetML({itemId:itemId,courseId:courseId,driveId:driveId,folderId:folderId}))
  // use folderDictionarySelector to go from an itemId to contentId & use load doenetMl from contentId .. need info from props

console.log("doenetML" , doenetMLInfo);
  if (doenetMLInfo.state === "loading"){ return null;}
  if (doenetMLInfo.state === "hasError"){ 
    console.error(doenetMLInfo.contents)
    return null;}
  let doenetMLDoenetML = doenetMLInfo?.contents?.data;

let displayDoenetViewer = null;
if(doenetMLDoenetML)
{
  displayDoenetViewer = <DoenetViewer
  key={"loadDoenetML" + itemId}
  doenetML={doenetMLDoenetML}
  course={true}
  // attemptNumber={updateNumber}
  mode={{
    solutionType: "displayed",
    allowViewSolutionWithoutRoundTrip: true,
    showHints: true,
    showFeedback: true,
    showCorrectness: true,
    interactive: false,
  }}
/>
}
  return (
  <div>
  {displayDoenetViewer}
  </div>
  )
  
};
 


export default function DoenetCourse(props) {
  console.log("=== DoenetCourse");
  return (
    <DoenetCourseRouted props={props} />
  )
}

const loadAssignmentSelector = selectorFamily({
  key: 'loadAssignmentSelector',
  get: (assignmentId) => async ({ get, set }) => {
    const { data } = await axios.get(
      `/api/getAllAssignmentSettings.php?assignmentId=${assignmentId}`
    );
    return data;
  }

})


export const assignmentDictionary = atomFamily({
  key: "assignmentDictionary",
  default: selectorFamily({
    key: "assignmentDictionary/Default",
    get: (driveIdcourseIditemIdparentFolderId) => async ({ get },instructions) => {
      let folderInfoQueryKey = {
        driveId:driveIdcourseIditemIdparentFolderId.driveId,
        folderId:driveIdcourseIditemIdparentFolderId.folderId
      }
      let folderInfo = get(folderDictionarySelector(folderInfoQueryKey));
      console.log(">>>> folderInfo 123", folderInfo);

const itemObj = folderInfo?.contentsDictionary?.[driveIdcourseIditemIdparentFolderId.itemId];
let itemIdassignmentId = itemObj?.assignmentId ? itemObj.assignmentId : null;
console.log(">>>> itemIdassignmentId", itemIdassignmentId);
    if(itemIdassignmentId)
    {
      console.log(">> cid aid", itemIdassignmentId);
      const assignmentInfo = await get(loadAssignmentSelector(itemIdassignmentId));
      if(assignmentInfo)
      {
        console.log(">>>> assignmentInfo", assignmentInfo);
        return assignmentInfo?.assignments[0];
      }
      else
       return null; 
    }
    else
      return null;

    }
  })
})

let assignmentIdAtom = atomFamily({
  key: "assignmentIdAtom",
  default:''
});

let assignmentIdSelector = selector ({
  key: "assignmentIdSelector",
  get:({get})=>{
    return get(assignmentIdAtom());
  },
  set:({set},instructions) => {
    set(assignmentIdAtom,instructions);
  } 
});

let getAssignmentIdSelector = selectorFamily({
  key: "getAssignmentIdSelector",
  get: (courseIdassignmentId) => ({ get }) => {
    let getAllAssignments = get(assignmentDictionary(courseIdassignmentId));
    //let assignmentId = getAllAssignments.itemId === courseIdassignmentId.itemId ? getAllAssignments.assignmentId :'';
    return  getAllAssignments ?  getAllAssignments.assignmentId : 'content';
  },
  set:(courseIdassignmentId)=> ({get,set},instructions) => {
    let getAllAssignments = get(loadAssignmentSelector(courseIdassignmentId));
    console.log(" >>> get assigment Id selector ", instructions , getAllAssignments, courseIdassignmentId);
    //let assignData = getAllAssignments.assignments.filter((item)=> item.itemId === courseIdassignmentId.itemId)[0]?.assignmentId;
    set(assignmentIdAtom(),instructions);
  } 

})
let assignmentDictionarySelector = selectorFamily({ //recoilvalue(assignmentDictionarySelector(assignmentId))
  key: "assignmentDictionarySelector",
  get: (driveIdcourseIditemIdparentFolderId) => ({ get }) => {
    return get(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
  },
  set: (driveIdcourseIditemIdparentFolderId) => ({set,get},instructions)=>{

    let {type , ...value} = instructions;
    switch(type){
      case "change settings":
        // console.log(">>> cid aid assignInfo change", assignInfo);
   
        set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), (old)=>{
          console.log("change settings  --> ", old);
          console.log("change settings 12345 --> ", {...old,...value});
          return {...old,...value};
        });

        break;
      case "save assignment settings":
        // make copy
    
        const saveInfo = get(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
          set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), (old)=>{
          console.log("save settings  --> ", old);
          console.log("save settings 1234 --> ", {...old,...value});
          return {...old,...value};
        });
        let saveAssignmentNew = { ...saveInfo, ...value };
        set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), saveAssignmentNew);
        const payload = {
          ...saveInfo,
          assignmentId: saveAssignmentNew.assignmentId,
          assignment_isPublished: "0"
        }

        axios.post("/api/saveAssignmentToDraft.php", payload)
          .then((resp) => {
            console.log(resp.data)

          }
          )
        break;
        case "make new assignment":  
        const dt = new Date();
        const creationDate = `${
          dt.getFullYear().toString().padStart(2, '0')}-${
            (dt.getMonth()+1).toString().padStart(2, '0')}-${
            dt.getDate().toString().padStart(2, '0')} ${
          dt.getHours().toString().padStart(2, '0')}:${
          dt.getMinutes().toString().padStart(2, '0')}:${
          dt.getSeconds().toString().padStart(2, '0')}`
        let newAssignmentObj = {
          ...value,
          title:'Untitled Assignment',
          creationDate,
          assignedDate: null,
          attemptAggregation: null,
          dueDate: null,
          gradeCategory: null,
          individualize: "0",
          isAssignment: "1",
          isPublished: "0",
          itemId: driveIdcourseIditemIdparentFolderId.itemId,
          multipleAttempts: null,
          numberOfAttemptsAllowed: null,
          proctorMakesAvailable: "0",
          showCorrectness: "1",
          showFeedback: "1",
          showHints: "1",
          showSolution: "1",
          timeLimit: null,
          totalPointsOrPercent: null,
          assignment_isPublished:"0"
            }
    
              
          // console.log("assignmentInfo before making >>>",instructions.newAssignmentObj);          
          set(assignmentDictionary(driveIdcourseIditemIdparentFolderId),newAssignmentObj);
          break;
        case "assignment was published" :
          let publishAssignment = get(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
         
        set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), publishAssignment);
        const payloadPublish = {
          ...publishAssignment,
          assignmentId:publishAssignment.assignmentId,
          assignment_isPublished: "1",
          courseId:driveIdcourseIditemIdparentFolderId.courseId
        }
        axios.post("/api/publishAssignment.php", payloadPublish)
        .then((resp) => {
          console.log(resp.data)
        }
        )  
          break;
          case "update new assignment": 
          let editAssignment = get(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
         
          set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), editAssignment);          
          
          break;
          case "handle make content" : 
          let handlebackContent = get(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
         
          const payloadContent = {
            ...handlebackContent,
            isAssignment: 0
          }
          set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), payloadContent); 

           break;
           case "load back assignment":
            let handlebackAssignment = get(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
         
            const payloadAssignment = {
              ...handlebackAssignment,
              isAssignment: 1
            }
            set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), payloadAssignment); 
  
             break;
    }
  }
})

const AssignmentForm = (props) => {
  let courseId = props.courseId;
  let itemType = props.itemType;
  let assignmentId = props.assignmentId;
  let itemId = props.itemId;
  let driveId = props.driveId;
  let folderId  = props.folderId;
  let assignmentInfo = props.assignmentInfo;


  const role = useRecoilValue(roleAtom);

  const setAssignmentSettings = useSetRecoilState(assignmentDictionarySelector({itemId:itemId,courseId:courseId,driveId:driveId,folderId:folderId}))
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({ driveId:driveId , folderId: folderId }));


  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
     setAssignmentSettings({ type: 'change settings',[name]: value});
    
  }
  const handleOnBlur =  (e) => {
    let name = e.target.name;
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAssignmentSettings({ type: 'save assignment settings',[name]: value});
    
  }  


  const handleSubmit = (e) => {
    const payload = {
      ...assignmentInfo,
      assignmentId: assignmentId,
      assignment_isPublished: "1",
      courseId: courseId
    }
  
      setAssignmentSettings({ type: "assignment was published", itemId: itemId, assignedData: payload });
      setFolderInfo({ instructionType: "assignment was published", itemId: itemId, payload: payload })

      
  }

  return (
    role === 'Instructor'  ?
      <>
          

       {assignmentId && 
<>
        <div>
          <label>Assignment Name :</label>
          <input required type="text" name="title" value={assignmentInfo?.title}
            placeholder="Title goes here" onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label >Assigned Date:</label>
          <input required type="text" name="assignedDate" value={assignmentInfo?.assignedDate}
            placeholder="0001-01-01 01:01:01 " onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label >Due date: </label>
          <input required type="text" name="dueDate" value={assignmentInfo?.dueDate}
            placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} onChange={handleChange} />
        </div>

        <div>
          <label>Time Limit:</label>
          <input required type="time" name="timeLimit" value={assignmentInfo?.timeLimit}
            placeholder="01:01:01" onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label >Number Of Attempts:</label>
          <input required type="number" name="numberOfAttemptsAllowed" value={assignmentInfo?.numberOfAttemptsAllowed}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div>
          <label >Attempt Aggregation :</label>
          <input required type="text" name="attemptAggregation" value={assignmentInfo?.attemptAggregation}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label>Total Points Or Percent: </label>
          <input required type="number" name="totalPointsOrPercent" value={assignmentInfo?.totalPointsOrPercent}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label>Grade Category: </label>
          <input required type="select" name="gradeCategory" value={assignmentInfo?.gradeCategory}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label>Individualize: </label>
          <input required type="checkbox" name="individualize" value={assignmentInfo?.individualize}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label >Multiple Attempts: </label>
          <input required type="checkbox" name="multipleAttempts" value={assignmentInfo?.multipleAttempts}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label >Show solution: </label>
          <input required type="checkbox" name="showSolution" value={assignmentInfo?.showSolution}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label >Show feedback: </label>
          <input required type="checkbox" name="showFeedback" value={assignmentInfo?.showFeedback}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label >Show hints: </label>
          <input required type="checkbox" name="showHints" value={assignmentInfo?.showHints}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label >Show correctness: </label>
          <input required type="checkbox" name="showCorrectness" value={assignmentInfo?.showCorrectness}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div >
          <label >Proctor make available: </label>
          <input required type="checkbox" name="proctorMakesAvailable" value={assignmentInfo?.proctorMakesAvailable}
            onBlur={handleOnBlur} onChange={handleChange} />
        </div>
        <div>
          <ToggleButton text="Publish" switch_text="publish changes" callback={handleSubmit} type="submit" ></ToggleButton>
        </div>
        <div>
        </div>

        </>}
      </>
      : <div>
        {assignmentId &&
         <div>
         <h1>{assignmentInfo?.title}</h1>
         <p>Due: {assignmentInfo?.dueDate}</p>
         <p>Time Limit: {assignmentInfo?.timeLimit}</p>
         <p>Number of Attempts Allowed: {assignmentInfo?.numberOfAttemptsAllowed}</p>
         <p>Points: {assignmentInfo?.totalPointsOrPercent}</p>
       </div> }
       
      </div>
  )
}

const ContentInfoPanel = (props) =>{
  let courseId = props.courseId;
  let itemId = props.itemId;
  let itemType = props.itemType;
  let assignmentId = '';
  let assignmentObjNew = props.assignmentObjInfo;
  let driveId = props.routePathDriveId;
  let folderId = props.routePathFolderId;
  let handlemakeContentView = false;
  const [role,setRole] = useRecoilState(roleAtom);
  console.log(">>> in content panel assignmentId",assignmentId);
  const assignmentIdSettings = useRecoilValueLoadable(assignmentDictionarySelector({itemId:itemId,courseId:courseId,driveId:driveId,folderId:folderId}));
  const setAssignmentSettings = useSetRecoilState(assignmentDictionarySelector({itemId:itemId,courseId:courseId,driveId:driveId,folderId:folderId}));
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({ driveId:driveId , folderId: folderId }));
  const [makeNewAssignment, setMakeNewAssignment] = useState(false);

  // let assignmentViewForm = null;
  let assignmentInfo = '';

  if(assignmentIdSettings?.state === 'hasValue'){
    console.log(">>>> assignmentIdSettings 333",assignmentIdSettings);    
       assignmentInfo = assignmentIdSettings?.contents;  
      if(assignmentInfo?.assignmentId){
        assignmentId = assignmentInfo?.assignmentId;
        setAssignmentSettings({ type: 'update new assignment',assignmentInfo});
      }
     } 

 
  const handleMakeAssignment = () => {
    console.log("!!!!!!!!!!!!!!!");
    setMakeNewAssignment(true);
  }
  if(makeNewAssignment && (assignmentId === '' || assignmentId === undefined )){
    assignmentId = nanoid(); // This is to generate a new one

    setAssignmentSettings({ type: 'make new assignment',assignmentId:assignmentId});
    let payload = {
      assignmentId, itemId, courseId
    }
    setMakeNewAssignment(false);
    axios.post(
      `/api/makeNewAssignment.php`, payload
    ).then((response) => {
      console.log(response.data);
    });
  }

  const handlePublishContent = () => {
    let payload = {
      itemId: itemId
    }
    setFolderInfo({ instructionType: "content was published", itemId: itemId, payload: payload })

    axios.post(
      `/api/handlePublishContent.php`, payload
    ).then((response) => {
      console.log(response.data);
    });
  }
 
  const [makecontent,setMakeContent] =useState(false);

  const handleMakeContent = (e) =>{
    e.preventDefault();
    e.stopPropagation();
   setMakeContent(true);
  }

  if(makecontent) {
    let payload = {
      itemId: itemId
    }
    setMakeContent(false);
    axios.post(
      `/api/handleMakeContent.php`, payload
    ).then((response) => {
      console.log(response.data);
    });
    setAssignmentSettings({ type: 'handle make content',assignmentInfo});
    setFolderInfo({ instructionType: "handle make content", itemId: itemId, assignedDataSavenew: payload })
  }  


  const loadBackAssignment = () => {
    let payload={
      itemId:itemId
    }
    axios.post(
      `/api/handleBackAssignment.php`, payload
    ).then((response) => {
      console.log(response.data);
    });
    setAssignmentSettings({ type: 'load back assignment',assignmentInfo});
    setFolderInfo({ instructionType: "load back assignment", itemId: itemId, payloadAssignment: assignmentInfo })
  }

   

  return (
    <div>
       <br />
       
          { role === 'Instructor' && assignmentInfo?.assignment_isPublished !== "1" && <button text="Publish Content"  onClick={handlePublishContent}>Publish Content</button>}

          {role === 'Instructor' && (assignmentId === '' || assignmentId === undefined ) &&  itemType === 'DoenetML' ? <button text="Make Assignment" onClick={handleMakeAssignment}>Make Assignment</button> : null} 
          <br />
    { assignmentId && assignmentInfo?.isAssignment == '1' && <AssignmentForm
    itemType={itemType}
    courseId={courseId}
    driveId={driveId}
    folderId={folderId}
    assignmentId={assignmentId}
    assignmentInfo={assignmentInfo}
    itemId={itemId} /> }


      {console.log(">>>> handle click for make content",assignmentInfo)}
      {role === 'Instructor' && ( assignmentInfo?.isAssignment == '1')  && <button text="Make Content" onClick={handleMakeContent}>Make Content</button>} 
      {/* {( assignmentInfo?.isAssignment === '1')  ? <Button text="Make Content" callback={handleMakeContent}></Button>: null}  */}
              
        { role === 'Instructor' && (assignmentId && assignmentInfo?.isAssignment == '0') ? <button text="load Assignment" onClick={loadBackAssignment} >load back Assignment</button> : null}

        </div>
        ) 
}



function DoenetCourseRouted(props) {
  console.log("props in course routed", props);
  let courseId = 'Fhg532fk9873412s65'; // TODO : need to come from props.route.courseId 

  const [role,setRole] = useRecoilState(roleAtom);
  // const setOverlayOpen = useSetRecoilState(openOverlayByName);
  let hideUnpublished = true;
  if(role === 'Instructor'){
    hideUnpublished =false;
  }
  let pathItemId = '';
  let routePathDriveId = '';
  let routePathFolderId = '';
  let itemType = '';


  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.props.route.location.search));
  if (urlParamsObj?.path !== undefined) {
    [routePathDriveId, routePathFolderId, pathItemId, itemType] = urlParamsObj.path.split(":");
  }
  if (urlParamsObj?.courseId !== undefined) {
    courseId = urlParamsObj?.courseId;
  }
  const [openEnrollment, setEnrollmentView] = useState(false);

  const enrollCourseId = { courseId: courseId };


 let roleMenu = null;
  if(true){
   roleMenu = <Menu label="Role"><MenuItem value="Student" onSelect={() => setRole('Student')} /><MenuItem value="Instructor" onSelect={() => setRole('Instructor')} /></Menu>
 }
 

let displayCourseContent = null;
if(pathItemId && routePathDriveId){
  displayCourseContent = <DisplayCourseContent 
   driveId={routePathDriveId} itemId={pathItemId} courseId={courseId} parentFolderId={routePathFolderId}
  />
}


  return (
    <Tool>
      <headerPanel title="my title">
        {roleMenu}
      </headerPanel>
      
      <navPanel>
        
        <Drive types={['course']} hideUnpublished={hideUnpublished} urlClickBehaviour="select" /><br />
        {role === 'Instructor' && <Button text="Course Enrollment" callback={() => { setEnrollmentView(!openEnrollment) }}> </Button>}
      </navPanel>

   
      <mainPanel>
        {displayCourseContent}
      </mainPanel>


      <menuPanel title="Content Info">
        {pathItemId &&
          <ContentInfoPanel
             assignmentObjInfo={''}
            itemType={itemType}
            courseId={courseId}
            routePathDriveId={routePathDriveId}
            routePathFolderId={routePathFolderId}
            itemId={pathItemId}
             />}
      </menuPanel>
    </Tool>
  );
}


