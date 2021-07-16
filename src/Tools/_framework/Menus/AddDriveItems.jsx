import React from 'react';
import { useRecoilValue } from 'recoil';
import { useToast } from '@Toast';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import useSockets, { itemType } from '../../../_reactComponents/Sockets';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function AddDriveItems(props) {
  const [toast, toastType] = useToast();
  const [driveId, parentFolderId] = useRecoilValue(
    searchParamAtomFamily('path'),
  ).split(':');
  const { addItem } = useSockets('drive');
  return (
    <div style={props.style}>
      <div>
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
      </div>
      <div>
        <Button
          width="menu"
          onClick={() => toast('Stub Add Assignment!', toastType.SUCCESS)}
          value="Add Assignment"
        >
          Add Assignment
        </Button>
      </div>
      <div>
        {' '}
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
      </div>
    </div>
  );
}
