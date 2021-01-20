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
  // import Overlay from "../imports/Overlay";
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
import { load } from 'math-expressions';
  

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
    // console.log(">>> role",role);
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
          // console.log(">>> res",response)     
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
        {/* {console.log('>>> doenetML', doenetML,(doenetML != ""))} */}
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
        // console.log(">>> updateAssignment",response);
        return response.data;
      });    
    } catch (e) {
      console.log(e);
    }
  }
  // loadAllAssignment('ufhdaiusfhuidsh');
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
  
  let loadAssignmentSettings =  selectorFamily({
    key:"loadAssignmentSettings",
    get: (assignmentId) => async ({get,set})=>{
      if(asignmentId)
      {
        const {data} =  axios.post(
      `/api/getAssignmentSettings.php?assignmentId=${assignmentId}`
     )
         return data;
      }      
  }})


  const getAllAsignmentSettings = () => {

    try {
      return axios.post(
        `/api/getAllAssignmentSettings.php`
      ).then((response) => {  
        console.log(">>> response all assignment",response);
        return response.data;

      });    
    } catch (e) {
      console.log(e);
    }
  }
  

  function MakeAssignment({itemId,courseId}){
    const role = useRecoilValue(roleAtom);
    // const setAssignmentIdValue = useSetRecoilState(assignmentIdAtom);
    // const assignid = useRecoilValue(assignmentIdAtom);
    const [assignid,setAssignmentIdValue] = useRecoilState(assignmentIdAtom);
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
        updateAssignment(payload).then((data) => console.log(data));
      }
      else
        return null;
    }
    // return role === 'Instructor' && contentId != ''  ? 
    return role === 'Instructor' ? 

    (
      <>
    { assignid === '' ? itemId != '' ? <Button text="makeassignment" callback={makeAssignmentValueUpdate}></Button>: null : <CollapseSection title="Edit Assignment Settings" >
                 <AssignmentForm itemId={itemId} courseId={courseId}/>  
              </CollapseSection>}

    </>
     ): (<CollapseSection >
      <AssignmentForm itemId={itemId} courseId={courseId}/>  
   </CollapseSection>);
  }
  const getAssignmentSettings = (payload) => {
    console.log('>>> payload', payload);
  try {
    return axios.get(
      `/api/getAssignmentSettings.php`,{params:{assignmentId:payload.assignmentId}}
    ).then((response) => {  
      console.log(">>> updateAssignment",response);

      return response.data;
    });    
  } catch (e) {
    console.log(e);
  }
}
const AssignmentsSettingsView=()=>{
  // const itemId = useRecoilValue(contentIdAtom);
  const assignmentId = useRecoilValue(assignmentIdAtom);
  if(assignmentId)
  {
    useEffect(()=>{
      let payload = {
        assignmentId
      }
      getAssignmentSettings(payload);
    }
    ,[])
  }
   
  return(
    <>
     <div></div>
    </>
  )
}

