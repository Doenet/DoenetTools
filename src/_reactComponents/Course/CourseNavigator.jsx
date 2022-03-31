/**
 * External dependencies
 */
import React, {
  // useContext,
  // useRef,
  // useEffect,
  // Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
// import axios from 'axios';
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
  // faCheck,
  // faUserEdit,
  // faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Link } from 'react-router-dom';
import {
  // atom,
  // atomFamily,
  // selector,
  // selectorFamily,
  // useSetRecoilState,
  // useRecoilValueLoadable,
  // useRecoilStateLoadable,
  // useRecoilState,
  useRecoilValue,
  useRecoilCallback,
  useSetRecoilState,
} from 'recoil';

import { 
  authorCourseItemOrderByCourseId, 
  authorItemByDoenetId,
  coursePermissionsAndSettingsByCourseId, 
  useInitCourseItems,
  selectedCourseItems
} from '../../_reactComponents/Course/CourseActions';

/**
 * Internal dependencies
 */
import '../../_utils/util.css';
import { searchParamAtomFamily } from '../../Tools/_framework/NewToolRoot';
import { mainPanelClickAtom } from '../../Tools/_framework/Panels/NewMainPanel';  
import { set } from 'lodash';

export default function CourseNavigator() {
  console.log("=== CourseNavigator")
  const [courseId] = useRecoilValue(searchParamAtomFamily('path')).split(':');
  let coursePermissionsAndSettings = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  useInitCourseItems(courseId);
  const [numberOfVisibleColumns,setNumberOfVisibleColumns] = useState(1);
  let setMainPanelClick = useSetRecoilState(mainPanelClickAtom);
  // const addToast = useToast();

  let clearSelections = useRecoilCallback(({snapshot,set})=> async ()=>{
    const selectedItems = await snapshot.getPromise(selectedCourseItems);
    set(selectedCourseItems,[]);
    for (let deselectId of selectedItems){
      set(authorItemByDoenetId(deselectId),(was)=>{
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
  },[])


  if (!coursePermissionsAndSettings){
    return null;
  }
  //TODO: use effective role
  if (coursePermissionsAndSettings.canEditContent == '1'){
    return <AuthorCourseNavigation courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  }else{
    return <StudentCourseNavigation courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  }


}

function StudentCourseNavigation({courseId,numberOfVisibleColumns,setNumberOfVisibleColumns}){
  let authorItemOrder = useRecoilValue(authorCourseItemOrderByCourseId(courseId));
  
  let items = [];
  authorItemOrder.map((doenetId)=>
    items.push(<Item key={`itemcomponent${doenetId}`} doenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns} />)
  )
    
  return <>
  <CourseNavigationHeader columnLabels={["Due Date"]} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  {items}
  </>
}

function AuthorCourseNavigation({courseId,numberOfVisibleColumns,setNumberOfVisibleColumns}){
  let authorItemOrder = useRecoilValue(authorCourseItemOrderByCourseId(courseId));
  
  let items = [];
  authorItemOrder.map((doenetId)=>
    items.push(<Item key={`itemcomponent${doenetId}`} courseId={courseId} doenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={0} />)
  )
    
  return <>
  <CourseNavigationHeader columnLabels={["Assigned","Public"]} numberOfVisibleColumns={numberOfVisibleColumns} setNumberOfVisibleColumns={setNumberOfVisibleColumns} />
  {items}
  </>
}

function Item({courseId,doenetId,numberOfVisibleColumns,indentLevel}){
  //TODO: Investigate if contentType should be a selector and these three would subscribe to item info
  let itemInfo = useRecoilValue(authorItemByDoenetId(doenetId));

  if (itemInfo.contentType == 'section'){
    return <Section key={`Item${doenetId}`} courseId={courseId} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel} />
  }else if (itemInfo.contentType == 'bank'){
    return <Bank key={`Item${doenetId}`} courseId={courseId} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel} />
  }else if (itemInfo.contentType == 'activity'){
    return <Activity key={`Item${doenetId}`} courseId={courseId} doenetId={doenetId} itemInfo={itemInfo} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel} />
  }

  return null;
}

function Section({courseId,doenetId,itemInfo,numberOfVisibleColumns,indentLevel}){
  return <Row courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFolderTree} label={itemInfo.label} doenetId={doenetId} isSelected={itemInfo.isSelected} indentLevel={indentLevel} />
}

