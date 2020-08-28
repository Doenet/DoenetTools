// import DoenetViewer from '../Tools/DoenetViewer';
// import axios from 'axios';
// import './course.css';
// import nanoid from 'nanoid';
// import query from '../queryParamFuncs';
// import DoenetBox from '../Tools/DoenetBox';
// import DoenetAssignmentTree from "./DoenetAssignmentTree"

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

export default function DoenetCourse(props) {
  const [selectedCourse, setSelectedCourse] = useState({});

  useEffect(() => {
    getCourses_CI((courseListArray, selectedCourseObj) => { setSelectedCourse(selectedCourseObj) })
  }, [])

  const menuStudentInstructor = <MenuDropDown 
    position={'left'}  
    offset={-20} 
    showThisMenuText={"Student"} 
    options={[
      {id:"Student", label:"Student", callBackFunction:()=>{alert('Student')}},
      {id:"Instructor", label:"Instructor", callBackFunction:()=>{alert('Instructor')}},
  ]} />;
  return (
    <Router>
      <ToolLayout toolName="Course" headingTitle={selectedCourse.longname} extraMenus={[menuStudentInstructor]}>
        <ToolLayoutPanel
          // menuControls={menuControls}
          panelName="Left Nav"
        >
          <React.Fragment>
            <CourseTreeView />
            {/*<div style={{ display: "flex", flexDirection: "column" }}>
              <Link to="/overview">Overview</Link>
              <Link to="/syllabus">Syllabus</Link>
              <Link to="/grades">Grades</Link>
              <Link to="/assignments">Assignments</Link>
              <Link to="/enrollment">Enrollment</Link>
  </div>*/}
          </React.Fragment>
        </ToolLayoutPanel>
        <Switch>
          <Route sensitive exact path="/overview" render={() => <h1>Overview</h1>} />
          <Route sensitive exact path="/syllabus" render={() => <h1>Syllabus</h1>} />
          <Route sensitive exact path="/grades" render={(props) => (<LearnerGrades selectedCourse={selectedCourse} />)} />
          <Route sensitive exact path="/assignments" render={() => <h1>Assignments</h1>} />
          <Route sensitive exact path="/enrollment" render={(props) => (<Enrollment selectedCourse={selectedCourse} />)} />
          {/* <Route sensitive exact path="/attempt/" render={(props) => (<GradebookAttemptView />)} /> */}
        </Switch>
        {/* <Enrollment selectedCourse={selectedCourse}/> */}
        {/* <LearnerGrades selectedCourse={selectedCourse}/> */}
        <ToolLayoutPanel
          // menuControlsViewermenuControls={menuControlsViewer}
          panelName="Rt. Nav">
          <p>Assignment Control Panel</p>
        </ToolLayoutPanel>
      </ToolLayout>

    </Router>
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

const CourseTreeView = () => {
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
  ['overview','syllabus','grades','assignments', 'enrollment', ].forEach(title => {
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
