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
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MenuDropDown from '../imports/MenuDropDown.js';
// import Overlay from "../imports/Overlay";
import {CourseAssignments,CourseAssignmentControls} from "./courseAssignments";
import LearnerAssignment from './LearnerAssignment';


import Tool from "../imports/Tool/Tool";
import NavPanel from "../imports/Tool/NavPanel";
import MainPanel from "../imports/Tool/MainPanel";
import SupportPanel from "../imports/Tool/SupportPanel";
import MenuPanel from "../imports/Tool/MenuPanel";
import HeaderMenuPanelButton from "../imports/Tool/HeaderMenuPanelButton";
import ResponsiveControls from "../imports/Tool/ResponsiveControls";
import Overlay from "../imports/Tool/Overlay";
import CollapseSection from "../imports/CollapseSection";
import MenuPanelSection from "../imports/Tool/MenuPanelSection";
import ActionButton from "../imports/PanelHeaderComponents/ActionButton";
import MenuItem from "../imports/PanelHeaderComponents/MenuItem";
import Menu from "../imports/PanelHeaderComponents/Menu";
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
import {
  useQuery,
  useQueryCache,
  QueryCache,
  ReactQueryCacheProvider,
  useMutation,
} from 'react-query'
import axios from "axios";

const loadOverViewContent = async (_,payload) => {
  const { data } = await axios.get('/api/getDoenetML.php', payload)
                  .then(resp => {
                    return resp;
                  })
    // console.log(" >>> loadOverViewContent ", data);              
    return data;
}

const Overview = (props) => {
  const [doenetML, setDoenetML] = useState('');
  const data = {
    branchId: props.overview_branchId,
    contentId: "",
    ListOfContentId: "", 
    List_Of_Recent_doenetML: [], 
  }
  const payload = {
    params: data
  }

  const overviewItemsData = useQuery(["overviewItems",payload],loadOverViewContent,{staleTime:30000})
  // console.log(" >>> Overview" , overviewItemsData.data.doenetML);
  return (
    <div data-cy="overviewNavItem">
      <span className="Section-Text">new_Overview6</span>
      {doenetML != "" ?
      <h1>doenet viewer</h1>
    //    <DoenetViewer
    //    key={"doenetviewer"}
    //    // free={{doenetCode: doenetML}}
    //    doenetML={doenetML}
    //    course={true}
    //    attemptNumber={latestAttemptNumber}
    //    mode={{
    //      solutionType: "displayed",
    //      allowViewSolutionWithoutRoundTrip: false,
    //      showHints: false,
    //      showFeedback: true,
    //      showCorrectness: true,
    //      interactive: false,
    //    }}
    //  /> 
      : null} 
         {/* build doenetViewer component if we get doenetML , doenetML is not getting, need to check from db
         // Do we need doenet viewer rebuild to functional component or use doenetviewer component and render in main panel/overlay
          */}

    </div>)
}

const Syllabus = () =>{

}

const Grades = () =>{

}

const Assignment = () =>{

}

const ViewComponent = (props) => {
  let routeParams = "";
  let pathDriveId ="";
  let type = "";
  let id = "";
  if (props.route){
    let drivePath = props.route.location.pathname.split("/").filter(i=>i)[0] 
      // console.log(">>>folder path",drivePath)
      if (drivePath !== undefined){
        routeParams = drivePath.split("&");        
        for(let i=0; i < routeParams.length; i++)
        {
            let routevalues = routeParams[i].split('=');
            if(routevalues[0] === 'overviewId' )
            {
              id = routevalues[1];
            }
            else if(routevalues[0] === 'syllabusId' )
            {
              id = routevalues[1];
            }
            else if(routevalues[0] === 'type' )
            {
              type = routevalues[1]
            }
        }
      }
    }
return (
  <MainPanel> 
  { type === 'overview' ? 
      <Overview overview_branchId={id}/>
      : (type === 'syllabus' 
     ? 
      <h1>Test syllabus Component</h1> 
     :  <h1>Test Overview</h1> ) 
  }
  </MainPanel>
) 
}

