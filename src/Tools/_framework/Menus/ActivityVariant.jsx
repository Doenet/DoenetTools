import React from 'react';
import { useRecoilState } from 'recoil';
import { activityVariantInfoAtom, activityVariantPanelAtom } from '../ToolHandlers/CourseToolHandler';

export default function ActivityVariant(props) {

  const [variantInfo, setVariantInfo] = useRecoilState(activityVariantInfoAtom);
  const [variantPanel, setVariantPanel] = useRecoilState(activityVariantPanelAtom);

  function updateVariantInfoAtom() {
    //Prevent calling when it didn't change
    if (variantPanel.index === variantInfo.index) {
      return;
    }
    setVariantInfo((was) => {
      let newObj = { ...was };
      newObj.index = Number.isFinite(Number(variantPanel.index)) ? Number(variantPanel.index) : 0;
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