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
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
// import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { suppressMenusAtom } from '../NewToolRoot';
import styled, { keyframes } from 'styled-components';
import { itemByDoenetId, findFirstPageOfActivity, selectedCourseItems } from '../../../_reactComponents/Course/CourseActions';
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
  /* border-bottom: 2px solid var(--canvastext); */

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
  //background-color: var(--canvastext);
  width: 70px;
  height: 16px;
  border-radius: 5px;
`;
const Td3Span = styled.span `
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(to right, var(--mainGray) 20%, var(--mainGray) 50%, var(--mainGray) 80%);
  background-size: 500px 100px;
  animation-name: ${movingGradient};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;

export default function NavigationPanel() {
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const addToast = useToast();


  useLayoutEffect(() => {
    switch (effectiveRole) {
      case 'instructor':
        // setColumnTypes(['Released', 'Assigned', 'Public']);
        setSuppressMenus([]);
        break;
      case 'student':
        // setColumnTypes(['Due Date']);
        setSuppressMenus(['AddDriveItems','CutCopyPasteMenu']);
        break;
      default:
    }
  }, [effectiveRole, setSuppressMenus]);

  
  const updateSelectMenu = useRecoilCallback(
    ({set,snapshot}) =>
      async ({ selectedItems }) => {
        if (selectedItems.length == 1){
          let selectedDoenetId = selectedItems[0];
          let selectedItem = await snapshot.getPromise(itemByDoenetId(selectedDoenetId));
          if (selectedItem.type == "activity"){
            set(selectedMenuPanelAtom,"SelectedActivity");
          }else if (selectedItem.type == "order"){
            set(selectedMenuPanelAtom,"SelectedOrder");
          }else if (selectedItem.type == "page"){
            set(selectedMenuPanelAtom,"SelectedPage");
          }else if (selectedItem.type == "section"){
            set(selectedMenuPanelAtom,"SelectedSection");
          }else if (selectedItem.type == "bank"){
            set(selectedMenuPanelAtom,"SelectedBank");
          }else{
            set(selectedMenuPanelAtom,null);
          }
        }else{
          set(selectedMenuPanelAtom,null);
        }
  });

  const doubleClickItem = useRecoilCallback(
    ({set,snapshot}) =>
      async ({ doenetId, courseId }) => {
        let clickedItem = await snapshot.getPromise(itemByDoenetId(doenetId));
        let effectiveRole = await snapshot.getPromise(effectiveRoleAtom);
    if (clickedItem.type == 'page'){
      set(pageToolViewAtom,(prev)=>{return {
        page: 'course',
        tool: 'editor',
        view: prev.view,
        params: { pageId: doenetId, doenetId: clickedItem.containingDoenetId },
        }})
    }else if (clickedItem.type == 'activity'){
      if (effectiveRole == 'student'){
        set(pageToolViewAtom,{
          page: 'course',
          tool: 'assignment',
          view: '',
          params: {
            doenetId,
          },
        })
        
      }else{
        //Find first page
        let pageDoenetId = findFirstPageOfActivity(clickedItem.content);
        if (pageDoenetId == null){
          addToast(`ERROR: No page found in activity`, toastType.INFO);
        }else{
          set(pageToolViewAtom,(prev)=>{return {
              page: 'course',
              tool: 'editor',
              view: prev.view,
              params: { doenetId, pageId:pageDoenetId },
          }})
        }
      }
    }else if (clickedItem.type == 'section'){
      set(pageToolViewAtom,(prev)=>{return {
        page: 'course',
        tool: 'navigation',
        view: prev.view,
        params: { sectionId: clickedItem.doenetId, courseId},
      }})
    }
  });

  return (

        <Suspense fallback={
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

  );
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
