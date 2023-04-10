import React, { useEffect } from 'react';
import useDoenetRender from '../useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import VisibilitySensor from 'react-visibility-sensor-v2';

export default React.memo(function Tabular(props) {
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

const tableStyle = {
  width: sizeToCSS(SVs.width),
  height: sizeToCSS(SVs.height),
  borderCollapse: "collapse",
  borderColor: "var(--canvastext)", 
  borderRadius: "var(--mainBorderRadius)",
  tableLayout: "fixed"
}
if (SVs.top !== "none") {
  tableStyle.borderTopStyle = "solid";
  if (SVs.top === "minor") {
    tableStyle.borderTopWidth = "thin";
  } else if (SVs.top === "medium") {
    tableStyle.borderTopWidth = "medium";
  } else {
    tableStyle.borderTopWidth = "thick";
  }
}

return (
  <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
  <div style={{ margin: "12px 0" }} >
    <a name={id} />
    <table id={id} style={tableStyle}>
      <tbody>{children}</tbody>
    </table>
  </div>
  </VisibilitySensor>
  )
})

