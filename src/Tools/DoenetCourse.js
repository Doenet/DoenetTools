import nanoid from 'nanoid';
// import query from '../queryParamFuncs';
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
import MenuItem from "../imports/PanelHeaderComponents/MenuItem";
import Menu, { useMenuContext } from "../imports/PanelHeaderComponents/Menu";
import axios from "axios";
import Drive, { folderDictionarySelector}  from "../imports/Drive";
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
export const assignmentIdAtom = atom({
  key: "assignmentIdAtom",
  default: ''

})

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
            //contentId={''}
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

const updateAssignment = (payload) => {
  try {
    return axios.post(
      `/api/makeAssignment.php`, payload
    ).then((response) => {
      return response.data;
    });
  } catch (e) {
    console.log(e);
  }
}
// let loadAllAssignment =  selectorFamily({
//   key:"loadAllAssignment",
//   get: (courseId) => async ({get,set})=>{
//     if(courseId)
//     {
//       const {data} =  axios.post(
//     `/api/getAllAssignmentSettings.php?courseId=${courseId}`
//    )
//        return data;
//     }      
// }})

// let loadAssignmentSettings =  selectorFamily({
//   key:"loadAssignmentSettings",
//   get: (assignmentId) => async ({get,set})=>{
//     if(asignmentId)
//     {
//       const {data} =  axios.post(
//     `/api/getAssignmentSettings.php?assignmentId=${assignmentId}`
//    )
//        return data;
//     }      
// }})


// const getAllAsignmentSettings = () => {
//   try {
//     return axios.post(
//       `/api/getAllAssignmentSettings.php`
//     ).then((response) => {  
//       console.log(">>> response all assignment",response);
//       return response.data;

//     });    
//   } catch (e) {
//     console.log(e);
//   }
// }



const AssignmentViewForm = (props) => {
  const { title, assignedDate, dueDate, timeLimit, numberOfAttemptsAllowed, attemptAggregation, totalPointsOrPercent, gradeCategory, individualize, multipleAttempts, showSolution, showFeedback, showHints, showCorrectness, proctorMakesAvailable } = props.data;
  const role = props.role;
  return (
    <>
      <div>
        <label>Assignment Name: {title}</label>
      </div>
      {role === 'Instructor' ? <div><label >Assigned Date: {assignedDate}</label></div>: null}
        <div><label >Due Date: {dueDate}</label></div>
        <div><label >Time Limit: {timeLimit}</label></div>
        <div><label >Number Of Attempts: {numberOfAttemptsAllowed}</label></div>
        {role === 'Instructor' ? <div><label >Attempt aggregation :{attemptAggregation}</label></div> : null}
        <div><label>Total Points Or Percent :{totalPointsOrPercent}</label></div>
        
      {role === 'Instructor' ?
        <>
        <div><label>Grade Category: {gradeCategory}</label></div>
          <div><label>Individualize: {individualize}</label></div>
          <div><label>Multiple Attempts: {multipleAttempts}</label></div>
          <div> <label>Show solution: {showSolution}</label> </div>
          <div><label>Show feedback: {showFeedback}</label></div>
          <div><label>Show hints: {showHints}</label></div>
          <div><label>Show correctness: {showCorrectness}</label></div>
          <div><label>Proctor make available: {proctorMakesAvailable}</label></div>
          <br />
        </> : null}
    </>
  )
}
const MakeAssignment = ({ itemId, courseId }) => {
  const role = useRecoilValue(roleAtom);
  const [assignid, setAssignmentIdValue] = useRecoilState(assignmentIdAtom);
  const setAssignmentObjData = useSetRecoilState(loadAssignment({ assignid, role }));
  let setFolderInfo = useSetRecoilState(folderDictionarySelector({driveId:"ZLHh5s8BWM2azTVFhazIH",folderId:"ZLHh5s8BWM2azTVFhazIH"}))

  const [viewForm, setViewForm] = useState(false);

  const contentPublish = () => {
    try {
       axios.post(
        `/api/contentPublish.php?itemId=${itemId}`
      ).then((response) => {
        console.log("response content", response.data);
      });
    } catch (e) {
      console.log(e);
    }
  }
  const makeAssignmentValueUpdate = () => {
    if (role === 'Instructor') {
      let assignmentId = nanoid();
      setAssignmentIdValue(assignmentId);
      setViewForm(true);
      const payload = {
        assignmentId: assignmentId, itemId: itemId, courseId: courseId
      }
      updateAssignment(payload).then((data) => setAssignmentObjData({ data, type: 'update', role }));
    }
    else
      return null;
  }
  return role === 'Instructor' ?
    (
      <>
        {/* {console.log("assignid", assignid)} */}
        { (assignid === '' || typeof(assignid) === 'undefined') ? itemId != '' ?
        <>
          <ActionButton text="makeassignment" callback={makeAssignmentValueUpdate}></ActionButton> <br/>
          <ActionButton text="Publish Content" callback={contentPublish}></ActionButton>

          </>
          : null :
          <CollapseSection title="Edit Assignment Settings" >
            <AssignmentForm itemId={itemId} courseId={courseId} />
          </CollapseSection>}

      </>
    ) : (<CollapseSection >
      <AssignmentForm itemId={itemId} courseId={courseId} />
    </CollapseSection>);
}
const getAssignmentSettings = (payload) => {
  try {
    return axios.get(
      `/api/getAssignmentSettings.php`, { params: { assignmentId: payload.assignmentId, role: payload.role } }
    ).then((response) => {
      return response.data;
    });
  } catch (e) {
    console.log(e);
  }
}

