import React, { useEffect } from "react";
import Tool from "../imports/Tool/Tool";
import { useToolControlHelper } from "../imports/Tool/ToolRoot";
import Drive from "../imports/Drive";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
// import { useRecoilValue } from "recoil";

//example data acessing
// function OverlayDataViwer() {
//   const overlayData = useRecoilValue(openOverlayByName);

//   return (
//     <div>
//       <h2>Data</h2>
//       <ul>
//         <li> name: {overlayData.name} </li>
//         <li> action: {overlayData.instructions.action} </li>
//         <li> supportVisble: {overlayData.supportVisble} </li>
//         <li> courseId: {overlayData.instructions.courseId} </li>
//         <li> branchId: {overlayData.instructions.branchId} </li>
//       </ul>
//     </div>
//   );
// }

export default function DoenetExampleTool() {
  // console.log("=== DoenetExampleTool");

  const { open } = useToolControlHelper();

  return (
    <Tool>
      <navPanel>
        <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" />
      </navPanel>

      <headerPanel title="my title"></headerPanel>

      <mainPanel>
        <BreadcrumbContainer />
        <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" />
      </mainPanel>

      <supportPanel width="40%">
        <p>Support Panel</p>
      </supportPanel>

      <menuPanel title="edit">
        <button
          onClick={() => {
            open("editor", "fdsa", "f13");
          }}
        >
          Go to editor
        </button>
        <button
          onClick={() => {
            open("calendar", "fdsa", "f001");
          }}
        >
          Go to calendar
        </button>
        <p>control important stuff</p>
      </menuPanel>

      <menuPanel title="other">
        <p>control more important stuff</p>
      </menuPanel>
    </Tool>
  );
}
