import React from "react";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";

import { useUpdateViewer } from "../ToolPanels/EditorViewer";

export default function ViewerUpdateButton(props) {
  const updateViewer = useUpdateViewer();

  return (
    <div style={props.style}>
      <Button
        data-test="Viewer Update Button"
        value="Update"
        onClick={updateViewer}
      />
    </div>
  );
}
