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
    let list_style = styleTypeByLevel[SVs.level]?.numbered;
    if (!list_style) {
      list_style = "decimal";
    }
    return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><><ol id={id} style={{ listStyleType: list_style }}><a name={id} />{children}</ol></></VisibilitySensor>;
  } else {
    let list_style = styleTypeByLevel[SVs.level]?.unnumbered;
    if (!list_style) {
      list_style = "disc";
    }
    return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}><><ul id={id} style={{ listStyleType: list_style }}><a name={id} />{children}</ul></></VisibilitySensor>;
  }

})

const styleTypeByLevel = {
  1: {
    numbered: 'decimal',
    unnumbered: 'disc',
  },
  2: {
    numbered: "lower-alpha",
    unnumbered: 'circle',
  },
  3: {
    numbered: "lower-roman",
    unnumbered: 'square',
  },
  4: {
    numbered: "upper-alpha",
    unnumbered: 'disc',
  },
  5: {
    numbered: "upper-roman",
    unnumbered: 'circle',
  },
  6: {
    numbered: "decimal",
    unnumbered: 'square',
  },
}