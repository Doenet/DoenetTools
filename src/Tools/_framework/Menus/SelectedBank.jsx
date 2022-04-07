import { faCode, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import useSockets from '../../../_reactComponents/Sockets';
import { pageToolViewAtom } from '../NewToolRoot';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { AssignmentSettings, selectedInformation } from './SelectedActivity';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';


export default function SelectedBank() {
  return <p>SelectedBank</p>
  // const setPageToolView = useSetRecoilState(pageToolViewAtom);
  // const effectiveRole = useRecoilValue(effectiveRoleAtom);

  // const setSelectedMenu = useSetRecoilState(selectedMenuPanelAtom);
  // const selection = useRecoilValueLoadable(selectedInformation).getValue();
  // const [item, setItem] = useState(selection[0]);
  // const [label, setLabel] = useState(item?.label ?? '');
  // const { deleteItem, renameItem } = useSockets('drive');
  // useEffect(() => {
  //   if (selection[0]) {
  //     setLabel(selection[0]?.label);
  //     setItem(selection[0]);
  //   } else {
  //     setSelectedMenu('');
  //   }
  // }, [selection, setSelectedMenu]);

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
  // if (effectiveRole === 'student') {
  //   return (
  //     <>
  //       <h2 data-cy="infoPanelItemLabel">
  //         <FontAwesomeIcon icon={faCode} /> {item.label}
  //       </h2>
  //       <ActionButton
  //         width="menu"
  //         value="Take Assignment"
  //         onClick={() => {
  //           setPageToolView({
  //             page: 'course',
  //             tool: 'assignment',
  //             view: '',
  //             params: {
  //               doenetId: item?.doenetId,
  //             },
  //           });
  //         }}
  //       />
  //       <AssignmentSettings role={effectiveRole} doenetId={item.doenetId} />
  //     </>
  //   );
  // }
  // return (
  //   <>
  //     <h2 data-cy="infoPanelItemLabel">
  //       <FontAwesomeIcon icon={faLayerGroup} /> {item.label}
  //     </h2>
  //     <ActionButtonGroup vertical>
  //       <ActionButton
  //         value="Edit Collection"
  //         width="menu"
  //         onClick={() => {
  //           setPageToolView({
  //             page: 'course',
  //             tool: 'collection',
  //             view: '',
  //             params: {
  //               doenetId: item.doenetId,
  //               path: `${item.driveId}:${item.parentFolderId}:${item.itemId}:Collection`,
  //             },
  //           });
  //         }}
  //       />
  //     </ActionButtonGroup>
      
  //     <Textfield 
  //         label="Collection Label" 
  //         width="menu" 
  //         vertical 
  //         data-cy="infoPanelItemLabelInput" 
  //         value={label}
  //         onChange={(e) => setLabel(e.target.value)}
  //         onKeyDown={(e) => {
  //           if (e.key === 'Enter') {
  //             //Only rename if label has changed
  //             if (item.label !== label) {
  //               renameItemCallback(label);
  //             }
  //           }
  //         }}
  //         onBlur={() => {
  //           //Only rename if label has changed
  //           if (item.label !== label) {
  //             renameItemCallback(label);
  //           }
  //         }}/>
  //     {/* <label>
  //       Collection Label
  //       <input
  //         type="text"
  //         data-cy="infoPanelItemLabelInput"
  //         value={label}
  //         onChange={(e) => setLabel(e.target.value)}
  //         onKeyDown={(e) => {
  //           if (e.key === 'Enter') {
  //             //Only rename if label has changed
  //             if (item.label !== label) {
  //               renameItemCallback(label);
  //             }
  //           }
  //         }}
  //         onBlur={() => {
  //           //Only rename if label has changed
  //           if (item.label !== label) {
  //             renameItemCallback(label);
  //           }
  //         }}
  //       />
  //     </label> */}
  //     <br />
  //     <AssignmentSettings role={effectiveRole} doenetId={item.doenetId} />
  //     <br />
  //     <ButtonGroup vertical>
  //       <Button
  //         alert
  //         width="menu"
  //         data-cy="deleteDoenetMLButton"
  //         value="Delete Collection"
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
  // );
}
