import React from 'react';
import { faTh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  folderDictionary,
  fetchDrivesQuery,
} from '../../../_reactComponents/Drive/NewDrive';
import {
  useRecoilValue,
  atomFamily,
  selectorFamily,
  useSetRecoilState,
} from 'recoil';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';

const breadcrumbItemAtomFamily = atomFamily({
  key: 'breadcrumbItemAtomFamily',
  default: selectorFamily({
    key: 'breadcrumbItemAtomFamily/Default',
    get:
      ({ driveId, folderId }) =>
      ({ get }) => {
        let items = [];
        if (!driveId) {
          return items;
        }
        while (folderId) {
          let folderInfo = get(folderDictionary({ driveId, folderId }));
          if (!folderInfo.folderInfo.itemId) {
            break;
          }

          items.push({
            type: 'Folder',
            folderId: folderInfo.folderInfo.itemId,
            label: folderInfo.folderInfo.label,
          });
          folderId = folderInfo.folderInfo.parentFolderId;
        }
        const drivesInfo = get(fetchDrivesQuery);
        let driveObj = { type: 'Drive', folderId: driveId };
        for (let drive of drivesInfo.driveIdsAndLabels) {
          if (drive.driveId === driveId) {
            driveObj.label = drive.label;
            break;
          }
        }
        items.push(driveObj);
        return items;
      },
  }),
});

export default function BreadCrumb() {
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const [driveId, parentFolderId] = path.split(':');
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  const items = useRecoilValue(
    breadcrumbItemAtomFamily({
      driveId: driveId,
      folderId: parentFolderId,
    }),
  );

  //Don't show up if not in a drive
  if (driveId === '') {
    return null;
  }

  let leftmostBreadcrumb = (
    <span
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setPageToolView({ tool: 'courseChooser' });
        }
      }}
      onClick={() => {
        setPageToolView({ tool: 'courseChooser' });
      }}
    >
      <FontAwesomeIcon icon={faTh} />
    </span>
  );

  let reversed = [...items];
  reversed.reverse();

  let children = [];
  for (let item of reversed) {
    children.push(
      <span
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setPageToolView((was) => ({
              ...was,
              params: {
                path: `${driveId}:${item.folderId}:${item.folderId}:Folder`,
              },
            }));
          }
        }}
        onClick={() => {
          setPageToolView((was) => ({
            ...was,
            params: {
              path: `${driveId}:${item.folderId}:${item.folderId}:Folder`,
            },
          }));
        }}
      >
        {item.label} /{' '}
      </span>,
    );
  }

  return (
    <div style={{ margin: '10px 20px', maxWidth: '850px' }}>
      {leftmostBreadcrumb} {children}
    </div>
  );
}
