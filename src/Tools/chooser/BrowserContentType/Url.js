import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink} from '@fortawesome/free-solid-svg-icons';
import DragItem from "../../TreeView/components/drag-item";
import PropTypes from 'prop-types';

const Url = ({ urlId, classes, onClick, onDoubleClick, title, publishDate,
  isShared, isPublic, tableIndex,
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
          {isShared && isPublic ? 
            <FontAwesomeIcon icon={faLink} style={{"fontSize":"18px", "color":"#3aac90", "margin": "0px 15px"}}/> :
            <FontAwesomeIcon icon={faLink} style={{"fontSize":"18px", "color":"#3D6EC9", "margin": "0px 15px"}}/>}
          <span>{title}</span>
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
  tableIndex: PropTypes.number,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragEnd: PropTypes.func
}

export default Url;