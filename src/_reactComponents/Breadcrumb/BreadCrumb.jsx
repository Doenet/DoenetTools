import React, { useCallback } from 'react';
import { faTh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  folderDictionary,
  fetchDrivesQuery,
  clearDriveAndItemSelections,
} from '../Drive/NewDrive';
import {
  useRecoilValue,
  atomFamily,
  selectorFamily,
  useSetRecoilState,
} from 'recoil';
import { pageToolViewAtom } from '../../Tools/_framework/NewToolRoot';

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

export default function BreadCrumb({ path }) {
  const [driveId, parentFolderId] = path.split(':');
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);

  //TODO reivew for multi drive
  const items = useRecoilValue(
    breadcrumbItemAtomFamily({
      driveId: driveId,
      folderId: parentFolderId,
    }),
  );

  const goToFolder = useCallback(
    (driveId, folderId) => {
      clearSelections();
      setPageToolView((was) => ({
        ...was,
        params: {
          path: `${driveId}:${folderId}:${folderId}:Folder`,
        },
      }));
    },
    [setPageToolView, clearSelections],
  );

  //Don't show up if not in a drive
  if (driveId === '') {
    return null;
  }

  const returnToCourseChooser = (
    <span
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setPageToolView({ page: 'course', tool: 'courseChooser', view: '' });
        }
      }}
      onClick={() => {
        setPageToolView({ page: 'course', tool: 'courseChooser', view: '' });
      }}
    >
      <FontAwesomeIcon icon={faTh} />
    </span>
  );

  const children = [...items].reverse().map((item) => (
    <span
      role="button"
      tabIndex="0"
      key={item.folderId}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          goToFolder(driveId, item.folderId);
        }
      }}
      onClick={() => {
        goToFolder(driveId, item.folderId);
      }}
    >
      {item.label} /{' '}
    </span>
  ));

  return (
    <>
      {returnToCourseChooser} {children}
    </>
  );
}
