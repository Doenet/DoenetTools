import axios from 'axios';
import { useEffect, useCallback } from 'react';
import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil';
import { useToast, toastType } from '../../Tools/_framework/Toast';

export function useInitCourseItems(courseId) {
  const getDataAndSetRecoil = useRecoilCallback(
    ({ set }) =>
      async (courseId) => {
        const { data } = await axios.get('/api/getCourseItems.php', {
          params: { courseId },
        });
        //DoenetIds depth first search without going into json structures
        let doenetIds = data.items.map((item)=>item.doenetId)
        set(authorCourseItemOrderByCourseId(courseId), doenetIds);
        //Add all items to authorItemByDoenetId
        data.items.map((item) => {
          set(authorItemByDoenetId(item.doenetId), item);
          //add orders to recoil if activity
          function findOrderDoenetIds(orderObj){
            let orderDoenetIds = [];
            //TODO: Guard for no order here
            orderDoenetIds.push(orderObj.doenetId);
            for (let orderItem of orderObj.content){
              if (orderItem?.type == 'order'){
                let moreOrderDoenetIds = findOrderDoenetIds(orderItem);
                orderDoenetIds = [...orderDoenetIds,...moreOrderDoenetIds];
              }
            }
            return orderDoenetIds;
          }
          //Special processing for orders
          if (item.type == 'activity'){
            let orderDoenetIds = findOrderDoenetIds(item.order);
            for (let orderDoenetId of orderDoenetIds){
                set(authorItemByDoenetId(orderDoenetId), {
                  doenetId: orderDoenetId, 
                  containerDoenetId:item.doenetId,
                  isOpen:false,
                  isSelected:false,
                });
            }
          }
        });
      },
    [],
  );

  useEffect(() => {
    if (courseId) {
      getDataAndSetRecoil(courseId);
    }
  }, [getDataAndSetRecoil, courseId]);
}

export const authorCourseItemOrderByCourseId = atomFamily({
  key: 'authorCourseItemOrderByCourseId',
  default: [],
});

export const authorItemByDoenetId = atomFamily({
  key: 'authorItemByDoenetId',
  default: {},
  // effects: (doenetId) => [
  //   ({ setSelf, onSet, trigger }) => {
  //     if (trigger === 'get') {
  //       console.log("get itemInfoByDoenetId",doenetId);
  //       // try {
  //       //   const { data } = axios.get('/api/loadCourseOrderData', {
  //       //     params: { courseId },
  //       //   });
  //       //   //sort
  //       //   let sorted = [];
  //       //   let lookup = {};
  //       //   setSelf({ completeOrder: sorted, orderingDataLookup: lookup });
  //       // } catch (e) {}
  //     }
  //     // onSet((newObj, was) => {
  //     //   console.log('newObj',newObj)
  //     //   console.log('was',was)

  //     // });
  //   },
  // ],
});

export const coursePermissionsAndSettings = atom({
  key: 'coursePermissionsAndSettings',
  default: [],
  effects: [
    async ({ setSelf, trigger }) => {
      if (trigger === 'get') {
        const { data } = await axios.get(
          '/api/getCoursePermissionsAndSettings.php',
        );
        setSelf(data.permissionsAndSettings);
      }
    },
  ],
});

export const coursePermissionsAndSettingsByCourseId = selectorFamily({
  key: 'coursePermissionsAndSettingsByCourseId/Default',
  get:
    (courseId) =>
    ({ get }) => {
      let allpermissionsAndSettings = get(coursePermissionsAndSettings);
      return (
        allpermissionsAndSettings.find((value) => value.courseId == courseId) ??
        {}
      );
    },
  set:
    (courseId) =>
    ({ set }, modifcations) => {
      set(coursePermissionsAndSettings, (prev) => {
        const next = [...prev];
        const modificationIndex = prev.findIndex(
          (course) => course.courseId === courseId,
        );
        next[modificationIndex] = {
          ...prev[modificationIndex],
          ...modifcations,
        };
        return next;
      });
    },
});

export const useCreateCourse = () => {
  const createCourse = useRecoilCallback(({ set }) => async () => {
    let {
      data: {
        permissionsAndSettings,
        courseId,
        image,
        color,
        ...remainingData
      },
    } = await axios.get('/api/createCourse.php');
    console.log('createCourse data', {
      permissionsAndSettings,
      courseId,
      image,
      color,
      ...remainingData,
    });

    set(coursePermissionsAndSettings, permissionsAndSettings);
    // set(courseInfoByCourseId(courseId), { courseId, image, color });
  });

  return { createCourse };
};

const itemInfoByDoenetId = atomFamily({
  key: 'itemDataByDoenetId',
  default: null,
  effects: (doenetId) => [
    ({ setSelf, onSet, trigger }) => {
      if (trigger === 'get') {
        console.log('get itemInfoByDoenetId', doenetId);
        // try {
        //   const { data } = axios.get('/api/loadCourseOrderData', {
        //     params: { courseId },
        //   });
        //   //sort
        //   let sorted = [];
        //   let lookup = {};
        //   setSelf({ completeOrder: sorted, orderingDataLookup: lookup });
        // } catch (e) {}
      }
      // onSet((newObj, was) => {
      //   console.log('newObj',newObj)
      //   console.log('was',was)

      // });
    },
  ],
});

