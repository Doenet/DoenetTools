import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment as thoughtBubble } from '@fortawesome/free-regular-svg-icons';
import VisibilitySensor from 'react-visibility-sensor-v2';

export default React.memo(function Feedback(props) {
  let { name, SVs, children, actions, callAction } = useDoenetRender(props);

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

  let icon = <FontAwesomeIcon icon={thoughtBubble} />;

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><>
      <span
        style={{
          display: 'block',
          margin: '12px 4px 0px 4px',
          padding: '6px',
          border: '2px solid black',
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
          backgroundColor: 'var(--mainGray)',
        }}
      >
        {icon} Feedback
      </span>
      <aside
        id={name}
        style={{
          backgroundColor: 'white',
          margin: '0px 4px 12px 4px',
          padding: '1em',
          border: '2px solid black',
          borderTop: '0px',
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
        }}
      >
        <a name={name} />

        {SVs.feedbackText}
        {children}
      </aside>
    </></VisibilitySensor>
  );
})
