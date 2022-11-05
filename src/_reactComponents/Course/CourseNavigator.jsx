/**
 * External dependencies
 */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Measure from 'react-measure';
import {
  // faLink,
  faCode,
  faFileCode,
  faFileExport,
  faLayerGroup,
  faFolderTree,
  faChevronRight,
  faChevronDown,
  // faUsersSlash,
  // faUsers,
  faCheck,
  faLink,
  // faRightToBracket,
  // faUserEdit,
  // faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  useRecoilValue,
  useRecoilCallback,
  useSetRecoilState,
} from 'recoil';

import { 
  itemByDoenetId,
  useInitCourseItems,
  selectedCourseItems,
  authorCourseItemOrderByCourseIdBySection,
  studentCourseItemOrderByCourseIdBySection
} from '../../_reactComponents/Course/CourseActions';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import '../../_utils/util.css';
import { searchParamAtomFamily } from '../../Tools/_framework/NewToolRoot';
import { mainPanelClickAtom } from '../../Tools/_framework/Panels/NewMainPanel';  
import { selectedMenuPanelAtom } from '../../Tools/_framework/Panels/NewMenuPanel';
import { effectivePermissionsByCourseId } from '../PanelHeaderComponents/RoleDropdown';
import Button from '../PanelHeaderComponents/Button';
import ButtonGroup from '../PanelHeaderComponents/ButtonGroup';

const ToggleCloseIconStyling = styled.button`
  border: none;
  border-radius: 35px;
  &:focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`;

export default function CourseNavigator(props) {
  // console.log("=== CourseNavigator")
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const sectionId = useRecoilValue(searchParamAtomFamily('sectionId'));
  const {canViewUnassignedContent} = useRecoilValue(effectivePermissionsByCourseId(courseId));

  useInitCourseItems(courseId);
  const [numberOfVisibleColumns,setNumberOfVisibleColumns] = useState(1);
  let setMainPanelClick = useSetRecoilState(mainPanelClickAtom);

  let clearSelections = useRecoilCallback(({snapshot,set})=> async ()=>{
    const selectedItems = await snapshot.getPromise(selectedCourseItems);
    set(selectedMenuPanelAtom,null);
    set(selectedCourseItems,[]);
    for (let deselectId of selectedItems){
      set(itemByDoenetId(deselectId),(was)=>{
          let newObj = {...was};
          newObj.isSelected = false;
          return newObj;
        })
    }
 
  })

  useEffect(()=>{
    setMainPanelClick((was)=>{
      let newObj = [...was];
      newObj.push(clearSelections)
      return newObj;
    })
  },[clearSelections, setMainPanelClick])

  if (canViewUnassignedContent == '0' || props.displayRole == 'student'){
    return <StudentCourseNavigation courseNavigatorProps={props} courseId={courseId} sectionId={sectionId} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  }
  if (canViewUnassignedContent == '1' || props.displayRole == 'instructor'){
    return <AuthorCourseNavigation courseNavigatorProps={props} courseId={courseId} sectionId={sectionId} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  }
  return null;


}

function StudentCourseNavigation({courseId,sectionId,numberOfVisibleColumns,setNumberOfVisibleColumns,courseNavigatorProps}){
  let studentItemOrder = useRecoilValue(studentCourseItemOrderByCourseIdBySection({courseId,sectionId}));
  console.log("studentItemOrder",studentItemOrder)
  let previousSections = useRef([]);
  let definedForSectionId = useRef("");
  //If sectionId changes clear out previousSections
  if (definedForSectionId.current != sectionId){
    previousSections.current = []
    definedForSectionId.current = sectionId;
  }
  //TODO: use student information here?
  let items = [];
  studentItemOrder.map((doenetId)=>
    items.push(<StudentItem key={`itemcomponent${doenetId}`} courseId={courseId} doenetId={doenetId}  indentLevel={0} previousSections={previousSections} courseNavigatorProps={courseNavigatorProps} numberOfVisibleColumns={numberOfVisibleColumns} />)
  )
    
  return <>
  <CourseNavigationHeader courseId={courseId} sectionId={sectionId} columnLabels={["Due Date"]} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  {items}
  </>
}

