import React, { useEffect ,useState} from 'react';
// import axios from "axios";
// import { useHistory } from 'react-router';
// import Button from '../temp/Button'
import { useRecoilCallback, useSetRecoilState, useRecoilState,useRecoilValueLoadable } from 'recoil';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { drivecardSelectedNodesAtom} from '../ToolHandlers/CourseToolHandler'
import { pageToolViewAtom } from '../NewToolRoot';
import DriveCard from '../../../_reactComponents/Drive/DoenetDriveCard';
// import { useMenuPanelController } from '../Panels/MenuPanel';
import { fetchDrivesQuery} from '../../../_reactComponents/Drive/NewDrive';
import Measure from 'react-measure';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';

export default function DriveCardsNew(props){
  console.log(">>>===DriveCards");
  
  const driveInfo = useRecoilValueLoadable(fetchDrivesQuery);

  let driveIdsAndLabelsInfo = '';
  if(driveInfo.state == 'hasValue'){
    driveIdsAndLabelsInfo = driveInfo.contents.driveIdsAndLabels;
  }

  const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);

  useEffect(() => {
    setMainPanelClear((was) => [
      ...was,
      { atom: selectedMenuPanelAtom, value: null },
    ]);
    return setMainPanelClear((was) => [
      ...was,
      { atom: selectedMenuPanelAtom, value: null },
    ]
    );
  }, [setMainPanelClear]);


  return <div style={props.style}>

  { driveIdsAndLabelsInfo && <DriveCardWrapper 
      driveInfo={driveIdsAndLabelsInfo}
      drivePathSyncKey="main"
       types={['course']} isOneDriveSelect={false} />}
  </div>
}


