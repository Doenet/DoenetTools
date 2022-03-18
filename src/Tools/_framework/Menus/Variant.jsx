import React from 'react';
import { useRecoilState } from 'recoil';
import { variantInfoAtom, variantPanelAtom } from '../ToolHandlers/CourseToolHandler';

export default function Variant(props) {

  const [variantInfo, setVariantInfo] = useRecoilState(variantInfoAtom);
  const [variantPanel, setVariantPanel] = useRecoilState(variantPanelAtom);


  function updateVariantInfoAtom(source) {
    // console.log(">>>updateVariantInfoAtom")
    //Prevent calling when it didn't change
    if (source === 'Index') {
      if (variantPanel.index === variantInfo.index) {
        return;
      }
    }
    if (source === 'Name') {
      if (variantPanel.name === variantInfo.name) {
        return;
      }
    }
    setVariantInfo((was) => {
      let newObj = { ...was };
      newObj.index = Number.isFinite(Number(variantPanel.index)) ? Number(variantPanel.index) : 0;
      newObj.name = variantPanel.name;
      newObj.lastUpdatedIndexOrName = source;
      return newObj;
    })
  }


  //In the case allPossibleVariants isn't defined it's an empty array
  let allPossibleVariants = [];
  if (variantPanel.allPossibleVariants) {
    allPossibleVariants = variantPanel.allPossibleVariants
  }
  let optionsList = allPossibleVariants.map(function (s, i) {
    return <option key={i + 1} value={s}>{s}</option>
  });

  return <div style={props.style}>
    <div><label>Variant Index <input type="text" value={variantPanel?.index ?? "0"} onKeyDown={(e) => {
      if (e.key === 'Enter') { updateVariantInfoAtom('Index') }
    }} onBlur={() => updateVariantInfoAtom('Index')} onChange={(e) => {
      setVariantPanel(
        (was) => {
          let newObj = { ...was }
          newObj.index = e.target.value;
          return newObj;
        })
    }} /></label></div>

    <div><label>Variant Name
      <select value={variantPanel?.name ?? "a"} onChange={(e) => {
        setVariantInfo((was) => {
          let newObj = { ...was };
          newObj.name = e.target.value;
          newObj.lastUpdatedIndexOrName = 'Name';
          return newObj;
        })

      }}>
        {optionsList}
      </select></label></div>
  </div>
}