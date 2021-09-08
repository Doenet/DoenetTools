import { faCode, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  useRecoilState,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import useSockets from '../../../_reactComponents/Sockets';
import { pageToolViewAtom } from '../NewToolRoot';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { AssignmentSettings, selectedInformation } from './SelectedDoenetML';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';

export default function SelectedCollection() {
  const [{ view }, setPageToolView] = useRecoilState(pageToolViewAtom);
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
  if (view === 'student') {
    return (
      <>
        <h2 data-cy="infoPanelItemLabel">
          <FontAwesomeIcon icon={faCode} /> {item?.label}
        </h2>
        <ActionButton
          width="menu"
          value="Take Assignment"
          onClick={() => {
            setPageToolView({
              page: 'course',
              tool: 'assignment',
              view: '',
              params: {
                doenetId: item?.doenetId,
              },
            });
          }}
        />
        <AssignmentSettings role={view} doenetId={item.doenetId} />
      </>
    );
  }
  return (
    <>
      <h2 data-cy="infoPanelItemLabel">
        <FontAwesomeIcon icon={faLayerGroup} /> {item?.label}
      </h2>
      <ActionButtonGroup vertical>
        <ActionButton
          value="Edit Collection"
          width="menu"
          onClick={() => {
            setPageToolView({
              page: 'course',
              tool: 'collection',
              view: '',
              params: {
                doenetId: item.doenetId,
                path: `${item.driveId}:${item.parentFolderId}:${item.itemId}:Collection`,
              },
            });
          }}
        />
      </ActionButtonGroup>
      <br />
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
      <AssignmentSettings role={view} doenetId={item.doenetId} />
      <br />
      <ButtonGroup vertical>
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
