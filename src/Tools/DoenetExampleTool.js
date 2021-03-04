import React, { useEffect } from "react";
import Tool from "../imports/Tool/Tool";
import { useToolControlHelper } from "../imports/Tool/ToolRoot";
import Drive from "../imports/Drive";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { useToast } from "../imports/Tool/Toast";

export default function DoenetExampleTool() {
  // console.log("=== DoenetExampleTool");

  const { open, activateMenuPanel } = useToolControlHelper();
  const toast = useToast();

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

      <supportPanel>
        <p>Support Panel</p>
      </supportPanel>

      <menuPanel title="edit">
        <button
          onClick={() => {
            toast("hello from Toast!", 3000);
          }}
        >
          Toast!
        </button>
        <button
          onClick={() => {
            toast("Other Toast!", 1000);
          }}
        >
          Other Toast!
        </button>
        <button
          onClick={() => {
            toast("hello from Toast!", 3000);
          }}
        >
          Toast Test!
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
