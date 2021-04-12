import React, { useEffect } from 'react';
import Tool from '../_framework/Tool';
import { useToolControlHelper } from '../_framework/ToolRoot';
// import Drive from "../imports/Drive";
// import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { useToast } from '../_framework/Toast';
// import CollapseSection from "../imports/CollapseSection";
// import SectionDivider from "../imports/PanelHeaderComponents/SectionDivider";

export default function  Course() {
  // console.log("=== DoenetExampleTool");

  const { openOverlay, activateMenuPanel } = useToolControlHelper();
  const [toast, toastType] = useToast();

  useEffect(() => {
    activateMenuPanel(1);
  }, [activateMenuPanel]);

  return (
    <Tool>
     <headerPanel title="Course" />
     <mainPanel>
       Course Tool
      </mainPanel>
    </Tool>
  );
}
