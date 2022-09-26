import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Increment from '../../../_reactComponents/PanelHeaderComponents/IncrementMenu';
import { activityVariantPanelAtom } from '../../../_sharedRecoil/PageViewerRecoil';
import { pageToolViewAtom } from '../NewToolRoot';


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
    <Increment 
    min={1} 
    value={variantPanel.index}
    onBlur={()=>updateVariantInfoAtom()} 
    onKeyDown={(e) => {
      if (e.key === 'Enter') { updateVariantInfoAtom() }
    }}
    onChange={(value)=>{
      setVariantPanel(
        (was) => {
          let newObj = { ...was }
          newObj.index = value;
          return newObj;
        })
    }}/>
  </div>
}