  // import DoenetViewer from '../Tools/DoenetViewer';

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
  import {CourseAssignments,CourseAssignmentControls} from "./courseAssignments";
  import LearnerAssignment from './LearnerAssignment'; 
  import Tool, { openOverlayByName } from "../imports/Tool/Tool";
  import CollapseSection from "../imports/CollapseSection";
  import ActionButton from "../imports/PanelHeaderComponents/ActionButton";
  import Button from "../imports/PanelHeaderComponents/Button";
  import MenuItem from "../imports/PanelHeaderComponents/MenuItem";
  import Menu,{ useMenuContext } from "../imports/PanelHeaderComponents/Menu";
  import axios from "axios";
  import Drive,{ selectedCourse } from "../imports/Drive";
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
    key:"roleAtom",
    default:'Instructor'
  
  })
  export const contentIdAtom = atom({
    key:"contentIdAtom",
    default:''
  
  })
  export const assignmentIdAtom = atom({
    key:"assignmentIdAtom",
    default:''
  
  })

  const DisplayCourseContent = (props) => {
    const [doenetML, setDoenetMLUpdate] = useState('');
    const [updateNumber, setUpdateNumber] = useState(0)
    const role = useRecoilValue(roleAtom);
    const data = {
      branchId: props.driveId,
      contentId: "",
      itemId:props.itemId,
      ListOfContentId: "", 
      List_Of_Recent_doenetML: [], 
    }
    const payload = {
      params: data
    }
    
    useEffect(() => {
      let mounted = true; 
      getDoenetML().then((response)=>{
        if(mounted)
        {
          setDoenetMLUpdate(response);
          setUpdateNumber(updateNumber+1)
        }
      });
      return () => { mounted = false };
    }, [props.itemId]);
  
  const getDoenetML = () => {
    try {
      return axios.get(
        `/media/${props.itemId}`
      ).then((response) => {  
        console.log(response);
  
        return response.data;
      });    
    } catch (e) {
      console.log(e);
    }
  }
  
    return (
      <div data-cy="overviewNavItem">
        {doenetML != "" ?
         role === 'Student' ? 
          <DoenetViewer
          key={"loadoverview" + updateNumber}
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
          :   <DoenetViewer
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
        `/api/makeAssignment.php`,payload
      ).then((response) => {  
        return response.data;
      });    
    } catch (e) {
      console.log(e);
    }
  }
  let loadAllAssignment =  selectorFamily({
    key:"loadAllAssignment",
    get: (courseId) => async ({get,set})=>{
      if(courseId)
      {
        const {data} =  axios.post(
      `/api/getAllAssignmentSettings.php?courseId=${courseId}`
     )
         return data;
      }      
  }})
  
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


  

  const MakeAssignment = ({itemId,courseId}) => {
    const role = useRecoilValue(roleAtom);
    // const setAssignmentIdValue = useSetRecoilState(assignmentIdAtom);
    // const assignid = useRecoilValue(assignmentIdAtom);
    const [assignid,setAssignmentIdValue] = useRecoilState(assignmentIdAtom);

    const setAssignmentObjData = useSetRecoilState(loadAssignment({assignid,role})); 

    const [viewForm, setViewForm] = useState(false);
    const makeAssignmentValueUpdate = () =>{
      if(role === 'Instructor')
      {
        let assignmentId = nanoid();
        setAssignmentIdValue(assignmentId);
        setViewForm(true);
        const payload = {
          assignmentId:assignmentId,itemId:itemId,courseId:courseId   
        }
        updateAssignment(payload).then((data) => setAssignmentObjData({data,type:'update',role}));
      }
      else
        return null;
    }
    // return role === 'Instructor' && contentId != ''  ? 
    return role === 'Instructor' ? 

    (
      <>
    { (assignid === '' || typeof(assignid) === 'undefined') ? itemId != '' ? 
    <Button text="makeassignment" callback={makeAssignmentValueUpdate}></Button>
    : null :
     <CollapseSection title="Edit Assignment Settings" >
        <AssignmentForm itemId={itemId} courseId={courseId}/>  
    </CollapseSection>}

    </>
     ): (<CollapseSection >
      <AssignmentForm itemId={itemId} courseId={courseId}/>  
   </CollapseSection>);
  }
  const getAssignmentSettings = (payload) => {
  try {
    return axios.get(
      `/api/getAssignmentSettings.php`,{params:{assignmentId:payload.assignmentId,role:payload.role}}
    ).then((response) => {  
      return response.data;
    });    
  } catch (e) {
    console.log(e);
  }
}

const loadAssignmentDictionary= atomFamily({
  key:'loadAssignmentDictionary',
  default:selectorFamily({
    key:"loadAssignmentDictionary/Default",
    get: (dataObj) => ({get})=>{
      if(dataObj.assignmentId)
      {
        let payload = {
          assignmentId:dataObj.assignmentId, role:dataObj.role}       
     
        let data = getAssignmentSettings(payload);
        return data;
      }
      else
        return null;
    }
    })
});

