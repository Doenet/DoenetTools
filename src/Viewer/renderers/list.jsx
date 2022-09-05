import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import VisibilitySensor from 'react-visibility-sensor-v2';

export default React.memo(function List(props) {
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

  // TODO: incorporate label
  if (SVs.item) {
    return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility} requireContentsSize={false}><><a name={id} /><li id={id}>{children}</li></></VisibilitySensor>;
  } else if (SVs.numbered) {
    return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><><ol id={id}><a name={id} />{children}</ol></></VisibilitySensor>;
  } else {
    return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><><ul id={id}><a name={id} />{children}</ul></></VisibilitySensor>;
  }

})