export default function DoenetCourse(props) {

  const [showHideNewOverLay, setShowHideNewOverLay] = useState(false);

  const showHideOverNewOverlayOnClick = () => {
    setShowHideNewOverLay(!showHideNewOverLay);
  };

  const [selectedCourse, setSelectedCourse] = useState({});
  const [studentInstructor,setStudentInstructor] = useState("Student")
  const [modalOpen, setModalOpen] = useState(false)
  const [assignmentObj,setAssignmentObj] = useState({title:"test title"})
  const [assignmentId,setAssignmentId] = useState("");
  
  useEffect(() => {
    getCourses_CI((courseListArray, selectedCourseObj) => { setSelectedCourse(selectedCourseObj) })
  }, [])

  // useEffect(()=> {
  //   console.log(selectedCourse);
  // },[selectedCourse]);

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
    // const { location: { pathname = '' } } = this.history
    // this.history.push(`${pathname}`)
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
  // panelHeaderControls={[contextPanelMenu]}
  return (<>
    {/* <Overlay 
             open={modalOpen} 
             name="Assignment"
             header= {assignmentObj.title}
             body={ overlaycontent }
          onClose={()=>overlayOnClose()} 
          /> */}
    {/* {modalOpen} */}
<Router>

    <Tool
          initSupportPanelOpen ={false}
          onUndo={() => {
            console.log(">>>undo clicked");
          }}
          onRedo={() => {
            console.log(">>>redo clicked");
          }}
          title={"My Doc"}
          responsiveControls={
            <Menu label="Role">
                    <MenuItem
                      value="Student"
                      onSelect={() => {
                        console.log(">>>Selected student")
                      }}
                    />
                    <MenuItem
                      value="Instructor"
                      onSelect={() => {
                        console.log(">>>Selected Instructor")
                      }}
                    />
                  </Menu>
        } 
        >
          <NavPanel>
          <React.Fragment>
            <CourseTreeView leftNavDrives={leftNavDrives} />
            {/* <Browser history={path}/> */}
          </React.Fragment>
          </NavPanel>

          {/* <MainPanel
            setShowHideNewOverLay={setShowHideNewOverLay}
            // responsiveControls={[]MainPanel
          > */}

          <MainPanel />
            <Switch>
            <Route path="/" render={(routeprops) => <ViewComponent route={{ ...routeprops }} {...props} />}></Route>
          
          {/* <Route sensitive exact path={"/overviewId=".concat(selectedCourse["overviewId"])} render={() => <MainPanel><h1>Overview</h1></MainPanel>} /> */}
          {/* <Route sensitive exact path={"/syllabusId=".concat(selectedCourse["syllabusId"])} render={() => <MainPanel><h1>Syllabus</h1></MainPanel>} />
          <Route sensitive exact path="/grades" render={(props) => (<LearnerGrades selectedCourse={selectedCourse} studentInstructor={studentInstructor}/>)} />
          <Route sensitive exact path="/grades/attempt" render={(props) => (<LearnerGradesAttempts selectedCourse={selectedCourse} studentInstructor={studentInstructor} />)} />
          <Route sensitive exact path="/assignments" render={() => <CourseAssignments  selectedCourse={selectedCourse} studentInstructor={studentInstructor} setModalOpen={setModalOpen} setAssignmentId = {setAssignmentId}/>} />
          <Route sensitive exact path="/enrollment" render={(props) => (<Enrollment selectedCourse={selectedCourse} studentInstructor={studentInstructor} />)} /> */}
        </Switch>

        
    {/* localhost/course/#/?path=abc123:abc123&type=assignment&itemId=aaa111 */}
    {/* Php  */}
       
        {/* <Router>
          <Switch>
            <Route path=“/” render={(routeprops) => <MainPanel><Overview route={{ ...routeprops }} {...props} /></MainPanel>}></Route>
          <MainPanel>
            Overview
         </MainPanel>
          </Route>
        </Switch>
    </Router>
         */}

        <Switch>
          <Route sensitive exact path="/overview" render={() => <MainPanel />} />
          <Route sensitive exact path="/syllabus" render={() => <MainPanel />} />
          <Route sensitive exact path="/grades" render={() => <MainPanel />} />
          <Route sensitive exact path="/grades/attempt" render={() => <MainPanel />} />
          <Route sensitive exact path="/assignments" render={() => <CourseAssignmentControls setAssignmentObj={setAssignmentObj} selectedCourse={selectedCourse} studentInstructor={studentInstructor} assignmentId={assignmentId}  setModalOpen={setModalOpen} modalOpen={modalOpen} setAssignmentId = {setAssignmentId}/>} />
          <Route sensitive exact path="/enrollment" render={() => <MainPanel />} />
        </Switch>

        
            {/* <div
              onClick={() => {
                showHideOverNewOverlayOnClick();
              }}
            >
              Click for Overlay
            </div> */}

            {/* <h3> This is Main Panel</h3>
            <p>click Switch button in header to see support panel</p>
            <p>
              Define responsiveControls to see for standard components section
              which are responsive and collapses according the width available
            </p>

            <h2>Header Menu Panels </h2>
            <p>Click add and save to see header menu panels section </p> */}
          {/* </MainPanel> */}

          <SupportPanel
          // responsiveControls={[]}
          >
            <h3>Support Panel Content</h3>

            <p>
              Define responsiveControls to see for standard components section
              which are responsive and collapses according the width available
            </p>
          </SupportPanel>
          <MenuPanel>
            <MenuPanelSection title="Assignment">
              
            </MenuPanelSection>
            {/* <MenuPanelSection title="style">
              Menu Panel Style Content
            </MenuPanelSection> */}
          </MenuPanel>
        </Tool>
        </Router>
    {/* <Router>
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
          <Route sensitive exact path="/assignments" render={() => <CourseAssignmentControls setAssignmentObj={setAssignmentObj} selectedCourse={selectedCourse} studentInstructor={studentInstructor} assignmentId={assignmentId}  setModalOpen={setModalOpen} modalOpen={modalOpen} setAssignmentId = {setAssignmentId}/>} />
          <Route sensitive exact path="/enrollment" render={() => <ToolLayoutPanel />} />
        </Switch>

        {/* <ToolLayoutPanel
          panelName="Rt. Nav">
          <p>Assignment Control Panel</p>
        </ToolLayoutPanel> 
       </ToolLayout> 

     </Router>  */}
    </>
  );
}



