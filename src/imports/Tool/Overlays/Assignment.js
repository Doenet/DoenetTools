import React from "react";
import Tool from "../Tool";

export default function Assignment({ contentId, branchId, assignmentId }) {
  return (
    <Tool>
      <headerPanel></headerPanel>

      <mainPanel>
        This is the Assignment on branch: {branchId}, with content: {contentId},
        assignment:
        {assignmentId}
      </mainPanel>

      <supportPanel></supportPanel>

      <menuPanel title={"actions"}></menuPanel>
    </Tool>
  );
}
