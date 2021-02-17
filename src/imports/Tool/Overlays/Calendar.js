import React from "react";
import Tool from "../Tool";

export default function Calendar({ contentId, branchId }) {
  return (
    <Tool isOverlay>
      <headerPanel></headerPanel>

      <mainPanel>
        This is the calendar on branch: {branchId} with content: {contentId}
      </mainPanel>

      <supportPanel></supportPanel>

      <menuPanel title={"actions"}></menuPanel>
    </Tool>
  );
}
