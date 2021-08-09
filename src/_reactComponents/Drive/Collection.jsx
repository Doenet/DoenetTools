import React, { useContext, useEffect, useRef } from 'react';
import {
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  faChevronDown,
  faChevronRight,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Draggable from '../Draggable';
import { DropTargetsContext, WithDropTarget } from '../DropTarget';
import useSockets, { itemType } from '../Sockets';
import { useDragShadowCallbacks, useSortFolder } from './DriveActions';
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
  useDnDCallbacks,
} from './NewDrive';

function Collection(props) {
  const itemId = props?.item.itemId;

  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(
    folderInfoSelector({
      driveId: props.driveId,
      instanceId: props.driveInstanceId,
      folderId: props.folderId,
    }),
  );
  // const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(folderDictionaryFilterSelector({driveId:props.driveId,folderId:props.folderId}))

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
  // const [folderCacheDirty, setFolderCacheDirty] = useRecoilState(folderCacheDirtyAtom({driveId:props.driveId, folderId:props.folderId}))

  const parentFolderSortOrder = useRecoilValue(
    folderSortOrderAtom({
      driveId: props.driveId,
      instanceId: props.driveInstanceId,
      folderId: props.item?.parentFolderId,
    }),
  );
  const parentFolderSortOrderRef = useRef(parentFolderSortOrder); // for memoized DnD callbacks
  const [selectedDrive, setSelectedDrive] = useRecoilState(selectedDriveAtom);
  const isSelected = useRecoilValue(
    selectedDriveItemsAtom({
      driveId: props.driveId,
      driveInstanceId: props.driveInstanceId,
      itemId,
    }),
  );
  const { deleteItem } = useSockets('drive');
  const deleteItemCallback = (itemId) => {
    deleteItem({
      driveIdFolderId: { driveId: props.driveId, folderId: props.folderId },
      driveInstanceId: props.driveInstanceId,
      itemId,
    });
  };

  const globalSelectedNodes = useRecoilValue(globalSelectedNodesAtom);
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);

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
  let bgcolor = '#ffffff';
  let borderSide = '0px';
  let marginSize = '0';
  let widthSize = '60vw';
  if (props.isNav) {
    marginSize = '0px';
    widthSize = '224px';
  }
  if (isSelected) {
    bgcolor = 'hsl(209,54%,82%)';
  }
  if (isSelected && dragState.isDragging) {
    bgcolor = '#e2e2e2';
  }

  const isDraggedOver =
    dropState.activeDropTargetId === itemId &&
    !dragState.draggedItemsId?.has(itemId);
  if (isDraggedOver) {
    bgcolor = '#f0f0f0';
  }
  const isDropTargetFolder = dragState.dragShadowParentId === itemId;
  if (isDropTargetFolder) {
    bgcolor = 'hsl(209,54%,82%)';
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
  //     invalidateSortCache({driveId: props.driveId, folderId: props.folderId});
  //     setFolderCacheDirty(false);
  //   }
  // }, [folderCacheDirty])

  if (props.isNav && itemId === props.pathItemId) {
    borderSide = '8px solid #1A5A99';
  }

  if (folderInfoObj.state === 'loading') {
    return null;
  }
  if (folderInfoObj.state === 'hasError') {
    console.error(folderInfoObj.contents);
    return null;
  }
  let { folderInfo, contentsDictionary, contentIdsArr } =
    folderInfoObj.contents;

  let openCloseText = isOpen ? (
    <span data-cy="folderToggleCloseIcon">
      <FontAwesomeIcon icon={faChevronDown} />
    </span>
  ) : (
    <span data-cy="folderToggleOpenIcon">
      <FontAwesomeIcon icon={faChevronRight} />
    </span>
  );

  let openCloseButton = (
    <button
      style={{ border: 'none', backgroundColor: bgcolor, borderRadius: '5px' }}
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
          instructionType: 'one item',
          parentFolderId: itemId,
        });
      }}
    >
      {openCloseText}
    </button>
  );

  const sortHandler = ({ sortKey }) => {
    const result = sortFolder({
      driveIdInstanceIdFolderId: {
        driveInstanceId: props.driveInstanceId,
        driveId: props.driveId,
        folderId: props.folderId,
      },
      sortKey: sortKey,
    });
    result
      .then((resp) => {})
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
          driveIdFolderId: { driveId: props.driveId, folderId: props.folderId },
          position: 'beforeCurrent',
          itemId,
          parentId: props.item?.parentFolderId,
        });
      } else if (cursorArea < 1.0) {
        // insert shadow to bottom of current dropTarget
        insertDragShadow({
          driveIdFolderId: { driveId: props.driveId, folderId: props.folderId },
          position: 'afterCurrent',
          itemId,
          parentId: props.item?.parentFolderId,
        });
      }
    } else {
      removeDragShadow();
    }
  };

  const onDragHover = () => {
    if (props.isNav) return;

    // Open folder if initially closed
    if (!isOpenRef.current && !isSelectedRef.current) {
      toggleOpen();
      // Mark current folder to close on dragEnd
      markFolderDraggedOpened();
    }

    insertDragShadow({
      driveIdFolderId: { driveId: props.driveId, folderId: props.folderId },
      parentId: props.folderId,
      position: 'intoCurrent',
    });
  };

  const onDrop = () => {};

  const onDragEndCb = (info) => {
    console.log(info);
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

  let label = folderInfo?.label;

  let folder = null;
  let items = null;

  if (!props.driveObj) {
    folder = (
      <div
        role="button"
        data-doenet-driveinstanceid={props.driveInstanceId}
        data-cy="driveItem"
        tabIndex={0}
        className="noselect nooutline"
        style={{
          cursor: 'pointer',
          // width: "300px",
          padding: '8px',
          border: '0px',
          borderBottom: '2px solid black',
          backgroundColor: bgcolor,
          // width: widthSize,
          // boxShadow: borderSide,
          marginLeft: marginSize,
          borderLeft: borderSide,
        }}
        onKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.key === 'Enter') {
            props?.doubleClickCallback?.({
              driveId: props.driveId,
              parentFolderId: itemId,
              itemId,
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
              instructionType: 'one item',
              parentFolderId: itemId,
            });
          } else if (e.shiftKey && !e.metaKey) {
            props?.clickCallback?.({
              driveId: props.driveId,
              driveInstanceId: props.driveInstanceId,
              itemId,
              type: itemType.COLLECTION,
              instructionType: 'range to item',
              parentFolderId: itemId,
            });
          } else if (!e.shiftKey && e.metaKey) {
            props?.clickCallback?.({
              driveId: props.driveId,
              driveInstanceId: props.driveInstanceId,
              itemId,
              type: itemType.COLLECTION,
              instructionType: 'add item',
              parentFolderId: itemId,
            });
          }
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log(props.item);
          props?.doubleClickCallback?.({
            driveId: props.driveId,
            parentFolderId: props.item.parentFolderId,
            item: props.item,
            type: itemType.COLLECTION,
          });
          // toggleOpen();
        }}
        onBlur={(e) => {
          //Don't clear on navigation changes
          if (!props.isNav) {
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
          }
        }}
      >
        <div
          className="noselect"
          style={{
            marginLeft: `${props.indentLevel * indentPx}px`,
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: '1fr',
            alignContent: 'center',
          }}
        >
          <div style={{ display: 'inline', margin: '0px' }}>
            {openCloseButton}
            <span data-cy="folderIcon">
              <FontAwesomeIcon icon={faLayerGroup} />
            </span>
            <span data-cy="folderLabel">{label}</span>
          </div>
        </div>
      </div>
    );
  }

  // make folder draggable and droppable
  let draggableClassName = '';
  if (!props.isNav) {
    const onDragStartCallback = () => {
      if (globalSelectedNodes.length === 0 || !isSelected) {
        props?.clickCallback?.({
          instructionType: 'clear all',
          type: itemType.FOLDER,
        });
        props?.clickCallback?.({
          instructionType: 'one item',
          parentFolderId: props.parentFolderId,
          type: itemType.FOLDER,
        });
      }
    };
    folder = (
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
        ghostElement={renderDragGhost(itemId, folder)}
      >
        {folder}
      </Draggable>
    );
  }

  const dropTargetId = props.driveObj ? props.driveId : itemId;
  folder = (
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
      {folder}
    </WithDropTarget>
  );

  // if (props.driveObj && !props.isNav) {
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
      if (props.hideUnpublished && item.isPublished === '0') {
        //hide item
        if (item.assignment_isPublished != '1') continue;
        // TODO : update
      }
      switch (item.itemType) {
        case 'DoenetML':
          items.push(
            <DoenetML
              key={`item${itemId}${props.driveInstanceId}`}
              driveId={props.driveId}
              item={item}
              indentLevel={props.indentLevel + 1}
              driveInstanceId={props.driveInstanceId}
              route={props.route}
              isNav={props.isNav}
              pathItemId={props.pathItemId}
              clickCallback={props.clickCallback}
              doubleClickCallback={props.doubleClickCallback}
              deleteItem={deleteItemCallback}
              numColumns={props.numColumns}
              columnTypes={props.columnTypes}
            />,
          );
          break;
        case 'DragShadow':
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
    <div data-cy="drive">
      {folder}
      {items}
    </div>
  );
}

export default Collection;
