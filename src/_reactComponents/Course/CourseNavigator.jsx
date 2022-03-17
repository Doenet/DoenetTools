/**
 * External dependencies
 */
import React, {
  useContext,
  useRef,
  useEffect,
  Suspense,
  useCallback,
  useState,
} from 'react';
import axios from 'axios';
import Measure from 'react-measure';
import {
  // faLink,
  faCode,
  faFolder,
  faChevronRight,
  faChevronDown,
  // faUsersSlash,
  // faUsers,
  faCheck,
  // faUserEdit,
  faBookOpen,
  faChalkboard,
  // faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Link } from 'react-router-dom';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import { 
  authorCourseItemOrderByCourseId, 
  authorItemByDoenetId,
  coursePermissionsAndSettingsByCourseId, 
  useInitCourseItems 
} from '../../_reactComponents/Course/CourseActions';

/**
 * Internal dependencies
 */
import '../../_utils/util.css';
import { searchParamAtomFamily } from '../../Tools/_framework/NewToolRoot';

export default function CourseNavigator() {
  console.log("=== CourseNavigator")
  const [courseId] = useRecoilValue(searchParamAtomFamily('path')).split(':');
  let coursePermissionsAndSettings = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  useInitCourseItems(courseId);
  const [numberOfVisibleColumns,setNumberOfVisibleColumns] = useState(1);
  // const addToast = useToast();


  if (!coursePermissionsAndSettings){
    return null;
  }
  //TODO: use effective role
  if (coursePermissionsAndSettings.canEditContent == '1'){
    return <AuthorCourseNavigation courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  }else{
    return <StudentCourseNavigation courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  }


}

function StudentCourseNavigation({courseId,numberOfVisibleColumns,setNumberOfVisibleColumns}){
  let authorItemOrder = useRecoilValue(authorCourseItemOrderByCourseId(courseId));
  
  let items = [];
  authorItemOrder.map((doenetId)=>
    items.push(<Item key={`itemcomponent${doenetId}`} doenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns} />)
  )
    
  return <>
  <CourseNavigationHeader columnLabels={["Due Date"]} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  {items}
  </>
}

function AuthorCourseNavigation({courseId,numberOfVisibleColumns,setNumberOfVisibleColumns}){
  let authorItemOrder = useRecoilValue(authorCourseItemOrderByCourseId(courseId));
  
  let items = [];
  authorItemOrder.map((doenetId)=>
    items.push(<Item key={`itemcomponent${doenetId}`} doenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns}  numberOfVisibleColumns={numberOfVisibleColumns}/>)
  )
    
  return <>
  <CourseNavigationHeader columnLabels={["Assigned","Public"]} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  {items}
  </>
}

function Item({doenetId,numberOfVisibleColumns}){
  let itemInfo = useRecoilValue(authorItemByDoenetId(doenetId));
  // console.log("itemInfo",itemInfo)


  if (itemInfo.contentType == 'section'){
    return <Section key={`Item${doenetId}`} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} />
  }else if (itemInfo.contentType == 'bank'){
    return <Bank key={`Item${doenetId}`} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} />
  }else if (itemInfo.contentType == 'activity'){
    return <Activity key={`Item${doenetId}`} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} />
  }
  // console.log("ERROR",itemInfo)
  // return <div key={`Item${doenetId}`}>ERROR: No Row Type {itemInfo.contentType}</div>
  return null;
}

function Section({doenetId,itemInfo,numberOfVisibleColumns}){

  return <Row numberOfVisibleColumns={numberOfVisibleColumns} icon={faCode} label={itemInfo.label} doenetId={doenetId} />
}

function Bank({doenetId,itemInfo,numberOfVisibleColumns}){

  return <Row numberOfVisibleColumns={numberOfVisibleColumns} icon={faCode} label={itemInfo.label} doenetId={doenetId} />
}

function Activity({doenetId,itemInfo,numberOfVisibleColumns}){

  return <Row numberOfVisibleColumns={numberOfVisibleColumns} icon={faCode} label={itemInfo.label} doenetId={doenetId} />
}



