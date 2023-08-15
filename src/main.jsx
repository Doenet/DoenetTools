import React from "react";
import ReactDOM from "react-dom/client";
import {TestViewer} from "./test/testViewer";

ReactDOM.createRoot(document.getElementById("root")).render(<TestViewer />);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  // console.log(">>>import.meta.hot")
  // import.meta.hot.accept(({module}) => {
  //   console.log(">>>ACCEPT CALLED!!!!!!!!!")
  // }
  // );
  import.meta.hot.accept();
}
