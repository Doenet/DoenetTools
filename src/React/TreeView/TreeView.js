import React, { useState, useEffect, useCallback } from "react";
import { LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import "./index.css";
import SpinningLoader from '../SpinningLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFolder, faLink} from '@fortawesome/free-solid-svg-icons';
import ChooserConstants from "../chooser/ChooserConstants";


export const TreeView = ({containerId, containerType, loading, parentsInfo, childrenInfo, currentDraggedObject, 
  onDragStart, onDragEnd, onDraggableDragOver, onDrop, onDropEnter, onDropLeave}) => {
  const [currentDraggedOverContainerId, setCurrentDraggedOverContainerId] = useState(null);

  // handle dragEnd
  useEffect(() => {
    if (currentDraggedObject.id == null) setCurrentDraggedOverContainerId(null);
  }, [currentDraggedObject])

  const onDragStartCb = (draggedId, type) => {
    onDragStart && onDragStart(draggedId, type, containerId, containerType);
  }
  
  const onDragEndCb = () => {
    onDragEnd && onDragEnd(containerId, containerType);
  }

  const onDropCb = () => {
    onDrop && onDrop(containerId, containerType);
  }

  const onDropEnterCb = (id) => {
    setCurrentDraggedOverContainerId(id); 
    onDropEnter && onDropEnter(id, containerId, containerType);
  }

  const onDraggableDragOverCb = (id, type) => {
    onDraggableDragOver && onDraggableDragOver(id, type, containerId, containerType);
  }

  const onDropLeaveCb = (id) => {
    if (currentDraggedObject.dataObject == null) return;
    // console.log(id + " " + currentDraggedObject.dataObject.parent)
    if (id === "root" && currentDraggedObject.dataObject.parent === "root") {
      // onDropLeave && onDropLeave(id, containerId, containerType);
    }
  }
  
  if (loading){
    return <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
      <SpinningLoader/>
    </div>
  }

  return (
    <>
    { buildTreeStructure({ 
        parentHeadingId: "root", 
        parentNodeHeadingId: "root",
        parentsInfo: parentsInfo, 
        childrenInfo: childrenInfo, 
        onDragStart: onDragStartCb, 
        onDragEnd: onDragEndCb, 
        onDraggableDragOver: onDraggableDragOverCb, 
        onDrop: onDropCb, 
        onDropEnter: onDropEnterCb, 
        onDropLeave: onDropLeaveCb, 
        currentDraggedObject: currentDraggedObject,
        currentDraggedOverContainerId: currentDraggedOverContainerId })
    }
    </>
  );
}

function buildTreeStructure({parentHeadingId, parentNodeHeadingId, parentsInfo, childrenInfo, 
  onDragStart, onDragEnd, onDraggableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedObject,
   currentDraggedOverContainerId}) {
     
  const getItemStyleAndIcon = (currentDraggedObject, itemType, parentNodeHeadingId, currentItemId) => {
    let itemDragged = currentDraggedObject.id == currentItemId;
    let isShadow = itemDragged && 
      currentDraggedObject.dataObject.parentId == parentNodeHeadingId &&
      currentDraggedObject.sourceParentId != currentDraggedObject.dataObject.parentId;
    if (!itemDragged) {  // item not dragged
      return ({
        style: {
          border: "0px",
          background: "none",
          padding: "0px"
        },
        icon: Icons(itemType)
      })
    } else if (isShadow) {  // copy of item
      return ({
        style: {
          width: "100%",
          border: "0px",
          background: "#fdfdfd",
          padding: "0px 5px",
          color: "#fdfdfd",
          boxShadow: "0 0 3px rgba(0, 0, 0, .2)"
        },
        icon: <span></span>
      })
    } else {  // item itself
      return ({
        style: {
          border: "2px dotted #37ceff",
          background: "#fff",
          padding: "0px 5px"
        },
        icon: Icons(itemType)
      })
    }
  }

  const itemType = parentsInfo[parentHeadingId]["type"];
  const childrenList = [...parentsInfo[parentHeadingId]["childContent"], ...parentsInfo[parentHeadingId]["childUrls"]];
  const itemStyleAndIcon = getItemStyleAndIcon(currentDraggedObject, itemType, parentNodeHeadingId, parentHeadingId);
  

  let subTree = <ParentNode 
    id={parentHeadingId}
    key={parentHeadingId} 
    title={parentHeadingId == "root" ? "Tree" : parentsInfo[parentHeadingId]["title"]}
    type={itemType}
    hide={parentHeadingId == "root"}
    defaultOpen={parentHeadingId == "root"}
    itemIcon = {itemStyleAndIcon.icon}
    onDrop={onDrop} 
    onDropEnter={onDropEnter}
    onDropLeave={onDropLeave}
    draggedOver={parentHeadingId == currentDraggedOverContainerId}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd} 
    onDraggableDragOver={onDraggableDragOver}
    currentDraggedId={currentDraggedObject.id}
    currentDraggedType={currentDraggedObject.type}
    style={ Object.assign({marginLeft: '5px'}, 
      itemStyleAndIcon.style) }> 
      { // iterate through children headings to generate tree recursively
      parentsInfo[parentHeadingId]["childFolders"].map(parentId => {
        return buildTreeStructure({ 
          parentHeadingId: parentId, 
          parentNodeHeadingId: parentHeadingId,
          parentsInfo: parentsInfo, 
          childrenInfo: childrenInfo, 
          onDragStart: onDragStart, 
          onDragEnd: onDragEnd, 
          onDraggableDragOver: onDraggableDragOver, 
          onDrop: onDrop, 
          onDropEnter: onDropEnter, 
          onDropLeave: onDropLeave,
          currentDraggedObject: currentDraggedObject,
          currentDraggedOverContainerId: currentDraggedOverContainerId});
      })}
      { // iterate through children assigments to generate tree recursively
      childrenList.map((childId, index) => {
        const itemType = childrenInfo[childId]["type"];
        const itemStyleAndIcon = getItemStyleAndIcon(currentDraggedObject, itemType, parentHeadingId, childId);

        return <LeafNode 
          index={index}
          id={childId} 
          key={childId} 
          title={childrenInfo[childId]["title"]}
          type={itemType}
          itemIcon = {itemStyleAndIcon.icon}
          styles={ Object.assign({color: '#0083e3', marginLeft: '5px'}, 
          itemStyleAndIcon.style)
          }
          onDragStart={onDragStart} 
          onDragEnd={onDragEnd} 
          onDragOver={onDraggableDragOver} />
      })}
    </ParentNode>;

  return subTree;
}

const Icons = (iconName) => {
  const FolderIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFolder}
    style={{
      fontSize: "16px", 
      color: "#737373", 
    }}
  />;
  const RepoIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFolder}
    style={{
      fontSize: "16px", 
      color: "#3aac90", 
    }}
  />;
  const ContentIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFileAlt}
    style={{
      fontSize: "16px", 
      color: "#3D6EC9", 
    }}
  />;
  const UrlIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faLink}
    style={{
      fontSize: "16px", 
      color: "#a7a7a7", 
    }}
  />;
  const HeadingIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFolder}
    style={{
      fontSize: "16px", 
      color: "#a7a7a7", 
    }}
  />;
  const AssignmentIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFileAlt} 
    style={{
      fontSize: "16px", 
      color: "#a7a7a7", 
    }}
  />;

  switch(iconName){
    case "folder":
      return FolderIcon;
    case "repo":
      return RepoIcon;
    case "content":
      return ContentIcon;
    case "url":
      return UrlIcon;
    case "header":
      return HeadingIcon;
    case "assignment":
      return AssignmentIcon;
    default:
      return <span></span>;
  } 
};