import { faShare } from '@fortawesome/free-solid-svg-icons';
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

function PagesInACollectionOptions({doenetId,manuallyFilteredPages=[]}){
  let collectionItemObj = useRecoilValue(itemByDoenetId(doenetId));
  let PageOptionsJSX = []
  let pages = collectionItemObj?.pages ? collectionItemObj?.pages : []
  for (let [i,pageId] of pages.entries()){
    if (manuallyFilteredPages.includes(pageId)){
      PageOptionsJSX.push(<PageOption selected i={i} pageId={pageId} />)
    }else{
      PageOptionsJSX.push(<PageOption i={i} pageId={pageId} />)
    }

  }
  return <>{PageOptionsJSX}</>
}

export default function SelectedCollectionAlias() {
  // const setPageToolView = useSetRecoilState(pageToolViewAtom);

  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(itemByDoenetId(doenetId));
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
    <FontAwesomeIcon icon={faShare} /> {itemObj.label} 
  </h2>)


  if (canEditContent !== '1') {
    return null;
  }

 let collectionsInCourseJSX = <CollectionSelectionOptions courseId={courseId} selectedDoenetId={itemObj.collectionDoenetId} />

 let pageAliasesJSX = null;
 
 if (itemObj.collectionDoenetId){
   
   let pagesFromCollectionJSX = <PagesInACollectionOptions doenetId={itemObj.collectionDoenetId} manuallyFilteredPages={itemObj.manuallyFilteredPages} />;

  pageAliasesJSX = <><div style={{display: "flex"}}>
  <Checkbox
    style={{ marginRight: '5px' }}
    checked={itemObj.isManuallyFiltered}
    onClick={()=>{
      updateCollectionAlias({doenetId, collectionDoenetId:itemObj.collectionDoenetId,isManuallyFiltered:!itemObj.isManuallyFiltered,manuallyFilteredPages:itemObj.manuallyFilteredPages})
    }}
/>Filter Page Aliases</div>
    <RelatedItems
      width="menu"
      options={pagesFromCollectionJSX}
      disabled={!itemObj.isManuallyFiltered}
      onChange={(e) => {
        let values = Array.from(
            e.target.selectedOptions,
            (option) => option.value,
          );
      updateCollectionAlias({doenetId, collectionDoenetId:itemObj.collectionDoenetId,isManuallyFiltered:itemObj.isManuallyFiltered,manuallyFilteredPages:values})

          // setManuallyFilteredPages(values)
      // updateOrderBehavior({doenetId, behavior, numberToSelect, withReplacement, restrictPages:!restrictPages, selectedCollectionDoenetId, restrictToThesePages:values})

        // //TODO: Clara please build this in to RelatedItems
        // let emailAddresses = Array.from(
        //   e.target.selectedOptions,
        //   (option) => option.value,
        // );
        // updateRestrictedTo({ courseId, doenetId, emailAddresses });
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
          updateCollectionAlias({doenetId, collectionDoenetId:e.target.value, isManuallyFiltered:false,manuallyFilteredPages:[]})
        }}
      />
      <br />
      {pageAliasesJSX}
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
