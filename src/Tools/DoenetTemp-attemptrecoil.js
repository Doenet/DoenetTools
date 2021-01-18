  import nanoid from 'nanoid';
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
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import {
    faWaveSquare,
    faDatabase,
    faServer,
    faChevronDown,
    faChevronRight
  } from "@fortawesome/free-solid-svg-icons";
  
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
  export const assignmentAtom = atom({
    key:"assignmentAtom",
    default:''
  
  })
  export const assignmentIdAtom = atom({
    key:"assignmentIdAtom",
    default:''
  
  })
  
  const AssignmentContent = (props) => {
    return(
      <div>...</div>
    )
  }
  
  const DisplayContent = (props) => {
    console.log(">>> overview props", props.driveId)
    const [doenetML, setDoenetMLUpdate] = useState('');
    const [updateNumber, setUpdateNumber] = useState(0)
    const role = useRecoilValue(roleAtom);
    console.log(">>> role",role);
  
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
          console.log(">>> res",response)     
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
        {console.log('>>> doenetML', doenetML,(doenetML != ""))}
        {doenetML != "" ?
         role === 'Student' ? 
          <DoenetViewer
          key={"loadoverview" + updateNumber}
          //contentId={''}
          doenetML={doenetML}
          course={true}
          // attemptNumber={updateNumber}
          //  attemptNumber={latestAttemptNumber}
  
  
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
    if (props.route){  
      let paramsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));  
      if(Object.entries(paramsObj).length > 0)
      {
         console.log(">>> paramsObj",paramsObj); 
         const path = paramsObj?.path;
         type = paramsObj?.type;
         if(type === 'assignment')
         {
              assignmentID = paramsObj?.itemId;
              console.log("assignmentID", assignmentID)

              setAssignmentIdValue(assignmentID);
         }
        else
        {
          setAssignmentIdValue('');
          routeParams = path.split(":");  
          if(routeParams[0])
              id = routeParams[0]; 
          type = routeParams[3];
          itemId = paramsObj.itemId ? paramsObj.itemId:routeParams[2];
  
          console.log(">>> path ", id , type , itemId)
        }
      }
    }
  return (   
    <>
      {type === 'Folder' ? 
       <AssignmentContent driveId={id} itemId={itemId}/>     
       : <DisplayContent driveId={id} itemId={itemId}/>  }
     </>  
    )
  }
  
  const updateAssignment = (payload) => {
    try {
      return axios.post(
        `/api/makeAssignment.php`,payload
      ).then((response) => {  
        console.log(">>> updateAssignment",response);
  
        return response.data;
      });    
    } catch (e) {
      console.log(e);
    }
  }
  function AssignmentSettings()
  {
    const role = useRecoilValue(roleAtom);
   return(
     <>
     {/* {role === 'Student' ? <ViewAssignmentSettings/> : <EditAssignmentSettings/>} */}
     <EditAssignmentSettings/>
     </>
   )
  
  }
  
  function ViewAssignmentSettings(){
    const contentId = useRecoilValue(assignmentAtom);
    const [dueDate,setDueDate] = useState('');
    const getDuedate = () => {
      const payload = {
        contentId:contentId    }
      try {      
        return axios.post(
          `/api/getAssignmentSettings.php`,payload
        ).then((response) => {  
          console.log(">>> saveDuedate",response);
    
          return response.data;
        });    
      } catch (e) {
        console.log(e);
      }
    }
    useEffect(() => {
      getDuedate().then((data) => setDueDate(data.dueDate));
    },[])
    return(
      <div>
        {dueDate}
      </div>
    )
  }
  function EditAssignmentSettings(){
    const contentId = useRecoilValue(assignmentAtom);
    const [dueDate,setDueDate] = useState(''); 
    const getDuedate = () => {
      const payload = {
        contentId:contentId    
      }
      try {      
        return axios.post(
          `/api/getAssignmentSettings.php`,payload
        ).then((response) => {  
          console.log(">>> saveDuedate",response);
    
          return response.data;
        });    
      } catch (e) {
        console.log(e);
      }
    }
    useEffect(() => {
      getDuedate().then((data) => setDueDate(data.dueDate));
    },[])
    const saveDuedate = () => {
      const payload = {
        dueDate:dueDate,
        contentId:contentId    }
      try {      
        return axios.post(
          `/api/saveAssignmentSettings.php`,payload
        ).then((response) => {  
          console.log(">>> saveDuedate",response);
    
          return response.data;
        });    
      } catch (e) {
        console.log(e);
      }
    }
    return(<>
      Due Date: <input type="text" 
      value={dueDate?dueDate:""} 
      onChange={(e)=>{setDueDate(e.target.value);}}
      onKeyDown={saveDuedate}
      />
      </>
    )
  }
  
  function MakeAssignment(){
    const role = useRecoilValue(roleAtom);
    const contentId = useRecoilValue(assignmentAtom);
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
    { assignid === '' ? contentId != '' ? <Button text="makeassignment" callback={makeAssignmentValueUpdate}></Button>: null : 
            <React.Suspense fallback="loading ...">
              <CollapseSection >
                <AssignmentForm />
              </CollapseSection>
            </React.Suspense>
    }  
    </>
     ): (
        <CollapseSection >
          <AssignmentForm />
        </CollapseSection>
      );
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
  // const itemId = useRecoilValue(assignmentAtom);
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
    default:(assignmentId) => async ({get,set})=>{ 
      console.log("  assignmentAtomData load assignment", assignmentId);
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
    
});
const loadAssignment = selectorFamily({
  key:"loadAssignment",
  get: (assignmentId) => async ({get,set})=>{ 
    return get(assignmentAtomData);
  },
  set:(value)=>async({set},newvalue) => {
    console.log("Newvalue", value , newvalue);
    if(value)
    {
      let payload = {
        assignmentId:value}       
   
      let data = await getAssignmentSettings(payload);
      //return data;
      console.log("data",Object.assign({},data,newvalue))
      const payload1 = {
        ...Object.assign({},data,newvalue),
        itemId:123,
        assignmentId:value,
        isSubmitted:1
      }
      console.log('>>> form submit payload',payload1)
      // updateAssignmentSettings(payload1).then((data) => console.log('successs'));
  
      set(assignmentAtomData,Object.assign({},data,newvalue));
    }
  }
})