function Bank({courseId,doenetId,itemInfo,numberOfVisibleColumns,indentLevel}){
  if (itemInfo.isOpen){
    let pages = itemInfo.pages.map((pageDoenetId,i)=>{
      return <Page key={`Page${pageDoenetId}`} courseId={courseId} doenetId={pageDoenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel + 1} number={i+1} />
    })

  return <>
  <Row courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} icon={faLayerGroup} label={itemInfo.label} doenetId={doenetId} hasToggle={true} isOpen={itemInfo.isOpen} isSelected={itemInfo.isSelected} indentLevel={indentLevel} />
    {pages}
  </>
  }else{
    return <Row courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} icon={faLayerGroup} label={itemInfo.label} doenetId={doenetId} hasToggle={true} isOpen={itemInfo.isOpen} isSelected={itemInfo.isSelected} indentLevel={indentLevel} />
  }
}

function Activity({courseId,doenetId,itemInfo,numberOfVisibleColumns,indentLevel}){
  if (itemInfo.isOpen){
    return <>
    <Row courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFileCode} label={itemInfo.label} doenetId={doenetId}  hasToggle={true} isOpen={itemInfo.isOpen} isSelected={itemInfo.isSelected} indentLevel={indentLevel}/>
    <Order key={`Order${doenetId}`} orderInfo={itemInfo.order} courseId={courseId} activityDoenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel} />
     </>
  }else{
    return <>
    <Row courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFileCode} label={itemInfo.label} doenetId={doenetId} hasToggle={true} isOpen={itemInfo.isOpen}  isSelected={itemInfo.isSelected} indentLevel={indentLevel}/>
     </>
  }
}

function Order({courseId,activityDoenetId,numberOfVisibleColumns,indentLevel,orderInfo}){
  let {behavior,doenetId,content} = orderInfo;
  let recoilOrderInfo = useRecoilValue(authorItemByDoenetId(doenetId));

   let contentJSX = [];
   if (behavior == 'sequence'){
      contentJSX = content.map((pageOrOrder,i)=>{
        if (pageOrOrder?.contentType == 'order'){
          return <Order key={`Order${doenetId}`} orderInfo={pageOrOrder} courseId={courseId} activityDoenetId={doenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel + 1} />
        }else{
          return <Page key={`Page${doenetId}`} courseId={courseId} doenetId={pageOrOrder} activityDoenetId={activityDoenetId} numberOfVisibleColumns={numberOfVisibleColumns} indentLevel={indentLevel + 1} number={i+1}/>
        }
      })
    }
    //TODO: handle other behaviors

  if (recoilOrderInfo.isOpen){
    return <>
    <Row courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFileExport} label={behavior} doenetId={doenetId} hasToggle={true} isOpen={recoilOrderInfo.isOpen} isSelected={recoilOrderInfo.isSelected} indentLevel={indentLevel + 1}/>
    {contentJSX}
    </>
  }else{
    return <Row courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} icon={faFileExport} label={behavior} doenetId={doenetId} hasToggle={true} isOpen={recoilOrderInfo.isOpen} isSelected={recoilOrderInfo.isSelected} indentLevel={indentLevel + 1}/>
  }
}

function Page({courseId,doenetId,activityDoenetId,numberOfVisibleColumns,indentLevel,number=null}){
  let recoilPageInfo = useRecoilValue(authorItemByDoenetId(doenetId));
  //TODO: numbered
  return <Row courseId={courseId} numberOfVisibleColumns={numberOfVisibleColumns} icon={faCode} label={recoilPageInfo.label} doenetId={recoilPageInfo.doenetId} indentLevel={indentLevel} numbered={number} isSelected={recoilPageInfo.isSelected} />
}

