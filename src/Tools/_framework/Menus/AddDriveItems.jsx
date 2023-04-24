import React from "react";
import { useRecoilValue } from "recoil";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import { searchParamAtomFamily } from "../NewToolRoot";
import ButtonGroup from "../../../_reactComponents/PanelHeaderComponents/ButtonGroup";
import { useCourse } from "../../../_reactComponents/Course/CourseActions";
import { useToast, toastType } from "@Toast";

export default function AddDriveItems() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const { create } = useCourse(courseId);
  const addToast = useToast();

  return (
    <>
      <ButtonGroup vertical>
        <Button
          width="menu"
          dataTest="Add Activity Button"
          onClick={() =>
            create({ itemType: "activity" }, () => {
              addToast("Activity Created!");
            })
          }
          value="Add Activity"
        >
          Add Activity
        </Button>
        <Button
          width="menu"
          dataTest="Add Collection Button"
          onClick={() =>
            create({ itemType: "bank" }, () => {
              addToast("Collection Created!");
            })
          }
          value="Add Collection"
        />
        <Button
          width="menu"
          dataTest="Add Section Button"
          onClick={() =>
            create({ itemType: "section" }, () => {
              addToast("Section Created!");
            })
          }
          value="Add Section"
        >
          Add Section
        </Button>
      </ButtonGroup>
    </>
  );
}
