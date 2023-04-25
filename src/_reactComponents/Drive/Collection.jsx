import React, { useContext, useEffect, useRef } from "react";
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import {
  faChevronDown,
  faChevronRight,
  faCode,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Draggable from "../Draggable";
import { DropTargetsContext, WithDropTarget } from "../DropTarget";
import useSockets, { itemType } from "../Sockets";
import { useDragShadowCallbacks, useSortFolder } from "./DriveActions";
import {
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
  selectedDriveItemsAtom,
  sortOptions,
  useDnDCallbacks,
} from "./NewDrive";
import { useState } from "react";

function Collection(props) {
  const itemId = props?.item.itemId;

  const { folderInfo, contentsDictionary, contentIdsArr } =
    useRecoilValueLoadable(
      folderInfoSelector({
        driveId: props.driveId,
        instanceId: props.driveInstanceId,
        folderId: itemId,
      }),
    ).getValue();
  // const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderDictionaryFilterSelector({driveId:props.driveId,folderId:itemId}))
  const [label, setLabel] = useState(folderInfo?.label);

  useEffect(() => {
    setLabel(folderInfo.label);
  }, [folderInfo.label]);
  const {
    onDragStart,
    onDrag,
    onDragOverContainer,
    onDragEnd,
    onDragExit,
    renderDragGhost,
    registerDropTarget,
    unregisterDropTarget,
  } = useDnDCallbacks();
  const { dropState } = useContext(DropTargetsContext);
  const [dragState, setDragState] = useRecoilState(dragStateAtom);
  // const [folderCacheDirty, setFolderCacheDirty] = useRecoilState(folderCacheDirtyAtom({driveId:props.driveId, folderId:itemId}))

  const parentFolderSortOrder = useRecoilValue(
    folderSortOrderAtom({
      driveId: props.driveId,
      instanceId: props.driveInstanceId,
      folderId: props.item?.parentFolderId,
    }),
  );
  const parentFolderSortOrderRef = useRef(parentFolderSortOrder); // for memoized DnD callbacks
  const isSelected = useRecoilValue(
    selectedDriveItemsAtom({
      driveId: props.driveId,
      driveInstanceId: props.driveInstanceId,
      itemId,
    }),
  );
  const { deleteItem } = useSockets("drive");
  const deleteItemCallback = (itemId) => {
    deleteItem({
      driveIdFolderId: { driveId: props.driveId, folderId: itemId },
      driveInstanceId: props.driveInstanceId,
      itemId,
    });
  };

  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom);

  //Used to determine range of items in Shift Click
  const isOpen = useRecoilValue(
    folderOpenAtom({
      driveInstanceId: props.driveInstanceId,
      driveId: props.driveId,
      itemId,
    }),
  );
  const toggleOpen = useSetRecoilState(
    folderOpenSelector({
      driveInstanceId: props.driveInstanceId,
      driveId: props.driveId,
      itemId,
    }),
  );
  const isOpenRef = useRef(isOpen); // for memoized DnD callbacks
  const isSelectedRef = useRef(isSelected); // for memoized DnD callbacks

  const { sortFolder, invalidateSortCache, onSortFolderError } =
    useSortFolder();
  const { insertDragShadow, removeDragShadow } = useDragShadowCallbacks();

  // Set only when parentFolderId changes
  const setInstanceParentId = useSetRecoilState(
    driveInstanceParentFolderIdAtom(props.driveInstanceId),
  );
  useEffect(() => {
    setInstanceParentId(props.pathItemId);
  }, [props.pathItemId, setInstanceParentId]);

  const indentPx = 25;
  let bgcolor = "var(--canvas)";
  let borderSide = "0px";
  let marginSize = "0";
  if (isSelected) {
    bgcolor = "var(--lightBlue)";
  }
  if (isSelected && dragState.isDragging) {
    bgcolor = "var(--mainGray)";
  }
  let woIndent = 250 - props.indentLevel * indentPx;
  let columns = `${woIndent}px repeat(4,1fr)`; //5 columns
  if (props.numColumns === 4) {
    columns = `${woIndent}px repeat(3,1fr)`;
  } else if (props.numColumns === 3) {
    columns = `${woIndent}px 1fr 1fr`;
  } else if (props.numColumns === 2) {
    columns = `${woIndent}px 1fr`;
  } else if (props.numColumns === 1) {
    columns = "100%";
  }

  let column2 = ColumnJSX(props.columnTypes[0], props.item);
  let column3 = ColumnJSX(props.columnTypes[1], props.item);
  let column4 = ColumnJSX(props.columnTypes[2], props.item);
  let column5 = ColumnJSX(props.columnTypes[3], props.item);

  const isDraggedOver =
    dropState.activeDropTargetId === itemId &&
    !dragState.draggedItemsId?.has(itemId);
  if (isDraggedOver) {
    bgcolor = "var(--mainGray)";
  }
  const isDropTargetFolder = dragState.dragShadowParentId === itemId;
  if (isDropTargetFolder) {
    bgcolor = "var(--lightBlue)";
  }

  // Update refs for variables used in DnD callbacks to eliminate re-registration
  useEffect(() => {
    isOpenRef.current = isOpen;
    isSelectedRef.current = isSelected;
  }, [isOpen, isSelected]);

  useEffect(() => {
    parentFolderSortOrderRef.current = parentFolderSortOrder;
  }, [parentFolderSortOrder]);

  // Cache invalidation when folder is dirty
  // useEffect(() => {
  //   if (folderCacheDirty) {
  //     invalidateSortCache({driveId: props.driveId, folderId: itemId});
  //     setFolderCacheDirty(false);
  //   }
  // }, [folderCacheDirty])

  let openCloseText = isOpen ? (
    <span data-test="folderToggleCloseIcon">
      <FontAwesomeIcon
        icon={faChevronDown}
        style={{ color: "var(--canvastext)" }}
      />
    </span>
  ) : (
    <span data-test="folderToggleOpenIcon">
      <FontAwesomeIcon
        icon={faChevronRight}
        style={{ color: "var(--canvastext)" }}
      />
    </span>
  );

  let openCloseButton = null;
  if (!props.isViewOnly) {
    openCloseButton = (
      <button
        style={{
          border: "none",
          backgroundColor: bgcolor,
          borderRadius: "5px",
        }}
        data-doenet-driveinstanceid={props.driveInstanceId}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleOpen();
          props?.clickCallback?.({
            driveId: props.driveId,
            itemId,
            driveInstanceId: props.driveInstanceId,
            type: itemType.COLLECTION,
            instructionType: "one item",
            parentFolderId: itemId,
          });
        }}
      >
        {openCloseText}
      </button>
    );
  }

  const sortHandler = ({ sortKey }) => {
    const result = sortFolder({
      driveIdInstanceIdFolderId: {
        driveInstanceId: props.driveInstanceId,
        driveId: props.driveId,
        folderId: itemId,
      },
      sortKey: sortKey,
    });
    result
      .then(() => {})
      .catch((e) => {
        onSortFolderError({ errorMessage: e.message });
      });
  };

  const markFolderDraggedOpened = () => {
    setDragState((old) => {
      let newOpenedFoldersInfo = [...old.openedFoldersInfo];
      newOpenedFoldersInfo.push({
        driveInstanceId: props.driveInstanceId,
        driveId: props.driveId,
        itemId,
      });
      return {
        ...old,
        openedFoldersInfo: newOpenedFoldersInfo,
      };
    });
  };

  const onDragOver = ({ x, y, dropTargetRef }) => {
    onDragOverContainer({ id: itemId, driveId: props.driveId });

    const dropTargetTopY = dropTargetRef?.offsetTop;
    const dropTargetHeight = dropTargetRef?.clientHeight;
    const cursorY = y;
    const cursorArea = (cursorY - dropTargetTopY) / dropTargetHeight;

    if (parentFolderSortOrderRef.current === sortOptions.DEFAULT) {
      if (cursorArea < 0.5) {
        // insert shadow to top of current dropTarget
        insertDragShadow({
          driveIdFolderId: {
            driveId: props.driveId,
            folderId: props.item.parentFolderId,
          },
          position: "beforeCurrent",
          itemId,
          parentId: props.item?.parentFolderId,
        });
      } else if (cursorArea < 1.0) {
        // insert shadow to bottom of current dropTarget
        insertDragShadow({
          driveIdFolderId: { driveId: props.driveId, folderId: itemId },
          position: "afterCurrent",
          itemId,
          parentId: props.item?.parentFolderId,
        });
      }
    } else {
      removeDragShadow();
    }
  };

  const onDragHover = () => {
    // Open folder if initially closed
    if (!isOpenRef.current && !isSelectedRef.current) {
      toggleOpen();
      // Mark current folder to close on dragEnd
      markFolderDraggedOpened();
    }

    insertDragShadow({
      driveIdFolderId: { driveId: props.driveId, folderId: itemId },
      parentId: itemId,
      position: "intoCurrent",
    });
  };

  const onDrop = () => {};

  const onDragEndCb = () => {
    onDragEnd();
  };

  // const sortNodeButtonFactory = ({ buttonLabel, sortKey, sortHandler }) => {
  //   return <button
  //   style={{backgroundColor: "#1A5A99",color: "white", border: "none", borderRadius: "12px", height: "24px", margin: "2px"}}
  //   tabIndex={-1}
  //   onClick={(e)=>{
  //     e.preventDefault();
  //     e.stopPropagation();
  //     sortHandler({sortKey: sortKey});
  //   }}
  //   onMouseDown={e=>{ e.preventDefault(); e.stopPropagation(); }}
  //   onDoubleClick={e=>{ e.preventDefault(); e.stopPropagation(); }}
  //   >{ buttonLabel }</button>;
  // }

  let collection = null;
  let items = null;

  if (!props.driveObj) {
    collection = (
      <div
        role="button"
        data-doenet-driveinstanceid={props.driveInstanceId}
        data-test="driveItem"
        tabIndex={0}
        className="noselect nooutline"
        style={{
          cursor: "pointer",
          // width: "300px",
          padding: "8px",
          border: "0px",
          borderBottom: "2px solid var(--canvastext)",
          backgroundColor: bgcolor,
          // width: widthSize,
          // boxShadow: borderSide,
          marginLeft: marginSize,
          borderLeft: borderSide,
        }}
        onKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.key === "Enter") {
            props?.doubleClickCallback?.({
              driveId: props.driveId,
              parentFolderId: props.item.parentFolderId,
              item: props.item,
              type: itemType.COLLECTION,
            });
          }
        }}
        onClick={(e) => {
          e.preventDefault(); // Folder
          e.stopPropagation();
          if (!e.shiftKey && !e.metaKey) {
            props?.clickCallback?.({
              driveId: props.driveId,
              itemId,
              driveInstanceId: props.driveInstanceId,
              type: itemType.COLLECTION,
              instructionType: "one item",
              parentFolderId: itemId,
            });
          } else if (e.shiftKey && !e.metaKey) {
            props?.clickCallback?.({
              driveId: props.driveId,
              driveInstanceId: props.driveInstanceId,
              itemId,
              type: itemType.COLLECTION,
              instructionType: "range to item",
              parentFolderId: itemId,
            });
          } else if (!e.shiftKey && e.metaKey) {
            props?.clickCallback?.({
              driveId: props.driveId,
              driveInstanceId: props.driveInstanceId,
              itemId,
              type: itemType.COLLECTION,
              instructionType: "add item",
              parentFolderId: itemId,
            });
          }
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props?.doubleClickCallback?.({
            driveId: props.driveId,
            parentFolderId: props.item.parentFolderId,
            item: props.item,
            type: itemType.COLLECTION,
          });
        }}
        onBlur={() => {
          //Don't clear on navigation changes
          //Only clear if focus goes outside of this node group
          // if (e.relatedTarget === null ||
          //   (e.relatedTarget.dataset.doenetDriveinstanceid !== props.driveInstanceId &&
          //   !e.relatedTarget.dataset.doenetDriveStayselected)
          //   ){
          //     setSelected({instructionType:"clear all"})
          // }
          // if (e?.relatedTarget?.dataset?.doenetDeselectDrive){
          //   setSelected({instructionType:"clear all"});
          // }
        }}
      >
        <div
          className="noselect"
          style={{
            marginLeft: `${props.indentLevel * indentPx}px`,
            display: "grid",
            gridTemplateColumns: columns,
            gridTemplateRows: "1fr",
            alignContent: "center",
          }}
        >
          <p style={{ display: "inline", margin: "0px" }}>
            {openCloseButton}
            <span data-test="folderIcon">
              <FontAwesomeIcon
                icon={props.isViewOnly ? faCode : faLayerGroup}
              />
            </span>
            <span data-test="folderLabel">{label}</span>
          </p>
          {props.numColumns >= 2 ? column2 : null}
          {props.numColumns >= 3 ? column3 : null}
          {props.numColumns >= 4 ? column4 : null}
          {props.numColumns >= 5 ? column5 : null}
        </div>
      </div>
    );
  }

  // make folder draggable and droppable
  let draggableClassName = "";
  if (!props.isViewOnly) {
    const onDragStartCallback = () => {
      if (globalSelectedNodes.length === 0 || !isSelected) {
        props?.clickCallback?.({
          instructionType: "clear all",
          type: itemType.COLLECTION,
        });
        props?.clickCallback?.({
          driveId: props.driveId,
          parentFolderId: itemId,
          itemId,
          driveInstanceId: props.driveInstanceId,
          instructionType: "one item",
          type: itemType.COLLECTION,
        });
      }
    };
    collection = (
      <Draggable
        key={`dnode${props.driveInstanceId}${itemId}`}
        id={itemId}
        className={draggableClassName}
        onDragStart={({ ev }) =>
          onDragStart({
            ev,
            nodeId: itemId,
            driveId: props.driveId,
            onDragStartCallback,
          })
        }
        onDrag={onDrag}
        onDragEnd={onDragEndCb}
        ghostElement={renderDragGhost(itemId, collection)}
      >
        {collection}
      </Draggable>
    );
  }

  const dropTargetId = props.driveObj ? props.driveId : itemId;
  collection = (
    <WithDropTarget
      key={`wdtnode${props.driveInstanceId}${itemId}`}
      id={dropTargetId}
      registerDropTarget={registerDropTarget}
      unregisterDropTarget={unregisterDropTarget}
      dropCallbacks={{
        onDragOver: onDragOver,
        onDragHover: onDragHover,
        onDragExit: () => {
          onDragExit({ driveId: props.driveId, itemId });
        },
        onDrop: onDrop,
      }}
    >
      {collection}
    </WithDropTarget>
  );

  // if (props.driveObj) {
  //   const sortButtons = <div style={{marginLeft: "2.5vw"}}>
  //     {sortNodeButtonFactory({buttonLabel: "Sort Custom", sortKey: sortOptions.DEFAULT, sortHandler})}
  //     {sortNodeButtonFactory({buttonLabel: "Sort Label ASC", sortKey: sortOptions.LABEL_ASC, sortHandler})}
  //     {sortNodeButtonFactory({buttonLabel: "Sort Label DESC", sortKey: sortOptions.LABEL_DESC, sortHandler})}
  //     {sortNodeButtonFactory({buttonLabel: "Sort Date ASC", sortKey: sortOptions.CREATION_DATE_ASC, sortHandler})}
  //     {sortNodeButtonFactory({buttonLabel: "Sort Date DESC", sortKey: sortOptions.CREATION_DATE_DESC, sortHandler})}
  //   </div>;

  //   folder = <>
  //     {sortButtons}
  //     {folder}

  //   </>;
  // }

  if (isOpen || (props.driveObj && !props.rootCollapsible)) {
    let dictionary = contentsDictionary;
    items = [];
    for (let itemId of contentIdsArr) {
      let item = dictionary[itemId];
      if (!item) continue;
      // console.log(">>>item",item)
      if (props.hideUnpublished && item.isPublished === "0") {
        //hide item
        if (item.assignment_isPublished != "1") continue;
        // TODO : update
      }
      switch (item.itemType) {
        case "DoenetML":
          items.push(
            <DoenetML
              key={`item${itemId}${props.driveInstanceId}`}
              driveId={props.driveId}
              item={item}
              indentLevel={props.indentLevel + 1}
              driveInstanceId={props.driveInstanceId}
              route={props.route}
              pathItemId={props.pathItemId}
              clickCallback={props.clickCallback}
              doubleClickCallback={props.doubleClickCallback}
              deleteItem={deleteItemCallback}
              numColumns={props.numColumns}
              columnTypes={props.columnTypes}
            />,
          );
          break;
        case "DragShadow":
          console.log(`dragShadow${itemId}${props.driveInstanceId}`);
          items.push(
            <DragShadow
              key={`dragShadow${itemId}${props.driveInstanceId}`}
              indentLevel={props.indentLevel + 1}
            />,
          );
          break;
        default:
          console.warn(`Item not rendered of type ${item.itemType}`);
      }
    }

    if (contentIdsArr.length === 0 && !props.foldersOnly) {
      items.push(<EmptyNode key={`emptyitem${folderInfo?.itemId}`} />);
    }
  }

  return (
    <div data-test="drive">
      {collection}
      {items}
    </div>
  );
}

export default Collection;
