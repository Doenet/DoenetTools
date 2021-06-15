import React from "react";
import Tool from "../Tool";

export default function Image({ contentId, doenetId }) {
  return (
    <Tool>
      <headerPanel></headerPanel>

      <mainPanel>
        This is the image on doenetId: {doenetId} with content: {contentId}
      </mainPanel>

      <supportPanel></supportPanel>

      <menuPanel title={"actions"}></menuPanel>
    </Tool>
  );
}
