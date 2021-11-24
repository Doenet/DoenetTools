import axios from "../../_snowpack/pkg/axios.js";
import React, {useState} from "../../_snowpack/pkg/react.js";
import {useRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import CalendarButton from "../../_reactComponents/PanelHeaderComponents/CalendarToggle.js";
import DateTime from "../../_reactComponents/PanelHeaderComponents/DateTime.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useToast, toastType} from "../Toast.js";
import {UTCDateStringToDate, DateToDisplayDateString, DateToDateString, DateToUTCDateString} from "../../_utils/dateUtilityFunction.js";
export default function GradeSettings() {
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  let [dueDateOverride, setDueDateOverride] = useState(null);
  let [dueDate, setDueDate] = useState(null);
  let [initialized, setInitialized] = useState(false);
  const addToast = useToast();
  const loadDueDates = async (doenetId2, userId2) => {
    try {
      let {data} = await axios.get(`/api/loadDueDateInfo.php`, {params: {doenetId: doenetId2, userId: userId2}});
      setInitialized(true);
      if (data.success) {
        const dataDueDateOverride = data.dueDateInfo.dueDateOverride;
        let localTimeZoneDueDateOverride = null;
        if (dataDueDateOverride) {
          localTimeZoneDueDateOverride = DateToDisplayDateString(UTCDateStringToDate(dataDueDateOverride));
        }
        setDueDateOverride(localTimeZoneDueDateOverride);
        const dataDueDate = data.dueDateInfo.dueDate;
        let localTimeZoneDueDate = "No Due Date";
        if (dataDueDate) {
          localTimeZoneDueDate = DateToDisplayDateString(UTCDateStringToDate(dataDueDate));
        }
        setDueDate(localTimeZoneDueDate);
      } else {
        addToast(`ERROR: ${data.message}`, toastType.ERROR);
      }
    } catch (e) {
      addToast(`ERROR: ${e}`, toastType.ERROR);
    }
  };
  const storeDueDateOverride = async (doenetId2, userId2, newDateString) => {
    if (newDateString === null) {
      newDateString = "Cancel Due Date Override";
    } else {
      newDateString = DateToUTCDateString(new Date(newDateString));
    }
    try {
      let {data} = await axios.get(`/api/saveDueDateInfo.php`, {params: {doenetId: doenetId2, userId: userId2, newDateString}});
      if (data.success) {
        if (newDateString === "Cancel Due Date Override") {
          addToast(`Cancelled Due Date Override!`, toastType.SUCCESS);
        } else {
          const displayDate = DateToDisplayDateString(new Date(newDateString));
          addToast(`Set Due Date Override to ${displayDate}`, toastType.SUCCESS);
        }
      } else {
        addToast(`ERROR: ${data.message}`, toastType.ERROR);
      }
    } catch (e) {
      addToast(`ERROR: ${e}`, toastType.ERROR);
    }
  };
  if (!doenetId || !userId) {
    return null;
  }
  if (!initialized) {
    loadDueDates(doenetId, userId);
  }
  let dueDateJSX = /* @__PURE__ */ React.createElement(React.Fragment, null, "Due Date Override:", /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex"},
    onClick: (e) => {
      e.preventDefault();
    }
  }, /* @__PURE__ */ React.createElement(CalendarButton, {
    checked: dueDateOverride !== null,
    onClick: (e) => {
      let value = null;
      if (dueDateOverride === null) {
        let nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        value = DateToDateString(nextWeek);
      }
      setDueDateOverride(value);
      storeDueDateOverride(doenetId, userId, value);
    }
  }), /* @__PURE__ */ React.createElement(DateTime, {
    value: dueDateOverride ? new Date(dueDateOverride) : null,
    onBlur: ({valid, value}) => {
      if (valid) {
        try {
          value = value.toDate();
        } catch (e) {
        }
        if (new Date(DateToDateString(value)).getTime() !== new Date(dueDateOverride).getTime()) {
          setDueDateOverride(value);
          storeDueDateOverride(doenetId, userId, value);
        }
      } else {
        addToast("Invalid Due Date");
      }
    }
  })));
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", null, "Due Date: "), /* @__PURE__ */ React.createElement("div", null, dueDate, " "), dueDateJSX);
}
