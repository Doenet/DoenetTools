import React, { useState, useEffect, useRef } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";
import axios from 'axios';
import { useTransition, a } from 'react-spring'
//import useMeasure from './useMeasure'
import useMedia from './useMedia'
import './dashboard.css'
import CourseCard from './DoenetCourseCard'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import { getCourses_CI, setSelected_CI, updateCourses_CI } from "../imports/courseInfo";
import DriveCardComponent from "../imports/DriveCardComponent";
import {
  useRecoilValueLoadable,
} from "recoil";
import  { 
  fetchDrivesSelector,
  encodeParams
  
} from "../imports/Drive";

const Button = styled.button`
  width: 60px;
  height: 30px;
  border: 1px solid lightgrey;
  position: relative;
  top: 5px;
  left: 20px;
`;


const alphabet =
  "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z ";

  function compare (x, y) {
    // console.log("XY: ", x, y);
    // console.log("yoooooooooooo");
    
    if(x.position != null && y.position != null){
      // console.log("not nullll");
      return x.position - y.position
    }else if(x.position != null){
      return -1
    }else if(y.position != null){
      return 1
    }else{
      // console.log(x.shortname, y.shortname);////////////////////////////
      return x.shortname.localeCompare(y.shortname)
    }
  }

  function ignorantcompare (x, y) {
    return x.shortname.localeCompare(y.shortname)
  }
  
  export default function DoenetDashboard(props){

    const [items, setItems] = useState(null);////////////////make changes

    const [dragIndex, setDragIndex] = useState(null);
  
    const [isLoaded, setIsLoaded] = useState(false)

    const [hasClasses, setHasClasses] = useState(false)

    const [drag, setDrag] = useState(0)

    // const [dragItem, setDragItem] = useState({index: null, items});

    // const [dragIndex, setDragIndex] = useState(null);

    useEffect(() => {
      getCourses_CI(updateCourseInfo);
      setIsLoaded(true);
    }, [])

    function updateCourseInfo(courseListArray,selectedCourseObj){
      // console.log("courses",courseListArray);
      //console.log("selected",selectedCourseObj);
      //setSelected_CI("NfzKqYtTgYRyPnmaxc7XB");
      // console.log("hereeeeeee");////////////////////////////

      courseListArray = courseListArray.sort(compare);

      // console.log("input", courseListArray)

      for(let index in courseListArray){
        // console.log("position not defined for", courseListArray[index], "at", index);
        courseListArray[index].position = parseInt(index);
        // if(courseListArray[index].position === null || courseListArray[index].position === undefined){
        //   console.log("position not defined for", courseListArray[index], "at", index);
        //   courseListArray[index].position = parseInt(index);
        // }
        // courseListArray[index].ogposition = parseInt(index);
      }
      setItems(courseListArray)
      if(courseListArray.length > 0){
        setHasClasses(true)
      }

    }

    // useEffect(() => {
    //   axios.get(`/api/loadUserCourses.php?`).then(resp => {
        
    //     setItems(resp.data.sort(compare))
    //     setIsLoaded(true);
    //     //console.log(resp.data);
        
    //   }).catch(err => console.log("error"));
    // }, []);

    let [x, setX] = useState(0);
    const menuControls = [<Button>Search</Button>];
    const menuControlsEditor = [<Button>Edit</Button>];
    const menuControlsViewer = [<Button>Update</Button>];

  
    const columns = useMedia(
      ['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)', '(min-width: 400px)'],
      [5, 4, 3, 2],
      1
    )
    //const [bind, { width }] = useMeasure()
    const ref = useRef()
    const bind = { ref }
    //console.log(bind);
    
    const [width, setWidth] = useState(window.innerWidth < 767 ? window.innerWidth : window.innerWidth - 206)
    const [height, setHeight] = useState(230);

    function updateCourseColor(color, courseId){
      let mod = [...items]
      for (var index in mod){
        if(mod[index].courseId === courseId){
          mod[index].color = color;
        }
      }
      // console.log(mod);
      setItems(mod);

      updateCourses_CI(mod);
      
    }
  
    function handleDragEnter(index, e){
      if(drag === 0){
        // console.log("drag/click start at index", index);
        setDragIndex(index);
        setDrag(1);
      }
    }

    function handleDragThrough(e){
      if(drag === 1){
        setDrag(2);
        // console.log("drag confirmed at index", dragIndex)
        let moditems = [...items];
        moditems[dragIndex].isDummy = true;
        setItems(moditems);
      }else if(drag === 2){
        // console.log("drag 2:", (width/columns), height);
        
        let xp = parseInt(e.clientX/(width/columns))
        let yp = parseInt((e.clientY - 50)/height)
        let fp = Math.min(yp*columns + xp, items.length - 1);
        // console.log("position", fp);
        if(fp !== dragIndex){
          let moditems = [...items];
          if(fp > dragIndex){
            for(let i = dragIndex + 1; i <= fp; i++){
              // console.log("i loop 1", i);
              moditems[i].position -= 1;
            }
          }else{
            for(let i = dragIndex - 1; i >= fp; i--){
              moditems[i].position += 1;
            }
          }
          moditems[dragIndex].position = fp;
          // console.log("new pos", moditems[dragIndex].position, "dragItem", moditems[dragIndex]);
          setDragIndex(fp);
          setItems(moditems.sort(compare));
        }

      }
    }

    function handleDragExit(e){
      if(drag == 1){
        // console.log("click end");
        setDrag(0);
        // setDragIndex(null);
        setDragIndex(null);
      }else if(drag === 2){
        // console.log("drag end");
        let moditems = [...items];
        moditems[dragIndex].isDummy = false;
        setItems(moditems);
        setDrag(0);
        setDragIndex(null);
        updateCourses_CI(moditems);

        // let itemsinshortnameorder = [...moditems].sort(ignorantcompare)
        // let backtosquareoneflag = true;
        
        // for (let index in itemsinshortnameorder){
        //   if(itemsinshortnameorder[index].shortname !== moditems[index].shortname){
        //     console.log("pos matching failed at", index);
        //     backtosquareoneflag = false;
        //     break;
        //   }
        // }

        // if(backtosquareoneflag){
        //   for(let index in itemsinshortnameorder){
        //     let item = {...itemsinshortnameorder[index]};
        //     item.position = null;
        //     itemsinshortnameorder[index] = item;
        //   }

        //   updateCourses_CI(itemsinshortnameorder);

        // }else{
        //   updateCourses_CI(moditems);
        // }

      }
    }
    

    let gridItems = []
    let heights = []
    let routes = []

    if(isLoaded && hasClasses){
      // console.log("loaded");
      heights = new Array(columns).fill(0) // Each column gets a height starting with zero
      gridItems = items.map((child, i) => {
        routes.push(<Route sensitive exact path={`/${child.courseId}`} key = {i}/>);
        const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
        const xy = [(width / columns) * column, (heights[column] += 230) - 230] // X = container width / number of columns * column index, Y = it's just the height of the current column
        return { ...child, xy, width: width / columns, height: 230}
      })

      // console.log("griditems", gridItems);
    }
    


    const transitions = useTransition(gridItems, item => item.shortname, {
      from: ({ xy, width, height }) => ({ xy, width, height, opacity: 0 }),
      enter: ({ xy, width, height }) => ({ xy, width, height, opacity: 1 }),
      update: ({ xy, width, height }) => ({ xy, width, height }),
      leave: { height: 0, opacity: 0 },
      config: { mass: 5, tension: 500, friction: 100 },
      trail: 25
    })

    const toolPanelsWidthResize = function(leftW, middleW, rightW) {
      //console.log("leftWidth ---", leftW + " middleWidth ---", middleW + " rightWidth ---",  rightW);
      setWidth(middleW);
    };
    const history = useHistory();

    let routePathDriveId = "";

    const drivesInfo = useRecoilValueLoadable(fetchDrivesSelector);
    let driveInfo = [];
    if (drivesInfo.state === "hasValue") {
      driveInfo = drivesInfo.contents.driveIdsAndLabels;
    }
    function driveCardSelector({item}) {
      let newParams = {};
      newParams["path"] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
      newParams["courseId"] = `${item.courseId}`
      // history.push("/course?" + encodeParams(newParams));
      window.location = "/course/#/?" + encodeParams(newParams);
    }
    // Drive cards component
    let drivecardComponent = null;
    if (driveInfo && driveInfo.length > 0 && routePathDriveId === "") {
      drivecardComponent = <DriveCardComponent 
      driveDoubleClickCallback={({item})=>{driveCardSelector({item})}} driveInfo={driveInfo}/>;
    } else if (driveInfo.length === 0 && routePathDriveId === "") {
      drivecardComponent = (
        <h2>You have no courses</h2>
      );
    }
    
    return (
      <Router basename = "/">
        <ToolLayout toolName="Dashboard" toolPanelsWidth = {toolPanelsWidthResize} leftPanelClose = {true}>

       <ToolLayoutPanel
            // menuControls={menuControls}
            panelName="context"
          >
          <div>
            {x}gi
            <button onClick={()=>setX(x + 1)}>Count</button>
            <p>test</p>
          </div>
          </ToolLayoutPanel> 

       <ToolLayoutPanel >
       <div 
      
        tabIndex={0}
        style={{width:"100%",height:"100%"}}
        >
       {drivecardComponent}
        </div>        
        </ToolLayoutPanel>

          {/* <ToolLayoutPanel menuControls={menuControlsViewer} panelName="Viewer">
            {alphabet} {alphabet} {alphabet} {alphabet}
          </ToolLayoutPanel>  */}
        </ToolLayout>
      </Router>
    );
  }


