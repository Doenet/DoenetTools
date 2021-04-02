import React, { useEffect } from 'react';
import Tool from '../_framework/Tool';
import { useToolControlHelper } from '../_framework/ToolRoot';
// import Drive from "../imports/Drive";
// import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { useToast } from '../_framework/Toast';
// import CollapseSection from "../imports/CollapseSection";
// import SectionDivider from "../imports/PanelHeaderComponents/SectionDivider";

export default function DoenetExampleTool() {
  // console.log("=== DoenetExampleTool");

  const { openOverlay, activateMenuPanel } = useToolControlHelper();
  const [toast, toastType] = useToast();

  useEffect(() => {
    activateMenuPanel(1);
  }, [activateMenuPanel]);

  return (
    <Tool>
      <navPanel>
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" /> */}
      </navPanel>

      <headerPanel title="Doenet Example Tool"></headerPanel>

      <mainPanel>
        {/* responsiveControls={<BreadcrumbContainer />} */}
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" /> */}
      </mainPanel>

      <supportPanel isInitOpen>
        <p>Support Panel</p>
      </supportPanel>

      <menuPanel title="edit">
        <p>control important stuff</p>
        {/* <CollapseSection title="toasts"> */}
        {/* <SectionDivider type="double"> */}
        <p style={{ margin: 0 }}>SUCCESS</p>
        <button
          onClick={() => {
            toast('hello from SUCCESS Toast!', toastType.SUCCESS);
          }}
        >
          Toast!
        </button>
        <p style={{ margin: 0 }}>ERROR</p>
        <button
          onClick={() => {
            toast('hello from ERROR Toast!', toastType.ERROR);
          }}
        >
          Toast!
        </button>
        <p style={{ margin: 0 }}>INFO</p>
        <button
          onClick={() => {
            toast('hello from INFO Toast!', toastType.INFO);
          }}
        >
          Toast!
        </button>
        <p style={{ margin: 0 }}>Calendar</p>
        <button
          onClick={() => {
            openOverlay({
              type: 'calendar',
              title: 'Cal',
              branchId: 'fdsa',
            });
          }}
        >
          open
        </button>
        {/* </SectionDivider> */}
        {/* </CollapseSection> */}
      </menuPanel>

      <menuPanel title="other">
        <p>control more important stuff</p>
      </menuPanel>
    </Tool>
  );
}
