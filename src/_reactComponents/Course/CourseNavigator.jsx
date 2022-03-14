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

// import { itemInfoByDoenetId, courseOrderDataByCourseId } from '../../_reactComponents/Course/CourseActions';

/**
 * Internal dependencies
 */
import '../../_utils/util.css';

export default function CourseNavigator(props) {
  console.log("=== CourseNavigator")

  // const { completeOrder, orderingDataLookup} = useRecoilValue(
  //   courseOrderDataByCourseId(courseId),
  // );
  // console.log(`courseId Course ${courseId} items`,completeOrder)
  // const addToast = useToast();
  // let items = [];
  // for (let doenetId of completeOrder){
  //   items.push(<Item key={`itemcomponent${doenetId}`} doenetId={doenetId} />)
  // }

  // return <>
  // <div key={`CourseComponent${courseId}`}>Course</div>
  // {items}
  // </>;
  return <p>test</p>;
}

// function Item({doenetId}){
//   let data = useRecoilValue(itemInfoByDoenetId(doenetId))
//   console.log("itemInfo",data)
//   if (data.type == 'Section'){
//     return <Section key={`Item${doenetId}`} doenetId={doenetId} itemInfo={data} />
//   }
//   return <div key={`Item${doenetId}`}>{data.type} {data.label} {doenetId}</div>
// }

// function Section({doenetId,itemInfo}){

//   let toggle = <button>is closed</button>
//   if (itemInfo.isOpen){
//     <button>is open</button>
//   }
//   return <div key={`Item${doenetId}`}>{toggle} Section {itemInfo.label} {doenetId}</div>
// }
