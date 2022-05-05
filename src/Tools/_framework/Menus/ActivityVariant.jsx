import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../NewToolRoot';
import { activityVariantPanelAtom } from '../ToolHandlers/CourseToolHandler';

export default function ActivityVariant(props) {

  const [variantPanel, setVariantPanel] = useRecoilState(activityVariantPanelAtom);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  function updateVariantInfoAtom() {
    setPageToolView((was) => {
      let newObj = { ...was };
      if (newObj.params) {
        newObj.params = { ...newObj.params };
      } else {
        newObj.params = {};
      }

      newObj.params.requestedVariant = variantPanel.index && Number.isFinite(Number(variantPanel.index))
        ? Number(variantPanel.index) : 1;

      return newObj;
    })
  }



  return <div style={props.style}>
    <div><label>Variant Index <input type="text" value={variantPanel.index} onKeyDown={(e) => {
      if (e.key === 'Enter') { updateVariantInfoAtom() }
    }} onBlur={() => updateVariantInfoAtom()} onChange={(e) => {
      setVariantPanel(
        (was) => {
          let newObj = { ...was }
          newObj.index = e.target.value;
          return newObj;
        })
    }} /></label></div>

  </div>
}