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
import Drive, { folderDictionarySelector}  from "../imports/Drive-recoilattempt26j";
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
  get: (courseId) => async ({ get, set }) => {
    const { data } = await axios.get(
      `/api/getAllAssignmentSettings.php?courseId=${courseId}`
    );
    return data;

  }
})


export const assignmentDictionary = atomFamily({
  key: "assignmentDictionary",
  default: selectorFamily({
    key: "assignmentDictionary/Default",
    get: (courseIdassignmentId) => ({ get }) => {
      // console.log(">> cid aid", courseIdassignmentId);
      const assignmentInfo = get(loadAssignmentSelector(courseIdassignmentId.courseId))
      // console.log(">>assignmentInfo", assignmentInfo);
      return assignmentInfo;
    }
  })
})
let loadAssignmentSettings = selectorFamily({ //recoilvalue(loadAssignmentSettings(assignmentId))
  key: "loadAssignmentSettings",
  get: (assignmentId) => async ({ get }) => {
    return get(assignmentDictionary(assignmentId));
  },
  set: (assignmentId) => async ({ set, get }, instructions) => {
    const assignInfo = get(assignmentDictionary(assignmentId))
    // console.log(">>>assignInfo", assignInfo);
  }
})
// let loadAssignmentSettings =  selectorFamily({ //recoilvalue(loadAssignmentSettings(assignmentId))
//   key:"loadAssignmentSettings",
//   get: (assignmentId) => async ({get,set})=>{
//    const assignmentData = get(loadAssignmentSelector(assignmentId))
//     console.log(">>>assignmentData settings",assignmentData);
//     }      
//   })

