import React from 'react';
import { useRecoilState } from 'recoil';
import { pageVariantInfoAtom, pageVariantPanelAtom } from '../ToolHandlers/CourseToolHandler';

export default function PageVariant(props) {

  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const [variantPanel, setVariantPanel] = useRecoilState(pageVariantPanelAtom);

  function updateVariantInfoAtom() {
    // console.log(">>>updateVariantInfoAtom")
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


  //In the case allPossibleVariants isn't defined it's an empty array
  let allPossibleVariants = [];
  if (variantPanel.allPossibleVariants) {
    allPossibleVariants = variantPanel.allPossibleVariants
  }
  let optionsList = allPossibleVariants.map(function (s, i) {
    return <option key={i + 1} value={i + 1}>{s}</option>
  });

  let isIgnoredVariant = variantPanel.variantIndicesToIgnore.includes(variantPanel.index)

  let style = {...props.style};
  let warningVariantIsIgnored = null;
  if(isIgnoredVariant) {
    style.backgroundColor="lightgray";
    warningVariantIsIgnored = <div><b>This variant is ignored!</b></div>
  }

  let haveIgnoredVariants = variantPanel.variantIndicesToIgnore.length > 0;
  let ignoredVariantListing = null;
  if(haveIgnoredVariants) {
    ignoredVariantListing = <div><label>Variant indices to ignore: </label> {variantPanel.variantIndicesToIgnore.join(", ")}</div>
  }

  return <div style={style}>
    {warningVariantIsIgnored}
    <div>Number of variants: {allPossibleVariants.length}</div>
    <div><label>Select variant Index <input type="text" value={variantPanel.index} onKeyDown={(e) => {
      if (e.key === 'Enter') { updateVariantInfoAtom() }
    }} onBlur={() => updateVariantInfoAtom()} onChange={(e) => {
      setVariantPanel(
        (was) => {
          let newObj = { ...was }
          newObj.index = e.target.value;
          return newObj;
        })
    }} /></label></div>

    <div><label>Select variant name
      <select value={variantPanel.index} onChange={(e) => {
        setVariantInfo((was) => {
          let newObj = { ...was };
          newObj.index = e.target.value;
          return newObj;
        })

      }}>
        {optionsList}
      </select></label></div>
    {ignoredVariantListing}
   
  </div>
}