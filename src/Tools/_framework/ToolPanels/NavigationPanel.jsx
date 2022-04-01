/**
 * External dependencies
 */
import React, { useState, Suspense, useEffect, useLayoutEffect } from 'react';
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
/**
 * Internal dependencies
 */
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import Drive, {
  selectedDriveAtom,
  selectedDriveItems,
  itemType,
  clearDriveAndItemSelections,
  folderDictionary,
} from '../../../_reactComponents/Drive/NewDrive';
import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';
import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb/BreadcrumbProvider';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { suppressMenusAtom } from '../NewToolRoot';
import styled, { keyframes } from 'styled-components';

const movingGradient = keyframes `
  0% { background-position: -250px 0; }
  100% { background-position: 250px 0; }
`;

const Table = styled.table `
  width: 850px;
  border-radius: 5px;
`;
const Tr = styled.tr `
  border-bottom: 2px solid black;
`;
const Td = styled.td `
  height: 40px;
  vertical-align: middle;
  padding: 8px;

  &.Td2 {
    width: 50px;
  }

  &.Td3 {
    width: 400px;
  }

`;
const TBody = styled.tbody ``;
// const TdSpan = styled.span `
//   display: block;
// `;
const Td2Span = styled.span `
  background-color: rgba(0,0,0,.15);
  width: 70px;
  height: 16px;
  border-radius: 5px;
`;
const Td3Span = styled.span `
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

export default function NavigationPanel() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const [columnTypes, setColumnTypes] = useState([]);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);

  useEffect(() => {
    setMainPanelClear((was) => [
      ...was,
      { atom: clearDriveAndItemSelections, value: null },
      { atom: selectedMenuPanelAtom, value: null },
    ]);
    return setMainPanelClear((was) =>
      was.filter(
        (obj) =>
          obj.atom !== clearDriveAndItemSelections ||
          obj.atom !== selectedMenuPanelAtom,
      ),
    );
  }, [setMainPanelClear]);

  useLayoutEffect(() => {
    switch (effectiveRole) {
      case 'instructor':
        setColumnTypes(['Released', 'Assigned', 'Public']);
        setSuppressMenus([])
        break;
      case 'student':
        setColumnTypes(['Due Date']);
        setSuppressMenus(["AddDriveItems"])
        break;
      default:
    }
  }, [effectiveRole,setSuppressMenus]);

  const clickCallback = useRecoilCallback(
    ({ set }) =>
      (info) => {
        switch (info.instructionType) {
          case 'one item':
            set(selectedMenuPanelAtom, `Selected${info.type}`);
            break;
          case 'range to item':
          case 'add item':
            set(selectedMenuPanelAtom, `SelectedMulti`);
            break;
          case 'clear all':
            set(selectedMenuPanelAtom, null);
            break;
          default:
            throw new Error('NavigationPanel found invalid select instruction');
        }
        set(
          selectedDriveItems({
            driveId: info.driveId,
            driveInstanceId: info.driveInstanceId,
            itemId: info.itemId,
          }),
          {
            instructionType: info.instructionType,
            parentFolderId: info.parentFolderId,
          },
        );
        set(selectedDriveAtom, info.driveId);
      },
    [],
  );

  const doubleClickCallback = useRecoilCallback(
    ({ set }) =>
      (info) => {
        switch (info.type) {
          case itemType.FOLDER:
            set(clearDriveAndItemSelections, null);
            setPageToolView((was) => ({
              ...was,
              params: {
                path: `${info.driveId}:${info.parentFolderId}:${info.parentFolderId}:Folder`,
              },
            }));
            break;
          case itemType.DOENETML:
            if (effectiveRole === 'student') {
              //TODO: VariantIndex params
              setPageToolView({
                page: 'course',
                tool: 'assignment',
                view: '',
                params: {
                  doenetId: info.item.doenetId,
                },
              });
            } else if (effectiveRole === 'instructor') {
              setPageToolView({
                page: 'course',
                tool: 'editor',
                view: '',
                params: {
                  doenetId: info.item.doenetId,
                  path: `${info.driveId}:${info.item.parentFolderId}:${info.item.itemId}:DoenetML`,
                },
              });
            }

            break;
          case itemType.COLLECTION:
            if (effectiveRole === 'student') {
              setPageToolView({
                page: 'course',
                tool: 'assignment',
                view: '',
                params: {
                  doenetId: info.item.doenetId,
                  isCollection: true,
                },
              });
            } else if (effectiveRole === 'instructor') {
              setPageToolView({
                page: 'course',
                tool: 'collection',
                view: '',
                params: {
                  doenetId: info.item.doenetId,
                  path: `${info.driveId}:${info.item.itemId}:${info.item.itemId}:Collection`,
                },
              });
            }
            break;
          default:
            throw new Error(
              'NavigationPanel doubleClick info type not defined',
            );
        }
      },
    [setPageToolView, effectiveRole],
  );

  const filterCallback = useRecoilCallback(
    ({ snapshot }) =>
      (item) => {
        switch (effectiveRole) {
          case 'student':
            if (item.itemType === itemType.FOLDER) {
              const folderContents = snapshot
                .getLoadable(
                  folderDictionary({
                    driveId: item.driveId,
                    folderId: item.itemId,
                  }),
                )
                .getValue()['contentsDictionary'];
              for (const key in folderContents) {
                if (folderContents[key].isReleased === '1') {
                  return true;
                }
              }
              return false;
            } else {
              console.log('whats up', item.itemType, 'i', item);
              return item.isReleased === '1';
            }
          case 'instructor':
            return true;
          default:
            console.warn('No view selected');
        }
      },
    [effectiveRole],
  );

  return (
    <BreadcrumbProvider>
      <DropTargetsProvider>
        <Suspense fallback={
          <Table>
            <TBody>
              <Tr>
                <Td className='Td2'>
                  <Td2Span></Td2Span>
                </Td>
                <Td className='Td3'>
                  <Td3Span></Td3Span>
                </Td>
              </Tr>
            </TBody>
         </Table>
        //  <div>TESTING!!!!!!!</div>
        }>
          <Container>
            <Drive
              path={path}
              filterCallback={filterCallback}
              columnTypes={columnTypes}
              urlClickBehavior="select"
              clickCallback={clickCallback}
              doubleClickCallback={doubleClickCallback}
              isViewOnly={effectiveRole === 'student'} //TODO: Update for better compatabilty with roles/views
            />
          </Container>
        </Suspense>
      </DropTargetsProvider>
    </BreadcrumbProvider>
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
