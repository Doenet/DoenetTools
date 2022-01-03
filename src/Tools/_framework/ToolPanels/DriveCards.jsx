import React, { useEffect, useState, useMemo } from 'react';
import {
  useRecoilCallback,
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable,
} from 'recoil';
import { useTransition, a } from '@react-spring/web';
import useMeasure from 'react-use-measure';

import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler';
import { pageToolViewAtom } from '../NewToolRoot';
import DriveCard from '../../../_reactComponents/Drive/DoenetDriveCard';
import { fetchDrivesQuery } from '../../../_reactComponents/Drive/NewDrive';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import useMedia from './useMedia';
import './driveCardsStyle.css';

export default function DriveCardsNew(props) {
  console.log('>>>===DriveCards');

  const driveInfo = useRecoilValueLoadable(fetchDrivesQuery);

  let driveIdsAndLabelsInfo = '';

  if (driveInfo.state == 'hasValue') {
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
    ]);
  }, [setMainPanelClear]);

  return (
    <div style={props.style}>
      {driveIdsAndLabelsInfo && (
        <DriveCardWrapper
          driveInfo={driveIdsAndLabelsInfo}
          drivePathSyncKey="main"
          types={['course']}
          isOneDriveSelect={false}
        />
      )}
    </div>
  );
}