let loadAssignment = selectorFamily({
  key:"loadAssignment",
  get: (assignmentId) => async ({get,set})=>{
    const assignmentId = useRecoilValue(assignmentIdAtom);    
    console.log("load assignment", assignmentId);
    if(assignmentId)
    {
      let payload = {
        assignmentId}       
   
      let data = await getAssignmentSettings(payload);
      return data;
    }
    else
      return null;
  }
})
const AssignmentForm = ({itemId,courseId}) => {
  const role = useRecoilValue(roleAtom);
  const assignmentId = useRecoilValue(assignmentIdAtom);
  // const [assignmentObjData,setAssignmentObjData ] = useRecoilStateLoadable(loadAssignment(assignmentId)); 
  const [assignmentObjData,setAssignmentObjData ] = useState(); 
    useEffect(()=>{
      if(assignmentId){
          const timeset = setTimeout(() => {
          let payload = {
            assignmentId
          }
          getAssignmentSettings(payload).then(data => setAssignmentObjData(data));
        },1000);
        return ()=>clearTimeout(timeset);       
      }
  },[assignmentId,role]) 

   
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
  setAssignmentObjData((prevState)=>Object.assign({},prevState,{[name]:value}));
}
 const handleOnBlur = async(e) => {
  let submitted = '0';
  const payload = {...assignmentObjData,
    itemId:itemId,
    assignmentId,
    isSubmitted:submitted,
    makeContent:1,
    courseId:courseId
  }
  console.log('>>> form submit payload',payload)
  await updateAssignmentSettings(payload).then((data) => console.log('successs'));
}
const handleMakeContent = async() => {  
  const payload = {...assignmentObjData,
    itemId:itemId,
    assignmentId,
    isSubmitted:1,
    makeContent:0,
    courseId:courseId

  }
  console.log('>>> form submit payload',payload)
  await updateAssignmentSettings(payload).then((data) => setAssignmentObjData(data));
}
  const handleSubmit = async(e) => {
    let submitted = '1';
    const payload = {...assignmentObjData,
      itemId:itemId,
      assignmentId,
      isSubmitted:submitted,
      makeContent:1,
      courseId:courseId

    }
    console.log('>>> form submit payload',payload)
    await updateAssignmentSettings(payload).then((data) => console.log('successs'));
  }
  return(
    <>
    {
      role === 'Instructor' ? <Button text="Make Content" callback={handleMakeContent}/>:null
    }
         {console.log(">>>  ***",assignmentObjData)}
    { (assignmentObjData?.isPublished === '1' || role === "Instructor") && assignmentObjData?.isAssignment == '1'? 
    
         <>
             <div >
               <label className="formLabel">Title</label>
               <input className="formInput" required type="text" name="title" value={assignmentObjData && assignmentObjData.title}
                 placeholder="Title goes here" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' :''} onChange={handleChange}  />
             </div>
            
               <div  >
                 <label className="formLabel">Assignmed Date</label>
                 <input className="formInput" required type="text" name="assignedDate" value={assignmentObjData && assignmentObjData.assignedDate}
                   placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' :''} onChange={handleChange} />
               </div>
               <div >
                 <label className="formLabel">Due date</label>
                 <input className="formInput" required type="text" name="dueDate" value={assignmentObjData && assignmentObjData.dueDate}
                   placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' :'' } onChange={handleChange} />
               </div>
               <div >
                 <label className="formLabel">attempts allowed</label>
                 <input className="formInput" type="number" name="numberOfAttemptsAllowed" value={assignmentObjData && assignmentObjData.numberOfAttemptsAllowed}
                   placeholder="0" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' :'' } onChange={handleChange}  />
               </div>
             {
               role === 'Student' ? null : <Button text="Publish" id="formSubmitButton" callback={handleSubmit} type="submit" ></Button>
 
             }
         </>
    : <div>Assignments will be published soon...</div>}
    </>
   
  )
} 

  export default function DoenetCourse(props) {
    console.log("props course >>>", props);

return(
  <DoenetCourseRouted props={props} />
 
)
  }

  function DoenetCourseRouted(props){
       console.log("props course >>>w", props.props.route.location.search);

    // let pathFolderId = props.driveId; //default 
    // let pathDriveId = props.driveId; //default
    
    let pathItemId = '';
    let routePathDriveId ='';
    let routePathFolderId ='';
    let urlParamsObj = Object.fromEntries(new URLSearchParams(props.props.route.location.search));
    console.log(">>>route props in course", urlParamsObj);

  //use defaults if not defined
  if (urlParamsObj?.path !== undefined){
    [routePathDriveId,routePathFolderId,pathItemId] = urlParamsObj.path.split(":");
    console.log("route info",);
  }
  let courseId = 'Fhg532fk9873412s65';
  console.log(">>> courseId", courseId);

  const [openEnrollment,setEnrollmentView] =useState(false);

  const enrollCourseId = {courseId:'Fhg532fk9873412s65'};
  // const assignmentInfo = useRecoilValueLoadable(loadAllAssignment({courseId}))

  //  const assignmentInfo = useRecoilValueLoadable(loadAllAssignment('Fhg532fk9873412s'))
    //  const assignmentSettingsInfo = useRecoilValueLoadable(loadAssignmentSettings(props.assignmentId))

    // if (assignmentSettingsInfo.state === "loading") { return null; }
    // if (assignmentSettingsInfo.state === "hasError") {
    //   console.error(assignmentSettingsInfo.contents)
    //   return null;
    // }
    // console.log(">>> assignmentSettingsInfo",assignmentSettingsInfo.contents);
    // if (assignmentInfo.state === "loading") { return null; }
    // if (assignmentInfo.state === "hasError") {
    //   console.error(assignmentInfo.contents)
    //   return null;
    // }

    // console.log(">>> assignment contents",assignmentInfo.contents);

    return (
      <div>
      <Tool>
          <navPanel>
          <AddItem />

            <Drive types={['course']} urlClickBehaviour="select" /><br />
            <Menu label="Role">
              <MenuItem
                value="Student"
                onSelect={() => console.log('text')}
              />
              <MenuItem
                value="Instructor"
                onSelect={() => console.log('text123')}
              />
            </Menu>

           <Button text="Course Enrollment" callback={()=>{setEnrollmentView(!openEnrollment)}}></Button>

          </navPanel>

          <mainPanel>
          {pathItemId ?
            <DisplayCourseContent driveId={routePathDriveId} itemId={pathItemId}/>           
 : null } 
            
            {/* {pathItemId ?
            <React.Suspense fallback="loading..">
            <DisplayCourseContent driveId={routePathDriveId} itemId={pathItemId}/> 
          
            </React.Suspense>

 : null }  */}
            {
                openEnrollment ?
                <Enrollment selectedCourse={enrollCourseId}/>
                : null
              }
          </mainPanel>
          <menuPanel>
            <MakeAssignment itemId={pathItemId} courseId={courseId}/>
          </menuPanel>
      </Tool>
      </div>
    
    
    
 
    );
  }


