import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authorCollectionsByCourseId, itemByDoenetId, selectedCourseItems, useCourse } from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { useToast } from '../Toast';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import RelatedItems from '../../../_reactComponents/PanelHeaderComponents/RelatedItems';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';

function CollectionSelectionOptions({courseId,selectedDoenetId}){
  let collectionNameAndDoenetIds = useRecoilValue(authorCollectionsByCourseId(courseId));
  let CollectionOptionsJSX = []
  for (let [i,obj] of collectionNameAndDoenetIds.entries()){
    if (selectedDoenetId == obj.doenetId){
      CollectionOptionsJSX.push(<option selected key={`CollectionOptions${i}`} value={obj.doenetId}>{obj.label}</option>)
    }else{
      CollectionOptionsJSX.push(<option key={`CollectionOptions${i}`} value={obj.doenetId}>{obj.label}</option>)
    }

  }
  return <>{CollectionOptionsJSX}</>
}

export default function SelectedCollectionAlias() {
  // const setPageToolView = useSetRecoilState(pageToolViewAtom);

  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(itemByDoenetId(doenetId));
  console.log("itemObj",itemObj)
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { canEditContent } = useRecoilValue(
    effectivePermissionsByCourseId(courseId),
  );
  const [itemTextFieldLabel,setItemTextFieldLabel] = useState(itemObj.label)
  let { deleteItem, renameItem, updateCollectionAlias } = useCourse(courseId);

  useEffect(()=>{
    if (itemTextFieldLabel !== itemObj.label){
      setItemTextFieldLabel(itemObj.label)
    }
  },[doenetId])

  const handelLabelModfication = () => {
    let effectiveItemLabel = itemTextFieldLabel;
    if (itemTextFieldLabel === '') {
      effectiveItemLabel = itemObj.label;
      if (itemObj.label === ''){
        effectiveItemLabel = 'Untitled Collection Alias';
      }

      setItemTextFieldLabel(effectiveItemLabel);
      addToast('Every item must have a label.');
    }
    //Only update the server when it changes
    if (itemObj.label !== effectiveItemLabel){
      console.log("Rename",doenetId,effectiveItemLabel)
      // renameItem(doenetId,effectiveItemLabel)
    }
  };

  const addToast = useToast();
  let heading = (<h2 data-test="infoPanelItemLabel" style={{ margin: "16px 5px" }} >
    <FontAwesomeIcon icon={faLayerGroup} /> {itemObj.label} 
  </h2>)


  if (canEditContent !== '1') {
    return null;
  }

 let collectionsInCourseJSX = <CollectionSelectionOptions courseId={courseId} selectedDoenetId={itemObj.collectionDoenetId} />

  
  return <>
  {heading}
  <Textfield
      label="Label"
      vertical
      width="menu"
      value={itemTextFieldLabel}
      onChange={(e) => setItemTextFieldLabel(e.target.value)}
      onKeyDown={(e) => {
        if (e.keyCode === 13) handelLabelModfication();
      }}
      onBlur={handelLabelModfication}
    />
    <br />
    <div>collection</div>
  <RelatedItems
        width="menu"
        options={collectionsInCourseJSX}
        onChange={(e) => {
          console.log("SELECTED ",e.target.value)
          updateCollectionAlias({doenetId, collectionDoenetId:e.target.value})
        }}
      />
      <br />
    <Button
      width="menu"
      value="Delete Collection Alias"
      alert
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("delete ",doenetId)
        // deleteItem({doenetId});
      }}
    />
  </>
}
