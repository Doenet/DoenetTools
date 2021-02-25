import React, { useEffect, useRef, useState, Suspense } from "react";
import Drive, {
  fetchDrivesSelector,
} from "./Drive";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
} from "recoil";

import DriveCard from './DoenetDriveCard';
import { useTransition, animated, interpolate } from "react-spring";
import "./drivecard.css";
import useMeasure  from "../Tools/useMeasure";
import {
  useHistory
} from "react-router-dom";
import { useMenuPanelController } from "./Tool/MenuPanel";
import { drivecardSelectedNodesAtom }from "../Tools/DoenetLibrary";

const DriveCardContainer = React.memo((props) => {
  const { driveDoubleClickCallback } = props;
  const history = useHistory();
  let encodeParams = (p) =>
    Object.entries(p)
      .map((kv) => kv.map(encodeURIComponent).join("="))
      .join("&");
  // let transitions = "";
  let driveCardItems =[];
  let heights = [];
   driveCardItems = [];
  // console.log(">>>> props.driveInfo",props.driveInfo );
  const [bind, { width },columns] = useMeasure();
  heights = new Array(columns).fill(0);
  //  console.log(">>>>> !!!!!!width  ", width,"columns",columns );
  driveCardItems = props.driveInfo.map((child, i) => {
    const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
    const xy = [((width) / columns) * column, (heights[column] += 250) - 250]; // X = container width / number of columns * column index, Y = it's just the height of the current column
    return { ...child, xy, width: (width / columns), height: 250};
  });
   const transitions = useTransition(driveCardItems, (item) => item.driveId, {
      from: ({ 
        xy, width, height }) => ({
        xy:[0,0],
        width,
        height,
        opacity: 0,
        scale: 1,
        position:"absolute"
            }),

      enter: ({
         xy, width, height }) => ({
        xy:[width,0],
        width,
        height,
        opacity: 1,
        scale: 1,
      }),
      update: ({
         xy, width, height }) => ({ xy, width, height, scale: 1,position:"absolute"
        }),
      leave: { height: 0, opacity: 0, scale: 0 },
      config: { mass: 5, tension: 5000, friction: 1000 },
      trail: 25
    });
    // console.log(">>>> transitions", transitions);

  const handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      let newParams = {};
      newParams[
        "path"
      ] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
      history.push("?" + encodeParams(newParams));
    }
  };
  const [on, toggle] = useState(false);
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom)
  const drivecardSelectedValue = useRecoilValue(drivecardSelectedNodesAtom);
  const setOpenMenuPanel = useMenuPanelController();
  // Drive selection
  const drivecardselection = (e,item) =>{
   e.preventDefault();
   e.stopPropagation();
   setOpenMenuPanel(0);
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
        //  console.log(">>>> final array",finalArray);
        return finalArray;

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
  }
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
    // <div className="drivecardContainer">
      <div
        {...bind}
        style={{
          width: "100%",
          height: Math.max(...heights),
          position: "relative",
        }}
        className={`list drivecardContainer`}
      >
        {transitions.map(({ item, props }, index) => {
          let selectedCard = getSelectedCard(item);
          return (
            <animated.div
              key={index}
              // onMouseOver={() => toggle(props.scale.setValue(1.1))}
              // onMouseLeave={() => toggle(props.scale.setValue(1))}
              // className="adiv"
              className={`adiv ${selectedCard ? "borderselection" : ""}`}
              style={{
                transform: props.xy.interpolate((x, y) => {
                  return `translate(${x}px,${y}px) scale(${
                    selectedCard ? 1.1 : props.scale.value
                  })`;
                }),
                ...props,
                height: 250,
                opacity: 1,
              }}
            >
              <div
                style={{ height: "100%" }}
                tabIndex={index + 1}
                // onclick scale
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  drivecardselection(e, item, props);
                }}
                onKeyDown={(e) => handleKeyDown(e, item)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDrivecardSelection([]);
                  if (driveDoubleClickCallback) {
                    driveDoubleClickCallback({ item });
                  }
                }}
              >
                {/* <a href="#" style={{ textDecoration: "none" }}> */}
                  <DriveCard
                    driveId={item.driveId}
                    image={item.image}
                    color={item.color}
                    label={item.label}
                  />
                {/* </a> */}
              </div>
            </animated.div>
          );
        })}
      </div>
    // </div>
  );
});

export default DriveCardContainer;
