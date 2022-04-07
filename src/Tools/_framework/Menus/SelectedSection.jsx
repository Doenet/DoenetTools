import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRecoilValueLoadable, useSetRecoilState, useRecoilValue } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import useSockets from '../../../_reactComponents/Sockets';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { selectedInformation } from './SelectedActivity';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { useToast } from '../Toast';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';


export default function SelectedSection() {
  return <p>SelectedSection</p>
  // const effectiveRole = useRecoilValue(effectiveRoleAtom);
  // const setSelectedMenu = useSetRecoilState(selectedMenuPanelAtom);
  // const selection = useRecoilValueLoadable(selectedInformation).getValue();
  // const [item, setItem] = useState(selection[0]);
  // const [label, setLabel] = useState(selection[0]?.label ?? '');
  // const { deleteItem, renameItem } = useSockets('drive');
  // const addToast = useToast();

  // useEffect(() => {
  //   if (!selection[0]) {
  //     setSelectedMenu('');
  //   } else {
  //     setItem(selection[0]);
  //     setLabel(selection[0]?.label);
  //   }
  // }, [selection, setSelectedMenu]);

  // const dIcon = <FontAwesomeIcon icon={faFolder} />;
  // const renameItemCallback = (newLabel) => {
  //   renameItem({
  //     driveIdFolderId: {
  //       driveId: item.driveId,
  //       folderId: item.parentFolderId,
  //     },
  //     itemId: item.itemId,
  //     itemType: item.itemType,
  //     newLabel: newLabel,
  //   });
  // };

  
  // if (!item){
  //   return null;
  // }
  // let modControl = null;
  // if (effectiveRole === 'instructor'){
  //   modControl = <>
  //     <Textfield
  //       label="Folder Label"
  //       vertical
  //       width="menu"
  //       data-cy="infoPanelItemLabelInput"
  //         value={label}
  //         onChange={(e) => setLabel(e.target.value)}
  //         onKeyDown={(e) => {
  //           if (e.key === 'Enter') {
  //             let effectiveLabel = label;
  //             if (label === ''){
  //               effectiveLabel = 'Untitled';
  //               addToast("Label for the folder can't be blank.");
  //               setLabel(effectiveLabel);
  //             }
  //             //Only rename if label has changed
  //             if (item.label !== effectiveLabel) {
  //               renameItemCallback(effectiveLabel);
  //               setLabel(effectiveLabel);
  //             }
  //           }
  //         }}
  //         onBlur={() => {
  //           let effectiveLabel = label;
  //             if (label === ''){
  //               effectiveLabel = 'Untitled';
  //               addToast("Label for the folder can't be blank.");
  //             }
  //           //Only rename if label has changed
  //           if (item.label !== effectiveLabel) {
  //             renameItemCallback(effectiveLabel);
  //           }
  //         }}
  //     />
  //    {/* <label>
  //       {item.itemType} Label
  //       <input
  //         type="text"
  //         data-cy="infoPanelItemLabelInput"
  //         value={label}
  //         onChange={(e) => setLabel(e.target.value)}
  //         onKeyDown={(e) => {
  //           if (e.key === 'Enter') {
  //             let effectiveLabel = label;
  //             if (label === ''){
  //               effectiveLabel = 'Untitled';
  //               addToast("Label for the folder can't be blank.");
  //               setLabel(effectiveLabel);
  //             }
  //             //Only rename if label has changed
  //             if (item.label !== effectiveLabel) {
  //               renameItemCallback(effectiveLabel);
  //               setLabel(effectiveLabel);
  //             }
  //           }
  //         }}
  //         onBlur={() => {
  //           let effectiveLabel = label;
  //             if (label === ''){
  //               effectiveLabel = 'Untitled';
  //               addToast("Label for the folder can't be blank.");
  //             }
  //           //Only rename if label has changed
  //           if (item.label !== effectiveLabel) {
  //             renameItemCallback(effectiveLabel);
  //           }
  //         }}
  //       />
  //     </label> */}
  //     <br />
  //     <ButtonGroup vertical>
  //       <Button
  //         alert
  //         width="menu"
  //         data-cy="deleteDoenetMLButton"
  //         value="Delete Folder"
  //         onClick={() => {
  //           deleteItem({
  //             driveIdFolderId: {
  //               driveId: item.driveId,
  //               folderId: item.parentFolderId,
  //             },
  //             itemId: item.itemId,
  //             driveInstanceId: item.driveInstanceId,
  //             label: item.label,
  //           });
  //         }}
  //       />
  //     </ButtonGroup>
  //   </>
  // }
  // return (
  //   <>
  //     <h2 data-cy="infoPanelItemLabel">
  //       {dIcon} {item.label}
  //     </h2>
  //     {modControl}
  //   </>
  // );
}
