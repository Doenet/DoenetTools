/**
 * External dependencies
 */
import React, { Suspense, useLayoutEffect } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
// import styled, { keyframes } from 'styled-components';
/**
 * Internal dependencies
 */
// import { useToast, toastType } from '../Toast';
// import { suppressMenusAtom } from '../NewToolRoot';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
// import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import {
  itemByDoenetId,
} from '../../../_reactComponents/Course/CourseActions';



export default function AttemptsByPersonPanel() {
  
  // const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  // const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  // const { canEditContent } = useRecoilValue(
  //   effectivePermissionsByCourseId(courseId),
  // );
  // const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  // const addToast = useToast();

  // useLayoutEffect(() => {
  //   setSuppressMenus(
  //     canEditContent == '1' ? [] : ['AddDriveItems', 'CutCopyPasteMenu'],
  //   );
  // }, [canEditContent, setSuppressMenus]);

  const updateSelectMenu = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ singleItem }) => {

        console.log(`singleItem doenetId:${singleItem?.doenetId}`,singleItem)
        if (singleItem !== null) {
          set(selectedMenuPanelAtom,"SelectedActivity");
        } else {
          set(selectedMenuPanelAtom, null);
        }
      },
  );

  return (
    <Suspense
      fallback={
      <p>Loading...</p>
      }
    >
      <h1 style={{fontSize:'14pt'}}>Attempts By Person</h1>
      <table style={{width:'850px'}}>
        <th>
          <th style={{width:'200px'}}>Name</th>
          <th style={{width:'200px'}}>Email</th>
          <th style={{width:'100px'}}>Attempts Allowed</th>
          <th style={{width:'100px'}}>Attempts Taken</th>
          <th style={{width:'100px'}}>Completed</th>
          <th style={{width:'150px'}}>Last Attempt</th>
        </th>
      </table>
    </Suspense>
  );
}

