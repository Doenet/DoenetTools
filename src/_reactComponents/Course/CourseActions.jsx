import axios from 'axios';
import { useEffect, useCallback } from 'react';
import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { searchParamAtomFamily } from '../../Tools/_framework/NewToolRoot';
import { selectedMenuPanelAtom } from '../../Tools/_framework/Panels/NewMenuPanel';
import { useToast, toastType } from '../../Tools/_framework/Toast';
import { fileByDoenetId, fileByCid } from '../../Tools/_framework/ToolHandlers/CourseToolHandler';
import { UTCDateStringToDate } from '../../_utils/dateUtilityFunction';

const enrollmentAtomByCourseId = atomFamily({
  key:"enrollmentAtomByCourseId",
  default:[],
  effects:courseId => [ ({setSelf, trigger})=>{
    if (trigger == 'get'){
      axios.get('/api/getEnrollment.php', { params: { courseId } })
      .then(resp=>{
        setSelf(resp.data.enrollmentArray)
      })
    } 
  },
  ]
})

export const enrollmentByCourseId = selectorFamily({
  key:"enrollmentByCourseId",
  get:(courseId)=>({get,getCallback})=>{
    const recoilWithdraw = getCallback(({set})=> async (email)=>{
        let payload = {
         email,
         courseId,
        };
  
        try {
          let resp = await axios.post('/api/withDrawStudents.php', payload);
          // console.log("resp",resp.data)
          if (resp.status < 300) {
            set(enrollmentAtomByCourseId(courseId),
          ( prev ) => {
              let next = [...prev];
              const indexOfStudent = next.findIndex((value)=>value.email == email)
              next[indexOfStudent] = {...prev[indexOfStudent],withdrew:'1'}
              return next;
            },
          );
            //TODO (Emilio): toast
          } else {
            throw new Error(`response code: ${resp.status}`);
          }
        } catch (err) {
          //TODO (Emilio): toast
        }
      
    })

    const recoilUnWithdraw = getCallback(({set})=> async (email)=>{
      let payload = {
       email,
       courseId,
      };

      try {
        let resp = await axios.post('/api/unWithDrawStudents.php', payload);
        // console.log("resp",resp.data)
        if (resp.status < 300) {
          set(enrollmentAtomByCourseId(courseId),
        ( prev ) => {
            let next = [...prev];
            const indexOfStudent = next.findIndex((value)=>value.email == email)
            next[indexOfStudent] = {...prev[indexOfStudent],withdrew:'0'}
            return next;
          },
        );
          //TODO (Emilio): toast
        } else {
          throw new Error(`response code: ${resp.status}`);
        }
      } catch (err) {
        //TODO (Emilio): toast
      }
    
    })

    const recoilMergeData = getCallback(({set})=> async (payload)=>{
      try {
        let resp = await axios.post('/api/mergeEnrollmentData.php', payload);
        // console.log("resp",resp.data)
        if (resp.status < 300) {
          set(enrollmentAtomByCourseId(courseId),resp.data.enrollmentArray);
          //TODO (Emilio): toast
        } else {
          throw new Error(`response code: ${resp.status}`);
        }
      } catch (err) {
        //TODO (Emilio): toast
      }
    
    })

    return {
      value:get(enrollmentAtomByCourseId(courseId)),
      recoilWithdraw,
      recoilUnWithdraw,
      recoilMergeData
    };
  },

})


function buildDoenetIdToParentDoenetIdObj(orderObj){
  let returnObj = {}
  orderObj.content.map((item)=>{
    if (item?.type == "order"){
      returnObj[item.doenetId] = orderObj.doenetId;
      let childObj = buildDoenetIdToParentDoenetIdObj(item);
      returnObj = {...childObj,...returnObj}
    }else{
      returnObj[item] = orderObj.doenetId;
    }
    returnObj
  })
  return returnObj;
}

export function findFirstPageOfActivity(orderObj){
  if (!orderObj?.content){
    return null;
  }
  //No pages or orders in order so return null
  if (orderObj.content.length == 0){
    return null;
  }
  let response = null;

  for (let item of orderObj.content){
    // console.log("item",item)

    if (typeof item === 'string' || item instanceof String){
      //First content is a string so return the doenetId
      response = item;
      break;
    }else{
      //First item of content is another order
      let nextOrderResponse = findFirstPageOfActivity(item);
    
      if (typeof nextOrderResponse === 'string' || nextOrderResponse instanceof String){
        response = nextOrderResponse;
        break;
      }
    }
  }

  return response; //if didn't find any pages

}

//Recursive Function for order which adds orders to the authorItemByDoenetId
function findOrderAndPageDoenetIdsAndSetOrderObjs(set,orderObj,assignmentDoenetId,parentDoenetId){
  let orderAndPagesDoenetIds = [];
  //Guard for when there is no order
  if (orderObj){
    //Store order objects for UI
    let numberToSelect = orderObj.numberToSelect;
    if (numberToSelect == undefined){
      numberToSelect = 1;
    }
    let withReplacement = orderObj.withReplacement;
    if (withReplacement == undefined){
      withReplacement = false;
    }
    set(authorItemByDoenetId(orderObj.doenetId), {
      type: "order",
      doenetId: orderObj.doenetId, 
      behavior:orderObj.behavior,
      numberToSelect,
      withReplacement,
      containingDoenetId:assignmentDoenetId,
      isOpen:false,
      isSelected:false,
      parentDoenetId
    });
    orderAndPagesDoenetIds.push(orderObj.doenetId);
    for (let orderItem of orderObj.content){
      if (orderItem?.type == 'order'){
        let moreOrderDoenetIds = findOrderAndPageDoenetIdsAndSetOrderObjs(set,orderItem,assignmentDoenetId,orderObj.doenetId);
        orderAndPagesDoenetIds = [...orderAndPagesDoenetIds,...moreOrderDoenetIds];
      }else{
        //Page 
        orderAndPagesDoenetIds = [...orderAndPagesDoenetIds,orderItem];
      }
    }
  }
  return orderAndPagesDoenetIds;
}

export function findPageDoenetIdsInAnOrder({orderObj,needleOrderDoenetId,foundNeedle=false}){
  let pageDoenetIds = [];

    if (!foundNeedle && orderObj.doenetId == needleOrderDoenetId){
      return findPageDoenetIdsInAnOrder({orderObj,needleOrderDoenetId,foundNeedle:true})
    }
    for (let item of orderObj.content){
      // console.log("find item",item)
      if (item?.type == 'order'){
        let morePageDoenetIds;
        if (foundNeedle || item.doenetId == needleOrderDoenetId){
          morePageDoenetIds = findPageDoenetIdsInAnOrder({orderObj:item,needleOrderDoenetId,foundNeedle:true})
        }else{
          morePageDoenetIds = findPageDoenetIdsInAnOrder({orderObj:item,needleOrderDoenetId,foundNeedle})
        }
        pageDoenetIds = [...pageDoenetIds,...morePageDoenetIds];
      }else{
        //Page 
        if (foundNeedle){
          pageDoenetIds.push(item);
        }
      }
    }

  return pageDoenetIds;
}

function localizeDates(obj, keys) {
  for(let key of keys) {
    if (obj[key]) {
      obj[key] = UTCDateStringToDate(
        obj[key],
      ).toLocaleString();
    }
  }
  return obj;
}

let dateKeys = ["assignedDate", "dueDate", "pinnedAfterDate", "pinnedUntilDate"];


