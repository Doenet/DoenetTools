import React from "react";
import useDoenetRender from "../useDoenetRenderer";
import Button from "../../_reactComponents/PanelHeaderComponents/Button";

export default React.memo(function PaginatorControls(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props, false);

  if (SVs.hidden) {
    return null;
  }

  return (
    <p id={id}>
      <a name={id} />
      <div id={id} margin="12px 0" style={{ display: "inline-block" }}>
        <Button
          id={id + "_previous"}
          onClick={() => {
            callAction({
              action: actions.setPage,
              args: { number: SVs.currentPage - 1 },
            });
          }}
          disabled={SVs.disabled || !(SVs.currentPage > 1)}
          value={SVs.previousLabel}
        />
      </div>
      {" " + SVs.pageLabel} {SVs.currentPage} of {SVs.numPages + " "}
      <div id={id} margin="12px 0" style={{ display: "inline-block" }}>
        <Button
          id={id + "_next"}
          onClick={() => {
            callAction({
              action: actions.setPage,
              args: { number: SVs.currentPage + 1 },
            });
          }}
          disabled={SVs.disabled || !(SVs.currentPage < SVs.numPages)}
          value={SVs.nextLabel}
        />
      </div>
    </p>
  );
});
