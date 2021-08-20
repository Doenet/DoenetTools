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

export default function NavigationPanel() {
  const [{ view }, setPageToolView] = useRecoilState(pageToolViewAtom);
  const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const [columnTypes, setColumnTypes] = useState([]);

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
    switch (view) {
      case 'instructor':
        setColumnTypes(['Released', 'Assigned', 'Public']);
        break;
      case 'student':
        setColumnTypes(['Due Date']);
        break;
      default:
    }
  }, [view]);

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
            if (view === 'student') {
              //TODO: VariantIndex params
              setPageToolView({
                page: 'course',
                tool: 'assignment',
                view: '',
                params: {
                  doenetId: info.item.doenetId,
                },
              });
            } else if (view === 'instructor') {
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
            setPageToolView({
              page: 'course',
              tool: 'collection',
              view: '',
              params: {
                doenetId: info.item.doenetId,
                path: `${info.driveId}:${info.item.itemId}:${info.item.itemId}:Collection`,
              },
            });
            break;
          default:
            throw new Error(
              'NavigationPanel doubleClick info type not defined',
            );
        }
      },
    [setPageToolView, view],
  );

  const filterCallback = useRecoilCallback(
    ({ snapshot }) =>
      (item) => {
        switch (view) {
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
              return item.isReleased === '1';
            }
          case 'instructor':
            return true;
          default:
            console.warn('No view selected');
        }
      },
    [view],
  );

  return (
    <BreadcrumbProvider>
      <DropTargetsProvider>
        <Suspense fallback={<div>loading Drive...</div>}>
          <Container>
            <Drive
              path={path}
              filterCallback={filterCallback}
              columnTypes={columnTypes}
              urlClickBehavior="select"
              clickCallback={clickCallback}
              doubleClickCallback={doubleClickCallback}
              isViewOnly={view === 'student'} //TODO: Update for better compatabilty with roles/views
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
