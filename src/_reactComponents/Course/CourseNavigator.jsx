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

import { allCourseItemsByCourseId, authorCourseItemOrderByCourseId, coursePermissionsAndSettingsByCourseId } from '../../_reactComponents/Course/CourseActions';

/**
 * Internal dependencies
 */
import '../../_utils/util.css';
import { searchParamAtomFamily } from '../../Tools/_framework/NewToolRoot';

export default function CourseNavigator(props) {
  console.log("=== CourseNavigator")
  const [courseId] = useRecoilValue(searchParamAtomFamily('path')).split(':');
  let coursePermissionsAndSettings = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));

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
  for (let doenetId of authorItemOrder){
    items.push(<Item key={`itemcomponent${doenetId}`} doenetId={doenetId} />)
  }
  return <>{items}</>
}

function Item({doenetId}){
  return <p>{doenetId}</p>
  // let data = useRecoilValue(itemInfoByDoenetId(doenetId))
  // console.log("itemInfo",data)
  // if (data.type == 'Section'){
  //   return <Section key={`Item${doenetId}`} doenetId={doenetId} itemInfo={data} />
  // }
  // return <div key={`Item${doenetId}`}>{data.type} {data.label} {doenetId}</div>
}

function Section({doenetId,itemInfo}){

  let toggle = <button>is closed</button>
  if (itemInfo.isOpen){
    <button>is open</button>
  }
  return <div key={`Section${doenetId}`}>{toggle} Section {itemInfo.label} {doenetId}</div>
}
