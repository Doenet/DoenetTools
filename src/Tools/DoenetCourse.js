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
  import Tool from "../imports/Tool/Tool";
  import HeaderMenuPanelButton from "../imports/Tool/HeaderMenuPanelButton";
  import ResponsiveControls from "../imports/Tool/ResponsiveControls";
  import Overlay from "../imports/Tool/Overlay";
  import CollapseSection from "../imports/CollapseSection";
  import MenuPanelSection from "../imports/Tool/MenuPanelSection";
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
    import AddItem from '../imports/AddItem'
  

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


  

  const MakeAssignment = ({itemId,courseId}) => {
    const role = useRecoilValue(roleAtom);
    // const setAssignmentIdValue = useSetRecoilState(assignmentIdAtom);
    // const assignid = useRecoilValue(assignmentIdAtom);
    const [assignid,setAssignmentIdValue] = useRecoilState(assignmentIdAtom);

    const setAssignmentObjData = useSetRecoilState(loadAssignment(assignid)); 

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
        updateAssignment(payload).then((data) => setAssignmentObjData({data,type:'update'}));
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
      `/api/getAssignmentSettings.php`,{params:{assignmentId:payload.assignmentId}}
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
    get: (assignmentId) => ({get})=>{
      if(assignmentId)
      {
        let payload = {
          assignmentId}       
     
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
  get:(assignmentId) => ({get}) => {
    return get(loadAssignmentDictionary(assignmentId))
  },
  set:(assignmentId) => async ({set,get},name)=>{
    console.log(">>>> name",name)
    if(name.type === 'update')
    {
      set(loadAssignmentDictionary(assignmentId),(old) => {
        return {...old,...name.data}});
    }
    else
    {
      const key = Object.keys(name)[0];
      const value = Object.values(name)[0];    
      set(loadAssignmentDictionary(assignmentId),(old) => {
        return {...old,[key]:value}});
    }
  }
    
})


const AssignmentForm = ({itemId,courseId}) => {
  const role = useRecoilValue(roleAtom);
  const assignmentId = useRecoilValue(assignmentIdAtom);
  const assignmentObjData = useRecoilStateLoadable(loadAssignmentDictionary(assignmentId)); 
  const setAssignmentObjData = useSetRecoilState(loadAssignment(assignmentId)); 
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
const handleChange = (event) => {
  let name = event.target.name;
  let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
  setAssignmentObjData({[name]:value});
  // console.log(">>>{[name]:value}",name,value);
}
 const handleOnBlur = async(e) => {
  let submitted = '0';
  const payload = {...assignmentObjData[0].contents,
    itemId:itemId,
    assignmentId,
    isSubmitted:submitted,
    makeContent:1,
    courseId:courseId
  }
  await updateAssignmentSettings(payload).then((data) => console.log('successs'));
}
const handleMakeContent = async() => {  
  const payload = {...assignmentObjData[0].contents,
    itemId:itemId,
    assignmentId,
    isSubmitted:1,
    makeContent:0,
    courseId:courseId
  }
  await updateAssignmentSettings(payload).then((data) => setAssignmentObjData({data,type:'update'}));
}
  const handleLoadAssignment = async () => {
    const payload = {
      ...assignmentObjData[0].contents,
      itemId: itemId,
      assignmentId,
      isSubmitted: 1,
      makeContent: 1,
      courseId: courseId
    }
    await updateAssignmentSettings(payload).then((data) => setAssignmentObjData({ data, type: 'update' }));
  }

  const handleSubmit = async (e) => {
    let submitted = '1';
    const payload = {
      ...assignmentObjData[0].contents,
      itemId: itemId,
      assignmentId,
      isSubmitted: submitted,
      makeContent: 1,
      courseId: courseId

    }
    await updateAssignmentSettings(payload).then((data) => console.log('successs'));
  }
  return(
    <>
    {(assignmentObjData[0].contents?.isPublished === '1' || role === "Instructor") && assignmentObjData[0].contents?.isAssignment == '1'? 
         <>
          <div >
            <label className="formLabel">Title</label>
            <input className="formInput" required type="text" name="title" value={assignmentObjData[0].contents?.title}
              placeholder="Title goes here" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">Assignmed Date</label>
            <input className="formInput" required type="text" name="assignedDate" value={assignmentObjData[0].contents?.assignedDate}
              placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">Due date</label>
            <input className="formInput" required type="text" name="dueDate" value={assignmentObjData[0].contents?.dueDate}
              placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
          <div >
            <label className="formLabel">timeLimit</label>
            <input className="formInput" required type="text" name="timeLimit" value={assignmentObjData[0].contents?.timeLimit}
              placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">numberOfAttemptsAllowed</label>
            <input className="formInput" required type="text" name="numberOfAttemptsAllowed" value={assignmentObjData[0].contents?.numberOfAttemptsAllowed}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          
            <label className="formLabel">attemptAggregation</label>
            <input className="formInput" type="number" name="attemptAggregation" value={assignmentObjData[0]?.contents.attemptAggregation}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">totalPointsOrPercent</label>
            <input className="formInput" type="number" name="numberOfAttemptsAtotalPointsOrPercentllowed" value={assignmentObjData[0]?.contents.totalPointsOrPercent}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">gradeCategory</label>
            <input className="formInput" type="number" name="gradeCategory" value={assignmentObjData[0]?.contents.gradeCategory}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">individualize</label>
            <input className="formInput" type="number" name="individualize" value={assignmentObjData[0]?.contents.individualize}
              onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">multipleAttempts</label>
            <input className="formInput" type="number" name="multipleAttempts" value={assignmentObjData[0]?.contents.multipleAttempts}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">showSolution</label>
            <input className="formInput" type="number" name="showSolution" value={assignmentObjData[0]?.contents.showSolution}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">showFeedback</label>
            <input className="formInput" type="number" name="showFeedback" value={assignmentObjData[0]?.contents.showFeedback}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">showHints</label>
            <input className="formInput" type="number" name="showHints" value={assignmentObjData[0]?.contents.showHints}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">showCorrectness</label>
            <input className="formInput" type="number" name="showCorrectness" value={assignmentObjData[0]?.contents.showCorrectness}
               onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' : ''} onChange={handleChange} />
          </div>
          <div >
            <label className="formLabel">proctorMakesAvailable</label>
            <input className="formInput" type="number" name="proctorMakesAvailable" value={assignmentObjData[0]?.contents.proctorMakesAvailable}
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
return(
  <DoenetCourseRouted props={props} />
)
  }
function getAssignmentData(payload){
  return axios.get(
    `/api/getItemAssignmentInfo.php`,{params:{itemId:payload.itemId}}
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
    get:(itemId)=>async({get})=>{
      const payload = {itemId:itemId}
      let data = await getAssignmentData(payload);
      return data;
    }    
  })
  function DoenetCourseRouted(props){
    let pathItemId = '';
    let routePathDriveId = '';
    let routePathFolderId = '';
    let itemType = '';
    let urlParamsObj = Object.fromEntries(new URLSearchParams(props.props.route.location.search));
    // console.log(">>>route props in course", urlParamsObj);
    const [assignid, setAssignmentIdValue] = useRecoilState(assignmentIdAtom);
    if (urlParamsObj?.path !== undefined) {
      [routePathDriveId, routePathFolderId, pathItemId,itemType] = urlParamsObj.path.split(":");
      // setAssignmentIdValue('');
    }
    let courseId = 'Fhg532fk9873412s65';
    // console.log(">>> courseId", courseId);

    const [openEnrollment, setEnrollmentView] = useState(false);

    const enrollCourseId = { courseId: 'Fhg532fk9873412s65' };
    // const assignmentInfo = useRecoilValueLoadable(loadAllAssignment({courseId}))
    const assignmentInfo = useRecoilValueLoadable(loadAssignmentSelector(pathItemId))

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
    return (
      <Tool>
        <navPanel>
          {/* <AddItem /> */}
          <Drive types={['course']} urlClickBehaviour="select" /><br />
          <Menu label="Role">
            <MenuItem value="Student" onSelect={() => console.log('text')} />
            <MenuItem value="Instructor" onSelect={() => console.log('text123')} />
          </Menu>
          <Button text="Course Enrollment" callback={() => { setEnrollmentView(!openEnrollment) }}></Button>
        </navPanel>
        <mainPanel>
          {pathItemId ? <DisplayCourseContent driveId={routePathDriveId} itemId={pathItemId} /> : null}
          {openEnrollment ? <Enrollment selectedCourse={enrollCourseId} /> : null}
        </mainPanel>
        <menuPanel>
          {
            itemType === 'DoenetML' ? 
            <MakeAssignment itemId={pathItemId} courseId={courseId} />
            : null
          }
        </menuPanel>
      </Tool>
    );
  }