const AssignmentForm = () => {
  const role = useRecoilValue(roleAtom);

  const itemId = useRecoilValue(assignmentAtom);
  const assignmentId = useRecoilValue(assignmentIdAtom);
  const assignmentObjValue = useRecoilValue(assignmentAtomData(assignmentId));
  // const [assignmentObjData,setAssignmentObjData ] = useRecoilStateLoadable(loadAssignment(assignmentId)); 
  // const [assignmentObjData,setAssignmentObjData ] = useRecoilState(loadAssignment(assignmentId)); 
  const [assignmentObjData,setAssignmentObjData ] = useRecoilState(loadAssignment(assignmentId)); 

  
  useEffect(()=>{
      if(assignmentId){
          const timeset = setTimeout(async() => {
          let payload = {
            assignmentId
          }
           //setAssignmentObjData(data);
        
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
  // setAssignmentObjData((prevState)=>Object.assign({},prevState,{[name]:value}));
  setAssignmentObjData({[name]:value});

}
 const handleOnBlur = async(e) => {
  e.preventDefault();
  e.stopPropagation();
  let submitted = '0';
  const payload = {...assignmentObjData,
    itemId,
    assignmentId,
    isSubmitted:submitted
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
      isSubmitted:submitted
    }
    console.log('>>> form submit payload',payload)
    await updateAssignmentSettings(payload).then((data) => console.log('successs'));
  }
  return(
    <React.Suspense fallback="loading ...">
         {console.log(">>>  ***",assignmentObjData)}
    { assignmentObjData?.isSubmitted === '1' || role === "Instructor"? 
         <form onSubmit={handleSubmit} method="POST">
             <div className="formGroup-12">
               <label className="formLabel">Title</label>
               <input className="formInput" required type="text" name="title" value={assignmentObjData && assignmentObjData.title}
                 placeholder="Title goes here" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' :''} onChange={handleChange}  />
             </div>
            
               <div className="formGroup-12" >
                 <label className="formLabel">Assignmed Date</label>
                 <input className="formInput" required type="text" name="assignedDate" value={assignmentObjData && assignmentObjData.assignedDate}
                   placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' :''} onChange={handleChange} />
               </div>
               <div className="formGroup-12">
                 <label className="formLabel">Due date</label>
                 <input className="formInput" required type="text" name="dueDate" value={assignmentObjData && assignmentObjData.dueDate}
                   placeholder="0001-01-01 01:01:01" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' :'' } onChange={handleChange} />
               </div>
               <div className="formGroup-12">
                 <label className="formLabel">attempts allowed</label>
                 <input className="formInput" type="number" name="numberOfAttemptsAllowed" value={assignmentObjData && assignmentObjData.numberOfAttemptsAllowed}
                   placeholder="0" onBlur={handleOnBlur} disabled={role === 'Student' ? 'disabled' :'' } onChange={handleChange}  />
               </div>

               {
                 role === 'Instructor' ?
                 <div className="formGroup-12">
                 <label className="formLabel">Make Content</label>
                 <input className="formInput" type="checkbox" name="makeContent" value={assignmentObjData && assignmentObjData.makeContent}
                    onBlur={handleOnBlur}  onChange={handleChange}/>
               </div> 
                : null
               }
             {
               role === 'Student' ? null : <button id="formSubmitButton" type="submit" >Submit</button>
 
             }
         </form>
    : null}
    </React.Suspense>
   
  )
} 

  export default function DoenetTool(props) {
    const [showHideNewOverLay, setShowHideNewOverLay] = useState(false);
    const showHideOverNewOverlayOnClick = () => {
      setShowHideNewOverLay(!showHideNewOverLay);
    };
  
    const [selectedCourse, setSelectedCourse] = useState({});
    const [studentInstructor,setStudentInstructor] = useState("Student")
    const [assignmentObj,setAssignmentObj] = useState({title:"test title"})
    const [assignmentId,setAssignmentId] = useState("");
   
    useEffect(() => {
      getCourses_CI((courseListArray, selectedCourseObj) => { 
        setSelectedCourse(selectedCourseObj) })  
    }, [])
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
      console.log("assignmentObj!!!!!!!!!",assignmentObj)
  
    if (studentInstructor === "Instructor"){
    overlaycontent = (<DoenetEditor hideHeader={true} 
          branchId={"6soU1bOi77NmxYQz8nfnf"}
          contentId={"18029ced9d03f2629636c4fdbdf5b6da76ecc624d51250863638f617045bb8be"}
          headerTitleChange={"title here"}/> )
    }
    return (<>
    
      {/* <Overlay 
               open={modalOpen} 
               name="Assignment"
               header= {assignmentObj.title}
               body={ overlaycontent }
               onClose={()=>overlayOnClose()} 
              /> */}
      {/* {modalOpen} */}
  
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
              <Drive types={['course']} />                   
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
                  <Link to='/?path=Fhg532fk9873412s:FolderId:Content3Id:assignment&type=assignment&itemId=5xWhTvF8RdO6ypBm2-R9H'>Assignment 1</Link>
                  {/* <Button text="Course Enrollment" /> */}
            </navPanel>
            <mainPanel >  
              <Switch>
                   <Route path="/" render={(routeprops) => 
                   <CourseComponent route={{ ...routeprops }} {...props} />
                   }>
                   </Route>
                 </Switch> 
            </mainPanel>      
            <menuPanel>
              Menu Panel
              <MakeAssignment />
                {/* <AssignmentSettings /> */}
                {/* <EditAssignmentSettings /> */}
                {/* <button>Make assignment</button>
                <button>Edit assignment</button> */}
            </menuPanel>
            
          </Tool>
      </>
    );
  }
