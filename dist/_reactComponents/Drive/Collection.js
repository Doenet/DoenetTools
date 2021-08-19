import React, {useContext, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import {
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValue,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {
  faChevronDown,
  faChevronRight,
  faLayerGroup
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import Draggable from "../Draggable/index.js";
import {DropTargetsContext, WithDropTarget} from "../DropTarget/index.js";
import useSockets, {itemType} from "../Sockets.js";
import {useDragShadowCallbacks, useSortFolder} from "./DriveActions.js";
import {
  clearDriveAndItemSelections,
  ColumnJSX,
  DoenetML,
  DragShadow,
  dragStateAtom,
  driveInstanceParentFolderIdAtom,
  EmptyNode,
  folderInfoSelector,
  folderOpenAtom,
  folderOpenSelector,
  folderSortOrderAtom,
  globalSelectedNodesAtom,
  selectedDriveAtom,
  selectedDriveItemsAtom,
  sortOptions,
  useDnDCallbacks
} from "./NewDrive.js";
function Collection(props) {
  const itemId = props?.item.itemId;
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderInfoSelector({
    driveId: props.driveId,
    instanceId: props.driveInstanceId,
    folderId: itemId
  }));
  const {
    onDragStart,
    onDrag,
    onDragOverContainer,
    onDragEnd,
    onDragExit,
    renderDragGhost,
    registerDropTarget,
    unregisterDropTarget
  } = useDnDCallbacks();
  const {dropState} = useContext(DropTargetsContext);
  const [dragState, setDragState] = useRecoilState(dragStateAtom);
  const parentFolderSortOrder = useRecoilValue(folderSortOrderAtom({
    driveId: props.driveId,
    instanceId: props.driveInstanceId,
    folderId: props.item?.parentFolderId
  }));
  const parentFolderSortOrderRef = useRef(parentFolderSortOrder);
  const [selectedDrive, setSelectedDrive] = useRecoilState(selectedDriveAtom);
  const isSelected = useRecoilValue(selectedDriveItemsAtom({
    driveId: props.driveId,
    driveInstanceId: props.driveInstanceId,
    itemId
  }));
  const {deleteItem} = useSockets("drive");
  const deleteItemCallback = (itemId2) => {
    deleteItem({
      driveIdFolderId: {driveId: props.driveId, folderId: itemId2},
      driveInstanceId: props.driveInstanceId,
      itemId: itemId2
    });
  };
  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom);
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const isOpen = useRecoilValue(folderOpenAtom({
    driveInstanceId: props.driveInstanceId,
    driveId: props.driveId,
    itemId
  }));
  const toggleOpen = useSetRecoilState(folderOpenSelector({
    driveInstanceId: props.driveInstanceId,
    driveId: props.driveId,
    itemId
  }));
  const isOpenRef = useRef(isOpen);
  const isSelectedRef = useRef(isSelected);
  const {sortFolder, invalidateSortCache, onSortFolderError} = useSortFolder();
  const {insertDragShadow, removeDragShadow} = useDragShadowCallbacks();
  const setInstanceParentId = useSetRecoilState(driveInstanceParentFolderIdAtom(props.driveInstanceId));
  useEffect(() => {
    setInstanceParentId(props.pathItemId);
  }, [props.pathItemId, setInstanceParentId]);
  const indentPx = 25;
  let bgcolor = "#ffffff";
  let borderSide = "0px";
  let marginSize = "0";
  let widthSize = "60vw";
  if (props.isNav) {
    marginSize = "0px";
    widthSize = "224px";
  }
  if (isSelected) {
    bgcolor = "hsl(209,54%,82%)";
  }
  if (isSelected && dragState.isDragging) {
    bgcolor = "#e2e2e2";
  }
  const isDraggedOver = dropState.activeDropTargetId === itemId && !dragState.draggedItemsId?.has(itemId);
  if (isDraggedOver) {
    bgcolor = "#f0f0f0";
  }
  const isDropTargetFolder = dragState.dragShadowParentId === itemId;
  if (isDropTargetFolder) {
    bgcolor = "hsl(209,54%,82%)";
  }
  useEffect(() => {
    isOpenRef.current = isOpen;
    isSelectedRef.current = isSelected;
  }, [isOpen, isSelected]);
  useEffect(() => {
    parentFolderSortOrderRef.current = parentFolderSortOrder;
  }, [parentFolderSortOrder]);
  if (props.isNav && itemId === props.pathItemId) {
    borderSide = "8px solid #1A5A99";
  }
  if (folderInfoObj.state === "loading") {
    return null;
  }
  if (folderInfoObj.state === "hasError") {
    console.error(folderInfoObj.contents);
    return null;
  }
  let {folderInfo, contentsDictionary, contentIdsArr} = folderInfoObj.contents;
  let openCloseText = isOpen ? /* @__PURE__ */ React.createElement("span", {
    "data-cy": "folderToggleCloseIcon"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChevronDown
  })) : /* @__PURE__ */ React.createElement("span", {
    "data-cy": "folderToggleOpenIcon"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChevronRight
  }));
  let openCloseButton = /* @__PURE__ */ React.createElement("button", {
    style: {border: "none", backgroundColor: bgcolor, borderRadius: "5px"},
    "data-doenet-driveinstanceid": props.driveInstanceId,
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleOpen();
      props?.clickCallback?.({
        driveId: props.driveId,
        itemId,
        driveInstanceId: props.driveInstanceId,
        type: itemType.COLLECTION,
        instructionType: "one item",
        parentFolderId: props.item.parentFolderId
      });
    }
  }, openCloseText);
  const sortHandler = ({sortKey}) => {
    const result = sortFolder({
      driveIdInstanceIdFolderId: {
        driveInstanceId: props.driveInstanceId,
        driveId: props.driveId,
        folderId: itemId
      },
      sortKey
    });
    result.then((resp) => {
    }).catch((e) => {
      onSortFolderError({errorMessage: e.message});
    });
  };
  const markFolderDraggedOpened = () => {
    setDragState((old) => {
      let newOpenedFoldersInfo = [...old.openedFoldersInfo];
      newOpenedFoldersInfo.push({
        driveInstanceId: props.driveInstanceId,
        driveId: props.driveId,
        itemId
      });
      return {
        ...old,
        openedFoldersInfo: newOpenedFoldersInfo
      };
    });
  };
  const onDragOver = ({x, y, dropTargetRef}) => {
    onDragOverContainer({id: itemId, driveId: props.driveId});
    const dropTargetTopY = dropTargetRef?.offsetTop;
    const dropTargetHeight = dropTargetRef?.clientHeight;
    const cursorY = y;
    const cursorArea = (cursorY - dropTargetTopY) / dropTargetHeight;
    if (parentFolderSortOrderRef.current === sortOptions.DEFAULT) {
      if (cursorArea < 0.5) {
        insertDragShadow({
          driveIdFolderId: {
            driveId: props.driveId,
            folderId: props.item.parentFolderId
          },
          position: "beforeCurrent",
          itemId,
          parentId: props.item?.parentFolderId
        });
      } else if (cursorArea < 1) {
        insertDragShadow({
          driveIdFolderId: {driveId: props.driveId, folderId: itemId},
          position: "afterCurrent",
          itemId,
          parentId: props.item?.parentFolderId
        });
      }
    } else {
      removeDragShadow();
    }
  };
  const onDragHover = () => {
    if (props.isNav)
      return;
    if (!isOpenRef.current && !isSelectedRef.current) {
      toggleOpen();
      markFolderDraggedOpened();
    }
    insertDragShadow({
      driveIdFolderId: {driveId: props.driveId, folderId: itemId},
      parentId: itemId,
      position: "intoCurrent"
    });
  };
  const onDrop = () => {
  };
  const onDragEndCb = () => {
    onDragEnd();
  };
  let label = folderInfo?.label;
  let folder = null;
  let items = null;
  if (!props.driveObj) {
    folder = /* @__PURE__ */ React.createElement("div", {
      role: "button",
      "data-doenet-driveinstanceid": props.driveInstanceId,
      "data-cy": "driveItem",
      tabIndex: 0,
      className: "noselect nooutline",
      style: {
        cursor: "pointer",
        padding: "8px",
        border: "0px",
        borderBottom: "2px solid black",
        backgroundColor: bgcolor,
        marginLeft: marginSize,
        borderLeft: borderSide
      },
      onKeyDown: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === "Enter") {
          props?.doubleClickCallback?.({
            driveId: props.driveId,
            parentFolderId: itemId,
            item: props.item,
            type: itemType.COLLECTION
          });
        }
      },
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.shiftKey && !e.metaKey) {
          props?.clickCallback?.({
            driveId: props.driveId,
            itemId,
            driveInstanceId: props.driveInstanceId,
            type: itemType.COLLECTION,
            instructionType: "one item",
            parentFolderId: itemId
          });
        } else if (e.shiftKey && !e.metaKey) {
          props?.clickCallback?.({
            driveId: props.driveId,
            driveInstanceId: props.driveInstanceId,
            itemId,
            type: itemType.COLLECTION,
            instructionType: "range to item",
            parentFolderId: itemId
          });
        } else if (!e.shiftKey && e.metaKey) {
          props?.clickCallback?.({
            driveId: props.driveId,
            driveInstanceId: props.driveInstanceId,
            itemId,
            type: itemType.COLLECTION,
            instructionType: "add item",
            parentFolderId: itemId
          });
        }
      },
      onDoubleClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        props?.doubleClickCallback?.({
          driveId: props.driveId,
          parentFolderId: props.item.parentFolderId,
          item: props.item,
          type: itemType.COLLECTION
        });
      },
      onBlur: (e) => {
        if (!props.isNav) {
        }
      }
    }, /* @__PURE__ */ React.createElement("div", {
      className: "noselect",
      style: {
        marginLeft: `${props.indentLevel * indentPx}px`,
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
        alignContent: "center"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {display: "inline", margin: "0px"}
    }, openCloseButton, /* @__PURE__ */ React.createElement("span", {
      "data-cy": "folderIcon"
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faLayerGroup
    })), /* @__PURE__ */ React.createElement("span", {
      "data-cy": "folderLabel"
    }, label))));
  }
  let draggableClassName = "";
  if (!props.isNav && !props.isViewOnly) {
    const onDragStartCallback = () => {
      console.log(globalSelectedNodes.length === 0, !isSelected);
      if (globalSelectedNodes.length === 0 || !isSelected) {
        props?.clickCallback?.({
          instructionType: "clear all",
          type: itemType.COLLECTION
        });
        props?.clickCallback?.({
          driveId: props.driveId,
          parentFolderId: props.item.parentFolderId,
          itemId,
          driveInstanceId: props.driveInstanceId,
          instructionType: "one item",
          type: itemType.COLLECTION
        });
      }
    };
    folder = /* @__PURE__ */ React.createElement(Draggable, {
      key: `dnode${props.driveInstanceId}${itemId}`,
      id: itemId,
      className: draggableClassName,
      onDragStart: ({ev}) => onDragStart({
        ev,
        nodeId: itemId,
        driveId: props.driveId,
        onDragStartCallback
      }),
      onDrag,
      onDragEnd: onDragEndCb,
      ghostElement: renderDragGhost(itemId, folder)
    }, folder);
  }
  const dropTargetId = props.driveObj ? props.driveId : itemId;
  folder = /* @__PURE__ */ React.createElement(WithDropTarget, {
    key: `wdtnode${props.driveInstanceId}${itemId}`,
    id: dropTargetId,
    registerDropTarget,
    unregisterDropTarget,
    dropCallbacks: {
      onDragOver,
      onDragHover,
      onDragExit: () => {
        onDragExit({driveId: props.driveId, itemId});
      },
      onDrop
    }
  }, folder);
  if (isOpen || props.driveObj && !props.rootCollapsible) {
    let dictionary = contentsDictionary;
    items = [];
    for (let itemId2 of contentIdsArr) {
      let item = dictionary[itemId2];
      if (!item)
        continue;
      if (props.hideUnpublished && item.isPublished === "0") {
        if (item.assignment_isPublished != "1")
          continue;
      }
      switch (item.itemType) {
        case "DoenetML":
          items.push(/* @__PURE__ */ React.createElement(DoenetML, {
            key: `item${itemId2}${props.driveInstanceId}`,
            driveId: props.driveId,
            item,
            indentLevel: props.indentLevel + 1,
            driveInstanceId: props.driveInstanceId,
            route: props.route,
            isNav: props.isNav,
            pathItemId: props.pathItemId,
            clickCallback: props.clickCallback,
            doubleClickCallback: props.doubleClickCallback,
            deleteItem: deleteItemCallback,
            numColumns: props.numColumns,
            columnTypes: props.columnTypes
          }));
          break;
        case "DragShadow":
          console.log(`dragShadow${itemId2}${props.driveInstanceId}`);
          items.push(/* @__PURE__ */ React.createElement(DragShadow, {
            key: `dragShadow${itemId2}${props.driveInstanceId}`,
            indentLevel: props.indentLevel + 1
          }));
          break;
        default:
          console.warn(`Item not rendered of type ${item.itemType}`);
      }
    }
    if (contentIdsArr.length === 0 && !props.foldersOnly) {
      items.push(/* @__PURE__ */ React.createElement(EmptyNode, {
        key: `emptyitem${folderInfo?.itemId}`
      }));
    }
  }
  return /* @__PURE__ */ React.createElement("div", {
    "data-cy": "drive"
  }, folder, items);
}
export default Collection;
