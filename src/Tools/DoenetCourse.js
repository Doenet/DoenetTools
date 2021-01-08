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
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import { TreeView } from './TreeView/TreeView';
// import styled from "styled-components";
import { getCourses_CI, setSelected_CI } from "../imports/courseInfo";
import Enrollment from './Enrollment';
import LearnerGrades from './LearnerGrades';
import LearnerGradesAttempts from './LearnerGradesAttempts';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MenuDropDown from '../imports/MenuDropDown.js';
// import Overlay from "../imports/Overlay";
import {CourseAssignments,CourseAssignmentControls} from "./courseAssignments";
import LearnerAssignment from './LearnerAssignment';


import Tool from "../imports/Tool/Tool";
// import NavPanel from "../imports/Tool/NavPanel";
// import MainPanel from "../imports/Tool/MainPanel";
// import SupportPanel from "../imports/Tool/SupportPanel";
// import MenuPanel from "../imports/Tool/MenuPanel";
import HeaderMenuPanelButton from "../imports/Tool/HeaderMenuPanelButton";
import ResponsiveControls from "../imports/Tool/ResponsiveControls";
import Overlay from "../imports/Tool/Overlay";
import CollapseSection from "../imports/CollapseSection";
import MenuPanelSection from "../imports/Tool/MenuPanelSection";
import ActionButton from "../imports/PanelHeaderComponents/ActionButton";
import Button from "../imports/PanelHeaderComponents/Button";

import MenuItem from "../imports/PanelHeaderComponents/MenuItem";
import Menu,{ useMenuContext } from "../imports/PanelHeaderComponents/Menu";
import SectionDivider from "../imports/PanelHeaderComponents/SectionDivider";
import styled from "styled-components";
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
    useSetRecoilState,
    useRecoilValue,
    useRecoilState
  } from 'recoil';


export const roleAtom = atom({
  key:"roleAtom",
  default:'Instructor'

})
export const assignmentAtom = atom({
  key:"assignmentAtom",
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
  let routeParams = "";
  let id = "";
  let type = '';
  let itemId = ''; 
  if (props.route){  
    let paramsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));  
    if(Object.entries(paramsObj).length > 0)
    {
       console.log(">>> paramsObj",paramsObj); 
      const path = paramsObj?.path;
      if(path)
      {
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
     :  <DisplayContent driveId={id} itemId={itemId}/>  }
   </>  
  )
}

