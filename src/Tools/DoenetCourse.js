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
import Drive from "../imports/Drive";
  import DoenetViewer from '../Tools/DoenetViewer';
  import {
    atom,
    useSetRecoilState,
    useRecoilValue
  } from 'recoil';
  

  
const loadOverViewContent = async (payload) => {
  const { data } = await axios.get('/api/getDoenetML.php', payload)
                  .then(resp => {
                    return resp;
                  })
    // console.log(" >>> loadOverViewContent ", data);              
    return data;
}


const Overview = React.memo((props) => {
  console.log(">>> overview props", props.overview_branchId)
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

//   useEffect(async () => {
//   const overviewItemsData = await loadOverViewContent(payload);
//   setDoenetML(overviewItemsData.data.doenetML);
// }, [])

useEffect(() => {
  axios.get('/api/getDoenetML.php', payload)
  .then(resp => {
    setDoenetML(resp.data.doenetML) 
   })

}, [payload]);
  // const overviewItemsData = useQuery(["overviewItems",payload],loadOverViewContent,{staleTime:30000})
  // console.log(" >>> Overview" , overviewItemsData);
  return (
    <div data-cy="overviewNavItem">
      <span className="Section-Text">new_Overview6</span>
      {doenetML != "" ?
       <DoenetViewer
       key={"doenetviewer"}
      //  free={{doenetCode: doenetML}}
       doenetML={doenetML}
       course={true}
       attemptNumber={'2'}
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
      : null} 
         {/* build doenetViewer component if we get doenetML , doenetML is not getting, need to check from db
         // Do we need doenet viewer rebuild to functional component or use doenetviewer component and render in main panel/overlay
          */}

    </div>)
}
)


const ViewComponent = (props) => {
  let routeParams = "";
  let id = "";
  let type = '';
  let itemId = ''; 
  if (props.route){  
    let paramsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));  
    if(Object.entries(paramsObj).length > 0)
    {
      // console.log("paramsObj",paramsObj); 
      const path = paramsObj?.path;
      if(path)
      {
        routeParams = path.split(":");  
        if(routeParams[0])
            id = routeParams[0]; 
        type = paramsObj.type;
        itemId = paramsObj.itemId;
        console.log(">>> path ", id , type , itemId)
      }
    }
  }
return (
  
      <Overview overview_branchId={id}/>
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
 
  let roleAtom = atom({
    key:"roleAtom",
    default:'Student'
  })

  // function roleChange(){
  // let setRole = useSetRecoilState(roleAtom);
  //   // let setNum = useSetRecoilState(numAtom);
  //   // return <button onClick={()=>setNum((old)=>old+1)}>+</button>
  // }
  
  
  useEffect(() => {
    getCourses_CI((courseListArray, selectedCourseObj) => { 
      setSelectedCourse(selectedCourseObj) })    
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
        //   responsiveControls={
        //     <Menu label="Role">
        //             <MenuItem
        //               value="Student"
        //               onSelect={() => {
        //                 console.log(">>>Selected student")
        //               }}
        //             />
        //             <MenuItem
        //               value="Instructor"
        //               onSelect={() => {
        //                 console.log(">>>Selected Instructor")
        //               }}
        //             />
        //           </Menu>
        // } 
        >
          <navPanel>
          {/* <Menu label="Role">
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
                  </Menu> */}

          {/* Create React Router Links in NavPanel for Overview and Syllabus (temp) doenet.org/course/#?path=abc123:abc123&type=doenetML&itemId=overviewId  */}
            {/* <CourseTreeView leftNavDrives={leftNavDrives} /> */}

            {leftNavDrives.map((item)=>{
              return(
               <>
               
                { item === 'overview' ?
                  (<Link to={item === "overview" ? `?path=${selectedCourse.courseId}:${selectedCourse.overviewId}&type=doenetML&itemId=${selectedCourse.overviewId}` : item}
                  style={{
                    color: 'white',
                    display:'flex',
                    flexDirection:'column',
                    textDecoration: 'none',
                    fontWeight: "700",
                    paddingLeft: "5px",
                    fontSize: "20px",
                    textTransform: 'capitalize',
                  }}>{item}</Link>)
                : item === 'syllabus' ?
                    (<Link to={item === "syllabus" ? `?path=${selectedCourse.courseId}:${selectedCourse.syllabusId}&type=doenetML&itemId=${selectedCourse.syllabusId}` : item}
                    style={{
                      color: 'white',
                      display:'flex',
                      flexDirection:'column',
                      textDecoration: 'none',
                      fontWeight: "700",
                      paddingLeft: "5px",
                      fontSize: "20px",
                      textTransform: 'capitalize',
                    }}>{item}</Link>) : item === 'assignments' ? (<Link to={`?path=&type=${item}&itemId=`}
                    style={{
                      color: 'white',
                      display:'flex',
                      flexDirection:'column',
                      textDecoration: 'none',
                      fontWeight: "700",
                      paddingLeft: "5px",
                      fontSize: "20px",
                      textTransform: 'capitalize',
                    }}>{item}</Link>): (<Link to={`/${item}`}
                    style={{
                      color: 'white',
                      display:'flex',
                      flexDirection:'column',
                      textDecoration: 'none',
                      fontWeight: "700",
                      paddingLeft: "5px",
                      fontSize: "20px",
                      textTransform: 'capitalize',
                    }}>{item}</Link>)}
                </>
              )
            })}
          </navPanel>

          <mainPanel >

          {/* <Drive types={['content','course']} /> */}
          {/* <Drive id="_jO08ui8XmzjAt8GSwLNE" /> */}


              <Switch>
                <Route path="/" render={(routeprops) => <ViewComponent route={{ ...routeprops }} {...props} />}></Route>
              </Switch>
              
          </mainPanel>
           
           {/* <Route path="/" render={(routeprops) => <ViewComponent route={{ ...routeprops }} {...props} />}></Route>*/}
  

       

        
   
          <supportPanel>
            <h3>Support Panel Content</h3>
          </supportPanel>
          <menuPanel>
            Menu Panel
          </menuPanel>
        </Tool>
        </Router>
  


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
  // localhost/course/#?path=abc123:abc123&type=assignment&itemId=aaa111
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
