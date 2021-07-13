import React from "../../_snowpack/pkg/react.js";
import {profileToolViewStashAtom} from "../Profile.js";
import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {toolViewAtom} from "../NewToolRoot.js";
export default function CloseProfileButton() {
  const closeProfile = useRecoilCallback(({set, snapshot}) => async () => {
    let stash = await snapshot.getPromise(profileToolViewStashAtom);
    if (stash?.toolViewAtom) {
      let newStash = {...stash.toolViewAtom};
      set(toolViewAtom, newStash);
      window.history.pushState("", "", stash.href);
    } else {
      location.href = "/new";
    }
  });
  return /* @__PURE__ */ React.createElement("button", {
    onClick: () => closeProfile()
  }, "Close");
}
