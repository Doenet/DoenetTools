import React, { useState, useEffect, useCallback } from "react";
import { LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import "./index.css";
import SpinningLoader from '../SpinningLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import ChooserConstants from "../chooser/ChooserConstants";
import styled from 'styled-components'

/*

  Data and fields:
    mandatory fields:
      - loading       (set to false if loaders not async)
      - parentsInfo   (must include "root")
        - example:
          {
            "root": {
              title: "rootTitle",
              type: "folder",
              parentId: "rootParentId"
              childFolders: [ids...],
              childContent: [ids...]
            }
          }
      - childrenInfo
        - example:
          {
            "childId": {
              title: "childTitle",
              type: "content",
              parentId: "root"
            }
          }

    optional fields:
      - hideRoot    (set to true to hide root node of tree)
      - treeNodeIcons
        - example: 
          const Icons = (iconName) => { 
            map = { folder: <FontAwesomeIcon icon={faFolder}/>,
              content: <FontAwesomeIcon icon={faFileAlt}/> }
            return map[iconName]
          }
      - specialNodes: new Set()
      - treeStyles
        - example: 
          { 
            parentNode: {
              title: {},
              contentContainer: {},
              frame: {},
            },
            childNode: {
              title: {},
              frame: {},
            },
            specialParentNode: {
              title: {},
              contentContainer: {},
              frame: {},
            },
            specialChildNode: {
              title: {},
              frame: {},
            },
            expanderIcon:          
          }
      - parentNodeOnClick
			- childNodeOnClickCallback

  Callbacks and functions:
		**Only enable one of onClick or Drag-and-Drop feature to avoid conflicts** 

    onClick callback for leaf nodes, leave empty if onclick actions not needed
    - onLeafNodeClick
      - example:
        const onLeafNodeClick = (leafNodeId) => {
          console.log(`leaf node ${leafNodeId} clicked`);
        }

    Drag and Drop functions, leave empty if DnD is not needed:
      - containerId
      - containerType
      - currentDraggedObject
      - onDragStart
      - onDragEnd
      - onDraggableDragOver
      - onDrop
      - onDropEnter
      - onDropLeave

Example customized tree:
<TreeView
  containerId={treeContainerId}
  containerType={treeContainerType}
  loading={!this.folders_loaded || !this.branches_loaded || !this.urls_loaded}
  parentsInfo={treeParentsInfo} 
  childrenInfo={treeChildrenInfo}
  treeNodeIcons={(itemType) => { 
      let map = { 
        folder: <FontAwesomeIcon icon={faDotCircle}
                style={{ fontSize: "16px",  color: "#737373" }}/>,
        content: <FontAwesomeIcon icon={faTimesCircle}/> 
      }
      return map[itemType]
  }} 
  hideRoot={true}
  specialNodes={this.tempSet}
  treeStyles={{
    parentNode: {
      "title": { color: "rgba(58,172,144)" },
      "frame": {
        border: "1px #b3b3b3 solid",
        width: "100%"
      },
      "contentContainer": {
        border: "none",
      }
    },
    childNode: {
      "title": {
        color: "rgba(33,11,124)", 
      },
      "frame": { border: "1px #a4a4a4 solid" },
    },
    specialChildNode: {
      "frame": { background: "#a7a7a7" },
    },
    expanderIcon: <FontAwesomeIcon icon={faPlus} style={{paddingRight: "8px"}}/>
  }}
  onLeafNodeClick={(nodeId) => {
    if (this.tempSet.has(nodeId)) this.tempSet.delete(nodeId);
    else this.tempSet.add(nodeId); 
    this.forceUpdate()
  }}
/>
*/

export const TreeView = ({
  loading, 
  parentsInfo={}, 
  childrenInfo={}, 
  hideRoot=false,
  disableSearch=false,
  treeNodeIcons={},
  specialNodes=new Set(),
	treeStyles={},
	onLeafNodeClick=(()=>{}),
	onParentNodeClick=(()=>{}),
	onParentNodeDoubleClick=(()=>{}),
  containerId, 
  containerType, 
  currentDraggedObject={}, 
  onDragStart, 
  onDragEnd, 
  onDraggableDragOver, 
  onDrop, 
  onDropEnter, 
  onDropLeave
}) => {
  const [currentDraggedOverContainerId, setCurrentDraggedOverContainerId] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentSearchingFolder, setCurrentSearchingFolder] = useState(null);
  const [currentHovered, setCurrentHovered] = useState(null);


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

  const buildControlButtons = (folderId) => {
    if (disableSearch) return;
    if (folderId == currentHovered || folderId == currentSearchingFolder) {
      const onClickCb = (e) => {
        setCurrentSearchingFolder(currentSearchingFolder == folderId ? null : folderId);
        setFilterText("");
        e.stopPropagation();
      }

      return <button style={{ height: '19px', padding: '1px' }} onClick={onClickCb}>
        <FontAwesomeIcon icon={faSearch} style={{ fontSize: "12px"}}/>
      </button>;
    }
  }

  const buildSearchComponent = (folderId) => {
    if (folderId == currentSearchingFolder) { 
      const onSearchInputChange = (value) => {
        setFilterText(value);
      }

      return <Search onInputChange={onSearchInputChange}/>
    }
  }
  
  if (loading){
    return <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
      <SpinningLoader/>
    </div>
  }

  // filter data
  let filteredParentsInfo = JSON.parse(JSON.stringify(parentsInfo))
  if (filterText != "") {
    let childFolders = filteredParentsInfo[currentSearchingFolder].childFolders;
    let childContent = filteredParentsInfo[currentSearchingFolder].childContent;
    let childUrls = filteredParentsInfo[currentSearchingFolder].childUrls;

    filteredParentsInfo[currentSearchingFolder].childFolders = childFolders.filter((childId) => {
      return parentsInfo[childId]["title"].includes(filterText);
    })
    filteredParentsInfo[currentSearchingFolder].childContent = childContent.filter((childId) => {
      return childrenInfo[childId]["title"].includes(filterText);
    })
    filteredParentsInfo[currentSearchingFolder].childUrls = childUrls.filter((childId) => {
      return childrenInfo[childId]["title"].includes(filterText);
    })
  }
  
  // generate section list
  const sectionList = []
  Object.keys(parentsInfo).forEach(parentId => {
    if (parentId !== "root") {
      let section = {
        id: parentId,
        text: parentsInfo[parentId]["title"]
      }
      sectionList.push(section);
    }    
  });
  // set root to "All" and reorder to top
  let root = {id: "root", text: "All"};
  sectionList.unshift(root);

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
    { buildTreeStructure({ 
        parentHeadingId: "root", 
        parentNodeHeadingId: "root",
        parentsInfo: filteredParentsInfo,
        childrenInfo: childrenInfo, 
        hideRoot: hideRoot, 
        treeNodeIcons: treeNodeIcons, 
        specialNodes: specialNodes,
				treeStyles: treeStyles,
				onLeafNodeClick: onLeafNodeClick,
				onParentNodeClick: onParentNodeClick,
        onParentNodeDoubleClick: onParentNodeDoubleClick,
        onDragStart: onDragStartCb, 
        onDragEnd: onDragEndCb, 
        onDraggableDragOver: onDraggableDragOverCb, 
        onDrop: onDropCb, 
        onDropEnter: onDropEnterCb, 
        onDropLeave: onDropLeaveCb,
        currentDraggedObject: currentDraggedObject,
        currentDraggedOverContainerId: currentDraggedOverContainerId,
        currentSearchingFolder: currentSearchingFolder,
        buildControlButtons: buildControlButtons,
        buildSearchComponent: buildSearchComponent,
        setCurrentHovered: setCurrentHovered,
       })
    }
    </div>
  );
}

