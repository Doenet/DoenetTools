import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ColumnJSX } from './NewDrive';

const Collection = React.memo(function Collection(props) {
  const indentPx = 30;

  let woIndent = 250 - props.indentLevel * indentPx;

  let columns = `${woIndent}px repeat(4,1fr)`; //5 columns
  if (props.numColumns === 4) {
    columns = `${woIndent}px repeat(3,1fr)`;
  } else if (props.numColumns === 3) {
    columns = `${woIndent}px 1fr 1fr`;
  } else if (props.numColumns === 2) {
    columns = `${woIndent}px 1fr`;
  } else if (props.numColumns === 1) {
    columns = '100%';
  }

  let bgcolor = '#ffffff';
  let borderSide = '0px 0px 0px 0px';
  let widthSize = 'auto';
  let marginSize = '0';

  let column2 = ColumnJSX(props.columnTypes[0], props.item);
  let column3 = ColumnJSX(props.columnTypes[1], props.item);
  let column4 = ColumnJSX(props.columnTypes[2], props.item);
  let column5 = ColumnJSX(props.columnTypes[3], props.item);

  let label = props.item?.label;
  return (
    <div
      role="button"
      data-doenet-driveinstanceid={props.driveInstanceId}
      data-cy="driveItem"
      tabIndex={0}
      className="noselect nooutline"
      style={{
        cursor: 'pointer',
        padding: '8px',
        border: '0px',
        borderBottom: '2px solid black',
        backgroundColor: bgcolor,
        width: widthSize,
        // boxShadow: borderSide,
        marginLeft: marginSize,
      }}
      onKeyDown={(e) => {}}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.shiftKey && !e.metaKey) {
          props?.clickCallback?.({
            driveId: props.driveId,
            parentFolderId: props.item.parentFolderId,
            itemId: props.item.itemId,
            driveInstanceId: props.driveInstanceId,
            type: 'Collection',
            instructionType: 'one item',
          });
        } else if (e.shiftKey && !e.metaKey) {
          props?.clickCallback?.({
            driveId: props.driveId,
            parentFolderId: props.item.parentFolderId,
            itemId: props.item.itemId,
            driveInstanceId: props.driveInstanceId,
            type: 'Collection',
            instructionType: 'range to item',
          });
        } else if (!e.shiftKey && e.metaKey) {
          props?.clickCallback?.({
            driveId: props.driveId,
            parentFolderId: props.item.parentFolderId,
            itemId: props.item.itemId,
            driveInstanceId: props.driveInstanceId,
            type: 'Collection',
            instructionType: 'add item',
          });
        }
      }}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        props?.doubleClickCallback?.({
          driveId: props.driveId,
          item: props.item,
          driveInstanceId: props.driveInstanceId,
          route: props.route,
          isNav: props.isNav,
          pathItemId: props.pathItemId,
          type: 'Collection',
        });
      }}
    >
      <div
        style={{
          marginLeft: `${props.indentLevel * indentPx}px`,
          display: 'grid',
          gridTemplateColumns: columns,
          gridTemplateRows: '1fr',
          alignContent: 'center',
        }}
      >
        <p style={{ display: 'inline', margin: '0px' }}>
          <span data-cy="doenetMLIcon">
            <FontAwesomeIcon icon={faLayerGroup} />
          </span>
          <span data-cy="doenetMLLabel">{label} </span>
        </p>
        {props.numColumns >= 2 ? column2 : null}
        {props.numColumns >= 3 ? column3 : null}
        {props.numColumns >= 4 ? column4 : null}
        {props.numColumns >= 5 ? column5 : null}
      </div>
    </div>
  );
});

export default Collection;
