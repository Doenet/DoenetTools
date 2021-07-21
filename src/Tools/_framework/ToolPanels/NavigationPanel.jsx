/**
 * External dependencies
 */
import React, { Suspense, useCallback /* useEffect */ } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
/**
 * Internal dependencies
 */
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import Drive, {
  selectedDriveAtom,
  selectedDriveItems,
} from '../../../_reactComponents/Drive/NewDrive';
import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';
import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb';
import { useMenuPanelController } from '../Panels/MenuPanel';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
// import { useToast, toastType } from '../Toast';

export default function NavigationPanel(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const setOpenMenuPanel = useMenuPanelController();
  // const setSelected = useSetRecoilState(selectedDriveItems({driveId:props.driveId,driveInstanceId:props.driveInstanceId,itemId}));

  // const toast = useToast();

  // useEffect(() => {
  //   if (path === '') {
  //     toast('Missing drive path data, please select a course', toastType.ERROR);
  //     setPageToolView({ page: 'course', tool: 'courseChooser', view: '' });
  //   }
  // }, [path, toast, setPageToolView]);

  const filter = useCallback((item) => item.released === '1', []);

  // if (props.isNav){
  //   //Only select one item
  //   clearSelections();
  //   props?.doubleClickCallback?.({driveId:props.driveId,parentFolderId:itemId,itemId,type:"Folder"})
  // } else {
  //   if (!e.shiftKey && !e.metaKey){
  //     props?.clickCallback?.({instructionType:"one item",parentFolderId:props.parentFolderId, type:"DoenetML"})
  //     setSelected({instructionType:"one item",parentFolderId:props.parentFolderId})
  //   }else if (e.shiftKey && !e.metaKey){
  //     setSelected({instructionType:"range to item",parentFolderId:props.parentFolderId})
  //   }else if (!e.shiftKey && e.metaKey){
  //     setSelected({instructionType:"add item",parentFolderId:props.parentFolderId})
  //   }
  // }
  // setSelectedDrive(props.driveId);

  const clickCallback = useRecoilCallback(
    ({ set }) =>
      (info) => {
        switch (info.type) {
          case 'Folder':
            set(selectedMenuPanelAtom, 'SelectedDoenetId'); //TODO folder
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
            break;
          case 'DoenetML':
            set(selectedMenuPanelAtom, 'SelectedDoenetId');
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
            break;
          default:
            throw new Error('NavivationPanel click info type not defined');
        }
      },
    [],
  );

  const doubleClickCallback = useCallback(
    (info) => {
      switch (info.type) {
        case 'Folder':
          setPageToolView((was) => ({
            ...was,
            params: {
              path: `${info.driveId}:${info.parentFolderId}:${info.parentFolderId}:Folder`,
            },
          }));
          break;
        case 'DoenetML':
          setPageToolView({
            page: 'course',
            tool: 'editor',
            view: '',
            params: {
              doenetId: info.item.doenetId,
              path: `${info.driveId}:${info.item.parentFolderId}:${info.item.doenetId}:DoenetML`,
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
