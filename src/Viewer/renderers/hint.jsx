import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb as lightOff } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as lightOn } from '@fortawesome/free-regular-svg-icons';
import { faCaretRight as twirlIsClosed } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown as twirlIsOpen } from '@fortawesome/free-solid-svg-icons';
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
const BlockStyling = styled.span`
  &: focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`;


export default React.memo(function Hint(props) {
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

  if (!SVs.showHints) {
    return null;
  }


  let title;
  // BADBADBAD: need to redo how getting the title child
  // getting it using the internal guts of componentInstructions
  // is just asking for trouble
  if (SVs.titleChildName) {
    for (let [ind, child] of children.entries()) {
      //child might be a string
      if (child.props?.componentInstructions.componentName === SVs.titleChildName) {
        title = children[ind];
        children.splice(ind, 1); // remove title
        break;
      }
    }

  }

  if (!title) {
    title = SVs.title;
  }


  //let twirlIcon = <FontAwesomeIcon icon={twirlIsClosed} />;
  let icon = <FontAwesomeIcon icon={lightOff} />;
  let info = null;
  let infoBlockStyle = { display: 'none' };
  let onClickFunction = () => {
    callAction({
      action: actions.revealHint,
    });
  };
  let  onKeyPressFunction = (e) => {
    if(e.key === "Enter"){
      callAction({
        action: actions.revealHint,
      });
    }
  };

  let openCloseText = 'open';

  if (SVs.open) {
   // twirlIcon = <FontAwesomeIcon icon={twirlIsOpen} />;
    openCloseText = 'close';
    icon = <FontAwesomeIcon icon={lightOn} />;
    info = children;
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
    onKeyPressFunction = (e) => {
      if(e.key === "Enter"){
        callAction({
          action: actions.closeHint,
        });
      }
    };
  
    onClickFunction = () => {
      callAction({
        action: actions.closeHint,
      });
    };
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
    <aside id={id} key={id}>
      <a name={id} />
      <SpanStyling

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
        tabIndex="0"
        data-test="hint-heading"
        onClick={onClickFunction}
        onKeyDown={onKeyPressFunction}
      > {icon} {title} (click to {openCloseText})
      </SpanStyling>
      <span style={infoBlockStyle} >{info}</span>
        tabIndex="0"
        data-test="hint-heading"
        onClick={onClickFunction}
      >
        {twirlIcon} {icon} {title} (click to {openCloseText})
      </SpanStyling>
      <BlockStyling style={infoBlockStyle} tabIndex="0">{info}</BlockStyling>
    </aside>
    </VisibilitySensor>
  );
})
