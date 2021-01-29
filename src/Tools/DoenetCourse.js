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
import { supportVisible } from "../imports/Tool/SupportPanel";


export const roleAtom = atom({
  key: "roleAtom",
  default: 'Instructor'

})
export const contentIdAtom = atom({
  key: "contentIdAtom",
  default: ''

})
// export const assignmentIdAtom = atom({
//   key: "assignmentIdAtom",
//   default: ''
// })

const doenetMLSelector = selectorFamily({
  key:"doenetMLSelector",
  get:(itemIdcontentId)=> async ({get})=>{
    // Load contentId from database
    const { data } = await axios.get(
      `/api/loadDoenetML.php?contentId${contentId}`
    );
    return data
  }
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
  // if (doenetMLInfo.state === "loading"){ return null;}
  // if (doenetMLInfo.state === "hasError"){ 
  //   console.error(doenetMLInfo.contents)
  //   return null;}

  return <p>Viewer here</p>

}
  // const [doenetML, setDoenetMLUpdate] = useState('');
  // const [updateNumber, setUpdateNumber] = useState(0);
  // const role = useRecoilValue(roleAtom);
  // const data = {
  //   branchId: props.driveId,
  //   contentId: "",
  //   contentId: props.contentId,
  //   ListOfContentId: "",
  //   List_Of_Recent_doenetML: [],
  // }
  // const payload = {
  //   params: data
  // }

  // useEffect(() => {
  //   let mounted = true;
  //   getDoenetML().then((response) => {
  //     if (mounted) {
  //       setDoenetMLUpdate(response);
  //       setUpdateNumber(updateNumber + 1)
  //     }
  //   });
  //   return () => { mounted = false };
  // }, [props.contentId]);

  // const getDoenetML = () => {
  //   try {
  //     return axios.get(
  //       `/media/${props.contentId}`
  //     ).then((response) => {
  //       console.log(response);

  //       return response.data;
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // return (
  //   <div data-cy="doenetviewerItem">
  //     {doenetML != "" ?
  //       role === 'Student' ?
  //         <DoenetViewer
  //           key={"doenetviewer" + updateNumber}
  //           // doenetML={doenetML}
  //           course={true}
  //           // attemptNumber={latestAttemptNumber}
  //           mode={{
  //             solutionType: "displayed",
  //             allowViewSolutionWithoutRoundTrip: false,
  //             showHints: false,
  //             showFeedback: true,
  //             showCorrectness: true,
  //             interactive: false,
  //           }}
  //         />
  //         : <DoenetViewer
  //           key={"load" + updateNumber}
  //           //contentId={''}
  //           doenetML={doenetML}
  //           course={true}
  //           // attemptNumber={updateNumber}
  //           //  attemptNumber={latestAttemptNumber}
  //           mode={{
  //             solutionType: "displayed",
  //             allowViewSolutionWithoutRoundTrip: true,
  //             showHints: true,
  //             showFeedback: true,
  //             showCorrectness: true,
  //             interactive: false,
  //           }}
  //         />
  //       : null}
  //   </div>
  // )
// }


export default function DoenetCourse(props) {
  console.log("=== DoenetCourse");
  return (
    <DoenetCourseRouted props={props} />
  )
}

const loadAssignmentSelector = selectorFamily({
  key: 'loadAssignmentSelector',
  get: (courseIdassignmentId) => async ({ get, set }) => {
    const { data } = await axios.get(
      `/api/getAllAssignmentSettings.php?courseId=${courseIdassignmentId.courseId}`
    );
    return data;
  }

})


export const assignmentDictionary = atomFamily({
  key: "assignmentDictionary",
  default: selectorFamily({
    key: "assignmentDictionary/Default",
    get: (courseIdassignmentId) => async ({ get },instructions) => {
      // console.log(">> cid aid", courseIdassignmentId);
      const assignmentInfo = await get(loadAssignmentSelector(courseIdassignmentId));
      let assignObj = assignmentInfo;
      console.log(">>assignmentInfo", assignObj);

      if (assignObj) {
        let assignmentInfoResults = '';
        for (let item of assignObj?.assignments) {
          if (item.assignmentId === courseIdassignmentId.assignmentId) {
            assignmentInfoResults = item;
          }
          if (item.itemId === courseIdassignmentId.itemId) {
            assignmentInfoResults = item;

          }
        }
        console.log(">>>assignmentInfoResults", assignmentInfoResults);
        return assignmentInfoResults;
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
  get: (courseIdassignmentId) => ({ get }) => {
    return get(assignmentDictionary(courseIdassignmentId));
  },
  set: (courseIdassignmentId) => ({set,get},instructions)=>{
    if(courseIdassignmentId.assignmentId === '')
    {
      courseIdassignmentId = {...courseIdassignmentId,assignmentId:instructions.newAssignmentObj.assignmentId}
    }
   
    //  //const assignInfo = get(assignmentDictionary(courseIdassignmentId)); // get 
    // console.log(">>> cid aid assignInfo new ", assignInfo);
    let {type , ...value} = instructions;
    switch(type){
      case "change settings":
        // console.log(">>> cid aid assignInfo change", assignInfo);
        // let assignment = { ...assignInfo };
        // let assignmentNew = { ...assignment, ...value };
        set(assignmentDictionary(courseIdassignmentId), (old)=>{
          console.log("change settings  --> ", old);
          console.log("change settings 12345 --> ", {...old,...value});
          return {...old,...value};
        });
        // set(assignmentDictionary(courseIdassignmentId), assignmentNew);

        break;
      case "save assignment settings":
        // make copy
        // console.log(">>>>save assign info", assignInfo);
        // let saveAssignment = { ...assignInfo };
        // let saveAssignmentNew = { ...saveAssignment, ...value };
          set(assignmentDictionary(courseIdassignmentId), (old)=>{
          console.log("save settings  --> ", old);
          console.log("save settings 1234 --> ", {...old,...value});
          return {...old,...value};
        });
        // set(assignmentDictionary(courseIdassignmentId), saveAssignmentNew);
        // const payload = {
        //   ...saveAssignment,
        //   assignmentId: courseIdassignmentId.assignmentId ? courseIdassignmentId.assignmentId : instructions.newAssignmentObj.assignmentId,
        //   assignment_isPublished: 0
        // }

        // axios.post("/api/saveAssignmentToDraft.php", payload)
        //   .then((resp) => {
        //     console.log(resp.data)

        //   }
        //   )
        break;
        case "make new assignment":  
              
          // console.log("assignmentInfo before making >>>",instructions.newAssignmentObj);          
          set(assignmentDictionary(courseIdassignmentId),...instructions.newAssignmentObj);
          break;
        case "assignment was published" :
          let publishAssignment =  {...assignInfo};     
        set(assignmentDictionary(courseIdassignmentId), publishAssignment);
        const payloadPublish = {
          ...publishAssignment,
          assignmentId:courseIdassignmentId.assignmentId ? courseIdassignmentId.assignmentId : instructions.newAssignmentObj.assignmentId,
          assignment_isPublished: 1,
          courseId:courseIdassignmentId.courseId
        }
        axios.post("/api/publishAssignment.php", payloadPublish)
        .then((resp) => {
          console.log(resp.data)
        }
        )  
          break;
    }
  }
})

const AssignmentForm = (props) => {
  let courseId = props.courseId;

  let itemType = props.itemType;
  let assignmentId = props.assignmentId;
  let itemId = props.itemId;
  let driveId = props.routePathDriveId;
  let folderId  = props.routePathFolderId;
  let assignmentInfo = props.assignmentObjNew;
  console.log(">>> Assignment form ",assignmentId);

  // const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({ driveId: driveId, folderId:folderId }))

const [makeNewAssignment, setMakeNewAssignment] = useState(false);
  if(makeNewAssignment && (assignmentId === '' || assignmentId === undefined )){
    assignmentId = nanoid(); // This is to generate a new one
    let newAssignmentObj = {
      assignmentId:assignmentId,
      title:'Untitled Assignment New',
      assignedDate: "",
      attemptAggregation: "",
      dueDate: "",
      gradeCategory: "",
      individualize: "0",
      isAssignment: "1",
      isPublished: "0",
      itemId: itemId,
      multipleAttempts: "0",
      numberOfAttemptsAllowed: "0",
      proctorMakesAvailable: "0",
      showCorrectness: "1",
      showFeedback: "1",
      showHints: "1",
      showSolution: "1",
      timeLimit: "",
      totalPointsOrPercent: "0"
        }
    let payload = {
      assignmentId, itemId, courseId
    }
    axios.post(
      `/api/makeNewAssignment.php`, payload
    ).then((response) => {
      console.log(response.data);
    });
    }

  const role = useRecoilValue(roleAtom);
  
  const setAssignmentSettings = useSetRecoilState(assignmentDictionarySelector({courseId:courseId,assignmentId:assignmentId}))
  // console.log("loadBackAssignmentState",loadBackAssignmentState);
  // let assignmentInfo = '';
  // if ( loadBackAssignmentState?.state === 'hasValue' && loadBackAssignmentState?.contents) {      
  //     if (loadBackAssignmentState?.contents.itemId === props.itemId) {
  //         assignmentInfo = loadBackAssignmentState?.contents;
  //         // console.log(">>>assignment info in form", assignmentInfo);
  //     }
  // }
  // const [assignmentInfo, setAssignmentInfo] = useState({});
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
  const handleMakeAssignment = () => {
    assignmentId = assignmentId;
    setMakeNewAssignment(true);

  }


  const handleSubmit = (e) => {
    const payload = {
      ...assignmentInfo,
      assignmentId: assignmentId,
      assignment_isPublished: 1,
      courseId: courseId
    }
  
      setAssignmentSettings({ type: "assignment was published", itemId: itemId, assignedData: payload })
  }

  const loadBackAssignment = () => {
    // console.log("load back assignment", assignmentObjInfo.contents.assignments);
    if (loadBackAssignmentState?.contents) {
      for (let assignment of loadBackAssignmentState?.contents?.assignments) {
        // console.log('Assignments ->>> ', loadBackAssignmentState?.contents)
        if (assignment.itemId === props.itemId) {
          // if (assignment.itemId === props.itemId){
            assignmentInfo = assignment;
        }
      }
    }  
  }

   

const handlePublishContent = () => {
  let payload = {
    itemId: itemId
  }
  axios.post(
    `/api/handlePublishContent.php`, payload
  ).then((response) => {
    console.log(response.data);
  });
}

const handleMakeContent = () => {
  let payload = {
    itemId: itemId
  }
  axios.post(
    `/api/handleMakeContent.php`, payload
  ).then((response) => {
    console.log(response.data);
  });
  setFolderInfo({ instructionType: "handle make content", itemId: itemId, assignedDataSavenew: payload })
}

  return (
    role === 'Instructor'  ?
      <>
           {/* {  <Button text="load Assignment" callback={loadBackAssignment} /> : null} */}
           <br />
          {(assignmentId === '' || assignmentId === undefined ) &&  itemType === 'DoenetML' ? <Button text="Make Assignment" callback={handleMakeAssignment}></Button> : null} 
          <br />

          { itemType === 'DoenetML'? <ToggleButton text="Publish Content" switch_text="Published" callback={handlePublishContent}></ToggleButton> : null}
          { itemType === 'Url' ? <><ToggleButton text="Publish Content" switch_text="Published" callback={handlePublishContent}></ToggleButton> </> : null}
          { itemType === 'Folder'? <><ToggleButton text="Publish Content" switch_text="Published" callback={handlePublishContent}></ToggleButton></>: null}

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
          {( assignmentInfo?.isAssignment === '1')  ? <Button text="Make Content" callback={handleMakeContent}></Button>: null} 

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
  let assignmentId = props.assignmentObjInfo?.assignmentId;
  let assignmentObjNew = props.assignmentObjInfo;
  console.log(">>> in content panel assignmentId",assignmentId);
  const role = useRecoilValue(roleAtom);


  return (
    <div>
    {<AssignmentForm
      itemType={itemType}
      courseId={courseId}
      assignmentId={assignmentId}
      assignmentObjNew={assignmentObjNew}
      itemId={itemId} />}
  </div>
  ) 
}



function DoenetCourseRouted(props) {
  let courseId = 'Fhg532fk9873412s65'; // TODO : need to come from props.route.courseId 

  const [role,setRole] = useRecoilState(roleAtom);
  // const assignmentIdSettings = useRecoilValueLoadable(assignmentDictionarySelector(assignmentId))
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
  // const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({ driveId: routePathDriveId, folderId: routePathFolderId }))
  const [openEnrollment, setEnrollmentView] = useState(false);

  const enrollCourseId = { courseId: courseId };
  // let contentId = '';
  // if (contentId === '') {
  //   let data = folderInfoObj.contents.contentsDictionary;
  //   if (data) {
  //     contentId = data[pathItemId]?.contentId;
  //   }
  // }

  // const [loadBackAssignmentState, setAssignmentSettings] = useRecoilStateLoadable(assignmentDictionarySelector({courseId:courseId,assignmentId:assignmentIdValue}))

    // const setAssignmentSettings = useSetRecoilState(assignmentDictionarySelector({courseId:courseId,assignmentId:assignmentIdValue}))
  // const loadBackAssignmentState = useRecoilValueLoadable(assignmentDictionary({courseId:courseId,assignmentId:assignmentIdValue}))



  // const [assignmentIdSelect, setAssignmentId] = useState('');
  // useEffect(()=>{ 
  //   const fetchData = async (pathItemId,courseId) =>{
  //     const { data } =  await axios.get(
  //       `/api/getAllAssignmentSettings.php?courseId=${courseId}`
  //     );
  //     let assignId =  data?.assignments?.filter((item) => item.itemId === pathItemId)[0];
  //     console.log(">>>> setAssignmentId",assignId);
  //      setAssignmentId(assignId);
  //   }
  //   fetchData(pathItemId,courseId);
  
  // },[pathItemId,courseId]);



 let roleMenu = null;
//  if(role === 'Instructor'){
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
      </headerPanel>
      
      <navPanel>
        <Drive types={['course']} hideUnpublished={hideUnpublished} urlClickBehaviour="select" /><br />
        {role === 'Instructor' && <Button text="Course Enrollment" callback={() => { setEnrollmentView(!openEnrollment) }}> </Button>}
      </navPanel>

   
      <mainPanel>
        {displayCourseContent}
        {/* {contentId && routePathDriveId ?
          <DisplayCourseContent
            driveId={routePathDriveId}
            contentId={contentId} />
          : null}
      {/*  {openEnrollment ? <Enrollment selectedCourse={enrollCourseId} /> : null} */}

      </mainPanel>


      <menuPanel title="Content Info">
       <p> Content Info</p>
        {/* {pathItemId &&
          <ContentInfoPanel
            // assignmentObjInfo={assignmentIdSelect}
            itemType={itemType}
            courseId={courseId}
            routePathDriveId={routePathDriveId}
            routePathFolderId={routePathFolderId}
            itemId={pathItemId}
             />} */}
      </menuPanel>
    </Tool>
  );
}


