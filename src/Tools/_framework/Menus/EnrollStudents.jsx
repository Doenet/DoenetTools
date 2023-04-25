import React from "react";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import { searchParamAtomFamily, pageToolViewAtom } from "../NewToolRoot";
import { useSetRecoilState, useRecoilValue } from "recoil";
import ButtonGroup from "../../../_reactComponents/PanelHeaderComponents/ButtonGroup";

export default function EnrollStudents() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));

  return (
    <ButtonGroup vertical>
      <Button
        width="menu"
        onClick={() =>
          setPageToolView({
            page: "course",
            tool: "people",
            view: "",
            params: { courseId },
          })
        }
        value="Go to People"
      >
        Go to People
      </Button>
    </ButtonGroup>
  );
}
