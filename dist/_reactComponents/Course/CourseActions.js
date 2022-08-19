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
import {useValidateEmail} from "../../_utils/hooks/useValidateEmail.js";
const peopleAtomByCourseId = atomFamily({
  key: "peopleAtomByCourseId",
  default: [],
  effects: (courseId) => [
    ({setSelf, trigger}) => {
      if (trigger == "get" && courseId) {
        axios.get("/api/loadCoursePeople.php", {params: {courseId}}).then((resp) => {
          setSelf(resp.data.peopleArray);
        });
      }
    }
  ]
});
export const peopleByCourseId = selectorFamily({
  key: "peopleByCourseId",
  get: (courseId) => ({get, getCallback}) => {
    const recoilWithdraw = getCallback(({set}) => async (email) => {
      let payload = {
        email,
        courseId
      };
      try {
        let resp = await axios.post("/api/withDrawStudents.php", payload);
        if (resp.status < 300) {
          set(peopleAtomByCourseId(courseId), (prev) => {
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
    const recoilUnWithdraw = getCallback(({set}) => async (email) => {
      let payload = {
        email,
        courseId
      };
      try {
        let resp = await axios.post("/api/unWithDrawStudents.php", payload);
        if (resp.status < 300) {
          set(peopleAtomByCourseId(courseId), (prev) => {
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
    const recoilMergeData = getCallback(({set}) => async (payload, successCallback) => {
      try {
        let {data: {success, peopleArray, message}} = await axios.post("/api/mergePeopleData.php", {...payload, courseId});
        if (success) {
          set(peopleAtomByCourseId(courseId), peopleArray);
          successCallback?.();
        } else {
          throw new Error(message);
        }
      } catch (err) {
      }
    });
    return {
      value: get(peopleAtomByCourseId(courseId)),
      recoilWithdraw,
      recoilUnWithdraw,
      recoilMergeData
    };
  }
});
function buildDoenetIdToParentDoenetIdObj(contentArray, parentDoenetId = null) {
  let returnObj = {};
  for (let item of contentArray) {
    if (item?.type == "order") {
      let childObj = buildDoenetIdToParentDoenetIdObj(item.content, item.doenetId);
      returnObj = {...childObj, ...returnObj};
    } else if (parentDoenetId !== null) {
      returnObj[item] = parentDoenetId;
    }
  }
  return returnObj;
}
export function findFirstPageOfActivity(content = []) {
  let response = null;
  for (let item of content) {
    if (typeof item === "string" || item instanceof String) {
      response = item;
      break;
    } else {
      let nextOrderResponse = findFirstPageOfActivity(item.content);
      if (typeof nextOrderResponse === "string" || nextOrderResponse instanceof String) {
        response = nextOrderResponse;
        break;
      }
    }
  }
  return response;
}
function findOrderAndPageDoenetIdsAndSetOrderObjs({set, contentArray, assignmentDoenetId, orderDoenetId = null}) {
  let orderAndPagesDoenetIds = [];
  for (let item of contentArray) {
    if (item?.type == "order") {
      let numberToSelect = item.numberToSelect;
      if (numberToSelect == void 0) {
        numberToSelect = 1;
      }
      let withReplacement = item.withReplacement;
      if (withReplacement == void 0) {
        withReplacement = false;
      }
      let parentDoenetId = orderDoenetId;
      if (orderDoenetId == null) {
        parentDoenetId = assignmentDoenetId;
      }
      set(itemByDoenetId(item.doenetId), {
        type: "order",
        doenetId: item.doenetId,
        behavior: item.behavior,
        numberToSelect,
        withReplacement,
        containingDoenetId: assignmentDoenetId,
        isOpen: false,
        isSelected: false,
        parentDoenetId
      });
      orderAndPagesDoenetIds.push(item.doenetId);
      let moreOrderDoenetIds = findOrderAndPageDoenetIdsAndSetOrderObjs({set, contentArray: item.content, assignmentDoenetId, orderDoenetId: item.doenetId});
      orderAndPagesDoenetIds = [...orderAndPagesDoenetIds, ...moreOrderDoenetIds];
    } else {
      orderAndPagesDoenetIds = [...orderAndPagesDoenetIds, item];
    }
  }
  return orderAndPagesDoenetIds;
}
export function findPageDoenetIdsInAnOrder({content, needleOrderDoenetId, foundNeedle = false}) {
  let pageDoenetIds = [];
  for (let item of content) {
    if (item?.type == "order") {
      let morePageDoenetIds;
      if (foundNeedle || item.doenetId == needleOrderDoenetId) {
        morePageDoenetIds = findPageDoenetIdsInAnOrder({content: item.content, needleOrderDoenetId, foundNeedle: true});
      } else {
        morePageDoenetIds = findPageDoenetIdsInAnOrder({content: item.content, needleOrderDoenetId, foundNeedle});
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
export function findPageIdsInContentArray({content, needleOrderDoenetId, foundNeedle = false}) {
  let pageDoenetIds = [];
  for (let item of content) {
    if (item?.type == "order") {
      let morePageDoenetIds;
      if (foundNeedle || item.doenetId == needleOrderDoenetId) {
        morePageDoenetIds = findPageIdsInContentArray({content: item.content, needleOrderDoenetId, foundNeedle: true});
      } else {
        morePageDoenetIds = findPageIdsInContentArray({content: item.content, needleOrderDoenetId, foundNeedle});
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
  const getDataAndSetRecoil = useRecoilCallback(({snapshot, set}) => async (courseId2) => {
    if (!courseId2) {
      return;
    }
    const courseArrayTest = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId2));
    if (courseArrayTest.length == 0) {
      set(courseIdAtom, courseId2);
      const {data} = await axios.get("/api/getCourseItems.php", {
        params: {courseId: courseId2}
      });
      if (data.success) {
        let pageDoenetIdToParentDoenetId = {};
        let doenetIds = data.items.reduce((items, item) => {
          if (item.type !== "page") {
            items.push(item.doenetId);
          }
          if (item.type === "activity") {
            let newPageDoenetIdToParentDoenetId = buildDoenetIdToParentDoenetIdObj(item.content, item.doenetId);
            pageDoenetIdToParentDoenetId = {...pageDoenetIdToParentDoenetId, ...newPageDoenetIdToParentDoenetId};
            let ordersAndPagesIds = findOrderAndPageDoenetIdsAndSetOrderObjs({
              set,
              contentArray: item.content,
              assignmentDoenetId: item.doenetId
            });
            if (!item.isSinglePage) {
              items = [...items, ...ordersAndPagesIds];
            }
          } else if (item.type === "bank") {
            item.pages.map((childDoenetId) => {
              pageDoenetIdToParentDoenetId[childDoenetId] = item.doenetId;
            });
            items = [...items, ...item.pages];
          } else if (item.type === "page") {
            item["parentDoenetId"] = pageDoenetIdToParentDoenetId[item.doenetId];
          }
          set(itemByDoenetId(item.doenetId), localizeDates(item, dateKeys));
          return items;
        }, []);
        set(authorCourseItemOrderByCourseId(courseId2), doenetIds);
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
  set: (courseId) => ({set}, modifcations) => {
    set(coursePermissionsAndSettings, (prev) => {
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
const unfilteredCourseRolesByCourseId = atomFamily({
  key: "unfilteredCourseRolesByCourseId",
  effects: (courseId) => [
    async ({setSelf, trigger}) => {
      if (trigger === "get") {
        const {data: {roles}} = await axios.get("/api/loadCourseRoles.php", {params: {courseId}});
        setSelf(roles);
      }
    }
  ]
});
export const courseRolesByCourseId = selectorFamily({
  key: "filteredCourseRolesByCourseId",
  get: (courseId) => ({get}) => {
    const permissonsAndSettings = get(coursePermissionsAndSettingsByCourseId(courseId));
    const roles = get(unfilteredCourseRolesByCourseId(courseId));
    const ignoreKeys = ["isIncludedInGradebook", "sectionPermissonOnly", "dataAccessPermission", "roleId", "roleLabel"];
    let filteredRoles = roles?.filter((role) => {
      let valid = role.roleId === permissonsAndSettings.roleId || !Object.keys(role).every((permKey) => (role[permKey] ?? "0") === permissonsAndSettings[permKey] || ignoreKeys.includes(permKey) || (role[permKey] ?? "0") === "1" && permissonsAndSettings[permKey] === "0");
      return valid;
    }) ?? [];
    return filteredRoles;
  }
});
export const courseRolePermissonsByCourseIdRoleId = selectorFamily({
  key: "courseRoleByCourseIdRoleId",
  get: ({courseId, roleId}) => ({get}) => {
    return get(unfilteredCourseRolesByCourseId(courseId))?.find(({roleId: candidateRoleId}) => candidateRoleId === roleId) ?? {};
  }
});
export const useCreateCourse = () => {
  const createCourse = useRecoilCallback(({set}) => async () => {
    let {
      data: {
        permissionsAndSettings,
        courseId,
        image,
        color,
        ...remainingData
      }
    } = await axios.get("/api/createCourse.php");
    set(coursePermissionsAndSettings, permissionsAndSettings);
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
function findContentsChildIds(content) {
  let orderAndPageIds = [];
  for (let item of content) {
    if (item?.type == "order") {
      let newIds = findContentsChildIds(item.content);
      orderAndPageIds = [...orderAndPageIds, item.doenetId, ...newIds];
    } else {
      orderAndPageIds.push(item);
    }
  }
  return orderAndPageIds;
}
export const useCourse = (courseId) => {
  const {label, color, image, defaultRoleId} = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  const addToast = useToast();
  function insertPageOrOrderToActivityInSpecificOrder({
    content,
    needleOrderDoenetId,
    createdItemType,
    createdPageDonenetId = null,
    createdOrderObj = null
  }) {
    let newContent = [...content];
    let insertedAfterDoenetId;
    for (let [i, item] of Object.entries(content)) {
      if (item?.doenetId == needleOrderDoenetId) {
        let newItem = {...item};
        insertedAfterDoenetId = newItem.doenetId;
        if (newItem.content.length > 0) {
          insertedAfterDoenetId = newItem.content[newItem.content.length - 1];
        }
        if (insertedAfterDoenetId?.type == "order") {
          let childIds = findContentsChildIds(item.content);
          insertedAfterDoenetId = insertedAfterDoenetId.doenetId;
          if (childIds.length > 0) {
            insertedAfterDoenetId = childIds[childIds.length - 1];
          }
        }
        if (createdItemType == "page") {
          newItem.content = [...newItem.content, createdPageDonenetId];
        } else if (createdItemType == "order") {
          newItem.content = [...newItem.content, {...createdOrderObj}];
        }
        newContent.splice(i, 1, newItem);
        return {newContent, insertedAfterDoenetId};
      }
      if (item?.type == "order") {
        let {newContent: subContent, insertedAfterDoenetId: insertedAfterDoenetId2} = insertPageOrOrderToActivityInSpecificOrder({
          content: item.content,
          needleOrderDoenetId,
          createdItemType,
          createdPageDonenetId,
          createdOrderObj
        });
        if (subContent != null) {
          let newOrder = {...item};
          newOrder.content = subContent;
          newContent.splice(i, 1, newOrder);
          return {newContent, insertedAfterDoenetId: insertedAfterDoenetId2};
        }
      }
    }
    return {newContent: null, insertedAfterDoenetId: null};
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
  function addPageToActivity({activityOrOrderObj, needleOrderOrActivityId, itemToAdd}) {
    let nextContent = [...activityOrOrderObj.content];
    if (activityOrOrderObj.doenetId == needleOrderOrActivityId) {
      let previousDoenetId = activityOrOrderObj.doenetId;
      if (activityOrOrderObj.content.length > 0) {
        previousDoenetId = nextContent[nextContent.length - 1];
        if (previousDoenetId?.type == "order") {
          previousDoenetId = previousDoenetId.doenetId;
        }
      }
      nextContent = [...nextContent, itemToAdd];
      return {content: nextContent, previousDoenetId};
    }
    for (let [i, item] of Object.entries(activityOrOrderObj.content)) {
      if (item?.type == "order") {
        let {content: childContent, previousDoenetId} = addPageToActivity({activityOrOrderObj: item, needleOrderOrActivityId, itemToAdd});
        if (childContent != null) {
          let nextActivityOrObj = {...item};
          nextActivityOrObj.content = childContent;
          nextContent.splice(i, 1, nextActivityOrObj);
          return {content: nextContent, previousDoenetId};
        }
      }
    }
    return {content: null, previousDoenetId: null};
  }
  const defaultFailure = useCallback((err) => {
    addToast(`${err}`, toastType.ERROR);
  }, [addToast]);
  const create = useRecoilCallback(({set, snapshot}) => async ({
    itemType,
    parentDoenetId,
    previousDoenetId,
    previousContainingDoenetId
  }, successCallback, failureCallback = defaultFailure) => {
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
        } else if (lastItemObj.type == "activity" || lastItemObj.type == "bank" || lastItemObj.type == "section") {
          previousContainingDoenetId = lastItemObj.doenetId;
        }
      }
    }
    console.log("WHERE IS IT GOING?");
    console.log("itemType", itemType);
    console.log("parentDoenetId", parentDoenetId);
    console.log("previousDoenetId", previousDoenetId);
    console.log("previousContainingDoenetId", previousContainingDoenetId);
    let newDoenetId;
    let coursePermissionsAndSettings2 = await snapshot.getPromise(coursePermissionsAndSettingsByCourseId(courseId));
    if (coursePermissionsAndSettings2.canEditContent != "1") {
      return null;
    }
    if (itemType == "activity") {
      console.log("props to create activity", {
        previousContainingDoenetId,
        courseId,
        itemType,
        parentDoenetId
      });
      let {data} = await axios.post("/api/createCourseItem.php", {
        previousContainingDoenetId,
        courseId,
        itemType,
        parentDoenetId
      });
      let createdActivityDoenentId = data.doenetId;
      newDoenetId = createdActivityDoenentId;
      let newActivityObj = {
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
      };
      set(itemByDoenetId(createdActivityDoenentId), newActivityObj);
      let createdPageObj = {
        ...data.pageEntered,
        parentDoenetId: createdActivityDoenentId
      };
      set(itemByDoenetId(data.pageDoenetId), createdPageObj);
      let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
      if (indexOfPrevious == -1) {
        newAuthorItemDoenetIds.push(createdActivityDoenentId);
      } else {
        newAuthorItemDoenetIds.splice(indexOfPrevious + 1, 0, createdActivityDoenentId);
      }
      set(authorCourseItemOrderByCourseId(courseId), newAuthorItemDoenetIds);
    } else if (itemType == "bank") {
      let {data} = await axios.post("/api/createCourseItem.php", {
        previousContainingDoenetId,
        courseId,
        itemType,
        parentDoenetId
      });
      newDoenetId = data.doenetId;
      set(itemByDoenetId(data.doenetId), data.itemEntered);
      let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
      if (indexOfPrevious == -1) {
        newAuthorItemDoenetIds.push(data.doenetId);
      } else {
        newAuthorItemDoenetIds.splice(indexOfPrevious + 1, 0, data.doenetId);
      }
      set(authorCourseItemOrderByCourseId(courseId), newAuthorItemDoenetIds);
    } else if (itemType == "section") {
      let {data} = await axios.post("/api/createCourseItem.php", {
        previousContainingDoenetId,
        courseId,
        itemType,
        parentDoenetId
      });
      newDoenetId = data.doenetId;
      set(itemByDoenetId(data.doenetId), data.itemEntered);
      let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
      if (indexOfPrevious == -1) {
        newAuthorItemDoenetIds.push(data.doenetId);
      } else {
        newAuthorItemDoenetIds.splice(indexOfPrevious + 1, 0, data.doenetId);
      }
      set(authorCourseItemOrderByCourseId(courseId), newAuthorItemDoenetIds);
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
        let newJSON = {...selectedItemObj.content};
        if (itemType == "page") {
          pageThatWasCreated.parentDoenetId = selectedItemObj.doenetId;
          newJSON = [...selectedItemObj.content, pageThatWasCreated.doenetId];
        } else if (itemType == "order") {
          console.log("orderObj", orderObj);
          newJSON = [...selectedItemObj.content, orderObj];
        }
        let newActivityObj = {...selectedItemObj};
        newActivityObj.content = newJSON;
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
        set(itemByDoenetId(newActivityObj.doenetId), newActivityObj);
        if (itemType == "page") {
          set(itemByDoenetId(pageThatWasCreated.doenetId), pageThatWasCreated);
        } else if (itemType == "order") {
          orderObj = {
            ...orderObj,
            isOpen: false,
            isSelected: false,
            containingDoenetId: selectedItemObj.doenetId,
            parentDoenetId: selectedItemObj.doenetId
          };
          set(itemByDoenetId(orderObj.doenetId), orderObj);
        }
        let previousChildIds = findContentsChildIds(selectedItemObj.content);
        let nextChildIds = findContentsChildIds(newJSON);
        set(authorCourseItemOrderByCourseId(courseId), (prev) => {
          let next = [...prev];
          if (!makeMultiPage) {
            next.splice(next.indexOf(selectedItemObj.doenetId) + 1, previousChildIds.length);
          }
          next.splice(next.indexOf(selectedItemObj.doenetId) + 1, 0, ...nextChildIds);
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
        set(itemByDoenetId(pageThatWasCreated.doenetId), pageThatWasCreated);
        set(itemByDoenetId(newCollectionObj.doenetId), newCollectionObj);
        set(authorCourseItemOrderByCourseId(courseId), (prev) => {
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
        let {newContent, insertedAfterDoenetId} = insertPageOrOrderToActivityInSpecificOrder({
          content: containingItemObj.content,
          needleOrderDoenetId: orderDoenetId,
          createdItemType: itemType,
          createdPageDonenetId: pageThatWasCreated?.doenetId,
          createdOrderObj: orderObj
        });
        let newActivityObj = {...containingItemObj};
        newActivityObj.content = newContent;
        let {data: data2} = await axios.post("/api/updateActivityStructure.php", {
          courseId,
          doenetId: newActivityObj.doenetId,
          newJSON: newContent
        });
        orderObj["isOpen"] = false;
        orderObj["isSelected"] = false;
        orderObj["containingDoenetId"] = selectedItemObj?.containingDoenetId;
        orderObj["parentDoenetId"] = selectedItemObj?.doenetId;
        set(itemByDoenetId(newActivityObj.doenetId), newActivityObj);
        let newItemDoenetId = orderDoenetIdThatWasCreated;
        if (itemType == "page") {
          set(itemByDoenetId(pageThatWasCreated.doenetId), pageThatWasCreated);
          newItemDoenetId = pageThatWasCreated.doenetId;
        } else if (itemType == "order") {
          set(itemByDoenetId(orderObj.doenetId), orderObj);
        }
        set(authorCourseItemOrderByCourseId(courseId), (prev) => {
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
          set(itemByDoenetId(pageThatWasCreated.doenetId), pageThatWasCreated);
          set(itemByDoenetId(newCollectionObj.doenetId), newCollectionObj);
          set(authorCourseItemOrderByCourseId(courseId), (prev) => {
            let next = [...prev];
            next.splice(next.indexOf(insertedAfterDoenetId) + 1, 0, pageThatWasCreated.doenetId);
            return next;
          });
        } else if (containingItemObj.type == "activity") {
          let insertedAfterDoenetId;
          let newJSON;
          if (itemType == "page") {
            ({content: newJSON, previousDoenetId: insertedAfterDoenetId} = addPageToActivity({
              activityOrOrderObj: containingItemObj,
              needleOrderOrActivityId: selectedItemObj.parentDoenetId,
              itemToAdd: pageThatWasCreated?.doenetId
            }));
          } else if (itemType == "order") {
            ({content: newJSON, previousDoenetId: insertedAfterDoenetId} = addPageToActivity({
              activityOrOrderObj: containingItemObj,
              needleOrderOrActivityId: selectedItemObj.parentDoenetId,
              itemToAdd: orderObj
            }));
          }
          let {data: data2} = await axios.post("/api/updateActivityStructure.php", {
            courseId,
            doenetId: containingItemObj.doenetId,
            newJSON
          });
          let newActivityObj = {...containingItemObj};
          newActivityObj.content = newJSON;
          orderObj["isOpen"] = false;
          orderObj["isSelected"] = false;
          orderObj["containingDoenetId"] = selectedItemObj?.containingDoenetId;
          orderObj["parentDoenetId"] = selectedItemObj?.parentDoenetId;
          let newItemDoenetId;
          if (itemType == "page") {
            set(itemByDoenetId(pageThatWasCreated.doenetId), pageThatWasCreated);
            newItemDoenetId = pageThatWasCreated.doenetId;
          } else if (itemType == "order") {
            set(itemByDoenetId(orderObj.doenetId), orderObj);
            newItemDoenetId = orderDoenetIdThatWasCreated;
          }
          set(itemByDoenetId(newActivityObj.doenetId), newActivityObj);
          set(authorCourseItemOrderByCourseId(courseId), (prev) => {
            let next = [...prev];
            next.splice(next.indexOf(insertedAfterDoenetId) + 1, 0, newItemDoenetId);
            return next;
          });
        }
      }
    }
    return newDoenetId;
  });
  const modifyCourse = useRecoilCallback(({set}) => async (modifications, successCallback, failureCallback = defaultFailure) => {
    try {
      let resp = await axios.post("/api/modifyCourse.php", {
        courseId,
        ...modifications
      });
      if (resp.status < 300) {
        set(coursePermissionsAndSettingsByCourseId(courseId), ({prev}) => ({...prev, ...modifications}));
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err.message);
    }
  });
  const validateEmail = useValidateEmail();
  const addUser = useRecoilCallback(({set}) => async (email, options, successCallback, failureCallback = defaultFailure) => {
    try {
      if (!validateEmail(email))
        throw new Error("Invalid email, try again");
      const {
        data: {success, message, userData: serverUserData}
      } = await axios.post("/api/addCourseUser.php", {
        courseId,
        email,
        ...options
      });
      if (success) {
        set(peopleAtomByCourseId(courseId), (prev) => [...prev, {...serverUserData}]);
        successCallback(message);
      } else {
        throw new Error(message);
      }
    } catch (err) {
      failureCallback(err.message);
    }
  });
  const modifyUserRole = useRecoilCallback(({set}) => async (email, roleId, successCallback, failureCallback = defaultFailure) => {
    try {
      const {
        data: {success, message}
      } = await axios.post("api/updateUserRole.php", {
        courseId,
        userEmail: email,
        roleId
      });
      if (success) {
        set(peopleAtomByCourseId(courseId), (prev) => {
          const next = prev.slice(0);
          const idx = prev.findIndex(({email: candidate}) => candidate === email);
          next[idx] = {...prev[idx], roleId};
          return next;
        });
        successCallback();
      } else {
        throw new Error(message);
      }
    } catch (err) {
      failureCallback(err.message);
    }
  });
  const modifyRolePermissions = useRecoilCallback(({set}) => async (roleId, newPermissions, successCallback, failureCallback = defaultFailure) => {
    try {
      const {
        data: {
          success,
          message,
          actionType,
          roleId: serverRoleId,
          updatedPermissions
        }
      } = await axios.post("/api/updateRolePermissons.php", {
        courseId,
        roleId,
        permissions: {...newPermissions, label: newPermissions?.roleLabel}
      });
      if (success) {
        set(unfilteredCourseRolesByCourseId(courseId), (prev) => {
          const next = [...prev];
          const idx = prev.findIndex(({roleId: candidateRoleId}) => candidateRoleId === serverRoleId);
          let {label: roleLabel} = updatedPermissions;
          if (roleLabel === void 0)
            roleLabel = prev[idx].roleLabel;
          switch (actionType) {
            case "add":
              next.push({...updatedPermissions, roleLabel, roleId: serverRoleId});
              break;
            case "update":
              next.splice(idx, 1, {...prev[idx], ...updatedPermissions, roleLabel});
              break;
            case "delete":
              next.splice(idx, 1);
              break;
          }
          return next;
        });
        successCallback();
      } else {
        throw new Error(message);
      }
    } catch (err) {
      failureCallback(err.message);
    }
  }, [courseId, defaultFailure]);
  const deleteCourse = useRecoilCallback(({set}) => async (successCallback, failureCallback = defaultFailure) => {
    try {
      let resp = await axios.post("/api/deleteCourse.php", {courseId});
      if (resp.status < 300) {
        set(coursePermissionsAndSettings, (prev) => prev.filter((c) => c.courseId !== courseId));
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err.message);
    }
  }, [courseId, defaultFailure]);
  const renameItem = useRecoilCallback(({snapshot, set}) => async (doenetId, newLabel, successCallback, failureCallback = defaultFailure) => {
    try {
      let cutObjs = await snapshot.getPromise(cutCourseItems);
      for (let cutObj of cutObjs) {
        set(itemByDoenetId(cutObj.doenetId), (prev) => {
          let next = {...prev};
          next["isBeingCut"] = false;
          return next;
        });
      }
      set(cutCourseItems, []);
      set(copiedCourseItems, []);
      let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
      let resp = await axios.get("/api/renameCourseItem.php", {params: {courseId, doenetId, newLabel, type: itemObj.type}});
      if (resp.status < 300) {
        let updatedItem = resp.data.item;
        if (itemObj.type !== "page") {
          updatedItem.isOpen = itemObj.isOpen;
        }
        set(itemByDoenetId(doenetId), (prev) => {
          let next = {...prev};
          next.label = updatedItem.label;
          return next;
        });
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err.message);
    }
  }, [courseId, defaultFailure]);
  const updateAssignItem = useRecoilCallback(({set}) => async ({doenetId, isAssigned, successCallback, failureCallback = defaultFailure}) => {
    try {
      let resp = await axios.get("/api/updateIsAssignedOnAnItem.php", {params: {courseId, doenetId, isAssigned}});
      if (resp.status < 300) {
        set(itemByDoenetId(doenetId), (prev) => {
          let next = {...prev};
          next.isAssigned = isAssigned;
          return next;
        });
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err.message);
    }
  }, [courseId, defaultFailure]);
  const compileActivity = useRecoilCallback(({set, snapshot}) => async ({activityDoenetId, successCallback, isAssigned = false, courseId: courseId2, failureCallback = defaultFailure}) => {
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
      set(fileByCid(pageCid), pageDoenetML);
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
      childrenString = (await Promise.all(activity.content.map((x) => contentToDoenetML({content: x, indentLevel: 1})))).join("");
    } catch (err) {
      failureCallback(err.message);
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
        set(itemByDoenetId(activityDoenetId), (prev) => {
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
      failureCallback(err.message);
    }
  });
  function updateOrder({content, needleDoenetId, changesObj}) {
    let nextContent = [...content];
    for (let [i, item] of Object.entries(content)) {
      if (item?.type == "order") {
        if (needleDoenetId == item.doenetId) {
          let nextItemObj = {...item};
          Object.assign(nextItemObj, changesObj);
          nextContent.splice(i, 1, nextItemObj);
          return nextContent;
        }
        let childContent = updateOrder({content: item.content, needleDoenetId, changesObj});
        if (childContent != null) {
          let nextOrderObj = {...item};
          nextOrderObj.content = childContent;
          nextContent.splice(i, 1, nextOrderObj);
          return nextContent;
        }
      }
    }
    return null;
  }
  function deletePageFromActivity({content, needleDoenetId}) {
    let nextContent = [...content];
    let index = null;
    for (let [i, item] of Object.entries(content)) {
      if (item?.type == "order") {
        let childContent = deletePageFromActivity({content: item.content, needleDoenetId});
        if (childContent != null) {
          let childOrderObj = {...item};
          childOrderObj.content = childContent;
          nextContent.splice(i, 1, childOrderObj);
          return nextContent;
        }
      } else if (needleDoenetId == item) {
        index = i;
        break;
      }
    }
    if (index != null) {
      nextContent.splice(index, 1);
      return nextContent;
    }
    return null;
  }
  function deleteOrderFromContent({content, needleDoenetId}) {
    let nextContent = [...content];
    let index = null;
    for (let [i, item] of Object.entries(content)) {
      if (item?.type == "order") {
        if (needleDoenetId == item.doenetId) {
          index = i;
          break;
        }
        let childContent = deleteOrderFromContent({content: item.content, needleDoenetId});
        if (childContent != null) {
          let nextOrder = {...item};
          nextOrder.content = [...childContent];
          nextContent.splice(i, 1, nextOrder);
          return nextContent;
        }
      }
    }
    if (index != null) {
      nextContent.splice(index, 1);
      return nextContent;
    }
    return null;
  }
  function findOrderIdsInAnOrder({content, needleOrderDoenetId, foundNeedle = false}) {
    let orderDoenetIds = [];
    for (let item of content) {
      if (item?.type == "order") {
        let moreOrderIds;
        if (foundNeedle || item.doenetId == needleOrderDoenetId) {
          orderDoenetIds.push(item.doenetId);
          moreOrderIds = findOrderIdsInAnOrder({content: item.content, needleOrderDoenetId, foundNeedle: true});
        } else {
          moreOrderIds = findOrderIdsInAnOrder({content: item.content, needleOrderDoenetId, foundNeedle});
        }
        orderDoenetIds = [...orderDoenetIds, ...moreOrderIds];
      }
    }
    return orderDoenetIds;
  }
  const updateOrderBehavior = useRecoilCallback(({set, snapshot}) => async ({doenetId, behavior, numberToSelect, withReplacement, successCallback, failureCallback = defaultFailure}) => {
    let orderObj = await snapshot.getPromise(itemByDoenetId(doenetId));
    let activityObj = await snapshot.getPromise(itemByDoenetId(orderObj.containingDoenetId));
    let changesObj = {behavior, numberToSelect, withReplacement};
    let newJSON = updateOrder({content: activityObj.content, needleDoenetId: doenetId, changesObj});
    let {data} = await axios.post("/api/updateActivityStructure.php", {
      courseId,
      doenetId: orderObj.containingDoenetId,
      newJSON
    });
    let nextActivityObj = {...activityObj};
    nextActivityObj.content = newJSON;
    set(itemByDoenetId(orderObj.containingDoenetId), nextActivityObj);
    set(itemByDoenetId(doenetId), (prev) => {
      let next = {...prev};
      next.behavior = behavior;
      next.numberToSelect = numberToSelect;
      next.withReplacement = withReplacement;
      return next;
    });
  });
  const deleteItem = useRecoilCallback(({set, snapshot}) => async ({doenetId, successCallback, failureCallback = defaultFailure}) => {
    let itemToDeleteObj = await snapshot.getPromise(itemByDoenetId(doenetId));
    console.log(">>deleteItem itemToDeleteObj", itemToDeleteObj);
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
        let nextContent = deletePageFromActivity({content: containingObj.content, needleDoenetId: doenetId});
        activitiesJson.push(nextContent);
        activitiesJsonDoenetIds.push(containingObj.doenetId);
        pagesDoenetIds.push(doenetId);
      }
    } else if (itemToDeleteObj.type == "order") {
      let containingObj = await snapshot.getPromise(itemByDoenetId(itemToDeleteObj.containingDoenetId));
      pagesDoenetIds = findPageDoenetIdsInAnOrder({content: containingObj.content, needleOrderDoenetId: itemToDeleteObj.doenetId});
      orderDoenetIds = findOrderIdsInAnOrder({content: containingObj.content, needleOrderDoenetId: doenetId});
      let nextOrder = deleteOrderFromContent({content: containingObj.content, needleDoenetId: doenetId});
      activitiesJson.push(nextOrder);
      activitiesJsonDoenetIds.push(containingObj.doenetId);
    } else if (itemToDeleteObj.type == "bank") {
      baseCollectionsDoenetIds.push(doenetId);
      pagesDoenetIds = itemToDeleteObj.pages;
    } else if (itemToDeleteObj.type == "activity") {
      let content = itemToDeleteObj.content;
      pagesDoenetIds = findPageIdsInContentArray({content, needleOrderDoenetId: null, foundNeedle: true});
      orderDoenetIds = findOrderIdsInAnOrder({content, needleOrderDoenetId: null, foundNeedle: true});
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
        console.log("data", resp.data);
        let {success, message} = resp.data;
        for (let [i, collectionDoenetId] of Object.entries(collectionsJsonDoenetIds)) {
          let collectionJson = collectionsJson[i];
          set(itemByDoenetId(collectionDoenetId), (prev) => {
            let next = {...prev};
            next.pages = collectionJson;
            return next;
          });
        }
        for (let [i, activitiesJsonDoenetId] of Object.entries(activitiesJsonDoenetIds)) {
          let activityJson = activitiesJson[i];
          set(itemByDoenetId(activitiesJsonDoenetId), (prev) => {
            let next = {...prev};
            next.content = activityJson;
            return next;
          });
        }
        set(authorCourseItemOrderByCourseId(courseId), (prev) => {
          let next = [...prev];
          for (let pagesDoenetId of pagesDoenetIds) {
            let index = next.indexOf(pagesDoenetId);
            if (index != -1) {
              next.splice(index, 1);
            }
          }
          for (let orderDoenetId of orderDoenetIds) {
            let index = next.indexOf(orderDoenetId);
            if (index != -1) {
              next.splice(index, 1);
            }
          }
          for (let baseCollectionsDoenetId of baseCollectionsDoenetIds) {
            let index = next.indexOf(baseCollectionsDoenetId);
            if (index != -1) {
              next.splice(index, 1);
            }
          }
          for (let baseActivitiesDoenetId of baseActivitiesDoenetIds) {
            let index = next.indexOf(baseActivitiesDoenetId);
            if (index != -1) {
              next.splice(index, 1);
            }
          }
          for (let baseSectionsDoenetId of baseSectionsDoenetIds) {
            let index = next.indexOf(baseSectionsDoenetId);
            if (index != -1) {
              next.splice(index, 1);
            }
          }
          return next;
        });
        let selectedDoenentIds = await snapshot.getPromise(selectedCourseItems);
        for (let doenetId2 of selectedDoenentIds) {
          set(itemByDoenetId(doenetId2), (prev) => {
            let next = {...prev};
            next.isSelected = false;
            return next;
          });
        }
        set(selectedCourseItems, []);
        set(selectedMenuPanelAtom, "");
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err.message);
    }
  });
  const copyItems = useRecoilCallback(({set, snapshot}) => async ({successCallback, failureCallback = defaultFailure}) => {
    let selectedDoenetIds = await snapshot.getPromise(selectedCourseItems);
    let copiedCourseItemsObjs = [];
    for (let selectedDoenetId of selectedDoenetIds) {
      let selectedObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetId));
      copiedCourseItemsObjs.push(selectedObj);
    }
    set(copiedCourseItems, copiedCourseItemsObjs);
    let cutObjs = await snapshot.getPromise(cutCourseItems);
    for (let cutObj of cutObjs) {
      set(itemByDoenetId(cutObj.doenetId), (prev) => {
        let next = {...prev};
        next["isBeingCut"] = false;
        return next;
      });
    }
    set(cutCourseItems, []);
    successCallback();
  });
  const cutItems = useRecoilCallback(({set, snapshot}) => async ({successCallback, failureCallback = defaultFailure}) => {
    let cutObjs = await snapshot.getPromise(cutCourseItems);
    for (let cutObj of cutObjs) {
      set(itemByDoenetId(cutObj.doenetId), (prev) => {
        let next = {...prev};
        next["isBeingCut"] = false;
        return next;
      });
    }
    set(cutCourseItems, []);
    let selectedDoenetIds = await snapshot.getPromise(selectedCourseItems);
    let cutCourseItemsObjs = [];
    for (let selectedDoenetId of selectedDoenetIds) {
      let selectedObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetId));
      cutCourseItemsObjs.push(selectedObj);
      let nextItem = {...selectedObj};
      nextItem["isBeingCut"] = true;
      set(itemByDoenetId(selectedDoenetId), nextItem);
    }
    set(cutCourseItems, cutCourseItemsObjs);
    successCallback();
  });
  const pasteItems = useRecoilCallback(({set, snapshot}) => async ({successCallback, failureCallback = defaultFailure}) => {
    async function getIds(doenetId, itemObj = null) {
      let allIds = [doenetId];
      if (!itemObj) {
        itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
      }
      if (itemObj.type == "order" || itemObj.type == "activity" && !itemObj.isSinglePage) {
        let orderIds = [];
        for (let id of itemObj.content) {
          if (id?.type == "order") {
            let subOrderIds = await getIds(itemObj.doenetId, id);
            orderIds = [...orderIds, id.doenetId, ...subOrderIds];
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
      if (!destPreviousItemDoenetId) {
        destPreviousItemDoenetId = sectionId;
      }
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
      let sourcePagesAndOrdersForTesting = [];
      let ancestorsDoenetIds = [];
      if (destinationContainingObj) {
        ancestorsDoenetIds = await getAncestors(destinationContainingObj.doenetId);
      }
      let cuttingContaingItemFLAG = false;
      for (let cutObj of cutObjs) {
        if (cutObj.type == "activity" || cutObj.type == "bank" || cutObj.type == "section") {
          cuttingContaingItemFLAG = true;
          break;
        }
      }
      for (let cutObj of cutObjs) {
        if (destType == "section" && (cutObj.type == "page" || cutObj.type == "order") && !cuttingContaingItemFLAG) {
          failureCallback(`Pasting ${cutObj.type} in a section is not supported.`);
          return;
        }
        if (cutObj.type == "order" && !cuttingContaingItemFLAG) {
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
        if ((cutObj.type == "order" || cutObj.type == "page") && !cuttingContaingItemFLAG) {
          sourcePagesAndOrdersToMove.push({...cutObj});
        }
        if (cutObj.type == "order" || cutObj.type == "page") {
          sourcePagesAndOrdersForTesting.push({...cutObj});
        }
      }
      if (sourcePagesAndOrdersForTesting.length > 0 && cuttingContaingItemFLAG) {
        let acceptableOrderandPageIds = [];
        for (let doenetId of doenetIdsToMove) {
          let acceptableIds = await getIds(doenetId);
          acceptableOrderandPageIds = [...acceptableOrderandPageIds, ...acceptableIds];
        }
        for (let testObj of sourcePagesAndOrdersForTesting) {
          if (!acceptableOrderandPageIds.includes(testObj.doenetId)) {
            failureCallback("Can't paste pages or orders with other types.");
            return;
          }
        }
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
            for (let cutObj of cutObjs) {
              set(itemByDoenetId(cutObj.doenetId), (prevObj) => {
                let nextObj = {...prevObj};
                nextObj["isBeingCut"] = false;
                nextObj["isSelected"] = false;
                return nextObj;
              });
            }
            for (let doenetId of doenetIdsToMove) {
              if (!noParentUpdateDoenetIds.includes(doenetId)) {
                set(itemByDoenetId(doenetId), (prevObj) => {
                  let nextObj = {...prevObj};
                  nextObj.parentDoenetId = destParentDoenetId;
                  return nextObj;
                });
              }
            }
            let sortedDoenetIdsToMove = [];
            for (let doenetId of doenetIdsToMove) {
              let associatedIds = await getIds(doenetId);
              sortedDoenetIdsToMove = [...sortedDoenetIdsToMove, ...associatedIds];
            }
            sortedDoenetIdsToMove = [...new Set(sortedDoenetIdsToMove)];
            set(authorCourseItemOrderByCourseId(courseId), (prevObj) => {
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
          failureCallback(err.message);
        }
      }
      if (sourcePagesAndOrdersToMove.length > 0) {
        let destinationType = destinationContainingObj.type;
        let destinationDoenetId = destinationContainingObj.doenetId;
        let destinationJSON;
        let destinationWasASinglePageActivity = false;
        let destinationWasSinglePagesPageId;
        if (destinationType == "bank") {
          destinationJSON = [...destinationContainingObj.pages];
        } else if (destinationType == "activity") {
          destinationJSON = [...destinationContainingObj.content];
        }
        if (destinationContainingObj.isSinglePage) {
          destinationWasASinglePageActivity = true;
          destinationWasSinglePagesPageId = destinationContainingObj.content[0];
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
              updatedSourceItemJSON = deletePageFromActivity({content: containingObj.content, needleDoenetId: cutObj.doenetId});
              if (destinationContainingObj.doenetId == containingObj.doenetId) {
                destinationJSON = deletePageFromActivity({content: destinationJSON, needleDoenetId: cutObj.doenetId});
                destinationContainingObj.content = destinationJSON;
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
              updatedSourceItemJSON = deletePageFromActivity({content: previousObj, needleDoenetId: cutObj.doenetId});
              if (destinationContainingObj.doenetId == cutObj.containingDoenetId) {
                destinationJSON = deletePageFromActivity({content: destinationJSON, needleDoenetId: cutObj.doenetId});
                destinationContainingObj.content = destinationJSON;
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
        }
        for (let cutObj of sourcePagesAndOrdersToMove) {
          if (destinationType == "bank") {
            destinationJSON.push(cutObj.doenetId);
          } else if (destinationType == "activity") {
            let orderIdOrActivityIdToAddTo = singleSelectedObj.doenetId;
            if (singleSelectedObj.type == "page") {
              orderIdOrActivityIdToAddTo = singleSelectedObj.parentDoenetId;
            }
            let previousPreviousDoenetId = previousDoenetId;
            ({content: destinationJSON, previousDoenetId} = addPageToActivity({
              activityOrOrderObj: destinationContainingObj,
              needleOrderOrActivityId: orderIdOrActivityIdToAddTo,
              itemToAdd: cutObj.doenetId
            }));
            destinationContainingObj.content = destinationJSON;
            if (previousPreviousDoenetId) {
              previousDoenetId = previousPreviousDoenetId;
            }
            if (destinationWasASinglePageActivity) {
              previousDoenetId = destinationDoenetId;
            }
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
            if (collectionObj.type == "bank") {
              if (collectionObj.pages.length == 0) {
                previousDoenetIdForPages = collectionObj.doenetId;
              } else {
                previousDoenetIdForPages = collectionObj.pages[collectionObj.pages.length - 1];
              }
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
            destinationJSON,
            destinationWasASinglePageActivity
          });
          if (resp.status < 300) {
            let nextPagesParentDoenetId;
            if (singleSelectedObj.type == "order" || singleSelectedObj.type == "bank" || singleSelectedObj.type == "activity") {
              nextPagesParentDoenetId = singleSelectedObj.doenetId;
            } else if (singleSelectedObj.type == "page") {
              nextPagesParentDoenetId = singleSelectedObj.parentDoenetId;
            }
            let setOfOriginalPageDoenetIds = [];
            for (let [i, sourceType] of Object.entries(sourceTypes)) {
              let sourceDoenetId = sourceDoenetIds[i];
              let sourceJSON = sourceJSONs[i];
              for (let originalPageDoenetId of originalPageDoenetIds[i]) {
                setOfOriginalPageDoenetIds.push(originalPageDoenetId);
                set(itemByDoenetId(originalPageDoenetId), (prev) => {
                  let next = {...prev};
                  next.containingDoenetId = destinationDoenetId;
                  next.parentDoenetId = nextPagesParentDoenetId;
                  next.isBeingCut = false;
                  return next;
                });
              }
              if (sourceDoenetId == destinationDoenetId) {
                continue;
              }
              if (sourceType == "bank") {
                set(itemByDoenetId(sourceDoenetId), (prev) => {
                  let next = {...prev};
                  next.pages = sourceJSON;
                  return next;
                });
              } else if (sourceType == "activity") {
                set(itemByDoenetId(sourceDoenetId), (prev) => {
                  let next = {...prev};
                  next.content = sourceJSON;
                  return next;
                });
              }
            }
            if (destinationType == "bank") {
              set(itemByDoenetId(destinationDoenetId), (prev) => {
                let next = {...prev};
                next.pages = destinationJSON;
                return next;
              });
            } else if (destinationType == "activity") {
              set(itemByDoenetId(destinationDoenetId), (prev) => {
                let next = {...prev};
                next.content = destinationJSON;
                if (destinationWasASinglePageActivity) {
                  next.isSinglePage = false;
                }
                return next;
              });
            }
            set(authorCourseItemOrderByCourseId(courseId), (prev) => {
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
              if (destinationWasASinglePageActivity) {
                next.splice(insertIndex, 0, destinationWasSinglePagesPageId, ...setOfOriginalPageDoenetIds);
              } else {
                next.splice(insertIndex, 0, ...setOfOriginalPageDoenetIds);
              }
              return next;
            });
            successCallback?.();
          } else {
            throw new Error(`response code: ${resp.status}`);
          }
        } catch (err) {
          failureCallback(err.message);
        }
      }
      set(copiedCourseItems, [...cutObjs]);
      set(cutCourseItems, []);
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
    label,
    color,
    image,
    defaultRoleId,
    create,
    deleteItem,
    deleteCourse,
    modifyCourse,
    modifyRolePermissions,
    renameItem,
    compileActivity,
    updateAssignItem,
    updateOrderBehavior,
    copyItems,
    cutItems,
    pasteItems,
    findPagesFromDoenetIds,
    addUser,
    modifyUserRole
  };
};