const loadAssignmentDictionary = atomFamily({
  key: 'loadAssignmentDictionary',
  default: selectorFamily({
    key: "loadAssignmentDictionary/Default",
    get: (dataObj) => ({ get }) => {
      if (dataObj.assignmentId) {
        let payload = {
          assignmentId: dataObj.assignmentId, role: dataObj.role
        }

        let data = getAssignmentSettings(payload);
        return data;
      }
      else
        return null;
    }
  })
});

const loadAssignment = selectorFamily({
  key: "loadAssignment",
  get: (assignmentDataObj) => ({ get }) => {
    return get(loadAssignmentDictionary(assignmentDataObj.assignmentId, assignmentDataObj.role))
  },
  set: (assignmentId) => async ({ set, get }, name) => {
    // console.log(">>>> name", name)
    if (name.type === 'update') {
      set(loadAssignmentDictionary(assignmentId, name.role), (old) => {
        return { ...old, ...name.data }
      });
    }
    else {
      const key = Object.keys(name)[0];
      const value = Object.values(name)[0];
      set(loadAssignmentDictionary(assignmentId, name.role), (old) => {
        return { ...old, [key]: value }
      });
    }
  }

})

const AssignmentForm = ({ itemId, courseId }) => {
  const setOverlayOpen = useSetRecoilState(openOverlayByName);

  const role = useRecoilValue(roleAtom);
  const assignmentId = useRecoilValue(assignmentIdAtom);
  // console.log("assignment id in form", assignmentId);
  const assignmentObjData = useRecoilStateLoadable(loadAssignmentDictionary({ assignmentId, role }));
  const setAssignmentObjData = useSetRecoilState(loadAssignment({ assignmentId, role }));
  // console.log("assign obj ***", assignmentObjData);
  if (assignmentObjData.state === "loading") { return null; }
  if (assignmentObjData.state === "hasError") {
    console.error(assignmentObjData.contents)
    return null;
  }
  if (assignmentObjData.state === "hasValue") {
    console.error(">>>> asssign", assignmentObjData[0].contents)
  }

  const updateAssignmentSettings = (payload) => {
    try {
      return axios.post(
        `/api/saveAssignmentSettings.php`, payload
      ).then((response) => {
        return response.data;
      });
    } catch (e) {
      console.log(e);
    }
  }
  const publishedAssignment = (payload) => {
    try {
      return axios.post(
        `/api/publishedAssignment.php`, payload
      ).then((response) => {
        return response.data;
      });
    } catch (e) {
      console.log(e);
    }
  }

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setAssignmentObjData({ [name]: value, role: role });
    // console.log(">>>{[name]:value}",name,value);
  }
  const handleOnBlur = async (e) => {
    let submitted = '1';
    const payload = {
      ...assignmentObjData[0].contents,
      itemId: itemId,
      assignmentId,
      isSubmitted: submitted,
      makeContent: 1,
      courseId: courseId,
      role: role
    }
    await updateAssignmentSettings(payload).then((data) => console.log('successs'));
  }
  const handleMakeContent = async () => {
    const payload = {
      ...assignmentObjData[0].contents,
      itemId: itemId,
      assignmentId,
      isSubmitted: 1,
      makeContent: 0,
      courseId: courseId,
      role: role

    }
    await updateAssignmentSettings(payload).then((data) => setAssignmentObjData({ data, type: 'update', role }));
  }
  const handleLoadAssignment = async () => {
    const payload = {
      ...assignmentObjData[0].contents,
      itemId: itemId,
      assignmentId,
      isSubmitted: 1,
      makeContent: 1,
      courseId: courseId,
      role: role

    }
    await updateAssignmentSettings(payload).then((data) => setAssignmentObjData({ data, type: 'update', role }));
  }


  const handleSubmit = async (e) => {
    let submitted = '1';
    const payload = {
      ...assignmentObjData[0].contents,
      itemId: itemId,
      assignmentId,
      isSubmitted: submitted,
      makeContent: 1,
      courseId: courseId,
      role: role
    }
    const response = await updateAssignmentSettings(payload).then((data) => data);
    await publishedAssignment(payload).then((data) => data);
  }
  return (
    <>
      {role === "Instructor" ?
        <>
        {  role === 'Student' ? 
          <AssignmentViewForm role={role} data={assignmentObjData[0].contents} />
           : 
<>
          <div>
            <label>Assignment Name :</label>
            <input required type="text" name="title" value={assignmentObjData[0].contents?.title}
              placeholder="Title goes here" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >Assigned Date:</label>
            <input required type="datetime-local" name="assignedDate" value={assignmentObjData[0].contents?.assignedDate}
              placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >Due date: </label>
            <input required type="datetime-local" name="dueDate" value={assignmentObjData[0].contents?.dueDate}
              placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
         
            <div>
              <label>Time Limit:</label>
              <input required type="text" name="timeLimit" value={assignmentObjData[0].contents?.timeLimit}
                placeholder="01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
            </div>
            <div >
              <label >Number Of Attempts:</label>
              <input required type="number" name="numberOfAttemptsAllowed" value={assignmentObjData[0].contents?.numberOfAttemptsAllowed}
                onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
            </div>
            <div>
            <label >Attempt Aggregation :</label>
            <input required type="text" name="attemptAggregation" value={assignmentObjData[0]?.contents.attemptAggregation}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label>Total Points Or Percent: </label>
            <input required type="number" name="totalPointsOrPercent" value={assignmentObjData[0]?.contents.totalPointsOrPercent}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label>Grade Category: </label>
            <input required type="select" name="gradeCategory" value={assignmentObjData[0]?.contents.gradeCategory}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label>Individualize: </label>
            <input required type="checkbox" name="individualize" value={assignmentObjData[0]?.contents.individualize}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >Multiple Attempts: </label>
            <input required type="checkbox" name="multipleAttempts" value={assignmentObjData[0]?.contents.multipleAttempts}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >Show solution: </label>
            <input required type="checkbox" name="showSolution" value={assignmentObjData[0]?.contents.showSolution}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >Show feedback: </label>
            <input required type="checkbox" name="showFeedback" value={assignmentObjData[0]?.contents.showFeedback}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >Show hints: </label>
            <input required type="checkbox" name="showHints" value={assignmentObjData[0]?.contents.showHints}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >Show correctness: </label>
            <input required type="checkbox" name="showCorrectness" value={assignmentObjData[0]?.contents.showCorrectness}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >Proctor make available: </label>
            <input required type="checkbox" name="proctorMakesAvailable" value={assignmentObjData[0]?.contents.proctorMakesAvailable}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>


          {
            role === 'Instructor' ? <ActionButton text="MakeContent" callback={handleMakeContent} /> : null
          }
          {
            role === 'Instructor'? <ActionButton text="Publish" id="formSubmitButton" callback={handleSubmit} type="submit" ></ActionButton> : null

          }
       </> }

        </>
        :
        <>
          {/* {
            assignmentId !== '' && role === 'Instructor' ? <ActionButton text="LoadAssignment" callback={handleLoadAssignment} /> : null
          } */}
        </>
      }
    </>

  )
}