const loadAssignment = selectorFamily({
  key:"loadAssignment",
  get:(assignmentDataObj) => ({get}) => {
    return get(loadAssignmentDictionary(assignmentDataObj.assignmentId, assignmentDataObj.role))
  },
  set:(assignmentId) => async ({set,get},name)=>{
    console.log(">>>> name",name)
    if(name.type === 'update')
    {
      set(loadAssignmentDictionary(assignmentId,name.role),(old) => {
        return {...old,...name.data}});
    }
    else
    {
      const key = Object.keys(name)[0];
      const value = Object.values(name)[0];    
      set(loadAssignmentDictionary(assignmentId,name.role),(old) => {
        return {...old,[key]:value}});
    }
  }
    
})



const AssignmentForm = ({itemId,courseId}) => {
  const role = useRecoilValue(roleAtom);
  const assignmentId = useRecoilValue(assignmentIdAtom);
  const assignmentObjData = useRecoilStateLoadable(loadAssignmentDictionary({assignmentId,role})); 
  const setAssignmentObjData = useSetRecoilState(loadAssignment({assignmentId,role})); 
  if (assignmentObjData.state === "loading"){ return null;}
  if (assignmentObjData.state === "hasError"){ 
    console.error(assignmentObjData.contents)
    return null;}
  if(assignmentObjData.state === "hasValue"){
    console.error(">>>> asssign",assignmentObjData[0].contents)
  }  

const updateAssignmentSettings = (payload) => {
  try {
    return axios.post(
      `/api/saveAssignmentSettings.php`,payload
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
      `/api/publishedAssignment.php`,payload
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
  setAssignmentObjData({[name]:value,role:role});
  // console.log(">>>{[name]:value}",name,value);
}
 const handleOnBlur = async(e) => {
  let submitted = '0';
  const payload = {...assignmentObjData[0].contents,
    itemId:itemId,
    assignmentId,
    isSubmitted:submitted,
    makeContent:1,
    courseId:courseId,
    role:role
  }
  await updateAssignmentSettings(payload).then((data) => console.log('successs'));
}
const handleMakeContent = async() => {  
  const payload = {...assignmentObjData[0].contents,
    itemId:itemId,
    assignmentId,
    isSubmitted:1,
    makeContent:0,
    courseId:courseId,
    role:role

  }
  await updateAssignmentSettings(payload).then((data) => setAssignmentObjData({data,type:'update',role}));
}
  const handleLoadAssignment = async () => {
    const payload = {
      ...assignmentObjData[0].contents,
      itemId: itemId,
      assignmentId,
      isSubmitted: 1,
      makeContent: 1,
      courseId: courseId,
      role:role

    }
    await updateAssignmentSettings(payload).then((data) => setAssignmentObjData({ data, type: 'update',role }));
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
      role:role
    }
    const response = await updateAssignmentSettings(payload).then((data) => data);
    await publishedAssignment(payload).then((data) => data);
  }
  return(
    <>
    {(assignmentObjData[0].contents?.isPublished === '1' || role === "Instructor") && assignmentObjData[0].contents?.isAssignment == '1'? 
         <>
          <div>
            <label>Title</label>
            <input required type="text" name="title" value={assignmentObjData[0].contents?.title}
              placeholder="Title goes here" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >Assignmed Date</label>
            <input  required type="text" name="assignedDate" value={assignmentObjData[0].contents?.assignedDate}
              placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >Due date</label>
            <input  required type="text" name="dueDate" value={assignmentObjData[0].contents?.dueDate}
              placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
          <div >
            <label >timeLimit</label>
            <input  required type="text" name="timeLimit" value={assignmentObjData[0].contents?.timeLimit}
              placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >numberOfAttemptsAllowed</label>
            <input  required type="text" name="numberOfAttemptsAllowed" value={assignmentObjData[0].contents?.numberOfAttemptsAllowed}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          
            <label >attemptAggregation</label>
            <input  type="text" name="attemptAggregation" value={assignmentObjData[0]?.contents.attemptAggregation}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >totalPointsOrPercent</label>
            <input  type="float" name="totalPointsOrPercent" value={assignmentObjData[0]?.contents.totalPointsOrPercent}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >gradeCategory</label>
            <input  type="text" name="gradeCategory" value={assignmentObjData[0]?.contents.gradeCategory}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >individualize</label>
            <input  type="number" name="individualize" value={assignmentObjData[0]?.contents.individualize}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >multipleAttempts</label>
            <input  type="number" name="multipleAttempts" value={assignmentObjData[0]?.contents.multipleAttempts}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >showSolution</label>
            <input  type="number" name="showSolution" value={assignmentObjData[0]?.contents.showSolution}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >showFeedback</label>
            <input  type="number" name="showFeedback" value={assignmentObjData[0]?.contents.showFeedback}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >showHints</label>
            <input  type="number" name="showHints" value={assignmentObjData[0]?.contents.showHints}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >showCorrectness</label>
            <input  type="number" name="showCorrectness" value={assignmentObjData[0]?.contents.showCorrectness}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label >proctorMakesAvailable</label>
            <input  type="number" name="proctorMakesAvailable" value={assignmentObjData[0]?.contents.proctorMakesAvailable}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          

          {
            role === 'Instructor' ? <Button text="MakeContent" callback={handleMakeContent} /> : null
          }
          {
            role === 'Student' ? null : <Button text="Publish" id="formSubmitButton" callback={handleSubmit} type="submit" ></Button>

          }
         
         </>
    : 
    <>
    {
      assignmentId !== '' && role === 'Instructor' ? <Button text="LoadAssignment" callback={handleLoadAssignment} /> : null
    }
    <div>Assignments will be published soon...</div>
    </>
    }
    </>
   
  )
} 

  export default function DoenetCourse(props) {
    console.log("=== DoenetCourse");
return(
  <DoenetCourseRouted props={props} />
)
  }
function getAssignmentData(payload){
  // console.log("get payload",payload);
  return axios.get(
    `/api/getItemAssignmentInfo.php`,{params:{itemId:payload.itemId,role:payload.role}}
  ).then((response) => {  
    return response.data;
  }); 
}
  const loadAssignmentValue = atomFamily({
    key:'loadAssignmentValue',
    value:''
  });
  const loadAssignmentSelector = selectorFamily({
    key:'loadAssignemntSlector',
    get:(dataObj)=>async({get})=>{
      // console.log("role in selector",dataObj);
      const payload = {itemId:dataObj?.pathItemId,role:dataObj?.role}
      let data = await getAssignmentData(payload);
      return data;
    }    
  })
  function DoenetCourseRouted(props){
    const [selectedCourse, setSelectedCourse] = useState({});

    useEffect(() => {
      getCourses_CI((courseListArray, selectedCourseObj) => { 
        // console.log("CourseList", courseListArray);
        // console.log("selectedcourse", selectedCourseObj);

        setSelectedCourse(selectedCourseObj)
       })  
    }, [])

    const setSupportVisiblity = useSetRecoilState(supportVisible);

    let pathItemId = '';
    let routePathDriveId = '';
    let routePathFolderId = '';
    let itemType = '';
    const role = useRecoilValue(roleAtom);

    let urlParamsObj = Object.fromEntries(new URLSearchParams(props.props.route.location.search));
    // console.log(">>>route props in course", urlParamsObj);
    const [assignid, setAssignmentIdValue] = useRecoilState(assignmentIdAtom);
    if (urlParamsObj?.path !== undefined) {
      [routePathDriveId, routePathFolderId, pathItemId,itemType] = urlParamsObj.path.split(":");
      // setAssignmentIdValue('');
    }
    let courseId = '';
    if(urlParamsObj?.courseId !== undefined)
    {
      courseId = urlParamsObj?.courseId;

    }
    // console.log(">>> courseId", courseId);

    const [openEnrollment, setEnrollmentView] = useState(false);

    const enrollCourseId = { courseId: courseId };
    // const assignmentInfo = useRecoilValueLoadable(loadAllAssignment({courseId}))
    // console.log("role in routed", role);
    const assignmentInfo = useRecoilValueLoadable(loadAssignmentSelector({pathItemId,role}))

    if (assignmentInfo.state === "loading") { return null; }
    if (assignmentInfo.state === "hasError") {
      console.error(assignmentInfo.contents)
      return null;
    }

    if (assignmentInfo.state === 'hasValue') {
      // console.log(">>> assignmnt info content", assignmentInfo)
      if (typeof (assignmentInfo.contents.assignmentId) !== 'undefined')
        setAssignmentIdValue(assignmentInfo.contents.assignmentId);     
    }



    // const setOverlayOpen = useSetRecoilState(openOverlayByName);

    return (
      <Tool>
        <navPanel>
          <AddItem />
          <Drive types={['course']} urlClickBehaviour="select" /><br />
          <Menu label="Role">
            <MenuItem value="Student" onSelect={() => console.log('text')} />
            <MenuItem value="Instructor" onSelect={() => console.log('text123')} />
          </Menu>
          <Button text="Course Enrollment" callback={() => { setEnrollmentView(!openEnrollment) }}></Button>

          <div>
          {/* <button
            onClick={() => {
              setOverlayOpen("George");
            }}
          >
            Go to Overlay
          </button> */}
        </div>
        </navPanel>

        <headerPanel title="my title">
        <Switch
          onChange={(value) => {
            setSupportVisiblity(value);
          }}
        />
        {/* <Menu label="Role">
            <MenuItem value="Student"  />
            <MenuItem value="Instructor"  />
          </Menu> */}
        <p>header for important stuff</p>
      </headerPanel>
        <mainPanel>
          {pathItemId ? <DisplayCourseContent driveId={routePathDriveId} itemId={pathItemId} /> : null}
          {openEnrollment ? <Enrollment selectedCourse={enrollCourseId} /> : null}
        </mainPanel>
        <menuPanel title="Item Info">
          {
            itemType === 'DoenetML' ? 
            <MakeAssignment itemId={pathItemId} courseId={courseId} />
            : null
          }
        </menuPanel>
      </Tool>
    );
  }


