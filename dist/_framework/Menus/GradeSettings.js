import axios from "../../_snowpack/pkg/axios.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import CalendarButton from "../../_reactComponents/PanelHeaderComponents/CalendarToggle.js";
import DateTime from "../../_reactComponents/PanelHeaderComponents/DateTime.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useToast, toastType} from "../Toast.js";
import {UTCDateStringToDate, DateToDisplayDateString, DateToDateString, DateToUTCDateString} from "../../_utils/dateUtilityFunction.js";
import Increment from "../../_reactComponents/PanelHeaderComponents/IncrementMenu.js";
export default function GradeSettings() {
  let courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  const [attemptsAllowedAdjustment, setAttemptsAllowedAdjustment] = useState(null);
  const [baseAttemptsAllowed, setBaseAttemptsAllowed] = useState(null);
  let [dueDateOverride, setDueDateOverride] = useState(null);
  let [dueDate, setDueDate] = useState(null);
  let [initialized, setInitialized] = useState(false);
  const addToast = useToast();
  useEffect(() => {
    async function loadAdjustmentInfo(doenetId2, userId2, courseId2) {
      let resp = await axios.get("/api/loadGradebookAdjustmentSettingsInfo.php", {
        params: {doenetId: doenetId2, userId: userId2, courseId: courseId2}
      });
      let numberOfAttemptsAllowedAdjustment = Number(resp.data.numberOfAttemptsAllowedAdjustment);
      setAttemptsAllowedAdjustment(numberOfAttemptsAllowedAdjustment);
      let baseAttemptsAllowed2 = "unlimited";
      if (resp.data.baseAttemptsAllowed != "unlimited") {
        baseAttemptsAllowed2 = Number(resp.data.baseAttemptsAllowed);
      }
      setBaseAttemptsAllowed(baseAttemptsAllowed2);
    }
    if (attemptsAllowedAdjustment == null) {
      loadAdjustmentInfo(doenetId, userId, courseId);
    }
  }, [attemptsAllowedAdjustment, doenetId, userId, courseId]);
  const loadDueDates = async (doenetId2, userId2) => {
    try {
      let {data} = await axios.get(`/api/loadDueDateInfo.php`, {params: {courseId, doenetId: doenetId2, userId: userId2}});
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
    onClick: () => {
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
  let resultAttemptsAllowed = baseAttemptsAllowed + attemptsAllowedAdjustment;
  let attemptsAdjusterJSX = /* @__PURE__ */ React.createElement("p", null, "Unlimited Attempts");
  if (baseAttemptsAllowed != "unlimited" && attemptsAllowedAdjustment != null) {
    attemptsAdjusterJSX = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, "Base Attempts Allowed: "), /* @__PURE__ */ React.createElement("div", null, baseAttemptsAllowed), /* @__PURE__ */ React.createElement("div", null, "Attempts Allowed Adjustment: "), /* @__PURE__ */ React.createElement(Increment, {
      min: -baseAttemptsAllowed,
      value: attemptsAllowedAdjustment,
      onChange: (attemptsAdjustment) => {
        setAttemptsAllowedAdjustment(attemptsAdjustment);
        axios.get("/api/updateGradebookAdjustment.php", {
          params: {doenetId, userId, courseId, attemptsAdjustment}
        }).then(({data}) => {
        });
      }
    }), /* @__PURE__ */ React.createElement("div", null, "Resulting Attempts Allowed: "), /* @__PURE__ */ React.createElement("div", null, resultAttemptsAllowed));
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", null, "Due Date: "), /* @__PURE__ */ React.createElement("div", null, dueDate, " "), dueDateJSX, /* @__PURE__ */ React.createElement("br", null), attemptsAdjusterJSX);
}