function DoenetCourseRouted(props) {
  const role = useRecoilValue(roleAtom);
  // const assignmentIdSettings = useRecoilValueLoadable(loadAssignmentSettings(assignmentId))

  const [assignmentIdValue, setOpenAssignment] = useState("");
  const setOverlayOpen = useSetRecoilState(openOverlayByName);
  let [hideUnpublished, setHideUnpublished] = useState(role === 'Instructor' ? false : true);
  const setSupportVisiblity = useSetRecoilState(supportVisible);
  let pathItemId = '';
  let routePathDriveId = '';
  let routePathFolderId = '';
  let itemType = '';
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.props.route.location.search));
  const [assignid, setAssignmentIdValue] = useRecoilState(assignmentIdAtom);
  if (urlParamsObj?.path !== undefined) {
    [routePathDriveId, routePathFolderId, pathItemId, itemType] = urlParamsObj.path.split(":");
  }
  // const infoLoad = useRecoilValueLoadable(selectedInformation({driveId:routePathDriveId,folderId: routePathFolderId}));
  // const infoLoad = useSetRecoilState(selectedInformation({driveId:routePathDriveId,folderId: routePathFolderId}));
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderDictionarySelector({ driveId: routePathDriveId, folderId: routePathFolderId }))

  // console.log(">>> setFolderInfo", setFolderInfo)
  let courseId = 'Fhg532fk9873412s65';
  if (urlParamsObj?.courseId !== undefined) {
    courseId = urlParamsObj?.courseId;
  }

  const [openEnrollment, setEnrollmentView] = useState(false);

  const enrollCourseId = { courseId: courseId };
  const filterAssignment = (assignments, itemId) => {
    return assignments.filter((assignmentInfoData => assignmentInfoData.itemId === itemId))
  }
  let contentId = '';
  let displayAssignmentSettings = '';
  const assignmentObjInfo = useRecoilValueLoadable(assignmentDictionary({ courseId: courseId, assignmentId: props.assignmentId }))
  // console.log(">>> assignmentInfo 12345",assignmentObjInfo);

  if (assignmentObjInfo.state === 'hasValue' && assignmentObjInfo.contents) {
    // console.log(">>> assignmentobjInfo",assignmentObjInfo);
    for (let assignment of assignmentObjInfo.contents.assignments) {
      if (assignment.itemId === pathItemId) {
        // if (assignment.itemId === props.itemId){

        // console.log(">>>assignment 1234", assignment);
        displayAssignmentSettings = assignment;
        contentId = assignment.contentId;
        //setOpenAssignment(assignment.assignmentId);
      }
    }
  }
  if (contentId === '') {
    let data = folderInfoObj.contents.contentsDictionary;
    if (data) {
      contentId = data[pathItemId]?.contentId;
    }
  }

  const NewAssignmentForm = (props) => {
    let data = props.assignment ? props.assignment : {};
    // console.log(">>>> make assignment dataa",data)
    const [assignmentInfo, setAssignmentInfo] = useState(data);
    //     const assignmentObj234Info = useRecoilValue(assignmentDictionary({courseId:props.courseId,assignmentId:props.assignmentId}))
    // console.log("assignmentObj234Info",assignmentObj234Info);
    // const [assignmentInfo, setAssignmentInfo] = useState({});
    const handleChange = (event) => {
      let name = event.target.name;
      let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setAssignmentInfo({ ...assignmentInfo, [name]: value });
    }
    const handleOnBlur = async (e) => {
      let name = e.target.name;
      let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

      const payload = {
        ...assignmentInfo,
        assignmentId: assignmentIdValue ? assignmentIdValue : displayAssignmentSettings.assignmentId,
        assignment_isPublished: 0
      }

      axios.post("/api/saveAssignmentToDraft.php", payload)
        .then((resp) => {
          console.log(resp.data)
          // if(name === 'title'){       
          //   setFolderInfo({instructionType:"assignment title update",itemId:pathItemId,assignedDataSave:payload})
          // }
        }
        )
    }
    const handleSubmit = (e) => {
      const payload = {
        ...assignmentInfo,
        assignmentId: assignmentIdValue ? assignmentIdValue : displayAssignmentSettings.assignmentId,
        assignment_isPublished: 1,
        courseId: courseId
      }
      axios.post("/api/publishAssignment.php", payload)
        .then((resp) => {
          console.log(resp.data)
        }
        )
      setFolderInfo({ instructionType: "assignment was published", itemId: pathItemId, assignedData: payload })
    }
    return (
      role === 'Instructor' ?
        <>
          <div>
            <label>Assignment Name :</label>
            <input required type="text" name="title" value={assignmentInfo?.title}
              placeholder="Title goes here" onBlur={handleOnBlur} onChange={handleChange} />
          </div>
          <div >
            <label >Assigned Date:</label>
            <input required type="datetime-local" name="assignedDate" value={assignmentInfo?.assignedDate}
              placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} onChange={handleChange} />
          </div>
          <div >
            <label >Due date: </label>
            <input required type="datetime-local" name="dueDate" value={assignmentInfo?.dueDate}
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
            <Button text="Publish" id="formSubmitButton" callback={handleSubmit} type="submit" ></Button>
          </div>
        </>
        : <div>
          <div>
            <h1>{assignmentInfo?.title}</h1>
            <p>Due: {assignmentInfo?.dueDate}</p>
            <p>Time Limit: {assignmentInfo?.timeLimit}</p>
            <p>Number of Attempts Allowed: {assignmentInfo?.numberOfAttemptsAllowed}</p>
            <p>Points: {assignmentInfo?.assignedDatatotalPointsOrPercent}</p>
          </div>
        </div>
    )
  }
  let makeassignmentIsSelected = false;
  const handleMakeAssignment = () => {
    makeassignmentIsSelected = true;
    let assignmentId = nanoid();
    setOpenAssignment(assignmentId);
    // setFolderInfo({instructionType:"make content assignment",itemId:pathItemId,assignmentId});

    let payload = {
      assignmentId, pathItemId, courseId
    }
    // console.log(">>>makeNewAssignment",payload);
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
    // console.log(">>>handle publish content",payload);
    axios.post(
      `/api/handlePublishContent.php`, payload
    ).then((response) => {
      console.log(response.data);
    });
  }
  const [makeContent, setMakeContent] = useState(false);
  const handleMakeContent = () => {
    let payload = {
      itemId: pathItemId,
      // label:label
    }
    // console.log(">>>handle make content",payload);
    setMakeContent(true);
    axios.post(
      `/api/handleMakeContent.php`, payload
    ).then((response) => {
      console.log(response.data);
    });
    setFolderInfo({ instructionType: "handle make content", itemId: pathItemId, assignedDataSavenew: payload })
  }


  const loadBackAssignment = () => {
    // console.log("load back assignment", assignmentObjInfo.contents.assignments);
    for (let assignment of assignmentObjInfo.contents.assignments) {
      if (assignment.itemId === pathItemId) {
        // if (assignment.itemId === props.itemId){
        setMakeContent(false);
        // console.log(">>>assignment new", assignment);
        displayAssignmentSettings = assignment;
        contentId = assignment.contentId;
      }
    }
  }
  return (
    <Tool>
      <navPanel>
        <AddItem />
        <Drive types={['course']} hideUnpublished={hideUnpublished} urlClickBehaviour="select" /><br />

        {/* <Drive driveId='Fhg532fk9873412s' hideUnpublished={hideUnpublished} urlClickBehavior="select" /> */}
        {role === 'Instructor' ?
          <Menu label="Role">
            <MenuItem value="Student" onSelect={() => setHideUnpublished(true)} />
            <MenuItem value="Instructor" onSelect={() => setHideUnpublished(false)} />
          </Menu> : null}
        {role === 'Instructor' &&
          <Button text="Course Enrollment" callback={() => { setEnrollmentView(!openEnrollment) }}>
          </Button>}
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
        {openEnrollment ? <Enrollment selectedCourse={enrollCourseId} /> : null}

      </mainPanel>
      <menuPanel title="Content Info">



        {/* <AssignmentForm courseId={courseId} assignmentId="9woPGRp9KuppjYXIzDM1T"/> */}

        {
          itemType === 'DoenetML' && displayAssignmentSettings == '' && !makeassignmentIsSelected && !assignmentIdValue && role === 'Instructor' ?
            <>
              <Button text="Make Assignment" callback={handleMakeAssignment}></Button>
              <Button text="Publish Content" callback={handlePublishContent}></Button>
            </>
            : null

        }


        {role === 'Instructor' && makeContent ? <Button text="Make Assignment" callback={loadBackAssignment} /> : null}

        {role === 'Instructor' && itemType === 'Url' ?
          <>
            <Button text="Publish Content" callback={handlePublishContent}></Button>
          </>
          : null
        }
        {role === 'Instructor' && itemType === 'Folder' ?
          <>
            <Button text="Publish Content" callback={handlePublishContent}></Button>
          </>
          : null
        }


        {
          displayAssignmentSettings || assignmentIdValue ?
            <>
              {!makeContent ? <NewAssignmentForm
                courseId={courseId}
                assignmentId={assignmentIdValue}
                assignment={displayAssignmentSettings}
                itemId={pathItemId} /> : null}

              {!makeContent && role === 'Instructor' ? <Button text="Make Content" callback={handleMakeContent}></Button> : null}
            </>
            : null
        }

      </menuPanel>

      {/* {editAssignment} */}
    </Tool>
  );
}