function StudentItem({courseId,doenetId,numberOfVisibleColumns,indentLevel,previousSections,courseNavigatorProps}){
  //TODO: Investigate if type should be a selector and these three would subscribe to item info
  let itemInfo = useRecoilValue(itemByDoenetId(doenetId));

  if (itemInfo.type == 'section' && previousSections?.current){
    previousSections.current.push(itemInfo.doenetId);
  }
  if (previousSections?.current.includes(itemInfo.parentDoenetId)){
    return null;
  }
  if (itemInfo.type == 'section'){
  return <StudentSection key={`Item${doenetId}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel} />
  }else if (itemInfo.type == 'activity'){
    return <StudentActivity key={`Item${doenetId}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel} />
  }

  return null;
}

function StudentSection({courseId,doenetId,itemInfo,numberOfVisibleColumns,indentLevel,courseNavigatorProps}){
  let studentSectionItemOrder = useRecoilValue(studentCourseItemOrderByCourseIdBySection({courseId,sectionId:itemInfo.doenetId}));
  let previousSections = useRef([]);

  if (itemInfo.isOpen){
    let sectionItems = studentSectionItemOrder.map((doenetId)=>
    <StudentItem key={`itemcomponent${doenetId}`} courseNavigatorProps={courseNavigatorProps} previousSections={previousSections} courseId={courseId} doenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel+1} />)
    
    return <>
    <Row courseId={courseId} courseNavigatorProps={courseNavigatorProps} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFolderTree} label={itemInfo.label} doenetId={doenetId} hasToggle={true} isOpen={itemInfo.isOpen} isSelected={itemInfo.isSelected} indentLevel={indentLevel} />
    {sectionItems}
    </>

  }else{
    return <Row courseId={courseId} courseNavigatorProps={courseNavigatorProps} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFolderTree} label={itemInfo.label} doenetId={doenetId} hasToggle={true} isOpen={itemInfo.isOpen} isSelected={itemInfo.isSelected} indentLevel={indentLevel} />
  }
}

function StudentActivity({courseId,doenetId,itemInfo,numberOfVisibleColumns,indentLevel,courseNavigatorProps}){
  let columnsJSX = [null]
  if (itemInfo.dueDate){
    columnsJSX[0] = <span key={`activityColumn2${doenetId}`}>{itemInfo.dueDate}</span>
  }
    return <>
    <Row courseId={courseId} courseNavigatorProps={courseNavigatorProps} columnsJSX={columnsJSX} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFileCode} label={itemInfo.label} doenetId={doenetId} isSelected={itemInfo.isSelected} indentLevel={indentLevel} isBeingCut={itemInfo.isBeingCut}/>
     </>
}

function AuthorCourseNavigation({courseId,sectionId,numberOfVisibleColumns,setNumberOfVisibleColumns,courseNavigatorProps}){
  let authorItemOrder = useRecoilValue(authorCourseItemOrderByCourseIdBySection({courseId,sectionId}));
  console.log(`authorItemOrder CourseId-${courseId}-SectionId-${sectionId}-`,authorItemOrder)

  let previousSections = useRef([]);
  let definedForSectionId = useRef("");
  //If sectionId changes clear out previousSections
  if (definedForSectionId.current != sectionId){
    previousSections.current = []
    definedForSectionId.current = sectionId;
  }

  let items = authorItemOrder.map((doenetId)=>
    <Item key={`itemcomponent${doenetId}`} courseNavigatorProps={courseNavigatorProps} previousSections={previousSections} courseId={courseId} doenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={0} />)
    
  return <>
  <CourseNavigationHeader courseId={courseId} sectionId={sectionId} columnLabels={["Assigned","Public"]} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  {items}
  </>
}

