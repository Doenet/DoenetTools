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



const loadAssignmentSelector = selectorFamily({
  key: 'loadAssignemntSlector',
  get: (dataObj) => async ({ get }) => {
    // console.log("role in selector",dataObj);
    const payload = { courseId: dataObj?.courseId }
    let data = await getAssignmentData(payload);
    return data;
  }
})


function DoenetCourseRouted(props) {
  const [isAssignment,setOpenAssignment] = useState();

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
console.log(">>> setFolderInfo", setFolderInfo)
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


  const MakeAssignmentNew = () =>{
    const [assignmentInfo, setAssignmentInfo] = useState({});
    const handleChange = (event) => {
      let name = event.target.name;
      let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setAssignmentInfo({ ...assignmentInfo,[name]: value});
    }
    const handleOnBlur = async (e) => {
      const payload = {
        ...assignmentInfo,
        assignmentId:isAssignment,
       assignment_isPublished:0
      }
     setFolderInfo({instructionType:"assignment saved to draft",itemId:pathItemId,assignedDataSave:payload})
    }
    const handleSubmit = (e) =>{
      const payload = {
        ...assignmentInfo,
        assignmentId:isAssignment,
        assignment_isPublished:1
      }
      setFolderInfo({instructionType:"assignment was published",itemId:pathItemId,assignedData:payload})
    }
    return (
        role === 'Instructor' ?
      <>
      <div>
        <label>Assignment Name :</label>
        <input required type="text" name="title" value={assignmentInfo?.title}
          placeholder="Title goes here" onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label >Assigned Date:</label>
        <input required type="datetime-local" name="assignedDate" value={assignmentInfo?.assignedDate}
          placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label >Due date: </label>
        <input required type="datetime-local" name="dueDate" value={assignmentInfo?.dueDate}
          placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
     
        <div>
          <label>Time Limit:</label>
          <input required type="time" name="timeLimit" value={assignmentInfo?.timeLimit}
            placeholder="01:01:01" onBlur={handleOnBlur}  onChange={handleChange} />
        </div>
        <div >
          <label >Number Of Attempts:</label>
          <input required type="number" name="numberOfAttemptsAllowed" value={assignmentInfo?.numberOfAttemptsAllowed}
            onBlur={handleOnBlur}  onChange={handleChange} />
        </div>
        <div>
        <label >Attempt Aggregation :</label>
        <input required type="text" name="attemptAggregation" value={assignmentInfo?.attemptAggregation}
          onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label>Total Points Or Percent: </label>
        <input required type="number" name="totalPointsOrPercent" value={assignmentInfo?.totalPointsOrPercent}
          onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label>Grade Category: </label>
        <input required type="select" name="gradeCategory" value={assignmentInfo?.gradeCategory}
          onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label>Individualize: </label>
        <input required type="checkbox" name="individualize" value={assignmentInfo?.individualize}
          onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label >Multiple Attempts: </label>
        <input required type="checkbox" name="multipleAttempts" value={assignmentInfo?.multipleAttempts}
          onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label >Show solution: </label>
        <input required type="checkbox" name="showSolution" value={assignmentInfo?.showSolution}
          onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label >Show feedback: </label>
        <input required type="checkbox" name="showFeedback" value={assignmentInfo?.showFeedback}
          onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label >Show hints: </label>
        <input required type="checkbox" name="showHints" value={assignmentInfo?.showHints}
          onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label >Show correctness: </label>
        <input required type="checkbox" name="showCorrectness" value={assignmentInfo?.showCorrectness}
          onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div >
        <label >Proctor make available: </label>
        <input required type="checkbox" name="proctorMakesAvailable" value={assignmentInfo?.proctorMakesAvailable}
          onBlur={handleOnBlur}  onChange={handleChange} />
      </div>
      <div>
      <ActionButton text="Publish" id="formSubmitButton" callback={handleSubmit} type="submit" ></ActionButton>
      </div>
</>
     : <div>Student view</div> 
     )
  }

const handleMakeAssignment = () =>{
  let assignmentId = nanoid();
  setOpenAssignment(assignmentId);
  setFolderInfo({instructionType:"assignment was make assignment",itemId:pathItemId,assignmentId});
  
  let payload = {
    assignmentId, pathItemId, courseId
  }
  console.log(">>>makeNewAssignment",payload);
  axios.post(
    `/api/makeNewAssignment.php`, payload
  ).then((response) => {
    console.log(response.data);
  });

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
      </headerPanel>
      <mainPanel>

        {contentId && routePathDriveId ? <DisplayCourseContent driveId={routePathDriveId} contentId={contentId} /> : null}
        { openEnrollment ? <Enrollment selectedCourse={enrollCourseId} /> : null}

      </mainPanel>
      <menuPanel title="Content Info">
        {/* {
          itemType === 'DoenetML' ?
            <MakeAssignment itemId={pathItemId} courseId={courseId} />
            : null
        } */}
        {itemType === 'DoenetML' ? 
        <ActionButton text="makeassignment" callback={handleMakeAssignment}></ActionButton>
        :null
        }

 {
   isAssignment ? <MakeAssignmentNew /> : null
 }
       



      </menuPanel>

  {/* {editAssignment} */}
    </Tool>
  );
}



