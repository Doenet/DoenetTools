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
import { fileByPageId, fileByCid } from '../../Tools/_framework/ToolHandlers/CourseToolHandler';
import { UTCDateStringToDate } from '../../_utils/dateUtilityFunction';

const enrollmentAtomByCourseId = atomFamily({
  key:"enrollmentAtomByCourseId",
  default:[],
  effects:courseId => [ ({setSelf, trigger})=>{
    if (trigger == 'get' && courseId){
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

//Recursive Function for order which adds orders to the itemByDoenetId
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
    set(itemByDoenetId(orderObj.doenetId), {
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

          if(data.success) {
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
              set(itemByDoenetId(item.doenetId), localizeDates(item, dateKeys));

              return items
            },[])
            // console.log("init authorCourseItemOrderByCourseId",doenetIds)
            set(authorCourseItemOrderByCourseId(courseId), doenetIds);
          }
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
  const item = useRecoilValue(itemByDoenetId('doenetId'));
  const setCourseId = useSetRecoilState(courseIdAtom);

  useEffect(async () => {

    // if item is found, then we already have the course with doenetId initialized
    if(Object.keys(item).length > 0) {
      return;
    }
  
    const { data } = await axios.get('/api/getCourseIdFromDoenetId.php', {
      params: { doenetId },
    });
  
    if(data.success) {
      setCourseId(data.courseId);
    } else {
      setCourseId("__not_found__")
    }
  
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
        let itemObj = get(itemByDoenetId(doenetId));
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
      let itemObj = get(itemByDoenetId(doenetId));
      //If of type for the student then add to the list
      return itemObj.isAssigned && (itemObj.type == 'activity' || itemObj.type == 'section')
    })

    return studentDoenetIds;
  }
})

export const studentCourseItemOrderByCourseIdBySection = selectorFamily({
  key: 'studentCourseItemOrderByCourseId',
  get:({courseId,sectionId})=> ({get})=>{
    let allStudentDoenetIdsInOrder = get(studentCourseItemOrderByCourseId(courseId));
    let sectionDoenetIds = [];
    let inSection = false;
    let sectionDoenetIdsInSection = [sectionId];
    if (courseId == sectionId || !sectionId){
      sectionDoenetIdsInSection = [courseId]
      inSection = true;
    }
    for (let doenetId of allStudentDoenetIdsInOrder){
      //Found first one so now we are in the section
      if (doenetId == sectionId){
        inSection = true;
        continue;
      }
      if (inSection){
        let itemObj = get(itemByDoenetId(doenetId));
        console.log("itemObj",itemObj)
        if (itemObj.isAssigned && sectionDoenetIdsInSection.includes(itemObj.parentDoenetId)){
          sectionDoenetIds.push(doenetId);
          //If of type which has children then add to the section list
          if (itemObj.type == 'section'){
            sectionDoenetIdsInSection.push(doenetId);
          }

        }else{
          break;  //Can stop after we go up a level because there won't be any more
        }

      }
    }
    return sectionDoenetIds;
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

export const itemByDoenetId = atomFamily({
  key: 'itemByDoenetId',
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
      set(itemByDoenetId(orderObj.doenetId), {
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
      async ({ itemType, parentDoenetId, previousDoenetId, previousContainingDoenetId }) => {

        let authorItemDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseId(courseId));
        let newAuthorItemDoenetIds = [...authorItemDoenetIds];

        let sectionId = await snapshot.getPromise(searchParamAtomFamily('sectionId'));
        if (sectionId == ''){
          sectionId = courseId;
        }
        //If one item is selected
        //SET parentDoenetId, previousDoenetId and previousContainingDoenetId 
        //for when there was no selection
        let selectedArray = await snapshot.getPromise(selectedCourseItems);
        if (selectedArray.length == 1){
          let singleSelectedDoenetId = selectedArray[0];
          // previousDoenetId = singleSelectedDoenetId; //When in insert mode
          let selectedObj = await snapshot.getPromise(itemByDoenetId(singleSelectedDoenetId))
          if (selectedObj.type == 'section' ){
            //Find last item in section
            let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId:singleSelectedDoenetId}));
            let lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
            
            parentDoenetId = singleSelectedDoenetId;
            previousDoenetId = lastItemInSelectedSectionDoenetId
            if (!lastItemInSelectedSectionDoenetId){
              //Empty section so previous is the section itself
              previousDoenetId = singleSelectedDoenetId
              previousContainingDoenetId = singleSelectedDoenetId
            }else{
              //there are items in the section
              let lastItemInSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId))
              previousDoenetId = lastItemInSelectedSectionDoenetId;
              if (lastItemInSectionObj.type == 'page' || lastItemInSectionObj.type == 'order'){
                previousContainingDoenetId = lastItemInSectionObj.containingDoenetId;
              }else if (lastItemInSectionObj.type == 'bank' || lastItemInSectionObj.type == 'section'){
                previousContainingDoenetId = lastItemInSelectedSectionDoenetId
              }

            }
          }else if (selectedObj.type == 'activity' ||  selectedObj.type == 'bank'){
            parentDoenetId = selectedObj.parentDoenetId;
            let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId:parentDoenetId}));
            let lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
            //there are items in the section
            let lastItemInSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId))
            previousDoenetId = lastItemInSelectedSectionDoenetId;
            if (lastItemInSectionObj.type == 'page' || lastItemInSectionObj.type == 'order'){
              previousContainingDoenetId = lastItemInSectionObj.containingDoenetId;
            }else if (lastItemInSectionObj.type == 'bank' || lastItemInSectionObj.type == 'section'){
              previousContainingDoenetId = lastItemInSelectedSectionDoenetId
            }
          }else if (selectedObj.type == 'page' ||  selectedObj.type == 'order'){
            let selectedItemsContainingObj = await snapshot.getPromise(itemByDoenetId(selectedObj.containingDoenetId))
            parentDoenetId = selectedItemsContainingObj.parentDoenetId;
            let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId:parentDoenetId}));
            let lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
            //there are items in the section
            let lastItemInSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId))
            previousDoenetId = lastItemInSelectedSectionDoenetId;
            if (lastItemInSectionObj.type == 'page' || lastItemInSectionObj.type == 'order'){
              previousContainingDoenetId = lastItemInSectionObj.containingDoenetId;
            }else if (lastItemInSectionObj.type == 'bank' || lastItemInSectionObj.type == 'section'){
              previousContainingDoenetId = lastItemInSelectedSectionDoenetId
            }
          }
        }

        //SET parentDoenetId, previousDoenetId and previousContainingDoenetId 
        //for when there was no selection
        if (previousDoenetId == undefined){
          //Find last item in section
          let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId}));
          let lastItemInSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];

          parentDoenetId = sectionId; //parent when nothing selected will always be sectionId
          if (lastItemInSectionDoenetId == undefined){
            //No items in this section so parent and previous are the section
            previousDoenetId = sectionId;
            previousContainingDoenetId = sectionId;
          }else{
            //Nothing selected 
            previousDoenetId = lastItemInSectionDoenetId; 
            let lastItemObj = await snapshot.getPromise(itemByDoenetId(lastItemInSectionDoenetId));
            if (lastItemObj.type == 'page' || lastItemObj.type == 'order'){
              previousContainingDoenetId = lastItemObj.containingDoenetId;
            }else if (lastItemObj.type == 'bank' || lastItemObj.type == 'section'){
              previousContainingDoenetId = lastItemObj.doenetId;
            }

          }
        }

        // console.log("WHERE IS IT GOING?")
        // console.log("itemType",itemType)
        // console.log("parentDoenetId",parentDoenetId)
        // console.log("previousDoenetId",previousDoenetId)
        // console.log("previousContainingDoenetId",previousContainingDoenetId)

  
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
              parentDoenetId,
          });
          // console.log('activityData', data);
          let createdActivityDoenentId = data.doenetId;
          newDoenetId = createdActivityDoenentId;
          //Activity
          set(itemByDoenetId(createdActivityDoenentId), {
            //Defaults for future assignment settings
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
            ...data.itemEntered,
          });

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
          set(itemByDoenetId(createdOrderDoenetId), createdOrderObj); 

          //Page
          let createdPageObj = {
            ...data.pageEntered,
            parentDoenetId:createdOrderDoenetId
          }
          set(itemByDoenetId(data.pageDoenetId), createdPageObj); 

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
              parentDoenetId,
          });
          // console.log('bankData', data);
          newDoenetId = data.doenetId;
          set(itemByDoenetId(data.doenetId), data.itemEntered);
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
              parentDoenetId
          });
          // console.log("sectionData",data)
          newDoenetId = data.doenetId;
          set(itemByDoenetId(data.doenetId), data.itemEntered);
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
          const selectedItemObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetId));
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
            
            set(itemByDoenetId(newActivityObj.doenetId),newActivityObj)
            let newItemDoenetId = orderDoenetIdThatWasCreated;
            if (itemType == 'page'){
              set(itemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
              newItemDoenetId = pageThatWasCreated.doenetId;
            }else if (itemType == 'order'){
              orderObj = {...orderObj,
                isOpen:false,
                isSelected:false,
                containingDoenetId: selectedItemObj.doenetId,
                parentDoenetId:selectedItemObj.order.doenetId
              }
              set(itemByDoenetId(orderObj.doenetId),orderObj)
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
           

            set(itemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
            set(itemByDoenetId(newCollectionObj.doenetId),newCollectionObj)
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
            const containingItemObj = await snapshot.getPromise(itemByDoenetId(selectedItemObj.containingDoenetId));

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
              set(itemByDoenetId(newActivityObj.doenetId),newActivityObj)
              let newItemDoenetId = orderDoenetIdThatWasCreated;
              if (itemType == 'page'){
                set(itemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
                newItemDoenetId = pageThatWasCreated.doenetId;
              }else if (itemType == 'order'){
                set(itemByDoenetId(orderObj.doenetId),orderObj)
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
            const containingItemObj = await snapshot.getPromise(itemByDoenetId(selectedItemObj.containingDoenetId));
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
           
              
            set(itemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
            set(itemByDoenetId(newCollectionObj.doenetId),newCollectionObj)
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
   
              set(itemByDoenetId(newActivityObj.doenetId),newActivityObj)
              let newItemDoenetId = orderDoenetIdThatWasCreated;
              if (itemType == 'page'){
                set(itemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
                newItemDoenetId = pageThatWasCreated.doenetId;
              }else if (itemType == 'order'){
                set(itemByDoenetId(orderObj.doenetId),orderObj)
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
          set(itemByDoenetId(cutObj.doenetId),(prev)=>{
            let next = {...prev};
            next['isBeingCut'] = false;
            return next;
          })
        }
        set(cutCourseItems,[]);
        set(copiedCourseItems,[]);


      let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId))
      let resp = await axios.get('/api/renameCourseItem.php', {params:{ courseId,doenetId,newLabel,type:itemObj.type } });
      if (resp.status < 300) {
        let updatedItem = resp.data.item;
        if (itemObj.type !== 'page'){
          updatedItem.isOpen = itemObj.isOpen;
        }
        set(itemByDoenetId(doenetId),(prev)=>{
          let next = {...prev}
          next.label = updatedItem.label;
          return next
        });
        
        // updatedItem.isSelected = itemObj.isSelected;
        // set(itemByDoenetId(doenetId),updatedItem);

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

        set(itemByDoenetId(doenetId),(prev)=>{
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

          let pageDoenetML = (await snapshot.getPromise(fileByPageId(pageDoenetId)));

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

        let activity = await snapshot.getPromise(itemByDoenetId(activityDoenetId));

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

        let childrenString ="";
        try {
          childrenString = (await Promise.all(activity.order.content
            .map(x => contentToDoenetML({ content: x, indentLevel: 1 }))))
            .join("");
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
            set(itemByDoenetId(activityDoenetId), (prev) => {
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
        let orderObj = await snapshot.getPromise(itemByDoenetId(doenetId));
        let activityObj = await snapshot.getPromise(itemByDoenetId(orderObj.containingDoenetId))
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
        set(itemByDoenetId(orderObj.containingDoenetId),nextActivityObj)
   
        set(itemByDoenetId(doenetId),(prev)=>{
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
        let itemToDeleteObj = await snapshot.getPromise(itemByDoenetId(doenetId));
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
          let containingObj = await snapshot.getPromise(itemByDoenetId(itemToDeleteObj.containingDoenetId))
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
          let containingObj = await snapshot.getPromise(itemByDoenetId(itemToDeleteObj.containingDoenetId))
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
            let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
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
      set(itemByDoenetId(collectionDoenetId),(prev)=>{
        let next = {...prev}
        next.pages = collectionJson;
        return next;
      })
      
     }
     for (let [i,activitiesJsonDoenetId] of Object.entries(activitiesJsonDoenetIds)){
      let activityJson = activitiesJson[i];
      set(itemByDoenetId(activitiesJsonDoenetId),(prev)=>{
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
      set(itemByDoenetId(doenetId),(prev)=>{
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
          let selectedObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetId));
          copiedCourseItemsObjs.push(selectedObj);
        }
        set(copiedCourseItems,copiedCourseItemsObjs)
        //Set isBeingCut back to false
        let cutObjs = await snapshot.getPromise(cutCourseItems);
        for (let cutObj of cutObjs){
          set(itemByDoenetId(cutObj.doenetId),(prev)=>{
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
        //Clear out cut items
        let cutObjs = await snapshot.getPromise(cutCourseItems);
        for (let cutObj of cutObjs){
          set(itemByDoenetId(cutObj.doenetId),(prev)=>{
            let next = {...prev}
            next['isBeingCut'] = false;
            return next;
          })
        }
        set(cutCourseItems,[]);

        //Set all items to cut mode
        let selectedDoenetIds = await snapshot.getPromise(selectedCourseItems);
        let cutCourseItemsObjs = [];
        for (let selectedDoenetId of selectedDoenetIds){
          let selectedObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetId));
          cutCourseItemsObjs.push(selectedObj);
          let nextItem = {...selectedObj};
          nextItem['isBeingCut'] = true;
          set(itemByDoenetId(selectedDoenetId),nextItem)
        }
        set(cutCourseItems,cutCourseItemsObjs)
        successCallback();
  });

  const pasteItems = useRecoilCallback(
    ({ set,snapshot }) =>
      async ({successCallback, failureCallback = defaultFailure}) => {

        //Given a containing DoenetId get all the associated doenetIds
        async function getIds(doenetId,itemObj=null){
          let allIds = [doenetId];
          if (!itemObj){
            itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
          }
          if (itemObj.type == 'activity'){
            let activityIds = await getIds(itemObj.order.doenetId,itemObj.order)
            allIds = [...allIds,...activityIds]
          }else if (itemObj.type == 'order'){
            let orderIds = []
            for (let id of itemObj.content){
              if (id?.type == 'order'){
                let subOrderIds = await getIds(itemObj.doenetId,id)
                orderIds = [...orderIds,...subOrderIds]
              }else{
                orderIds.push(id)
              }
            }
            allIds = [...allIds,...orderIds]
          }else if (itemObj.type == 'bank'){
            allIds = [...allIds,...itemObj.pages]
          }else if (itemObj.type == 'section'){
            let sectionIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId:doenetId}))
            allIds = [...allIds,...sectionIds]
          }
          return allIds;
        }

        async function getContainingIds(sectionDoenetId){
          let containingIds = [];
          let sectionIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId:sectionDoenetId}))
          for (let id of sectionIds){
            let itemObj = await snapshot.getPromise(itemByDoenetId(id));
            if (itemObj.type == 'bank' || 
            itemObj.type == 'activity' 
            ){
              containingIds.push(id)
            }else if (itemObj.type == 'section'){
              let subSectionIds = await getContainingIds(id);
              containingIds = [...containingIds,id,...subSectionIds];
            }
          }
          return containingIds;
        }


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
        let destParentDoenetId = sectionId;
        let destPreviousItemDoenetId;
        let destPreviousContainingItemDoenetId;
        let destType = "section";
        let destinationContainingObj;
        //Update parentDoenetId if single selection
        if (selectedDoenetIds.length == 1){
          singleSelectedObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetIds[0]));
          destType = singleSelectedObj.type;
          if (singleSelectedObj.type == 'section'){
            destParentDoenetId = singleSelectedObj.doenetId;
          }else if (singleSelectedObj.type == 'activity' || singleSelectedObj.type == 'bank'){
            destinationContainingObj = {...singleSelectedObj}
            destParentDoenetId = singleSelectedObj.parentDoenetId;
          }else if (singleSelectedObj.type == 'order' || singleSelectedObj.type == 'page'){
            let selectedContainingObj = await snapshot.getPromise(itemByDoenetId(singleSelectedObj.containingDoenetId));
            destinationContainingObj = {...selectedContainingObj}
            destParentDoenetId = selectedContainingObj.parentDoenetId;
          }
          //define destPreviousContainingItemDoenetId from destParentDoenetId
          let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId:destParentDoenetId}));
          let lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
          let lastItemInSelectedSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId));
          destPreviousItemDoenetId = lastItemInSelectedSectionDoenetId;
          if (!lastItemInSelectedSectionDoenetId){
            //If none in selected section then use the section itself
            lastItemInSelectedSectionDoenetId = destParentDoenetId;
            lastItemInSelectedSectionObj = await snapshot.getPromise(itemByDoenetId(destParentDoenetId));
          }
          if (lastItemInSelectedSectionObj.type == 'section' || 
            lastItemInSelectedSectionObj.type == 'bank' ||
            lastItemInSelectedSectionObj.type == 'activity'
          ){
            destPreviousContainingItemDoenetId = lastItemInSelectedSectionDoenetId
          }else if (lastItemInSelectedSectionObj.type == 'order' || 
                  lastItemInSelectedSectionObj.type == 'page'
          ){
            destPreviousContainingItemDoenetId = lastItemInSelectedSectionObj.containingDoenetId;
          }
          
        }else if (selectedDoenetIds.length > 1){
          failureCallback("Can only paste to one location.")
          return;
        }else{
          //define destPreviousItemDoenetId and destPreviousContainingItem when nothing is selected
          let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId}));
          let lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
          destPreviousItemDoenetId = lastItemInSelectedSectionDoenetId
          let lastItemInSelectedSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId));
          if (lastItemInSelectedSectionObj.type == 'section' || 
            lastItemInSelectedSectionObj.type == 'bank' ||
            lastItemInSelectedSectionObj.type == 'activity'
          ){
            destPreviousContainingItemDoenetId = lastItemInSelectedSectionDoenetId
          }else if (lastItemInSelectedSectionObj.type == 'order' || 
                  lastItemInSelectedSectionObj.type == 'page'
          ){
            destPreviousContainingItemDoenetId = lastItemInSelectedSectionObj.containingDoenetId;
          }
        }
        if (!destPreviousItemDoenetId){
          //Empty section
          destPreviousItemDoenetId = destParentDoenetId;
        }

        //Paste the cut items 
        if (cutObjs.length > 0){

          let doenetIdsToMove = [];
          let noParentUpdateDoenetIds = [];
          let sourcePagesAndOrdersToMove = [];
          //Test if cut orders and pages can go in destination
          for (let cutObj of cutObjs){
            if ((destType == 'section' ||
            destType == 'activity' ) && 
            (cutObj.type == 'page' ||
            cutObj.type == 'order'
            )
            ){
              failureCallback(`Pasting ${cutObj.type} in a ${destType} is not supported.`)
              return;
            }
            if (cutObj.type == 'order' ){
              failureCallback("Pasting orders is not yet supported")
              return;
            }
            if (destType == 'bank' && cutObj.type == 'order' ){
              failureCallback("Collections can only accept pages.")
              return;
            }
            // if (destType == 'activity' && 
            //   (cutObj.type == 'activity' ||
            //   cutObj.type == 'section' ||
            //   cutObj.type == 'bank' 
            //   )
            // ){
            //   failureCallback("Activities can only accept orders or pages.")
            //   return;
            // }
            // if (destType == 'order' && cutObj.type != 'page' ){
            //   failureCallback("Orders can only accept pages.")
            //   return;
            // }
            if (cutObj.type == 'activity' || cutObj.type == 'bank'){
              doenetIdsToMove.push(cutObj.doenetId);
            }
            if (cutObj.type == 'section'){
              //The code shouldn't change the parentDoenetId of the items in sections
              let additionalNoParentUpdateDoenetIds = await getContainingIds(cutObj.doenetId)
              //Deduplicate
              additionalNoParentUpdateDoenetIds = [...new Set(additionalNoParentUpdateDoenetIds)]
              noParentUpdateDoenetIds = [...noParentUpdateDoenetIds,...additionalNoParentUpdateDoenetIds]
              doenetIdsToMove = [...doenetIdsToMove,cutObj.doenetId,...additionalNoParentUpdateDoenetIds]
            }
            if (cutObj.type == 'order' || cutObj.type == 'page'){
              sourcePagesAndOrdersToMove.push({...cutObj})
            }

          }
          if (sourcePagesAndOrdersToMove.length > 0 && doenetIdsToMove.length > 0 ){
            failureCallback("Can't paste pages or orders with other types.")
            return;
          }
      

        if (doenetIdsToMove.length > 0){
          //update the database for containing objects
          try {
            let resp = await axios.post('/api/moveContent.php',{
              courseId,
              doenetIdsToMove,
              destParentDoenetId,
              destPreviousContainingItemDoenetId,
              noParentUpdateDoenetIds,
            })
            // console.log("moveContent resp.data",resp.data)
            if (resp.status < 300) {
              //update each containing item with new parentId 
              //and turn off selection and isBeingCut
              for (let doenetId of doenetIdsToMove){
                set(itemByDoenetId(doenetId),(prevObj)=>{
                  let nextObj = {...prevObj}
                  nextObj["isBeingCut"] = false;
                  nextObj["isSelected"] = false;
                  if (!noParentUpdateDoenetIds.includes(doenetId)){
                    nextObj.parentDoenetId = destParentDoenetId;
                  }
                  return nextObj
                }); 
              }

              //stack all doenetIds associated with the move
              let sortedDoenetIdsToMove = [];
              for (let doenetId of doenetIdsToMove){
                let associatedIds = await getIds(doenetId)
                sortedDoenetIdsToMove = [...sortedDoenetIdsToMove,...associatedIds];
              }
              //Deduplicate
              sortedDoenetIdsToMove = [...new Set(sortedDoenetIdsToMove)]
              // console.log("sortedDoenetIdsToMove",sortedDoenetIdsToMove)
              //update author order with the changes 
              //remove from old positions
              //add as a stack to the new position
              set(authorCourseItemOrderByCourseId(courseId),(prevObj)=>{
                let nextObj = [...prevObj];
                nextObj = nextObj.filter((value)=>!sortedDoenetIdsToMove.includes(value))
                let insertIndex = nextObj.indexOf(destPreviousItemDoenetId)+1;
                if (insertIndex == 0){
                  //Not found so backtrack to find the closest
                  let indexPreviousToPrevious = prevObj.indexOf(destPreviousItemDoenetId) -1
                  let needle = prevObj[indexPreviousToPrevious];
                  while (indexPreviousToPrevious > 0 && !nextObj.includes(needle)){
                    indexPreviousToPrevious--
                    needle = prevObj[indexPreviousToPrevious];
                  }
                  insertIndex = indexPreviousToPrevious + 1;
                }
                nextObj.splice(insertIndex,0,...sortedDoenetIdsToMove)
                return nextObj;
              })
            successCallback?.();
            } else {
              throw new Error(`response code: ${resp.status}`);
            }
          } catch (err) {
            failureCallback(err);
          }
        }
        if (sourcePagesAndOrdersToMove.length > 0){
          let destinationType = destinationContainingObj.type;
          let destinationDoenetId = destinationContainingObj.doenetId;
          let destinationJSON;
          if (destinationType == 'bank'){
            destinationJSON = [...destinationContainingObj.pages];
          }else if (destinationType == 'activity'){
            destinationJSON = {...destinationContainingObj.order};
          }
          let sourceTypes = []
          let sourceDoenetIds = []
          let sourceJSONs = []
          let originalPageDoenetIds = []
          let previousDoenetId;
          for (let cutObj of sourcePagesAndOrdersToMove){
            let sourceContainingDoenetId = cutObj.containingDoenetId
            let indexOfPriorEntry = sourceDoenetIds.indexOf(sourceContainingDoenetId)
            //if already in in sourceDoenetIds then update that index
            if (indexOfPriorEntry == -1){
              originalPageDoenetIds.push([cutObj.doenetId]);
              
              sourceDoenetIds.push(sourceContainingDoenetId)
              let containingObj = await snapshot.getPromise(itemByDoenetId(sourceContainingDoenetId))
              sourceTypes.push(containingObj.type);
              let updatedSourceItemJSON =  {}
              if (containingObj.type == 'activity'){
                //Remove from Activity
                updatedSourceItemJSON = deletePageFromOrder({orderObj:containingObj.order,needleDoenetId:cutObj.doenetId})
                //if source is destination delete page from destination
                if (destinationContainingObj.doenetId == containingObj.doenetId){
                  destinationJSON = deletePageFromOrder({orderObj:destinationJSON,needleDoenetId:cutObj.doenetId})
                }
              }else if (containingObj.type == 'bank'){
                //Remove from Collection
                let nextPages = [...containingObj.pages]
                nextPages.splice(containingObj.pages.indexOf(cutObj.doenetId),1)
                updatedSourceItemJSON = nextPages;
                //if source is destination delete page from destination
                if (destinationContainingObj.doenetId == containingObj.doenetId){
                  let nextDestPages = [...destinationJSON]
                  nextDestPages.splice(destinationJSON.indexOf(cutObj.doenetId),1)
                  destinationJSON = nextDestPages;
                }
              }
              sourceJSONs.push(updatedSourceItemJSON)
            }else{
              //Only update not add 
              originalPageDoenetIds[indexOfPriorEntry].push(cutObj.doenetId);

              let containingObjtype = sourceTypes[indexOfPriorEntry];
              let previousObj = sourceJSONs[indexOfPriorEntry];
              let updatedSourceItemJSON =  {}
              if (containingObjtype == 'activity'){
                //Remove from Activity
                updatedSourceItemJSON = deletePageFromOrder({orderObj:previousObj,needleDoenetId:cutObj.doenetId})
                //if source is destination delete page from destination
                if (destinationContainingObj.doenetId == cutObj.containingDoenetId){
                  destinationJSON = deletePageFromOrder({orderObj:destinationJSON,needleDoenetId:cutObj.doenetId})
                }
              }else if (containingObjtype == 'bank'){
                //Remove from Collection
                let nextPages = [...previousObj]
                nextPages.splice(previousObj.indexOf(cutObj.doenetId),1)
                updatedSourceItemJSON = nextPages;
                if (destinationContainingObj.doenetId == cutObj.containingDoenetId){
                  let nextDestPages = [...destinationJSON]
                  nextDestPages.splice(destinationJSON.indexOf(cutObj.doenetId),1)
                  destinationJSON = nextDestPages;
                }
              }
              sourceJSONs[indexOfPriorEntry] = updatedSourceItemJSON
            }
            // sourceTypes.push(cutObj.containingDoenetId)
            //Add to destination
            if (destinationType == 'bank'){
              destinationJSON.push(cutObj.doenetId)
              //find last item in the bank
            }else if (destinationType == 'activity'){
              let orderDoenetIdToAddToDoenetId = singleSelectedObj.doenetId;
              if (singleSelectedObj.type == 'page'){
                orderDoenetIdToAddToDoenetId = singleSelectedObj.parentDoenetId;
              }
              // console.log(">>orderDoenetIdToAddToDoenetId",orderDoenetIdToAddToDoenetId)
              // ({order:destinationJSON,previousDoenetId} = addToOrder({
                ({order:destinationJSON,previousDoenetId} = addToOrder({
                orderObj:destinationJSON,
                needleOrderDoenetId:orderDoenetIdToAddToDoenetId,
                itemToAdd:cutObj.doenetId})
              )
            }
          }


          let previousDoenetIdForPages = previousDoenetId;
          if (!previousDoenetIdForPages){
            if (singleSelectedObj.type == 'bank'){
              if (singleSelectedObj.pages.length == 0){
                previousDoenetIdForPages = singleSelectedObj.doenetId
              }else{
                previousDoenetIdForPages = singleSelectedObj.pages[singleSelectedObj.pages.length - 1];
              }
            }else if (singleSelectedObj.type == 'page'){
              //Only need to handle collection case as orders are handled above
              let collectionObj = await snapshot.getPromise(itemByDoenetId(singleSelectedObj.containingDoenetId));
              if (collectionObj.pages.length == 0){
                previousDoenetIdForPages = collectionObj.doenetId
              }else{
                previousDoenetIdForPages = collectionObj.pages[collectionObj.pages.length - 1];
              }
            }

          }


          
        // console.log("\n-----------------------")
        // console.log("Cut and Paste pages and orders")
        // console.log("-----------------------")
        // console.log("originalPageDoenetIds",originalPageDoenetIds)
        // console.log("sourceTypes",sourceTypes)
        // console.log("sourceDoenetIds",sourceDoenetIds)
        // console.log("sourceJSONs",sourceJSONs)
        // console.log("destParentDoenetId",destParentDoenetId)
        // console.log("destPreviousContainingItemDoenetId",destPreviousContainingItemDoenetId)
        // console.log("destPreviousItemDoenetId",destPreviousItemDoenetId)

        // console.log("destinationType",destinationType)
        // console.log("destinationDoenetId",destinationDoenetId)
        // console.log("destinationJSON",destinationJSON)
        // console.log("previousDoenetId",previousDoenetId)
        // console.log("previousDoenetIdForPages",previousDoenetIdForPages)
        
        // console.log("-----------------------\n")

        //update database
        try {
          let resp = await axios.post('/api/cutCopyAndPasteAPage.php', {
            isCopy:false,
            courseId,
            originalPageDoenetIds,
            sourceTypes,
            sourceDoenetIds,
            sourceJSONs,
            destinationType,
            destinationDoenetId,
            destinationJSON,
          });
          // console.log("!!!!!!!!cutCopyAndPasteAPage resp.data",resp.data)
          if (resp.status < 300) {
          



          let nextPagesParentDoenetId;
          if (singleSelectedObj.type == 'order' || singleSelectedObj.type == 'bank'){
            nextPagesParentDoenetId = singleSelectedObj.doenetId;
          }else if (singleSelectedObj.type == 'page'){
            nextPagesParentDoenetId = singleSelectedObj.parentDoenetId;
          }
          let setOfOriginalPageDoenetIds = []
          for (let [i,sourceType] of Object.entries(sourceTypes)){
            let sourceDoenetId = sourceDoenetIds[i]
            let sourceJSON = sourceJSONs[i];

            //Update source
            if (sourceType == 'bank'){
              set(itemByDoenetId(sourceDoenetId),(prev)=>{
                let next = {...prev}
                next.pages = sourceJSON;
                return next;
              })
            } else if (sourceType == 'activity'){
              set(itemByDoenetId(sourceDoenetId),(prev)=>{
                let next = {...prev}
                next.order = sourceJSON;
                return next;
              })
            }
            for(let originalPageDoenetId of originalPageDoenetIds[i]){
              setOfOriginalPageDoenetIds.push(originalPageDoenetId);
              //Update pages
              set(itemByDoenetId(originalPageDoenetId),(prev)=>{
                let next = {...prev}
                next.containingDoenetId = destinationDoenetId;
                next.parentDoenetId = nextPagesParentDoenetId;
                next.isBeingCut = false
                return next;
              })
            }

          }

            //Update destination
              if (destinationType == 'bank'){
                set(itemByDoenetId(destinationDoenetId),(prev)=>{
                  let next = {...prev}
                  next.pages = destinationJSON;
                  return next;
                })
              }else if (destinationType == 'activity'){
                set(itemByDoenetId(destinationDoenetId),(prev)=>{
                  let next = {...prev}
                  next.order = destinationJSON;
                  return next;
                })
            }
            set(authorCourseItemOrderByCourseId(courseId),(prev)=>{
              let next = [...prev];
              for (let doenetId of setOfOriginalPageDoenetIds){
                  next.splice(next.indexOf(doenetId),1);  //remove 
              }
              let insertIndex = next.indexOf(previousDoenetIdForPages)+1;
              if (insertIndex == 0){
                //Not found so backtrack to find the closest
                let indexPreviousToPrevious = prev.indexOf(previousDoenetIdForPages) -1
                let needle = prev[indexPreviousToPrevious];
                while (indexPreviousToPrevious > 0 && !next.includes(needle)){
                  indexPreviousToPrevious--
                  needle = prev[indexPreviousToPrevious];
                }
                insertIndex = indexPreviousToPrevious + 1;
              }
              next.splice(insertIndex,0,...setOfOriginalPageDoenetIds);  //insert
              return next
            })



            successCallback?.();
            //Update recoil
            // set(itemByDoenetId(cutObj.doenetId),nextObj); //TODO: set using function and transfer nextObj key by key
            
            
          } else {
            throw new Error(`response code: ${resp.status}`);
          }
        } catch (err) {
          failureCallback(err);
        }
        }

          
          //Transfer cut to copy so we don't get duplicate doenetIds
          set(copiedCourseItems,[...cutObjs])
          set(cutCourseItems,[]);
          return;
        }

  });

  const findPagesFromDoenetIds = useRecoilCallback(
    ({ snapshot }) =>
      async (selectedDoenetIds) => {
        let pagesFound = []
        for (let doenetId of selectedDoenetIds){
          let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
          if (itemObj.type == 'page'){
            pagesFound.push(itemObj.doenetId)
          } else if (itemObj.type == 'activity'){
            let newPages = findPageDoenetIdsInAnOrder({orderObj:itemObj.order,needleOrderDoenetId:'',foundNeedle:true})
            pagesFound = [...pagesFound,...newPages];
          } else if (itemObj.type == 'order'){
            let containingObj = await snapshot.getPromise(itemByDoenetId(itemObj.containingDoenetId));
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
