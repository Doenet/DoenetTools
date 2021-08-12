/**
 * External dependencies
 */
import React, { Suspense, useCallback, useEffect } from 'react';
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
} from '../../../_reactComponents/Drive/NewDrive';
import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';
import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
// import { useToast, toastType } from '../Toast';

export default function NavigationPanel(props) {
  const [{ view }, setPageToolView] = useRecoilState(pageToolViewAtom);
  const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  const path = useRecoilValue(searchParamAtomFamily('path'));
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

  // const toast = useToast();

  // useEffect(() => {
  //   if (path === '') {
  //     toast('Missing drive path data, please select a course', toastType.ERROR);
  //     setPageToolView({ page: 'course', tool: 'courseChooser', view: '' });
  //   }
  // }, [path, toast, setPageToolView]);

  const filter = useCallback((item) => item.released === '1', []);

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

  const doubleClickCallback = useCallback(
    (info) => {
      switch (info.type) {
        case itemType.FOLDER:
          setPageToolView((was) => ({
            ...was,
            params: {
              path: `${info.driveId}:${info.parentFolderId}:${info.parentFolderId}:Folder`,
            },
          }));
          break;
        case itemType.DOENETML:
          setPageToolView({
            page: 'course',
            tool: 'editor',
            view: '',
            params: {
              doenetId: info.item.doenetId,
              path: `${info.driveId}:${info.item.parentFolderId}:${info.item.itemId}:DoenetML`,
            },
          });
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
          throw new Error('NavigationPanel doubleClick info type not defined');
      }
    },
    [setPageToolView],
  );

  if (props.style?.display === 'none') {
    return <div style={props.style}></div>;
  }

  return (
    <BreadcrumbProvider>
      <DropTargetsProvider>
        <Suspense fallback={<div>loading Drive...</div>}>
          <Container>
            <Drive
              path={path}
              filter={filter}
              columnTypes={['Released', 'Public']}
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
