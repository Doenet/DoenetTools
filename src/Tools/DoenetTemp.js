import React, { useEffect } from "react";
import Tool from "../imports/Tool/Tool";
import { useToolControlHelper } from "../imports/Tool/ToolRoot";
import Drive from "../imports/Drive";
import { BreadcrumbContainer } from "../imports/Breadcrumb";

export default function DoenetTemp() {
  // console.log("=== DoenetExampleTool");

  const { open, setMenuPanel } = useToolControlHelper();

  // useEffect(() => {
  //   setMenuPanel(1);
  // }, []);

  return (
    <Tool>
      <navPanel>
        <p>nav</p>
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" /> */}
      </navPanel>

      <headerPanel title="Doenet Temp Tool"></headerPanel>

      <mainPanel>
      <button
          onClick={() => {
            open("editor", "ku_n7AXkAlEkZqNEvX_Vo", ""); //Current working version when contentId is blank
          }}
        >
          Open Editor with Main Example
        </button>
      </mainPanel>

      <supportPanel width="40%">
        <p>Support Panel</p>
      </supportPanel>

      <menuPanel title="select">
      <p>select</p>
      </menuPanel>

      <menuPanel title="+Add">
        <p>Add</p>
      </menuPanel>
    </Tool>
  );
}