//singleClickHandler,doubleClickHandler,isContainer,columnsJSX=[]
function Row({courseId,doenetId,numberOfVisibleColumns,icon,label,isSelected=false,indentLevel=0,numbered,hasToggle=false,isOpen}){
  

  let openCloseIndicator = null;
  let toggleOpenClosed = useRecoilCallback(({set})=>()=>{
    set(authorItemByDoenetId(doenetId),(was)=>{
      let newObj = {...was};
      newObj.isOpen = !newObj.isOpen;
      return newObj;
    })

  },[doenetId])

if (hasToggle){
   openCloseIndicator = isOpen ? (
      <span data-cy="folderToggleCloseIcon" >
        <FontAwesomeIcon icon={faChevronDown} />
      </span>
    ) : (
      <span data-cy="folderToggleOpenIcon">
        <FontAwesomeIcon icon={faChevronRight} />
      </span>
    );
}

//TODO: HANDLE WHAT HAS TO MOVE TOGETHER AND DON'T ALLOW SELECTING SETS OF ITEMS WHICH DON'T MAKE SENSE TO MOVE TOGETHER
//Selection is based on course items and Recoil
//Always append to the end of the array so we know the last selected item
let handleSingleSelectionClick = useRecoilCallback(({snapshot,set})=> async (e)=>{
  e.preventDefault();
  e.stopPropagation();
  let selectedItems = await snapshot.getPromise(selectedCourseItems);

  if (selectedItems.length == 0){
  //No items selected so select this item
  set(selectedCourseItems,[doenetId]);
  set(authorItemByDoenetId(doenetId),(was)=>{
    let newObj = {...was};
    newObj.isSelected = true;
    return newObj;
  })

  }else if (selectedItems.length == 1 && selectedItems[0] == doenetId){
    if(e.metaKey){
      //If cmd then clear all selections to remove
      set(selectedCourseItems,[]);
      set(authorItemByDoenetId(doenetId),(was)=>{
        let newObj = {...was};
        newObj.isSelected = false;
        return newObj;
      })
    }
      //Selecting this item again so don't do anything
      return;
  }else{
    if (e.shiftKey){
      //Shift Click
      //Select all items from the last one selected to this one
      const allItems = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId))
      let lastSelectedDoenetId = selectedItems[selectedItems.length -1];
      let indexOfLastSelected = allItems.indexOf(lastSelectedDoenetId);
      let indexOfClick = allItems.indexOf(doenetId);
      let itemsToSelect = allItems.slice(Math.min(indexOfLastSelected,indexOfClick),(Math.max(indexOfLastSelected,indexOfClick)+1))
      //Need to reverse when the new last item won't be at the end
      if (indexOfLastSelected > indexOfClick){
        itemsToSelect.reverse();
      }
      let newSelectedItems = [...selectedItems];
      for (let newDoenetId of itemsToSelect){
        if (!selectedItems.includes(newDoenetId)){
          newSelectedItems.push(newDoenetId);
          set(authorItemByDoenetId(newDoenetId),(was)=>{
            let newObj = {...was};
            newObj.isSelected = true;
            return newObj;
          })
        }
      }
      set(selectedCourseItems,newSelectedItems);
    }else if(e.metaKey){
      //Command Click means toggle the one item selected or not
      let itemWasSelected = selectedItems.includes(doenetId);
      if (itemWasSelected){
        let newSelectedItems = selectedItems.filter((testId)=>{return testId != doenetId});
        set(selectedCourseItems,newSelectedItems);
        set(authorItemByDoenetId(doenetId),(was)=>{
          let newObj = {...was};
          newObj.isSelected = false;
          return newObj;
        })

      }else{
        //Add this item to the selected items
        set(selectedCourseItems,[...selectedItems,doenetId]);
        set(authorItemByDoenetId(doenetId),(was)=>{
          let newObj = {...was};
          newObj.isSelected = true;
          return newObj;
        })
      }
    }else{

      //No Shift or Command Click
      //Only select this option and remove the others
      set(selectedCourseItems,[doenetId]);
      set(authorItemByDoenetId(doenetId),(was)=>{
                let newObj = {...was};
                newObj.isSelected = true;
                return newObj;
              })
      for (let doenetIdToUnselect of selectedItems){
        if (doenetId != doenetIdToUnselect){ //Leave the selected on selected
          set(authorItemByDoenetId(doenetIdToUnselect),(was)=>{
            let newObj = {...was};
            newObj.isSelected = false;
            return newObj;
          })
        }
      }
    }
  }

},[doenetId,courseId])

  let bgcolor = '#ffffff';
  if (isSelected){
    // bgcolor = '#e2e2e2'; //grey
    bgcolor = 'hsl(209,54%,82%)';

  } 

  //Used to open editor or assignment
  let handleDoubleClick = useRecoilCallback(({set})=>(e)=>{
    console.log("Double CLICK!",doenetId)
    e.preventDefault();
    e.stopPropagation();
    //TODO: use item type and role to determine what to update
  
  },[doenetId])

  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);
  const indentPx = 25;

  let activityJSX = (
    <div 
    key={`Row${doenetId}`}
    role="button"
    data-cy="courseItem"
    tabIndex={0}
    className="noselect nooutline"
    style={{
      cursor: 'pointer',
      padding: '8px',
      border: '0px',
      borderBottom: '2px solid black',
      backgroundColor: bgcolor,
      width: 'auto',
      // marginLeft: marginSize,
    }}
    onClick={(e)=>{
      handleSingleSelectionClick(e);
    }}
    onDoubleClick={(e)=>{
      handleDoubleClick(e);
    }}
    >
    <div
      style={{
        marginLeft: `${indentLevel * indentPx}px`,
        display: 'grid',
        gridTemplateColumns: columnsCSS,
        gridTemplateRows: '1fr',
        alignContent: 'center',
        // marginTop: '8px',
        // marginBottom: '8px',
      }}
    >
      <p style={{ display: 'inline', margin: '0px' }} 
      onClick={ ()=>{
        if (hasToggle){
        toggleOpenClosed();
      }}} >
       { numbered ?  <svg style={{verticalAlign:'middle'}} width="22" height="22" viewBox="0 0 22 22">
      <circle cx="11"
              cy="11"
              r="12"
              stroke="white"
              strokeWidth="2"
              fill="#1A5A99"/>
      <text fontSize="14"
            fill="white"
            fontFamily="Verdana"
            textAnchor="middle"
            alignmentBaseline="baseline"
            x="11"
            y="16">{numbered}</text>
  </svg>: null }
        {openCloseIndicator}
        <span style={{marginLeft:'8px'}} data-cy="rowIcon">
          <FontAwesomeIcon icon={icon} />
        </span>
        <span style={{marginLeft:'4px'}} data-cy="rowLabel">{label} </span>
      </p>
      </div>
    </div>
  )
  
  return <>{activityJSX}</>
}