const DriveCardWrapper = (props) => {
  const { isOneDriveSelect, driveInfo, drivePathSyncKey, types } = props;

  const [drivecardSelectedValue, setDrivecardSelection] = useRecoilState(
    drivecardSelectedNodesAtom,
  );
  // const setOpenMenuPanel = useMenuPanelController();
  // const [driveCardPath, setDrivecardPath] = useRecoilState(drivePathSyncFamily(drivePathSyncKey))
  // const drivecardInfo = useRecoilValueLoadable(loadDriveInfoQuery(driveInfo.driveId))
  // console.log(" columnJSX drivesInfo",drivecardInfo)
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  const columns = useMedia(
    ['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'],
    [5, 4, 3],
    // [4, 3, 2],
    2,
  );

  const [ref, { width }] = useMeasure();

  let showCards = [];
  if (types[0] === 'course') {
    showCards = driveInfo;
  }

  const [heights, driveCardItems] = useMemo(() => {
    let heights = new Array(columns).fill(0); // Each column gets a height starting with zero
    let driveCardItems = showCards.map((child, i) => {
      const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
      const x = (width / columns) * column; // x = container width / number of columns * column index,
      const y = (heights[column] += 270) - 270; // y = it's just the height of the current column
      return {
        ...child,
        x,
        y,
        width: width / columns,
        height: 250,
        drivePathSyncKey,
      };
    });
    return [heights, driveCardItems];
  }, [columns, showCards, width]);

  console.log('>>> driveInfo', driveInfo);

  const transitions = useTransition(driveCardItems, {
    key: (item) => item.driveId,
    from: ({ opacity: 0}),
    enter: ({ opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  const setSelectedCourseMenu = useRecoilCallback(({ set }) => () => {
    set(selectedMenuPanelAtom, 'SelectedCourse');
  });

  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter') {
      setPageToolView({
        tool: 'navigation',
        params: {
          path: `${item.driveId}:${item.driveId}:${item.driveId}:Drive`,
        },
      });
    }
  };

  
    const handleOnBlur = () => {
    if (drivecardSelectedValue.length == 1) {
      setDrivecardSelection([]);
    }
  };

  const handleKeyUp = (e, item) => {
    if (e.key === 'Tab') {
      setDrivecardSelection([item]);
    }
  };

  // Drive selection
  const drivecardselection = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    //  setOpenMenuPanel(0);
    if (isOneDriveSelect) {
      if (!e.shiftKey && !e.metaKey) {
        // one item
        setDrivecardSelection((old) => [item]);
        setSelectedCourseMenu();
      }
    } else {
      if (!e.shiftKey && !e.metaKey) {
        // one item
        setDrivecardSelection((old) => [item]);
        setSelectedCourseMenu();
      } else if (e.shiftKey && !e.metaKey) {
        // range to item

        setDrivecardSelection((old) => {
          if (old.length > 0) {
            let finalArray = [];
            let initalDriveId = '';
            if (old.length === 1) {
              initalDriveId = old[0].driveId;
            } else {
              finalArray = [...old];
              initalDriveId = old[old.length - 1].driveId;
            }
            let firstDriveId = driveCardItems.findIndex(
              (j) => j.driveId === item.driveId,
            );
            let lastDriveId = driveCardItems.findIndex(
              (k) => k.driveId === initalDriveId,
            );
            if (firstDriveId > lastDriveId) {
              let slicedArr = driveCardItems.slice(
                lastDriveId,
                firstDriveId + 1,
              );
              let filteredArr = slicedArr.map((l) => l);
              finalArray = [...finalArray, ...filteredArr];
            } else {
              let slicedArr = driveCardItems.slice(
                firstDriveId,
                lastDriveId + 1,
              );
              let filteredArr = slicedArr.map((m) => m);
              finalArray = [...finalArray, ...filteredArr];
            }
            let outputArray = finalArray.reduce(
              (uniue, index) =>
                uniue.find((el) => (el.driveId == index.driveId ? true : false))
                  ? uniue
                  : [...uniue, index],
              [],
            );
            return outputArray;
          } else {
            return [...old, item];
          }
        });
      } else if (!e.shiftKey && e.metaKey) {
        // add item
        setDrivecardSelection((old) => {
          let alreadyAvaliable = old.filter((i) => i.driveId === item.driveId);
          if (alreadyAvaliable.length > 0) {
            const arr = [];
            for (let i = 0; i < old.length; i++) {
              if (old[i].driveId != item.driveId) {
                arr.push(old[i]);
              }
            }
            return arr;
          } else {
            return [...old, item];
          }
        });
      }
    }
  };

  const getSelectedCard = (cardItem) => {
    if (drivecardSelectedValue.length == 0) {
      return false;
    }
    let availableCard = drivecardSelectedValue.filter(
      (i) =>
        i.driveId === cardItem.driveId &&
        i.drivePathSyncKey === drivePathSyncKey,
    );
    return availableCard.length > 0 ? true : false;
  };

  // return (
  //   <div className="drivecardContainer">
  //     <div
  //       ref={ref}
  //       className="driveCardList"
  //       style={{ height: Math.max(...heights) }}
  //     >
  //       {/* {transitions((style, item, t, index) => {
  //         console.log('');
  //         let isSelected = getSelectedCard(item); */}
  //         return (
  //           <a.div style={props.style}>
  //             <div
  //               role="button"
  //               style={{ height: '100%', outline: 'none', margin: '20px' }}
  //               tabIndex={props.index + 1}
  //               onClick={(e) => {
  //                 e.preventDefault();
  //                 e.stopPropagation();
  //                 drivecardselection(e, props.item, props);
  //               }}
  //               onBlur={() => handleOnBlur(props.item)}
  //               onKeyDown={(e) => handleKeyDown(e, props.item)}
  //               onKeyUp={(e) => handleKeyUp(e, props.item)}
  //               onDoubleClick={(e) => {
  //                 e.preventDefault();
  //                 e.stopPropagation();
  //                 setDrivecardSelection([]); //TODO: on leave instead
  //                 setPageToolView({
  //                   page: 'course',
  //                   tool: 'dashboard',
  //                   view: '',
  //                   params: {
  //                     path: `${props.item.driveId}:${props.item.driveId}:${props.item.driveId}:Drive`,
  //                   },
  //                 });
  //               }}
  //             >
  //               <DriveCard
  //                 image={props.item.image}
  //                 color={props.item.color}
  //                 label={props.item.label}
  //                 isSelected={getSelectedCard(props.item)}
  //                 role={props.item.role}
  //               />
  //             </div>
  //           </a.div>
  //         );
  //       {/* })} */}
  //     </div>
  //   </div>
  // );
  return (
    <div className="drivecardContainer">
      <div
        ref={ref}
        className="driveCardList"
        style={{ height: Math.max(...heights) }}
      >
        {transitions((style, item, t, index) => {
          console.log('');
          let isSelected = getSelectedCard(item);
          return (
            <a.div style={style}
            role="button"
                // style={{ height: '100%', outline: 'none', padding: '10px' }}
                tabIndex={index + 1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  drivecardselection(e, item, props);
                }}
                onBlur={() => handleOnBlur()}
                onKeyDown={(e) => handleKeyDown(e, item)}
                onKeyUp={(e) => handleKeyUp(e, item)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDrivecardSelection([]); //TODO: on leave instead
                  setPageToolView({
                    page: 'course',
                    tool: 'dashboard',
                    view: '',
                    params: {
                      path: `${item.driveId}:${item.driveId}:${item.driveId}:Drive`,
                    },
                  });
                }}>
              
                {/* // role="button"
                // style={{ height: '100%', outline: 'none', padding: '10px' }}
                // tabIndex={index + 1}
                // onClick={(e) => { */}
                {/* //   e.preventDefault();
                //   e.stopPropagation();
                //   drivecardselection(e, item, props);
                // }}
                // onBlur={() => handleOnBlur()}
                // onKeyDown={(e) => handleKeyDown(e, item)}
                // onKeyUp={(e) => handleKeyUp(e, item)}
                // onDoubleClick={(e) => { */}
                {/* //   e.preventDefault();
                //   e.stopPropagation();
                //   setDrivecardSelection([]); //TODO: on leave instead
                //   setPageToolView({ */}
                {/* //     page: 'course',
                //     tool: 'dashboard',
                //     view: '',
                //     params: { */}
                {/* //       path: `${item.driveId}:${item.driveId}:${item.driveId}:Drive`,
                //     },
                //   });
                // }}
              // > */}
                <DriveCard
                  image={item.image}
                  color={item.color}
                  label={item.label}
                  isSelected={isSelected}
                  role={item.role}
                />
              
            </a.div>
          );
        })}
      </div>
    </div>
  );
};
