  // import DoenetViewer from '../Tools/DoenetViewer';

  import nanoid from 'nanoid';
  // import query from '../queryParamFuncs';
  // import DoenetBox from '../Tools/DoenetBox';
  // import DoenetAssignmentTree from "./DoenetAssignmentTree"
  import DoenetEditor from './DoenetEditor';
  import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";
  import React, { useState, useEffect, useCallback } from "react";
  import { getCourses_CI, setSelected_CI } from "../imports/courseInfo";
  import Enrollment from './Enrollment';
  import LearnerGrades from './LearnerGrades';
  import LearnerGradesAttempts from './LearnerGradesAttempts';
  import MenuDropDown from '../imports/MenuDropDown.js';
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
    const isCancelled = React.useRef(false);
    
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
          
  
      </div>)
  }
  
  const CourseComponent = (props) => {

    const setAssignmentIdValue = useSetRecoilState(assignmentIdAtom);
    let routeParams = "";
    let id = "";
    let type = '';
    let itemId = ''; 
    let assignmentID = '';
    console.log(">>>route props in course", props);
    if (props.route){  
      let paramsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));  
      if(Object.entries(paramsObj).length > 0)
      {
        //  console.log(">>> paramsObj",paramsObj); 
         const path = paramsObj?.path;
         type = paramsObj?.type;
         if(type === 'assignment')
         {
              assignmentID = paramsObj?.itemId;
              // console.log(">>>assignmentID", assignmentID)
              setAssignmentIdValue(assignmentID);
         }
        // else
        // {
        //   setAssignmentIdValue('');
        //   routeParams = path.split(":");  
        //   if(routeParams[0])
        //       id = routeParams[0]; 
        //   type = routeParams[3];
        //   itemId = paramsObj.itemId ? paramsObj.itemId:routeParams[2];
  
        //   // console.log(">>> path ", id , type , itemId)
        // }
      }
    }
  return (   
    <>
      {/* {type === 'Folder' ? 
       <AssignmentContent driveId={id} itemId={itemId}/>     
       : <DisplayCourseContent driveId={id} itemId={itemId}/>  } */}
       <DisplayCourseContent driveId={id} itemId={itemId}/> 
       
       {/* <DisplayCourseContent driveId={id} />  */}

     </>  
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
  
  let loadAllAssignment =  selectorFamily({
    key:"loadAllAssignment",
    get: (courseId) => async ({get,set})=>{
    const {data} =  axios.post(
  `/api/getAllAssignmentSettings.php?courseId=${courseId}`
 )
     return data;

      
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
  

  function MakeAssignment(){
    const role = useRecoilValue(roleAtom);
    const contentId = useRecoilValue(contentIdAtom);
    const setAssignmentIdValue = useSetRecoilState(assignmentIdAtom);
    const assignid = useRecoilValue(assignmentIdAtom);
    const [viewForm, setViewForm] = useState(false);
    const makeAssignmentValueUpdate = () =>{
      if(role === 'Instructor')
      {
        let assignmentId = nanoid();
        setAssignmentIdValue(assignmentId);
        setViewForm(true);
        const payload = {
          assignmentId:assignmentId,contentId:contentId        
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
    { assignid === '' ? contentId != '' ? <Button text="makeassignment" callback={makeAssignmentValueUpdate}></Button>: null : <CollapseSection title="Edit Assignment Settings" >
                 <AssignmentForm />  
              </CollapseSection>}

    </>
     ): (<CollapseSection >
      <AssignmentForm />  
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
let assignmentAtomData = atom({
    key:'assignmentAtomData',
    default:{title:'',assignedDate:'2021-01-01 01:10:01',dueDate:'2021-01-01 01:01:01',attempsAllowed:'0'}
});
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
const AssignmentForm = () => {
  const role = useRecoilValue(roleAtom);
  const itemId = useRecoilValue(contentIdAtom);
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
  e.preventDefault();
  e.stopPropagation();
  let submitted = '0';
  const payload = {...assignmentObjData,
    itemId,
    assignmentId,
    isSubmitted:submitted,
    makeContent:1
  }
  console.log('>>> form submit payload',payload)
  await updateAssignmentSettings(payload).then((data) => console.log('successs'));
}
const handleMakeContent = async() => {  
  const payload = {...assignmentObjData,
    itemId,
    assignmentId,
    isSubmitted:1,
    makeContent:0
  }
  console.log('>>> form submit payload',payload)
  await updateAssignmentSettings(payload).then((data) => console.log('successs'));
}
  const handleSubmit = async(e) => {
    e.preventDefault();
    e.stopPropagation();
    let submitted = '1';
    const payload = {...assignmentObjData,
      itemId,
      assignmentId,
      isSubmitted:submitted,
      makeContent:1
    }
    console.log('>>> form submit payload',payload)
    await updateAssignmentSettings(payload).then((data) => console.log('successs'));
  }
  return(
    <>
    {
      role === 'Instructor' ?<Button text="Make Content" callback={handleMakeContent}/>:null
    }
         {console.log(">>>  ***",assignmentObjData)}
    { (assignmentObjData?.isPublished === '1' || role === "Instructor") && assignmentObjData?.isAssignment === '1' ? 
    
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

  export default function DoenetCourse() {
return(
  <React.Fragment><Router><Switch>
  <Route path="/" render={(routeprops)=>
  <DoenetCourseRouted route={{...routeprops}}/>
  }></Route>
</Switch></Router></React.Fragment>
)
  }

  function DoenetCourseRouted(props){
 let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  const courseId = urlParamsObj.courseId;

   const [openEnrollment,setEnrollmentView] =useState(false);
    const [showHideNewOverLay, setShowHideNewOverLay] = useState(false);
    const showHideOverNewOverlayOnClick = () => {
      setShowHideNewOverLay(!showHideNewOverLay);
    };
  const enrollCourseId = {courseId:'Fhg532fk9873412s'}
    const [selectedCourse, setSelectedCourse] = useState({});
    const [studentInstructor,setStudentInstructor] = useState("Student")
    const [assignmentObj,setAssignmentObj] = useState({title:"test title"})
    const [assignmentId,setAssignmentId] = useState("");
   
    useEffect(() => {
      getCourses_CI((courseListArray, selectedCourseObj) => { 
        setSelectedCourse(selectedCourseObj) })  
    }, [])

    const assignmentInfo = useRecoilValueLoadable(loadAllAssignment(courseId))
    if (assignmentInfo.state === "loading") { return null; }
    if (assignmentInfo.state === "hasError") {
      console.error(assignmentInfo.contents)
      return null;
    }
    console.log(">>> assignment contents",assignmentInfo.contents);




    let menuStudentInstructor = null;
  
    if (selectedCourse.role === "Instructor"){
      console.log(">>> inside role instructor", selectedCourse)
      menuStudentInstructor = <MenuDropDown 
      position={'left'}  
      offset={-20} 
      showThisMenuText={"Student"} 
      options={[
        {id:"Student", label:"Student", callBackFunction:()=>{setStudentInstructor("Student")}},
        {id:"Instructor", label:"Instructor", callBackFunction:()=>{setStudentInstructor("Instructor")}},
    ]} />;
    }
    function overlayOnClose() {
      setModalOpen(false)
      // const { location: { pathname = '' } } = history
      // history.push(`${pathname}`)
    }
    let leftNavDrives = ['overview','syllabus','grades','assignments']
  
    if (studentInstructor === "Instructor"){ leftNavDrives.push('enrollment'); }
  
    //Assume student assignment in overlay
    let overlaycontent = (<LearnerAssignment 
      assignmentId={assignmentId}
      assignmentObj={assignmentObj}
    />)
      // console.log("assignmentObj!!!!!!!!!",assignmentObj)
  
    if (studentInstructor === "Instructor"){
    overlaycontent = (<DoenetEditor hideHeader={true} 
          branchId={"6soU1bOi77NmxYQz8nfnf"}
          contentId={"18029ced9d03f2629636c4fdbdf5b6da76ecc624d51250863638f617045bb8be"}
          headerTitleChange={"title here"}/> )
    }
    return (<>
      <Tool
            initSupportPanelOpen ={true}
            onUndo={() => {
              console.log(">>>undo clicked");
            }}
            onRedo={() => {
              console.log(">>>redo clicked");
            }}
            title={"My Doc"}
          >
            <navPanel>
              {/* <Drive id="branch123" /> */}
              {/* <Drive id="ZLHh5s8BWM2azTVFhazIH" /> */}
              <Drive types={['course']} urlClickBehavior="select" />
                <Menu label="Role">
                      <MenuItem
                        value="Student"
                        onSelect={()=>console.log('text')}
                      />
                      <MenuItem
                        value="Instructor"
                        onSelect={() => console.log('text123')}
                      />
                    </Menu>
                  <Link to='/?path=Fhg532fk9873412s:FolderId:Content2Id:DoenetML&type=assignment&itemId=8O8PgU2HxuVIRXkMFut62'>Assignment 1</Link><br/><br/>
                  <Button text="Course Enrollment" callback={()=>{setEnrollmentView(!openEnrollment)}}></Button>

  
            </navPanel>
  
            <mainPanel >  
              <Switch>
                   <Route path="/" render={(routeprops) => 
                   <CourseComponent route={{ ...routeprops }} {...props} />
                   }>
                   </Route>
                 </Switch> 
                 {
                   openEnrollment ?
                   <Enrollment selectedCourse={enrollCourseId}/>
                   : null
                 }
            </mainPanel>      
            <menuPanel>
              <MakeAssignment />
            </menuPanel>
            
          </Tool>
      </>
    );
  }



  // const DisplayCourseContent = (props) => {
  //   const [doenetML, setDoenetMLUpdate] = useState('');
  //   const [updateNumber, setUpdateNumber] = useState(0)
  //   console.log("props to display",props);
  //   // console.log(">>> role",role);
  //   useEffect(() => {
  //     let mounted = true; 
  //     getDoenetML().then((response)=>{
  //       if(mounted)
  //       {
  //         setDoenetMLUpdate(response);
  //         setUpdateNumber(updateNumber+1)
  //         // console.log(">>> res",response)     
  //       }
  //     });
  //     return () => { mounted = false };
  //   }, [props.itemId]);
  
  // const getDoenetML = () => {
  //   try {
  //     return axios.get(
  //       `/media/${props.itemId}`
  //     ).then((response) => {  
  //       console.log(response);
  
  //       return response.data;
  //     });    
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  //   // let loadDoenetMLQuery  = selectorFamily({
  //   //   key:"loadDoenetMLQuery",
  //   //   get: (itemId) => async ({get,set})=>{
  //   //     if(itemId)
  //   //     {
  //   //       const { data } = await axios.get(
  //   //         `/media/${itemId}`
  //   //       );
  //   //       return data;
  //   //     }
  //   //   },
     
  //   // })
  //   const data = {
  //     branchId: props.driveId,
  //     contentId: "",
  //     itemId:props.itemId,
  //     ListOfContentId: "", 
  //     List_Of_Recent_doenetML: [], 
  //   }
  //   const payload = {
  //     params: data
  //   }
  //   // const isCancelled = React.useRef(false);
  
  //     // let contentAvailable = useRecoilValueLoadable(loadDoenetMLQuery(props.itemId));
  //     // // console.log(">>> available content", contentAvailable);

  //     // if (contentAvailable.state === "loading") { return null; }
  //     // if (contentAvailable.state === "hasError") {
  //     //   console.error(contentAvailable.contents)
  //     // }
  //     // if(contentAvailable.contents){
  //     //   console.log(">>> available content",contentAvailable.contents);
  
  //     // }
    
  
  //   return (
  //     <div data-cy="overviewNavItem">          
  // test display
  //     </div>)
  // }
  




     // <>
    //         <mainPanel>  
    //           <Switch>
    //                <Route path="/" render={(routeprops) => 
    //                <CourseComponent route={{ ...routeprops }} {...props} />
    //                }>
    //                </Route>
    //              </Switch> 
    //              {
    //                openEnrollment ?
    //                <Enrollment selectedCourse={enrollCourseId}/>
    //                : null
    //              }
    //         </mainPanel>      
    //         <menuPanel>
    //           <MakeAssignment />
    //         </menuPanel>
            
    //       </Tool>
    //   </>