function getColumnsCSS(numberOfVisibleColumns){
  let columnsCSS = '250px repeat(4,1fr)'; //5 columns max
  if (numberOfVisibleColumns === 4) {
    columnsCSS = '250px repeat(3,1fr)';
  } else if (numberOfVisibleColumns === 3) {
    columnsCSS = '250px 1fr 1fr';
  } else if (numberOfVisibleColumns === 2) {
    columnsCSS = '250px 1fr';
  } else if (numberOfVisibleColumns === 1) {
    columnsCSS = '100%';
  }
  return columnsCSS;

}

function CourseNavigationHeader({columnLabels,numberOfVisibleColumns,setNumberOfVisibleColumns}){
  // console.log("===CourseNavigationHeader")

  const updateNumColumns = useCallback(
    (width) => {
      const maxColumns = columnLabels.length + 1;
      //update number of columns in header
      const breakpoints = [375, 500, 650, 800];
      if (width >= breakpoints[3] && numberOfVisibleColumns !== 5) {
        const numberOfVisibleColumns = Math.min(maxColumns, 5);
        setNumberOfVisibleColumns?.(numberOfVisibleColumns);
      } else if (
        width < breakpoints[3] &&
        width >= breakpoints[2] &&
        numberOfVisibleColumns !== 4
      ) {
        const numberOfVisibleColumns = Math.min(maxColumns, 4);
        setNumberOfVisibleColumns?.(numberOfVisibleColumns);
      } else if (
        width < breakpoints[2] &&
        width >= breakpoints[1] &&
        numberOfVisibleColumns !== 3
      ) {
        const numberOfVisibleColumns = Math.min(maxColumns, 3);
        setNumberOfVisibleColumns?.(numberOfVisibleColumns);
      } else if (
        width < breakpoints[1] &&
        width >= breakpoints[0] &&
        numberOfVisibleColumns !== 2
      ) {
        const numberOfVisibleColumns = Math.min(maxColumns, 2);
        setNumberOfVisibleColumns?.(numberOfVisibleColumns);
      } else if (width < breakpoints[0] && numberOfVisibleColumns !== 1) {
        setNumberOfVisibleColumns?.(1);
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
            borderBottom: '1px solid grey',
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
            <span>Label</span>
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