//indentLevel,singleClickHandler,doubleClickHandler,isContainer,toggleContainerHandler,columnsJSX=[]
function Row({doenetId,numberOfVisibleColumns,icon,label,isSelected=false}){
  // let toggle = <button>is closed</button>
  // if (itemInfo.isOpen){
  //   <button>is open</button>
  // }

  let bgcolor = '#ffffff';
  if (isSelected){
    // bgcolor = '#e2e2e2'; //grey
    bgcolor = 'hsl(209,54%,82%)';

  } 

  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);
  

  let activityJSX = (
    <div 
    key={`Row${doenetId}`}
    role="button"
    data-cy="courseItem"
    tabIndex={0}
    className="noselect nooutline"
    style={{
      cursor: 'pointer',
      padding: '8px',
      border: '0px',
      borderBottom: '2px solid black',
      backgroundColor: bgcolor,
      width: 'auto',
      // marginLeft: marginSize,
    }}
    >
    <div
      style={{
        // marginLeft: `${props.indentLevel * indentPx}px`,
        display: 'grid',
        gridTemplateColumns: columnsCSS,
        gridTemplateRows: '1fr',
        alignContent: 'center',
      }}
    >
      <p style={{ display: 'inline', margin: '0px' }}>
        <span data-cy="rowIcon">
          <FontAwesomeIcon icon={icon} />
        </span>
        <span data-cy="rowLabel">{label} </span>
      </p>
      </div>
    </div>
  )
  
  return <>{activityJSX}</>
}

function getColumnsCSS(numberOfVisibleColumns){
  let columnsCSS = '250px repeat(4,1fr)'; //5 columns max
  if (numberOfVisibleColumns === 4) {
    columnsCSS = '250px repeat(3,1fr)';
  } else if (numberOfVisibleColumns === 3) {
    columnsCSS = '250px 1fr 1fr';
  } else if (numberOfVisibleColumns === 2) {
    columnsCSS = '250px 1fr';
  } else if (numberOfVisibleColumns === 1) {
    columnsCSS = '100%';
  }
  return columnsCSS;

}

function CourseNavigationHeader({columnLabels,numberOfVisibleColumns,setNumberOfVisibleColumns}){
  // console.log("===CourseNavigationHeader")

  const updateNumColumns = useCallback(
    (width) => {
      const maxColumns = columnLabels.length + 1;
      //update number of columns in header
      const breakpoints = [375, 500, 650, 800];
      if (width >= breakpoints[3] && numberOfVisibleColumns !== 5) {
        const numberOfVisibleColumns = Math.min(maxColumns, 5);
        setNumberOfVisibleColumns?.(numberOfVisibleColumns);
      } else if (
        width < breakpoints[3] &&
        width >= breakpoints[2] &&
        numberOfVisibleColumns !== 4
      ) {
        const numberOfVisibleColumns = Math.min(maxColumns, 4);
        setNumberOfVisibleColumns?.(numberOfVisibleColumns);
      } else if (
        width < breakpoints[2] &&
        width >= breakpoints[1] &&
        numberOfVisibleColumns !== 3
      ) {
        const numberOfVisibleColumns = Math.min(maxColumns, 3);
        setNumberOfVisibleColumns?.(numberOfVisibleColumns);
      } else if (
        width < breakpoints[1] &&
        width >= breakpoints[0] &&
        numberOfVisibleColumns !== 2
      ) {
        const numberOfVisibleColumns = Math.min(maxColumns, 2);
        setNumberOfVisibleColumns?.(numberOfVisibleColumns);
      } else if (width < breakpoints[0] && numberOfVisibleColumns !== 1) {
        setNumberOfVisibleColumns?.(1);
      }
    },
    [columnLabels, numberOfVisibleColumns, setNumberOfVisibleColumns],
  );

  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);

  return (
    <Measure
      bounds
      onResize={(contentRect) => {
        const width = contentRect.bounds.width;
        // console.log("width",width)
        // latestWidth.current = width;
        updateNumColumns(width);
      }}
    >
      {({ measureRef }) => (
        <div
          ref={measureRef}
          className="noselect nooutline"
          style={{
            padding: '8px',
            border: '0px',
            borderBottom: '1px solid grey',
            maxWidth: '850px',
            margin: '0px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: columnsCSS,
              gridTemplateRows: '1fr',
              alignContent: 'center',
            }}
          >
            <span>Label</span>
            {numberOfVisibleColumns >= 2 && columnLabels[0] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[0]}</span>
            ) : null}
            {numberOfVisibleColumns >= 3 && columnLabels[1] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[1]}</span>
            ) : null}
            {numberOfVisibleColumns >= 4 && columnLabels[2] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[2]}</span>
            ) : null}
            {numberOfVisibleColumns >= 5 && columnLabels[3] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[3]}</span>
            ) : null}
          </div>
        </div>
      )}
    </Measure>
  );

}