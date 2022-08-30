import {faLink} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {authorCollectionsByCourseId, itemByDoenetId, selectedCourseItems, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {useToast} from "../Toast.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import RelatedItems from "../../_reactComponents/PanelHeaderComponents/RelatedItems.js";
import Checkbox from "../../_reactComponents/PanelHeaderComponents/Checkbox.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
function CollectionSelectionOptions({courseId, selectedDoenetId}) {
  let collectionNameAndDoenetIds = useRecoilValue(authorCollectionsByCourseId(courseId));
  let CollectionOptionsJSX = [];
  for (let [i, obj] of collectionNameAndDoenetIds.entries()) {
    if (selectedDoenetId == obj.doenetId) {
      CollectionOptionsJSX.push(/* @__PURE__ */ React.createElement("option", {
        selected: true,
        key: `CollectionOptions${i}`,
        value: obj.doenetId
      }, obj.label));
    } else {
      CollectionOptionsJSX.push(/* @__PURE__ */ React.createElement("option", {
        key: `CollectionOptions${i}`,
        value: obj.doenetId
      }, obj.label));
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, CollectionOptionsJSX);
}
function PageOption({selected, i, pageId}) {
  let pageObj = useRecoilValue(itemByDoenetId(pageId));
  if (selected) {
    return /* @__PURE__ */ React.createElement("option", {
      selected: true,
      key: `PagesInACollection${i}`,
      value: pageId
    }, pageObj.label);
  } else {
    return /* @__PURE__ */ React.createElement("option", {
      key: `PagesInACollection${i}`,
      value: pageId
    }, pageObj.label);
  }
}
export default function SelectedCollectionLink() {
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(itemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {canEditContent} = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(itemObj.label);
  let {deleteItem, updateCollectionLink, updateContentLinksToSources} = useCourse(courseId);
  useEffect(() => {
    if (itemTextFieldLabel !== itemObj.label) {
      setItemTextFieldLabel(itemObj.label);
    }
  }, [doenetId]);
  const handelLabelModfication = () => {
    let effectiveItemLabel = itemTextFieldLabel;
    if (itemTextFieldLabel === "") {
      effectiveItemLabel = itemObj.label;
      if (itemObj.label === "") {
        effectiveItemLabel = "Untitled Collection Link";
      }
      setItemTextFieldLabel(effectiveItemLabel);
      addToast("Every item must have a label.");
    }
    if (itemObj.label !== effectiveItemLabel) {
      console.log("Rename", doenetId, effectiveItemLabel);
      updateCollectionLink({courseId, doenetId, label: effectiveItemLabel, collectionDoenetId: itemObj.collectionDoenetId, isManuallyFiltered: itemObj.isManuallyFiltered, manuallyFilteredPages: itemObj.manuallyFilteredPages});
    }
  };
  const addToast = useToast();
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-test": "infoPanelItemLabel",
    style: {margin: "16px 5px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faLink
  }), " ", itemObj.label);
  if (canEditContent !== "1") {
    return null;
  }
  let collectionsInCourseJSX = /* @__PURE__ */ React.createElement(CollectionSelectionOptions, {
    courseId,
    selectedDoenetId: itemObj.collectionDoenetId
  });
  let pageAliasesJSX = null;
  if (itemObj.collectionDoenetId) {
    let storedPageOptionsJSX = [];
    for (let [i, pageId] of Object.entries(itemObj.pagesByCollectionSource[itemObj.collectionDoenetId])) {
      let selected = false;
      if (itemObj?.manuallyFilteredPages && itemObj.manuallyFilteredPages.includes(pageId)) {
        selected = true;
      }
      storedPageOptionsJSX.push(/* @__PURE__ */ React.createElement(PageOption, {
        selected,
        i,
        pageId
      }));
    }
    pageAliasesJSX = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      style: {display: "flex"}
    }, /* @__PURE__ */ React.createElement(Checkbox, {
      style: {marginRight: "5px"},
      checked: itemObj.isManuallyFiltered,
      onClick: () => {
        updateCollectionLink({courseId, doenetId, collectionDoenetId: itemObj.collectionDoenetId, isManuallyFiltered: !itemObj.isManuallyFiltered, manuallyFilteredPages: itemObj.manuallyFilteredPages});
      }
    }), "Filter Page Links"), /* @__PURE__ */ React.createElement(RelatedItems, {
      width: "menu",
      options: storedPageOptionsJSX,
      disabled: !itemObj.isManuallyFiltered,
      onChange: (e) => {
        let values = Array.from(e.target.selectedOptions, (option) => option.value);
        updateCollectionLink({courseId, doenetId, collectionDoenetId: itemObj.collectionDoenetId, isManuallyFiltered: itemObj.isManuallyFiltered, manuallyFilteredPages: values});
      },
      multiple: true
    }), /* @__PURE__ */ React.createElement("br", null));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(Textfield, {
    label: "Label",
    vertical: true,
    width: "menu",
    value: itemTextFieldLabel,
    onChange: (e) => setItemTextFieldLabel(e.target.value),
    onKeyDown: (e) => {
      if (e.keyCode === 13)
        handelLabelModfication();
    },
    onBlur: handelLabelModfication
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("div", null, "collection"), /* @__PURE__ */ React.createElement(RelatedItems, {
    width: "menu",
    options: collectionsInCourseJSX,
    onChange: (e) => {
      updateCollectionLink({courseId, doenetId, collectionDoenetId: e.target.value, isManuallyFiltered: false, manuallyFilteredPages: []});
    }
  }), /* @__PURE__ */ React.createElement("br", null), pageAliasesJSX, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Update Content to Sources",
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateContentLinksToSources({collectionDoenetId: itemObj.collectionDoenetId, pages: itemObj.pages});
    }
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Delete Collection Link",
    alert: true,
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteItem({doenetId});
    }
  }));
}
