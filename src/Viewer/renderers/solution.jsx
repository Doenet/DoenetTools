import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece as puzzle } from '@fortawesome/free-solid-svg-icons';
import VisibilitySensor from 'react-visibility-sensor-v2';
import styled from 'styled-components';
const SpanStyling= styled.span`
display: block;
margin: SVs.open ? 12px 4px 0px 4px : 12px 4px 12px 4px;
padding: 6px;
border: 2px solid black;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
border-bottom-left-radius: SVs.open ? 0px : 5px;
border-bottom-right-radius: SVs.open ? 0px : 5px;
background-color: var(--mainGray);
cursor: pointer;
&: focus {
  outline: 2px solid var(--canvastext);
  outline-offset: 2px;
}
`;

const BlockStyling= styled.span`
&: focus {
  outline: 2px solid var(--canvastext);
  outline-offset: 2px;
}
`;
export default React.memo(function Solution(props) {
  let { name, id, SVs, children, actions, callAction } = useDoenetRender(props);

  let onChangeVisibility = isVisible => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible }
    })
  }

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false }
      })
    }
  }, [])

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
      border: '2px solid var(--canvastext)',
      borderTop: '0px',
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
      backgroundColor: 'var(--canvas)',
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
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
    <aside id={id}  style={{ margin: "12px 0" }}>
      <a name={id} />
      <SpanStyling
        tabIndex="0"
        id={id + '_button'}
        onClick={onClickFunction}
      >
        {icon} Solution {SVs.message}
      </SpanStyling>
      <BlockStyling style={infoBlockStyle} tabIndex="0">{childrenToRender}</BlockStyling>
    </aside>
    </VisibilitySensor>
  );
})