const DriveCardWrapper = (props) => {
  const { isOneDriveSelect ,driveInfo, drivePathSyncKey, types} = props;
 
  const [drivecardSelectedValue,setDrivecardSelection] = useRecoilState(drivecardSelectedNodesAtom)
  // const setOpenMenuPanel = useMenuPanelController();
  // const [driveCardPath, setDrivecardPath] = useRecoilState(drivePathSyncFamily(drivePathSyncKey))
  // const drivecardInfo = useRecoilValueLoadable(loadDriveInfoQuery(driveInfo.driveId))
  // console.log(" columnJSX drivesInfo",drivecardInfo)
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  let driveCardItems =[];
  let heights = [];
  const [width, setWidth] = useState(0);
  const getColumns = (width) => {
    if(width > 1500){return 5;}
    else if(width > 1000){return 4;}
    else if(width > 600){return 3;}
    else if(width > 400){return 2;}
    else if(width > 200){return 1;}
    else{return 1;}
  }
  const columns = getColumns(width);
  heights = new Array(columns).fill(0);
  let showCards = [];
  if(types[0] === 'course'){
    showCards = driveInfo;


  }
         
  driveCardItems = showCards.map((child, i) => {
    const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
    const xy = [((width) / columns) * column, (heights[column] += 250) - 250]; // X = container width / number of columns * column index, Y = it's just the height of the current column
    return { ...child, xy, width: (width / columns), height: 250};
  });

  const setSelectedCourseMenu = useRecoilCallback(({set})=> ()=>{
    set(selectedMenuPanelAtom,"SelectedCourse");
    });


  const handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      setPageToolView({
        tool:'navigation',
        params: {path:`${item.driveId}:${item.driveId}:${item.driveId}:Drive` }
      });

    }
  };

  const handleKeyUp = (e, item) => {
    if(e.key === "Tab"){
      setDrivecardSelection([item]);
    }
  };



  // Drive selection 
  const drivecardselection = (e,item) =>{
   e.preventDefault();
   e.stopPropagation();
  //  setOpenMenuPanel(0);
   if(isOneDriveSelect){
    if (!e.shiftKey && !e.metaKey){          // one item
      setDrivecardSelection((old) => [item]);
      setSelectedCourseMenu();
    }
   }
   else{
    if (!e.shiftKey && !e.metaKey){          // one item
      setDrivecardSelection((old) => [item]);
      setSelectedCourseMenu();
      
    }else if (e.shiftKey && !e.metaKey){      // range to item 
      
      setDrivecardSelection((old) => {
        if(old.length > 0)
        {
  
          let finalArray = [];
          let initalDriveId = '';
          if(old.length === 1)
          {
            initalDriveId = old[0].driveId;
          }
          else
          {
            finalArray = [...old];
            initalDriveId = old[old.length-1].driveId;
          }
          let firstDriveId = driveCardItems.findIndex((j) => j.driveId === item.driveId);
          let lastDriveId = driveCardItems.findIndex((k)=>k.driveId === initalDriveId);
          if(firstDriveId > lastDriveId)
          {
            let slicedArr = driveCardItems.slice(lastDriveId,firstDriveId+1);
            let filteredArr = slicedArr.map((l)=>l);
            finalArray = [...finalArray,...filteredArr];
          }
          else{
            let slicedArr = driveCardItems.slice(firstDriveId,lastDriveId+1);
            let filteredArr = slicedArr.map((m)=>m);
            finalArray = [...finalArray,...filteredArr];
          }
          let outputArray = finalArray.reduce((uniue,index) => uniue.find((el)=> (el.driveId==index.driveId) ? true :false) ? uniue:[...uniue,index],[]);
          return outputArray;
          
        }
        else{
          return [...old,item];
        }
      }); 
    }else if (!e.shiftKey && e.metaKey){   // add item
      setDrivecardSelection((old) =>{
        let alreadyAvaliable = old.filter((i)=>i.driveId === item.driveId);
        if(alreadyAvaliable.length > 0)
        {
          const arr = [];
          for(let i = 0;i<old.length;i++)
          {
            if(old[i].driveId != item.driveId)
            {
              arr.push(old[i]);
            }
          }
          return arr;
        }
        else{
          return [...old,item];
        }
      } );
    }   }


 }

 const getSelectedCard = (cardItem) => {
   if(drivecardSelectedValue.length == 0)
   {
     return false;
   }
  let availableCard = drivecardSelectedValue.filter((i)=>
    i.driveId === cardItem.driveId && i.drivePathSyncKey === drivePathSyncKey);
  return availableCard.length > 0 ? true : false;
 }


  return (
    <div className="drivecardContainer">
         <Measure
    bounds
    onResize={contentRect =>{
      setWidth(contentRect.bounds.width)
    }}
    >
      {({ measureRef }) => (
      <div ref={measureRef}
        style={{
           width: '100%'
        }}
        className={`list`}
      >
        {driveCardItems.map((item, index) => {
          item["drivePathSyncKey"] = drivePathSyncKey; //need for selection
          let isSelected = getSelectedCard(item);
          return (
            <div
              key={`div${item.driveId}`}
              className={`adiv ${isSelected ? "borderselection" : ""}`}
              style={{
                width:250,
                height: 250,
                opacity: 1,
                padding:15,
              }}
            >
              <div
                role="button"
                style={{ height: "100%" ,outline:"none"}}
                tabIndex={index + 1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  drivecardselection(e, item, props);
                }}
                onKeyDown={(e) => handleKeyDown(e, item)}
                onKeyUp={(e) => handleKeyUp(e, item)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDrivecardSelection([]); //TODO: on leave instead
                  setPageToolView({page:'course',tool:'dashboard',view:'',params:{path:`${item.driveId}:${item.driveId}:${item.driveId}:Drive`}})
                }}
              >
                  <DriveCard
                    image={item.image}
                    color={item.color}
                    label={item.label}
                    isSelected={isSelected}
                    role={item.role}
                  />
              </div>
            </div>
          );
        })}
      </div>
             )}
      </Measure>
     </div>
  );
};