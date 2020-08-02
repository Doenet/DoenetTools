import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import DragItem from "../../TreeView/components/drag-item";

const File = ({ branchId, classes, onClick, onDoubleClick, title, publishDate,
  draftDate, isShared, isPublic, tableIndex, handleRemoveContent,
  onDragStart, onDragOver, onDragEnd }) => {

  const onDraggableDragOverCb = (listId) => {
    onDragOver(listId, "content")
  }

  const onDragStartCb = (draggedId) => {
    onDragStart({draggedId: draggedId, draggedType: "content", tableIndex: tableIndex});
  }

  return(
    <DragItem id={branchId} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
      <>
      <tr
      className={classes}
      onClick={() => onClick(branchId, "content", tableIndex)}
      onDoubleClick={() => onDoubleClick(branchId)}
      data-cy={branchId}>
        <td className="browserItemName">
          {isShared && isPublic ? 
            <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#3aac90", "margin": "0px 15px"}}/> :
            <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#3D6EC9", "margin": "0px 15px"}}/>}
          <span>{title}</span>
        </td>
        <td className="draftDate">
          <span>{draftDate}</span>
        </td>
        <td className="publishDate">
          <div style={{"position":"relative"}}>
            <span>{publishDate}</span>
          </div>          
        </td>
      </tr>
      </>
    </DragItem>
  );
}


export default File;