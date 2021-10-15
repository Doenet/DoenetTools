// import { ButtonGroup } from '@blueprintjs/core';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import useSockets, { itemType } from '../../../_reactComponents/Sockets';
import { searchParamAtomFamily } from '../NewToolRoot';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';

export default function AddDriveItems() {
  const [driveId, parentFolderId] = useRecoilValue(
    searchParamAtomFamily('path'),
  ).split(':');
  const { addItem } = useSockets('drive');
  return (
    <ButtonGroup vertical>
      <Button
        width="menu"
        onClick={() =>
          addItem({
            driveIdFolderId: { driveId, folderId: parentFolderId },
            type: itemType.DOENETML,
          })
        }
        value="Add DoenetML"
      >
        Add DoenetML
      </Button>
      <Button
        width="menu"
        onClick={() =>
          addItem({
            driveIdFolderId: { driveId, folderId: parentFolderId },
            type: itemType.COLLECTION,
          })
        }
        value="Add Collection"
      />
      <Button
        width="menu"
        onClick={() =>
          addItem({
            driveIdFolderId: { driveId, folderId: parentFolderId },
            type: itemType.FOLDER,
          })
        }
        value="Add Folder"
      >
        Add Folder
      </Button>
      
    </ButtonGroup>
    
  );
}