export default function DoenetCourse(props) {
  console.log("=== DoenetCourse");
  return (
    <DoenetCourseRouted props={props} />
  )
}

function getAssignmentData(payload) {
  // console.log("get payload",payload);
  return axios.get(
    `/api/getAllAssignmentSettings.php`, { params: { courseId: payload.courseId } }
  ).then((response) => {
    return response.data;
  });
}


const loadAssignmentValue = atomFamily({
  key: 'loadAssignmentValue',
  value: ''
});
const loadAssignmentSelector = selectorFamily({
  key: 'loadAssignemntSlector',
  get: (dataObj) => async ({ get }) => {
    // console.log("role in selector",dataObj);
    const payload = { courseId: dataObj?.courseId }
    let data = await getAssignmentData(payload);
    return data;
  }
})

const selectedInformation = selectorFamily({
  key:"selectedInformation",
  get: ({driveId,folderId})=>({get})=>{  
    console.log(">>> driveid ", driveId, folderId);  
    let folderInfo = get(folderDictionarySelector({driveId,folderId}));

    return {number:folderInfo}
  }
})

function DoenetCourseRouted(props) {


    const setOverlayOpen = useSetRecoilState(openOverlayByName);

  let [hideUnpublished,setHideUnpublished] = useState(false)

  const setSupportVisiblity = useSetRecoilState(supportVisible);

  let pathItemId = '';
  let routePathDriveId = '';
  let routePathFolderId = '';
  let itemType = '';
  const role = useRecoilValue(roleAtom);

  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.props.route.location.search));
  const [assignid, setAssignmentIdValue] = useRecoilState(assignmentIdAtom);
  if (urlParamsObj?.path !== undefined) {
    [routePathDriveId, routePathFolderId, pathItemId, itemType] = urlParamsObj.path.split(":");
  }
  // const infoLoad = useRecoilValueLoadable(selectedInformation({driveId:routePathDriveId,folderId: routePathFolderId}));
  // const infoLoad = useSetRecoilState(selectedInformation({driveId:routePathDriveId,folderId: routePathFolderId}));
  let setFolderInfo = useSetRecoilState(folderDictionarySelector({driveId:"Fhg532fk9873412s",folderId:"Fhg532fk9873412s"}));
  if (setFolderInfo.state === 'hasValue') {
    console.log(">>> infoLoad ", setFolderInfo)
  }
  let courseId = 'Fhg532fk9873412s65';
  if (urlParamsObj?.courseId !== undefined) {
    courseId = urlParamsObj?.courseId;
  }
  // console.log(">>> courseId", courseId);

  const [openEnrollment, setEnrollmentView] = useState(false);

  const enrollCourseId = { courseId: courseId };
  // const assignmentInfo = useRecoilValueLoadable(loadAllAssignment({courseId}))
  // console.log("role in routed", role);
  const assignmentInfo = useRecoilValueLoadable(loadAssignmentSelector({ courseId }))

  if (assignmentInfo.state === "loading") { return null; }
  if (assignmentInfo.state === "hasError") {
    console.error(assignmentInfo.contents)
    return null;
  }

  const filterAssignment = (assignments, itemId) => {
    return assignments.filter((assignmentInfoData => assignmentInfoData.itemId === itemId))
  }
  let contentId = '';

  if (assignmentInfo.state === 'hasValue') {
    // console.log(">>> assignmnt info content", assignmentInfo)
    if (assignmentInfo.contents !== null) {
      let assignment = filterAssignment(assignmentInfo.contents.assignments, pathItemId);
      // console.log('>>> asignmnt >> ', assignment)
      if (assignment.length > 0) {
        setAssignmentIdValue(assignment[0].assignmentId);
        contentId = assignment[0].contentId;
      }
    }
  }
  const getContentId = async (pathItemId) => {
    return await axios.get(
      `/api/getContentId.php`, { params: { itemId:pathItemId } }
    ).then((response) => {
      console.log("data response", response.data);
      return response.data;
    });
  } 
  if(contentId === '')
  {
      let res = getContentId(pathItemId).then(data => {return data});
      console.log("res", res);
      contentId = res.contentId;
  }

  return (
    <Tool>
      <navPanel>
        <AddItem />
        {/* <Drive types={['course']} urlClickBehaviour="select" /><br /> */}
        {hideUnpublished ? <p>hideUnpublished is True</p> : <p>hideUnpublished is False</p>}

        <Drive driveId='Fhg532fk9873412s' hideUnpublished={hideUnpublished} urlClickBehavior="select"/>
        <Menu label="Role">
          <MenuItem value="Student" onSelect={() => console.log('text')} />
          <MenuItem value="Instructor" onSelect={() => console.log('text123')} />
        </Menu>
        {role === 'Instructor' && <ActionButton text="Course Enrollment" callback={() => { setEnrollmentView(!openEnrollment) }}></ActionButton>}
      </navPanel>

      <headerPanel title="my title">
        <Switch
          onChange={(value) => {
            setSupportVisiblity(value);
          }}
        />
        <p>header for important stuff</p>
      </headerPanel>
      <mainPanel>
        {contentId && routePathDriveId ? <DisplayCourseContent driveId={routePathDriveId} contentId={contentId} /> : null}
        { openEnrollment ? <Enrollment selectedCourse={enrollCourseId} /> : null}

      </mainPanel>
      <menuPanel title="Content Info">
        {
          itemType === 'DoenetML' ?
            <MakeAssignment itemId={pathItemId} courseId={courseId} />
            : null
        }

      </menuPanel>

  {/* {editAssignment} */}
    </Tool>
  );
}



