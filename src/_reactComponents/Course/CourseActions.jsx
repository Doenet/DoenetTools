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
import { useValidateEmail } from '../../_utils/hooks/useValidateEmail';

const peopleAtomByCourseId = atomFamily({
  key:"peopleAtomByCourseId",
  default:[],
  effects:courseId => [ ({setSelf, trigger})=>{
    if (trigger == 'get' && courseId){
      axios.get('/api/loadCoursePeople.php', { params: { courseId } })
      .then(resp=>{
        setSelf(resp.data.peopleArray)
      })
    } 
  },
  ]
})

export const peopleByCourseId = selectorFamily({
  key:"peopleByCourseId",
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
            set(peopleAtomByCourseId(courseId),
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
          set(peopleAtomByCourseId(courseId),
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

    const recoilMergeData = getCallback(({set})=> async (payload, successCallback)=>{
      try {
        let {data: {success, peopleArray, message}} = await axios.post('/api/mergePeopleData.php', {...payload, courseId});
        if (success) {
          set(peopleAtomByCourseId(courseId),peopleArray);
          successCallback?.()
        } else {
          throw new Error(message);
        }
      } catch (err) {
        //TODO (Emilio): toast
      }
    
    })

    return {
      value:get(peopleAtomByCourseId(courseId)),
      recoilWithdraw,
      recoilUnWithdraw,
      recoilMergeData
    };
  },

})

function buildDoenetIdToParentDoenetIdObj(contentArray,parentDoenetId=null){
  let returnObj = {}
  for (let item of contentArray){
    if (item?.type == "order"){
      let childObj = buildDoenetIdToParentDoenetIdObj(item.content,item.doenetId);
      returnObj = {...childObj,...returnObj}
    }else if (parentDoenetId !== null){
      returnObj[item] = parentDoenetId;
    }
  }
  return returnObj;
}

export function findFirstPageOfActivity(content = []){
  let response = null;

  for (let item of content){

    if (typeof item === 'string' || item instanceof String){
      //First content is a string so return the doenetId
      response = item;
      break;
    }else{
      //First item of content is another order
      let nextOrderResponse = findFirstPageOfActivity(item.content);
    
      if (typeof nextOrderResponse === 'string' || nextOrderResponse instanceof String){
        response = nextOrderResponse;
        break;
      }
    }
  }

  return response; //if didn't find any pages

}

//Recursive Function for order which adds orders to the itemByDoenetId
function findOrderAndPageDoenetIdsAndSetOrderObjs({set,contentArray,assignmentDoenetId,orderDoenetId=null}){
  let orderAndPagesDoenetIds = [];
   
    for (let item of contentArray){
      if (item?.type == 'order'){
         //Store order objects for UI
    let numberToSelect = item.numberToSelect;
    if (numberToSelect == undefined){
      numberToSelect = 1;
    }
    let withReplacement = item.withReplacement;
    if (withReplacement == undefined){
      withReplacement = false;
    }
    let parentDoenetId = orderDoenetId;
    if (orderDoenetId == null){
      parentDoenetId = assignmentDoenetId;
    }
    set(itemByDoenetId(item.doenetId), {
      type: "order",
      doenetId: item.doenetId, 
      behavior:item.behavior,
      numberToSelect,
      withReplacement,
      containingDoenetId:assignmentDoenetId,
      isOpen:false,
      isSelected:false,
      parentDoenetId
    });
    orderAndPagesDoenetIds.push(item.doenetId);
        let moreOrderDoenetIds = findOrderAndPageDoenetIdsAndSetOrderObjs({set,contentArray:item.content,assignmentDoenetId,orderDoenetId:item.doenetId});
        orderAndPagesDoenetIds = [...orderAndPagesDoenetIds,...moreOrderDoenetIds];
      }else if (item?.type == 'collectionLink'){
      //Store order objects for UI
 
      let parentDoenetId = orderDoenetId;
      if (orderDoenetId == null){
        parentDoenetId = assignmentDoenetId;
      }
      set(itemByDoenetId(item.doenetId), {
        type:"collectionLink",
        doenetId:item.doenetId, 
        containingDoenetId:assignmentDoenetId,
        collectionDoenetId:item.collectionDoenetId,
        isManuallyFiltered:item.isManuallyFiltered,
        pages:item.pages,
        manuallyFilteredPages:item.manuallyFilteredPages,
        label:item.label,
        isOpen:false,
        isSelected:false,
        parentDoenetId
      });
      orderAndPagesDoenetIds.push(item.doenetId);
      let linkPages = [...item.pages]
      if (item.isManuallyFiltered){
        linkPages = [...item.manuallyFilteredPages]
      }
      orderAndPagesDoenetIds = [...orderAndPagesDoenetIds,...linkPages]

      }else{
        //Page 
        orderAndPagesDoenetIds = [...orderAndPagesDoenetIds,item];
      }
    }
  return orderAndPagesDoenetIds;
}

export function findPageDoenetIdsInAnOrder({content,needleOrderDoenetId,foundNeedle=false}){
  let pageDoenetIds = [];

    for (let item of content){
      if (item?.type == 'order'){
        let morePageDoenetIds;
        if (foundNeedle || item.doenetId == needleOrderDoenetId){
          morePageDoenetIds = findPageDoenetIdsInAnOrder({content:item.content,needleOrderDoenetId,foundNeedle:true})
        }else{
          morePageDoenetIds = findPageDoenetIdsInAnOrder({content:item.content,needleOrderDoenetId,foundNeedle})
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

export function findPageIdsInContentArray({content,needleOrderDoenetId,foundNeedle=false}){
  let pageDoenetIds = [];

    for (let item of content){
      if (item?.type == 'order'){
        let morePageDoenetIds;
        if (foundNeedle || item.doenetId == needleOrderDoenetId){
          morePageDoenetIds = findPageIdsInContentArray({content:item.content,needleOrderDoenetId,foundNeedle:true})
        }else{
          morePageDoenetIds = findPageIdsInContentArray({content:item.content,needleOrderDoenetId,foundNeedle})
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
          // console.log("getCourseItems.php data",data)
          if(data.success) {
            //DoenetIds depth first search and going into json structures
            // console.log("data",data)
            //TODO: make more efficent for student only view
            let pageDoenetIdToParentDoenetId = {};
            let doenetIds = data.items.reduce((items,item)=>{
              if (item.type !== 'page' && item.type !== 'pageLink'){
                items.push(item.doenetId)
              }
              if (item.type === 'activity'){
                //TODO: needs testing with orders
                let newPageDoenetIdToParentDoenetId = buildDoenetIdToParentDoenetIdObj(item.content,item.doenetId);
                pageDoenetIdToParentDoenetId = {...pageDoenetIdToParentDoenetId,...newPageDoenetIdToParentDoenetId}
               
                let ordersAndPagesIds = findOrderAndPageDoenetIdsAndSetOrderObjs({
                  set,
                  contentArray:item.content,
                  assignmentDoenetId:item.doenetId
                });
                // console.log(">>>>ordersAndPagesIds",ordersAndPagesIds)
                if (!item.isSinglePage){
                  items = [...items,...ordersAndPagesIds];
                }
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
              // console.log("item",item.doenetId,localizeDates(item, dateKeys))

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

  useEffect(() => {

    // if item is found, then we already have the course with doenetId initialized
    if(Object.keys(item).length > 0) {
      return;
    }
  
    axios.get('/api/getCourseIdFromDoenetId.php', {
      params: { doenetId },
    }).then(({data}) => {
      if(data.success) {
        setCourseId(data.courseId);
      } else {
        setCourseId("__not_found__")
      }
    }).catch(console.error)
  

  }, [doenetId])

}

export const courseIdAtom = atom({
  key: 'courseIdAtom',
  default: null
})

export const authorCollectionsByCourseId = selectorFamily({
  key: 'authorCollectionsByCourseId',
  get:(courseId)=> ({get})=>{
    let allDoenetIdsInOrder = get(authorCourseItemOrderByCourseId(courseId));

    let collectionDoenetIds = [];
    
    for (let doenetId of allDoenetIdsInOrder){
      let itemObj = get(itemByDoenetId(doenetId));
      if (itemObj.type == 'bank'){
        collectionDoenetIds.push({label:itemObj.label,doenetId})
      }
    }
    return collectionDoenetIds;
  }
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
        if (itemObj.isAssigned && sectionDoenetIdsInSection.includes(itemObj.parentDoenetId)){
          sectionDoenetIds.push(doenetId);
          //If of type which has children then add to the section list
          if (itemObj.type == 'section'){
            sectionDoenetIdsInSection.push(doenetId);
          }

        }else{
          continue;
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


const unfilteredCourseRolesByCourseId = atomFamily({
  key: 'unfilteredCourseRolesByCourseId',
  effects: courseId => [
    async ({ setSelf, trigger }) => {
      if (trigger === 'get') {
        const { data: {roles} } = await axios.get(
          '/api/loadCourseRoles.php', { params:{ courseId } }
        );
        setSelf(roles);
      }
    }
  ]
})

export const courseRolesByCourseId = selectorFamily({
  key: 'filteredCourseRolesByCourseId',
  get: courseId => ({get}) => {
    const permissonsAndSettings = get(coursePermissionsAndSettingsByCourseId(courseId));
    const roles = get(unfilteredCourseRolesByCourseId(courseId));

    const ignoreKeys = ['isIncludedInGradebook', 'sectionPermissonOnly', 'dataAccessPermission', 'roleId', 'roleLabel'];
    let filteredRoles = roles?.filter((role) => {
      let valid = 
        role.roleId === permissonsAndSettings.roleId 
        || !Object.keys(role).every((permKey) => (
              (role[permKey] ?? '0') === permissonsAndSettings[permKey] 
              || ignoreKeys.includes(permKey) 
              ||  (role[permKey] ?? '0') === '1' && permissonsAndSettings[permKey] === '0'
          ))
      return (valid)
    }) ?? [];
    return filteredRoles;
  }
})

export const courseRolePermissonsByCourseIdRoleId = selectorFamily({
  key: 'courseRoleByCourseIdRoleId',
  get: ({courseId, roleId}) => ({get}) => {
    return get(unfilteredCourseRolesByCourseId(courseId))?.find(({roleId: candidateRoleId}) => candidateRoleId === roleId) ?? {};
  }
})

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


function findContentsChildIds(content){
  let collectionAliasOrderAndPageIds = [];

  for (let item of content){
    if (item?.type == 'order'){
    let newIds = findContentsChildIds(item.content)
    collectionAliasOrderAndPageIds = [...collectionAliasOrderAndPageIds,item.doenetId,...newIds]
    }else if (item?.type == 'collectionLink'){
      // let newIds = findCollectionAliasPages(item)
      let newIds = [];
    collectionAliasOrderAndPageIds = [...collectionAliasOrderAndPageIds,item.doenetId,...newIds]

    }else{
      collectionAliasOrderAndPageIds.push(item);
    }
  }
  return collectionAliasOrderAndPageIds;
}

export const useCourse = (courseId) => {
  const { label, color, image, defaultRoleId } = useRecoilValue(
    coursePermissionsAndSettingsByCourseId(courseId),
  );
  const addToast = useToast();

  function insertPageOrOrderToActivityInSpecificOrder({
    content,
    needleOrderDoenetId,
    createdItemType,
    createdPageDonenetId=null,
    createdOrderObj=null
  }){
    let newContent = [...content];
    let insertedAfterDoenetId;

    for (let [i,item] of Object.entries(content)){
      if (item?.doenetId == needleOrderDoenetId){
        let newItem = {...item};
        insertedAfterDoenetId = newItem.doenetId;
        if (newItem.content.length > 0){
          insertedAfterDoenetId = newItem.content[newItem.content.length -1];
        }
        //Last item is an order
        if (insertedAfterDoenetId?.type == 'order'){
          let childIds = findContentsChildIds(item.content);
          insertedAfterDoenetId = insertedAfterDoenetId.doenetId
          if (childIds.length > 0){
            insertedAfterDoenetId = childIds[childIds.length -1];
          }
        }


        if (createdItemType == 'page'){
          newItem.content = [...newItem.content,createdPageDonenetId]
        }else if (createdItemType == 'order'){
          newItem.content = [...newItem.content,{...createdOrderObj}]
        }
        newContent.splice(i,1,newItem)
        
        return {newContent,insertedAfterDoenetId};
      }
      if (item?.type == 'order'){
        let {newContent:subContent,insertedAfterDoenetId} = insertPageOrOrderToActivityInSpecificOrder({
          content:item.content,
          needleOrderDoenetId,
          createdItemType,
          createdPageDonenetId,
          createdOrderObj
        });
        if (subContent != null){
          //Attach subContent to order in newContent 
          let newOrder = {...item};
          newOrder.content = subContent;
          newContent.splice(i,1,newOrder)
          return {newContent,insertedAfterDoenetId};
        }
        // else{
        //   return {newContent:null,insertedAfterDoenetId}; 
        // }
      }

    }
    //Only ever get here when we didn't find the order
      return {newContent:null,insertedAfterDoenetId:null};
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

  function addPageToActivity({activityOrOrderObj,needleOrderOrActivityId,itemToAdd}){
    let nextContent = [...activityOrOrderObj.content];

    if (activityOrOrderObj.doenetId == needleOrderOrActivityId){
      let previousDoenetId = activityOrOrderObj.doenetId;
      if (activityOrOrderObj.content.length > 0){
        previousDoenetId = nextContent[nextContent.length -1];
        if (previousDoenetId?.type == 'order'){ //If last element was an order get it's doenetId
          previousDoenetId = previousDoenetId.doenetId;
        }
      }
      nextContent = [...nextContent,itemToAdd];
      return {content:nextContent,previousDoenetId}
    }

    for (let [i,item] of Object.entries(activityOrOrderObj.content)){
      if (item?.type == 'order'){
 
        let {content:childContent,previousDoenetId} = 
        addPageToActivity({activityOrOrderObj:item,needleOrderOrActivityId,itemToAdd})

        if (childContent != null){
          let nextActivityOrObj = {...item}
          nextActivityOrObj.content = childContent
          nextContent.splice(i,1,nextActivityOrObj);
        return {content:nextContent,previousDoenetId}
    }
      }
    }
    //Didn't find needle
    return {content:null,previousDoenetId:null};
  }

  const defaultFailure = useCallback(
    (err) => {
      addToast(`${err}`, toastType.ERROR);
    },
    [addToast],
  );

  const create = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ itemType, 
        parentDoenetId, 
        previousDoenetId, 
        previousContainingDoenetId
         },
         successCallback,
         failureCallback = defaultFailure) => {

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
            
            if (itemType == 'page' && selectedObj.type == 'bank'){
              parentDoenetId = selectedObj.doenetId
              console.log("page in a bank parentDoenetId:",parentDoenetId)
            }
            let authorItemSectionDoenetIds = await snapshot.getPromise(authorCourseItemOrderByCourseIdBySection({courseId,sectionId:parentDoenetId}));
            let lastItemInSelectedSectionDoenetId = parentDoenetId
            if (authorItemSectionDoenetIds.length > 0){
              //there are items in the section
              lastItemInSelectedSectionDoenetId = authorItemSectionDoenetIds[authorItemSectionDoenetIds.length - 1];
              let lastItemInSectionObj = await snapshot.getPromise(itemByDoenetId(lastItemInSelectedSectionDoenetId))
              previousDoenetId = lastItemInSelectedSectionDoenetId;
              //THIS previousDoenetId ISN'T BEING SET!!!!!
              if (lastItemInSectionObj.type == 'page' || lastItemInSectionObj.type == 'order'){
                previousContainingDoenetId = lastItemInSectionObj.containingDoenetId;
              }else if (lastItemInSectionObj.type == 'bank' || lastItemInSectionObj.type == 'section'){
                previousContainingDoenetId = lastItemInSelectedSectionDoenetId
              }
            }else{
              //No items in the section
              previousDoenetId = parentDoenetId
              previousContainingDoenetId = selectedObj.parentDoenetId;
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
          console.log("no items in section!!!!!")
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
            if (lastItemObj.type == 'page' || lastItemObj.type == 'order' || lastItemObj.type == 'collectionLink' || lastItemObj.type == 'pageAlias'){
              previousContainingDoenetId = lastItemObj.containingDoenetId;
            }else if (lastItemObj.type == 'activity' || lastItemObj.type == 'bank' || lastItemObj.type == 'section'){
              previousContainingDoenetId = lastItemObj.doenetId;
            }

          }
        }

        console.log("WHERE IS IT GOING?")
        console.log("itemType",itemType)
        console.log("parentDoenetId",parentDoenetId)
        console.log("previousDoenetId",previousDoenetId)
        console.log("previousContainingDoenetId",previousContainingDoenetId)

  
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
          let newActivityObj = {
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
            paginate: true,
            proctorMakesAvailable: false,
            pinnedAfterDate: null,
            pinnedUntilDate: null,
            ...data.itemEntered,
          }
          set(itemByDoenetId(createdActivityDoenentId), newActivityObj);

          //Page
          let createdPageObj = {
            ...data.pageEntered,
            parentDoenetId:createdActivityDoenentId
          }
          set(itemByDoenetId(data.pageDoenetId), createdPageObj); 

          //Find index of previousDoenetId and insert the new item's doenetId right after
          let indexOfPrevious = newAuthorItemDoenetIds.indexOf(previousDoenetId);
          if (indexOfPrevious == -1){
            //Place new item at the end as the prevousDoenetId isn't visible
            newAuthorItemDoenetIds.push(createdActivityDoenentId);
            // newAuthorItemDoenetIds.push(createdActivityDoenentId,createdPageObj.doenetId);
          }else{
            //insert right after the index
            newAuthorItemDoenetIds.splice(indexOfPrevious+1,0,createdActivityDoenentId)
            // newAuthorItemDoenetIds.splice(indexOfPrevious+1,0,createdActivityDoenentId,createdPageObj.doenetId)
          }
          set(authorCourseItemOrderByCourseId(courseId), newAuthorItemDoenetIds);
        } else if (itemType == 'bank') {
          let { data } = await axios.post('/api/createCourseItem.php', {
              previousContainingDoenetId,
              courseId,
              itemType,
              parentDoenetId,
          });
          console.log('bankData', data);
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
        } else if (itemType == 'page' || itemType == 'order' || itemType == 'collectionLink') {
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
          console.log("containingDoenetId",containingDoenetId)
          //Create a page.  Get the new page object.
          let { data } = await axios.get('/api/createPageOrOrder.php', {
              params: {
                  courseId,
                  itemType,
                  containingDoenetId,
                },
              });
          let {pageThatWasCreated, orderDoenetIdThatWasCreated, collectionAliasDoenetIdThatWasCreated} = data;
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
          let collectionLinkObj = {
            type: "collectionLink",
            doenetId: collectionAliasDoenetIdThatWasCreated,
            collectionDoenetId: null,
            isManuallyFiltered: false,
            pages:[],
            manuallyFilteredPages:[],
            label:"Untitled Collection Link",
          }

          //Update the Global Item Order Activity or Collection
          if (selectedItemObj.type == 'activity'){
            let newJSON = {...selectedItemObj.content};
            
            // let insertedAfterDoenetId = selectedItemObj.content[selectedItemObj.content.length - 1];
            if (itemType == 'page'){
              pageThatWasCreated.parentDoenetId = selectedItemObj.doenetId;
              newJSON = [...selectedItemObj.content,pageThatWasCreated.doenetId]
            }else if (itemType == 'order'){
              newJSON = [...selectedItemObj.content,orderObj]
            }else if (itemType == 'collectionLink'){
              newJSON = [...selectedItemObj.content,collectionLinkObj]
            }
            let newActivityObj = {...selectedItemObj}
            newActivityObj.content = newJSON;
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
            if (itemType == 'page'){
              set(itemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
            }else if (itemType == 'order'){
              orderObj = {...orderObj,
                isOpen:false,
                isSelected:false,
                containingDoenetId: selectedItemObj.doenetId,
                parentDoenetId:selectedItemObj.doenetId
              }
              set(itemByDoenetId(orderObj.doenetId),orderObj)
            }else if (itemType == 'collectionLink'){
              collectionLinkObj = {...collectionLinkObj,
                isOpen:false,
                isSelected:false,
                containingDoenetId: selectedItemObj.doenetId,
                parentDoenetId:selectedItemObj.doenetId
              }
              set(itemByDoenetId(collectionLinkObj.doenetId),collectionLinkObj)
            }

            //TODO: can we use this after order and page below?????
            let previousChildIds = findContentsChildIds(selectedItemObj.content)
            let nextChildIds = findContentsChildIds(newJSON)

            //Update author order
            set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
              let next = [...prev];
            //Find the number of previous child items of activity and remove those
            //If was single page then there wouldn't be any
            if (!makeMultiPage){
              //remove previous activity children from next
              next.splice(next.indexOf(selectedItemObj.doenetId)+1,previousChildIds.length)
            }
            //Add all the children of the new contents under the activity
              next.splice(next.indexOf(selectedItemObj.doenetId)+1,0,...nextChildIds);
              return next;
            });
           

          }else if (selectedItemObj.type == 'bank'){
            //Can only be an itemType of page (no orders allowed)
            let insertedAfterDoenetId = selectedItemObj.pages[selectedItemObj.pages.length - 1];
            if (selectedItemObj.pages.length == 0){
              insertedAfterDoenetId = selectedItemObj.doenetId;
            }
            // console.log("insertedAfterDoenetId",insertedAfterDoenetId)
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

            let { newContent, insertedAfterDoenetId } = insertPageOrOrderToActivityInSpecificOrder({
              content:containingItemObj.content,
              needleOrderDoenetId:orderDoenetId,
              createdItemType:itemType,
              createdPageDonenetId:pageThatWasCreated?.doenetId,
              createdOrderObj:orderObj})

            let newActivityObj = {...containingItemObj}
            newActivityObj.content = newContent;

            let { data } = await axios.post('/api/updateActivityStructure.php', {
                courseId,
                doenetId:newActivityObj.doenetId,
                newJSON:newContent,
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

              let insertedAfterDoenetId;
              let newJSON;
              if (itemType == 'page'){
                ({content:newJSON,previousDoenetId:insertedAfterDoenetId} = addPageToActivity({
                  activityOrOrderObj:containingItemObj,
                  needleOrderOrActivityId:selectedItemObj.parentDoenetId,
                  itemToAdd:pageThatWasCreated?.doenetId})
                )

              }else if (itemType == 'order'){

                ({content:newJSON,previousDoenetId:insertedAfterDoenetId} = addPageToActivity({
                  activityOrOrderObj:containingItemObj,
                  needleOrderOrActivityId:selectedItemObj.parentDoenetId,
                  itemToAdd:orderObj})
                )

              }



              let { data } = await axios.post('/api/updateActivityStructure.php', {
                    courseId,
                    doenetId:containingItemObj.doenetId,
                    newJSON,
                  });
              let newActivityObj = {...containingItemObj}
              newActivityObj.content = newJSON;
              orderObj['isOpen'] = false;
              orderObj['isSelected'] = false;
              orderObj['containingDoenetId'] = selectedItemObj?.containingDoenetId;
              orderObj['parentDoenetId'] = selectedItemObj?.parentDoenetId;
   
              let newItemDoenetId;
              if (itemType == 'page'){
                set(itemByDoenetId(pageThatWasCreated.doenetId),pageThatWasCreated)
                newItemDoenetId = pageThatWasCreated.doenetId;
              }else if (itemType == 'order'){
                set(itemByDoenetId(orderObj.doenetId),orderObj)
                newItemDoenetId = orderDoenetIdThatWasCreated;
              }
              set(itemByDoenetId(newActivityObj.doenetId),newActivityObj)
              set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
                let next = [...prev];
                next.splice(next.indexOf(insertedAfterDoenetId)+1,0,newItemDoenetId);
                return next;
              });
                
            }
          }
          // // console.log("updatedContainingObj",updatedContainingObj)
          
        }
        // successCallback(); //TODO: only call when is a success
        return newDoenetId;
      
      },
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
          failureCallback(err.message);
        }
      },
  );

  const validateEmail = useValidateEmail();

  const addUser = useRecoilCallback(({set}) => async (email, options, successCallback, failureCallback = defaultFailure) => {
    try {
      if (!validateEmail(email)) throw new Error('Invalid email, try again');
      const {
        data: { success, message, userData: serverUserData },
      } = await axios.post('/api/addCourseUser.php', {
        courseId,
        email,
        ...options,
      });
      if(success) {
        set(peopleAtomByCourseId(courseId), (prev) => ([...prev, {...serverUserData}]));
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
        data: { success, message },
      } = await axios.post('api/updateUserRole.php', {
        courseId,
        userEmail: email,
        roleId
      });
      if(success) {
        set(peopleAtomByCourseId(courseId), (prev) => {
          const next = prev.slice(0);
          const idx = prev.findIndex(({email: candidate}) => (candidate === email))
          next[idx] = {...prev[idx], roleId}
          return next
        });
        successCallback();
      } else {
        throw new Error(message);
      }
    } catch (err) {
      failureCallback(err.message);
    }
    
  });

  const modifyRolePermissions = useRecoilCallback(({set}) => 
    async (roleId, newPermissions, successCallback, failureCallback = defaultFailure) =>
    {
      try {

        const { 
          data: {
            success, 
            message, 
            actionType, 
            roleId: serverRoleId,
            updatedPermissions
        }} = await axios.post('/api/updateRolePermissons.php', {
              courseId, 
              roleId, 
              permissions: {...newPermissions, label: newPermissions?.roleLabel}
        })

        if(success) {
          set(
            unfilteredCourseRolesByCourseId(courseId), (prev => {
              const next = [...prev];
              const idx = prev.findIndex(({roleId: candidateRoleId}) => candidateRoleId === serverRoleId);
              let {label: roleLabel} = updatedPermissions;
              if(roleLabel === undefined) roleLabel = prev[idx].roleLabel;
              switch(actionType) {
                case 'add':
                  next.push({...updatedPermissions,roleLabel, roleId: serverRoleId})
                  break;
                case 'update':
                  next.splice(idx, 1, {...prev[idx],...updatedPermissions,roleLabel})
                  break;
                case 'delete':
                  next.splice(idx, 1);
                  break;
              }
              return next;
            })
          )
          successCallback();
        } else {
          throw new Error(message);
        }
      } catch (err) {
        failureCallback(err.message);
      }
    }, 
    [courseId, defaultFailure]
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
          failureCallback(err.message);
        }
      },
    [courseId, defaultFailure],
  );

  const renameItem = useRecoilCallback(
    ({ snapshot,set }) =>
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
          failureCallback(err.message);
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
      failureCallback(err.message);
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
          childrenString = (await Promise.all(activity.content
            .map(x => contentToDoenetML({ content: x, indentLevel: 1 }))))
            .join("");
        } catch (err) {
          failureCallback(err.message);
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
          failureCallback(err.message);
        }
  });

  function updateOrder({content,needleDoenetId,changesObj}){
    let nextContent = [...content];

    for (let [i,item] of Object.entries(content)){
      if (item?.type == 'order'){
        //Check for match
        if (needleDoenetId == item.doenetId){
          let nextItemObj = {...item}
          Object.assign(nextItemObj,changesObj);
          nextContent.splice(i,1,nextItemObj);
          return nextContent;
        }
        //if not match then recurse into content
        let childContent = updateOrder({content:item.content,needleDoenetId,changesObj});
        // console.log(">>childContent",childContent)
        // console.log(">>nextContent",nextContent)
        if (childContent != null){
          // console.log("childContent",childContent)
          let nextOrderObj = {...item}
          nextOrderObj.content = childContent;
          // console.log(">>nextOrderObj",nextOrderObj)
          nextContent.splice(i,1,nextOrderObj);
          return nextContent;
        }
      }
    }
    //Didn't find needle
    return null;
  }

  function updateAssignmentCollectionLink({content,needleDoenetId,changesObj}){
    let nextContent = [...content];

    for (let [i,item] of Object.entries(content)){
      if (item?.type == 'collectionLink'){
        //Check for match
        if (needleDoenetId == item.doenetId){
          let nextItemObj = {...item}
          Object.assign(nextItemObj,changesObj);
          nextContent.splice(i,1,nextItemObj);
          return nextContent;
        }
      }
      if (item?.type == 'order'){
        //if not match then recurse into content
        let childContent = updateAssignmentCollectionLink({content:item.content,needleDoenetId,changesObj});
        // console.log(">>childContent",childContent)
        // console.log(">>nextContent",nextContent)
        if (childContent != null){
          // console.log("childContent",childContent)
          let nextOrderObj = {...item}
          nextOrderObj.content = childContent;
          // console.log(">>nextOrderObj",nextOrderObj)
          nextContent.splice(i,1,nextOrderObj);
          return nextContent;
        }
      }
    }
    //Didn't find needle
    return null;
  }

  function deletePageFromActivity({content,needleDoenetId}){
    let nextContent = [...content];

    let index = null;

    for (let [i,item] of Object.entries(content)){
      if (item?.type == 'order'){
        let childContent = deletePageFromActivity({content:item.content,needleDoenetId});
        if (childContent != null){
          let childOrderObj = {...item}
          childOrderObj.content = childContent;
          nextContent.splice(i,1,childOrderObj);
          return nextContent;
        }

      }else if (needleDoenetId == item){
          index = i;
          break;
        }
    }

    //Need to return the content array without the doenetId of the page to delete
    if (index != null){
      nextContent.splice(index,1);
      return nextContent
    }
    //Didn't find needle
    return null;
  }

  function deleteOrderFromContent({content,needleDoenetId}){
    let nextContent = [...content];

    let index = null;

    for (let [i,item] of Object.entries(content)){
      if (item?.type == 'order'){
        //Check for match
        if (needleDoenetId == item.doenetId){
          index = i;
          break;
        }
        
        //if not a match then recurse into content
        let childContent = deleteOrderFromContent({content:item.content,needleDoenetId});
        if (childContent != null){
          let nextOrder = {...item}
          nextOrder.content = [...childContent]
          nextContent.splice(i,1,nextOrder);
          return nextContent;
        }
      }
    }
    //Need to return order object without the doenetId of the page to delete
    if (index != null){
      nextContent.splice(index,1);
      return nextContent
    }
    //Didn't find needle
    return null;
  }

  function deleteCollectionAliasFromContent({content,needleDoenetId}){
    let nextContent = [...content];

    let index = null;

    for (let [i,item] of Object.entries(content)){
      
      //Check for match
      if (needleDoenetId == item.doenetId){
        index = i;
        break;
      }
      if (item?.type == 'order'){ 
        //if not a match then recurse into content
        let childContent = deleteCollectionAliasFromContent({content:item.content,needleDoenetId});
        if (childContent != null){
          let nextOrder = {...item}
          nextOrder.content = [...childContent]
          nextContent.splice(i,1,nextOrder);
          return nextContent;
        }
      }
    }
    //Need to return order object without the doenetId of the page to delete
    if (index != null){
      nextContent.splice(index,1);
      return nextContent
    }
    //Didn't find needle
    return null;
  }
  
  function findOrderIdsInAnOrder({content,needleOrderDoenetId,foundNeedle=false}){
    let orderDoenetIds = [];
      for (let item of content){
        if (item?.type == 'order'){
          let moreOrderIds;
          if (foundNeedle || item.doenetId == needleOrderDoenetId){
            orderDoenetIds.push(item.doenetId);
            moreOrderIds = findOrderIdsInAnOrder({content:item.content,needleOrderDoenetId,foundNeedle:true})
          }else{
            moreOrderIds = findOrderIdsInAnOrder({content:item.content,needleOrderDoenetId,foundNeedle})
          }
          orderDoenetIds = [...orderDoenetIds,...moreOrderIds];
        }
      }

    return orderDoenetIds;
  }

  const updateCollectionLink = useRecoilCallback(
    ({ set,snapshot }) =>
      async ({courseId, doenetId, label, collectionDoenetId, isManuallyFiltered, manuallyFilteredPages=[], successCallback, failureCallback = defaultFailure}) => {
        let collectionLinkObj = await snapshot.getPromise(itemByDoenetId(doenetId));
        if (!label){ label = collectionLinkObj.label}
        let pages = collectionLinkObj.pages;
        const containingDoenetId = collectionLinkObj.containingDoenetId;
        let activityObj = await snapshot.getPromise(itemByDoenetId(containingDoenetId))
        // console.log("previous collectionLink:",collectionLinkObj)
        if (collectionDoenetId !== collectionLinkObj.collectionDoenetId){
        //Selected Collection changed
        //Automatically unselects filter page links
          let { data } = await axios.post('/api/createPageLinks.php', {
            courseId,
            containingDoenetId,
            collectionDoenetId,
            parentDoenetId:doenetId,
          });
          // console.log("createPageLinks data",data)
          pages=Object.keys(data.linkPageObjs);
          //TODO: Need to make link_pages too
          for (let pageDoenetId of pages){
            let sourcePageDoenetId = data.linkPageObjs[pageDoenetId].sourcePage;
            let nextLabel = data.linkPageObjs[pageDoenetId].nextLabel;
    
            let linkPageObj = {
              type:"pageLink",
              doenetId:pageDoenetId,
              sourcePageDoenetId,
              containingDoenetId,
              parentDoenetId:doenetId,
              isSelected:false,
              label:nextLabel
            }
            // console.log("linkPageObj",linkPageObj)
            set(itemByDoenetId(pageDoenetId),linkPageObj)
          }

        }

          //update authorCourseItemOrderByCourseId
          let doenetIdsToAdd = []
          let doenetIdsToRemove = []

          if (collectionDoenetId !== collectionLinkObj.collectionDoenetId){
            //Changed source collection
            doenetIdsToAdd = [...pages] //pages from php file above 
          }else if (!collectionLinkObj.isManuallyFiltered && isManuallyFiltered){
            //Turned on manual filter
            doenetIdsToAdd = [...collectionLinkObj.manuallyFilteredPages] 
          }else if (collectionLinkObj.isManuallyFiltered && !isManuallyFiltered){
            //Turned off manual filter
            doenetIdsToAdd = [...collectionLinkObj.pages]  
          }else if (collectionLinkObj.manuallyFilteredPages.length != manuallyFilteredPages.length){
            //Changed manually filtered pages
            doenetIdsToAdd = [...manuallyFilteredPages] 
          }

          if (collectionLinkObj.pages.length > 0){
            if (collectionLinkObj.isManuallyFiltered){
              doenetIdsToRemove = [...collectionLinkObj.manuallyFilteredPages]
            }else{
              doenetIdsToRemove = [...collectionLinkObj.pages]
            }
          }
          // console.log("doenetIdsToAdd",doenetIdsToAdd)
          // console.log("doenetIdsToRemove",doenetIdsToRemove)

          set(authorCourseItemOrderByCourseId(courseId),(prev)=>{
            let next = [...prev];
            let index = next.indexOf(doenetId);
            next.splice(index+1,doenetIdsToRemove.length,...doenetIdsToAdd)
            return next;
          })


        let changesObj = {label,collectionDoenetId,isManuallyFiltered,pages,manuallyFilteredPages};
        // console.log("changesObj",changesObj)
        let newJSON = updateAssignmentCollectionLink({content:activityObj.content,needleDoenetId:doenetId,changesObj});
        // console.log("newJSON",newJSON)
        let { data } = await axios.post('/api/updateActivityStructure.php', {
          courseId,
          doenetId:collectionLinkObj.containingDoenetId,
          newJSON
        });
      // console.log("data",data)
        let nextActivityObj = {...activityObj};
        nextActivityObj.content = newJSON;
        set(itemByDoenetId(collectionLinkObj.containingDoenetId),nextActivityObj)
   
        set(itemByDoenetId(doenetId),(prev)=>{
          let next = {...prev}
          next.isManuallyFiltered = isManuallyFiltered;
          next.collectionDoenetId = collectionDoenetId;
          next.pages = [...pages];
          next.manuallyFilteredPages = [...manuallyFilteredPages];
          if(label){
            next.label = label;
          }else{
            next.label = prev.label;
          }
          return next;
        });
        
  });

  const updateOrderBehavior = useRecoilCallback(
    ({ set,snapshot }) =>
      async ({doenetId, behavior, numberToSelect, withReplacement, successCallback, failureCallback = defaultFailure}) => {
        let orderObj = await snapshot.getPromise(itemByDoenetId(doenetId));
        let activityObj = await snapshot.getPromise(itemByDoenetId(orderObj.containingDoenetId))
        let changesObj = {behavior,numberToSelect,withReplacement};
        let newJSON = updateOrder({content:activityObj.content,needleDoenetId:doenetId,changesObj});
        
        let { data } = await axios.post('/api/updateActivityStructure.php', {
          courseId,
          doenetId:orderObj.containingDoenetId,
          newJSON
        });
      // console.log("data",data)
        let nextActivityObj = {...activityObj};
        nextActivityObj.content = newJSON;
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
        console.log(">>deleteItem itemToDeleteObj",itemToDeleteObj)
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
            let nextContent = deletePageFromActivity({content:containingObj.content,needleDoenetId:doenetId})
            activitiesJson.push(nextContent);
            activitiesJsonDoenetIds.push(containingObj.doenetId);
            pagesDoenetIds.push(doenetId);
          }

        }else if (itemToDeleteObj.type == 'order'){
          let containingObj = await snapshot.getPromise(itemByDoenetId(itemToDeleteObj.containingDoenetId))
          //Find doenentIds of pages contained by the order
          pagesDoenetIds = findPageDoenetIdsInAnOrder({content:containingObj.content,needleOrderDoenetId:itemToDeleteObj.doenetId})
          orderDoenetIds = findOrderIdsInAnOrder({content:containingObj.content,needleOrderDoenetId:doenetId})
          //Find updated activities' default order
          let nextOrder = deleteOrderFromContent({content:containingObj.content,needleDoenetId:doenetId})
          activitiesJson.push(nextOrder);
          activitiesJsonDoenetIds.push(containingObj.doenetId);
        }else if (itemToDeleteObj.type == 'collectionLink'){
          let containingObj = await snapshot.getPromise(itemByDoenetId(itemToDeleteObj.containingDoenetId))
          let nextOrder = deleteCollectionAliasFromContent({content:containingObj.content,needleDoenetId:doenetId})
          console.log("nextOrder",nextOrder)
          activitiesJson.push(nextOrder);
          activitiesJsonDoenetIds.push(containingObj.doenetId);
        }else if (itemToDeleteObj.type == 'bank'){
          baseCollectionsDoenetIds.push(doenetId);
          pagesDoenetIds = itemToDeleteObj.pages;
        }else if (itemToDeleteObj.type == 'activity'){
          let content = itemToDeleteObj.content;
          pagesDoenetIds = findPageIdsInContentArray({content,needleOrderDoenetId:null,foundNeedle:true})
          orderDoenetIds = findOrderIdsInAnOrder({content,needleOrderDoenetId:null,foundNeedle:true})
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

        // console.log(">>DELETE!",{
        //   courseId,
        //   pagesDoenetIds,
        //   courseContentDoenetIds,
        //   activitiesJson,
        //   activitiesJsonDoenetIds,
        //   collectionsJson,
        //   collectionsJsonDoenetIds,
        //   baseCollectionsDoenetIds,
        //   baseActivitiesDoenetIds,
        //   baseSectionsDoenetIds
        // })


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
        next.content = activityJson;
        return next;
      })
      
     }

     
      //remove all items from author order
     set(authorCourseItemOrderByCourseId(courseId), (prev)=>{
       let next = [...prev];

       for (let pagesDoenetId of pagesDoenetIds){
         let index = next.indexOf(pagesDoenetId);
         if (index != -1){
           next.splice(index,1);
         }
       }
       for (let orderDoenetId of orderDoenetIds){
        let index = next.indexOf(orderDoenetId);
        if (index != -1){
          next.splice(index,1);
        }
       }
       for (let baseCollectionsDoenetId of baseCollectionsDoenetIds){
        let index = next.indexOf(baseCollectionsDoenetId);
        if (index != -1){
          next.splice(index,1);
        }
       }
       for (let baseActivitiesDoenetId of baseActivitiesDoenetIds){
        let index = next.indexOf(baseActivitiesDoenetId);
        if (index != -1){
          next.splice(index,1);
        }
       }
       for (let baseSectionsDoenetId of baseSectionsDoenetIds){
        let index = next.indexOf(baseSectionsDoenetId);
        if (index != -1){
          next.splice(index,1);
        }
       }
       console.log("delete item author order prev and next:",prev,next)
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
      failureCallback(err.message);
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
        //If activity is single page only returns the doenetId of contentainingObj
        async function getIds(doenetId,itemObj=null){
          let allIds = [doenetId];
          if (!itemObj){
            itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
          }
          if (itemObj.type == 'order' || (itemObj.type == 'activity' && !itemObj.isSinglePage)){
            let orderIds = []
            for (let id of itemObj.content){
              if (id?.type == 'order'){
                let subOrderIds = await getIds(itemObj.doenetId,id)
                orderIds = [...orderIds,id.doenetId,...subOrderIds]
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

        async function getAncestors(doenetId){
          let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
          if (itemObj.parentDoenetId == courseId){
            return [doenetId];
          }
          let newAncestors = await getAncestors(itemObj.parentDoenetId)
          return [doenetId,...newAncestors];
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
        //Update the destination parentDoenetId if single selection
        if (selectedDoenetIds.length == 1){
          singleSelectedObj = await snapshot.getPromise(itemByDoenetId(selectedDoenetIds[0]));
          destType = singleSelectedObj.type;
          if (singleSelectedObj.type == 'section'){
            destParentDoenetId = singleSelectedObj.doenetId;
            destinationContainingObj = {...singleSelectedObj}
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
          //Empty section
          if (!destPreviousItemDoenetId){
            destPreviousItemDoenetId = sectionId;
          }
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
        //Empty section
        if (!destPreviousItemDoenetId){
          destPreviousItemDoenetId = destParentDoenetId;
        }

        //Paste the cut items 
        if (cutObjs.length > 0){

          let doenetIdsToMove = [];
          let noParentUpdateDoenetIds = []; 
          let sourcePagesAndOrdersToMove = [];
          let sourcePagesAndOrdersForTesting = [];

          let ancestorsDoenetIds = [];
          if (destinationContainingObj){
            ancestorsDoenetIds = await getAncestors(destinationContainingObj.doenetId)
          }

          let cuttingContaingItemFLAG = false;
          for (let cutObj of cutObjs){
            if (cutObj.type == 'activity' || 
            cutObj.type == 'bank' ||
            cutObj.type == 'section'
            ){
              cuttingContaingItemFLAG = true;
              break;
            }
          }
          //Test if cut orders and pages can go in destination
          for (let cutObj of cutObjs){

            if (destType == 'section'  && 
            (cutObj.type == 'page' ||
            cutObj.type == 'order' ) &&
            !cuttingContaingItemFLAG
            ){
              failureCallback(`Pasting ${cutObj.type} in a section is not supported.`)
              return;
            }
            if (cutObj.type == 'order' &&
            !cuttingContaingItemFLAG){
              failureCallback("Pasting orders is not yet supported")
              return;
            }
            if (destType == 'bank' && cutObj.type == 'order' ){
              failureCallback("Collections can only accept pages.")
              return;
            }
            if (ancestorsDoenetIds.includes(cutObj.doenetId)){
              failureCallback("Can't paste item into itself.")
              return;
            }
           
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
            if ((cutObj.type == 'order' || cutObj.type == 'page') && !cuttingContaingItemFLAG){
              sourcePagesAndOrdersToMove.push({...cutObj})
            }
            
            if (cutObj.type == 'order' || cutObj.type == 'page'){
              sourcePagesAndOrdersForTesting.push({...cutObj})
            }
          }

          //only if cuttingContaingItemFLAG is true 
          // test if pages and orders are all children of the containing items
          if (sourcePagesAndOrdersForTesting.length > 0 && cuttingContaingItemFLAG ){
            let acceptableOrderandPageIds = [];
            for (let doenetId of doenetIdsToMove){
              let acceptableIds = await getIds(doenetId)
              acceptableOrderandPageIds = [...acceptableOrderandPageIds,...acceptableIds]
            }
            for (let testObj of sourcePagesAndOrdersForTesting){
              if (!acceptableOrderandPageIds.includes(testObj.doenetId)){
              failureCallback("Can't paste pages or orders with other types.")
              return;
              }
            }
            
          }

      

        //Move the containing items
        if (doenetIdsToMove.length > 0){
          // console.log("move",{
          //   courseId,
          //   doenetIdsToMove,
          //   destParentDoenetId,
          //   destPreviousContainingItemDoenetId,
          //   noParentUpdateDoenetIds,
          // })
          // update the database for containing objects
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
              //turn off selection and isBeingCut
              for (let cutObj of cutObjs){
                set(itemByDoenetId(cutObj.doenetId),(prevObj)=>{
                  let nextObj = {...prevObj}
                  nextObj["isBeingCut"] = false;
                  nextObj["isSelected"] = false;
                  return nextObj
                }); 
              }
              //update each containing item with new parentId 
              //unless it's a child section of a moved section
              for (let doenetId of doenetIdsToMove){
                if (!noParentUpdateDoenetIds.includes(doenetId)){
                  set(itemByDoenetId(doenetId),(prevObj)=>{
                    let nextObj = {...prevObj}
                    nextObj.parentDoenetId = destParentDoenetId;
                    return nextObj
                  }); 
                }
              }

              //stack all doenetIds associated with the move
              let sortedDoenetIdsToMove = [];
              for (let doenetId of doenetIdsToMove){
                let associatedIds = await getIds(doenetId)
                sortedDoenetIdsToMove = [...sortedDoenetIdsToMove,...associatedIds];
              }
              //Deduplicate
              sortedDoenetIdsToMove = [...new Set(sortedDoenetIdsToMove)]
              // console.log(">>>sortedDoenetIdsToMove",sortedDoenetIdsToMove)
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
            failureCallback(err.message);
          }
        }

        if (sourcePagesAndOrdersToMove.length > 0){
          let destinationType = destinationContainingObj.type;
          let destinationDoenetId = destinationContainingObj.doenetId;
          let destinationJSON;
          let destinationWasASinglePageActivity = false;
          let destinationWasSinglePagesPageId;
          if (destinationType == 'bank'){
            destinationJSON = [...destinationContainingObj.pages];
          }else if (destinationType == 'activity'){
            destinationJSON = [...destinationContainingObj.content];
          }
          if (destinationContainingObj.isSinglePage){
            destinationWasASinglePageActivity = true;
            destinationWasSinglePagesPageId = destinationContainingObj.content[0];
          }
          let sourceTypes = []
          let sourceDoenetIds = []
          let sourceJSONs = []
          let originalPageDoenetIds = []
          let previousDoenetId;
          //Update source
          for (let cutObj of sourcePagesAndOrdersToMove){
            let sourceContainingDoenetId = cutObj.containingDoenetId
            let indexOfPriorEntry = sourceDoenetIds.indexOf(sourceContainingDoenetId)
            //if already is in sourceDoenetIds then update that index
            if (indexOfPriorEntry == -1){
              originalPageDoenetIds.push([cutObj.doenetId]);
              
              sourceDoenetIds.push(sourceContainingDoenetId)
              let containingObj = await snapshot.getPromise(itemByDoenetId(sourceContainingDoenetId))
              sourceTypes.push(containingObj.type);
              let updatedSourceItemJSON =  {}
              if (containingObj.type == 'activity'){
                //Remove from Activity
                updatedSourceItemJSON = deletePageFromActivity({content:containingObj.content,needleDoenetId:cutObj.doenetId})
                //if source is destination delete page from destination
                if (destinationContainingObj.doenetId == containingObj.doenetId){
                  destinationJSON = deletePageFromActivity({content:destinationJSON,needleDoenetId:cutObj.doenetId})
                  destinationContainingObj.content = destinationJSON;
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
                updatedSourceItemJSON = deletePageFromActivity({content:previousObj,needleDoenetId:cutObj.doenetId})
                //if source is destination delete page from destination
                if (destinationContainingObj.doenetId == cutObj.containingDoenetId){
                  destinationJSON = deletePageFromActivity({content:destinationJSON,needleDoenetId:cutObj.doenetId})
                  destinationContainingObj.content = destinationJSON;
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
          }

          //Add to destination
          for (let cutObj of sourcePagesAndOrdersToMove){
            if (destinationType == 'bank'){
              destinationJSON.push(cutObj.doenetId)
              //find last item in the bank
            }else if (destinationType == 'activity'){
              let orderIdOrActivityIdToAddTo = singleSelectedObj.doenetId;
              if (singleSelectedObj.type == 'page'){
                orderIdOrActivityIdToAddTo = singleSelectedObj.parentDoenetId;
              }
              let previousPreviousDoenetId = previousDoenetId;
                
                ({content:destinationJSON,previousDoenetId} = addPageToActivity({
                activityOrOrderObj:destinationContainingObj,
                needleOrderOrActivityId:orderIdOrActivityIdToAddTo,
                itemToAdd:cutObj.doenetId})
              )
              destinationContainingObj.content = destinationJSON;
              //Protect against overwriting previousDoenetId on pasting multiple pages
              if (previousPreviousDoenetId){
                previousDoenetId = previousPreviousDoenetId;
              }
              if (destinationWasASinglePageActivity){
                previousDoenetId = destinationDoenetId
              }
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
              if (collectionObj.type == 'bank'){
                if (collectionObj.pages.length == 0){
                  previousDoenetIdForPages = collectionObj.doenetId
                }else{
                  previousDoenetIdForPages = collectionObj.pages[collectionObj.pages.length - 1];
                }
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
        // console.log("destinationWasASinglePageActivity",destinationWasASinglePageActivity)
        // console.log("destinationWasSinglePagesPageId",destinationWasSinglePagesPageId)
        
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
            destinationWasASinglePageActivity,
          });
          // console.log("!!!!!!!!cutCopyAndPasteAPage resp.data",resp.data)
          if (resp.status < 300) {
          


          let nextPagesParentDoenetId;
          if (singleSelectedObj.type == 'order' || 
          singleSelectedObj.type == 'bank' ||
          singleSelectedObj.type == 'activity' 
          ){
            nextPagesParentDoenetId = singleSelectedObj.doenetId;
          }else if (singleSelectedObj.type == 'page'){
            nextPagesParentDoenetId = singleSelectedObj.parentDoenetId;
          }
          let setOfOriginalPageDoenetIds = []
          for (let [i,sourceType] of Object.entries(sourceTypes)){
            
            let sourceDoenetId = sourceDoenetIds[i]
            let sourceJSON = sourceJSONs[i];

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

            //If they are equal then
            //the source JSON is wrong and destination is the only one used
            if (sourceDoenetId == destinationDoenetId){
              continue;
            }
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
                next.content = sourceJSON;
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
                  next.content = destinationJSON;
                  if (destinationWasASinglePageActivity){
                    next.isSinglePage = false
                  }
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

              //Need original page in item order
              if (destinationWasASinglePageActivity){
                next.splice(insertIndex,0,destinationWasSinglePagesPageId,...setOfOriginalPageDoenetIds);  //insert
              }else{
                next.splice(insertIndex,0,...setOfOriginalPageDoenetIds);  //insert
              }
              return next
            })



            successCallback?.();
           // Update recoil
           // set(itemByDoenetId(cutObj.doenetId),nextObj); //TODO: set using function and transfer nextObj key by key
            
            
          } else {
            throw new Error(`response code: ${resp.status}`);
          }
        } catch (err) {
          failureCallback(err.message);
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
    updateCollectionLink, 
    copyItems, 
    cutItems,
    pasteItems,
    findPagesFromDoenetIds,
    addUser,
    modifyUserRole
   };
};