const updateAssignment = (payload) => {
  try {
    return axios.post(
      `/api/updateAssignmentId.php`,payload
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
   {role === 'Student' ? <ViewAssignmentSettings/> : <EditAssignmentSettings/>}
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
  const makeAssignmentValueUpdate = () =>{
    if(role === 'Instructor')
    {
      let assignmentId = nanoid();
      // setAssignment(assignmentId);

      const payload = {
        assignmentId:assignmentId,contentId:contentId        
      }
      let res = updateAssignment(payload);
      console.log('>>> res updateAssignmet', res);
    }
    else
      return null;
  }
  return role === 'Instructor' && contentId != ''  ? <Button  text="makeassignment" callback={makeAssignmentValueUpdate}></Button> : null;
}
export default function DoenetCourse(props) {

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

            {/* <Drive types={['content','course','Url','Folder','doenetML']} roleAtom={roleAtom} /> */}
                 
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
                

          </navPanel>

          <mainPanel >
          {/* <Drive id="branch123" roleAtom={roleAtom}/> */}

            <Switch>
                 <Route path="/" render={(routeprops) => 
                 <CourseComponent route={{ ...routeprops }} {...props} />
                 }>
                 </Route>
               </Switch> 
            {/* <Drive types={['content','course','Url','Folder','doenetML']} /> */}
            {/* <Drive id="ZLHh5s8BWM2azTVFhazIH" /> */}

            {/* <Switch>
                <Route path="/" render={(routeprops) => <CourseComponent route={{ ...routeprops }} {...props} />}></Route>
              </Switch>  */}
              
          </mainPanel>
           
    
          <menuPanel>
            
            Menu Panel
            <section>
              <MakeAssignment />
              {/* <AssignmentSettings /> */}
              {/* <EditAssignmentSettings /> */}
              {/* <button>Make assignment</button>
              <button>Edit assignment</button> */}

            </section>
          </menuPanel>
        </Tool>
    </>
  );
}



// const treeNodeItem = (nodeItem) => {
//   //debugger;
//   console.log(nodeItem, "nodeItem");
//   const { title, icon, viewId } = nodeItem
//   // if(title) {
//   //   let viewId = selectedCourse[title.toLowerCase() === "overview" ? "overviewId" : title.toLowerCase() === "syllabus" ? "syllabusId" : title];
//   //   console.log(viewId);
//   // }
//   return <div>
//     {icon}

//     <Link
//       to={title === "overview" || title === "syllabus" ? `/type=${title}&${title.concat('Id=').concat(viewId)}` : title}//course/?viewId=w35234
//       style={{
//         color: 'white',
//         textDecoration: 'none',
//         fontWeight: "700",
//         paddingLeft: "5px",
//         fontSize: "20px",
//         textTransform: 'capitalize',
//       }}>
//       {title}
//     </Link>
//   </div>
// };


// const CourseTreeView = (props) => {
//   console.log("inside tree view", props);
//   const [selectedCourse, setSelectedCourse] = useState({});
//   useEffect(() => {
//     getCourses_CI((courseListArray, selectedCourseObj) => { setSelectedCourse(selectedCourseObj) })
//   }, [])
//   const parentsInfo = {
//     root: {
//       childContent: [],
//       childFolders: [],
//       childUrls: [],
//       isPublic: false,
//       title: "Courses",
//       type: "folder",
//       viewId: ""
//     }
//   };
//   // localhost/course/#?path=abc123:abc123&type=assignment&itemId=aaa111
//   props.leftNavDrives.forEach(title => {
//     parentsInfo[title] = {
//       childContent: [],
//       childFolders: [],
//       childUrls: [],
//       isPublic: false,
//       isRepo: false,
//       numChild: 0,
//       parentId: "root",
//       publishDate: "",
//       rootId: "root",
//       title,
//       type: "folder",
//       viewId: selectedCourse[title+"Id"] ? selectedCourse[title+"Id"] : ""
//     }
//     parentsInfo.root.childFolders.push(title);
//   });
//   //console.log(parentsInfo, "info parents");
//   return (<TreeView
//     containerId={'courses'}
//     containerType={'course_assignments'}
//     loading={false}
//     parentsInfo={parentsInfo}
//     childrenInfo={{}}
//     parentNodeItem={treeNodeItem}
//     leafNodeItem={treeNodeItem}
//     specialNodes={new Set()}
//     hideRoot={true}
//     disableSearch={true}
//     treeNodeIcons={(itemType) => {
//       let map = {};
//       return map[itemType]
//     }}
//     hideRoot={true}
//     treeStyles={{

//       specialParentNode: {
//         "title": {
//           color: "white",
//           paddingLeft: "5px"
//         },
//         "node": {
//           backgroundColor: "rgba(192, 220, 242,0.3)",
//           color: "white",
//           borderLeft: '8px solid #1b216e',
//           height: "2.6em",
//           width: "100%"
//         }
//       },
//       parentNode: {
//         "title": { color: "white", paddingLeft: '5px', fontWeight: "700" },
//         "node": {
//           width: "100%",
//           height: "2.6em",
//         },

//       },
//       childNode: {
//         "title": {
//           color: "white",
//           paddingLeft: "5px"
//         },
//         "node": {
//           backgroundColor: "rgba(192, 220, 242,0.3)",
//           color: "white",
//           borderLeft: '8px solid #1b216e',
//           height: "2.6em",
//           width: "100%"
//         }
//       },

//       emptyParentExpanderIcon: {
//         opened: <FontAwesomeIcon
//           style={{
//             padding: '1px',
//             width: '1.3em',
//             height: '1.2em',
//             border: "1px solid darkblue",
//             borderRadius: '2px',
//             marginLeft: "5px"

//           }}
//           icon={faChevronDown} />,
//         closed: <FontAwesomeIcon
//           style={{
//             padding: '1px',
//             width: '1.3em',
//             height: '1.2em',
//             border: "1px solid darkblue",
//             borderRadius: '2px',
//             marginLeft: "5px"

//           }}
//           icon={faChevronRight} />,
//       },
//     }}
//     onLeafNodeClick={(nodeId) => {
//      // console.log(nodeId)
//     //  console.log(nodeId, " leaf click");
//     //  console.log(props.selectedCourse['overviewId'], "child")
//     }}
//     onParentNodeClick={(nodeId) => {
//       console.log(nodeId, "parentclick");
//      console.log(props.selectedCourse, "parent")
//     }}
//       />)
// }
