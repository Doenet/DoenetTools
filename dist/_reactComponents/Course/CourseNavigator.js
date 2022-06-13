import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from "../../_snowpack/pkg/react.js";
import Measure from "../../_snowpack/pkg/react-measure.js";
import {
  faCode,
  faFileCode,
  faFileExport,
  faLayerGroup,
  faFolderTree,
  faChevronRight,
  faChevronDown,
  faCheck
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  useRecoilValue,
  useRecoilCallback,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {
  authorCourseItemOrderByCourseId,
  itemByDoenetId,
  coursePermissionsAndSettingsByCourseId,
  useInitCourseItems,
  selectedCourseItems,
  authorCourseItemOrderByCourseIdBySection,
  studentCourseItemOrderByCourseIdBySection
} from "./CourseActions.js";
import "../../_utils/util.css.proxy.js";
import {searchParamAtomFamily} from "../../_framework/NewToolRoot.js";
import {mainPanelClickAtom} from "../../_framework/Panels/NewMainPanel.js";
import {selectedMenuPanelAtom} from "../../_framework/Panels/NewMenuPanel.js";
import {effectiveRoleAtom} from "../PanelHeaderComponents/RoleDropdown.js";
export default function CourseNavigator(props) {
  console.log("=== CourseNavigator");
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const sectionId = useRecoilValue(searchParamAtomFamily("sectionId"));
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  let coursePermissionsAndSettings = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  useInitCourseItems(courseId);
  const [numberOfVisibleColumns, setNumberOfVisibleColumns] = useState(1);
  let setMainPanelClick = useSetRecoilState(mainPanelClickAtom);
  let clearSelections = useRecoilCallback(({snapshot, set}) => async () => {
    const selectedItems = await snapshot.getPromise(selectedCourseItems);
    set(selectedMenuPanelAtom, null);
    set(selectedCourseItems, []);
    for (let deselectId of selectedItems) {
      set(itemByDoenetId(deselectId), (was) => {
        let newObj = {...was};
        newObj.isSelected = false;
        return newObj;
      });
    }
  });
  useEffect(() => {
    setMainPanelClick((was) => {
      let newObj = [...was];
      newObj.push(clearSelections);
      return newObj;
    });
  }, [clearSelections, setMainPanelClick]);
  if (!coursePermissionsAndSettings) {
    return null;
  }
  if (coursePermissionsAndSettings.canEditContent == "0" || effectiveRole == "student" || props.displayRole == "student") {
    return /* @__PURE__ */ React.createElement(StudentCourseNavigation, {
      courseNavigatorProps: props,
      courseId,
      sectionId,
      numberOfVisibleColumns,
      setNumberOfVisibleColumns
    });
  }
  if (coursePermissionsAndSettings.canEditContent == "1" || effectiveRole == "instructor" || props.displayRole == "instructor") {
    return /* @__PURE__ */ React.createElement(AuthorCourseNavigation, {
      courseNavigatorProps: props,
      courseId,
      sectionId,
      numberOfVisibleColumns,
      setNumberOfVisibleColumns
    });
  }
  return null;
}
function StudentCourseNavigation({courseId, sectionId, numberOfVisibleColumns, setNumberOfVisibleColumns, courseNavigatorProps}) {
  let studentItemOrder = useRecoilValue(studentCourseItemOrderByCourseIdBySection({courseId, sectionId}));
  console.log("studentItemOrder", studentItemOrder);
  let previousSections = useRef([]);
  let definedForSectionId = useRef("");
  if (definedForSectionId.current != sectionId) {
    previousSections.current = [];
    definedForSectionId.current = sectionId;
  }
  let items = [];
  studentItemOrder.map((doenetId) => items.push(/* @__PURE__ */ React.createElement(StudentItem, {
    key: `itemcomponent${doenetId}`,
    courseId,
    doenetId,
    indentLevel: 0,
    previousSections,
    courseNavigatorProps,
    numberOfVisibleColumns
  })));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CourseNavigationHeader, {
    columnLabels: ["Due Date"],
    numberOfVisibleColumns,
    setNumberOfVisibleColumns
  }), items);
}
function StudentItem({courseId, doenetId, numberOfVisibleColumns, indentLevel, previousSections, courseNavigatorProps}) {
  let itemInfo = useRecoilValue(itemByDoenetId(doenetId));
  if (itemInfo.type == "section" && previousSections?.current) {
    previousSections.current.push(itemInfo.doenetId);
  }
  if (previousSections?.current.includes(itemInfo.parentDoenetId)) {
    return null;
  }
  if (itemInfo.type == "section") {
    return /* @__PURE__ */ React.createElement(StudentSection, {
      key: `Item${doenetId}`,
      courseNavigatorProps,
      courseId,
      doenetId,
      itemInfo,
      numberOfVisibleColumns,
      indentLevel
    });
  } else if (itemInfo.type == "activity") {
    return /* @__PURE__ */ React.createElement(StudentActivity, {
      key: `Item${doenetId}`,
      courseNavigatorProps,
      courseId,
      doenetId,
      itemInfo,
      numberOfVisibleColumns,
      indentLevel
    });
  }
  return null;
}
function StudentSection({courseId, doenetId, itemInfo, numberOfVisibleColumns, indentLevel, courseNavigatorProps}) {
  let studentSectionItemOrder = useRecoilValue(studentCourseItemOrderByCourseIdBySection({courseId, sectionId: itemInfo.doenetId}));
  let previousSections = useRef([]);
  if (itemInfo.isOpen) {
    let sectionItems = studentSectionItemOrder.map((doenetId2) => /* @__PURE__ */ React.createElement(StudentItem, {
      key: `itemcomponent${doenetId2}`,
      courseNavigatorProps,
      previousSections,
      courseId,
      doenetId: doenetId2,
      numberOfVisibleColumns,
      indentLevel: indentLevel + 1
    }));
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
      courseId,
      courseNavigatorProps,
      numberOfVisibleColumns,
      icon: faFolderTree,
      label: itemInfo.label,
      doenetId,
      hasToggle: true,
      isOpen: itemInfo.isOpen,
      isSelected: itemInfo.isSelected,
      indentLevel
    }), sectionItems);
  } else {
    return /* @__PURE__ */ React.createElement(Row, {
      courseId,
      courseNavigatorProps,
      numberOfVisibleColumns,
      icon: faFolderTree,
      label: itemInfo.label,
      doenetId,
      hasToggle: true,
      isOpen: itemInfo.isOpen,
      isSelected: itemInfo.isSelected,
      indentLevel
    });
  }
}
function StudentActivity({courseId, doenetId, itemInfo, numberOfVisibleColumns, indentLevel, courseNavigatorProps}) {
  let columnsJSX = [null];
  if (itemInfo.dueDate) {
    columnsJSX[0] = /* @__PURE__ */ React.createElement("span", {
      key: `activityColumn2${doenetId}`
    }, itemInfo.dueDate);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
    courseId,
    courseNavigatorProps,
    columnsJSX,
    numberOfVisibleColumns,
    icon: faFileCode,
    label: itemInfo.label,
    doenetId,
    isSelected: itemInfo.isSelected,
    indentLevel,
    isBeingCut: itemInfo.isBeingCut
  }));
}
function AuthorCourseNavigation({courseId, sectionId, numberOfVisibleColumns, setNumberOfVisibleColumns, courseNavigatorProps}) {
  let authorItemOrder = useRecoilValue(authorCourseItemOrderByCourseIdBySection({courseId, sectionId}));
  console.log("authorItemOrder", authorItemOrder);
  let previousSections = useRef([]);
  let definedForSectionId = useRef("");
  if (definedForSectionId.current != sectionId) {
    previousSections.current = [];
    definedForSectionId.current = sectionId;
  }
  let items = authorItemOrder.map((doenetId) => /* @__PURE__ */ React.createElement(Item, {
    key: `itemcomponent${doenetId}`,
    courseNavigatorProps,
    previousSections,
    courseId,
    doenetId,
    numberOfVisibleColumns,
    indentLevel: 0
  }));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CourseNavigationHeader, {
    columnLabels: ["Assigned", "Public"],
    numberOfVisibleColumns,
    setNumberOfVisibleColumns
  }), items);
}
function Item({courseId, doenetId, numberOfVisibleColumns, indentLevel, previousSections, courseNavigatorProps}) {
  let itemInfo = useRecoilValue(itemByDoenetId(doenetId));
  if (itemInfo.type == "section" && previousSections?.current) {
    previousSections.current.push(itemInfo.doenetId);
  }
  if (previousSections?.current.includes(itemInfo.parentDoenetId)) {
    return null;
  }
  if (itemInfo.type == "section") {
    return /* @__PURE__ */ React.createElement(Section, {
      key: `Item${doenetId}`,
      courseNavigatorProps,
      courseId,
      doenetId,
      itemInfo,
      numberOfVisibleColumns,
      indentLevel
    });
  } else if (itemInfo.type == "bank") {
    return /* @__PURE__ */ React.createElement(Bank, {
      key: `Item${doenetId}`,
      courseNavigatorProps,
      courseId,
      doenetId,
      itemInfo,
      numberOfVisibleColumns,
      indentLevel
    });
  } else if (itemInfo.type == "activity") {
    return /* @__PURE__ */ React.createElement(Activity, {
      key: `Item${doenetId}`,
      courseNavigatorProps,
      courseId,
      doenetId,
      itemInfo,
      numberOfVisibleColumns,
      indentLevel
    });
  }
  return null;
}
function Section({courseId, doenetId, itemInfo, numberOfVisibleColumns, indentLevel, courseNavigatorProps}) {
  let authorSectionItemOrder = useRecoilValue(authorCourseItemOrderByCourseIdBySection({courseId, sectionId: itemInfo.doenetId}));
  let previousSections = useRef([]);
  let columnsJSX = [null, null];
  if (itemInfo.isAssigned) {
    columnsJSX[0] = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      key: `activityColumn2${doenetId}`,
      icon: faCheck
    });
  }
  if (itemInfo.isOpen) {
    let sectionItems = authorSectionItemOrder.map((doenetId2) => /* @__PURE__ */ React.createElement(Item, {
      key: `itemcomponent${doenetId2}`,
      courseNavigatorProps,
      previousSections,
      courseId,
      doenetId: doenetId2,
      numberOfVisibleColumns,
      indentLevel: indentLevel + 1
    }));
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
      courseId,
      columnsJSX,
      courseNavigatorProps,
      isBeingCut: itemInfo.isBeingCut,
      numberOfVisibleColumns,
      icon: faFolderTree,
      label: itemInfo.label,
      doenetId,
      hasToggle: true,
      isOpen: itemInfo.isOpen,
      isSelected: itemInfo.isSelected,
      indentLevel
    }), sectionItems);
  } else {
    return /* @__PURE__ */ React.createElement(Row, {
      courseId,
      columnsJSX,
      courseNavigatorProps,
      isBeingCut: itemInfo.isBeingCut,
      numberOfVisibleColumns,
      icon: faFolderTree,
      label: itemInfo.label,
      doenetId,
      hasToggle: true,
      isOpen: itemInfo.isOpen,
      isSelected: itemInfo.isSelected,
      indentLevel
    });
  }
}
function Bank({courseId, doenetId, itemInfo, numberOfVisibleColumns, indentLevel, courseNavigatorProps}) {
  if (itemInfo.isOpen) {
    let pages = itemInfo.pages.map((pageDoenetId, i) => {
      return /* @__PURE__ */ React.createElement(Page, {
        key: `Page${pageDoenetId}`,
        courseNavigatorProps,
        courseId,
        doenetId: pageDoenetId,
        numberOfVisibleColumns,
        indentLevel: indentLevel + 1,
        number: i + 1
      });
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
      courseId,
      courseNavigatorProps,
      numberOfVisibleColumns,
      icon: faLayerGroup,
      label: itemInfo.label,
      doenetId,
      hasToggle: true,
      isOpen: itemInfo.isOpen,
      isSelected: itemInfo.isSelected,
      isBeingCut: itemInfo.isBeingCut,
      indentLevel
    }), pages);
  } else {
    return /* @__PURE__ */ React.createElement(Row, {
      courseId,
      courseNavigatorProps,
      numberOfVisibleColumns,
      icon: faLayerGroup,
      label: itemInfo.label,
      doenetId,
      hasToggle: true,
      isOpen: itemInfo.isOpen,
      isSelected: itemInfo.isSelected,
      isBeingCut: itemInfo.isBeingCut,
      indentLevel
    });
  }
}
function Activity({courseId, doenetId, itemInfo, numberOfVisibleColumns, indentLevel, courseNavigatorProps}) {
  let columnsJSX = [null, null];
  if (itemInfo.isAssigned) {
    columnsJSX[0] = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      key: `activityColumn2${doenetId}`,
      icon: faCheck
    });
  }
  if (itemInfo.isPublic) {
    columnsJSX[1] = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      key: `activityColumn3${doenetId}`,
      icon: faCheck
    });
  }
  if (itemInfo.isSinglePage) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
      courseId,
      courseNavigatorProps,
      columnsJSX,
      numberOfVisibleColumns,
      icon: faFileCode,
      label: itemInfo.label,
      doenetId,
      isSelected: itemInfo.isSelected,
      indentLevel,
      isBeingCut: itemInfo.isBeingCut
    }));
  }
  if (itemInfo.isOpen) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
      courseId,
      courseNavigatorProps,
      columnsJSX,
      numberOfVisibleColumns,
      icon: faFileCode,
      label: itemInfo.label,
      doenetId,
      hasToggle: true,
      isOpen: itemInfo.isOpen,
      isSelected: itemInfo.isSelected,
      indentLevel,
      isBeingCut: itemInfo.isBeingCut
    }), /* @__PURE__ */ React.createElement(Order, {
      key: `Order${doenetId}`,
      courseNavigatorProps,
      orderInfo: itemInfo.order,
      courseId,
      activityDoenetId: doenetId,
      numberOfVisibleColumns: 1,
      indentLevel: indentLevel + 1
    }));
  } else {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
      courseId,
      courseNavigatorProps,
      columnsJSX,
      numberOfVisibleColumns,
      icon: faFileCode,
      label: itemInfo.label,
      doenetId,
      hasToggle: true,
      isOpen: itemInfo.isOpen,
      isSelected: itemInfo.isSelected,
      indentLevel,
      isBeingCut: itemInfo.isBeingCut
    }));
  }
}
function Order({courseId, activityDoenetId, numberOfVisibleColumns, indentLevel, orderInfo, courseNavigatorProps}) {
  let {behavior, doenetId, content, numberToSelect, withReplacement} = orderInfo;
  let recoilOrderInfo = useRecoilValue(itemByDoenetId(doenetId));
  let contentJSX = [];
  if (behavior == "sequence") {
    contentJSX = content.map((pageOrOrder, i) => {
      if (pageOrOrder?.type == "order") {
        return /* @__PURE__ */ React.createElement(Order, {
          key: `Order${i}${doenetId}`,
          courseNavigatorProps,
          orderInfo: pageOrOrder,
          courseId,
          activityDoenetId: doenetId,
          numberOfVisibleColumns: 1,
          indentLevel: indentLevel + 1
        });
      } else {
        return /* @__PURE__ */ React.createElement(Page, {
          key: `NavPage${i}`,
          courseNavigatorProps,
          courseId,
          doenetId: pageOrOrder,
          activityDoenetId,
          numberOfVisibleColumns,
          indentLevel: indentLevel + 1,
          number: i + 1
        });
      }
    });
  } else {
    contentJSX = content.map((pageOrOrder, i) => {
      if (pageOrOrder?.type == "order") {
        return /* @__PURE__ */ React.createElement(Order, {
          key: `Order${i}${doenetId}`,
          courseNavigatorProps,
          orderInfo: pageOrOrder,
          courseId,
          activityDoenetId: doenetId,
          numberOfVisibleColumns: 1,
          indentLevel: indentLevel + 1
        });
      } else {
        return /* @__PURE__ */ React.createElement(Page, {
          key: `NavPage${i}`,
          courseNavigatorProps,
          courseId,
          doenetId: pageOrOrder,
          activityDoenetId,
          numberOfVisibleColumns,
          indentLevel: indentLevel + 1
        });
      }
    });
  }
  let label = behavior;
  if (behavior == "select") {
    if (withReplacement) {
      label = `${behavior} ${numberToSelect} with replacement`;
    } else {
      label = `${behavior} ${numberToSelect} without replacement`;
    }
  }
  if (recoilOrderInfo.isOpen) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
      courseId,
      courseNavigatorProps,
      numberOfVisibleColumns,
      icon: faFileExport,
      label,
      doenetId,
      hasToggle: true,
      isOpen: recoilOrderInfo.isOpen,
      isSelected: recoilOrderInfo.isSelected,
      indentLevel
    }), contentJSX);
  } else {
    return /* @__PURE__ */ React.createElement(Row, {
      courseId,
      courseNavigatorProps,
      numberOfVisibleColumns,
      icon: faFileExport,
      label,
      doenetId,
      hasToggle: true,
      isOpen: recoilOrderInfo.isOpen,
      isSelected: recoilOrderInfo.isSelected,
      indentLevel
    });
  }
}
function Page({courseId, doenetId, activityDoenetId, numberOfVisibleColumns, indentLevel, number = null, courseNavigatorProps}) {
  let recoilPageInfo = useRecoilValue(itemByDoenetId(doenetId));
  return /* @__PURE__ */ React.createElement(Row, {
    courseId,
    courseNavigatorProps,
    numberOfVisibleColumns,
    icon: faCode,
    label: recoilPageInfo.label,
    doenetId: recoilPageInfo.doenetId,
    indentLevel,
    numbered: number,
    isSelected: recoilPageInfo.isSelected,
    isBeingCut: recoilPageInfo.isBeingCut
  });
}
function Row({courseId, doenetId, numberOfVisibleColumns, columnsJSX = [], icon, label, isSelected = false, indentLevel = 0, numbered, hasToggle = false, isOpen, isBeingCut = false, courseNavigatorProps}) {
  const setSelectionMenu = useSetRecoilState(selectedMenuPanelAtom);
  let openCloseIndicator = null;
  let toggleOpenClosed = useRecoilCallback(({set}) => () => {
    set(itemByDoenetId(doenetId), (was) => {
      let newObj = {...was};
      newObj.isOpen = !newObj.isOpen;
      return newObj;
    });
  }, [doenetId]);
  if (hasToggle) {
    openCloseIndicator = isOpen ? /* @__PURE__ */ React.createElement("span", {
      "data-cy": "folderToggleCloseIcon",
      onClick: () => {
        if (hasToggle) {
          toggleOpenClosed();
        }
      }
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChevronDown
    })) : /* @__PURE__ */ React.createElement("span", {
      "data-cy": "folderToggleOpenIcon",
      onClick: () => {
        if (hasToggle) {
          toggleOpenClosed();
        }
      }
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChevronRight
    }));
  }
  let handleSingleSelectionClick = useRecoilCallback(({snapshot, set}) => async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let selectedItems = await snapshot.getPromise(selectedCourseItems);
    let clickedItem = await snapshot.getPromise(itemByDoenetId(doenetId));
    console.log("clickedItem", clickedItem.type, clickedItem.doenetId, clickedItem);
    let newSelectedItems = [];
    if (selectedItems.length == 0) {
      newSelectedItems = [doenetId];
      set(itemByDoenetId(doenetId), (was) => {
        let newObj = {...was};
        newObj.isSelected = true;
        return newObj;
      });
    } else if (selectedItems.length == 1 && selectedItems[0] == doenetId) {
      if (e.metaKey) {
        newSelectedItems = [];
        set(itemByDoenetId(doenetId), (was) => {
          let newObj = {...was};
          newObj.isSelected = false;
          return newObj;
        });
      } else {
        newSelectedItems = [...selectedItems];
      }
    } else {
      if (e.shiftKey) {
        const authorItemDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId));
        let allRenderedRows = [];
        let skip = false;
        let parentDoenetIdsToSkip = [];
        for (let i = 0; i < authorItemDoenetIds.length; i++) {
          let itemDoenetId = authorItemDoenetIds[i];
          const authorItemInfo = await snapshot.getPromise(itemByDoenetId(itemDoenetId));
          if (skip) {
            if (!parentDoenetIdsToSkip.includes(authorItemInfo.parentDoenetId)) {
              skip = false;
              parentDoenetIdsToSkip = [];
            } else {
              if (authorItemInfo.type == "order") {
                parentDoenetIdsToSkip.push(authorItemInfo.doenetId);
              }
            }
          }
          if (!skip) {
            allRenderedRows.push(itemDoenetId);
            if (authorItemInfo?.isOpen !== void 0 && !authorItemInfo.isOpen) {
              skip = true;
              parentDoenetIdsToSkip.push(authorItemInfo.doenetId);
            }
          }
        }
        let lastSelectedDoenetId = selectedItems[selectedItems.length - 1];
        let indexOfLastSelected = allRenderedRows.indexOf(lastSelectedDoenetId);
        let indexOfClick = allRenderedRows.indexOf(doenetId);
        let itemsToSelect = allRenderedRows.slice(Math.min(indexOfLastSelected, indexOfClick), Math.max(indexOfLastSelected, indexOfClick) + 1);
        if (indexOfLastSelected > indexOfClick) {
          itemsToSelect.reverse();
        }
        newSelectedItems = [...selectedItems];
        for (let newDoenetId of itemsToSelect) {
          if (!selectedItems.includes(newDoenetId)) {
            newSelectedItems.push(newDoenetId);
            set(itemByDoenetId(newDoenetId), (was) => {
              let newObj = {...was};
              newObj.isSelected = true;
              return newObj;
            });
          }
        }
      } else if (e.metaKey) {
        let itemWasSelected = selectedItems.includes(doenetId);
        if (itemWasSelected) {
          newSelectedItems = selectedItems.filter((testId) => {
            return testId != doenetId;
          });
          set(itemByDoenetId(doenetId), (was) => {
            let newObj = {...was};
            newObj.isSelected = false;
            return newObj;
          });
        } else {
          newSelectedItems = [...selectedItems, doenetId];
          set(itemByDoenetId(doenetId), (was) => {
            let newObj = {...was};
            newObj.isSelected = true;
            return newObj;
          });
        }
      } else {
        newSelectedItems = [doenetId];
        set(itemByDoenetId(doenetId), (was) => {
          let newObj = {...was};
          newObj.isSelected = true;
          return newObj;
        });
        for (let doenetIdToUnselect of selectedItems) {
          if (doenetId != doenetIdToUnselect) {
            set(itemByDoenetId(doenetIdToUnselect), (was) => {
              let newObj = {...was};
              newObj.isSelected = false;
              return newObj;
            });
          }
        }
      }
    }
    set(selectedCourseItems, newSelectedItems);
    courseNavigatorProps?.updateSelectMenu({selectedItems: newSelectedItems});
  }, [doenetId, courseId, setSelectionMenu]);
  let handleDoubleClick = useRecoilCallback(() => async (e) => {
    e.preventDefault();
    e.stopPropagation();
    courseNavigatorProps?.doubleClickItem({doenetId, courseId});
  }, [doenetId, courseId, courseNavigatorProps]);
  let bgcolor = "#ffffff";
  if (isSelected) {
    bgcolor = "hsl(209,54%,82%)";
  } else if (isBeingCut) {
    bgcolor = "#e2e2e2";
  }
  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);
  const indentPx = 25;
  let activityJSX = /* @__PURE__ */ React.createElement("div", {
    key: `Row${doenetId}`,
    role: "button",
    "data-cy": "courseItem",
    tabIndex: 0,
    className: "noselect nooutline",
    style: {
      cursor: "pointer",
      padding: "8px",
      border: "0px",
      borderBottom: "2px solid black",
      backgroundColor: bgcolor,
      width: "auto"
    },
    onClick: (e) => {
      handleSingleSelectionClick(e);
    },
    onDoubleClick: (e) => {
      handleDoubleClick(e);
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: columnsCSS,
      gridTemplateRows: "1fr",
      alignContent: "center"
    }
  }, /* @__PURE__ */ React.createElement("span", {
    style: {
      marginLeft: `${indentLevel * indentPx}px`
    }
  }, /* @__PURE__ */ React.createElement("p", {
    style: {
      display: "inline",
      margin: "0px"
    }
  }, numbered ? /* @__PURE__ */ React.createElement("svg", {
    style: {verticalAlign: "middle"},
    width: "22",
    height: "22",
    viewBox: "0 0 22 22"
  }, /* @__PURE__ */ React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "12",
    stroke: "white",
    strokeWidth: "2",
    fill: "#1A5A99"
  }), /* @__PURE__ */ React.createElement("text", {
    fontSize: "14",
    fill: "white",
    fontFamily: "Verdana",
    textAnchor: "middle",
    alignmentBaseline: "baseline",
    x: "11",
    y: "16"
  }, numbered)) : null, openCloseIndicator, /* @__PURE__ */ React.createElement("span", {
    style: {marginLeft: "8px"},
    "data-cy": "rowIcon"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon
  })), /* @__PURE__ */ React.createElement("span", {
    style: {marginLeft: "4px"},
    "data-cy": "rowLabel"
  }, label, " "))), numberOfVisibleColumns > 1 ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnsJSX[0]) : null, numberOfVisibleColumns > 2 ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnsJSX[1]) : null, numberOfVisibleColumns > 3 ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnsJSX[2]) : null, numberOfVisibleColumns > 4 ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnsJSX[3]) : null));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, activityJSX);
}
function getColumnsCSS(numberOfVisibleColumns) {
  let columnsCSS = "250px repeat(4,1fr)";
  if (numberOfVisibleColumns === 4) {
    columnsCSS = "250px repeat(3,1fr)";
  } else if (numberOfVisibleColumns === 3) {
    columnsCSS = "250px 1fr 1fr";
  } else if (numberOfVisibleColumns === 2) {
    columnsCSS = "250px 1fr";
  } else if (numberOfVisibleColumns === 1) {
    columnsCSS = "100%";
  }
  return columnsCSS;
}
function CourseNavigationHeader({columnLabels, numberOfVisibleColumns, setNumberOfVisibleColumns}) {
  const updateNumColumns = useCallback((width) => {
    const maxColumns = columnLabels.length + 1;
    const breakpoints = [375, 500, 650, 800];
    if (width >= breakpoints[3] && numberOfVisibleColumns !== 5) {
      const nextNumberOfVisibleColumns = Math.min(maxColumns, 5);
      setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
    } else if (width < breakpoints[3] && width >= breakpoints[2] && numberOfVisibleColumns !== 4) {
      const nextNumberOfVisibleColumns = Math.min(maxColumns, 4);
      setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
    } else if (width < breakpoints[2] && width >= breakpoints[1] && numberOfVisibleColumns !== 3) {
      const nextNumberOfVisibleColumns = Math.min(maxColumns, 3);
      setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
    } else if (width < breakpoints[1] && width >= breakpoints[0] && numberOfVisibleColumns !== 2) {
      const nextNumberOfVisibleColumns = Math.min(maxColumns, 2);
      setNumberOfVisibleColumns?.(nextNumberOfVisibleColumns);
    } else if (width < breakpoints[0] && numberOfVisibleColumns !== 1) {
      setNumberOfVisibleColumns?.(1);
    } else if (numberOfVisibleColumns > maxColumns) {
      setNumberOfVisibleColumns?.(maxColumns);
    }
  }, [columnLabels, numberOfVisibleColumns, setNumberOfVisibleColumns]);
  let columnsCSS = getColumnsCSS(numberOfVisibleColumns);
  return /* @__PURE__ */ React.createElement(Measure, {
    bounds: true,
    onResize: (contentRect) => {
      const width = contentRect.bounds.width;
      updateNumColumns(width);
    }
  }, ({measureRef}) => /* @__PURE__ */ React.createElement("div", {
    ref: measureRef,
    className: "noselect nooutline",
    style: {
      padding: "8px",
      border: "0px",
      borderBottom: "1px solid grey",
      maxWidth: "850px",
      margin: "0px"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: columnsCSS,
      gridTemplateRows: "1fr",
      alignContent: "center"
    }
  }, /* @__PURE__ */ React.createElement("span", null, "Label"), numberOfVisibleColumns >= 2 && columnLabels[0] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnLabels[0]) : null, numberOfVisibleColumns >= 3 && columnLabels[1] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnLabels[1]) : null, numberOfVisibleColumns >= 4 && columnLabels[2] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnLabels[2]) : null, numberOfVisibleColumns >= 5 && columnLabels[3] ? /* @__PURE__ */ React.createElement("span", {
    style: {textAlign: "center"}
  }, columnLabels[3]) : null)));
}
