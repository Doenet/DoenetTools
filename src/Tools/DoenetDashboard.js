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
    console.log("XY: ", x.shortName, y.shortName);
    if(x.order != null && y.order != null){
      return x.order - y.order
    }else if(x.order != null){
      return -1
    }else if(y.order != null){
      return 1
    }else{
      return x.shortName.localeCompare(y.shortName)
    }
  }

  export default function DoenetDashboard(props){

    const [items, setItems] = useState(null);
  
    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
      axios.get(`/api/loadUserCourses.php?`).then(resp => {
        
        setItems(resp.data.sort(compare))
        setIsLoaded(true);
        //console.log(resp.data);
        
      }).catch(err => console.log("error"));
    }, []);

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
    
    const [width, setWidth] = useState(window.innerWidth - 200)
    

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
    


    const transitions = useTransition(gridItems, item => item.shortName, {
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
        <ToolLayout toolName="Dashboard" toolPanelsWidth = {toolPanelsWidthResize}>

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

            <div>

            {isLoaded ? 
            <div {...bind} className="list" style={{ height: Math.max(...heights) }}>
              {transitions.map(({ item, props: { xy, ...rest }}, index) => (
                <a.div key = {index} style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest }}>
                  {console.log(item)}
                  <Link to = {`/${item.courseId}`} style = {{textDecoration: 'none'}}><CourseCard data = {item} /></Link>
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

