import {
  faCode,
  faFolder,
  faObjectGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState,useEffect } from 'react';
import { selector, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import {
  folderDictionaryFilterSelector,
  globalSelectedNodesAtom,
} from '../../../_reactComponents/Drive/NewDrive';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import useSockets from '../../../_reactComponents/Sockets';
import { pageToolViewAtom } from '../NewToolRoot';

export default function SelectedDoenetML() {
  const selection =
    useRecoilValueLoadable(selectedInformation).getValue() ?? [];
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [label, setLabel] = useState(selection[0]?.label ?? '');
  const { deleteItem, renameItem } = useSockets('drive');
  const item = selection[0];
  const dIcon = <FontAwesomeIcon icon={faCode} />;
  useEffect(() => {
    setLabel(selection[0]?.label);
  }, [selection]);
  const renameItemCallback = (newLabel) => {
    renameItem({
      driveIdFolderId: {
        driveId: item.driveId,
        folderId: item.parentFolderId,
      },
      itemId: item.itemId,
      itemType: item.itemType,
      newLabel: newLabel,
    });
  };
  return (
    <>
      <h2 data-cy="infoPanelItemLabel">
        {dIcon} {item.label}
      </h2>

      <label>
        DoenetML Label
        <input
          type="text"
          data-cy="infoPanelItemLabelInput"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              //Only rename if label has changed
              if (item.label !== label) {
                renameItemCallback(label);
              }
            }
          }}
          onBlur={() => {
            //Only rename if label has changed
            if (item.label !== label) {
              renameItemCallback(label);
            }
          }}
        />
      </label>
      <br />
      <br />
      <Button
        value="Edit DoenetML"
        onClick={() => {
          setPageToolView({
            page: 'course',
            tool: 'editor',
            view: '',
            params: {
              doenetId: item.doenetId,
              path: `${item.driveId}:${item.parentFolderId}:${item.itemId}:DoenetML`,
            },
          });
        }}
      />
      <br />
      <Button
        data-cy="deleteDoenetMLButton"
        value="Delete DoenetML"
        onClick={() => {
          deleteItem({
            driveIdFolderId: {
              driveId: item.driveId,
              folderId: item.parentFolderId,
            },
            itemId: item.itemId,
            driveInstanceId: item.driveInstanceId,
            label: item.label,
          });
        }}
      />
    </>
  );
}

export const selectedInformation = selector({
  key: 'selectedInformation',
  get: ({ get }) => {
    const globalSelected = get(globalSelectedNodesAtom);
    if (globalSelected.length !== 1) {
      return globalSelected;
    }
    //Find information if only one item selected
    const driveId = globalSelected[0].driveId;
    const folderId = globalSelected[0].parentFolderId;
    const driveInstanceId = globalSelected[0].driveInstanceId;
    // let folderInfo = get(folderDictionary({driveId,folderId}));
    let folderInfo = get(folderDictionaryFilterSelector({ driveId, folderId }));
    const itemId = globalSelected[0].itemId;
    let itemInfo = {
      ...(folderInfo.contentsDictionary[itemId] ?? {
        ...folderInfo.folderInfo,
      }),
    };
    itemInfo['driveId'] = driveId;
    itemInfo['driveInstanceId'] = driveInstanceId;

    return [itemInfo];
  },
});
