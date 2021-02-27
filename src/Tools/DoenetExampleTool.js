import React, { useEffect } from "react";
import Tool from "../imports/Tool/Tool";
import { useToolControlHelper } from "../imports/Tool/ToolRoot";
import Drive from "../imports/Drive";
import { BreadcrumbContainer } from "../imports/Breadcrumb";

export default function DoenetExampleTool() {
  // console.log("=== DoenetExampleTool");

  const { open, activateMenuPanel } = useToolControlHelper();

  useEffect(() => {
    activateMenuPanel(1);
  }, []);

  return (
    <Tool>
      <navPanel>
        <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" />
      </navPanel>

      <headerPanel title="Doenet Example Tool"></headerPanel>

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
