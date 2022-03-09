import React, { useEffect, useState, useMemo } from 'react';
import {
  useRecoilCallback,
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable,
  useRecoilValue,
} from 'recoil';
import { useTransition, a } from '@react-spring/web';
import useMeasure from 'react-use-measure';

import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler';
import { pageToolViewAtom } from '../NewToolRoot';
import DriveCard from '../../../_reactComponents/Drive/DoenetDriveCard';
import { clearDriveAndItemSelections } from '../../../_reactComponents/Drive/NewDrive';
import { fetchCoursesQueryOld , coursePermissionsAndSettings } from '../../../_reactComponents/Course/CourseActions';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import useMedia from './useMedia';
import './driveCardsStyle.css';
import CourseChooserLeave from '../EnterLeave/CourseChooserLeave';

export default function DriveCardsNew(props) {
  console.log('>>>===DriveCards');

  const courses = useRecoilValue(coursePermissionsAndSettings);

  const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);

  useEffect(() => {
    setMainPanelClear((was) => [
      ...was,
      { atom: selectedMenuPanelAtom, value: null }, // Anyone know what this is?
      // Deselect the selected card when onBlur in the main panel
      // Remain selected when onBlur in the side panel
      { atom: drivecardSelectedNodesAtom, value: [] },
    ]);
    return setMainPanelClear((was) => [
      ...was,
      { atom: selectedMenuPanelAtom, value: null },
    ]);
  }, [setMainPanelClear]);


  if (courses.length == 0){
    return null;
  }

  return (
    <div style={props.style}>
     <CourseCardWrapper
          courses={courses}
          drivePathSyncKey="main"
          types={['course']}
          isOneDriveSelect={false}
        />
    </div>
  );
  
}

const CourseCardWrapper = (props) => {
  const { isOneDriveSelect, courses, drivePathSyncKey, types } = props;

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
    2,
  );

  const [ref, { width }] = useMeasure();

  let showCards = [];
  if (types[0] === 'course' && width !== 0) {
    showCards = courses;
  }

  const [heights, driveCardItems] = useMemo(() => {
    let heights = new Array(columns).fill(0); // Each column gets a height starting with zero
    let driveCardItems = showCards.map((child, i) => {
      const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
      const x = (width / columns) * column + 20; // x = container width / number of columns * column index,
      const y = (heights[column] += 270) - 270; // y = it's just the height of the current column
      return {
        ...child,
        x,
        y,
        width: width / columns - 40,
        height: 230,
        drivePathSyncKey,
      };
    });
    return [heights, driveCardItems];
  }, [columns, showCards, width]);

  // console.log('>>> driveInfo', driveCardItems);

  const transitions = useTransition(driveCardItems, {
    key: (item) => item.courseId,
    from: ({x, y, width, height}) => ({ opacity: 0, x, y, width, height}), // Drive cards fade onto the screen when the page loads
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
        i.courseId === cardItem.courseId &&
        i.drivePathSyncKey === drivePathSyncKey,
    );
    return availableCard.length > 0 ? true : false;
  };

  return (
    <div className="drivecardContainer" id="test">
      <div
        ref={ref}
        className="driveCardList"
        style={{ height: Math.max(...heights) }}
      >
        {transitions((style, item, t, index) => {
          console.log('');
          let isSelected = getSelectedCard(item);
          return (
            <a.div style={style} >
              <div
                role="button"
                style={{ height: '100%', outline: 'none' }}
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
          
                <DriveCard
                  image={item.image}
                  color={item.color}
                  label={item.label}
                  isSelected={isSelected}
                  role={item.roleLabels}
                />
              </div>
            </a.div>
          );
        })}
      </div>
    </div>
  );
};