export const courseOrderDataByCourseId = atomFamily({
  key: 'courseOrderDataByCourseId',
  default: { completeOrder: [], orderingDataLookup: {} },
  effects: (courseId) => [
    ({ setSelf, onSet, trigger }) => {
      if (trigger === 'get') {
        console.log('GET courseOrderDataByCourseId');
        // try {
        //   const { data } = axios.get('/api/loadCourseItems.php', {
        //     params: { courseId },
        //   });
        //   //sort
        //   let sorted = [];
        //   let lookup = {};
        //   setSelf({ completeOrder: sorted, orderingDataLookup: lookup });
        // } catch (e) {}
      }

      onSet(({ completeOrder: newOrder }, was) => {
        // console.log("courseOrderDataByCourseId",newOrder);
        //TODO: create orderingDataLookup
      });
    },
  ],
});

export const selectedCourseItems = atom({
  key: 'selectedCourseItems',
  default: [],
});

// // type ItemType = 'Activity' | 'Section' | 'Page';

export const useCourse = (courseId) => {
  const { label, color, image } = useRecoilValue(
    coursePermissionsAndSettingsByCourseId(courseId),
  );
  const addToast = useToast();

  const create = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ itemType, placeInFolderFlag, previousDoenetId }) => {

        let authorItemDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId));
        let newAuthorItemDoenetIds = [...authorItemDoenetIds];

        //TODO: define these by selection if not defined from socket
        if (placeInFolderFlag === undefined){
          placeInFolderFlag = false;
        }
        if (previousDoenetId === undefined){
          previousDoenetId = courseId;
        }

        let newDoenetId;
        let coursePermissionsAndSettings = await snapshot.getPromise(
          coursePermissionsAndSettingsByCourseId(courseId),
        );
        if (coursePermissionsAndSettings.canEditContent != '1') {
          //TODO: set up toast message here
          return null;
        }
        //Get selection information to know previous doenetId by order
        if (itemType == 'activity') {

          let { data } = await axios.get('/api/createCourseItem.php', {
            params: {
              previousDoenetId,
              courseId,
              itemType,
              placeInFolderFlag,
            },
          });
          // console.log('activityData', data);
          newDoenetId = data.doenetId;
          set(authorItemByDoenetId(data.doenetId), data.itemEntered);
          set(authorItemByDoenetId(data.pageDoenetId), data.pageEntered);
          //Find index of previousDoenetId and insert the new item's doenetId right after
          let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
          if (indexOfPrevious == -1){
            //Place new item at the end as the prevousDoenetId isn't visible
            newAuthorItemDoenetIds.push(data.doenetId);
          }else{
            //insert right after the index
            newAuthorItemDoenetIds.splice(indexOfPrevious+1,0,data.doenetId)
          }
          set(authorCourseItemOrderByCourseId(courseId), newAuthorItemDoenetIds);
          //TODO: eliminate data.order on create
        } else if (itemType == 'bank') {
          let { data } = await axios.get('/api/createCourseItem.php', {
            params: {
              previousDoenetId,
              courseId,
              itemType,
              placeInFolderFlag,
            },
          });
          console.log('bankData', data);
          newDoenetId = data.doenetId;
          set(authorItemByDoenetId(data.doenetId), data.itemEntered);
          //Find index of previousDoenetId and insert the new item's doenetId right after
          let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
          if (indexOfPrevious == -1){
            //Place new item at the end as the prevousDoenetId isn't visible
            newAuthorItemDoenetIds.push(data.doenetId);
          }else{
            //insert right after the index
            newAuthorItemDoenetIds.splice(indexOfPrevious+1,0,data.doenetId)
          }
          set(authorCourseItemOrderByCourseId(courseId), newAuthorItemDoenetIds);
        } else if (itemType == 'section') {
          let { data } = await axios.get('/api/createCourseItem.php', {
            params: {
              previousDoenetId,
              courseId,
              itemType,
              placeInFolderFlag,
            },
          });
          // console.log("sectionData",data)
          newDoenetId = data.doenetId;
          set(authorItemByDoenetId(data.doenetId), data.itemEntered);
          //Find index of previousDoenetId and insert the new item's doenetId right after
          let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
          if (indexOfPrevious == -1){
            //Place new item at the end as the prevousDoenetId isn't visible
            newAuthorItemDoenetIds.push(data.doenetId);
          }else{
            //insert right after the index
            newAuthorItemDoenetIds.splice(indexOfPrevious+1,0,data.doenetId)
          }
          set(authorCourseItemOrderByCourseId(courseId), newAuthorItemDoenetIds);
        } else if (itemType == 'page') {
          console.log('page');
        }
        return newDoenetId;
      },
  );

  const defaultFailure = useCallback(
    (err) => {
      addToast(`${err}`, toastType.ERROR);
    },
    [addToast],
  );

  const modifyCourse = useRecoilCallback(
    ({ set }) =>
      async (
        modifications,
        successCallback,
        failureCallback = defaultFailure,
      ) => {
        try {
          let resp = await axios.post('/api/modifyCourse.php', {
            courseId,
            ...modifications,
          });
          if (resp.status < 300) {
            set(
              coursePermissionsAndSettingsByCourseId(courseId),
              ({ prev }) => ({ ...prev, ...modifications }),
            );
            successCallback?.();
          } else {
            throw new Error(`response code: ${resp.status}`);
          }
        } catch (err) {
          failureCallback(err);
        }
      },
  );

  const deleteCourse = useRecoilCallback(
    ({ set }) =>
      async (successCallback, failureCallback = defaultFailure) => {
        try {
          let resp = await axios.post('/api/deleteCourse.php', { courseId });
          if (resp.status < 300) {
            set(coursePermissionsAndSettings, (prev) =>
              prev.filter((c) => c.courseId !== courseId),
            );
            successCallback?.();
          } else {
            throw new Error(`response code: ${resp.status}`);
          }
        } catch (err) {
          failureCallback(err);
        }
      },
    [courseId, defaultFailure],
  );

  return { create, deleteCourse, modifyCourse, label, color, image };
};
