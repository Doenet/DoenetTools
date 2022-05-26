import axios from "../../_snowpack/pkg/axios.js";
import {useEffect, useCallback} from "../../_snowpack/pkg/react.js";
import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../../_framework/NewToolRoot.js";
import {selectedMenuPanelAtom} from "../../_framework/Panels/NewMenuPanel.js";
import {useToast, toastType} from "../../_framework/Toast.js";
import {fileByPageId, fileByCid} from "../../_framework/ToolHandlers/CourseToolHandler.js";
import {UTCDateStringToDate} from "../../_utils/dateUtilityFunction.js";
const enrollmentAtomByCourseId = atomFamily({
  key: "enrollmentAtomByCourseId",
  default: [],
  effects: (courseId) => [
    ({setSelf, trigger}) => {
      if (trigger == "get" && courseId) {
        axios.get("/api/getEnrollment.php", {params: {courseId}}).then((resp) => {
          setSelf(resp.data.enrollmentArray);
        });
      }
    }
  ]
});
export const enrollmentByCourseId = selectorFamily({
  key: "enrollmentByCourseId",
  get: (courseId) => ({get, getCallback}) => {
    const recoilWithdraw = getCallback(({set: set2}) => async (email) => {
      let payload = {
        email,
        courseId
      };
      try {
        let resp = await axios.post("/api/withDrawStudents.php", payload);
        if (resp.status < 300) {
          set2(enrollmentAtomByCourseId(courseId), (prev) => {
            let next = [...prev];
            const indexOfStudent = next.findIndex((value) => value.email == email);
            next[indexOfStudent] = {...prev[indexOfStudent], withdrew: "1"};
            return next;
          });
        } else {
          throw new Error(`response code: ${resp.status}`);
        }
      } catch (err) {
      }
    });
    const recoilUnWithdraw = getCallback(({set: set2}) => async (email) => {
      let payload = {
        email,
        courseId
      };
      try {
        let resp = await axios.post("/api/unWithDrawStudents.php", payload);
        if (resp.status < 300) {
          set2(enrollmentAtomByCourseId(courseId), (prev) => {
            let next = [...prev];
            const indexOfStudent = next.findIndex((value) => value.email == email);
            next[indexOfStudent] = {...prev[indexOfStudent], withdrew: "0"};
            return next;
          });
        } else {
          throw new Error(`response code: ${resp.status}`);
        }
      } catch (err) {
      }
    });
    const recoilMergeData = getCallback(({set: set2}) => async (payload) => {
      try {
        let resp = await axios.post("/api/mergeEnrollmentData.php", payload);
        if (resp.status < 300) {
          set2(enrollmentAtomByCourseId(courseId), resp.data.enrollmentArray);
        } else {
          throw new Error(`response code: ${resp.status}`);
        }
      } catch (err) {
      }
    });
    return {
      value: get(enrollmentAtomByCourseId(courseId)),
      recoilWithdraw,
      recoilUnWithdraw,
      recoilMergeData
    };
  }
});
function buildDoenetIdToParentDoenetIdObj(orderObj) {
  let returnObj = {};
  orderObj.content.map((item) => {
    if (item?.type == "order") {
      returnObj[item.doenetId] = orderObj.doenetId;
      let childObj = buildDoenetIdToParentDoenetIdObj(item);
      returnObj = {...childObj, ...returnObj};
    } else {
      returnObj[item] = orderObj.doenetId;
    }
    returnObj;
  });
  return returnObj;
}
export function findFirstPageOfActivity(orderObj) {
  if (!orderObj?.content) {
    return null;
  }
  if (orderObj.content.length == 0) {
    return null;
  }
  let response = null;
  for (let item of orderObj.content) {
    if (typeof item === "string" || item instanceof String) {
      response = item;
      break;
    } else {
      let nextOrderResponse = findFirstPageOfActivity(item);
      if (typeof nextOrderResponse === "string" || nextOrderResponse instanceof String) {
        response = nextOrderResponse;
        break;
      }
    }
  }
  return response;
}
function findOrderAndPageDoenetIdsAndSetOrderObjs(set2, orderObj, assignmentDoenetId, parentDoenetId) {
  let orderAndPagesDoenetIds = [];
  if (orderObj) {
    let numberToSelect = orderObj.numberToSelect;
    if (numberToSelect == void 0) {
      numberToSelect = 1;
    }
    let withReplacement = orderObj.withReplacement;
    if (withReplacement == void 0) {
      withReplacement = false;
    }
    set2(itemByDoenetId(orderObj.doenetId), {
      type: "order",
      doenetId: orderObj.doenetId,
      behavior: orderObj.behavior,
      numberToSelect,
      withReplacement,
      containingDoenetId: assignmentDoenetId,
      isOpen: false,
      isSelected: false,
      parentDoenetId
    });
    orderAndPagesDoenetIds.push(orderObj.doenetId);
    for (let orderItem of orderObj.content) {
      if (orderItem?.type == "order") {
        let moreOrderDoenetIds = findOrderAndPageDoenetIdsAndSetOrderObjs(set2, orderItem, assignmentDoenetId, orderObj.doenetId);
        orderAndPagesDoenetIds = [...orderAndPagesDoenetIds, ...moreOrderDoenetIds];
      } else {
        orderAndPagesDoenetIds = [...orderAndPagesDoenetIds, orderItem];
      }
    }
  }
  return orderAndPagesDoenetIds;
}
export function findPageDoenetIdsInAnOrder({orderObj, needleOrderDoenetId, foundNeedle = false}) {
  let pageDoenetIds = [];
  if (!foundNeedle && orderObj.doenetId == needleOrderDoenetId) {
    return findPageDoenetIdsInAnOrder({orderObj, needleOrderDoenetId, foundNeedle: true});
  }
  for (let item of orderObj.content) {
    if (item?.type == "order") {
      let morePageDoenetIds;
      if (foundNeedle || item.doenetId == needleOrderDoenetId) {
        morePageDoenetIds = findPageDoenetIdsInAnOrder({orderObj: item, needleOrderDoenetId, foundNeedle: true});
      } else {
        morePageDoenetIds = findPageDoenetIdsInAnOrder({orderObj: item, needleOrderDoenetId, foundNeedle});
      }
      pageDoenetIds = [...pageDoenetIds, ...morePageDoenetIds];
    } else {
      if (foundNeedle) {
        pageDoenetIds.push(item);
      }
    }
  }
  return pageDoenetIds;
}
function localizeDates(obj, keys) {
  for (let key of keys) {
    if (obj[key]) {
      obj[key] = UTCDateStringToDate(obj[key]).toLocaleString();
    }
  }
  return obj;
}
let dateKeys = ["assignedDate", "dueDate", "pinnedAfterDate", "pinnedUntilDate"];
export function useInitCourseItems(courseId) {
  const getDataAndSetRecoil = useRecoilCallback(({snapshot, set: set2}) => async (courseId2) => {
    if (!courseId2) {
      return;
    }
    const courseArrayTest = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId2));
    if (courseArrayTest.length == 0) {
      set2(courseIdAtom, courseId2);
      const {data} = await axios.get("/api/getCourseItems.php", {
        params: {courseId: courseId2}
      });
      if (data.success) {
        let pageDoenetIdToParentDoenetId2 = {};
        let doenetIds = data.items.reduce((items, item) => {
          if (item.type !== "page") {
            items.push(item.doenetId);
          }
          if (item.type === "activity") {
            let newPageDoenetIdToParentDoenetId = buildDoenetIdToParentDoenetIdObj(item.order);
            pageDoenetIdToParentDoenetId2 = {...pageDoenetIdToParentDoenetId2, ...newPageDoenetIdToParentDoenetId};
            let ordersAndPages = findOrderAndPageDoenetIdsAndSetOrderObjs(set2, item.order, item.doenetId, item.doenetId);
            items = [...items, ...ordersAndPages];
          } else if (item.type === "bank") {
            item.pages.map((childDoenetId) => {
              pageDoenetIdToParentDoenetId2[childDoenetId] = item.doenetId;
            });
            items = [...items, ...item.pages];
          } else if (item.type === "page") {
            item["parentDoenetId"] = pageDoenetIdToParentDoenetId2[item.doenetId];
          }
          set2(itemByDoenetId(item.doenetId), localizeDates(item, dateKeys));
          return items;
        }, []);
        set2(authorCourseItemOrderByCourseId(courseId2), doenetIds);
      }
    }
  }, []);
  useEffect(() => {
    if (courseId) {
      getDataAndSetRecoil(courseId);
    }
  }, [getDataAndSetRecoil, courseId]);
}
export function useSetCourseIdFromDoenetId(doenetId) {
  const item = useRecoilValue(itemByDoenetId("doenetId"));
  const setCourseId = useSetRecoilState(courseIdAtom);
  useEffect(async () => {
    if (Object.keys(item).length > 0) {
      return;
    }
    const {data} = await axios.get("/api/getCourseIdFromDoenetId.php", {
      params: {doenetId}
    });
    if (data.success) {
      setCourseId(data.courseId);
    } else {
      setCourseId("__not_found__");
    }
  }, [doenetId]);
}
export const courseIdAtom = atom({
  key: "courseIdAtom",
  default: null
});
export const authorCourseItemOrderByCourseId = atomFamily({
  key: "authorCourseItemOrderByCourseId",
  default: []
});
export const authorCourseItemOrderByCourseIdBySection = selectorFamily({
  key: "authorCourseItemOrderByCourseIdBySection",
  get: ({courseId, sectionId}) => ({get}) => {
    let allDoenetIdsInOrder = get(authorCourseItemOrderByCourseId(courseId));
    if (sectionId == courseId || !sectionId) {
      return allDoenetIdsInOrder;
    }
    let sectionDoenetIds = [];
    let inSection = false;
    let sectionDoenetIdsInSection = [sectionId];
    for (let doenetId of allDoenetIdsInOrder) {
      if (doenetId == sectionId) {
        inSection = true;
        continue;
      }
      if (inSection) {
        let itemObj = get(itemByDoenetId(doenetId));
        if (sectionDoenetIdsInSection.includes(itemObj.parentDoenetId)) {
          sectionDoenetIds.push(doenetId);
          if (itemObj.type !== "page") {
            sectionDoenetIdsInSection.push(doenetId);
          }
        } else {
          break;
        }
      }
    }
    return sectionDoenetIds;
  }
});
export const studentCourseItemOrderByCourseId = selectorFamily({
  key: "studentCourseItemOrderByCourseId",
  get: (courseId) => ({get}) => {
    let allDoenetIdsInOrder = get(authorCourseItemOrderByCourseId(courseId));
    let studentDoenetIds = allDoenetIdsInOrder.filter((doenetId) => {
      let itemObj = get(itemByDoenetId(doenetId));
      return itemObj.isAssigned && (itemObj.type == "activity" || itemObj.type == "section");
    });
    return studentDoenetIds;
  }
});
export const studentCourseItemOrderByCourseIdBySection = selectorFamily({
  key: "studentCourseItemOrderByCourseId",
  get: ({courseId, sectionId}) => ({get}) => {
    let allStudentDoenetIdsInOrder = get(studentCourseItemOrderByCourseId(courseId));
    let sectionDoenetIds = [];
    let inSection = false;
    let sectionDoenetIdsInSection = [sectionId];
    if (courseId == sectionId || !sectionId) {
      sectionDoenetIdsInSection = [courseId];
      inSection = true;
    }
    for (let doenetId of allStudentDoenetIdsInOrder) {
      if (doenetId == sectionId) {
        inSection = true;
        continue;
      }
      if (inSection) {
        let itemObj = get(itemByDoenetId(doenetId));
        if (itemObj.isAssigned && sectionDoenetIdsInSection.includes(itemObj.parentDoenetId)) {
          sectionDoenetIds.push(doenetId);
          if (itemObj.type == "section") {
            sectionDoenetIdsInSection.push(doenetId);
          }
        } else {
          continue;
        }
      }
    }
    return sectionDoenetIds;
  }
});
export const itemByDoenetId = atomFamily({
  key: "itemByDoenetId",
  default: {}
});
export const coursePermissionsAndSettings = atom({
  key: "coursePermissionsAndSettings",
  default: [],
  effects: [
    async ({setSelf, trigger}) => {
      if (trigger === "get") {
        const {data} = await axios.get("/api/getCoursePermissionsAndSettings.php");
        setSelf(data.permissionsAndSettings);
      }
    }
  ]
});
export const coursePermissionsAndSettingsByCourseId = selectorFamily({
  key: "coursePermissionsAndSettingsByCourseId/Default",
  get: (courseId) => ({get}) => {
    let allpermissionsAndSettings = get(coursePermissionsAndSettings);
    return allpermissionsAndSettings.find((value) => value.courseId == courseId) ?? {};
  },
  set: (courseId) => ({set: set2}, modifcations) => {
    set2(coursePermissionsAndSettings, (prev) => {
      const next = [...prev];
      const modificationIndex = prev.findIndex((course) => course.courseId === courseId);
      next[modificationIndex] = {
        ...prev[modificationIndex],
        ...modifcations
      };
      return next;
    });
  }
});
export const useCreateCourse = () => {
  const createCourse = useRecoilCallback(({set: set2}) => async () => {
    let {
      data: {
        permissionsAndSettings,
        courseId,
        image,
        color,
        ...remainingData
      }
    } = await axios.get("/api/createCourse.php");
    set2(coursePermissionsAndSettings, permissionsAndSettings);
  });
  return {createCourse};
};
export const courseOrderDataByCourseId = atomFamily({
  key: "courseOrderDataByCourseId",
  default: {completeOrder: [], orderingDataLookup: {}},
  effects: (courseId) => [
    ({setSelf, onSet, trigger}) => {
      if (trigger === "get") {
      }
      onSet(({completeOrder: newOrder}, was) => {
      });
    }
  ]
});
export const selectedCourseItems = atom({
  key: "selectedCourseItems",
  default: []
});
export const copiedCourseItems = atom({
  key: "copiedCourseItems",
  default: []
});
export const cutCourseItems = atom({
  key: "cutCourseItems",
  default: []
});
export const useCourse = (courseId) => {
  const {label, color, image} = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  const addToast = useToast();
  function insertPageOrOrderToOrder({
    parentOrderObj,
    needleOrderDoenetId,
    itemType,
    newPageDonenetId,
    orderObj
  }) {
    let newOrderObj = {...parentOrderObj};
    let insertedAfterDoenetId = parentOrderObj.doenetId;
    if (parentOrderObj.doenetId == needleOrderDoenetId) {
      insertedAfterDoenetId = newOrderObj.content[newOrderObj.content.length - 1];
      if (insertedAfterDoenetId?.type == "order") {
        insertedAfterDoenetId = insertedAfterDoenetId.doenetId;
      }
      if (itemType == "page") {
        newOrderObj.content = [...parentOrderObj.content, newPageDonenetId];
      } else if (itemType == "order") {
        newOrderObj.content = [...parentOrderObj.content, {...orderObj}];
      }
      return {newOrderObj, insertedAfterDoenetId};
    }
    for (let [i, item] of Object.entries(parentOrderObj.content)) {
      if (item?.doenetId == needleOrderDoenetId) {
        let newItem = {...item};
        insertedAfterDoenetId = newItem.doenetId;
        if (newItem.content.length > 0) {
          insertedAfterDoenetId = newItem.content[newItem.content.length - 1];
        }
        if (itemType == "page") {
          newItem.content = [...newItem.content, newPageDonenetId];
        } else if (itemType == "order") {
          newItem.content = [...newItem.content, {...orderObj}];
        }
        newOrderObj.content = [...newOrderObj.content];
        newOrderObj.content.splice(i, 1, newItem);
        return {newOrderObj, insertedAfterDoenetId};
      }
      if (item?.type == "order") {
        let {newOrderObj: subOrder, insertedAfterDoenetId: insertedAfterDoenetId2} = insertPageOrOrderToOrder({
          parentOrderObj: item,
          needleOrderDoenetId,
          itemType,
          newPageDonenetId,
          orderObj
        });
        if (subOrder != null) {
          newOrderObj.content = [...newOrderObj.content];
          newOrderObj.content.splice(i, 1, subOrder);
          return {newOrderObj, insertedAfterDoenetId: insertedAfterDoenetId2};
        }
      }
    }
    return {newOrderObj: null, insertedAfterDoenetId: null};
  }
  function findOrderAndPageDoenetIds(orderObj, assignmentDoenetId, parentDoenetId) {
    let orderAndPagesDoenetIds = [];
    if (orderObj) {
      let numberToSelect = orderObj.numberToSelect;
      if (numberToSelect == void 0) {
        numberToSelect = 1;
      }
      let withReplacement = orderObj.withReplacement;
      if (withReplacement == void 0) {
        withReplacement = false;
      }
      set(itemByDoenetId(orderObj.doenetId), {
        type: "order",
        doenetId: orderObj.doenetId,
        behavior: orderObj.behavior,
        numberToSelect,
        withReplacement,
        containingDoenetId: assignmentDoenetId,
        isOpen: false,
        isSelected: false,
        parentDoenetId
      });
      orderAndPagesDoenetIds.push(orderObj.doenetId);
      for (let orderItem of orderObj.content) {
        if (orderItem?.type == "order") {
          let moreOrderDoenetIds = findOrderAndPageDoenetIds(orderItem, assignmentDoenetId, orderObj.doenetId);
          orderAndPagesDoenetIds = [...orderAndPagesDoenetIds, ...moreOrderDoenetIds];
        } else {
          pageDoenetIdToParentDoenetId[orderItem] = orderObj.doenetId;
          orderAndPagesDoenetIds = [...orderAndPagesDoenetIds, orderItem];
        }
      }
    }
    return orderAndPagesDoenetIds;
  }
  function insertPageOrOrderIntoOrderUsingPage({
    parentOrderObj,
    needlePageDoenetId,
    itemType,
    newPageDonenetId,
    orderObj
  }) {
    let newOrderObj = {...parentOrderObj};
    for (let [i, item] of Object.entries(parentOrderObj.content)) {
      if (item == needlePageDoenetId) {
        let newContent = [...parentOrderObj.content];
        if (itemType == "page") {
          newContent.splice(i + 1, 0, newPageDonenetId);
        } else if (itemType == "order") {
          newContent.splice(i + 1, 0, {...orderObj});
        }
        newOrderObj.content = newContent;
        return newOrderObj;
      }
      if (item?.type == "order") {
        let subOrder = insertPageOrOrderIntoOrderUsingPage({
          parentOrderObj: item,
          needlePageDoenetId,
          itemType,
          newPageDonenetId,
          orderObj
        });
        if (subOrder != null) {
          newOrderObj.content = [...newOrderObj.content];
          newOrderObj.content.splice(i, 1, subOrder);
          return newOrderObj;
        }
      }
    }
    return null;
  }
  function addToOrder({orderObj, needleOrderDoenetId, itemToAdd}) {
    let nextOrderObj = {...orderObj};
    if (nextOrderObj.doenetId == needleOrderDoenetId) {
      let previousDoenetId = nextOrderObj.doenetId;
      if (nextOrderObj.content.length > 0) {
        previousDoenetId = nextOrderObj.content[nextOrderObj.content.length - 1];
        if (previousDoenetId?.type == "order") {
          previousDoenetId = previousDoenetId.doenetId;
        }
      }
      nextOrderObj.content = [...nextOrderObj.content, itemToAdd];
      return {order: nextOrderObj, previousDoenetId};
    }
    for (let [i, item] of Object.entries(orderObj.content)) {
      if (item?.type == "order") {
        let {order: childOrderObj, previousDoenetId} = addToOrder({orderObj: item, needleOrderDoenetId, itemToAdd});
        if (childOrderObj != null) {
          nextOrderObj.content = [...nextOrderObj.content];
          nextOrderObj.content.splice(i, 1, childOrderObj);
          return {order: nextOrderObj, previousDoenetId};
        }
      }
    }
    return {order: null, previousDoenetId: null};
  }
  const create = useRecoilCallback(({set: set2, snapshot}) => async ({itemType, parentDoenetId, previousDoenetId, previousContainingDoenetId}) => {
    let authorItemDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId));
    let newAuthorItemDoenetIds = [...authorItemDoenetIds];
    let sectionId = await snapshot.getPromise(searchParamAtomFamily("sectionId"));
    if (sectionId == "") {
      sectionId = courseId;
    }
    let selectedArray = await snapshot.getPromise(selectedCourseItems);
    if (selectedArray.length == 1) {
      let singleSelectedDoenetId = selectedArray[0];
      let selectedObj = await snapshot.getPromise(itemByDoenetId(singleSelectedDoenetId));
      if (selectedObj.type == "section") {
        let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId, sectionId: singleSelectedDoenetId}));
        let lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
        parentDoenetId = singleSelectedDoenetId;
        previousDoenetId = lastItemInSelectedSectionDoenetId;
        if (!lastItemInSelectedSectionDoenetId) {
          previousDoenetId = singleSelectedDoenetId;
          previousContainingDoenetId = singleSelectedDoenetId;
        } else {
          let lastItemInSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId));
          previousDoenetId = lastItemInSelectedSectionDoenetId;
          if (lastItemInSectionObj.type == "page" || lastItemInSectionObj.type == "order") {
            previousContainingDoenetId = lastItemInSectionObj.containingDoenetId;
          } else if (lastItemInSectionObj.type == "bank" || lastItemInSectionObj.type == "section") {
            previousContainingDoenetId = lastItemInSelectedSectionDoenetId;
          }
        }
      } else if (selectedObj.type == "activity" || selectedObj.type == "bank") {
        parentDoenetId = selectedObj.parentDoenetId;
        let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId, sectionId: parentDoenetId}));
        let lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
        let lastItemInSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId));
        previousDoenetId = lastItemInSelectedSectionDoenetId;
        if (lastItemInSectionObj.type == "page" || lastItemInSectionObj.type == "order") {
          previousContainingDoenetId = lastItemInSectionObj.containingDoenetId;
        } else if (lastItemInSectionObj.type == "bank" || lastItemInSectionObj.type == "section") {
          previousContainingDoenetId = lastItemInSelectedSectionDoenetId;
        }
      } else if (selectedObj.type == "page" || selectedObj.type == "order") {
        let selectedItemsContainingObj = await snapshot.getPromise(itemByDoenetId(selectedObj.containingDoenetId));
        parentDoenetId = selectedItemsContainingObj.parentDoenetId;
        let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId, sectionId: parentDoenetId}));
        let lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
        let lastItemInSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId));
        previousDoenetId = lastItemInSelectedSectionDoenetId;
        if (lastItemInSectionObj.type == "page" || lastItemInSectionObj.type == "order") {
          previousContainingDoenetId = lastItemInSectionObj.containingDoenetId;
        } else if (lastItemInSectionObj.type == "bank" || lastItemInSectionObj.type == "section") {
          previousContainingDoenetId = lastItemInSelectedSectionDoenetId;
        }
      }
    }
    if (previousDoenetId == void 0) {
      let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId, sectionId}));
      let lastItemInSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
      parentDoenetId = sectionId;
      if (lastItemInSectionDoenetId == void 0) {
        previousDoenetId = sectionId;
        previousContainingDoenetId = sectionId;
      } else {
        previousDoenetId = lastItemInSectionDoenetId;
        let lastItemObj = await snapshot.getPromise(itemByDoenetId(lastItemInSectionDoenetId));
        if (lastItemObj.type == "page" || lastItemObj.type == "order") {
          previousContainingDoenetId = lastItemObj.containingDoenetId;
        } else if (lastItemObj.type == "bank" || lastItemObj.type == "section") {
          previousContainingDoenetId = lastItemObj.doenetId;
        }
      }
    }
    let newDoenetId;
    let coursePermissionsAndSettings2 = await snapshot.getPromise(coursePermissionsAndSettingsByCourseId(courseId));
    if (coursePermissionsAndSettings2.canEditContent != "1") {
      return null;
    }
    if (itemType == "activity") {
      let {data} = await axios.post("/api/createCourseItem.php", {
        previousContainingDoenetId,
        courseId,
        itemType,
        parentDoenetId
      });
      let createdActivityDoenentId = data.doenetId;
      newDoenetId = createdActivityDoenentId;
      set2(itemByDoenetId(createdActivityDoenentId), {
        timeLimit: null,
        numberOfAttemptsAllowed: null,
        totalPointsOrPercent: null,
        individualize: false,
        showSolution: true,
        showSolutionInGradebook: true,
        showFeedback: true,
        showHints: true,
        showCorrectness: true,
        showCreditAchievedMenu: true,
        proctorMakesAvailable: false,
        pinnedAfterDate: null,
        pinnedUntilDate: null,
        ...data.itemEntered
      });
      let createdOrderDoenetId = data.itemEntered.order.doenetId;
      let numberToSelect = 1;
      let withReplacement = false;
      let createdOrderObj = {
        type: "order",
        doenetId: createdOrderDoenetId,
        behavior: "sequence",
        numberToSelect,
        withReplacement,
        parentDoenetId: createdActivityDoenentId,
        isOpen: false,
        isSelected: false,
        containingDoenetId: createdActivityDoenentId
      };
      set2(itemByDoenetId(createdOrderDoenetId), createdOrderObj);
      let createdPageObj = {
        ...data.pageEntered,
        parentDoenetId: createdOrderDoenetId
      };
      set2(itemByDoenetId(data.pageDoenetId), createdPageObj);
      let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
      if (indexOfPrevious == -1) {
        newAuthorItemDoenetIds.push(createdActivityDoenentId, createdOrderDoenetId, createdPageObj.doenetId);
      } else {
        newAuthorItemDoenetIds.splice(indexOfPrevious + 1, 0, createdActivityDoenentId, createdOrderDoenetId, createdPageObj.doenetId);
      }
      set2(authorCourseItemOrderByCourseId(courseId), newAuthorItemDoenetIds);
    } else if (itemType == "bank") {
      let {data} = await axios.post("/api/createCourseItem.php", {
        previousContainingDoenetId,
        courseId,
        itemType,
        parentDoenetId
      });
      newDoenetId = data.doenetId;
      set2(itemByDoenetId(data.doenetId), data.itemEntered);
      let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
      if (indexOfPrevious == -1) {
        newAuthorItemDoenetIds.push(data.doenetId);
      } else {
        newAuthorItemDoenetIds.splice(indexOfPrevious + 1, 0, data.doenetId);
      }
      set2(authorCourseItemOrderByCourseId(courseId), newAuthorItemDoenetIds);
    } else if (itemType == "section") {
      let {data} = await axios.post("/api/createCourseItem.php", {
        previousContainingDoenetId,
        courseId,
        itemType,
        parentDoenetId
      });
      newDoenetId = data.doenetId;
      set2(itemByDoenetId(data.doenetId), data.itemEntered);
      let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
      if (indexOfPrevious == -1) {
        newAuthorItemDoenetIds.push(data.doenetId);
      } else {
        newAuthorItemDoenetIds.splice(indexOfPrevious + 1, 0, data.doenetId);
      }
      set2(authorCourseItemOrderByCourseId(courseId), newAuthorItemDoenetIds);
    } else if (itemType == "page" || itemType == "order") {
      let selectedDoenetId = (await snapshot.getPromise(selectedCourseItems))[0];
      const selectedItemObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetId));
      let containingDoenetId;
      if (selectedItemObj.type == "activity" || selectedItemObj.type == "bank") {
        containingDoenetId = selectedItemObj.doenetId;
      } else if (selectedItemObj.type == "order" || selectedItemObj.type == "page") {
        containingDoenetId = selectedItemObj.containingDoenetId;
      }
      let {data} = await axios.get("/api/createPageOrOrder.php", {
        params: {
          courseId,
          itemType,
          containingDoenetId
        }
      });
      let {pageThatWasCreated, orderDoenetIdThatWasCreated} = data;
      let numberToSelect = 1;
      let withReplacement = false;
      let orderObj = {
        type: "order",
        behavior: "sequence",
        numberToSelect,
        withReplacement,
        content: [],
        doenetId: orderDoenetIdThatWasCreated
      };
      if (selectedItemObj.type == "activity") {
        let newJSON = {...selectedItemObj.order};
        let insertedAfterDoenetId = selectedItemObj.order.content[selectedItemObj.order.content.length - 1];
        if (itemType == "page") {
          pageThatWasCreated.parentDoenetId = selectedItemObj.order.doenetId;
          newJSON.content = [...selectedItemObj.order.content, pageThatWasCreated.doenetId];
        } else if (itemType == "order") {
          newJSON.content = [...selectedItemObj.order.content, orderObj];
        }
        let newActivityObj = {...selectedItemObj};
        newActivityObj.order = newJSON;
        let makeMultiPage = false;
        if (newActivityObj.isSinglePage) {
          makeMultiPage = true;
          newActivityObj.isSinglePage = false;
        }
        let {data: data2} = await axios.post("/api/updateActivityStructure.php", {
          courseId,
          doenetId: newActivityObj.doenetId,
          newJSON,
          makeMultiPage
        });
        set2(itemByDoenetId(newActivityObj.doenetId), newActivityObj);
        let newItemDoenetId = orderDoenetIdThatWasCreated;
        if (itemType == "page") {
          set2(itemByDoenetId(pageThatWasCreated.doenetId), pageThatWasCreated);
          newItemDoenetId = pageThatWasCreated.doenetId;
        } else if (itemType == "order") {
          orderObj = {
            ...orderObj,
            isOpen: false,
            isSelected: false,
            containingDoenetId: selectedItemObj.doenetId,
            parentDoenetId: selectedItemObj.order.doenetId
          };
          set2(itemByDoenetId(orderObj.doenetId), orderObj);
        }
        set2(authorCourseItemOrderByCourseId(courseId), (prev) => {
          let next = [...prev];
          next.splice(next.indexOf(insertedAfterDoenetId) + 1, 0, newItemDoenetId);
          return next;
        });
      } else if (selectedItemObj.type == "bank") {
        let insertedAfterDoenetId = selectedItemObj.pages[selectedItemObj.pages.length - 1];
        pageThatWasCreated.parentDoenetId = selectedItemObj.doenetId;
        let newJSON = [...selectedItemObj.pages, pageThatWasCreated.doenetId];
        let newCollectionObj = {...selectedItemObj};
        newCollectionObj.pages = newJSON;
        let {data: data2} = await axios.post("/api/updateCollectionStructure.php", {
          courseId,
          doenetId: newCollectionObj.doenetId,
          newJSON
        });
        set2(itemByDoenetId(pageThatWasCreated.doenetId), pageThatWasCreated);
        set2(itemByDoenetId(newCollectionObj.doenetId), newCollectionObj);
        set2(authorCourseItemOrderByCourseId(courseId), (prev) => {
          let next = [...prev];
          next.splice(next.indexOf(insertedAfterDoenetId) + 1, 0, pageThatWasCreated.doenetId);
          return next;
        });
      } else if (selectedItemObj.type == "order") {
        let orderDoenetId = selectedItemObj.doenetId;
        if (pageThatWasCreated) {
          pageThatWasCreated.parentDoenetId = orderDoenetId;
        }
        const containingItemObj = await snapshot.getPromise(itemByDoenetId(selectedItemObj.containingDoenetId));
        let {newOrderObj, insertedAfterDoenetId} = insertPageOrOrderToOrder({
          parentOrderObj: containingItemObj.order,
          needleOrderDoenetId: orderDoenetId,
          itemType,
          newPageDonenetId: pageThatWasCreated?.doenetId,
          orderObj
        });
        let newActivityObj = {...containingItemObj};
        newActivityObj.order = newOrderObj;
        let {data: data2} = await axios.post("/api/updateActivityStructure.php", {
          courseId,
          doenetId: newActivityObj.doenetId,
          newJSON: newOrderObj
        });
        orderObj["isOpen"] = false;
        orderObj["isSelected"] = false;
        orderObj["containingDoenetId"] = selectedItemObj?.containingDoenetId;
        orderObj["parentDoenetId"] = selectedItemObj?.doenetId;
        set2(itemByDoenetId(newActivityObj.doenetId), newActivityObj);
        let newItemDoenetId = orderDoenetIdThatWasCreated;
        if (itemType == "page") {
          set2(itemByDoenetId(pageThatWasCreated.doenetId), pageThatWasCreated);
          newItemDoenetId = pageThatWasCreated.doenetId;
        } else if (itemType == "order") {
          set2(itemByDoenetId(orderObj.doenetId), orderObj);
        }
        set2(authorCourseItemOrderByCourseId(courseId), (prev) => {
          let next = [...prev];
          next.splice(next.indexOf(insertedAfterDoenetId) + 1, 0, newItemDoenetId);
          return next;
        });
      } else if (selectedItemObj.type == "page") {
        if (pageThatWasCreated) {
          pageThatWasCreated.parentDoenetId = selectedItemObj.parentDoenetId;
        }
        const containingItemObj = await snapshot.getPromise(itemByDoenetId(selectedItemObj.containingDoenetId));
        if (containingItemObj.type == "bank") {
          let insertedAfterDoenetId = containingItemObj.pages[containingItemObj.pages.length - 1];
          let newJSON = [...containingItemObj.pages, pageThatWasCreated.doenetId];
          let newCollectionObj = {...containingItemObj};
          newCollectionObj.pages = newJSON;
          let {data: data2} = await axios.post("/api/updateCollectionStructure.php", {
            courseId,
            doenetId: newCollectionObj.doenetId,
            newJSON
          });
          set2(itemByDoenetId(pageThatWasCreated.doenetId), pageThatWasCreated);
          set2(itemByDoenetId(newCollectionObj.doenetId), newCollectionObj);
          set2(authorCourseItemOrderByCourseId(courseId), (prev) => {
            let next = [...prev];
            next.splice(next.indexOf(insertedAfterDoenetId) + 1, 0, pageThatWasCreated.doenetId);
            return next;
          });
        } else if (containingItemObj.type == "activity") {
          let insertedAfterDoenetId;
          let newJSON;
          if (itemType == "page") {
            ({order: newJSON, previousDoenetId: insertedAfterDoenetId} = addToOrder({
              orderObj: containingItemObj.order,
              needleOrderDoenetId: selectedItemObj.parentDoenetId,
              itemToAdd: pageThatWasCreated?.doenetId
            }));
          } else if (itemType == "order") {
            ({order: newJSON, previousDoenetId: insertedAfterDoenetId} = addToOrder({
              orderObj: containingItemObj.order,
              needleOrderDoenetId: selectedItemObj.parentDoenetId,
              itemToAdd: orderObj
            }));
          }
          let {data: data2} = await axios.post("/api/updateActivityStructure.php", {
            courseId,
            doenetId: containingItemObj.doenetId,
            newJSON
          });
          let newActivityObj = {...containingItemObj};
          newActivityObj.order = newJSON;
          orderObj["isOpen"] = false;
          orderObj["isSelected"] = false;
          orderObj["containingDoenetId"] = selectedItemObj?.containingDoenetId;
          orderObj["parentDoenetId"] = selectedItemObj?.parentDoenetId;
          set2(itemByDoenetId(newActivityObj.doenetId), newActivityObj);
          let newItemDoenetId = orderDoenetIdThatWasCreated;
          if (itemType == "page") {
            set2(itemByDoenetId(pageThatWasCreated.doenetId), pageThatWasCreated);
            newItemDoenetId = pageThatWasCreated.doenetId;
          } else if (itemType == "order") {
            set2(itemByDoenetId(orderObj.doenetId), orderObj);
          }
          set2(authorCourseItemOrderByCourseId(courseId), (prev) => {
            let next = [...prev];
            next.splice(next.indexOf(insertedAfterDoenetId) + 1, 0, newItemDoenetId);
            return next;
          });
        }
      }
    }
    return newDoenetId;
  });
  const defaultFailure = useCallback((err) => {
    addToast(`${err}`, toastType.ERROR);
  }, [addToast]);
  const modifyCourse = useRecoilCallback(({set: set2}) => async (modifications, successCallback, failureCallback = defaultFailure) => {
    try {
      let resp = await axios.post("/api/modifyCourse.php", {
        courseId,
        ...modifications
      });
      if (resp.status < 300) {
        set2(coursePermissionsAndSettingsByCourseId(courseId), ({prev}) => ({...prev, ...modifications}));
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err);
    }
  });
  const deleteCourse = useRecoilCallback(({set: set2}) => async (successCallback, failureCallback = defaultFailure) => {
    try {
      let resp = await axios.post("/api/deleteCourse.php", {courseId});
      if (resp.status < 300) {
        set2(coursePermissionsAndSettings, (prev) => prev.filter((c) => c.courseId !== courseId));
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err);
    }
  }, [courseId, defaultFailure]);
  const renameItem = useRecoilCallback(({snapshot, set: set2}) => async (doenetId, newLabel, successCallback, failureCallback = defaultFailure) => {
    try {
      let cutObjs = await snapshot.getPromise(cutCourseItems);
      for (let cutObj of cutObjs) {
        set2(itemByDoenetId(cutObj.doenetId), (prev) => {
          let next = {...prev};
          next["isBeingCut"] = false;
          return next;
        });
      }
      set2(cutCourseItems, []);
      set2(copiedCourseItems, []);
      let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
      let resp = await axios.get("/api/renameCourseItem.php", {params: {courseId, doenetId, newLabel, type: itemObj.type}});
      if (resp.status < 300) {
        let updatedItem = resp.data.item;
        if (itemObj.type !== "page") {
          updatedItem.isOpen = itemObj.isOpen;
        }
        set2(itemByDoenetId(doenetId), (prev) => {
          let next = {...prev};
          next.label = updatedItem.label;
          return next;
        });
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err);
    }
  }, [courseId, defaultFailure]);
  const updateAssignItem = useRecoilCallback(({set: set2}) => async ({doenetId, isAssigned, successCallback, failureCallback = defaultFailure}) => {
    try {
      let resp = await axios.get("/api/updateIsAssignedOnAnItem.php", {params: {courseId, doenetId, isAssigned}});
      if (resp.status < 300) {
        set2(itemByDoenetId(doenetId), (prev) => {
          let next = {...prev};
          next.isAssigned = isAssigned;
          return next;
        });
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err);
    }
  }, [courseId, defaultFailure]);
  const compileActivity = useRecoilCallback(({set: set2, snapshot}) => async ({activityDoenetId, successCallback, isAssigned = false, courseId: courseId2, failureCallback = defaultFailure}) => {
    async function orderToDoenetML({order, indentLevel = 1}) {
      let attributes = ["behavior", "numberToSelect", "withReplacement"];
      let orderParameters = attributes.filter((x) => x in order).map((x) => `${x}="${order[x]}"`).join(" ");
      let contentStrings = (await Promise.all(order.content.map((x) => contentToDoenetML({content: x, indentLevel: indentLevel + 1})))).join("");
      let indentSpacing = "  ".repeat(indentLevel);
      return `${indentSpacing}<order ${orderParameters}>
${contentStrings}${indentSpacing}</order>
`;
    }
    async function contentToDoenetML({content, indentLevel = 1}) {
      if (content.type === "order") {
        return await orderToDoenetML({order: content, indentLevel});
      } else if (typeof content === "string") {
        return await pageToDoenetML({pageDoenetId: content, indentLevel});
      } else {
        throw Error("Invalid activity definition: content must be an order or a doenetId specifying a page");
      }
    }
    async function pageToDoenetML({pageDoenetId, indentLevel = 1}) {
      let indentSpacing = "  ".repeat(indentLevel);
      let pageDoenetML = await snapshot.getPromise(fileByPageId(pageDoenetId));
      let params = {
        doenetML: pageDoenetML,
        pageId: pageDoenetId,
        courseId: courseId2,
        saveAsCid: true
      };
      const {data} = await axios.post("/api/saveDoenetML.php", params);
      if (!data.success) {
        throw Error(data.message);
      }
      let pageCid = data.cid;
      set2(fileByCid(pageCid), pageDoenetML);
      return `${indentSpacing}<page cid="${pageCid}" />
`;
    }
    let activity = await snapshot.getPromise(itemByDoenetId(activityDoenetId));
    let attributeString = ` xmlns="https://doenet.org/spec/doenetml/v${activity.version}" type="activity"`;
    if (activity.itemWeights) {
      attributeString += ` itemWeights = "${activity.itemWeights.join(" ")}"`;
    }
    if (activity.shuffleItemWeights) {
      attributeString += ` shuffleItemWeights`;
    }
    if (activity.numberOfVariants !== void 0) {
      attributeString += ` numberOfVariants="${activity.numberOfVariants}"`;
    }
    if (activity.isSinglePage) {
      attributeString += ` isSinglePage`;
    }
    let childrenString = "";
    try {
      childrenString = (await Promise.all(activity.order.content.map((x) => contentToDoenetML({content: x, indentLevel: 1})))).join("");
    } catch (err) {
      failureCallback(err);
    }
    let activityDoenetML = `<document${attributeString}>
${childrenString}</document>`;
    try {
      let resp = await axios.post("/api/saveCompiledActivity.php", {courseId: courseId2, doenetId: activityDoenetId, isAssigned, activityDoenetML});
      if (resp.status < 300) {
        let {success, message, cid, assignmentSettings} = resp.data;
        let key = "draftCid";
        if (isAssigned) {
          key = "assignedCid";
        }
        set2(itemByDoenetId(activityDoenetId), (prev) => {
          let next = {...prev};
          next[key] = cid;
          if (isAssigned) {
            Object.assign(next, localizeDates(assignmentSettings, dateKeys));
          }
          return next;
        });
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err);
    }
  });
  function updateOrder({orderObj, needleDoenetId, changesObj}) {
    let nextOrderObj = {...orderObj};
    if (needleDoenetId == orderObj.doenetId) {
      Object.assign(nextOrderObj, changesObj);
      return nextOrderObj;
    }
    for (let [i, item] of Object.entries(orderObj.content)) {
      if (item?.type == "order") {
        if (needleDoenetId == item.doenetId) {
          let nextItemObj = {...item};
          Object.assign(nextItemObj, changesObj);
          nextOrderObj.content = [...nextOrderObj.content];
          nextOrderObj.content.splice(i, 1, nextItemObj);
          return nextOrderObj;
        }
        let childOrderObj = updateOrder({orderObj: item, needleDoenetId, changesObj});
        if (childOrderObj != null) {
          nextOrderObj.content = [...nextOrderObj.content];
          nextOrderObj.content.splice(i, 1, childOrderObj);
          return nextOrderObj;
        }
      }
    }
    return null;
  }
  function deletePageFromOrder({orderObj, needleDoenetId}) {
    let nextOrderObj = {...orderObj};
    let index = null;
    for (let [i, item] of Object.entries(orderObj.content)) {
      if (item?.type == "order") {
        let childOrderObj = deletePageFromOrder({orderObj: item, needleDoenetId});
        if (childOrderObj != null) {
          nextOrderObj.content = [...nextOrderObj.content];
          nextOrderObj.content.splice(i, 1, childOrderObj);
          return nextOrderObj;
        }
      } else if (needleDoenetId == item) {
        index = i;
        break;
      }
    }
    if (index != null) {
      let nextContent = [...orderObj.content];
      nextContent.splice(index, 1);
      nextOrderObj.content = nextContent;
      return nextOrderObj;
    }
    return null;
  }
  function deleteOrderFromOrder({orderObj, needleDoenetId}) {
    let nextOrderObj = {...orderObj};
    let index = null;
    for (let [i, item] of Object.entries(orderObj.content)) {
      if (item?.type == "order") {
        if (needleDoenetId == item.doenetId) {
          index = i;
          break;
        }
        let childOrderObj = deleteOrderFromOrder({orderObj: item, needleDoenetId});
        if (childOrderObj != null) {
          nextOrderObj.content = [...nextOrderObj.content];
          nextOrderObj.content.splice(i, 1, childOrderObj);
          return nextOrderObj;
        }
      }
    }
    if (index != null) {
      let nextContent = [...orderObj.content];
      nextContent.splice(index, 1);
      nextOrderObj.content = nextContent;
      return nextOrderObj;
    }
    return null;
  }
  function findOrderDoenetIdsInAnOrder({orderObj, needleOrderDoenetId, foundNeedle = false}) {
    let orderDoenetIds = [];
    for (let item of orderObj.content) {
      if (item?.type == "order") {
        let morePageDoenetIds;
        if (foundNeedle || item.doenetId == needleOrderDoenetId) {
          orderDoenetIds.push(item.doenetId);
          morePageDoenetIds = findOrderDoenetIdsInAnOrder({orderObj: item, needleOrderDoenetId, foundNeedle: true});
        } else {
          morePageDoenetIds = findOrderDoenetIdsInAnOrder({orderObj: item, needleOrderDoenetId, foundNeedle});
        }
        orderDoenetIds = [...orderDoenetIds, ...morePageDoenetIds];
      }
    }
    return orderDoenetIds;
  }
  const updateOrderBehavior = useRecoilCallback(({set: set2, snapshot}) => async ({doenetId, behavior, numberToSelect, withReplacement, successCallback, failureCallback = defaultFailure}) => {
    let orderObj = await snapshot.getPromise(itemByDoenetId(doenetId));
    let activityObj = await snapshot.getPromise(itemByDoenetId(orderObj.containingDoenetId));
    let changesObj = {behavior, numberToSelect, withReplacement};
    let nextOrder = updateOrder({orderObj: activityObj.order, needleDoenetId: doenetId, changesObj});
    let {data} = await axios.post("/api/updateActivityStructure.php", {
      courseId,
      doenetId: orderObj.containingDoenetId,
      newJSON: nextOrder
    });
    let nextActivityObj = {...activityObj};
    nextActivityObj.order = nextOrder;
    set2(itemByDoenetId(orderObj.containingDoenetId), nextActivityObj);
    set2(itemByDoenetId(doenetId), (prev) => {
      let next = {...prev};
      next.behavior = behavior;
      next.numberToSelect = numberToSelect;
      next.withReplacement = withReplacement;
      return next;
    });
  });
  const deleteItem = useRecoilCallback(({set: set2, snapshot}) => async ({doenetId, successCallback, failureCallback = defaultFailure}) => {
    let itemToDeleteObj = await snapshot.getPromise(itemByDoenetId(doenetId));
    let pagesDoenetIds = [];
    let courseContentDoenetIds = [];
    let activitiesJson = [];
    let activitiesJsonDoenetIds = [];
    let collectionsJson = [];
    let collectionsJsonDoenetIds = [];
    let baseCollectionsDoenetIds = [];
    let baseActivitiesDoenetIds = [];
    let baseSectionsDoenetIds = [];
    let orderDoenetIds = [];
    if (itemToDeleteObj.type == "page") {
      let containingObj = await snapshot.getPromise(itemByDoenetId(itemToDeleteObj.containingDoenetId));
      if (containingObj.type == "bank") {
        collectionsJsonDoenetIds.push(containingObj.doenetId);
        let nextPages = [...containingObj.pages];
        nextPages.splice(nextPages.indexOf(itemToDeleteObj.doenetId), 1);
        collectionsJson.push(nextPages);
        pagesDoenetIds.push(doenetId);
      } else if (containingObj.type == "activity") {
        let nextOrder = deletePageFromOrder({orderObj: containingObj.order, needleDoenetId: doenetId});
        activitiesJson.push(nextOrder);
        activitiesJsonDoenetIds.push(containingObj.doenetId);
        pagesDoenetIds.push(doenetId);
      }
    } else if (itemToDeleteObj.type == "order") {
      let containingObj = await snapshot.getPromise(itemByDoenetId(itemToDeleteObj.containingDoenetId));
      pagesDoenetIds = findPageDoenetIdsInAnOrder({orderObj: containingObj.order, needleOrderDoenetId: doenetId});
      orderDoenetIds = findOrderDoenetIdsInAnOrder({orderObj: containingObj.order, needleOrderDoenetId: doenetId});
      let nextOrder = deleteOrderFromOrder({orderObj: containingObj.order, needleDoenetId: doenetId});
      activitiesJson.push(nextOrder);
      activitiesJsonDoenetIds.push(containingObj.doenetId);
    } else if (itemToDeleteObj.type == "bank") {
      baseCollectionsDoenetIds.push(doenetId);
      pagesDoenetIds = itemToDeleteObj.pages;
    } else if (itemToDeleteObj.type == "activity") {
      let orderObj = itemToDeleteObj.order;
      let needleOrderDoenetId = itemToDeleteObj.order.doenetId;
      pagesDoenetIds = findPageDoenetIdsInAnOrder({orderObj, needleOrderDoenetId, foundNeedle: true});
      orderDoenetIds = findOrderDoenetIdsInAnOrder({orderObj, needleOrderDoenetId, foundNeedle: true});
      orderDoenetIds = [needleOrderDoenetId, ...orderDoenetIds];
      baseActivitiesDoenetIds = [doenetId];
    } else if (itemToDeleteObj.type == "section") {
      baseSectionsDoenetIds.push(itemToDeleteObj.doenetId);
      let sectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId, sectionId: itemToDeleteObj.doenetId}));
      for (let doenetId2 of sectionDoenetIds) {
        let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId2));
        if (itemObj.type == "activity") {
          baseActivitiesDoenetIds.push(itemObj.doenetId);
        } else if (itemObj.type == "order") {
          orderDoenetIds.push(itemObj.doenetId);
        } else if (itemObj.type == "page") {
          pagesDoenetIds.push(itemObj.doenetId);
        } else if (itemObj.type == "bank") {
          baseCollectionsDoenetIds.push(itemObj.doenetId);
        } else if (itemObj.type == "section") {
          baseSectionsDoenetIds.push(itemObj.doenetId);
        }
      }
    }
    try {
      let resp = await axios.post("/api/deleteItems.php", {
        courseId,
        pagesDoenetIds,
        courseContentDoenetIds,
        activitiesJson,
        activitiesJsonDoenetIds,
        collectionsJson,
        collectionsJsonDoenetIds,
        baseCollectionsDoenetIds,
        baseActivitiesDoenetIds,
        baseSectionsDoenetIds
      });
      if (resp.status < 300) {
        let {success, message} = resp.data;
        for (let [i, collectionDoenetId] of Object.entries(collectionsJsonDoenetIds)) {
          let collectionJson = collectionsJson[i];
          set2(itemByDoenetId(collectionDoenetId), (prev) => {
            let next = {...prev};
            next.pages = collectionJson;
            return next;
          });
        }
        for (let [i, activitiesJsonDoenetId] of Object.entries(activitiesJsonDoenetIds)) {
          let activityJson = activitiesJson[i];
          set2(itemByDoenetId(activitiesJsonDoenetId), (prev) => {
            let next = {...prev};
            next.order = activityJson;
            return next;
          });
        }
        set2(authorCourseItemOrderByCourseId(courseId), (prev) => {
          let next = [...prev];
          for (let pagesDoenetId of pagesDoenetIds) {
            next.splice(next.indexOf(pagesDoenetId), 1);
          }
          for (let orderDoenetId of orderDoenetIds) {
            next.splice(next.indexOf(orderDoenetId), 1);
          }
          for (let baseCollectionsDoenetId of baseCollectionsDoenetIds) {
            next.splice(next.indexOf(baseCollectionsDoenetId), 1);
          }
          for (let baseActivitiesDoenetId of baseActivitiesDoenetIds) {
            next.splice(next.indexOf(baseActivitiesDoenetId), 1);
          }
          for (let baseSectionsDoenetId of baseSectionsDoenetIds) {
            next.splice(next.indexOf(baseSectionsDoenetId), 1);
          }
          return next;
        });
        let selectedDoenentIds = await snapshot.getPromise(selectedCourseItems);
        for (let doenetId2 of selectedDoenentIds) {
          set2(itemByDoenetId(doenetId2), (prev) => {
            let next = {...prev};
            next.isSelected = false;
            return next;
          });
        }
        set2(selectedCourseItems, []);
        set2(selectedMenuPanelAtom, "");
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err);
    }
  });
  const copyItems = useRecoilCallback(({set: set2, snapshot}) => async ({successCallback, failureCallback = defaultFailure}) => {
    let selectedDoenetIds = await snapshot.getPromise(selectedCourseItems);
    let copiedCourseItemsObjs = [];
    for (let selectedDoenetId of selectedDoenetIds) {
      let selectedObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetId));
      copiedCourseItemsObjs.push(selectedObj);
    }
    set2(copiedCourseItems, copiedCourseItemsObjs);
    let cutObjs = await snapshot.getPromise(cutCourseItems);
    for (let cutObj of cutObjs) {
      set2(itemByDoenetId(cutObj.doenetId), (prev) => {
        let next = {...prev};
        next["isBeingCut"] = false;
        return next;
      });
    }
    set2(cutCourseItems, []);
    successCallback();
  });
  const cutItems = useRecoilCallback(({set: set2, snapshot}) => async ({successCallback, failureCallback = defaultFailure}) => {
    let cutObjs = await snapshot.getPromise(cutCourseItems);
    for (let cutObj of cutObjs) {
      set2(itemByDoenetId(cutObj.doenetId), (prev) => {
        let next = {...prev};
        next["isBeingCut"] = false;
        return next;
      });
    }
    set2(cutCourseItems, []);
    let selectedDoenetIds = await snapshot.getPromise(selectedCourseItems);
    let cutCourseItemsObjs = [];
    for (let selectedDoenetId of selectedDoenetIds) {
      let selectedObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetId));
      cutCourseItemsObjs.push(selectedObj);
      let nextItem = {...selectedObj};
      nextItem["isBeingCut"] = true;
      set2(itemByDoenetId(selectedDoenetId), nextItem);
    }
    set2(cutCourseItems, cutCourseItemsObjs);
    successCallback();
  });
  const pasteItems = useRecoilCallback(({set: set2, snapshot}) => async ({successCallback, failureCallback = defaultFailure}) => {
    async function getIds(doenetId, itemObj = null) {
      let allIds = [doenetId];
      if (!itemObj) {
        itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
      }
      if (itemObj.type == "activity") {
        let activityIds = await getIds(itemObj.order.doenetId, itemObj.order);
        allIds = [...allIds, ...activityIds];
      } else if (itemObj.type == "order") {
        let orderIds = [];
        for (let id of itemObj.content) {
          if (id?.type == "order") {
            let subOrderIds = await getIds(itemObj.doenetId, id);
            orderIds = [...orderIds, ...subOrderIds];
          } else {
            orderIds.push(id);
          }
        }
        allIds = [...allIds, ...orderIds];
      } else if (itemObj.type == "bank") {
        allIds = [...allIds, ...itemObj.pages];
      } else if (itemObj.type == "section") {
        let sectionIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId, sectionId: doenetId}));
        allIds = [...allIds, ...sectionIds];
      }
      return allIds;
    }
    async function getContainingIds(sectionDoenetId) {
      let containingIds = [];
      let sectionIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId, sectionId: sectionDoenetId}));
      for (let id of sectionIds) {
        let itemObj = await snapshot.getPromise(itemByDoenetId(id));
        if (itemObj.type == "bank" || itemObj.type == "activity") {
          containingIds.push(id);
        } else if (itemObj.type == "section") {
          let subSectionIds = await getContainingIds(id);
          containingIds = [...containingIds, id, ...subSectionIds];
        }
      }
      return containingIds;
    }
    async function getAncestors(doenetId) {
      let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
      if (itemObj.parentDoenetId == courseId) {
        return [doenetId];
      }
      let newAncestors = await getAncestors(itemObj.parentDoenetId);
      return [doenetId, ...newAncestors];
    }
    let cutObjs = await snapshot.getPromise(cutCourseItems);
    let copiedObjs = await snapshot.getPromise(copiedCourseItems);
    let selectedDoenetIds = await snapshot.getPromise(selectedCourseItems);
    let singleSelectedObj = null;
    if (cutObjs.length == 0 && copiedObjs.length == 0) {
      failureCallback("No items pasted.");
      return;
    }
    let sectionId = await snapshot.getPromise(searchParamAtomFamily("sectionId"));
    if (sectionId == "") {
      sectionId = courseId;
    }
    let destParentDoenetId = sectionId;
    let destPreviousItemDoenetId;
    let destPreviousContainingItemDoenetId;
    let destType = "section";
    let destinationContainingObj;
    if (selectedDoenetIds.length == 1) {
      singleSelectedObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetIds[0]));
      destType = singleSelectedObj.type;
      if (singleSelectedObj.type == "section") {
        destParentDoenetId = singleSelectedObj.doenetId;
        destinationContainingObj = {...singleSelectedObj};
      } else if (singleSelectedObj.type == "activity" || singleSelectedObj.type == "bank") {
        destinationContainingObj = {...singleSelectedObj};
        destParentDoenetId = singleSelectedObj.parentDoenetId;
      } else if (singleSelectedObj.type == "order" || singleSelectedObj.type == "page") {
        let selectedContainingObj = await snapshot.getPromise(itemByDoenetId(singleSelectedObj.containingDoenetId));
        destinationContainingObj = {...selectedContainingObj};
        destParentDoenetId = selectedContainingObj.parentDoenetId;
      }
      let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId, sectionId: destParentDoenetId}));
      let lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
      let lastItemInSelectedSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId));
      destPreviousItemDoenetId = lastItemInSelectedSectionDoenetId;
      if (!lastItemInSelectedSectionDoenetId) {
        lastItemInSelectedSectionDoenetId = destParentDoenetId;
        lastItemInSelectedSectionObj = await snapshot.getPromise(itemByDoenetId(destParentDoenetId));
      }
      if (lastItemInSelectedSectionObj.type == "section" || lastItemInSelectedSectionObj.type == "bank" || lastItemInSelectedSectionObj.type == "activity") {
        destPreviousContainingItemDoenetId = lastItemInSelectedSectionDoenetId;
      } else if (lastItemInSelectedSectionObj.type == "order" || lastItemInSelectedSectionObj.type == "page") {
        destPreviousContainingItemDoenetId = lastItemInSelectedSectionObj.containingDoenetId;
      }
    } else if (selectedDoenetIds.length > 1) {
      failureCallback("Can only paste to one location.");
      return;
    } else {
      let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId, sectionId}));
      let lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
      destPreviousItemDoenetId = lastItemInSelectedSectionDoenetId;
      let lastItemInSelectedSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId));
      if (lastItemInSelectedSectionObj.type == "section" || lastItemInSelectedSectionObj.type == "bank" || lastItemInSelectedSectionObj.type == "activity") {
        destPreviousContainingItemDoenetId = lastItemInSelectedSectionDoenetId;
      } else if (lastItemInSelectedSectionObj.type == "order" || lastItemInSelectedSectionObj.type == "page") {
        destPreviousContainingItemDoenetId = lastItemInSelectedSectionObj.containingDoenetId;
      }
    }
    if (!destPreviousItemDoenetId) {
      destPreviousItemDoenetId = destParentDoenetId;
    }
    if (cutObjs.length > 0) {
      let doenetIdsToMove = [];
      let noParentUpdateDoenetIds = [];
      let sourcePagesAndOrdersToMove = [];
      let ancestorsDoenetIds = [];
      if (destinationContainingObj) {
        ancestorsDoenetIds = await getAncestors(destinationContainingObj.doenetId);
      }
      for (let cutObj of cutObjs) {
        if ((destType == "section" || destType == "activity") && (cutObj.type == "page" || cutObj.type == "order")) {
          failureCallback(`Pasting ${cutObj.type} in a ${destType} is not supported.`);
          return;
        }
        if (cutObj.type == "order") {
          failureCallback("Pasting orders is not yet supported");
          return;
        }
        if (destType == "bank" && cutObj.type == "order") {
          failureCallback("Collections can only accept pages.");
          return;
        }
        if (ancestorsDoenetIds.includes(cutObj.doenetId)) {
          failureCallback("Can't paste item into itself.");
          return;
        }
        if (cutObj.type == "activity" || cutObj.type == "bank") {
          doenetIdsToMove.push(cutObj.doenetId);
        }
        if (cutObj.type == "section") {
          let additionalNoParentUpdateDoenetIds = await getContainingIds(cutObj.doenetId);
          additionalNoParentUpdateDoenetIds = [...new Set(additionalNoParentUpdateDoenetIds)];
          noParentUpdateDoenetIds = [...noParentUpdateDoenetIds, ...additionalNoParentUpdateDoenetIds];
          doenetIdsToMove = [...doenetIdsToMove, cutObj.doenetId, ...additionalNoParentUpdateDoenetIds];
        }
        if (cutObj.type == "order" || cutObj.type == "page") {
          sourcePagesAndOrdersToMove.push({...cutObj});
        }
      }
      if (sourcePagesAndOrdersToMove.length > 0 && doenetIdsToMove.length > 0) {
        failureCallback("Can't paste pages or orders with other types.");
        return;
      }
      if (doenetIdsToMove.length > 0) {
        try {
          let resp = await axios.post("/api/moveContent.php", {
            courseId,
            doenetIdsToMove,
            destParentDoenetId,
            destPreviousContainingItemDoenetId,
            noParentUpdateDoenetIds
          });
          if (resp.status < 300) {
            for (let doenetId of doenetIdsToMove) {
              set2(itemByDoenetId(doenetId), (prevObj) => {
                let nextObj = {...prevObj};
                nextObj["isBeingCut"] = false;
                nextObj["isSelected"] = false;
                if (!noParentUpdateDoenetIds.includes(doenetId)) {
                  nextObj.parentDoenetId = destParentDoenetId;
                }
                return nextObj;
              });
            }
            let sortedDoenetIdsToMove = [];
            for (let doenetId of doenetIdsToMove) {
              let associatedIds = await getIds(doenetId);
              sortedDoenetIdsToMove = [...sortedDoenetIdsToMove, ...associatedIds];
            }
            sortedDoenetIdsToMove = [...new Set(sortedDoenetIdsToMove)];
            set2(authorCourseItemOrderByCourseId(courseId), (prevObj) => {
              let nextObj = [...prevObj];
              nextObj = nextObj.filter((value) => !sortedDoenetIdsToMove.includes(value));
              let insertIndex = nextObj.indexOf(destPreviousItemDoenetId) + 1;
              if (insertIndex == 0) {
                let indexPreviousToPrevious = prevObj.indexOf(destPreviousItemDoenetId) - 1;
                let needle = prevObj[indexPreviousToPrevious];
                while (indexPreviousToPrevious > 0 && !nextObj.includes(needle)) {
                  indexPreviousToPrevious--;
                  needle = prevObj[indexPreviousToPrevious];
                }
                insertIndex = indexPreviousToPrevious + 1;
              }
              nextObj.splice(insertIndex, 0, ...sortedDoenetIdsToMove);
              return nextObj;
            });
            successCallback?.();
          } else {
            throw new Error(`response code: ${resp.status}`);
          }
        } catch (err) {
          failureCallback(err);
        }
      }
      if (sourcePagesAndOrdersToMove.length > 0) {
        let destinationType = destinationContainingObj.type;
        let destinationDoenetId = destinationContainingObj.doenetId;
        let destinationJSON;
        if (destinationType == "bank") {
          destinationJSON = [...destinationContainingObj.pages];
        } else if (destinationType == "activity") {
          destinationJSON = {...destinationContainingObj.order};
        }
        let sourceTypes = [];
        let sourceDoenetIds = [];
        let sourceJSONs = [];
        let originalPageDoenetIds = [];
        let previousDoenetId;
        for (let cutObj of sourcePagesAndOrdersToMove) {
          let sourceContainingDoenetId = cutObj.containingDoenetId;
          let indexOfPriorEntry = sourceDoenetIds.indexOf(sourceContainingDoenetId);
          if (indexOfPriorEntry == -1) {
            originalPageDoenetIds.push([cutObj.doenetId]);
            sourceDoenetIds.push(sourceContainingDoenetId);
            let containingObj = await snapshot.getPromise(itemByDoenetId(sourceContainingDoenetId));
            sourceTypes.push(containingObj.type);
            let updatedSourceItemJSON = {};
            if (containingObj.type == "activity") {
              updatedSourceItemJSON = deletePageFromOrder({orderObj: containingObj.order, needleDoenetId: cutObj.doenetId});
              if (destinationContainingObj.doenetId == containingObj.doenetId) {
                destinationJSON = deletePageFromOrder({orderObj: destinationJSON, needleDoenetId: cutObj.doenetId});
              }
            } else if (containingObj.type == "bank") {
              let nextPages = [...containingObj.pages];
              nextPages.splice(containingObj.pages.indexOf(cutObj.doenetId), 1);
              updatedSourceItemJSON = nextPages;
              if (destinationContainingObj.doenetId == containingObj.doenetId) {
                let nextDestPages = [...destinationJSON];
                nextDestPages.splice(destinationJSON.indexOf(cutObj.doenetId), 1);
                destinationJSON = nextDestPages;
              }
            }
            sourceJSONs.push(updatedSourceItemJSON);
          } else {
            originalPageDoenetIds[indexOfPriorEntry].push(cutObj.doenetId);
            let containingObjtype = sourceTypes[indexOfPriorEntry];
            let previousObj = sourceJSONs[indexOfPriorEntry];
            let updatedSourceItemJSON = {};
            if (containingObjtype == "activity") {
              updatedSourceItemJSON = deletePageFromOrder({orderObj: previousObj, needleDoenetId: cutObj.doenetId});
              if (destinationContainingObj.doenetId == cutObj.containingDoenetId) {
                destinationJSON = deletePageFromOrder({orderObj: destinationJSON, needleDoenetId: cutObj.doenetId});
              }
            } else if (containingObjtype == "bank") {
              let nextPages = [...previousObj];
              nextPages.splice(previousObj.indexOf(cutObj.doenetId), 1);
              updatedSourceItemJSON = nextPages;
              if (destinationContainingObj.doenetId == cutObj.containingDoenetId) {
                let nextDestPages = [...destinationJSON];
                nextDestPages.splice(destinationJSON.indexOf(cutObj.doenetId), 1);
                destinationJSON = nextDestPages;
              }
            }
            sourceJSONs[indexOfPriorEntry] = updatedSourceItemJSON;
          }
          if (destinationType == "bank") {
            destinationJSON.push(cutObj.doenetId);
          } else if (destinationType == "activity") {
            let orderDoenetIdToAddToDoenetId = singleSelectedObj.doenetId;
            if (singleSelectedObj.type == "page") {
              orderDoenetIdToAddToDoenetId = singleSelectedObj.parentDoenetId;
            }
            ({order: destinationJSON, previousDoenetId} = addToOrder({
              orderObj: destinationJSON,
              needleOrderDoenetId: orderDoenetIdToAddToDoenetId,
              itemToAdd: cutObj.doenetId
            }));
          }
        }
        let previousDoenetIdForPages = previousDoenetId;
        if (!previousDoenetIdForPages) {
          if (singleSelectedObj.type == "bank") {
            if (singleSelectedObj.pages.length == 0) {
              previousDoenetIdForPages = singleSelectedObj.doenetId;
            } else {
              previousDoenetIdForPages = singleSelectedObj.pages[singleSelectedObj.pages.length - 1];
            }
          } else if (singleSelectedObj.type == "page") {
            let collectionObj = await snapshot.getPromise(itemByDoenetId(singleSelectedObj.containingDoenetId));
            if (collectionObj.pages.length == 0) {
              previousDoenetIdForPages = collectionObj.doenetId;
            } else {
              previousDoenetIdForPages = collectionObj.pages[collectionObj.pages.length - 1];
            }
          }
        }
        try {
          let resp = await axios.post("/api/cutCopyAndPasteAPage.php", {
            isCopy: false,
            courseId,
            originalPageDoenetIds,
            sourceTypes,
            sourceDoenetIds,
            sourceJSONs,
            destinationType,
            destinationDoenetId,
            destinationJSON
          });
          if (resp.status < 300) {
            let nextPagesParentDoenetId;
            if (singleSelectedObj.type == "order" || singleSelectedObj.type == "bank") {
              nextPagesParentDoenetId = singleSelectedObj.doenetId;
            } else if (singleSelectedObj.type == "page") {
              nextPagesParentDoenetId = singleSelectedObj.parentDoenetId;
            }
            let setOfOriginalPageDoenetIds = [];
            for (let [i, sourceType] of Object.entries(sourceTypes)) {
              let sourceDoenetId = sourceDoenetIds[i];
              let sourceJSON = sourceJSONs[i];
              if (sourceType == "bank") {
                set2(itemByDoenetId(sourceDoenetId), (prev) => {
                  let next = {...prev};
                  next.pages = sourceJSON;
                  return next;
                });
              } else if (sourceType == "activity") {
                set2(itemByDoenetId(sourceDoenetId), (prev) => {
                  let next = {...prev};
                  next.order = sourceJSON;
                  return next;
                });
              }
              for (let originalPageDoenetId of originalPageDoenetIds[i]) {
                setOfOriginalPageDoenetIds.push(originalPageDoenetId);
                set2(itemByDoenetId(originalPageDoenetId), (prev) => {
                  let next = {...prev};
                  next.containingDoenetId = destinationDoenetId;
                  next.parentDoenetId = nextPagesParentDoenetId;
                  next.isBeingCut = false;
                  return next;
                });
              }
            }
            if (destinationType == "bank") {
              set2(itemByDoenetId(destinationDoenetId), (prev) => {
                let next = {...prev};
                next.pages = destinationJSON;
                return next;
              });
            } else if (destinationType == "activity") {
              set2(itemByDoenetId(destinationDoenetId), (prev) => {
                let next = {...prev};
                next.order = destinationJSON;
                return next;
              });
            }
            set2(authorCourseItemOrderByCourseId(courseId), (prev) => {
              let next = [...prev];
              for (let doenetId of setOfOriginalPageDoenetIds) {
                next.splice(next.indexOf(doenetId), 1);
              }
              let insertIndex = next.indexOf(previousDoenetIdForPages) + 1;
              if (insertIndex == 0) {
                let indexPreviousToPrevious = prev.indexOf(previousDoenetIdForPages) - 1;
                let needle = prev[indexPreviousToPrevious];
                while (indexPreviousToPrevious > 0 && !next.includes(needle)) {
                  indexPreviousToPrevious--;
                  needle = prev[indexPreviousToPrevious];
                }
                insertIndex = indexPreviousToPrevious + 1;
              }
              next.splice(insertIndex, 0, ...setOfOriginalPageDoenetIds);
              return next;
            });
            successCallback?.();
          } else {
            throw new Error(`response code: ${resp.status}`);
          }
        } catch (err) {
          failureCallback(err);
        }
      }
      set2(copiedCourseItems, [...cutObjs]);
      set2(cutCourseItems, []);
      return;
    }
  });
  const findPagesFromDoenetIds = useRecoilCallback(({snapshot}) => async (selectedDoenetIds) => {
    let pagesFound = [];
    for (let doenetId of selectedDoenetIds) {
      let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
      if (itemObj.type == "page") {
        pagesFound.push(itemObj.doenetId);
      } else if (itemObj.type == "activity") {
        let newPages = findPageDoenetIdsInAnOrder({orderObj: itemObj.order, needleOrderDoenetId: "", foundNeedle: true});
        pagesFound = [...pagesFound, ...newPages];
      } else if (itemObj.type == "order") {
        let containingObj = await snapshot.getPromise(itemByDoenetId(itemObj.containingDoenetId));
        let newPages = findPageDoenetIdsInAnOrder({orderObj: containingObj.order, needleOrderDoenetId: itemObj.doenetId, foundNeedle: false});
        pagesFound = [...pagesFound, ...newPages];
      } else if (itemObj.type == "bank") {
        pagesFound = [...pagesFound, ...itemObj.pages];
      } else if (itemObj.type == "section") {
        let doenetIdsInSection = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId, sectionId: itemObj.doenetId}));
        let newPages = await findPagesFromDoenetIds(doenetIdsInSection);
        pagesFound = [...pagesFound, ...newPages];
      }
    }
    pagesFound = [...new Set(pagesFound)];
    return pagesFound;
  });
  return {
    create,
    deleteItem,
    deleteCourse,
    modifyCourse,
    label,
    color,
    image,
    renameItem,
    compileActivity,
    updateAssignItem,
    updateOrderBehavior,
    copyItems,
    cutItems,
    pasteItems,
    findPagesFromDoenetIds
  };
};
