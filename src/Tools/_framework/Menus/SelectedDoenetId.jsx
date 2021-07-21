import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import {
  selector,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import {
  folderDictionaryFilterSelector,
  globalSelectedNodesAtom,
} from '../../../_reactComponents/Drive/NewDrive';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import useSockets from '../../../_reactComponents/Sockets';

export default function SelectedDoenetId() {
  const infoLoad = useRecoilValueLoadable(selectedInformation);
  const { numItems, itemInfo } = infoLoad.getValue();
  const { deleteItem, renameItem } = useSockets('drive');

  const setFolder = useSetRecoilState(
    folderDictionaryFilterSelector({
      driveId: itemInfo.driveId,
      folderId: itemInfo.parentFolderId,
    }),
  );

  const [label, setLabel] = useState(itemInfo.label);

  useEffect(() => {
    setLabel(itemInfo?.label);
  }, [setLabel, itemInfo?.label]);
  console.log(itemInfo, label);

  let dIcon = <FontAwesomeIcon icon={faCode} />;

  const renameItemCallback = (newLabel) => {
    renameItem({
      driveIdFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
      },
      itemId: itemInfo.itemId,
      itemType: itemInfo.itemType,
      newLabel: newLabel,
    });
  };

  return (
    <>
      <h2 data-cy="infoPanelItemLabel">
        {dIcon} {itemInfo.label}
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
              if (itemInfo.label !== label) {
                renameItemCallback(label);
              }
            }
          }}
          onBlur={() => {
            //Only rename if label has changed
            if (itemInfo.label !== label) {
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
          //TODO: toolview?
        }}
      />
      <br />
      <br />
      <Button
        data-cy="deleteDoenetMLButton"
        value="Delete DoenetML"
        onClick={() => {
          deleteItem({
            driveIdFolderId: {
              driveId: itemInfo.driveId,
              folderId: itemInfo.parentFolderId,
            },
            itemId: itemInfo.itemId,
            driveInstanceId: itemInfo.driveInstanceId,
            label: itemInfo.label,
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
      return { number: globalSelected.length, itemObjs: globalSelected };
    }
    //Find information if only one item selected
    const driveId = globalSelected[0].driveId;
    const folderId = globalSelected[0].parentFolderId;
    const driveInstanceId = globalSelected[0].driveInstanceId;
    // let folderInfo = get(folderDictionary({driveId,folderId}));
    let folderInfo = get(folderDictionaryFilterSelector({ driveId, folderId }));

    const itemId = globalSelected[0].itemId;
    let itemInfo = { ...folderInfo.contentsDictionary[itemId] };
    itemInfo['driveId'] = driveId;
    itemInfo['driveInstanceId'] = driveInstanceId;

    return { number: globalSelected.length, itemInfo };
  },
});
