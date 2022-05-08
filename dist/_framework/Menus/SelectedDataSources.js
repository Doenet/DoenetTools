import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {selectedCourseItems, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useToast, toastType} from "../Toast.js";
export default function SelectedDataSources() {
  const [pageDoenetIds, setPageDoenetIds] = useState([]);
  const selectedDoenetIds = useRecoilValue(selectedCourseItems);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {findPagesFromDoenetIds} = useCourse(courseId);
  useEffect(() => {
    if (selectedDoenetIds.length > 0) {
      findPagesFromDoenetIds(selectedDoenetIds).then((pages) => {
        setPageDoenetIds(pages);
      });
    } else {
      setPageDoenetIds([]);
    }
  }, [selectedDoenetIds]);
  const addToast = useToast();
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-cy": "selectedDataSourcesHeading",
    style: {margin: "16px 5px"}
  }, "Event Data");
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement("div", null, pageDoenetIds.length, " Page", pageDoenetIds.length == 1 ? "" : "s"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "View on Shiny",
    disabled: pageDoenetIds.length == 0,
    onClick: () => {
      if (pageDoenetIds.length == 0) {
        addToast(`No pages found`, toastType.INFO);
      } else {
        console.log("Open Link to data for Pages", pageDoenetIds);
      }
    }
  }));
}
