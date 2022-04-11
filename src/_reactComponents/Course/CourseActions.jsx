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
     ({ snapshot,set }) =>
     async (courseId) => {
       let pageDoenetIdToParentDoenetId = {};
       //Recursive Function for order
       function findOrderAndPageDoenetIds(orderObj,assignmentDoenetId,parentDoenetId){
          let orderAndPagesDoenetIds = [];
          //Guard for when there is no order
          if (orderObj){
            //Store order objects for UI
            set(authorItemByDoenetId(orderObj.doenetId), {
              type: "order",
              doenetId: orderObj.doenetId, 
              containingDoenetId:assignmentDoenetId,
              isOpen:false,
              isSelected:false,
              parentDoenetId
            });
            orderAndPagesDoenetIds.push(orderObj.doenetId);
            for (let orderItem of orderObj.content){
              if (orderItem?.type == 'order'){
                let moreOrderDoenetIds = findOrderAndPageDoenetIds(orderItem,assignmentDoenetId,orderItem.doenetId);
                orderAndPagesDoenetIds = [...orderAndPagesDoenetIds,...moreOrderDoenetIds];
              }else{
                //Page 
                pageDoenetIdToParentDoenetId[orderItem] = orderObj.doenetId;
                orderAndPagesDoenetIds = [...orderAndPagesDoenetIds,orderItem];
              }
            }
          }
          return orderAndPagesDoenetIds;
        }

        //Only ask the server for course if we haven't already
        const courseArrayTest = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId));
        if (courseArrayTest.length == 0){
          const { data } = await axios.get('/api/getCourseItems.php', {
            params: { courseId },
          });
          //DoenetIds depth first search and going into json structures
          //TODO: organize by section
          let doenetIds = data.items.reduce((items,item)=>{
            if (item.type !== 'page'){
              items.push(item.doenetId)
            }
            if (item.type === 'activity'){
              let ordersAndPages = findOrderAndPageDoenetIds(item.order,item.doenetId,item.doenetId);
              item['numberOfPageAndOrderDoenetIds'] = ordersAndPages.length;
              items = [...items,...ordersAndPages];
            }else if (item.type === 'bank'){
              items = [...items,...item.pages];
            }else if (item.type === 'page'){
              item['parentDoenetId'] = pageDoenetIdToParentDoenetId[item.doenetId];
            }
            
            //Store activity, bank and page information
            set(authorItemByDoenetId(item.doenetId), item);

            return items
          },[])
          console.log("init authorCourseItemOrderByCourseId",doenetIds)
          set(authorCourseItemOrderByCourseId(courseId), doenetIds);
        }
        
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