function buildTreeStructure({parentHeadingId, parentNodeHeadingId, parentsInfo, childrenInfo, hideRoot, treeNodeIcons, treeStyles,
  specialNodes, onDragStart, onDragEnd, onDraggableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedObject,
   currentDraggedOverContainerId, onParentNodeClick, onParentNodeDoubleClick, onLeafNodeClick, currentSearchingFolder, buildControlButtons, buildSearchComponent, setCurrentHovered }) {
     
  const getBaseItemStyleAndIcon = (currentDraggedObject, itemType, parentNodeHeadingId, currentItemId) => {
    const icon = currentItemId == "root" ? "" : treeNodeIcons(itemType);
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
        icon: icon
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
          padding: "0px 5px",
          color: '#0083e3'
        },
        icon: icon
      })
    }
  }

  const itemType = parentsInfo[parentHeadingId]["type"];
  const childrenList = [...parentsInfo[parentHeadingId]["childContent"], ...parentsInfo[parentHeadingId]["childUrls"]];
  const baseItemStyleAndIcon = getBaseItemStyleAndIcon(currentDraggedObject, itemType, parentNodeHeadingId, parentHeadingId);
  // set style to user-defined styles
  let itemStyle = specialNodes.has(parentHeadingId) ? treeStyles["specialParentNode"] : treeStyles["parentNode"];
  // if user-defined styles undefined, fallback to default style
  itemStyle = itemStyle || {"title" :Object.assign({marginLeft: '5px', color: "rgba(0,0,0,0.8)"},  baseItemStyleAndIcon.style)};

  let subTree = <ParentNode 
    id={parentHeadingId}
    key={parentHeadingId} 
    title={parentsInfo[parentHeadingId]["title"]}
    type={itemType}
    hide={hideRoot && parentHeadingId == "root"}
    defaultOpen={parentHeadingId == "root"}
    itemIcon={baseItemStyleAndIcon.icon}
    expanderIcon={treeStyles["expanderIcon"]}
    onClick={onParentNodeClick}
    onDoubleClick={onParentNodeDoubleClick}
    onDrop={onDrop} 
    onDropEnter={onDropEnter}
    onDropLeave={onDropLeave}
    draggedOver={parentHeadingId == currentDraggedOverContainerId}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd} 
    onDraggableDragOver={onDraggableDragOver}
    currentDraggedId={currentDraggedObject.id}
    currentDraggedType={currentDraggedObject.type}
    styles={ itemStyle }
    SearchComponent={buildSearchComponent(parentHeadingId)}
    controlButtons={buildControlButtons(parentHeadingId)}
    setCurrentHovered={setCurrentHovered}
    > 
      { // iterate through children headings to generate tree recursively
      parentsInfo[parentHeadingId]["childFolders"].map(parentId => {
        return buildTreeStructure({ 
          parentHeadingId: parentId, 
          parentNodeHeadingId: parentHeadingId,
          parentsInfo: parentsInfo, 
          childrenInfo: childrenInfo, 
          hideRoot: hideRoot,
          treeNodeIcons: treeNodeIcons,
          specialNodes: specialNodes,
          treeStyles: treeStyles,
          onParentNodeClick: onParentNodeClick,
          onParentNodeDoubleClick: onParentNodeDoubleClick,
					onLeafNodeClick: onLeafNodeClick,
          onDragStart: onDragStart, 
          onDragEnd: onDragEnd, 
          onDraggableDragOver: onDraggableDragOver, 
          onDrop: onDrop, 
          onDropEnter: onDropEnter, 
          onDropLeave: onDropLeave,
          currentDraggedObject: currentDraggedObject,
          currentDraggedOverContainerId: currentDraggedOverContainerId,
          currentSearchingFolder: currentSearchingFolder,
          buildControlButtons: buildControlButtons,
          buildSearchComponent: buildSearchComponent,
          setCurrentHovered: setCurrentHovered,
        });
      })}
      { // iterate through children assigments to generate tree recursively
      childrenList.map((childId, index) => {
        const itemType = childrenInfo[childId]["type"];
        const baseItemStyleAndIcon = getBaseItemStyleAndIcon(currentDraggedObject, itemType, parentHeadingId, childId);
        // set style to user-defined styles
        let itemStyle = specialNodes.has(childId) ? treeStyles["specialChildNode"] : treeStyles["childNode"];
        // if user-defined styles undefined, fallback to default style
        itemStyle = itemStyle || {"title": Object.assign({color: "rgba(0,0,0,0.8)", marginLeft: '5px'}, baseItemStyleAndIcon.style)};


        return <LeafNode 
          index={index}
          id={childId} 
          key={childId} 
          title={childrenInfo[childId]["title"]}
          type={itemType}
					itemIcon = {baseItemStyleAndIcon.icon}
          styles={itemStyle}
					onClick={onLeafNodeClick}
          onDragStart={onDragStart} 
          onDragEnd={onDragEnd} 
          onDragOver={onDraggableDragOver} />
      })}
    </ParentNode>;

  return subTree;
}

export const Search = ({selectOptions=[], selected, onSelectChange, onInputChange}) => {

  const handleInputChange = (e) => {
    onInputChange(e.target.value);
  };

  const handleSelectchange = (e) => {
    onSelectChange(e.target.value)
  }

  return (
    <form style={{display: "flex", alignItems: "center", textAlign: "left"}}>
      {/* <SearchSelect id="section" value={selected} onChange={handleSelectchange}>
        { selectOptions.map((option) => {
            return <option key={`option-${option.id}`} value={option.id}>{option.text}</option>
          })
        }
      </SearchSelect> */}
      <SearchInput onChange={handleInputChange} placeholder="Search here..."/>
    </form>
  );
};

const SearchInput = styled('input')`
  width: 90%;
  box-sizing: border-box;
  border: 1px solid #C2C2C2;
  color: #616161;
	border-radius: 1px;
  padding: 4px;
  outline: none;
  line-height: 1.3;
`

const SearchSelect = styled('select')`
  display: inline-block;
  color: #fff;
  height: 27px;
  line-height: 1.3;
  max-width: 300px; 
  box-sizing: border-box;
  margin: 0;
  border: 0;
  box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
  outline: none;
  background-color: #00a075;
`