export function useInitCourseItems(courseId) {
  const getDataAndSetRecoil = useRecoilCallback(
     ({ snapshot,set }) =>
     async (courseId) => {

      if(!courseId) {
        return;
      }
       
       //Only ask the server for course if we haven't already
       const courseArrayTest = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId));
       if (courseArrayTest.length == 0){

          set(courseIdAtom, courseId);

          const { data } = await axios.get('/api/getCourseItems.php', {
           params: { courseId },
          });
          //DoenetIds depth first search and going into json structures
          // console.log("data",data)
          //TODO: make more efficent for student only view
          let pageDoenetIdToParentDoenetId = {};
          let doenetIds = data.items.reduce((items,item)=>{
            if (item.type !== 'page'){
              items.push(item.doenetId)
            }
            if (item.type === 'activity'){
              let newPageDoenetIdToParentDoenetId = buildDoenetIdToParentDoenetIdObj(item.order);
              pageDoenetIdToParentDoenetId = {...pageDoenetIdToParentDoenetId,...newPageDoenetIdToParentDoenetId}

              let ordersAndPages = findOrderAndPageDoenetIdsAndSetOrderObjs(set,item.order,item.doenetId,item.doenetId);
              items = [...items,...ordersAndPages];
            }else if (item.type === 'bank'){
              item.pages.map((childDoenetId)=>{
                pageDoenetIdToParentDoenetId[childDoenetId] = item.doenetId;
              })
              items = [...items,...item.pages];
            }else if (item.type === 'page'){
              item['parentDoenetId'] = pageDoenetIdToParentDoenetId[item.doenetId];
            }
            //Store activity, bank and page information
            set(authorItemByDoenetId(item.doenetId), localizeDates(item, dateKeys));

            return items
          },[])
          // console.log("init authorCourseItemOrderByCourseId",doenetIds)
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

export function useSetCourseIdFromDoenetId(doenetId) {
  const item = useRecoilValue(authorItemByDoenetId('doenetId'));
  const setCourseId = useSetRecoilState(courseIdAtom);

  useEffect(async () => {

    // if item is found, then we already have the course with doenetId initialized
    if(Object.keys(item).length > 0) {
      return;
    }
  
    const { data } = await axios.get('/api/getCourseIdFromDoenetId.php', {
      params: { doenetId },
    });
  
    // TODO: handle failure
  
    setCourseId(data.courseId);
  
  }, [doenetId])

}

export const courseIdAtom = atom({
  key: 'courseIdAtom',
  default: null
})

export const authorCourseItemOrderByCourseId = atomFamily({
  key: 'authorCourseItemOrderByCourseId',
  default: [],
});

export const authorCourseItemOrderByCourseIdBySection = selectorFamily({
  key: 'authorCourseItemOrderByCourseIdBySection',
  get:({courseId,sectionId})=> ({get})=>{
    let allDoenetIdsInOrder = get(authorCourseItemOrderByCourseId(courseId));
    if (sectionId == courseId || !sectionId){
      return allDoenetIdsInOrder;
    }
    let sectionDoenetIds = [];
    let inSection = false;
    let sectionDoenetIdsInSection = [sectionId];
    for (let doenetId of allDoenetIdsInOrder){
      if (doenetId == sectionId){
        inSection = true;
        continue;
      }
      if (inSection){
        let itemObj = get(authorItemByDoenetId(doenetId));
        if (sectionDoenetIdsInSection.includes(itemObj.parentDoenetId)){
          sectionDoenetIds.push(doenetId);
          //If of type which has children then add to the section list
          if (itemObj.type !== 'page'){
            sectionDoenetIdsInSection.push(doenetId);
          }

        }else{
          break;
        }

      }
    }
    return sectionDoenetIds;
  }
})

export const studentCourseItemOrderByCourseId = selectorFamily({
  key: 'studentCourseItemOrderByCourseId',
  get:(courseId)=> ({get})=>{
    let allDoenetIdsInOrder = get(authorCourseItemOrderByCourseId(courseId));
    let studentDoenetIds = allDoenetIdsInOrder.filter((doenetId)=>{
      let itemObj = get(authorItemByDoenetId(doenetId));
      //If of type for the student then add to the list
      return itemObj.type == 'activity' || itemObj.type == 'section'
    })

    return studentDoenetIds;
  }
})

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
        // console.log('GET courseOrderDataByCourseId');
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

export const copiedCourseItems = atom({
  key: 'copiedCourseItems',
  default: [],
});

export const cutCourseItems = atom({
  key: 'cutCourseItems',
  default: [],
});

// // type ItemType = 'Activity' | 'Section' | 'Page';

export const useCourse = (courseId) => {
  const { label, color, image } = useRecoilValue(
    coursePermissionsAndSettingsByCourseId(courseId),
  );
  const addToast = useToast();

  function insertPageOrOrderToOrder({
    parentOrderObj,
    needleOrderDoenetId,
    itemType,
    newPageDonenetId,
    orderObj
  }){
    let newOrderObj = {...parentOrderObj};
    let insertedAfterDoenetId = parentOrderObj.doenetId;
    //Only if the top order matches
    if (parentOrderObj.doenetId == needleOrderDoenetId){
      insertedAfterDoenetId = newOrderObj.content[newOrderObj.content.length - 1];
      if (insertedAfterDoenetId?.type == 'order'){
        insertedAfterDoenetId = insertedAfterDoenetId.doenetId;
      }
      //Add to the newOrderObj
      if (itemType == 'page'){
        newOrderObj.content = [...parentOrderObj.content,newPageDonenetId]
      }else if (itemType == 'order'){
        newOrderObj.content = [...parentOrderObj.content,{...orderObj}]
      }
      return {newOrderObj,insertedAfterDoenetId};
    }
    //Recurse to find the matching order
    for (let [i,item] of Object.entries(parentOrderObj.content)){
      if (item?.doenetId == needleOrderDoenetId){
        let newItem = {...item};
        insertedAfterDoenetId = newItem.doenetId;
        if (newItem.content.length > 0){
          insertedAfterDoenetId = newItem.content[newItem.content.length -1];
        }
        if (itemType == 'page'){
          newItem.content = [...newItem.content,newPageDonenetId]
        }else if (itemType == 'order'){
          newItem.content = [...newItem.content,{...orderObj}]
        }
        newOrderObj.content = [...newOrderObj.content];
        newOrderObj.content.splice(i,1,newItem)
        
        return {newOrderObj,insertedAfterDoenetId};
      }
      if (item?.type == 'order'){
        let {newOrderObj:subOrder,insertedAfterDoenetId} = insertPageOrOrderToOrder({
          parentOrderObj:item,
          needleOrderDoenetId,
          itemType,
          newPageDonenetId,
          orderObj
        });
        if (subOrder != null){
          //Attach subOrder to newOrderObj 
          newOrderObj.content = [...newOrderObj.content]
          newOrderObj.content.splice(i,1,subOrder)
          return {newOrderObj,insertedAfterDoenetId};
        }
      }

    }
    //Only ever get here when we didn't find the order
      return {newOrderObj:null,insertedAfterDoenetId:null};
  }

     //Recursive Function 
  function findOrderAndPageDoenetIds(orderObj,assignmentDoenetId,parentDoenetId){
    let orderAndPagesDoenetIds = [];
    //Guard for when there is no order
    if (orderObj){

      let numberToSelect = orderObj.numberToSelect;
        if (numberToSelect == undefined){
          numberToSelect = 1;
        }
        let withReplacement = orderObj.withReplacement;
        if (withReplacement == undefined){
          withReplacement = false;
        }
      //Store order objects for UI
      set(authorItemByDoenetId(orderObj.doenetId), {
        type: "order",
        doenetId: orderObj.doenetId, 
        behavior:orderObj.behavior,
        numberToSelect,
        withReplacement,
        containingDoenetId:assignmentDoenetId,
        isOpen:false,
        isSelected:false,
        parentDoenetId
      });
      orderAndPagesDoenetIds.push(orderObj.doenetId);
      for (let orderItem of orderObj.content){
        if (orderItem?.type == 'order'){
          let moreOrderDoenetIds = findOrderAndPageDoenetIds(orderItem,assignmentDoenetId,orderObj.doenetId);
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

  function insertPageOrOrderIntoOrderUsingPage({
    parentOrderObj,
    needlePageDoenetId,
    itemType,
    newPageDonenetId,
    orderObj
  }){
    let newOrderObj = {...parentOrderObj};
  
    for (let [i,item] of Object.entries(parentOrderObj.content)){
      if (item == needlePageDoenetId){
        //Found page! so add new page or order right after it
        let newContent = [...parentOrderObj.content];
        if (itemType == 'page'){
          newContent.splice(i+1,0,newPageDonenetId)
        }else if (itemType == 'order'){
          newContent.splice(i+1,0,{...orderObj})
        }
        newOrderObj.content = newContent;
        return newOrderObj;
      }
      if (item?.type == 'order'){
        //Recurse into the order every time we see one
        let subOrder = insertPageOrOrderIntoOrderUsingPage({
          parentOrderObj:item,
          needlePageDoenetId,
          itemType,
          newPageDonenetId,
          orderObj
        });
        if (subOrder != null){
          //Attach subOrder to newOrderObj 
          newOrderObj.content = [...newOrderObj.content]
          newOrderObj.content.splice(i,1,subOrder)
          return newOrderObj;
        }
      }

    }
    //Only ever get here when we didn't find the page in this order
    return null;
  }

  function addToOrder({orderObj,needleOrderDoenetId,itemToAdd}){
    let nextOrderObj = {...orderObj};

    if (nextOrderObj.doenetId == needleOrderDoenetId){
      let previousDoenetId = nextOrderObj.doenetId;
      if (nextOrderObj.content.length > 0){
        previousDoenetId = nextOrderObj.content[nextOrderObj.content.length -1];
        if (previousDoenetId?.type == 'order'){ //If last element was an order get it's doenetId
          previousDoenetId = previousDoenetId.doenetId;
        }
      }
      nextOrderObj.content = [...nextOrderObj.content,itemToAdd];
      return {order:nextOrderObj,previousDoenetId}
    }

    for (let [i,item] of Object.entries(orderObj.content)){
      if (item?.type == 'order'){
 
        let {order:childOrderObj,previousDoenetId} = 
        addToOrder({orderObj:item,needleOrderDoenetId,itemToAdd})

        if (childOrderObj != null){
          nextOrderObj.content = [...nextOrderObj.content]
          nextOrderObj.content.splice(i,1,childOrderObj);
          return {order:nextOrderObj,previousDoenetId}
        }
      }
    }
    //Didn't find needle
    return {order:null,previousDoenetId:null};
  }

  const create = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ itemType, placeInFolderFlag, previousDoenetId, previousContainingDoenetId }) => {

        let authorItemDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId));
        let newAuthorItemDoenetIds = [...authorItemDoenetIds];

        //TODO: define these by selection if not defined from socket
        if (placeInFolderFlag === undefined){
          placeInFolderFlag = false;
        }

        let sectionId = await snapshot.getPromise(searchParamAtomFamily('sectionId'));
        if (sectionId == ''){
          sectionId = courseId;
        }
         //Place in section if section is toggled open and is the only selected item
        let selectedArray = await snapshot.getPromise(selectedCourseItems);
        if (selectedArray.length == 1){
          let singleSelectedDoenetId = selectedArray[0];
          // previousDoenetId = singleSelectedDoenetId; //When in insert mode
          let selectedObj = await snapshot.getPromise(authorItemByDoenetId(singleSelectedDoenetId))
          if (selectedObj.type == 'section' ){
            placeInFolderFlag = true;
            sectionId = singleSelectedDoenetId;
          }
        }

        if (previousDoenetId == undefined){
          //Find last item in section
          let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId}));
          let lastItemDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];

          //Place at the end unless there are no items, then place after the parent
          if (lastItemDoenetId == undefined){
            //No items in this section
            previousDoenetId = sectionId;
            previousContainingDoenetId = sectionId;
            placeInFolderFlag = true;
          }else{
            previousDoenetId = lastItemDoenetId; 
            previousContainingDoenetId = lastItemDoenetId;
            let lastItemObj = await snapshot.getPromise(authorItemByDoenetId(lastItemDoenetId));
            if (lastItemObj.type == 'page' || lastItemObj.type == 'order'){
              previousContainingDoenetId = lastItemObj.containingDoenetId;
            }
         

          }
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
 
          let { data } = await axios.post('/api/createCourseItem.php', {
              previousContainingDoenetId,
              courseId,
              itemType,
              placeInFolderFlag,
          });
          // console.log('activityData', data);
          let createdActivityDoenentId = data.doenetId;
          newDoenetId = createdActivityDoenentId;
          //Activity
          set(authorItemByDoenetId(createdActivityDoenentId), data.itemEntered); 
          //Order

          let createdOrderDoenetId = data.itemEntered.order.doenetId;
          let numberToSelect = 1;
          let withReplacement = false;
         
          let createdOrderObj = {
            type: "order",
            doenetId:createdOrderDoenetId,
            behavior:"sequence",
            numberToSelect,
            withReplacement,
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
        } else if (itemType == 'bank') {
          let { data } = await axios.post('/api/createCourseItem.php', {
              previousContainingDoenetId,
              courseId,
              itemType,
              placeInFolderFlag,
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
          let { data } = await axios.post('/api/createCourseItem.php', {
              previousContainingDoenetId,
              courseId,
              itemType,
              placeInFolderFlag
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
          let {pageThatWasCreated, orderDoenetIdThatWasCreated} = data;
          let numberToSelect = 1;
          let withReplacement = false;
          let orderObj = {
            type: "order",
            behavior:"sequence",
            numberToSelect,
            withReplacement,
            content:[],
            doenetId: orderDoenetIdThatWasCreated,
          }


          //Update the Global Item Order Activity or Collection
          if (selectedItemObj.type == 'activity'){
            let newJSON = {...selectedItemObj.order};
            let insertedAfterDoenetId = selectedItemObj.order.content[selectedItemObj.order.content.length - 1];
            if (itemType == 'page'){
              pageThatWasCreated.parentDoenetId = selectedItemObj.order.doenetId;
              newJSON.content = [...selectedItemObj.order.content,pageThatWasCreated.doenetId]
            }else if (itemType == 'order'){
              
              newJSON.content = [...selectedItemObj.order.content,orderObj]
            }
            let newActivityObj = {...selectedItemObj}
            newActivityObj.order = newJSON;
            let makeMultiPage = false;
            if (newActivityObj.isSinglePage){
              makeMultiPage = true;
              newActivityObj.isSinglePage = false;
            }
            let { data } = await axios.post('/api/updateActivityStructure.php', {
                courseId,
                doenetId:newActivityObj.doenetId,
                newJSON,
                makeMultiPage,
              });
            // console.log("data",data)
            
            set(authorItemByDoenetId(newActivityObj.doenetId),newActivityObj)
            let newItemDoenetId = orderDoenetIdThatWasCreated;
            if (itemType == 'page'){
              set(authorItemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
              newItemDoenetId = pageThatWasCreated.doenetId;
            }else if (itemType == 'order'){
              orderObj = {...orderObj,
                isOpen:false,
                isSelected:false,
                containingDoenetId: selectedItemObj.doenetId,
                parentDoenetId:selectedItemObj.order.doenetId
              }
              set(authorItemByDoenetId(orderObj.doenetId),orderObj)
            }
            set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
              let next = [...prev];
              next.splice(next.indexOf(insertedAfterDoenetId)+1,0,newItemDoenetId);
              return next;
            });

          }else if (selectedItemObj.type == 'bank'){
            //Can only be an itemType of page (no orders allowed)
            let insertedAfterDoenetId = selectedItemObj.pages[selectedItemObj.pages.length - 1];
            pageThatWasCreated.parentDoenetId = selectedItemObj.doenetId;
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
            let orderDoenetId = selectedItemObj.doenetId;
            if (pageThatWasCreated){
              pageThatWasCreated.parentDoenetId = orderDoenetId;
            }
            const containingItemObj = await snapshot.getPromise(authorItemByDoenetId(selectedItemObj.containingDoenetId));

            let { newOrderObj, insertedAfterDoenetId } = insertPageOrOrderToOrder({
              parentOrderObj:containingItemObj.order,
              needleOrderDoenetId:orderDoenetId,
              itemType,
              newPageDonenetId:pageThatWasCreated?.doenetId,
              orderObj})

            let newActivityObj = {...containingItemObj}
            newActivityObj.order = newOrderObj;

            let { data } = await axios.post('/api/updateActivityStructure.php', {
                courseId,
                doenetId:newActivityObj.doenetId,
                newJSON:newOrderObj,
              });
              // console.log("data",data)
              orderObj['isOpen'] = false;
              orderObj['isSelected'] = false;
              orderObj['containingDoenetId'] = selectedItemObj?.containingDoenetId;
              orderObj['parentDoenetId'] = selectedItemObj?.doenetId;
              // console.log("orderObj",orderObj)
              set(authorItemByDoenetId(newActivityObj.doenetId),newActivityObj)
              let newItemDoenetId = orderDoenetIdThatWasCreated;
              if (itemType == 'page'){
                set(authorItemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
                newItemDoenetId = pageThatWasCreated.doenetId;
              }else if (itemType == 'order'){
                set(authorItemByDoenetId(orderObj.doenetId),orderObj)
              }
              set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
                let next = [...prev];
                next.splice(next.indexOf(insertedAfterDoenetId)+1,0,newItemDoenetId);
                return next;
              });
          }else if (selectedItemObj.type == 'page'){
            if (pageThatWasCreated){
              pageThatWasCreated.parentDoenetId = selectedItemObj.parentDoenetId;
            }
            const containingItemObj = await snapshot.getPromise(authorItemByDoenetId(selectedItemObj.containingDoenetId));
            if (containingItemObj.type == 'bank'){
              // let insertedAfterDoenetId = selectedItemObj.doenetId;
              // let newJSON = [];
              // for (let pageDoenetId of containingItemObj.pages){
              //   newJSON.push(pageDoenetId);
              //   if (pageDoenetId == selectedItemObj.doenetId){
              //     newJSON.push(pageThatWasCreated.doenetId);
              //   }
              // }
            let insertedAfterDoenetId = containingItemObj.pages[containingItemObj.pages.length -1]
            let newJSON = [...containingItemObj.pages,pageThatWasCreated.doenetId]
            let newCollectionObj = {...containingItemObj}
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

            }else if (containingItemObj.type == 'activity'){
              //Add page or order to activity with selected page
              // let insertedAfterDoenetId = selectedItemObj.doenetId;

              // let insertedAfterDoenetId = parentItemObj.order[parentItemObj.order.length -1];
              // console.log("insertedAfterDoenetId",insertedAfterDoenetId);
              // console.log("itemType",itemType);
              // console.log("selectedItemObj",selectedItemObj.parentDoenetId);
              let insertedAfterDoenetId;
              let newJSON;
              if (itemType == 'page'){
                ({order:newJSON,previousDoenetId:insertedAfterDoenetId} = 
                  addToOrder({
                    orderObj:containingItemObj.order,
                    needleOrderDoenetId:selectedItemObj.parentDoenetId,
                    itemToAdd:pageThatWasCreated?.doenetId}))

              }else if (itemType == 'order'){
                ({order:newJSON,previousDoenetId:insertedAfterDoenetId} = 
                  addToOrder({
                    orderObj:containingItemObj.order,
                    needleOrderDoenetId:selectedItemObj.parentDoenetId,
                    itemToAdd:orderObj}));
              }

              // let newJSON = {...containingItemObj.order};
              // newJSON = insertPageOrOrderIntoOrderUsingPage({
              //   parentOrderObj:newJSON,
              //   needlePageDoenetId:insertedAfterDoenetId,
              //   itemType,
              //   newPageDonenetId:pageThatWasCreated?.doenetId,
              //   orderObj
              // })

              let { data } = await axios.post('/api/updateActivityStructure.php', {
                    courseId,
                    doenetId:containingItemObj.doenetId,
                    newJSON,
                  });
              // console.log("data",data)
              let newActivityObj = {...containingItemObj}
              newActivityObj.order = newJSON;
              orderObj['isOpen'] = false;
              orderObj['isSelected'] = false;
              orderObj['containingDoenetId'] = selectedItemObj?.containingDoenetId;
              orderObj['parentDoenetId'] = selectedItemObj?.parentDoenetId;
   
              set(authorItemByDoenetId(newActivityObj.doenetId),newActivityObj)
              let newItemDoenetId = orderDoenetIdThatWasCreated;
              if (itemType == 'page'){
                set(authorItemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
                newItemDoenetId = pageThatWasCreated.doenetId;
              }else if (itemType == 'order'){
                set(authorItemByDoenetId(orderObj.doenetId),orderObj)
              }
              set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
                let next = [...prev];
                next.splice(next.indexOf(insertedAfterDoenetId)+1,0,newItemDoenetId);
                return next;
              });
                
            }
          }
        
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
        //Undo copy and cut
        let cutObjs = await snapshot.getPromise(cutCourseItems);
        for (let cutObj of cutObjs){
          set(authorItemByDoenetId(cutObj.doenetId),(prev)=>{
            let next = {...prev};
            next['isBeingCut'] = false;
            return next;
          })
        }
        set(cutCourseItems,[]);
        set(copiedCourseItems,[]);


      let itemObj = await snapshot.getPromise(authorItemByDoenetId(doenetId))
      let resp = await axios.get('/api/renameCourseItem.php', {params:{ courseId,doenetId,newLabel,type:itemObj.type } });
      if (resp.status < 300) {
        let updatedItem = resp.data.item;
        if (itemObj.type !== 'page'){
          updatedItem.isOpen = itemObj.isOpen;
        }
        set(authorItemByDoenetId(doenetId),(prev)=>{
          let next = {...prev}
          next.label = updatedItem.label;
          return next
        });
        
        // updatedItem.isSelected = itemObj.isSelected;
        // set(authorItemByDoenetId(doenetId),updatedItem);

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

const updateAssignItem = useRecoilCallback(
  ({ set }) =>
    async ({ doenetId, isAssigned, successCallback, failureCallback = defaultFailure }) => {
      try {

      let resp = await axios.get('/api/updateIsAssignedOnAnItem.php', {params:{ courseId,doenetId,isAssigned } });
      // console.log("resp.data",resp.data)
      if (resp.status < 300) {
        // let isAssigned = resp.data.isAssigned;

        set(authorItemByDoenetId(doenetId),(prev)=>{
          let next = {...prev}
          next.isAssigned = isAssigned;
          return next
        });
        
        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
      } catch (err) {
      failureCallback(err);
      }
    },[courseId,defaultFailure]);

  const compileActivity = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ activityDoenetId, successCallback, isAssigned = false, courseId, failureCallback = defaultFailure }) => {

        async function orderToDoenetML({ order, indentLevel = 1 }) {
          // TODO: list of possible order attributes
          let attributes = ["behavior", "numberToSelect", "withReplacement"];

          let orderParameters = attributes.filter(x => x in order)
            .map(x => `${x}="${order[x]}"`).join(" ");

          let contentStrings = (await Promise.all(order.content
            .map(x => contentToDoenetML({ content: x, indentLevel: indentLevel + 1 }))))
            .join("");

          let indentSpacing = "  ".repeat(indentLevel);

          return `${indentSpacing}<order ${orderParameters}>\n${contentStrings}${indentSpacing}</order>\n`;
        }

        async function contentToDoenetML({ content, indentLevel = 1 }) {
          if (content.type === "order") {
            return await orderToDoenetML({ order: content, indentLevel });
          } else if (typeof content === "string") {
            return await pageToDoenetML({ pageDoenetId: content, indentLevel });
          } else {
            throw Error("Invalid activity definition: content must be an order or a doenetId specifying a page")
          }
        }

        async function pageToDoenetML({ pageDoenetId, indentLevel = 1 }) {
          let indentSpacing = "  ".repeat(indentLevel);

          let pageDoenetML = (await snapshot.getPromise(fileByDoenetId(pageDoenetId)));

          let params = {
            doenetML: pageDoenetML,
            pageId: pageDoenetId,
            courseId,
            saveAsCid: true,
          }

          const { data } = await axios.post("/api/saveDoenetML.php", params)
          if (!data.success) {
            throw Error(data.message);
          }

          let pageCid = data.cid;

          set(fileByCid(pageCid),pageDoenetML);

          return `${indentSpacing}<page cid="${pageCid}" />\n`;
        }

        let activity = await snapshot.getPromise(authorItemByDoenetId(activityDoenetId));

        let attributeString = ` xmlns="https://doenet.org/spec/doenetml/v${activity.version}" type="activity"`

        if (activity.itemWeights) {
          attributeString += ` itemWeights = "${activity.itemWeights.join(" ")}"`;
        }

        if (activity.shuffleItemWeights) {
          attributeString += ` shuffleItemWeights`;
        }

        if (activity.numberOfVariants !== undefined) {
          attributeString += ` numberOfVariants="${activity.numberOfVariants}"`;
        }

        if (activity.isSinglePage) {
          attributeString += ` isSinglePage`;
        }

        let childrenString;
        try {
          childrenString = await orderToDoenetML({ order: activity.order });
        } catch (err) {
          failureCallback(err);
        }

        let activityDoenetML = `<document${attributeString}>\n${childrenString}</document>`
        try {
          let resp = await axios.post('/api/saveCompiledActivity.php', { courseId, doenetId: activityDoenetId, isAssigned, activityDoenetML });
         
          if (resp.status < 300) {
            let { success, message, cid, assignmentSettings } = resp.data;

            let key = 'draftCid';
            if (isAssigned) {
              key = 'assignedCid'
            }

            //save the cid in assignedCid or draftCid
            set(authorItemByDoenetId(activityDoenetId), (prev) => {
              let next = { ...prev }
              next[key] = cid;
              
              if (isAssigned) {
                Object.assign(next, localizeDates(assignmentSettings, dateKeys));
              }

              return next;
            })
            successCallback?.();
          } else {
            throw new Error(`response code: ${resp.status}`);
          }
        } catch (err) {
          failureCallback(err);
        }
  });

  function updateOrder({orderObj,needleDoenetId,changesObj}){
    let nextOrderObj = {...orderObj};
    if (needleDoenetId == orderObj.doenetId){
      Object.assign(nextOrderObj,changesObj);
      return nextOrderObj;
    }
    for (let [i,item] of Object.entries(orderObj.content)){
      if (item?.type == 'order'){
        //Check for match
        if (needleDoenetId == item.doenetId){
          let nextItemObj = {...item}
          Object.assign(nextItemObj,changesObj);
          nextOrderObj.content = [...nextOrderObj.content]
          nextOrderObj.content.splice(i,1,nextItemObj);
          return nextOrderObj;
        }
        //if not match then recurse into content
        let childOrderObj = updateOrder({orderObj:item,needleDoenetId,changesObj});
        if (childOrderObj != null){
          nextOrderObj.content = [...nextOrderObj.content]
          nextOrderObj.content.splice(i,1,childOrderObj);
          return nextOrderObj;
        }
      }
    }
    //Didn't find needle
    return null;
  }

  function deletePageFromOrder({orderObj,needleDoenetId}){
    let nextOrderObj = {...orderObj};

    let index = null;

    for (let [i,item] of Object.entries(orderObj.content)){
      if (item?.type == 'order'){
        let childOrderObj = deletePageFromOrder({orderObj:item,needleDoenetId});
        if (childOrderObj != null){
          nextOrderObj.content = [...nextOrderObj.content]
          nextOrderObj.content.splice(i,1,childOrderObj);
          return nextOrderObj;
        }

      }else if (needleDoenetId == item){
          index = i;
          break;
        }
    }

    //Need to return order object without the doenetId of the page to delete
    if (index != null){
      let nextContent = [...orderObj.content];
      nextContent.splice(index,1);
      nextOrderObj.content = nextContent
      return nextOrderObj
    }
    //Didn't find needle
    return null;
  }

  function deleteOrderFromOrder({orderObj,needleDoenetId}){
    let nextOrderObj = {...orderObj};

    let index = null;

    for (let [i,item] of Object.entries(orderObj.content)){
      if (item?.type == 'order'){
        //Check for match
        if (needleDoenetId == item.doenetId){
          index = i;
          break;
        }
        
        //if not a match then recurse into content
        let childOrderObj = deleteOrderFromOrder({orderObj:item,needleDoenetId});
        if (childOrderObj != null){
          nextOrderObj.content = [...nextOrderObj.content]
          nextOrderObj.content.splice(i,1,childOrderObj);
          return nextOrderObj;
        }
      }
    }
    //Need to return order object without the doenetId of the page to delete
    if (index != null){
      let nextContent = [...orderObj.content];
      nextContent.splice(index,1);
      nextOrderObj.content = nextContent
      return nextOrderObj
    }
    //Didn't find needle
    return null;
  }
  
  function findOrderDoenetIdsInAnOrder({orderObj,needleOrderDoenetId,foundNeedle=false}){
    let orderDoenetIds = [];
  
      for (let item of orderObj.content){
        if (item?.type == 'order'){
          let morePageDoenetIds;
          if (foundNeedle || item.doenetId == needleOrderDoenetId){
            orderDoenetIds.push(item.doenetId);
            morePageDoenetIds = findOrderDoenetIdsInAnOrder({orderObj:item,needleOrderDoenetId,foundNeedle:true})
          }else{
            morePageDoenetIds = findOrderDoenetIdsInAnOrder({orderObj:item,needleOrderDoenetId,foundNeedle})
          }
          orderDoenetIds = [...orderDoenetIds,...morePageDoenetIds];
        }
      }

    return orderDoenetIds;
  }

  const updateOrderBehavior = useRecoilCallback(
    ({ set,snapshot }) =>
      async ({doenetId, behavior, numberToSelect, withReplacement, successCallback, failureCallback = defaultFailure}) => {
        let orderObj = await snapshot.getPromise(authorItemByDoenetId(doenetId));
        let activityObj = await snapshot.getPromise(authorItemByDoenetId(orderObj.containingDoenetId))
        let changesObj = {behavior,numberToSelect,withReplacement};
        let nextOrder = updateOrder({orderObj:activityObj.order,needleDoenetId:doenetId,changesObj});
        
        let { data } = await axios.post('/api/updateActivityStructure.php', {
          courseId,
          doenetId:orderObj.containingDoenetId,
          newJSON:nextOrder
        });
      // console.log("data",data)
        let nextActivityObj = {...activityObj};
        nextActivityObj.order = nextOrder;
        set(authorItemByDoenetId(orderObj.containingDoenetId),nextActivityObj)
   
        set(authorItemByDoenetId(doenetId),(prev)=>{
          let next = {...prev}
          next.behavior = behavior;
          next.numberToSelect = numberToSelect;
          next.withReplacement = withReplacement;
          return next;
        });
  });

  const deleteItem = useRecoilCallback(
    ({ set,snapshot }) =>
      async ({doenetId, successCallback, failureCallback = defaultFailure}) => {
        let itemToDeleteObj = await snapshot.getPromise(authorItemByDoenetId(doenetId));
        // console.log("deleteItem itemToDeleteObj",itemToDeleteObj)
        let pagesDoenetIds = [];
        let courseContentDoenetIds = [];
        let activitiesJson = [];
        let activitiesJsonDoenetIds = [];
        let collectionsJson = []; 
        let collectionsJsonDoenetIds = []; 
        let baseCollectionsDoenetIds = [];
        let baseActivitiesDoenetIds = [];
        let baseSectionsDoenetIds = [];
        let orderDoenetIds = []; //Only to update local recoil

        if (itemToDeleteObj.type == 'page'){
          let containingObj = await snapshot.getPromise(authorItemByDoenetId(itemToDeleteObj.containingDoenetId))
          if (containingObj.type == 'bank'){
            collectionsJsonDoenetIds.push(containingObj.doenetId)
            let nextPages = [...containingObj.pages];
            nextPages.splice(nextPages.indexOf(itemToDeleteObj.doenetId),1);
            collectionsJson.push(nextPages);
            pagesDoenetIds.push(doenetId);
          }else if (containingObj.type == 'activity'){
            let nextOrder = deletePageFromOrder({orderObj:containingObj.order,needleDoenetId:doenetId})
            activitiesJson.push(nextOrder);
            activitiesJsonDoenetIds.push(containingObj.doenetId);
            pagesDoenetIds.push(doenetId);
          }

        }else if (itemToDeleteObj.type == 'order'){
          let containingObj = await snapshot.getPromise(authorItemByDoenetId(itemToDeleteObj.containingDoenetId))
          //Find doenentIds of pages contained by the order
          pagesDoenetIds = findPageDoenetIdsInAnOrder({orderObj:containingObj.order,needleOrderDoenetId:doenetId})
          orderDoenetIds = findOrderDoenetIdsInAnOrder({orderObj:containingObj.order,needleOrderDoenetId:doenetId})
          //Find updated activities' default order
          let nextOrder = deleteOrderFromOrder({orderObj:containingObj.order,needleDoenetId:doenetId})
          activitiesJson.push(nextOrder);
          activitiesJsonDoenetIds.push(containingObj.doenetId);
        }else if (itemToDeleteObj.type == 'bank'){
          baseCollectionsDoenetIds.push(doenetId);
          pagesDoenetIds = itemToDeleteObj.pages;
        }else if (itemToDeleteObj.type == 'activity'){
          let orderObj = itemToDeleteObj.order;
          let needleOrderDoenetId = itemToDeleteObj.order.doenetId;
          pagesDoenetIds = findPageDoenetIdsInAnOrder({orderObj,needleOrderDoenetId,foundNeedle:true})
          orderDoenetIds = findOrderDoenetIdsInAnOrder({orderObj,needleOrderDoenetId,foundNeedle:true})
          orderDoenetIds = [needleOrderDoenetId,...orderDoenetIds];
          baseActivitiesDoenetIds = [doenetId]
        }else if (itemToDeleteObj.type == 'section'){
          baseSectionsDoenetIds.push(itemToDeleteObj.doenetId);
          let sectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId:itemToDeleteObj.doenetId}))

          for (let doenetId of sectionDoenetIds){
            let itemObj = await snapshot.getPromise(authorItemByDoenetId(doenetId));
            if (itemObj.type == 'activity'){
              baseActivitiesDoenetIds.push(itemObj.doenetId)
            }else if (itemObj.type == 'order'){
              orderDoenetIds.push(itemObj.doenetId)
            }else if (itemObj.type == 'page'){
              pagesDoenetIds.push(itemObj.doenetId)
            }else if (itemObj.type == 'bank'){
              baseCollectionsDoenetIds.push(itemObj.doenetId)
            }else if (itemObj.type == 'section'){
              baseSectionsDoenetIds.push(itemObj.doenetId)
            }
          }
        }
        //Delete off of server first
    try {

        let resp = await axios.post('/api/deleteItems.php', {
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
        // console.log("data",resp.data)
        let { success, message } = resp.data;

     //update recoil for deleted items from collections
     for (let [i,collectionDoenetId] of Object.entries(collectionsJsonDoenetIds)){
      let collectionJson = collectionsJson[i];
      set(authorItemByDoenetId(collectionDoenetId),(prev)=>{
        let next = {...prev}
        next.pages = collectionJson;
        return next;
      })
      
     }
     for (let [i,activitiesJsonDoenetId] of Object.entries(activitiesJsonDoenetIds)){
      let activityJson = activitiesJson[i];
      set(authorItemByDoenetId(activitiesJsonDoenetId),(prev)=>{
        let next = {...prev}
        next.order = activityJson;
        return next;
      })
      
     }

     
      //remove all items from author order
     set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
       let next = [...prev];
       for (let pagesDoenetId of pagesDoenetIds){
        next.splice(next.indexOf(pagesDoenetId),1);
       }
       for (let orderDoenetId of orderDoenetIds){
        next.splice(next.indexOf(orderDoenetId),1);
       }
       for (let baseCollectionsDoenetId of baseCollectionsDoenetIds){
        next.splice(next.indexOf(baseCollectionsDoenetId),1);
       }
       for (let baseActivitiesDoenetId of baseActivitiesDoenetIds){
        next.splice(next.indexOf(baseActivitiesDoenetId),1);
       }
       for (let baseSectionsDoenetId of baseSectionsDoenetIds){
        next.splice(next.indexOf(baseSectionsDoenetId),1);
       }
       return next;
     });
    

     //Clear selections
     let selectedDoenentIds = await snapshot.getPromise(selectedCourseItems);
    for (let doenetId of selectedDoenentIds){
      set(authorItemByDoenetId(doenetId),(prev)=>{
        let next = {...prev}
        next.isSelected = false;
        return next
      })
    }
    set(selectedCourseItems,[]);
    set(selectedMenuPanelAtom,"");

        successCallback?.();
      } else {
        throw new Error(`response code: ${resp.status}`);
      }
    } catch (err) {
      failureCallback(err);
    }

  });

  const copyItems = useRecoilCallback(
    ({ set,snapshot }) =>
      async ({successCallback, failureCallback = defaultFailure}) => {
        let selectedDoenetIds = await snapshot.getPromise(selectedCourseItems);
        let copiedCourseItemsObjs = [];
        for (let selectedDoenetId of selectedDoenetIds){
          let selectedObj = await snapshot.getPromise(authorItemByDoenetId(selectedDoenetId));
          copiedCourseItemsObjs.push(selectedObj);
        }
        set(copiedCourseItems,copiedCourseItemsObjs)
        //Set isBeingCut back to false
        let cutObjs = await snapshot.getPromise(cutCourseItems);
        for (let cutObj of cutObjs){
          set(authorItemByDoenetId(cutObj.doenetId),(prev)=>{
            let next = {...prev}
            next['isBeingCut'] = false;
            return next;
          })
        }
        set(cutCourseItems,[]);

        successCallback();
  });

  const cutItems = useRecoilCallback(
    ({ set,snapshot }) =>
      async ({successCallback, failureCallback = defaultFailure}) => {
        let cutObjs = await snapshot.getPromise(cutCourseItems);
        for (let cutObj of cutObjs){
          set(authorItemByDoenetId(cutObj.doenetId),(prev)=>{
            let next = {...prev}
            next['isBeingCut'] = false;
            return next;
          })
        }
        set(cutCourseItems,[]);

        let selectedDoenetIds = await snapshot.getPromise(selectedCourseItems);
        let cutCourseItemsObjs = [];
        for (let selectedDoenetId of selectedDoenetIds){
          let selectedObj = await snapshot.getPromise(authorItemByDoenetId(selectedDoenetId));
          cutCourseItemsObjs.push(selectedObj);
          let nextItem = {...selectedObj};
          nextItem['isBeingCut'] = true;
          set(authorItemByDoenetId(selectedDoenetId),nextItem)
        }
        set(cutCourseItems,cutCourseItemsObjs)
        //Set all items to cut mode
        successCallback();
  });

  const pasteItems = useRecoilCallback(
    ({ set,snapshot }) =>
      async ({successCallback, failureCallback = defaultFailure}) => {
        let cutObjs = await snapshot.getPromise(cutCourseItems);
        let copiedObjs = await snapshot.getPromise(copiedCourseItems);
        let selectedDoenetIds = await snapshot.getPromise(selectedCourseItems);
        let singleSelectedObj = null;

        //Test if we have any items to copy or cut
        if (cutObjs.length == 0 && copiedObjs.length == 0){
          failureCallback("No items pasted.")
          return;
        }
        //Figure out which section we are pasting into
        //If selected section then use that over courseId or sectionId search params
        let sectionId = await snapshot.getPromise(searchParamAtomFamily('sectionId'));
        if (sectionId == ''){
          sectionId = courseId;
        }
        if (selectedDoenetIds.length == 1){
          singleSelectedObj = await snapshot.getPromise(authorItemByDoenetId(selectedDoenetIds[0]));
          if (singleSelectedObj.type == 'section'){
            sectionId = singleSelectedObj.doenetId;
          }
        }else if (selectedDoenetIds.length > 1){
          failureCallback("Can only paste to one location.")
          return;
        }

        //Try cut 
        if (cutObjs.length > 0){

          //If destination is the same as source then fail
          // if (cutObjs[0].parentDoenetId == sectionId){
          //   failureCallback("Destination is the same as the source.")
          //   return;
          // }
          let previousContainingDoenetIds = [];
          let courseContentTableDoenetIds = [];
          let courseContentTableNewParentDoenetId = sectionId;
          //update original cut items to new location
          for (let cutObj of cutObjs){
            let nextObj = {...cutObj}
            nextObj["isBeingCut"] = false;
            nextObj["isSelected"] = false;
            if (cutObj.type == 'activity'){
              nextObj.parentDoenetId = sectionId;
              courseContentTableDoenetIds.push(cutObj.doenetId)
              //Move all the activity items to the new location
              let prevOrder = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId));
              let nextOrder = [...prevOrder];

              //Find number of items to move
              let theActivitysPages = findPageDoenetIdsInAnOrder({orderObj:cutObj.order,needleOrderDoenetId:null,foundNeedle:true});
              let theActivitysOrders = findOrderDoenetIdsInAnOrder({orderObj:cutObj.order,needleOrderDoenetId:null,foundNeedle:true});
              theActivitysOrders.push(cutObj.order.doenetId)
              let numberOfItems = theActivitysOrders.length + theActivitysPages.length + 1; //Add one for the activity row itself

              let removedDoenetIds = nextOrder.splice(nextOrder.indexOf(cutObj.doenetId),numberOfItems); //Remove
              let doenetIdsInTheSection = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId}));
              //Find last one in the section
              let previousContainingDoenetId = cutObj.doenetId; //assume section with no content
              if (doenetIdsInTheSection.length > 0){
                let lastInSectionDoenetId = doenetIdsInTheSection[doenetIdsInTheSection.length - 1];
                let lastInSectionObj = await snapshot.getPromise(authorItemByDoenetId(lastInSectionDoenetId));
                if (lastInSectionObj.type == 'page' || lastInSectionObj.type == 'order'){
                  previousContainingDoenetId = lastInSectionObj.containingDoenetId;
                }
              }
              previousContainingDoenetIds.push(previousContainingDoenetId); //last one in the section

              nextOrder.splice(nextOrder.indexOf(sectionId)+1+doenetIdsInTheSection.length,0,...removedDoenetIds); //Insert
              set(authorCourseItemOrderByCourseId(courseId),nextOrder)

              //update the database
              let resp = await axios.post('/api/moveContent.php',{
                courseId,
                courseContentTableDoenetIds,
                courseContentTableNewParentDoenetId,
                previousContainingDoenetIds,
              })

            }
            if (cutObj.type == 'page'){
              if (!singleSelectedObj || (singleSelectedObj.type != 'bank' && singleSelectedObj.type != 'order')){
                failureCallback("Pages can only be pasted into an order or a collection.")
                return;
              }
              let sourceContainingObj = await snapshot.getPromise(authorItemByDoenetId(cutObj.containingDoenetId));

              let originalPageDoenetId = cutObj.doenetId;
              let sourceType = sourceContainingObj.type;
              let sourceDoenetId = sourceContainingObj.doenetId;
              let destinationContainingObj = {};
              let sourceJSON = {};
              let destinationJSON = {};
              let previousDoenetId;

         
              
              // console.log("cut sourceContainingObj",sourceContainingObj)
              if (sourceContainingObj.type == 'activity'){
                //Remove from Activity
                sourceJSON = deletePageFromOrder({orderObj:sourceContainingObj.order,needleDoenetId:originalPageDoenetId})
              }else if (sourceContainingObj.type == 'bank'){
                //Remove from Collection
                let nextPages = [...sourceContainingObj.pages]
                nextPages.splice(sourceContainingObj.pages.indexOf(originalPageDoenetId),1)
                sourceJSON = nextPages;
              }

              //Add changes to sourceJSON if source containing item 
              //is the destination containing item
              if (singleSelectedObj.type == 'bank'){
                //Add to Collection
                destinationContainingObj = {...singleSelectedObj}
                if (destinationContainingObj.doenetId == sourceDoenetId){
                  previousDoenetId = singleSelectedObj.doenetId;
                  if (sourceJSON.length > 0){
                    previousDoenetId = sourceJSON[sourceJSON.length - 1]
                  }
                  sourceJSON = [...sourceJSON,originalPageDoenetId];
                }else{
                  previousDoenetId = singleSelectedObj.doenetId;
                  if (singleSelectedObj.pages.length > 0){
                    previousDoenetId = singleSelectedObj.pages[singleSelectedObj.pages.length - 1]
                  }
                  destinationJSON = [...singleSelectedObj.pages,originalPageDoenetId]
                }
                
              }else if (singleSelectedObj.type == 'order'){
                //Add to Activity
                destinationContainingObj = await snapshot.getPromise(authorItemByDoenetId(singleSelectedObj.containingDoenetId));
                if (destinationContainingObj.doenetId == sourceDoenetId){
                  ({order:sourceJSON,previousDoenetId} = addToOrder({
                    orderObj:sourceJSON,
                    needleOrderDoenetId:singleSelectedObj.doenetId,
                    itemToAdd:originalPageDoenetId})
                  )
                }else{
                  ({order:destinationJSON,previousDoenetId} = addToOrder({
                    orderObj:destinationContainingObj.order,
                    needleOrderDoenetId:singleSelectedObj.doenetId,
                    itemToAdd:originalPageDoenetId})
                  )
                }
              }
              let destinationType = destinationContainingObj.type;
              let destinationDoenetId = destinationContainingObj.doenetId;

              //update database
              try {
                let resp = await axios.post('/api/cutCopyAndPasteAPage.php', {
                  isCopy:false,
                  courseId,
                  originalPageDoenetId,
                  sourceType,
                  sourceDoenetId,
                  destinationType,
                  destinationDoenetId,
                  sourceJSON,
                  destinationJSON,
                });
                // console.log("resp.data",resp.data)
                if (resp.status < 300) {
                  //Update source
                  if (sourceType == 'bank'){
                    set(authorItemByDoenetId(sourceDoenetId),(prev)=>{
                      let next = {...prev}
                      next.pages = sourceJSON;
                      return next;
                    })
                  } else if (sourceType == 'activity'){
                    set(authorItemByDoenetId(sourceDoenetId),(prev)=>{
                      let next = {...prev}
                      next.order = sourceJSON;
                      return next;
                    })
                  }

                  //Update destination
                  if (destinationDoenetId != sourceDoenetId){
                    if (destinationType == 'bank'){
                      set(authorItemByDoenetId(destinationDoenetId),(prev)=>{
                        let next = {...prev}
                        next.pages = destinationJSON;
                        return next;
                      })
                      //Update page
                      set(authorItemByDoenetId(originalPageDoenetId),(prev)=>{
                        let next = {...prev}
                        next.containingDoenetId = destinationDoenetId;
                        next.parentDoenetId = singleSelectedObj.doenetId;
                        next.isBeingCut = false
                        return next;
                      })
                    }else if (destinationType == 'activity'){
                      set(authorItemByDoenetId(destinationDoenetId),(prev)=>{
                        let next = {...prev}
                        next.order = destinationJSON;
                        return next;
                      })
                  }
                }
                    //Update page
                    set(authorItemByDoenetId(originalPageDoenetId),(prev)=>{
                      let next = {...prev}
                      next.containingDoenetId = destinationDoenetId;
                      next.parentDoenetId = singleSelectedObj.doenetId;
                      next.isBeingCut = false
                      return next;
                    })
                  
                  set(authorCourseItemOrderByCourseId(courseId),(prev)=>{
                    let next = [...prev];
                    next.splice(next.indexOf(originalPageDoenetId),1);  //remove 
                    next.splice(next.indexOf(previousDoenetId)+1,0,originalPageDoenetId);  //insert
                    return next
                  })
                  successCallback?.();
                  //Update recoil
                  // set(authorItemByDoenetId(cutObj.doenetId),nextObj); //TODO: set using function and transfer nextObj key by key
                  
                  
                } else {
                  throw new Error(`response code: ${resp.status}`);
                }
              } catch (err) {
                failureCallback(err);
              }
            }
              



          }
          
          // console.log("resp.data",resp.data);
          //Transfer cut to copy so we don't get duplicate doenetIds
          set(copiedCourseItems,[...cutObjs])
          set(cutCourseItems,[]);
          return;
        }

        if (copiedObjs.length > 0){
          //Duplicate the copied items using the server for new doenetIds
          // console.log("Duplicate these",copiedObjs)
          //Assume it's an empty section
          let previousContainingDoenetId = sectionId;
          let placeInFolderFlag = true;
          //If it's not get the latest containing doenetId
          let doenetIdsInTheSection = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId}));
          if (doenetIdsInTheSection.length > 0){
            let lastInSectionDoenetId = doenetIdsInTheSection[doenetIdsInTheSection.length -1];
            previousContainingDoenetId = lastInSectionDoenetId;
            let lastInSectionObj = await snapshot.getPromise(authorItemByDoenetId(lastInSectionDoenetId));
            if (lastInSectionObj.type == 'page' || lastInSectionObj.type == 'order'){
              previousContainingDoenetId = lastInSectionObj.containingDoenetId;
            }
            placeInFolderFlag = false;
          }
          for(let copiedObj of copiedObjs){
            let pageDoenetIds = [];
            let pageLabels = [];
            let orderDoenetIds = [];
            if (copiedObj.type == 'activity'){
              pageDoenetIds = findPageDoenetIdsInAnOrder({orderObj:copiedObj.order,needleOrderDoenetId:null,foundNeedle:true});
              orderDoenetIds = findOrderDoenetIdsInAnOrder({orderObj:copiedObj.order,needleOrderDoenetId:null,foundNeedle:true});
              orderDoenetIds.unshift(copiedObj.order.doenetId);  //Need base order too
              for (let pageDoenetId of pageDoenetIds){
                let pageObj = await snapshot.getPromise(authorItemByDoenetId(pageDoenetId));
                pageLabels.push(pageObj.label);
              }
              //Trim off the navigation parts of the activity
              let activityObj = {...copiedObj};
              delete activityObj.isOpen;
              delete activityObj.isSelected;
              delete activityObj.label;
              delete activityObj.doenetId;
              delete activityObj.creationDate;
              delete activityObj.isPublic;
              delete activityObj.isAssigned;
              delete activityObj.isGloballyAssigned;
              activityObj.parentDoenetId = sectionId;
              
              let activityLabel = copiedObj.label; 
              if (copiedObj.label == 'Untitled'){
                activityLabel = 'Untitled';
              }
              
              let resp = await axios.post('/api/createCourseItem.php', {
                courseId,
                previousContainingDoenetId,
                placeInFolderFlag,
                itemType:copiedObj.type,
                cloneMode:'1',
                pageDoenetIds,
                pageLabels,
                orderDoenetIds,
                activityLabel,
                activityObj
              });
              // console.log("copied data",resp.data)
              let createdDoenetIds = [resp.data.doenetId]
              console.log("resp.data.itemEntered",resp.data.itemEntered)
              set(authorItemByDoenetId(resp.data.doenetId),resp.data.itemEntered);
              let doenetIdToParentDoenetIdObj = buildDoenetIdToParentDoenetIdObj(resp.data.itemEntered.order);
              findOrderAndPageDoenetIdsAndSetOrderObjs(set,resp.data.itemEntered.order,resp.data.doenetId,resp.data.doenetId)
              // findOrderAndPageDoenetIds(set,resp.data.itemEntered.order,resp.data.doenetId,resp.data.doenetId)

              for (let pageObj of resp.data.pagesEntered){
                //Add parentDoenetId to pageObj
                createdDoenetIds.push(pageObj.doenetId);
                pageObj["parentDoenetId"] = doenetIdToParentDoenetIdObj[pageObj.doenetId]
                set(authorItemByDoenetId(pageObj.doenetId),pageObj);
              }
              set(authorCourseItemOrderByCourseId(courseId),(prev)=>{
                let next;
                if (sectionId == courseId){
                  next = [...prev,...createdDoenetIds]
                }else{
                  next = [...prev];
                  next.splice(next.indexOf(previousContainingDoenetId)+1,0,...createdDoenetIds)
                }
                return next;
              })
              
              successCallback();
            }
            if (copiedObj.type == 'page'){
              if (!singleSelectedObj || (singleSelectedObj.type != 'bank' && singleSelectedObj.type != 'order')){
                failureCallback("Pages can only be pasted into an order or a collection.")
                return;
              }
              let pageObj = {...copiedObj};

              let originalPageDoenetId = copiedObj.doenetId;
              let sourceType = "na";
              let sourceDoenetId = "na";
              let destinationContainingObj = {};
              let sourceJSON = {};
              let destinationJSON = {};
              let previousDoenetId;
              let replaceMeDoenetId = `${originalPageDoenetId}2`
              let clonePageLabel = `copy of ${pageObj.label}`
              let clonePageParent = singleSelectedObj.doenetId;

              if (singleSelectedObj.type == 'bank'){
                //Add to Collection
                destinationContainingObj = {...singleSelectedObj}

                  previousDoenetId = singleSelectedObj.doenetId;
                  if (singleSelectedObj.pages.length > 0){
                    previousDoenetId = singleSelectedObj.pages[singleSelectedObj.pages.length - 1]
                  }
                  destinationJSON = [...singleSelectedObj.pages,replaceMeDoenetId]
              }
              if (singleSelectedObj.type == 'order'){
                //Add to Activity's order
                destinationContainingObj = await snapshot.getPromise(authorItemByDoenetId(singleSelectedObj.containingDoenetId));
                ({order:destinationJSON,previousDoenetId} = addToOrder({
                  orderObj:destinationContainingObj.order,
                  needleOrderDoenetId:singleSelectedObj.doenetId,
                  itemToAdd:replaceMeDoenetId})
                )
              }

              let destinationType = destinationContainingObj.type;
              let destinationDoenetId = destinationContainingObj.doenetId;


              //update database
              try {
                let resp = await axios.post('/api/cutCopyAndPasteAPage.php', {
                  isCopy:true,
                  courseId,
                  originalPageDoenetId,
                  sourceType,
                  sourceDoenetId,
                  destinationType,
                  destinationDoenetId,
                  sourceJSON,
                  destinationJSON,
                  clonePageLabel,
                  clonePageParent
                });
                // console.log("resp.data",resp.data)
                if (resp.status < 300) {
                  let insertedPage = {...resp.data.pageInserted}
                  insertedPage['isSelected'] = false;
                  //Insert page
                  set(authorItemByDoenetId(insertedPage.doenetId),insertedPage)
                                    
                  set(authorCourseItemOrderByCourseId(courseId),(prev)=>{
                    let next = [...prev];
                    next.splice(next.indexOf(previousDoenetId)+1,0,insertedPage.doenetId);  //insert
                    return next
                  })
                //Update the doenetId for the new page
                let serializedDestinationJSON = JSON.stringify(destinationJSON);
                serializedDestinationJSON = serializedDestinationJSON.replace(replaceMeDoenetId,insertedPage.doenetId)
                destinationJSON = JSON.parse(serializedDestinationJSON);
                  //Update destination
                if (destinationType == 'bank'){
                  set(authorItemByDoenetId(destinationDoenetId),(prev)=>{
                    let next = {...prev}
                    next.pages = destinationJSON;
                    return next;
                  })
          
                }else if (destinationType == 'activity'){
                      set(authorItemByDoenetId(destinationDoenetId),(prev)=>{
                        let next = {...prev}
                        next.order = destinationJSON;
                        return next;
                      })
                  }
                  

                  
                  successCallback?.();
                  
                } else {
                  throw new Error(`response code: ${resp.status}`);
                }
              } catch (err) {
                failureCallback(err);
              }



            }
          }
        }
  });

  const findPagesFromDoenetIds = useRecoilCallback(
    ({ snapshot }) =>
      async (selectedDoenetIds) => {
        let pagesFound = []
        for (let doenetId of selectedDoenetIds){
          let itemObj = await snapshot.getPromise(authorItemByDoenetId(doenetId));
          if (itemObj.type == 'page'){
            pagesFound.push(itemObj.doenetId)
          } else if (itemObj.type == 'activity'){
            let newPages = findPageDoenetIdsInAnOrder({orderObj:itemObj.order,needleOrderDoenetId:'',foundNeedle:true})
            pagesFound = [...pagesFound,...newPages];
          } else if (itemObj.type == 'order'){
            let containingObj = await snapshot.getPromise(authorItemByDoenetId(itemObj.containingDoenetId));
            let newPages = findPageDoenetIdsInAnOrder({orderObj:containingObj.order,needleOrderDoenetId:itemObj.doenetId,foundNeedle:false})
            pagesFound = [...pagesFound,...newPages];
          } else if (itemObj.type == 'bank'){
            pagesFound = [...pagesFound,...itemObj.pages];
          } else if (itemObj.type == 'section'){
            //Get all doenetId's in the section
            let doenetIdsInSection = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId:itemObj.doenetId}));
            let newPages = await findPagesFromDoenetIds(doenetIdsInSection);
            pagesFound = [...pagesFound,...newPages];

          }

        }

        //deduplicate doenetIds in pagesFound
        pagesFound = [...new Set(pagesFound)];
        return pagesFound;
      })


  return { create, 
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
    findPagesFromDoenetIds,
   };
};