//Start at top find the section we are filtering to based on searchparams AtomFamily sectionId
//If empty sectionId then return everything in authorCourseItemOrderByCourseId
//Start collecting parentNames and doenetIds to include for the section
//Stop when we see one of the parentNames
// export const authorCourseItemOrderByCourseIdAndSection = selectorFamily({
//   key: 'authorCourseItemOrderByCourseIdAndSection',
//   default: [],
// });

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

        function addPageToOrder(newJSON,orderDoenetId,newDoenetId){
          console.log("addPageToOrder newJSON",newJSON,orderDoenetId,newDoenetId)
          let insertedAfterDoenetId;
          //TODO: recurse through the content to find the order
          if (newJSON.doenetId == orderDoenetId){
            insertedAfterDoenetId = newJSON.content[newJSON.content.length - 1];
            newJSON.content = [...newJSON.content,newDoenetId];

          }
            return {newJSON,insertedAfterDoenetId};
        }
        function addDoenetIdAfterPageForActivity(newJSON,doenetIdOfPlaceToInsert,newDoenetId){
          // console.log("addDoenetIdAfterPageForActivity newJSON",newJSON,doenetIdOfPlaceToInsert,newDoenetId)
          //TODO: recurse through the content to find the page
          let content = [];
          for (let entry of newJSON.content){
            //TODO if order recurse into that order
            content.push(entry);
            if (doenetIdOfPlaceToInsert == entry){
              content.push(newDoenetId)
            }
          }
          let updateNewJSON = {...newJSON};
          updateNewJSON.content = content;
          
          return updateNewJSON;
        }

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
          console.log('activityData', data);
          let createdActivityDoenentId = data.doenetId;
          newDoenetId = createdActivityDoenentId;
          //Activity
          set(authorItemByDoenetId(createdActivityDoenentId), data.itemEntered); 
          //Order

          let createdOrderDoenetId = data.itemEntered.order.doenetId;
          let createdOrderObj = {
            type:"order",
            doenetId:createdOrderDoenetId,
            parentDoenetId:createdActivityDoenentId,
            isOpen:false,
            isSelected:false,
            containingDoenetId:createdActivityDoenentId
          }
          set(authorItemByDoenetId(createdOrderDoenetId), createdOrderObj); 

          //Page
          let createdPageObj = {
            ...data.pageEntered,
            parentDoenetId:createdOrderDoenetId
          }
          set(authorItemByDoenetId(data.pageDoenetId), createdPageObj); 

          //Find index of previousDoenetId and insert the new item's doenetId right after
          let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
          if (indexOfPrevious == -1){
            //Place new item at the end as the prevousDoenetId isn't visible
            newAuthorItemDoenetIds.push(createdActivityDoenentId,createdOrderDoenetId,createdPageObj.doenetId);
          }else{
            //insert right after the index
            newAuthorItemDoenetIds.splice(indexOfPrevious+1,0,createdActivityDoenentId,createdOrderDoenetId,createdPageObj.doenetId)
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
          // console.log('bankData', data);
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
        } else if (itemType == 'page' || itemType == 'order') {
          //Prepare to make a new page
          let selectedDoenetId = (await snapshot.getPromise(selectedCourseItems))[0];
          const selectedItemObj = await snapshot.getPromise(authorItemByDoenetId(selectedDoenetId));
          let containingDoenetId;
          if (selectedItemObj.type == 'activity' || 
              selectedItemObj.type == 'bank'
          ){
            containingDoenetId = selectedItemObj.doenetId;
          }else if (selectedItemObj.type == 'order' || 
                    selectedItemObj.type == 'page'){
            containingDoenetId = selectedItemObj.containingDoenetId;
          } 
          
          //Create a page.  Get the new page object.
          let { data } = await axios.get('/api/createPageOrOrder.php', {
              params: {
                  courseId,
                  itemType,
                  containingDoenetId,
                },
              });
          console.log("createPageOrOrder Data",data)
          // let pageThatWasCreated = data.pageThatWasCreated;
          let {pageThatWasCreated, orderDoenetIdThatWasCreated} = data;
          console.log("pageThatWasCreated",pageThatWasCreated)
          console.log("orderDoenetIdThatWasCreated",orderDoenetIdThatWasCreated)
          let orderObj = {
            type:"order",
            behavior:"sequence",
            content:[],
            doenetId: orderDoenetIdThatWasCreated,
          }

          //Update the Global Item Order Activity or Collection
          if (selectedItemObj.type == 'activity'){
            console.log("selectedItemObj",selectedItemObj)
            let newJSON = {...selectedItemObj.order};
            let insertedAfterDoenetId = selectedItemObj.order.content[selectedItemObj.order.content.length - 1];
            if (itemType == 'page'){
              newJSON.content = [...selectedItemObj.order.content,pageThatWasCreated.doenetId]
            }else if (itemType == 'order'){
              newJSON.content = [...selectedItemObj.order.content,orderObj]
            }
            let newActivityObj = {...selectedItemObj}
            newActivityObj.order = newJSON;
            let { data } = await axios.post('/api/updateActivityStructure.php', {
                courseId,
                doenetId:newActivityObj.doenetId,
                newJSON,
              });
            // console.log("data",data)
            orderObj['isOpen'] = false;
            orderObj['isSelected'] = false;
            set(authorItemByDoenetId(newActivityObj.doenetId),newActivityObj)
            let newItemDoenetId = orderDoenetIdThatWasCreated;
            if (itemType == 'page'){
              set(authorItemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
              newItemDoenetId = pageThatWasCreated.doenetId;
            }
            console.log("newItemDoenetId",newItemDoenetId)
            set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
              let next = [...prev];
              next.splice(next.indexOf(insertedAfterDoenetId)+1,0,newItemDoenetId);
              console.log("next",next)
              return next;
            });

          }else if (selectedItemObj.type == 'bank'){
            //Can only be an itemType of page (no orders allowed)
            let insertedAfterDoenetId = selectedItemObj.pages[selectedItemObj.pages.length - 1];
            let newJSON = [...selectedItemObj.pages,pageThatWasCreated.doenetId];
            let newCollectionObj = {...selectedItemObj}
            newCollectionObj.pages = newJSON;
       
            let { data } = await axios.post('/api/updateCollectionStructure.php', {
                courseId,
                doenetId:newCollectionObj.doenetId,
                newJSON,
              });
              // console.log("data",data)
           

            set(authorItemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
            set(authorItemByDoenetId(newCollectionObj.doenetId),newCollectionObj)
            set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
              let next = [...prev];
              next.splice(next.indexOf(insertedAfterDoenetId)+1,0,pageThatWasCreated.doenetId);
              return next;
            });
          }else if (selectedItemObj.type == 'order'){
            console.log("ADD TO ORDER")
          //   let orderDoenetId = selectedItemObj.doenetId;
          //   const containingItemObj = await snapshot.getPromise(authorItemByDoenetId(selectedItemObj.containingDoenetId));

          //   let newJSON = {...containingItemObj.order};

          //   let newActivityObj = {...containingItemObj}
          //   let jsonAndInsert = addPageToOrder(newJSON,orderDoenetId,pageThatWasCreated.doenetId)
          //   newJSON = jsonAndInsert['newJSON'];
          //   let insertedAfterDoenetId = jsonAndInsert['insertedAfterDoenetId'];
          //   newActivityObj.order = newJSON;
          //   let { data } = await axios.post('/api/updateActivityStructure.php', {
          //       courseId,
          //       doenetId:newActivityObj.doenetId,
          //       newJSON,
          //     });
          //     console.log("data",data)

          //   set(authorItemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
          //   set(authorItemByDoenetId(newActivityObj.doenetId),newActivityObj)
          //   set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
          //     let next = [...prev];
          //     next.splice(next.indexOf(insertedAfterDoenetId)+1,0,pageThatWasCreated.doenetId);
          //     console.log("next",next)
          //     return next;
          //   });
          }
          // }else if (selectedItemObj.type == 'page'){

          //   const containingItemObj = await snapshot.getPromise(authorItemByDoenetId(selectedItemObj.containingDoenetId));
          //   if (containingItemObj.type == 'bank'){
          //     let insertedAfterDoenetId = selectedItemObj.doenetId;
          //     let newJSON = [];
          //     for (let pageDoenetId of containingItemObj.pages){
          //       newJSON.push(pageDoenetId);
          //       if (pageDoenetId == selectedItemObj.doenetId){
          //         newJSON.push(pageThatWasCreated.doenetId);
          //       }
          //     }
          //   let newCollectionObj = {...containingItemObj}
          //   newCollectionObj.pages = newJSON;
       
          //   let { data } = await axios.post('/api/updateCollectionStructure.php', {
          //       courseId,
          //       doenetId:newCollectionObj.doenetId,
          //       newJSON,
          //     });
          //     // console.log("data",data)
           
              
          //   set(authorItemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
          //   set(authorItemByDoenetId(newCollectionObj.doenetId),newCollectionObj)
          //   set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
          //     let next = [...prev];
          //     next.splice(next.indexOf(insertedAfterDoenetId)+1,0,pageThatWasCreated.doenetId);
          //     return next;
          //   });

          //   }else if (containingItemObj.type == 'activity'){
          //     let insertedAfterDoenetId = selectedItemObj.doenetId;

          //   let newJSON = {...containingItemObj.order};

          //   let newActivityObj = {...containingItemObj}
          //   newJSON = addDoenetIdAfterPageForActivity(newJSON,insertedAfterDoenetId,pageThatWasCreated.doenetId)
          //   newActivityObj.order = newJSON;
          //   // console.log("newJSON",newJSON)
          //   // console.log("newActivityObj",newActivityObj)
          //   let { data } = await axios.post('/api/updateActivityStructure.php', {
          //       courseId,
          //       doenetId:newActivityObj.doenetId,
          //       newJSON,
          //     });
          //   //   console.log("data",data)

          //   set(authorItemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
          //   set(authorItemByDoenetId(newActivityObj.doenetId),newActivityObj)
          //   set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
          //     let next = [...prev];
          //     next.splice(next.indexOf(insertedAfterDoenetId)+1,0,pageThatWasCreated.doenetId);
          //     return next;
          //   });
          //   }
          // }
        
          // // console.log("updatedContainingObj",updatedContainingObj)


           
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

  const renameItem = useRecoilCallback( ({ snapshot,set }) =>
  async (doenetId,newLabel, successCallback, failureCallback = defaultFailure) => {
    try {
      let itemObj = await snapshot.getPromise(authorItemByDoenetId(doenetId))
      let resp = await axios.get('/api/renameCourseItem.php', {params:{ courseId,doenetId,newLabel,type:itemObj.type } });
      if (resp.status < 300) {
        let updatedItem = resp.data.item;
        if (itemObj.type !== 'page'){
          updatedItem.isOpen = itemObj.isOpen;
        }
        updatedItem.isSelected = itemObj.isSelected;
        set(authorItemByDoenetId(doenetId),updatedItem);
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

  return { create, deleteCourse, modifyCourse, label, color, image, renameItem };
};
