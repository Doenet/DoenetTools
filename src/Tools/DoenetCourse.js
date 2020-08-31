// import DoenetViewer from '../Tools/DoenetViewer';
// import axios from 'axios';
// import './course.css';
// import nanoid from 'nanoid';
// import query from '../queryParamFuncs';
// import DoenetBox from '../Tools/DoenetBox';
// import DoenetAssignmentTree from "./DoenetAssignmentTree"
import DoenetEditor from './DoenetEditor';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MenuDropDown from '../imports/MenuDropDown.js';
import Overlay from "../imports/Overlay";
import {CourseAssignments,CourseAssignmentControls} from "./courseAssignments";

export default function DoenetCourse(props) {
  const [selectedCourse, setSelectedCourse] = useState({});
  const [studentInstructor,setStudentInstructor] = useState("Student")
  const [modalOpen, setModalOpen] = useState(false)
  const [assignmentObj,setAssignmentObj] = useState({title:"test title"})
  const [assignmentId,setAssignmentId] = useState("");
  useEffect(() => {
    getCourses_CI((courseListArray, selectedCourseObj) => { setSelectedCourse(selectedCourseObj) })
  }, [])
  let menuStudentInstructor = null;
  if (selectedCourse.role === "Instructor"){
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
    // const { location: { pathname = '' } } = this.history
    // this.history.push(`${pathname}`)
  }
  let leftNavDrives = ['overview','syllabus','grades','assignments']
  if (studentInstructor === "Instructor"){ leftNavDrives.push('enrollment'); }

  let overlaycontent = (<ToolLayout hideHeader={true}>
    <ToolLayoutPanel  panelName="left nav">
    <div >Left Nav</div>
    </ToolLayoutPanel>
    <ToolLayoutPanel  panelName="Assignment">
    <div >Assignment {assignmentId}</div>
    </ToolLayoutPanel>
    </ToolLayout> )
  if (studentInstructor === "Instructor"){
    console.log("assignmentObj!!!!!!!!!",assignmentObj)
  overlaycontent = (<DoenetEditor hideHeader={true} 
        branchId={"6soU1bOi77NmxYQz8nfnf"}
        contentId={"18029ced9d03f2629636c4fdbdf5b6da76ecc624d51250863638f617045bb8be"}
        headerTitleChange={"title here"}/> )
  }
  // panelHeaderControls={[contextPanelMenu]}
  return (<>
    <Overlay 
             open={modalOpen} 
             name="Assignment"
             header= {assignmentObj.title}
            //  body={ <p>Assignment -- {assignmentId}</p> }
             body={ overlaycontent }
          onClose={()=>overlayOnClose()} 
          />
    {modalOpen}
    <Router>
      <ToolLayout toolName="Course" headingTitle={selectedCourse.longname} extraMenus={[menuStudentInstructor]}>
        <ToolLayoutPanel
          panelName="Left Nav"
        >
          <React.Fragment>
            <CourseTreeView leftNavDrives={leftNavDrives}/>
          </React.Fragment>
        </ToolLayoutPanel>
        <Switch>
          <Route sensitive exact path="/overview" render={() => <ToolLayoutPanel><h1>Overview</h1></ToolLayoutPanel>} />
          <Route sensitive exact path="/syllabus" render={() => <ToolLayoutPanel><h1>Syllabus</h1></ToolLayoutPanel>} />
          <Route sensitive exact path="/grades" render={(props) => (<LearnerGrades selectedCourse={selectedCourse} studentInstructor={studentInstructor}/>)} />
          <Route sensitive exact path="/grades/attempt" render={(props) => (<LearnerGradesAttempts selectedCourse={selectedCourse} studentInstructor={studentInstructor} />)} />
          <Route sensitive exact path="/assignments" render={() => <CourseAssignments  selectedCourse={selectedCourse} studentInstructor={studentInstructor} setModalOpen={setModalOpen} setAssignmentId = {setAssignmentId}/>} />
          <Route sensitive exact path="/enrollment" render={(props) => (<Enrollment selectedCourse={selectedCourse} studentInstructor={studentInstructor} />)} />
        </Switch>

        <Switch>
          <Route sensitive exact path="/overview" render={() => <ToolLayoutPanel />} />
          <Route sensitive exact path="/syllabus" render={() => <ToolLayoutPanel />} />
          <Route sensitive exact path="/grades" render={() => <ToolLayoutPanel />} />
          <Route sensitive exact path="/grades/attempt" render={() => <ToolLayoutPanel />} />
          <Route sensitive exact path="/assignments" render={() => <CourseAssignmentControls selectedCourse={selectedCourse} studentInstructor={studentInstructor} assignmentId={assignmentId}  setModalOpen={setModalOpen} setAssignmentId = {setAssignmentId}/>} />
          <Route sensitive exact path="/enrollment" render={() => <ToolLayoutPanel />} />
        </Switch>

        {/* <ToolLayoutPanel
          panelName="Rt. Nav">
          <p>Assignment Control Panel</p>
        </ToolLayoutPanel> */}
      </ToolLayout>

    </Router>
    </>
  );
}



