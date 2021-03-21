import React, { useState, useRef } from "react";
import DriveCard from './DoenetDriveCard';
import { useTransition, animated, interpolate } from "react-spring";
import "./drivecard.css";
// import useMeasure  from "../Tools/useMeasure";
import Measure from 'react-measure'
import {
  useHistory
} from "react-router-dom";
import { useMenuPanelController } from "./Tool/Panels/MenuPanel";
import { drivecardSelectedNodesAtom }from "../Tools/DoenetLibrary";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
} from "recoil";
import { 
  fetchDrivesSelector,
} from "./Drive";


const DriveCards = (props) => {
  const {routePathDriveId, driveDoubleClickCallback, isOneDriveSelect, subTypes,types} = props;

  const drivesInfo = useRecoilValueLoadable(fetchDrivesSelector);
  let driveInfo = [];
  if (drivesInfo.state === "hasValue") {
    driveInfo = drivesInfo.contents.driveIdsAndLabels;
  }
   // Drive cards component
   let drivecardComponent = null;
   if (driveInfo && driveInfo.length > 0 && routePathDriveId === "") {
     drivecardComponent = <DriveCardWrapper 
     driveDoubleClickCallback={driveDoubleClickCallback} 
     subTypes={subTypes}
     types={types}
     isOneDriveSelect = {isOneDriveSelect}
     driveInfo={driveInfo}/>;
   } else if (driveInfo.length === 0 && routePathDriveId === "") {
     if(isOneDriveSelect){
      drivecardComponent = (
        <h2>You have no courses.</h2>
      );
     }
     else{
      drivecardComponent = (
        <h2>You have no courses. Add one using the Menu Panel {`-->`} </h2>
      );
     }    
   }
   return (
     <>
     {drivecardComponent}
     </>
   )
};

const DriveCardWrapper = (props) => {
  const { driveDoubleClickCallback , isOneDriveSelect, subTypes ,driveInfo, types} = props;
 
  const history = useHistory();
  let encodeParams = (p) =>
    Object.entries(p)
      .map((kv) => kv.map(encodeURIComponent).join("="))
      .join("&");
  let driveCardItems =[];
  let heights = [];
  // console.log(">>>> props.driveInfo",props.driveInfo );
  // const [bind, { width },columns] = useMeasure();
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
          if(subTypes.length > 1)
          {
            showCards = driveInfo;
          }
          else
          {
            for(let i = 0;i< driveInfo.length;i++)
            {
                if(driveInfo[i].subType === subTypes[0])
                {
                  showCards.push(driveInfo[i]);
                }
            }            
          } 
         }
         
  driveCardItems = showCards.map((child, i) => {
    const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
    const xy = [((width) / columns) * column, (heights[column] += 250) - 250]; // X = container width / number of columns * column index, Y = it's just the height of the current column
    return { ...child, xy, width: (width / columns)-10, height: 250};
  });
   const transitions = useTransition(driveCardItems, (item) => item.driveId, {
      from: ({ 
        xy, width, height }) => ({
        xy,
        width,
        height,
        opacity: 0,
        scale: 1,
        shadow : 0,
        zIndex:0,
            }),

      enter: ({
         xy, width, height }) => ({
        xy,
        width,
        height,
        opacity: 0,
        scale: 1,
        shadow : 0,
        zIndex:0,
      }),
      update: ({
         xy, width, height }) => ({ xy, width, height, scale: 1,opacity: 1,position:"absolute",  shadow : 0,zIndex:0,
        }),
      leave: { height: 0, opacity: 0, scale: 0 },
      config: { mass: 5, tension: 5000, friction: 1000 },
      trail: 25
    });
    // console.log(">>>> transitions", transitions);

 
  const [on, toggle] = useState(false);  
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom)
  const drivecardSelectedValue = useRecoilValue(drivecardSelectedNodesAtom);
  const setOpenMenuPanel = useMenuPanelController();


  const handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      let newParams = {};
      newParams[
        "path"
      ] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
      history.push("?" + encodeParams(newParams));
    }
  };

  const handleKeyUp = (e, item) => {
    if(e.key === "Tab"){
      setDrivecardSelection([item]);
    }
  };
  const handleKeyBlur = ( e , item) =>{
    if(e.type === "blur"){
      setDrivecardSelection([]);

    }
  }
  
  
  // Drive selection 
  const drivecardselection = (e,item) =>{
   e.preventDefault();
   e.stopPropagation();
   setOpenMenuPanel(0);
   if(isOneDriveSelect){
    if (!e.shiftKey && !e.metaKey){          // one item
      setDrivecardSelection((old) => [item]);
    }
   }
   else{
    if (!e.shiftKey && !e.metaKey){          // one item
      setDrivecardSelection((old) => [item]);
      
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
          let firstDriveId = transitions.findIndex((j) => j.item.driveId === item.driveId);
          let lastDriveId = transitions.findIndex((k)=>k.item.driveId === initalDriveId);
          if(firstDriveId > lastDriveId)
          {
            let slicedArr = transitions.slice(lastDriveId,firstDriveId+1);
            let filteredArr = slicedArr.map((l)=>l.item);
            finalArray = [...finalArray,...filteredArr];
          }
          else{
            let slicedArr = transitions.slice(firstDriveId,lastDriveId+1);
            let filteredArr = slicedArr.map((m)=>m.item);
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

  //  console.log('>>>> drivecard selection item', item);

 }

 const getSelectedCard = (cardItem) => {
   if(drivecardSelectedValue.length == 0)
   {
     return false;
   }
  let avalibleCard = drivecardSelectedValue.filter((i)=>i.driveId === cardItem.driveId);
  return avalibleCard.length > 0 ? true : false;
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
          width: "100%",
          height:Math.max(...heights)+50,
        }}
        className={`list`}
      >
        {transitions.map(({ item, props }, index) => {
          let selectedCard = getSelectedCard(item);
          return (
            <animated.div
              key={index}
              className={`adiv ${selectedCard ? "borderselection" : ""}`}
              style={{
                transform: props.xy.interpolate((x, y) => {
                  return `translate(${x}px,${y}px) 
                  scale(${
                    selectedCard ? 1 : props.scale.value
                  })`
                  ;
                }),
                transitionDuration: '0.2s' ,
                transitionDelay:'0s',
                ...props,
                height: 250,
                opacity: 1,
                // zIndex:selectedCard ? 2 : 0,
                // boxShadow: props.shadow.interpolate(s => `rgba(0,0,0,0.15) 0px ${selectedCard ? 15 : 0}px ${(selectedCard ? 15: 0)}px 0px` ),
              }}
            >
              <div
                style={{ height: "100%" ,outline:"none"}}
                tabIndex={index + 1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  drivecardselection(e, item, props);
                }}
                onKeyDown={(e) => handleKeyDown(e, item)}
                onKeyUp={(e) => handleKeyUp(e, item)}
                // onBlur={(e)=> handleKeyBlur(e,item)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDrivecardSelection([]);
                  if (driveDoubleClickCallback) {
                    driveDoubleClickCallback({ item });
                  }
                }}
              >
                  <DriveCard
                    driveId={item.driveId}
                    image={item.image}
                    color={item.color}
                    label={item.label}
                  />
              </div>
            </animated.div>
          );
        })}
      </div>
             )}
      </Measure>
     </div>
  );
};

export default DriveCards;
