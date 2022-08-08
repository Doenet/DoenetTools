import React, {useEffect, useMemo} from "../../_snowpack/pkg/react.js";
import {
  useRecoilCallback,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue
} from "../../_snowpack/pkg/recoil.js";
import {useTransition, a} from "../../_snowpack/pkg/@react-spring/web.js";
import useMeasure from "../../_snowpack/pkg/react-use-measure.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {drivecardSelectedNodesAtom} from "../ToolHandlers/CourseToolHandler.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import DriveCard from "../../_reactComponents/Drive/DoenetDriveCard.js";
import {coursePermissionsAndSettings} from "../../_reactComponents/Course/CourseActions.js";
import {mainPanelClickAtom} from "../Panels/NewMainPanel.js";
import useMedia from "./useMedia.js";
import "./driveCardsStyle.css.proxy.js";
export default function CourseCards(props) {
  console.log(">>>===CourseCards");
  const courses = useRecoilValue(coursePermissionsAndSettings);
  const setMainPanelClear = useSetRecoilState(mainPanelClickAtom);
  useEffect(() => {
    setMainPanelClear((was) => [
      ...was,
      {atom: selectedMenuPanelAtom, value: null},
      {atom: drivecardSelectedNodesAtom, value: []}
    ]);
    return setMainPanelClear((was) => [
      ...was,
      {atom: selectedMenuPanelAtom, value: null}
    ]);
  }, [setMainPanelClear]);
  if (courses.length == 0) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(CourseCardWrapper, {
    courses,
    drivePathSyncKey: "main",
    types: ["course"],
    isOneDriveSelect: false
  }));
}
const CourseCardWrapper = (props) => {
  const {isOneDriveSelect, courses, drivePathSyncKey, types} = props;
  const [drivecardSelectedValue, setDrivecardSelection] = useRecoilState(drivecardSelectedNodesAtom);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const columns = useMedia(["(min-width: 1500px)", "(min-width: 1000px)", "(min-width: 600px)"], [5, 4, 3], 2);
  const [ref, {width}] = useMeasure();
  let showCards = [];
  if (types[0] === "course" && width !== 0) {
    showCards = courses;
  }
  const [heights, driveCardItems] = useMemo(() => {
    let heights2 = new Array(columns).fill(0);
    let driveCardItems2 = showCards.map((child) => {
      const column = heights2.indexOf(Math.min(...heights2));
      const x = width / columns * column + 20;
      const y = (heights2[column] += 270) - 270;
      return {
        ...child,
        x,
        y,
        width: width / columns - 40,
        height: 230,
        drivePathSyncKey
      };
    });
    return [heights2, driveCardItems2];
  }, [columns, showCards, width]);
  const transitions = useTransition(driveCardItems, {
    key: (item) => item.courseId,
    from: ({x, y, width: width2, height}) => ({opacity: 0, x, y, width: width2, height}),
    enter: {opacity: 1},
    update: ({x, y, width: width2, height}) => ({x, y, width: width2, height}),
    leave: {height: 0, opacity: 0},
    config: {mass: 5, tension: 500, friction: 100},
    trail: 25
  });
  const setSelectedCourseMenu = useRecoilCallback(({set}) => () => {
    set(selectedMenuPanelAtom, "SelectedCourse");
  });
  const handleSelect = (e, item) => {
    setPageToolView({
      page: "course",
      tool: "dashboard",
      view: "",
      params: {
        courseId: item.courseId
      }
    });
  };
  const handleOnBlur = () => {
  };
  const handleKeyUp = (e, item) => {
    if (e.key === "Tab") {
      setDrivecardSelection([item]);
    }
  };
  const drivecardselection = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOneDriveSelect) {
      if (!e.shiftKey && !e.metaKey) {
        setDrivecardSelection(() => [item]);
        setSelectedCourseMenu();
      }
    } else {
      if (!e.shiftKey && !e.metaKey) {
        setDrivecardSelection(() => [item]);
        setSelectedCourseMenu();
      } else if (e.shiftKey && !e.metaKey) {
        setDrivecardSelection((old) => {
          if (old.length > 0) {
            let finalArray = [];
            let initalDriveId = "";
            if (old.length === 1) {
              initalDriveId = old[0].driveId;
            } else {
              finalArray = [...old];
              initalDriveId = old[old.length - 1].driveId;
            }
            let firstDriveId = driveCardItems.findIndex((j) => j.driveId === item.driveId);
            let lastDriveId = driveCardItems.findIndex((k) => k.driveId === initalDriveId);
            if (firstDriveId > lastDriveId) {
              let slicedArr = driveCardItems.slice(lastDriveId, firstDriveId + 1);
              let filteredArr = slicedArr.map((l) => l);
              finalArray = [...finalArray, ...filteredArr];
            } else {
              let slicedArr = driveCardItems.slice(firstDriveId, lastDriveId + 1);
              let filteredArr = slicedArr.map((m) => m);
              finalArray = [...finalArray, ...filteredArr];
            }
            let outputArray = finalArray.reduce((uniue, index) => uniue.find((el) => el.driveId == index.driveId ? true : false) ? uniue : [...uniue, index], []);
            return outputArray;
          } else {
            return [...old, item];
          }
        });
      } else if (!e.shiftKey && e.metaKey) {
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
    let availableCard = drivecardSelectedValue.filter((i) => i.courseId === cardItem.courseId && i.drivePathSyncKey === drivePathSyncKey);
    return availableCard.length > 0 ? true : false;
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "drivecardContainer",
    id: "test"
  }, /* @__PURE__ */ React.createElement("div", {
    ref,
    className: "driveCardList",
    style: {height: Math.max(...heights)}
  }, transitions((style, item, t, index) => {
    let isSelected = getSelectedCard(item);
    return /* @__PURE__ */ React.createElement(a.div, {
      style
    }, /* @__PURE__ */ React.createElement("div", {
      role: "button",
      style: {height: "100%", outline: "none"},
      tabIndex: index + 1,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        drivecardselection(e, item, props);
      },
      onBlur: () => handleOnBlur(),
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          handleSelect(e, item);
        }
      },
      onKeyUp: (e) => handleKeyUp(e, item),
      onDoubleClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSelect(e, item);
      }
    }, /* @__PURE__ */ React.createElement(DriveCard, {
      image: item.image,
      color: item.color,
      label: item.label,
      isSelected,
      role: item.roleLabels
    })));
  })));
};
