import {
  faCode,
  faFolder,
  faObjectGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { selector, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import {
  folderDictionaryFilterSelector,
  globalSelectedNodesAtom,
} from '../../../_reactComponents/Drive/NewDrive';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import useSockets from '../../../_reactComponents/Sockets';
import { pageToolViewAtom } from '../NewToolRoot';
import { selectedInformation } from './SelectedDoenetML';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';


export default function SelectedCollection() {
  const selection =
    useRecoilValueLoadable(selectedInformation).getValue() ?? [];
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [label, setLabel] = useState(selection[0]?.label ?? '');
  const { deleteItem, renameItem } = useSockets('drive');
  const item = selection[0];
  const dIcon = <FontAwesomeIcon icon={faFolder} />;

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
      <ButtonGroup>
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
      {/* <br /> */}
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
      </ButtonGroup>
      
    </>
  );
}