const treeNodeItem = (nodeItem) => {
  const { title, icon } = nodeItem
  return <div>
    {icon}
    <Link
      to={`/${title}`}
      style={{
        color: 'white',
        textDecoration: 'none',
        fontWeight: "700",
        paddingLeft: "5px",
        fontSize: "20px",
        textTransform: 'capitalize',
      }}>
      {title}
    </Link>
  </div>
};

const CourseTreeView = (props) => {
  const parentsInfo = {
    root: {
      childContent: [],
      childFolders: [],
      childUrls: [],
      isPublic: false,
      title: "Courses",
      type: "folder"
    }
  };

  props.leftNavDrives.forEach(title => {
    parentsInfo[title] = {
      childContent: [],
      childFolders: [],
      childUrls: [],
      isPublic: false,
      isRepo: false,
      numChild: 0,
      parentId: "root",
      publishDate: "",
      rootId: "root",
      title,
      type: "folder"
    }
    parentsInfo.root.childFolders.push(title);
  });

  return (<TreeView
    containerId={'courses'}
    containerType={'course_assignments'}
    loading={false}
    parentsInfo={parentsInfo}
    childrenInfo={{}}
    parentNodeItem={treeNodeItem}
    leafNodeItem={treeNodeItem}
    specialNodes={new Set()}
    hideRoot={true}
    disableSearch={true}
    treeNodeIcons={(itemType) => {
      let map = {};
      return map[itemType]
    }}
    hideRoot={true}
    treeStyles={{

      specialParentNode: {
        "title": {
          color: "white",
          paddingLeft: "5px"
        },
        "node": {
          backgroundColor: "rgba(192, 220, 242,0.3)",
          color: "white",
          borderLeft: '8px solid #1b216e',
          height: "2.6em",
          width: "100%"
        }
      },
      parentNode: {
        "title": { color: "white", paddingLeft: '5px', fontWeight: "700" },
        "node": {
          width: "100%",
          height: "2.6em",
        },

      },
      childNode: {
        "title": {
          color: "white",
          paddingLeft: "5px"
        },
        "node": {
          backgroundColor: "rgba(192, 220, 242,0.3)",
          color: "white",
          borderLeft: '8px solid #1b216e',
          height: "2.6em",
          width: "100%"
        }
      },

      emptyParentExpanderIcon: {
        opened: <FontAwesomeIcon
          style={{
            padding: '1px',
            width: '1.3em',
            height: '1.2em',
            border: "1px solid darkblue",
            borderRadius: '2px',
            marginLeft: "5px"

          }}
          icon={faChevronDown} />,
        closed: <FontAwesomeIcon
          style={{
            padding: '1px',
            width: '1.3em',
            height: '1.2em',
            border: "1px solid darkblue",
            borderRadius: '2px',
            marginLeft: "5px"

          }}
          icon={faChevronRight} />,
      },
    }}
    onLeafNodeClick={(nodeId) => {
     // console.log(nodeId)
    }}
    onParentNodeClick={(nodeId) => {
     // console.log(nodeId)
    }}
      />)
}
