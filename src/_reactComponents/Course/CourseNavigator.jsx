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
// import Measure from 'react-measure';
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

  if (!coursePermissionsAndSettings){
    return null;
  }
  if (coursePermissionsAndSettings.canEditContent == '1'){
    return <AuthorCourseNavigation courseId={courseId} />
  }else{
    return <p>Student Course Navigation</p>
  }

  // const addToast = useToast();

}

function AuthorCourseNavigation({courseId}){
  let authorItemOrder = useRecoilValue(authorCourseItemOrderByCourseId(courseId));

  let items = [];
  authorItemOrder.map((doenetId)=>
    items.push(<Item key={`itemcomponent${doenetId}`} doenetId={doenetId} courseId={courseId} />)
  )
    
  return <>{items}</>
}

function Item({doenetId,courseId}){
  let itemInfo = useRecoilValue(authorItemByDoenetId(doenetId));
  // console.log("itemInfo",itemInfo)


  if (itemInfo.type == 'section'){
    return <Section key={`Item${doenetId}`} doenetId={doenetId} courseId={courseId} itemInfo={itemInfo} />
  }else if (itemInfo.type == 'bank'){
    return <Bank key={`Item${doenetId}`} doenetId={doenetId} courseId={courseId} itemInfo={itemInfo} />
  }else if (itemInfo.type == 'activity'){
    return <Activity key={`Item${doenetId}`} doenetId={doenetId} courseId={courseId} itemInfo={itemInfo} />
  }
  return <div key={`Item${doenetId}`}>{itemInfo.type} {itemInfo.label} {doenetId}</div>
}

function Section({doenetId,courseId,itemInfo}){

  let toggle = <button>is closed</button>
  if (itemInfo.isOpen){
    <button>is open</button>
  }
  return <div key={`Section${doenetId}`}>{toggle} Section {itemInfo.label} {doenetId}</div>
}

function Bank({doenetId,courseId,itemInfo}){

  let toggle = <button>is closed</button>
  if (itemInfo.isOpen){
    <button>is open</button>
  }
  return <div key={`Bank${doenetId}`}>{toggle} Bank {itemInfo.label} {doenetId}</div>
}

function Activity({doenetId,courseId,itemInfo}){

  let toggle = <button>is closed</button>
  if (itemInfo.isOpen){
    <button>is open</button>
  }
  return <div key={`Activity${doenetId}`}>{toggle} Activity {itemInfo.label} {doenetId}</div>
}
