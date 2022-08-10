import React, {Suspense} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import CourseNavigator from "../../_reactComponents/Course/CourseNavigator.js";
import styled, {keyframes} from "../../_snowpack/pkg/styled-components.js";
import {itemByDoenetId, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import {useToast, toastType} from "../Toast.js";
import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import axios from "../../_snowpack/pkg/axios.js";
const movingGradient = keyframes`
  0% { background-position: -250px 0; }
  100% { background-position: 250px 0; }
`;
const Table = styled.table`
  width: 850px;
  border-radius: 5px;
  margin-top: 50px;
  margin-left: 20px;
`;
const Tr = styled.tr``;
const Td = styled.td`
  height: 40px;
  vertical-align: middle;
  padding: 8px;
  /* border-bottom: 2px solid black; */

  &.Td2 {
    width: 50px;
  }

  &.Td3 {
    width: 400px;
  }

`;
const TBody = styled.tbody``;
const Td2Span = styled.span`
  display: block; 
  background-color: var(--mainGray);
  width: 70px;
  height: 16px;
  border-radius: 5px;
`;
const Td3Span = styled.span`
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(to right, var(--mainGray) 20%, var(--mainGray) 50%, var(--mainGray) 80%);
  background-size: 500px 100px;
  animation-name: ${movingGradient};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;
export default function DataPanel() {
  const updateSelectMenu = useRecoilCallback(({set}) => async ({selectedItems}) => {
    if (selectedItems.length > 0) {
      set(selectedMenuPanelAtom, "SelectedDataSources");
    } else {
      set(selectedMenuPanelAtom, null);
    }
  });
  const doubleClickItem = useRecoilCallback(({set, snapshot}) => async ({doenetId, courseId}) => {
    let clickedItem = await snapshot.getPromise(itemByDoenetId(doenetId));
    if (clickedItem.type == "section") {
      set(pageToolViewAtom, (prev) => {
        return {
          page: "course",
          tool: "data",
          view: prev.view,
          params: {sectionId: clickedItem.doenetId, courseId}
        };
      });
    } else {
      const resp = await axios.get(`/api/createSecretCode.php?courseId=${courseId}`);
      const {secretCode} = resp.data;
      window.open(`https://doenet.shinyapps.io/analyzer/?data=${doenetId}&code=${secretCode}`, "_blank");
    }
  });
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TBody, null, /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
      className: "Td2"
    }, /* @__PURE__ */ React.createElement(Td2Span, null)), /* @__PURE__ */ React.createElement(Td, {
      className: "Td3"
    }, /* @__PURE__ */ React.createElement(Td3Span, null))), /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
      className: "Td2"
    }, /* @__PURE__ */ React.createElement(Td2Span, null)), /* @__PURE__ */ React.createElement(Td, {
      className: "Td3"
    }, /* @__PURE__ */ React.createElement(Td3Span, null))), /* @__PURE__ */ React.createElement(Tr, null, /* @__PURE__ */ React.createElement(Td, {
      className: "Td2"
    }, /* @__PURE__ */ React.createElement(Td2Span, null)), /* @__PURE__ */ React.createElement(Td, {
      className: "Td3"
    }, /* @__PURE__ */ React.createElement(Td3Span, null)))))
  }, /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(CourseNavigator, {
    updateSelectMenu,
    doubleClickItem,
    displayRole: "student"
  })));
}
function Container(props) {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      maxWidth: "850px",
      margin: "10px 20px"
    }
  }, props.children);
}
