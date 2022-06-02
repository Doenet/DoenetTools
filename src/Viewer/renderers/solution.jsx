import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece as puzzle } from '@fortawesome/free-solid-svg-icons';

export default React.memo(function Solution(props) {
  let { name, SVs, children, actions, callAction } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  let icon;
  let childrenToRender = null;
  let infoBlockStyle = { display: 'none' };

  let onClickFunction;
  let cursorStyle;

  if (SVs.open) {
    icon = <FontAwesomeIcon icon={puzzle} />;

    childrenToRender = children;
    infoBlockStyle = {
      display: 'block',
      margin: '0px 4px 12px 4px',
      padding: '6px',
      border: '2px solid black',
      borderTop: '0px',
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
      backgroundColor: 'white',
    };

    if (SVs.canBeClosed) {
      cursorStyle = 'pointer';
      onClickFunction = () => {
        callAction({
          action: actions.closeSolution,
        });
      };
    } else {
      onClickFunction = () => {};
    }
  } else {
    icon = <FontAwesomeIcon icon={puzzle} rotation={90} />;
    cursorStyle = 'pointer';
    onClickFunction = () => {
      callAction({
        action: actions.revealSolution,
      });
    };
  }

  return (
    <aside id={name}  style={{ margin: "12px 0" }}>
      <a name={name} />
      <span
        id={name + '_button'}
        style={{
          display: 'block',
          margin: SVs.open ? '12px 4px 0px 4px' : '12px 4px 12px 4px',
          padding: '6px',
          border: '2px solid black',
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
          borderBottomLeftRadius: SVs.open ? '0px' : '5px',
          borderBottomRightRadius: SVs.open ? '0px' : '5px',
          backgroundColor: 'var(--mainGray)',
          cursor: 'pointer',
        
        }}
        onClick={onClickFunction}
      >
        {icon} Solution {SVs.message}
      </span>
      <span style={infoBlockStyle}>{childrenToRender}</span>
    </aside>
  );
})
