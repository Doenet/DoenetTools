import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authorCollectionsByCourseId, itemByDoenetId, selectedCourseItems, useCourse } from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { useToast } from '../Toast';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import RelatedItems from '../../../_reactComponents/PanelHeaderComponents/RelatedItems';
import Checkbox from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
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

function PageOption({selected,i,pageId}){
  let pageObj = useRecoilValue(itemByDoenetId(pageId));

  if (selected){
    return <option selected key={`PagesInACollection${i}`} value={pageId}>{pageObj.label}</option>
  }else{
    return <option key={`PagesInACollection${i}`} value={pageId}>{pageObj.label}</option>
  }
}

export default function SelectedCollectionLink() {
  // const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(itemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { canEditContent } = useRecoilValue(
    effectivePermissionsByCourseId(courseId),
  );
  const [itemTextFieldLabel,setItemTextFieldLabel] = useState(itemObj.label)
  let { deleteItem, updateCollectionLink, updateContentLinksToSources } = useCourse(courseId);
  

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
        effectiveItemLabel = 'Untitled Collection Link';
      }

      setItemTextFieldLabel(effectiveItemLabel);
      addToast('Every item must have a label.');
    }
    //Only update the server when it changes
    if (itemObj.label !== effectiveItemLabel){
      console.log("Rename",doenetId,effectiveItemLabel)
      // renameItem(doenetId,effectiveItemLabel)
      updateCollectionLink({courseId, doenetId, label:effectiveItemLabel, collectionDoenetId:itemObj.collectionDoenetId,isManuallyFiltered:itemObj.isManuallyFiltered,manuallyFilteredPages:itemObj.manuallyFilteredPages})

    }
  };

  const addToast = useToast();
  let heading = (<h2 data-test="infoPanelItemLabel" style={{ margin: "16px 5px" }} >
    <FontAwesomeIcon icon={faLink} /> {itemObj.label} 
  </h2>)


  if (canEditContent !== '1') {
    return null;
  }

 let collectionsInCourseJSX = <CollectionSelectionOptions courseId={courseId} selectedDoenetId={itemObj.collectionDoenetId} />

 let pageAliasesJSX = null;
 
 if (itemObj.collectionDoenetId){
   
   let storedPageOptionsJSX = [];

   for (let [i,pageId] of Object.entries(itemObj.pagesByCollectionSource[itemObj.collectionDoenetId])){
    let selected = false;
    if (itemObj?.manuallyFilteredPages && itemObj.manuallyFilteredPages.includes(pageId)){
      selected = true
    }
    storedPageOptionsJSX.push(<PageOption selected={selected} i={i} pageId={pageId} />)
   }

  pageAliasesJSX = <><div style={{display: "flex"}}>
  <Checkbox
    style={{ marginRight: '5px' }}
    checked={itemObj.isManuallyFiltered}
    onClick={()=>{
      updateCollectionLink({courseId, doenetId, collectionDoenetId:itemObj.collectionDoenetId,isManuallyFiltered:!itemObj.isManuallyFiltered,manuallyFilteredPages:itemObj.manuallyFilteredPages})
    }}
/>Filter Page Links</div>
    <RelatedItems
      width="menu"
      options={storedPageOptionsJSX}
      disabled={!itemObj.isManuallyFiltered}
      onChange={(e) => {
        let values = Array.from(
            e.target.selectedOptions,
            (option) => option.value,
          );
        updateCollectionLink({courseId, doenetId, collectionDoenetId:itemObj.collectionDoenetId,isManuallyFiltered:itemObj.isManuallyFiltered,manuallyFilteredPages:values})
      }}
      multiple
    />
    <br />
    </>
 }

  
  return <>
  {heading}
  <Textfield
      label="Label"
      vertical
      width="menu"
      data-test="Label Collection"
      value={itemTextFieldLabel}
      onChange={(e) => setItemTextFieldLabel(e.target.value)}
      onKeyDown={(e) => {
        if (e.keyCode === 13) handelLabelModfication();
      }}
      onBlur={handelLabelModfication}
    />
    <br />
    <br />
    <div>collection</div>
  <RelatedItems
        width="menu"
        options={collectionsInCourseJSX}
        onChange={(e) => {
          //Clear out manual pages on change
          // console.log("collectionDoenetId",e.target.value)
          updateCollectionLink({courseId, doenetId, collectionDoenetId:e.target.value, isManuallyFiltered:false,manuallyFilteredPages:[]})
        }}
      />
      <br />
      {pageAliasesJSX}
      <br />
    <Button
    width="menu"
    value="Update Content to Sources"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      updateContentLinksToSources({collectionLinkObj:itemObj,pages:itemObj.pages});
    }}
    />
      <br />
    <Button
      width="menu"
      value="Delete Collection Link"
      alert
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteItem({doenetId});
      }}
    />
  </>
}
