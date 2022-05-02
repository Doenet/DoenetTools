/**
 * External dependencies
 */
import React, { useState, Suspense, useEffect, useLayoutEffect } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
/**
 * Internal dependencies
 */
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';


import CourseNavigator from '../../../_reactComponents/Course/CourseNavigator';

import styled, { keyframes } from 'styled-components';
import { authorItemByDoenetId, findFirstPageOfActivity } from '../../../_reactComponents/Course/CourseActions';
import { useToast, toastType } from '../Toast';

const movingGradient = keyframes `
  0% { background-position: -250px 0; }
  100% { background-position: 250px 0; }
`;

const Table = styled.table `
  width: 850px;
  border-radius: 5px;
  margin-top: 50px;
  margin-left: 20px;
`;
const Tr = styled.tr ``;
const Td = styled.td `
  height: 40px;
  vertical-align: middle;
  padding: 8px;
  /* border-bottom: 2px solid black; */

  &.Td2 {
    width: 50px;
  }

  &.Td3 {
    width: 400px;
  }

`;
const TBody = styled.tbody ``;
const Td2Span = styled.span `
  display: block; 
  background-color: rgba(0,0,0,.15);
  width: 70px;
  height: 16px;
  border-radius: 5px;
`;
const Td3Span = styled.span `
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(to right, #eee 20%, #ddd 50%, #eee 80%);
  background-size: 500px 100px;
  animation-name: ${movingGradient};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;

export default function DataPanel() {
  const addToast = useToast();


  const updateSelectMenu = useRecoilCallback(
    ({set,snapshot}) =>
      async ({ selectedItems }) => {
        console.log("data updateSelectMenu selectedItems",selectedItems)

  });

  const doubleClickItem = useRecoilCallback(
    ({set,snapshot}) =>
      async ({ doenetId, courseId }) => {
        // console.log("data doubleClickItem ",{ doenetId, courseId })
        let clickedItem = await snapshot.getPromise(authorItemByDoenetId(doenetId));
        if (clickedItem.type == 'page'){
          console.log("Open data for Page",clickedItem,{courseId})
        }else if (clickedItem.type == 'activity'){
          //Find first page
          let pageDoenetId = findFirstPageOfActivity(clickedItem.order);
          if (pageDoenetId == null){
            addToast(`ERROR: No page found in activity`, toastType.INFO);
          }else{
          console.log("Open data for Activity",clickedItem,{courseId})
          }
        }else if (clickedItem.type == 'section'){
          set(pageToolViewAtom,(prev)=>{return {
            page: 'course',
            tool: 'data',
            view: prev.view,
            params: { sectionId: clickedItem.doenetId, courseId},
          }})
        }
  });


  return <Suspense fallback={
    <Table>
      <TBody>
        <Tr>
          <Td className="Td2">
            <Td2Span></Td2Span>
          </Td>
          <Td className="Td3">
            <Td3Span></Td3Span>
          </Td>
        </Tr>
        <Tr>
          <Td className="Td2">
            <Td2Span></Td2Span>
          </Td>
          <Td className="Td3">
            <Td3Span></Td3Span>
          </Td>
        </Tr>
        <Tr>
          <Td className="Td2">
            <Td2Span></Td2Span>
          </Td>
          <Td className="Td3">
            <Td3Span></Td3Span>
          </Td>
        </Tr>
      </TBody>
    </Table>
  }>
    <Container>
      <CourseNavigator
        updateSelectMenu={updateSelectMenu}
        doubleClickItem={doubleClickItem}
      />
    </Container>
  </Suspense>
}

function Container(props) {
  return (
    <div
      style={{
        maxWidth: '850px',
        margin: '10px 20px',
        // border: "1px red solid",
      }}
    >
      {props.children}
    </div>
  );
}
