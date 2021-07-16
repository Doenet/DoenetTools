/**
 * External dependencies
 */
import React, { Suspense, useCallback, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
/**
 * Internal dependencies
 */
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import Drive from '../../../_reactComponents/Drive/NewDrive';
import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';
import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb';
import { useToast, toastType } from '../Toast';

export default function NavigationPanel() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const toast = useToast();

  useEffect(() => {
    if (path === '') {
      toast('Missing drive path data, please select a course', toastType.ERROR);
      setPageToolView({ page: 'course', tool: 'courseChooser', view: '' });
    }
  }, [path, toast, setPageToolView]);

  const filter = useCallback((item) => item.released === '1', []);

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
            params: { doenetId: info.item.doenetId },
          });
          break;
        default:
          throw new Error('DrivePanel doubleClick info type not defined');
      }
    },
    [setPageToolView],
  );

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
