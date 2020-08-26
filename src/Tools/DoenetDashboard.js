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
    //console.log("XY: ", x, y);
    // console.log("yoooooooooooo");
    
    if(x.position != null && y.position != null){
      console.log("not nullll");
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
  
  export default function DoenetDashboard(props){

    const [items, setItems] = useState(null);
  
    const [isLoaded, setIsLoaded] = useState(false)


    useEffect(() => {
      getCourses_CI(updateCourseInfo);
    }, [])

    function updateCourseInfo(courseListArray,selectedCourseObj){
      console.log("courses",courseListArray);
      //console.log("selected",selectedCourseObj);
      //setSelected_CI("NfzKqYtTgYRyPnmaxc7XB");
      // console.log("hereeeeeee");////////////////////////////
      
      setItems(courseListArray.sort(compare))
      if(courseListArray.length > 0){
        setIsLoaded(true)
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
    // const updateWidth = () => {
    //   setWidth(window.innerWidth - 209);
    // };
    // console.log("width", width)
    
    // useEffect(() => {
    //     window.addEventListener("resize", updateWidth);
    //     return () => window.removeEventListener("resize", updateWidth);
    // });

    
    

    let gridItems = []
    let heights = []
    let routes = []

    if(isLoaded){
      console.log("loaded");
      heights = new Array(columns).fill(0) // Each column gets a height starting with zero
      gridItems = items.map((child, i) => {
        routes.push(<Route sensitive exact path={`/${child.courseId}`} key = {i}/>);
        const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
        const xy = [(width / columns) * column, (heights[column] += 230) - 230] // X = container width / number of columns * column index, Y = it's just the height of the current column
        return { ...child, xy, width: width / columns, height: 230}
      })

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

    return (
      <Router basename = "/">
        <ToolLayout toolName="Dashboard" toolPanelsWidth = {toolPanelsWidthResize} leftPanelClose = {true}>

       <ToolLayoutPanel
            // menuControls={menuControls}
            panelName="context"
          >
          <div>
            {x}
            <button onClick={()=>setX(x + 1)}>Count</button>
            <p>test</p>
          </div>
          </ToolLayoutPanel> 

       <ToolLayoutPanel
            // menuControls={menuControlsEditor}
            panelName="Editor">

            <div className = "dashboardcontainer">

            {isLoaded ? 
            <div {...bind} className="list" style={{ height: Math.max(...heights) }}>
              {transitions.map(({ item, props: { xy, ...rest }}, index) => (
                <a.div key = {index} style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest }}>
                  {/* {console.log(item)} */}
                  <Link to = {`/${item.courseId}`} style = {{textDecoration: 'none'}} onClick = {() => setSelected_CI(item.courseId)}><CourseCard data = {item} updateCourseColor = {updateCourseColor}/></Link>
                  {/* <CourseCard data = {item} /> */}
                </a.div>
              ))}
            </div> : 
            <p>Loading..</p>
            }

            <Switch>
              {routes}
            </Switch>

            </div>
            
        </ToolLayoutPanel>

          {/* <ToolLayoutPanel menuControls={menuControlsViewer} panelName="Viewer">
            {alphabet} {alphabet} {alphabet} {alphabet}
          </ToolLayoutPanel>  */}
        </ToolLayout>
      </Router>
    );
  }