const treeNodeItem = (nodeItem) => {
  //debugger;
  console.log(nodeItem, "nodeItem");
  const { title, icon, viewId } = nodeItem
  // if(title) {
  //   let viewId = selectedCourse[title.toLowerCase() === "overview" ? "overviewId" : title.toLowerCase() === "syllabus" ? "syllabusId" : title];
  //   console.log(viewId);
  // }
  return <div>
    {icon}
        {/* localhost/course/#/?path=abc123:abc123&type=assignment&itemId=aaa111 */}

    <Link
      to={title === "overview" || title === "syllabus" ? `/type=${title}&${title.concat('Id=').concat(viewId)}` : title}//course/?viewId=w35234
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
  console.log("inside tree view", props);
  const [selectedCourse, setSelectedCourse] = useState({});
  useEffect(() => {
    getCourses_CI((courseListArray, selectedCourseObj) => { setSelectedCourse(selectedCourseObj) })
  }, [])
  const parentsInfo = {
    root: {
      childContent: [],
      childFolders: [],
      childUrls: [],
      isPublic: false,
      title: "Courses",
      type: "folder",
      viewId: ""
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
      type: "folder",
      viewId: selectedCourse[title+"Id"] ? selectedCourse[title+"Id"] : ""
    }
    parentsInfo.root.childFolders.push(title);
  });
  //console.log(parentsInfo, "info parents");
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
    //  console.log(nodeId, " leaf click");
    //  console.log(props.selectedCourse['overviewId'], "child")
    }}
    onParentNodeClick={(nodeId) => {
      console.log(nodeId, "parentclick");
     console.log(props.selectedCourse, "parent")
    }}
      />)
}
