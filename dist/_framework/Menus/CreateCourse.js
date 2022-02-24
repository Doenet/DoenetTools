import React from "../../_snowpack/pkg/react.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import axios from "../../_snowpack/pkg/axios.js";
import {useToast, toastType} from "../Toast.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {driveColors, driveImages} from "../../_reactComponents/Drive/util.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {fetchDrivesQuery} from "../../_reactComponents/Drive/NewDrive.js";
const CreateCourse = (props) => {
  const toast = useToast();
  const onError = ({errorMessage}) => {
    toast(`Course not created. ${errorMessage}`, toastType.ERROR);
  };
  const createNewDrive = useRecoilCallback(({set}) => async ({label, newDriveId, image, color}) => {
    let newDrive = {
      driveId: newDriveId,
      isShared: "0",
      isPublic: "0",
      label,
      type: "course",
      image,
      color,
      subType: "Administrator",
      role: ["Owner"]
    };
    const payload = {params: {
      driveId: newDriveId,
      isPublic: "0",
      label,
      type: "new course drive",
      image,
      color
    }};
    const result = axios.get("/api/addDrive.php", payload);
    result.then((resp) => {
      if (resp.data.success) {
        set(fetchDrivesQuery, (oldDrivesInfo) => {
          let newDrivesInfo = {...oldDrivesInfo};
          newDrivesInfo.driveIdsAndLabels = [newDrive, ...oldDrivesInfo.driveIdsAndLabels];
          return newDrivesInfo;
        });
      }
    });
    return result;
  });
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Create New Course",
    onClick: () => {
      let driveId = null;
      let newDriveId = nanoid();
      let label = "Untitled";
      let image = driveImages[Math.floor(Math.random() * driveImages.length)];
      let color = "none";
      const result = createNewDrive({label, driveId, newDriveId, image, color});
      result.then((resp) => {
        if (resp.data.success) {
          toast(`Created a new course named '${label}'`, toastType.SUCCESS);
        } else {
          onError({errorMessage: resp.data.message});
        }
      }).catch((e) => {
        onError({errorMessage: e.message});
      });
    }
  }, "Create New Course")));
};
export default CreateCourse;
