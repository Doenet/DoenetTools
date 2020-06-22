import React from "react";
import SelectBox from "./SelectBox";

import "./selectbox.css";

export default function DropDownSelect() {
  return (
    <div className="drop-down-select">
      <div style={{ margin: "1px" }} />
      <SelectBox
        items={[
          { value: "Folder 1", id: 1 },
          { value: "Folder 2", id: 2 },
          { value: "Folder 3", id: 3 }
         
        ]}
      />
       
    </div>
  );
}


