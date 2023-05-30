import React, { useEffect } from "react";
import useDoenetRender from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import VisibilitySensor from "react-visibility-sensor-v2";

export default React.memo(function Tabular(props) {
  let { name, id, SVs, children, actions, callAction } = useDoenetRender(props);

  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible },
    });
  };

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false },
      });
    };
  }, []);

  if (SVs.hidden) {
    return null;
  }

  const tableStyle = {
    width: sizeToCSS(SVs.width),
    height: sizeToCSS(SVs.height),
    borderCollapse: "collapse",
    borderColor: "black",
    borderRadius: "var(--mainBorderRadius)",
  };

  let options = [
    "mean",
    "stdev",
    "variance",
    "stderr",
    "count",
    "minimum",
    "quartile1",
    "median",
    "quartile3",
    "maximum",
    "range",
    "sum",
  ];

  let columns = options.filter((x) => x in SVs.summaryStatistics);

  let heading = (
    <tr>
      {columns.map((x, i) => (
        <th key={i}>{x}</th>
      ))}
    </tr>
  );
  let data = (
    <tr>
      {columns.map((x, i) => (
        <td key={i}>{SVs.summaryStatistics[x]}</td>
      ))}
    </tr>
  );

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div style={{ margin: "12px 0" }}>
        <a name={id} />
        <p>Summary statistics of {SVs.columnName}</p>
        <table id={id} style={tableStyle}>
          <tbody>
            {heading}
            {data}
          </tbody>
        </table>
      </div>
    </VisibilitySensor>
  );
});