function Item({courseId,doenetId,numberOfVisibleColumns,indentLevel,previousSections,courseNavigatorProps}){
  //TODO: Investigate if type should be a selector and these three would subscribe to item info
  let itemInfo = useRecoilValue(itemByDoenetId(doenetId));

  if (itemInfo.type == 'section' && previousSections?.current){
    previousSections.current.push(itemInfo.doenetId);
  }
  if (previousSections?.current.includes(itemInfo.parentDoenetId)){
    return null;
  }
  if (itemInfo.type == 'section'){
  return <Section key={`Item${doenetId}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel} />
  }else if (itemInfo.type == 'bank'){
    return <Bank key={`Item${doenetId}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel} />
  }else if (itemInfo.type == 'activity'){
    return <Activity key={`Item${doenetId}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel} />
  }

  return null;
}

function Section({courseId,doenetId,itemInfo,numberOfVisibleColumns,indentLevel,courseNavigatorProps}){
  let authorSectionItemOrder = useRecoilValue(authorCourseItemOrderByCourseIdBySection({courseId,sectionId:itemInfo.doenetId}));
  let previousSections = useRef([]);
  let columnsJSX = [null,null]
  if (itemInfo.isAssigned){
    columnsJSX[0] = <FontAwesomeIcon key={`activityColumn2${doenetId}`} icon={faCheck} />
  }
  
  if (itemInfo.isOpen){
    let sectionItems = authorSectionItemOrder.map((doenetId)=>
    <Item key={`itemcomponent${doenetId}`} courseNavigatorProps={courseNavigatorProps} previousSections={previousSections} courseId={courseId} doenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel+1} />)
    
    return <>
    <Row courseId={courseId} columnsJSX={columnsJSX} courseNavigatorProps={courseNavigatorProps} isBeingCut={itemInfo.isBeingCut} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFolderTree} label={itemInfo.label} doenetId={doenetId} hasToggle={true} isOpen={itemInfo.isOpen} isSelected={itemInfo.isSelected} indentLevel={indentLevel} />
    {sectionItems}
    </>

  }else{
    return <Row courseId={courseId} columnsJSX={columnsJSX} courseNavigatorProps={courseNavigatorProps} isBeingCut={itemInfo.isBeingCut} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFolderTree} label={itemInfo.label} doenetId={doenetId} hasToggle={true} isOpen={itemInfo.isOpen} isSelected={itemInfo.isSelected} indentLevel={indentLevel} />
  }
}

function Bank({courseId,doenetId,itemInfo,numberOfVisibleColumns,indentLevel,courseNavigatorProps}){
  if (itemInfo.isOpen){
    let pages = itemInfo.pages.map((pageDoenetId,i)=>{
      return <Page key={`Page${pageDoenetId}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} doenetId={pageDoenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel + 1} number={i+1} />
    })

  return <>
  <Row courseId={courseId} courseNavigatorProps={courseNavigatorProps} numberOfVisibleColumns={numberOfVisibleColumns} icon={faLayerGroup} label={itemInfo.label} doenetId={doenetId} hasToggle={true} isOpen={itemInfo.isOpen} isSelected={itemInfo.isSelected} isBeingCut={itemInfo.isBeingCut} indentLevel={indentLevel} />
    {pages}
  </>
  }else{
    return <Row courseId={courseId} courseNavigatorProps={courseNavigatorProps} numberOfVisibleColumns={numberOfVisibleColumns} icon={faLayerGroup} label={itemInfo.label} doenetId={doenetId} hasToggle={true} isOpen={itemInfo.isOpen} isSelected={itemInfo.isSelected} isBeingCut={itemInfo.isBeingCut} indentLevel={indentLevel} />
  }
}

function Activity({courseId,doenetId,itemInfo,numberOfVisibleColumns,indentLevel,courseNavigatorProps}){

  let columnsJSX = [null,null]
  if (itemInfo.isAssigned){
    columnsJSX[0] = <FontAwesomeIcon key={`activityColumn2${doenetId}`} icon={faCheck} />
  }
  if (itemInfo.isPublic){
    columnsJSX[1] = <FontAwesomeIcon key={`activityColumn3${doenetId}`} icon={faCheck} />
  }
  if (itemInfo.isSinglePage){
    return <>
    <Row courseId={courseId} courseNavigatorProps={courseNavigatorProps} columnsJSX={columnsJSX} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFileCode} label={itemInfo.label} doenetId={doenetId} isSelected={itemInfo.isSelected} indentLevel={indentLevel} isBeingCut={itemInfo.isBeingCut}/>
     </>
  }
  if (itemInfo.isOpen){
    let childRowsJSX = itemInfo.content.map((collectionLinkPageOrOrder,i)=>{
      if (collectionLinkPageOrOrder?.type == 'order'){
        return <Order key={`Order${i}${doenetId}`} courseNavigatorProps={courseNavigatorProps} orderInfo={collectionLinkPageOrOrder} courseId={courseId} activityDoenetId={doenetId} numberOfVisibleColumns={1} indentLevel={indentLevel + 1} />
      }else if (!collectionLinkPageOrOrder?.type){
        return <Page key={`NavPage${i}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} doenetId={collectionLinkPageOrOrder} activityDoenetId={itemInfo.doenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel + 1} />
      }else if (collectionLinkPageOrOrder?.type == 'collectionLink'){
        return <CollectionLink key={`CollectionLink${i}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} collectionLinkInfo={collectionLinkPageOrOrder} activityDoenetId={itemInfo.doenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel + 1} />
      }
    })
    return <>
    <Row courseId={courseId} courseNavigatorProps={courseNavigatorProps} columnsJSX={columnsJSX} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFileCode} label={itemInfo.label} doenetId={doenetId}  hasToggle={true} isOpen={itemInfo.isOpen} isSelected={itemInfo.isSelected} indentLevel={indentLevel}  isBeingCut={itemInfo.isBeingCut}/>
    {childRowsJSX}
     </>
  }else{
    return <>
    <Row courseId={courseId} courseNavigatorProps={courseNavigatorProps} columnsJSX={columnsJSX} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFileCode} label={itemInfo.label} doenetId={doenetId} hasToggle={true} isOpen={itemInfo.isOpen}  isSelected={itemInfo.isSelected} indentLevel={indentLevel}  isBeingCut={itemInfo.isBeingCut}/>
     </>
  }
}

