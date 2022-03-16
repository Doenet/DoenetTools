
import axios from 'axios';
import { useEffect } from 'react';
import { 
  atom,
  // AtomEffect,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  // useRecoilRefresher_UNSTABLE,
  useRecoilValue,
} from 'recoil';
// import { useToast } from '../../Tools/_framework/Toast';
// import { useToast, toastType } from '../_framework/Toast';


export function useInitCourseItems(courseId){

  const getDataAndSetRecoil = useRecoilCallback(({set})=> async (courseId)=>{
    const { data } = await axios.get('/api/getCourseItems.php',{params:{courseId}})
    console.log("data",data)
    let doenetIds = data.items.map((item)=>item.doenetId);
    set(authorCourseItemOrderByCourseId(courseId),doenetIds);
    data.items.map((item)=>{
      set(authorItemByDoenetId(item.doenetId),item);
    })
  },[])

  useEffect(()=>{
    if(courseId){
      getDataAndSetRecoil(courseId);
    }
  },[getDataAndSetRecoil,courseId])
}

export const authorCourseItemOrderByCourseId = atomFamily({
  key: 'allCourseItemsByCourseIdByCourseId',
  default: [],
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
})

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
    async ({ setSelf, trigger })=> {
        if (trigger === 'get') {
        const { data } = await axios.get('/api/getCoursePermissionsAndSettings.php')
        // console.log('data',data)
        setSelf(data.permissionsAndSettings)
        }
    }
  ],
})

export const coursePermissionsAndSettingsByCourseId = atomFamily({
  key: 'coursePermissionsAndSettingsByCourseId',
  default: selectorFamily({
    key:"coursePermissionsAndSettingsByCourseId/Default",
    get: (courseId) => ({get}) => {
      let allpermissionsAndSettings = get(coursePermissionsAndSettings);
      return allpermissionsAndSettings.filter((value)=>value.courseId == courseId)[0]
    }
  })
})

export const useCreateCourse = () => {
    const createCourse = useRecoilCallback(
    ({ set }) =>
      async () => {
        let { data } = await axios.get('/api/createCourse.php'); 
            console.log("createCourse data",data)

          set(coursePermissionsAndSettings, data.permissionsAndSettings)
      });

  return { createCourse };
}

export const courseOrderDataByCourseId = atomFamily({
  key: 'courseOrderDataByCourseId',
  default: { completeOrder: [], orderingDataLookup: {} },
  effects: (courseId) => [
    ({ setSelf, onSet, trigger }) => {
      if (trigger === 'get') {
        console.log("GET courseOrderDataByCourseId");
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

// // type ItemType = 'Activity' | 'Section' | 'Page';

export const useCourse = (courseId) => {
  // const visableOrder = useRecoilValue(visableOrderByDriveId(driveId));

  const create = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({
        previousDoenetId,
        itemType,
        placeInFolderFlag = false,
      }) => {
        let newDoenetId;
        let coursePermissionsAndSettings = await snapshot.getPromise(coursePermissionsAndSettingsByCourseId(courseId));
        if (coursePermissionsAndSettings.canEditContent != '1'){
          //TODO: set up toast message here
          return null;
        }
        //Get selection information to know previous doenetId by order
        if (itemType == 'activity') {
          console.log("Activity")

            let { data } = await axios.get('/api/createCourseItem.php', {
              params: {
                previousDoenetId,
                courseId,
                itemType,
                placeInFolderFlag,
              },
            });
            console.log("activityData",data)
            newDoenetId = data.doenetId;
            set(authorItemByDoenetId(data.doenetId), data.itemEntered);
            set(authorCourseItemOrderByCourseId(courseId), data.order)
          }else if (itemType == 'bank') {

            let { data } = await axios.get('/api/createCourseItem.php', {
              params: {
                previousDoenetId,
                courseId,
                itemType,
                placeInFolderFlag,
              },
            });
            console.log("bankData",data)
            newDoenetId = data.doenetId;
            set(authorItemByDoenetId(data.doenetId), data.itemEntered);
            set(authorCourseItemOrderByCourseId(courseId), data.order)
            console.log("bank")
          }else if (itemType == 'section') {
  
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
            set(authorCourseItemOrderByCourseId(courseId), data.order)
          }else if (itemType == 'page') {
            console.log("page")
          }
        return newDoenetId;
      },
  );

  return { create };
};


 
