import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import DragItem from "../../TreeView/components/drag-item";
import PropTypes from 'prop-types';

const Url = ({ urlId, classes, onClick, onDoubleClick, title, publishDate,
  isShared, isPublic, isPinned, tableIndex,
  onDragStart, onDragOver, onDragEnd }) => {

    const onDraggableDragOverCb = (listId) => {
      onDragOver(listId, "url")
    }
  
    const onDragStartCb = (draggedId) => {
      onDragStart({draggedId: draggedId, draggedType: "url", tableIndex: tableIndex});
    }
  
    return(
      <DragItem id={urlId} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
      <tr
      className={classes}
      onClick={() => onClick(urlId, "url", tableIndex)}
      onDoubleClick={() => onDoubleClick(urlId)}
      data-cy={urlId}>
        <td className="browserItemName">
          <div style={{"position":"relative"}}>
            {isPinned && <FontAwesomeIcon icon={faThumbtack} style={{"fontSize":"15px", "color":"#8e8e8e", "position":"aboslute", "left":"-6px", "top":"3px"}}/> }
            {isShared && isPublic ? 
              <FontAwesomeIcon icon={faLink} style={{"fontSize":"18px", "color":"#3aac90", "margin": "0px 15px"}}/> :
              <FontAwesomeIcon icon={faLink} style={{"fontSize":"18px", "color":"#3D6EC9", "margin": "0px 15px"}}/>}
            <span>{title}</span>
          </div>          
        </td>
        <td className="draftDate">
          <span>-</span>
        </td>
        <td className="publishDate">
          <div style={{"position":"relative"}}>
            <span>{publishDate}</span>
          </div>          
        </td>
      </tr>
      </DragItem>
    );
}

Url.propTypes = {
  urlId: PropTypes.string,
  classes: PropTypes.string,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  title: PropTypes.string,
  publishDate: PropTypes.string,
  draftDate: PropTypes.string,
  isShared: PropTypes.bool,
  isPublic: PropTypes.bool,
  isPinned: PropTypes.bool,
  tableIndex: PropTypes.number,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragEnd: PropTypes.func
}

export default Url;