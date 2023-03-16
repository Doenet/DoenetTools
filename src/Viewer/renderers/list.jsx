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
    let list_style = styleTypeByLevel.numbered[(SVs.level - 1) % styleTypeByLevel.numbered.length];
    return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><><ol id={id} style={{ listStyleType: list_style }}><a name={id} />{children}</ol></></VisibilitySensor>;
  } else {
    let list_style = styleTypeByLevel.unnumbered[(SVs.level - 1) % styleTypeByLevel.unnumbered.length];
    return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><><ul id={id} style={{ listStyleType: list_style }}><a name={id} />{children}</ul></></VisibilitySensor>;
  }

})

const styleTypeByLevel = {
  numbered: ["decimal", "lower-alpha", "lower-roman", "upper-alpha", "upper-roman"],
  unnumbered: ["disc", "circle", "square"],

}
