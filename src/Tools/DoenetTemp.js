
import React, { useState } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";

const alphabet =
  "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z ";

export default function DoenetExampleTool(props) {

  const mainControls = [<button>Test</button>];

  return (
    <>
  
      
      
      <ToolLayout toolName="my example"
      headingTitle="Example tool"


      >
        <ToolLayoutPanel
          // panelHeaderControls={menuControls}
          isLeftPanel={true}
          purpose = "navigation"
        >
          start {alphabet} {alphabet} {alphabet}{alphabet} {alphabet}{alphabet}end
        </ToolLayoutPanel>

        <ToolLayoutPanel
          panelHeaderControls={mainControls}
          panelName="Main"
          // purpose="main" 
          >
          start {alphabet}{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}end
        </ToolLayoutPanel>

        <ToolLayoutPanel
          panelName="Support"
          purpose="support">
          start {alphabet}{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}end
          </ToolLayoutPanel>
      </ToolLayout>
    </>
  );
}






  // import React from 'react';
// import VerticalDivider from "../Doenet/components/VerticalDivider.js";
// import ToolLayout from '../Tools/ToolLayout/ToolLayout.js';
// import ToolLayoutPanel from '../Tools/ToolLayout/ToolLayoutPanel.js';
// import { getCourses_CI, setSelected_CI, saveCourse_CI } from "../imports/courseInfo";

// export default function attempt() {
//      //Save new course in IndexedDB
//     //  getCourses_CI({courseId, courseName, courseCode, term, description, department, section})
//     let courseId = "mycourseid";
//     let courseName = "my test course";
//     let courseCode = "my101"
//     let term = "Spring 2020"
//     let description = "my description"
//     let department = "dep"
//     let section = "01"

//     // getCourses_CI({courseId, courseName, courseCode, term, description, department, section})
// return (
//   <>
//    <button onClick={()=>{
//      console.log('before')
//      saveCourse_CI({courseId, courseName, courseCode, term, description, department, section})

//    }
//      } >  test add</button>
//   </>
// );
// }


// let mainHeight = "";
//     switch(this.context.panelHeadersControlVisible.sliderVisible) {
//       case 1: if(this.context.panelHeadersControlVisible.phoneButtonsDisplay) {mainHeight = "180px"} else {mainHeight = "50px"};
//               break;
//       case 2: mainHeight = "230px";
//               break;
//       case 3: mainHeight = "275px";
//               break;
//       default: mainHeight = "180px";
//     }