function Order({courseId,activityDoenetId,numberOfVisibleColumns,indentLevel,orderInfo,courseNavigatorProps}){
  let {behavior,doenetId,content, numberToSelect, withReplacement} = orderInfo;
  let recoilOrderInfo = useRecoilValue(itemByDoenetId(doenetId));
  
   let contentJSX = [];
   if (behavior == 'sequence'){
      contentJSX = content.map((collectionLinkPageOrOrder,i)=>{
        if (collectionLinkPageOrOrder?.type == 'order'){
          return <Order key={`Order${i}${doenetId}`} courseNavigatorProps={courseNavigatorProps} orderInfo={collectionLinkPageOrOrder} courseId={courseId} activityDoenetId={doenetId} numberOfVisibleColumns={1} indentLevel={indentLevel + 1} />
        }else if(collectionLinkPageOrOrder?.type == 'collectionLink'){
          return <CollectionLink key={`CollectionLink${i}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} collectionLinkInfo={collectionLinkPageOrOrder} activityDoenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel + 1} />
        }else{
          return <Page key={`NavPage${i}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} doenetId={collectionLinkPageOrOrder} activityDoenetId={activityDoenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel + 1} number={i+1}/>
        }
      })
    }else{
      //All other behaviors
      contentJSX = content.map((collectionLinkPageOrOrder,i)=>{
        if (collectionLinkPageOrOrder?.type == 'order'){
          return <Order key={`Order${i}${doenetId}`} courseNavigatorProps={courseNavigatorProps} orderInfo={collectionLinkPageOrOrder} courseId={courseId} activityDoenetId={doenetId} numberOfVisibleColumns={1} indentLevel={indentLevel + 1} />
        }else if(collectionLinkPageOrOrder?.type == 'collectionLink'){
          return <CollectionLink key={`CollectionLink${i}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} collectionLinkInfo={collectionLinkPageOrOrder} activityDoenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel + 1} />
        }else{
          return <Page key={`NavPage${i}`} courseNavigatorProps={courseNavigatorProps} courseId={courseId} doenetId={collectionLinkPageOrOrder} activityDoenetId={activityDoenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel + 1} />
        }
      })
    }

    let label = behavior;
    if (behavior == "select"){
      if (withReplacement){
        label = `${behavior} ${numberToSelect} with replacement`
      }else{
        label = `${behavior} ${numberToSelect} without replacement`

      }
    }

  if (recoilOrderInfo.isOpen){
    return <>
    <Row courseId={courseId} isBeingCut={recoilOrderInfo.isBeingCut} courseNavigatorProps={courseNavigatorProps} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFileExport} label={label} doenetId={doenetId} hasToggle={true} isOpen={recoilOrderInfo.isOpen} isSelected={recoilOrderInfo.isSelected} indentLevel={indentLevel}/>
    {contentJSX}
    </>
  }else{
    return <Row courseId={courseId} isBeingCut={recoilOrderInfo.isBeingCut} courseNavigatorProps={courseNavigatorProps} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFileExport} label={label} doenetId={doenetId} hasToggle={true} isOpen={recoilOrderInfo.isOpen} isSelected={recoilOrderInfo.isSelected} indentLevel={indentLevel}/>
  }
}

function Page({courseId,doenetId,activityDoenetId,numberOfVisibleColumns,indentLevel,number=null,courseNavigatorProps}){
  let recoilPageInfo = useRecoilValue(itemByDoenetId(doenetId));
  //TODO: numbered
  return <Row courseId={courseId} courseNavigatorProps={courseNavigatorProps} numberOfVisibleColumns={numberOfVisibleColumns} icon={faCode} label={recoilPageInfo.label} doenetId={recoilPageInfo.doenetId} indentLevel={indentLevel} numbered={number} isSelected={recoilPageInfo.isSelected} isBeingCut={recoilPageInfo.isBeingCut}/>
}

function CollectionLinkChildren({courseId, indentLevel, pages, courseNavigatorProps}){
  
  if (!pages){ return null; } 

  let pageLinksJSX = []
  for (let [i,pageId] of pages.entries()){
    pageLinksJSX.push(<PageLink courseId={courseId} doenetId={pageId} number={i+1} indentLevel={indentLevel+1} courseNavigatorProps={courseNavigatorProps}/>)
  }

  return <>{pageLinksJSX}</>
}

function CollectionLink({courseId,numberOfVisibleColumns,indentLevel,number=null,courseNavigatorProps,collectionLinkInfo}){
  let { doenetId } = collectionLinkInfo;
  let collectionLinkRecoilPageInfo = useRecoilValue(itemByDoenetId(doenetId));

  let collectionLinkChildrenJSX = null;

  if (collectionLinkRecoilPageInfo.isOpen){
    let pages = collectionLinkRecoilPageInfo.pages;
    // console.log("nav pages",pages)
    collectionLinkChildrenJSX = <CollectionLinkChildren courseId={courseId} indentLevel={indentLevel} pages={pages} courseNavigatorProps={courseNavigatorProps}/>
  }

  return <>
  <Row courseId={courseId} courseNavigatorProps={courseNavigatorProps} hasToggle={true} isOpen={collectionLinkRecoilPageInfo.isOpen} numberOfVisibleColumns={numberOfVisibleColumns} icon={faLink} label={collectionLinkRecoilPageInfo.label} doenetId={doenetId} indentLevel={indentLevel} numbered={number} isSelected={collectionLinkRecoilPageInfo.isSelected} isBeingCut={collectionLinkRecoilPageInfo.isBeingCut}/>
  {collectionLinkChildrenJSX}
  </>
}

function PageLink({courseId,doenetId,indentLevel,numberOfVisibleColumns,number=null,courseNavigatorProps}){
  let recoilPageInfo = useRecoilValue(itemByDoenetId(doenetId));
  return <Row courseId={courseId} itemType="pageLink" courseNavigatorProps={courseNavigatorProps} numberOfVisibleColumns={numberOfVisibleColumns} icon={faLink} label={`Page Link of ${recoilPageInfo.label}`} doenetId={doenetId} indentLevel={indentLevel} numbered={number} isSelected={recoilPageInfo.isSelected} isBeingCut={recoilPageInfo.isBeingCut}/>
}

function Row({courseId,doenetId,itemType,numberOfVisibleColumns,columnsJSX=[],icon,label,isSelected=false,indentLevel=0,numbered,hasToggle=false,isOpen,isBeingCut=false,courseNavigatorProps}){
  const setSelectionMenu = useSetRecoilState(selectedMenuPanelAtom);

  let openCloseIndicator = null;
  let toggleOpenClosed = useRecoilCallback(({set})=>()=>{
    set(itemByDoenetId(doenetId),(was)=>{
      let newObj = {...was};
      newObj.isOpen = !newObj.isOpen;
      return newObj;
    })

  },[doenetId])

  

  //Selection is based on course items and Recoil
  //Always append to the end of the array so we know the last selected item
  let handleSingleSelectionClick = useRecoilCallback(({snapshot,set})=> async (e)=>{
    e.preventDefault();
    e.stopPropagation();
    let selectedItems = await snapshot.getPromise(selectedCourseItems);
    // let clickedItem = await snapshot.getPromise(itemByDoenetId(doenetId));
    // console.log(`clickedItem type:"${clickedItem.type}" doenetId:"${clickedItem.doenetId}"`,clickedItem)
    
    let newSelectedItems = [];

    if (selectedItems.length == 0){
    //No items selected so select this item
    newSelectedItems = [doenetId]
    set(itemByDoenetId(doenetId),(was)=>{
      let newObj = {...was};
      newObj.isSelected = true;
      return newObj;
    })

    }else if (selectedItems.length == 1 && selectedItems[0] == doenetId){
      if(e.metaKey){
        //If cmd then clear the one item
        newSelectedItems = [];
        set(itemByDoenetId(doenetId),(was)=>{
          let newObj = {...was};
          newObj.isSelected = false;
          return newObj;
        })
      }else{
        //Just keep the one item selected
        newSelectedItems = [...selectedItems];
      }

    }else{
      if (e.shiftKey){
        //Shift Click
        //Select all items from the last one selected to this one
        let sectionId = await snapshot.getPromise(searchParamAtomFamily('sectionId'))
        if (!sectionId){
          sectionId = courseId;
        }
        const authorItemDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId}))
        // const authorItemDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId))
        //build allRenderedRows on the fly
        let allRenderedRows = [];
        let skip = false;
        let parentDoenetIdsToSkip = [];
        for (let i = 0; i < authorItemDoenetIds.length; i++){
          let itemDoenetId = authorItemDoenetIds[i];
          const authorItemInfo = await snapshot.getPromise(itemByDoenetId(itemDoenetId))
          if (skip){
            //Check if back to same parent
            if (!parentDoenetIdsToSkip.includes(authorItemInfo.parentDoenetId)){
              skip = false;
              parentDoenetIdsToSkip = [];
            }else{
              //Test if we need to add another child to the ids to skip
              if (authorItemInfo.type == 'order'){
                parentDoenetIdsToSkip.push(authorItemInfo.doenetId)
              }
            }
          }
          if (!skip){
            allRenderedRows.push(itemDoenetId);
            //Start skip when we have a closed item
            if (authorItemInfo?.isOpen !== undefined && !authorItemInfo.isOpen){
              skip = true;
              parentDoenetIdsToSkip.push(authorItemInfo.doenetId);
            }
          }
        }
  
        let lastSelectedDoenetId = selectedItems[selectedItems.length -1];
        let indexOfLastSelected = allRenderedRows.indexOf(lastSelectedDoenetId);
        let indexOfClick = allRenderedRows.indexOf(doenetId);
        let itemsToSelect = allRenderedRows.slice(Math.min(indexOfLastSelected,indexOfClick),(Math.max(indexOfLastSelected,indexOfClick)+1))
        //Need to reverse when the new last item won't be at the end
        if (indexOfLastSelected > indexOfClick){
          itemsToSelect.reverse();
        }
        newSelectedItems = [...selectedItems];
        for (let newDoenetId of itemsToSelect){
          if (!selectedItems.includes(newDoenetId)){
            newSelectedItems.push(newDoenetId);
            set(itemByDoenetId(newDoenetId),(was)=>{
              let newObj = {...was};
              newObj.isSelected = true;
              return newObj;
            })
          }
        }
      }else if(e.metaKey){
        //Command Click means toggle the one item selected or not
        let itemWasSelected = selectedItems.includes(doenetId);
        if (itemWasSelected){
          newSelectedItems = selectedItems.filter((testId)=>{return testId != doenetId});
          set(itemByDoenetId(doenetId),(was)=>{
            let newObj = {...was};
            newObj.isSelected = false;
            return newObj;
          })

        }else{
          //Add this item to the selected items
          newSelectedItems = [...selectedItems,doenetId];
          set(itemByDoenetId(doenetId),(was)=>{
            let newObj = {...was};
            newObj.isSelected = true;
            return newObj;
          })
        }
      }else{

        //No Shift or Command Click
        //Only select this option and remove the others
        newSelectedItems = [doenetId];
        set(itemByDoenetId(doenetId),(was)=>{
                  let newObj = {...was};
                  newObj.isSelected = true;
                  return newObj;
                })
        for (let doenetIdToUnselect of selectedItems){
          if (doenetId != doenetIdToUnselect){ //Leave the selected on selected
            set(itemByDoenetId(doenetIdToUnselect),(was)=>{
              let newObj = {...was};
              newObj.isSelected = false;
              return newObj;
            })
          }
        }
      }
    }
    let singleItem = null;
    if (newSelectedItems.length == 1){
      // if (itemType == 'pageLink'){
      //   singleItem = {type:'pageLink'} //Isn't entered into itemByDoenetId
      // }else{
        singleItem = await snapshot.getPromise(itemByDoenetId(newSelectedItems[0]));
      // }
    }

    set(selectedCourseItems,newSelectedItems);
    courseNavigatorProps?.updateSelectMenu({selectedItems:newSelectedItems,singleItem});

  },[doenetId, courseId, setSelectionMenu])

  let bgcolor = 'var(--canvas)';
  let color = 'var(--canvastext)';
  if (isSelected){
    color= 'black';
    bgcolor = 'var(--lightBlue)';
  }else if (isBeingCut){
    bgcolor = 'var(--mainGray)'; //grey
  }

  if (hasToggle){
    openCloseIndicator = isOpen ? (
        <ToggleCloseIconStyling 
          data-text="folderToggleCloseIcon" 
          aria-expanded="true"
          style={{backgroundColor: bgcolor}}
          onClick={ ()=>{
            if (hasToggle){
            toggleOpenClosed();
          }}} 
          onKeyDown={(e)=>{
            if (e.key === "enter") {
              if (hasToggle){
                toggleOpenClosed();
              }
            }
          }} 
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </ToggleCloseIconStyling>
      ) : (
        <ToggleCloseIconStyling 
          dataTest="folderToggleOpenIcon" 
          aria-expanded="false"
          style={{backgroundColor: bgcolor}}
          onClick={ ()=>{
            if (hasToggle){
            toggleOpenClosed();
          }}}
          onKeyDown={(e)=>{
            if (e.key === "enter") {
              if (hasToggle){
                toggleOpenClosed();
              }
            }
          }}  
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </ToggleCloseIconStyling>
      );
  }

  //Used to open editor or assignment
  let handleDoubleClick = useRecoilCallback(()=> async (e)=>{
    e.preventDefault();
    e.stopPropagation();
    courseNavigatorProps?.doubleClickItem({doenetId,courseId});
  },[doenetId,courseId,courseNavigatorProps]);

  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);
  const indentPx = 25;

  let activityJSX = (
    <div 
    key={`Row${doenetId}`}
    role="button"
    tabIndex={0}
    className="navigationRow noselect nooutline"
    style={{
      cursor: 'pointer',
      padding: '8px',
      border: '0px',
      borderBottom: '2px solid var(--canvastext)',
      backgroundColor: bgcolor,
      color: color,
      width: 'auto',
      // marginLeft: marginSize,
    }}
    onClick={(e)=>{
      handleSingleSelectionClick(e);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        if (bgcolor === 'var(--canvas)') {
          handleSingleSelectionClick(e);
        } else {
          if (e.key === 'Enter' && e.metaKey) {
            handleSingleSelectionClick(e);
          } else {
            handleDoubleClick(e);
          }
        }
      }
    }}
    onDoubleClick={(e)=>{
      handleDoubleClick(e);
    }}
    >
    <div
      style={{
        
        display: 'grid',
        gridTemplateColumns: columnsCSS,
        gridTemplateRows: '1fr',
        alignContent: 'center',
        // marginTop: '8px',
        // marginBottom: '8px',
      }}
    >
      <span 
       className='navigationColumn1'
      style={{ 
        marginLeft: `${indentLevel * indentPx}px`
      }}>

      <p style={{ 
        display: 'inline', 
        margin: '0px' }} >
       { numbered ?  <svg style={{verticalAlign:'middle'}} width="22" height="22" viewBox="0 0 22 22">
      <circle cx="11"
              cy="11"
              r="12"
              stroke="var(--canvas)"
              strokeWidth="2"
              fill="var(--mainBlue)"/>
      <text fontSize="14"
            fill="var(--canvas)"
            fontFamily="Verdana"
            textAnchor="middle"
            alignmentBaseline="baseline"
            x="11"
            y="16">{numbered}</text>
  </svg>: null }
        {openCloseIndicator}
        <span style={{marginLeft:'8px'}} data-test="rowIcon">
          <FontAwesomeIcon icon={icon} />
        </span>
        <span style={{marginLeft:'4px'}} data-test="rowLabel">{label} </span>
      </p>
      </span>
    {numberOfVisibleColumns > 1 ? <span className='navigationColumn2' style={{ textAlign: 'center' }}>{columnsJSX[0]}</span> : null}
    {numberOfVisibleColumns > 2 ? <span className='navigationColumn3' style={{ textAlign: 'center' }}>{columnsJSX[1]}</span> : null}
    {numberOfVisibleColumns > 3 ? <span className='navigationColumn4' style={{ textAlign: 'center' }}>{columnsJSX[2]}</span> : null}
    {numberOfVisibleColumns > 4 ? <span className='navigationColumn5' style={{ textAlign: 'center' }}>{columnsJSX[3]}</span> : null}
      </div>
    </div>
  )
  
  return <>{activityJSX}</>
}

function getColumnsCSS(numberOfVisibleColumns){
  let columnsCSS = '300px repeat(4,1fr)'; //5 columns max
  if (numberOfVisibleColumns === 4) {
    columnsCSS = '300px repeat(3,1fr)';
  } else if (numberOfVisibleColumns === 3) {
    columnsCSS = '300px 1fr 1fr';
  } else if (numberOfVisibleColumns === 2) {
    columnsCSS = '300px 1fr';
  } else if (numberOfVisibleColumns === 1) {
    columnsCSS = '100%';
  }
  return columnsCSS;

}

function CourseNavigationHeader({courseId,sectionId,columnLabels,numberOfVisibleColumns,setNumberOfVisibleColumns}){
  // console.log("===CourseNavigationHeader")
  
  let openCloseAll = useRecoilCallback(({set,snapshot})=>async ({isOpen=true,courseId,sectionId})=>{
    if (!sectionId){sectionId = courseId;}
    let doenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId}))
    for (let doenetId of doenetIds){
      set(itemByDoenetId(doenetId),(prev)=>{
        let next = {...prev}
        if ('isOpen' in next){ //is something that we can open
          next.isOpen = isOpen;
        }
        return next;
      })
    }
  },[])

  const updateNumColumns = useCallback(
    (width) => {
      const maxColumns = columnLabels.length + 1;
      
      //update number of columns in header
      const breakpoints = [375, 500, 650, 800];
      if (width >= breakpoints[3] && 
        numberOfVisibleColumns !== 5
        ) {
        const nextNumberOfVisibleColumns = Math.min(maxColumns, 5);
        setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
      } else if (
        width < breakpoints[3] &&
        width >= breakpoints[2] &&
        numberOfVisibleColumns !== 4 

      ) {
        const nextNumberOfVisibleColumns = Math.min(maxColumns, 4);
        setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
      } else if (
        width < breakpoints[2] &&
        width >= breakpoints[1] &&
        numberOfVisibleColumns !== 3 
      ) {
        const nextNumberOfVisibleColumns = Math.min(maxColumns, 3);
        setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
      } else if (
        width < breakpoints[1] &&
        width >= breakpoints[0] &&
        numberOfVisibleColumns !== 2 
      ) {
        const nextNumberOfVisibleColumns = Math.min(maxColumns, 2);
        setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
      } else if (width < breakpoints[0] && 
        numberOfVisibleColumns !== 1
        ) {
        setNumberOfVisibleColumns?.(1);
      }else if  (numberOfVisibleColumns > maxColumns) {
        //If over the max set to max
        setNumberOfVisibleColumns?.(maxColumns);

      
      }
    },
    [columnLabels, numberOfVisibleColumns, setNumberOfVisibleColumns],
  );

  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);

  return (
    <Measure
      bounds
      onResize={(contentRect) => {
        const width = contentRect.bounds.width;
        // console.log("width",width)
        // latestWidth.current = width;
        updateNumColumns(width);
      }}
    >
      {({ measureRef }) => (
        <div
          ref={measureRef}
          className="noselect nooutline"
          style={{
            padding: '8px',
            border: '0px',
            borderBottom: '1px solid var(--canvastext)',
            maxWidth: '850px',
            margin: '0px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: columnsCSS,
              gridTemplateRows: '1fr',
              alignContent: 'center',
            }}
          >
            <span style={{display:"flex"}}><span style={{marginRight:"10px"}}>Label</span>
            <ButtonGroup>
            <Button value='Open All' onClick={()=>openCloseAll({isOpen:true,courseId,sectionId})}/>
            <Button value='Close All'  onClick={()=>openCloseAll({isOpen:false,courseId,sectionId})}/>
            </ButtonGroup>
            </span>
            {numberOfVisibleColumns >= 2 && columnLabels[0] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[0]}</span>
            ) : null}
            {numberOfVisibleColumns >= 3 && columnLabels[1] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[1]}</span>
            ) : null}
            {numberOfVisibleColumns >= 4 && columnLabels[2] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[2]}</span>
            ) : null}
            {numberOfVisibleColumns >= 5 && columnLabels[3] ? (
              <span style={{ textAlign: 'center' }}>{columnLabels[3]}</span>
            ) : null}
          </div>
        </div>
      )}
    </Measure>
  );

}
