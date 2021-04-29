import React, { useEffect, useState } from 'react';
import Tool from '@Tool';
import { useToolControlHelper } from '@ToolRoot';
import { useToast } from '@Toast';
// import CollapseSection from "../imports/CollapseSection";
// import SectionDivider from "../imports/PanelHeaderComponents/SectionDivider";

const XView = ({ x }) => {
  return <div>{x}</div>;
};
export default function DoenetExampleTool() {
  // console.log("=== DoenetExampleTool");
  const [x, set] = useState(0);
  const { openOverlay, activateMenuPanel } = useToolControlHelper();
  const [toast, toastType] = useToast();

  useEffect(() => {
    activateMenuPanel(1);
  }, [activateMenuPanel]);

  return (
    <Tool>
      <navPanel isInitOpen>
        <XView x={x} />
        <button
          onClick={() => {
            set((x) => x + 1);
          }}
        >
          x + 1
        </button>
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" /> */}
      </navPanel>

      <headerPanel title="Doenet Example Tool"></headerPanel>

      <mainPanel responsiveControls={<p>test</p>}>
        {/* responsiveControls={<BreadcrumbContainer />} */}
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" /> */}
      </mainPanel>

      <supportPanel isInitOpen>
        <p>Support Panel</p>
      </supportPanel>

      <menuPanel title="edit" isInitOpen>
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

      <footerPanel>
        <p>Hello from the bottom</p>
      </footerPanel>
    </Tool>
  );
}
