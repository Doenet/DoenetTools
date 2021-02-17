import React, { useEffect, useState } from "react";
import Tool from "../Tool";
import { useLayerControlHelper } from "../LayerRoot";

export default function Editor({ contentId, branchId }) {
  const [state, setState] = useState(0);
  const { open } = useLayerControlHelper();
  console.log(">>>editor");
  // useEffect((contentId, branchId) => {
  //   // init code
  //   return null; //cleanup code
  // }, []);
  return (
    <Tool isOverlay>
      <headerPanel></headerPanel>

      <mainPanel>
        {state}
        This is the editor on branch: {branchId} with content: {contentId}
      </mainPanel>

      <supportPanel></supportPanel>

      <menuPanel title={"actions"}>
        <button onClick={() => setState((old) => old + 1)}>add one</button>
        <button onClick={() => open("calendar", "fasdf", "f1234")}>
          open Cal
        </button>
      </menuPanel>
    </Tool>
  );
}
