import React, { useEffect, useState } from "react";
import Tool from "../Tool";
import { useToolControlHelper } from "../ToolRoot";
import { useRecoilValue, atom, useSetRecoilState } from "recoil";

const stateTest = atom({
  key: "stateTest",
  default: 0,
});

function Consumer() {
  const state = useRecoilValue(stateTest);
  return <div>{state}</div>;
}

export default function Editor({ contentId, branchId }) {
  const setState = useSetRecoilState(stateTest);
  const { open } = useToolControlHelper();

  useEffect(() => {
    //init code here
    console.log(">>>Editor Init");
    return () => {
      console.log(">>>Editor exit");
      setState(0);
    }; //cleanup code here
  }, []);

  return (
    <Tool>
      <headerPanel></headerPanel>

      <mainPanel>
        <Consumer />
        This is the editor on branch: {branchId} with content: {contentId}
      </mainPanel>

      <supportPanel></supportPanel>

      <menuPanel title={"actions"}>
        <button onClick={() => setState((old) => old + 1)}>add one</button>
        <button onClick={() => open("calendar", "fasdf", "f1234")}>
          open Cal
        </button>
      </menuPanel>
    </Tool>
  );
}
