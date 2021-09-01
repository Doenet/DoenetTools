import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import useSockets from '../../../_reactComponents/Sockets';
import { pageToolViewAtom } from '../NewToolRoot';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { selectedInformation } from './SelectedDoenetML';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';

export default function SelectedCollection() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const setSelectedMenu = useSetRecoilState(selectedMenuPanelAtom);
  const selection = useRecoilValueLoadable(selectedInformation).getValue();
  const [item, setItem] = useState(selection[0]);
  const [label, setLabel] = useState(selection[0]?.label ?? '');
  const { deleteItem, renameItem } = useSockets('drive');
  useEffect(() => {
    setLabel(item.label);
  }, [item.label]);
  useEffect(() => {
    if (!selection[0]) {
      setSelectedMenu('');
    } else {
      setItem(selection[0]);
      setLabel(selection[0]?.label);
    }
  }, [selection, setSelectedMenu]);

  const dIcon = <FontAwesomeIcon icon={faLayerGroup} />;

  const renameItemCallback = (newLabel) => {
    renameItem({
      driveIdFolderId: {
        driveId: item.driveId,
        folderId: item.itemId,
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
        Collection Label
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
      <ButtonGroup vertical>
        <Button
          value="Edit Collection"
          width="menu"
          onClick={() => {
            setPageToolView({
              page: 'course',
              tool: 'editor',
              view: '',
              params: {
                doenetId: item.doenetId,
                path: `${item.driveId}:${item.parentFolderId}:${item.itemId}:Collection`,
              },
            });
          }}
        />
        <Button
          alert
          width="menu"
          data-cy="deleteDoenetMLButton"
          value="Delete Collection"
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
