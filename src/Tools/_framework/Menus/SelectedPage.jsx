import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import {
  itemByDoenetId,
  selectedCourseItems,
  useCourse,
} from "../../../_reactComponents/Course/CourseActions";
// import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import Textfield from "../../../_reactComponents/PanelHeaderComponents/Textfield";
import { pageToolViewAtom, searchParamAtomFamily } from "../NewToolRoot";
import { useToast, toastType } from "@Toast";
import ButtonGroup from "../../../_reactComponents/PanelHeaderComponents/ButtonGroup";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import ActionButton from "../../../_reactComponents/PanelHeaderComponents/ActionButton";
import ActionButtonGroup from "../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup";
import { useNavigate } from "react-router";
import { selectedMenuPanelAtom } from "../Panels/NewMenuPanel";

export default function SelectedPage() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const pageId = useRecoilValue(selectedCourseItems)[0];
  const pageObj = useRecoilValue(itemByDoenetId(pageId));
  const containingObj = useRecoilValue(
    itemByDoenetId(pageObj.containingDoenetId),
  );
  const sectionId = containingObj.parentDoenetId;
  const doenetId = containingObj.doenetId;
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {
    create,
    renameItem,
    compileActivity,
    deleteItem,
    copyItems,
    cutItems,
  } = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(pageObj.label);
  const addToast = useToast();

  useEffect(() => {
    if (itemTextFieldLabel !== pageObj.label) {
      setItemTextFieldLabel(pageObj.label);
    }
  }, [pageId]); //Only check when the pageId changes

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

  const handelLabelModfication = () => {
    let effectiveItemLabel = itemTextFieldLabel;
    if (itemTextFieldLabel === "") {
      effectiveItemLabel = pageObj.label;
      if (pageObj.label === "") {
        effectiveItemLabel = "Untitled";
      }

      setItemTextFieldLabel(effectiveItemLabel);
      //addToast('Every item must have a label.');
    }
    //Only update the server when it changes
    if (pageObj.label !== effectiveItemLabel) {
      renameItem(pageId, effectiveItemLabel);
    }
  };

  let heading = (
    <h2 data-test="infoPanelItemLabel" style={{ margin: "16px 5px" }}>
      <FontAwesomeIcon icon={faCode} /> {pageObj.label}
    </h2>
  );

  return (
    <>
      {heading}
      <ActionButtonGroup vertical>
        <ActionButton
          width="menu"
          value="Edit Page"
          dataTest="Edit Page"
          onClick={() => {
            //Deselect and navigate to editor
            clearSelections();
            navigate(`/courseactivityeditor/${doenetId}/${pageId}`);
          }}
        />
      </ActionButtonGroup>
      <Textfield
        label="Label"
        dataTest="Label Page"
        vertical
        width="menu"
        value={itemTextFieldLabel}
        onChange={(e) => setItemTextFieldLabel(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) handelLabelModfication();
        }}
        onBlur={handelLabelModfication}
      />
      <br />
      <ButtonGroup vertical>
        <Button
          width="menu"
          onClick={() => create({ itemType: "page" })}
          value="Add Page"
          dataTest="Add Page"
        />
        {containingObj.type == "activity" ? (
          <Button
            width="menu"
            onClick={() => create({ itemType: "order" })}
            value="Add Order"
            dataTest="Add Order"
          />
        ) : null}
      </ButtonGroup>
      <br />
      <Button
        width="menu"
        value="Delete Page"
        dataTest="Delete Page"
        alert
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          deleteItem({ doenetId: pageId });
        }}
      />
    </>
  );
}
