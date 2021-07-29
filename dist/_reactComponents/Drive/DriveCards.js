import React, {useState, useRef} from "../../_snowpack/pkg/react.js";
import DriveCard from "./DoenetDriveCard.js";
import "./drivecard.css.proxy.js";
import Measure from "../../_snowpack/pkg/react-measure.js";
import {
  useHistory
} from "../../_snowpack/pkg/react-router-dom.js";
import {useMenuPanelController} from "../../_framework/Panels/MenuPanel.js";
import {drivecardSelectedNodesAtom} from "../../library/Library.js";
import {
  atom,
  atomFamily,
  useSetRecoilState,
  useRecoilValue,
  useRecoilState,
  useRecoilValueLoadable,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {
  fetchDrivesSelector,
  drivePathSyncFamily,
  loadDriveInfoQuery
} from "./NewDrive.js";
const DriveCards = (props) => {
  const {driveDoubleClickCallback, isOneDriveSelect, types, drivePathSyncKey} = props;
  const drivesInfo = useRecoilValueLoadable(fetchDrivesSelector);
  let driveInfo = [];
  if (drivesInfo.state === "hasValue") {
    driveInfo = drivesInfo.contents.driveIdsAndLabels;
  }
  let drivecardComponent = null;
  if (driveInfo && driveInfo.length > 0) {
    drivecardComponent = /* @__PURE__ */ React.createElement(DriveCardWrapper, {
      driveDoubleClickCallback,
      types,
      drivePathSyncKey,
      isOneDriveSelect,
      driveInfo
    });
  } else if (driveInfo.length === 0) {
    if (isOneDriveSelect) {
      drivecardComponent = /* @__PURE__ */ React.createElement("h2", null, "You have no courses.");
    } else {
      drivecardComponent = /* @__PURE__ */ React.createElement("h2", null, "You have no courses. Add one using the Menu Panel ", `-->`, " ");
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, drivecardComponent);
};
const DriveCardWrapper = (props) => {
  const {driveDoubleClickCallback, isOneDriveSelect, driveInfo, drivePathSyncKey, types} = props;
  const [drivecardSelectedValue, setDrivecardSelection] = useRecoilState(drivecardSelectedNodesAtom);
  const setOpenMenuPanel = useMenuPanelController();
  const [driveCardPath, setDrivecardPath] = useRecoilState(drivePathSyncFamily(drivePathSyncKey));
  const drivecardInfo = useRecoilValueLoadable(loadDriveInfoQuery(driveInfo.driveId));
  let driveCardItems = [];
  let heights = [];
  const [width, setWidth] = useState(0);
  const getColumns = (width2) => {
    if (width2 > 1500) {
      return 5;
    } else if (width2 > 1e3) {
      return 4;
    } else if (width2 > 600) {
      return 3;
    } else if (width2 > 400) {
      return 2;
    } else if (width2 > 200) {
      return 1;
    } else {
      return 1;
    }
  };
  const columns = getColumns(width);
  heights = new Array(columns).fill(0);
  let showCards = [];
  if (types[0] === "course") {
    showCards = driveInfo;
  }
  driveCardItems = showCards.map((child, i) => {
    const column = heights.indexOf(Math.min(...heights));
    const xy = [width / columns * column, (heights[column] += 250) - 250];
    return {...child, xy, width: width / columns, height: 250};
  });
  if (driveCardPath.driveId !== "") {
    return null;
  }
  function setRecoilDrivePath(driveId) {
    setDrivecardPath({
      driveId,
      parentFolderId: driveId,
      itemId: driveId,
      type: "Drive"
    });
  }
  const handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      setDrivecardPath({
        driveId: item.driveId,
        parentFolderId: item.driveId,
        itemId: item.driveId,
        type: "Drive"
      });
    }
  };
  const handleKeyUp = (e, item) => {
    if (e.key === "Tab") {
      setDrivecardSelection([item]);
    }
  };
  const drivecardselection = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuPanel(0);
    if (isOneDriveSelect) {
      if (!e.shiftKey && !e.metaKey) {
        setDrivecardSelection((old) => [item]);
      }
    } else {
      if (!e.shiftKey && !e.metaKey) {
        setDrivecardSelection((old) => [item]);
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
    let availableCard = drivecardSelectedValue.filter((i) => i.driveId === cardItem.driveId && i.drivePathSyncKey === drivePathSyncKey);
    return availableCard.length > 0 ? true : false;
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "drivecardContainer"
  }, /* @__PURE__ */ React.createElement(Measure, {
    bounds: true,
    onResize: (contentRect) => {
      setWidth(contentRect.bounds.width);
    }
  }, ({measureRef}) => /* @__PURE__ */ React.createElement("div", {
    ref: measureRef,
    style: {
      width: "100%"
    },
    className: `list`
  }, driveCardItems.map((item, index) => {
    item["drivePathSyncKey"] = drivePathSyncKey;
    let isSelected = getSelectedCard(item);
    return /* @__PURE__ */ React.createElement("div", {
      key: index,
      className: `adiv ${isSelected ? "borderselection" : ""}`,
      style: {
        width: 250,
        height: 250,
        opacity: 1,
        padding: 15
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {height: "100%", outline: "none"},
      tabIndex: index + 1,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        drivecardselection(e, item, props);
      },
      onKeyDown: (e) => handleKeyDown(e, item),
      onKeyUp: (e) => handleKeyUp(e, item),
      onDoubleClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDrivecardSelection([]);
        setRecoilDrivePath(item.driveId);
      }
    }, /* @__PURE__ */ React.createElement(DriveCard, {
      image: item.image,
      color: item.color,
      label: item.label,
      isSelected,
      role: item.role
    })));
  }))));
};
export default DriveCards;
