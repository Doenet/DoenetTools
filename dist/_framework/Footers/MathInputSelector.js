import React, {useEffect, useRef, useState, Suspense} from "../../_snowpack/pkg/react.js";
import {
  atom,
  useRecoilState,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValueLoadable
} from "../../_snowpack/pkg/recoil.js";
export const focusedMathFieldID = atom({
  key: "focusedMathFieldID",
  default: null
});
export const focusedMathField = atom({
  key: "focusedMathField",
  default: () => {
  }
});
export const focusedMathFieldReturn = atom({
  key: "focusedMathFieldReturn",
  default: () => {
  }
});
export const palletRef = atom({
  key: "palletRef",
  default: null
});
export const handleRef = atom({
  key: "handleRef",
  default: null
});
export const footerPanelToggle = atom({
  key: "footerPanelToggle",
  default: true
});
