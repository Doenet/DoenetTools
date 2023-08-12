/**
 * External dependencies
 */
import React, { Suspense, useLayoutEffect } from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
/**
 * Internal dependencies
 */
import { useToast, toastType } from "../Toast";
import { suppressMenusAtom } from "../NewToolRoot";
import { selectedMenuPanelAtom } from "../Panels/NewMenuPanel";
import { searchParamAtomFamily, pageToolViewAtom } from "../NewToolRoot";
import CourseNavigator from "../../../_reactComponents/Course/CourseNavigator";
import { effectivePermissionsByCourseId } from "../../../_reactComponents/PanelHeaderComponents/RoleDropdown";
import {
  itemByDoenetId,
  findFirstPageOfActivity,
  coursePermissionsAndSettingsByCourseId,
  selectedCourseItems,
} from "../../../_reactComponents/Course/CourseActions";
import { useNavigate } from "react-router";

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
  /* border-bottom: 2px solid var(--canvastext); */

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
  //background-color: var(--canvastext);
  width: 70px;
  height: 16px;
  border-radius: 5px;
`;
const Td3Span = styled.span`
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(
    to right,
    var(--mainGray) 20%,
    var(--mainGray) 50%,
    var(--mainGray) 80%
  );
  background-size: 500px 100px;
  animation-name: ${movingGradient};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;

export default function NavigationPanel() {
  //TODO: switch to effectivePermissions
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const { canEditContent } = useRecoilValue(
    effectivePermissionsByCourseId(courseId),
  );
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const addToast = useToast();

  useLayoutEffect(() => {
    setSuppressMenus(
      canEditContent == "1" ? [] : ["AddDriveItems", "CutCopyPasteMenu"],
    );
  }, [canEditContent, setSuppressMenus]);

  const updateSelectMenu = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ singleItem }) => {
        console.log(`singleItem doenetId:${singleItem?.doenetId}`, singleItem);
        if (singleItem !== null) {
          if (singleItem.type == "activity") {
            set(selectedMenuPanelAtom, "SelectedActivity");
          } else if (singleItem.type == "order") {
            set(selectedMenuPanelAtom, "SelectedOrder");
          } else if (singleItem.type == "page") {
            set(selectedMenuPanelAtom, "SelectedPage");
          } else if (singleItem.type == "section") {
            set(selectedMenuPanelAtom, "SelectedSection");
          } else if (singleItem.type == "bank") {
            set(selectedMenuPanelAtom, "SelectedBank");
          } else if (singleItem.type == "collectionLink") {
            set(selectedMenuPanelAtom, "SelectedCollectionLink");
          } else if (singleItem.type == "pageLink") {
            set(selectedMenuPanelAtom, "SelectedPageLink");
          } else {
            set(selectedMenuPanelAtom, null);
          }
        } else {
          set(selectedMenuPanelAtom, null);
        }
      },
  );

  const navigate = useNavigate();
  let clearSelections = useRecoilCallback(({ snapshot, set }) => async () => {
    const selectedItems = await snapshot.getPromise(selectedCourseItems);
    set(selectedMenuPanelAtom, null);
    set(selectedCourseItems, []);
    for (let deselectId of selectedItems) {
      set(itemByDoenetId(deselectId), (was) => {
        let newObj = { ...was };
        newObj.isSelected = false;
        return newObj;
      });
    }
  });

  const doubleClickItem = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ doenetId, courseId }) => {
        let clickedItem = await snapshot.getPromise(itemByDoenetId(doenetId));

        let { canEditContent } = await snapshot.getPromise(
          effectivePermissionsByCourseId(courseId),
        );
        if (clickedItem.type == "page") {
          clearSelections();
          navigate(
            `/courseactivityeditor/${clickedItem.containingDoenetId}/${doenetId}`,
          );
        } else if (clickedItem.type == "pageLink") {
          //TODO!
          // set(pageToolViewAtom, (prev) => {
          //   return {
          //     page: "course",
          //     tool: "editor",
          //     view: prev.view,
          //     params: {
          //       linkPageId: doenetId,
          //     },
          //   };
          // });
        } else if (clickedItem.type == "activity") {
          if (canEditContent == "1") {
            //Find first page
            let pageDoenetId = findFirstPageOfActivity(clickedItem.content);
            if (pageDoenetId == null) {
              //addToast(`ERROR: No page found in activity`, toastType.INFO);
            } else {
              clearSelections();
              navigate(`/courseactivityeditor/${doenetId}/${pageDoenetId}`);
            }
          } else {
            set(pageToolViewAtom, {
              page: "course",
              tool: "assignment",
              view: "",
              params: {
                doenetId,
              },
            });
          }
        } else if (clickedItem.type == "section") {
          set(pageToolViewAtom, (prev) => {
            return {
              page: "course",
              tool: "navigation",
              view: prev.view,
              params: { sectionId: clickedItem.doenetId, courseId },
            };
          });
        }
      },
  );

  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));

  if (course?.canViewCourse == "0") {
    return <h1>No Access to view this page.</h1>;
  }

  return (
    <Suspense
      fallback={
        <Table>
          <TBody>
            <Tr>
              <Td className="Td2">
                <Td2Span></Td2Span>
              </Td>
              <Td className="Td3">
                <Td3Span></Td3Span>
              </Td>
            </Tr>
            <Tr>
              <Td className="Td2">
                <Td2Span></Td2Span>
              </Td>
              <Td className="Td3">
                <Td3Span></Td3Span>
              </Td>
            </Tr>
            <Tr>
              <Td className="Td2">
                <Td2Span></Td2Span>
              </Td>
              <Td className="Td3">
                <Td3Span></Td3Span>
              </Td>
            </Tr>
          </TBody>
        </Table>
      }
    >
      <Container>
        <CourseNavigator
          updateSelectMenu={updateSelectMenu}
          doubleClickItem={doubleClickItem}
        />
      </Container>
    </Suspense>
  );
}

function Container(props) {
  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "10px 20px",
        // border: "1px red solid",
      }}
    >
      {props.children}
    </div>
  );
}
