import React from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb as lightOff } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as lightOn } from '@fortawesome/free-regular-svg-icons';
import { faCaretRight as twirlIsClosed } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown as twirlIsOpen } from '@fortawesome/free-solid-svg-icons';

export default function Hint(props) {
  let { name, SVs, children, actions, callAction } = useDoenetRender(props);

  if (!SVs.showHints) {
    return null;
  }

  let childrenToRender = children;

  let title = SVs.title;
  if (SVs.titleDefinedByChildren) {
    title = children[0];
    //BADBADBAD
    childrenToRender = children.slice(1); // remove title
  }

  let twirlIcon = <FontAwesomeIcon icon={twirlIsClosed} />;
  let icon = <FontAwesomeIcon icon={lightOff} />;
  let info = null;
  let infoBlockStyle = { display: 'none' };
  let onClickFunction = () => {
    callAction({
      action: actions.revealHint,
    });
  };

  let openCloseText = 'open';

  if (SVs.open) {
    twirlIcon = <FontAwesomeIcon icon={twirlIsOpen} />;
    openCloseText = 'close';
    icon = <FontAwesomeIcon icon={lightOn} />;
    info = childrenToRender;
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
    onClickFunction = () => {
      callAction({
        action: actions.closeHint,
      });
    };
  }

  return (
    <aside id={name} key={name}>
      <a name={name} />
      <span
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
        {twirlIcon} {icon} {title} (click to {openCloseText})
      </span>
      <span style={infoBlockStyle}>{info}</span>
    </aside>
  );
}
