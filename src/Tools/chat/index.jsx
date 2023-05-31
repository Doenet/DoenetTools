import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import ToolRoot from "@ToolRoot";

import Chat from "./Chat";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "doenetml";

const root = createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <MathJaxContext
      version={2}
      config={mathjaxConfig}
      onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
    >
      <ToolRoot tool={<Chat key={"BaseTool"} />} />
    </MathJaxContext>
  </RecoilRoot>,
);
