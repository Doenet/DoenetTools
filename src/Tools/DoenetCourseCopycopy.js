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

const DisplayCourseContent = (props) => {
  const [doenetML, setDoenetMLUpdate] = useState('');
  const [updateNumber, setUpdateNumber] = useState(0)
  const role = useRecoilValue(roleAtom);
  const data = {
    branchId: props.driveId,
    contentId: "",
    contentId: props.contentId,
    ListOfContentId: "",
    List_Of_Recent_doenetML: [],
  }
  const payload = {
    params: data
  }

  useEffect(() => {
    let mounted = true;
    getDoenetML().then((response) => {
      if (mounted) {
        setDoenetMLUpdate(response);
        setUpdateNumber(updateNumber + 1)
      }
    });
    return () => { mounted = false };
  }, [props.contentId]);

  const getDoenetML = () => {
    try {
      return axios.get(
        `/media/${props.contentId}`
      ).then((response) => {
        console.log(response);

        return response.data;
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div data-cy="doenetviewerItem">
      {doenetML != "" ?
        role === 'Student' ?
          <DoenetViewer
            key={"doenetviewer" + updateNumber}
            doenetML={doenetML}
            course={true}
            // attemptNumber={latestAttemptNumber}
            mode={{
              solutionType: "displayed",
              allowViewSolutionWithoutRoundTrip: false,
              showHints: false,
              showFeedback: true,
              showCorrectness: true,
              interactive: false,
            }}
          />
          : <DoenetViewer
            key={"load" + updateNumber}
            //contentId={''}
            doenetML={doenetML}
            course={true}
            // attemptNumber={updateNumber}
            //  attemptNumber={latestAttemptNumber}
            mode={{
              solutionType: "displayed",
              allowViewSolutionWithoutRoundTrip: true,
              showHints: true,
              showFeedback: true,
              showCorrectness: true,
              interactive: false,
            }}
          />
        : null}
    </div>
  )
}


export default function DoenetCourse(props) {
  console.log("=== DoenetCourse");
  return (
    <DoenetCourseRouted props={props} />
  )
}

const loadAssignmentSelector = selectorFamily({
  key: 'loadAssignmentSelector',
  get: (courseIdassignmentId) => async({ get, set }) => {
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
    get: (courseIdassignmentId) => ({ get },instructions) => {
      // console.log(">> cid aid", courseIdassignmentId);
      const assignmentInfo = get(loadAssignmentSelector(courseIdassignmentId));
      let assignObj = assignmentInfo;
      console.log(">>assignmentInfo", assignObj);
       let assignmentInfoResults = '';
      for (let item of assignObj?.assignments){
        if (item.assignmentId === courseIdassignmentId.assignmentId){
         assignmentInfoResults = item;
        }
        if (item.itemId === courseIdassignmentId.itemId){
          assignmentInfoResults = item;

        }
      }
      console.log(">>>assignmentInfoResults",assignmentInfoResults);
      return assignmentInfoResults;
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
  set:(courseIdassignmentId)=>({get,set},instructions) => {
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
  set: (courseIdassignmentId) => async ({set,get},instructions)=>{
    if(courseIdassignmentId.assignmentId === '')
    {
      courseIdassignmentId = {...courseIdassignmentId,assignmentId:instructions.newAssignmentObj.assignmentId}
    }
    // console.log(">>>assignInfo",courseIdassignmentId);
    // console.log(">>>cid aid instructions",instructions);
    const assignInfo = get(assignmentDictionary(courseIdassignmentId)); // get 
    // console.log(">>> cid aid assignInfo new ", assignInfo);
    let {type , ...value} = instructions;
    switch(type){
        case "change settings" :
        // console.log(">>> cid aid assignInfo change", assignInfo);
        let assignment =  {...assignInfo,...value};
        set(assignmentDictionary(courseIdassignmentId),assignment);
        break;
        case "save assignment settings" :
        // make copy
        // console.log("save assign info", assignInfo);
          let saveAssignment =  {...assignInfo,...value};     
        set(assignmentDictionary(courseIdassignmentId), saveAssignment);
        const payload = {
          ...saveAssignment,
          assignmentId:courseIdassignmentId.assignmentId ? courseIdassignmentId.assignmentId : instructions.newAssignmentObj.assignmentId,
          assignment_isPublished: 0
        }
  
        axios.post("/api/saveAssignmentToDraft.php", payload)
          .then((resp) => {
            console.log(resp.data)
        
          }
          )
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
// let assignmentDictionarySelector =  selectorFamily({ //recoilvalue(assignmentDictionarySelector(assignmentId))
//   key:"assignmentDictionarySelector",
//   get: (assignmentId) => async ({get,set})=>{
//    const assignmentData = get(loadAssignmentSelector(assignmentId))
//     console.log(">>>assignmentData settings",assignmentData);
//     }      
//   })

function DoenetCourseRouted(props) {
  const role = useRecoilValue(roleAtom);
  // const assignmentIdSettings = useRecoilValueLoadable(assignmentDictionarySelector(assignmentId))
  const setOverlayOpen = useSetRecoilState(openOverlayByName);
  let [hideUnpublished, setHideUnpublished] = useState(role === 'Instructor' ? false : true);
  const setSupportVisiblity = useSetRecoilState(supportVisible);
  let pathItemId = '';
  let routePathDriveId = '';
  let routePathFolderId = '';
  let itemType = '';
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.props.route.location.search));
  // const [assignid, setAssignmentIdValue] = useRecoilState(assignmentIdAtom);
  if (urlParamsObj?.path !== undefined) {
    [routePathDriveId, routePathFolderId, pathItemId, itemType] = urlParamsObj.path.split(":");
  }
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({ driveId: routePathDriveId, folderId: routePathFolderId }))
  let courseId = 'Fhg532fk9873412s65';
  if (urlParamsObj?.courseId !== undefined) {
    courseId = urlParamsObj?.courseId;
  }
  
  const [openEnrollment, setEnrollmentView] = useState(false);
  const [assignmentSelected, setAssignmentSelected] = useState(false);
  let assignmentIdValueNew = useRecoilValueLoadable(assignmentDictionary({courseId:courseId,itemId:pathItemId}));
  let assignmentIdValue = '';
  if ( assignmentIdValueNew?.state === 'hasValue' && assignmentIdValueNew?.contents) {
    console.log(" >>>>>>  >>> assign", assignmentIdValueNew?.contents);
    assignmentIdValue = assignmentIdValueNew?.contents?.assignmentId;
  }

  let makeassignmentIsSelected = false;

  const enrollCourseId = { courseId: courseId };
  let contentId = '';
    const [makeContent, setMakeContent] = useState(false);
    const loadBackAssignmentIdSelector = useRecoilValueLoadable(getAssignmentIdSelector({courseId:courseId,itemId:pathItemId}));
    //const assignmentIdSelector = useRecoilValue(getAssignmentIdSelector({courseId:courseId,itemId:pathItemId}));
    const setAssignmentIdSelector = useSetRecoilState(getAssignmentIdSelector({courseId:courseId,itemId:pathItemId}));
    
     console.log(">>loadBackAssignment selector--->>> ",loadBackAssignmentIdSelector);
    if ( loadBackAssignmentIdSelector?.state === 'hasValue' && loadBackAssignmentIdSelector?.contents) {
      if(loadBackAssignmentIdSelector?.contents === 'content')
      {
        // setAssignmentId('');      
        //setAssignmentIdSelector(''); 
      }
      else{
        // setAssignmentId(loadBackAssignmentIdSelector?.contents);      
        setAssignmentIdSelector(loadBackAssignmentIdSelector?.contents);      
      }
    }
    else{
      // console.log('>>> makeasiign selected',assignmentSelected)
      //if(!assignmentSelected)
        //setAssignmentId('');
        //setAssignmentIdSelector(loadBackAssignmentIdSelector?.contents);
    }

  let displayAssignmentSettings = '';

  if (contentId === '') {
    let data = folderInfoObj.contents.contentsDictionary;
    if (data) {
      contentId = data[pathItemId]?.contentId;
    }
  }
  // const setAssignmentSettings = useSetRecoilState(assignmentDictionarySelector({courseId:courseId,assignmentId:assignmentIdValue}))
  // const loadBackAssignmentState = useRecoilValueLoadable(assignmentDictionary({courseId:courseId,assignmentId:assignmentIdValue}))
  const [loadBackAssignmentState, setAssignmentSettings] = useRecoilStateLoadable(assignmentDictionarySelector({courseId:courseId,assignmentId:assignmentIdValue}))

  const AssignmentForm = (props) => {
    let assignmentId = props.assignmentId;
  
  const [makeNewAssignment, setMakeNewAssignment] = useState(false);

    if(makeNewAssignment && assignmentId === undefined){
      assignmentId = nanoid(); // This is to generate a new one

    }
    const role = useRecoilValue(roleAtom);

    // const setAssignmentSettings = useSetRecoilState(assignmentDictionarySelector({courseId:props.courseId,assignmentId:props.assignmentId}))
    // console.log("loadBackAssignmentState",loadBackAssignmentState);
    let assignmentInfo = '';
    if ( loadBackAssignmentState?.state === 'hasValue' && loadBackAssignmentState?.contents) {      
        if (loadBackAssignmentState?.contents.itemId === props.itemId) {
            assignmentInfo = loadBackAssignmentState?.contents;
            // console.log(">>>assignment info in form", assignmentInfo);
        }
    }
    // const [assignmentInfo, setAssignmentInfo] = useState({});
    const handleChange = (event) => {
      let name = event.target.name;
      let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
       setAssignmentSettings({ type: 'change settings',[name]: value});
      
    }
    const handleOnBlur = async (e) => {
      let name = e.target.name;
      let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setAssignmentSettings({ type: 'save assignment settings',[name]: value});
      
    }
    const handleSubmit = (e) => {
      const payload = {
        ...assignmentInfo,
        assignmentId: assignmentIdValue ? assignmentIdValue : displayAssignmentSettings.assignmentId,
        assignment_isPublished: 1,
        courseId: courseId
      }
    
        setAssignmentSettings({ type: "assignment was published", itemId: pathItemId, assignedData: payload })
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
    return (
      role === 'Instructor'  ?
        <>
             {role === 'Instructor' && displayAssignmentSettings.isAssignment === '0' ? <Button text="load Assignment" callback={loadBackAssignment} /> : null}
             {/* {console.log(">>>assignmentIdValue in form" ,props.assignmentId)} */}

        {!props.assignmentId && <Button text="Make Assignment" callback={()=>{console.log("make assignment")}}></Button>}
        {/* {!props.assignmentId && <Button text="Make Assignment" callback={handleMakeAssignment}></Button>} */}

         {props.assignmentId && 
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

          </>}
        </>
        : <div>
          <div>
            <h1>{assignmentInfo?.title}</h1>
            <p>Due: {assignmentInfo?.dueDate}</p>
            <p>Time Limit: {assignmentInfo?.timeLimit}</p>
            <p>Number of Attempts Allowed: {assignmentInfo?.numberOfAttemptsAllowed}</p>
            <p>Points: {assignmentInfo?.totalPointsOrPercent}</p>
          </div>
        </div>
    )
  }
 
  const handleMakeAssignment = () => {
    makeassignmentIsSelected = true;
    let assignmentId = nanoid();
    //setAssignmentSelected(true);
    //setAssignmentId(assignmentId);
   
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
      itemId: pathItemId,
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

    setAssignmentIdSelector(newAssignmentObj.assignmentId);  
    setAssignmentSettings({ type: 'make new assignment',newAssignmentObj});
    let payload = {
      assignmentId, pathItemId, courseId
    }
    axios.post(
      `/api/makeNewAssignment.php`, payload
    ).then((response) => {
      console.log(response.data);
    });

  }

  const handlePublishContent = () => {
    let payload = {
      itemId: pathItemId
    }
    axios.post(
      `/api/handlePublishContent.php`, payload
    ).then((response) => {
      console.log(response.data);
    });
  }

  const handleMakeContent = () => {
    let payload = {
      itemId: pathItemId,
    }
    setMakeContent(true);
    axios.post(
      `/api/handleMakeContent.php`, payload
    ).then((response) => {
      console.log(response.data);
    });
    setFolderInfo({ instructionType: "handle make content", itemId: pathItemId, assignedDataSavenew: payload })
  }

  return (
    <Tool>
      <navPanel>
        <Drive types={['course']} hideUnpublished={hideUnpublished} urlClickBehaviour="select" /><br />
        { <Menu label="Role"><MenuItem value="Student" onSelect={() => setHideUnpublished(true)} /><MenuItem value="Instructor" onSelect={() => setHideUnpublished(false)} /></Menu>}
        {/* {role === 'Instructor' ?  <Menu label="Role"><MenuItem value="Student" onSelect={() => setHideUnpublished(true)} /><MenuItem value="Instructor" onSelect={() => setHideUnpublished(false)} /></Menu> : null} */}

        {role === 'Instructor' && <Button text="Course Enrollment" callback={() => { setEnrollmentView(!openEnrollment) }}> </Button>}
      </navPanel>

      <headerPanel title="my title">
        <Switch
          onChange={(value) => {
            setSupportVisiblity(value);
          }}
        />
      </headerPanel>
      <mainPanel>

        {contentId && routePathDriveId ?
          <DisplayCourseContent
            driveId={routePathDriveId}
            contentId={contentId} />
          : null}
        {openEnrollment ? <Enrollment selectedCourse={enrollCourseId} /> : null}

      </mainPanel>
      <menuPanel title="Content Info">
        {role === 'Instructor' && itemType === 'DoenetML' && displayAssignmentSettings == '' && !makeassignmentIsSelected && !assignmentIdValue ?
                                   <>
                                   {/* <Button text="Make Assignment" callback={handleMakeAssignment}></Button> */}
                                   <ToggleButton text="Publish Content" switch_text="Published" callback={handlePublishContent}></ToggleButton> </>: null}
        {role === 'Instructor' && itemType === 'Url' ? <><ToggleButton text="Publish Content" switch_text="Published" callback={handlePublishContent}></ToggleButton> </> : null}
        {role === 'Instructor' && itemType === 'Folder'? <><ToggleButton text="Publish Content" switch_text="Published" callback={handlePublishContent}></ToggleButton></>: null}
        {/* {role === 'Instructor' && makeContent ? <Button text="load Assignment" callback={loadBackAssignment} /> : null} */}
       {/* {console.log("----->>assignmentIdValue",assignmentIdValue)} */}
        {
          <>
            {  <AssignmentForm
              courseId={courseId}
              assignmentId={assignmentIdValue}
              assignment={displayAssignmentSettings}
              itemId={pathItemId} />}

          {/* {role === 'Instructor' && !makeContent  ? <Button text="Make Content" callback={handleMakeContent}></Button> : null} */}
          </> }

      </menuPanel>
    </Tool>
  );
}




