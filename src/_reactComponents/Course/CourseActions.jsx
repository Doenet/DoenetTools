
import axios from 'axios';
import { 
  atom,
  // AtomEffect,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  // useRecoilRefresher_UNSTABLE,
  useRecoilValue,
} from 'recoil';
// import { useToast, toastType } from '../_framework/Toast';


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

const itemInfoByDoenetId = atomFamily({
  key: 'itemDataByDoenetId',
  default: null,
  effects: (doenetId) => [
    ({ setSelf, onSet, trigger }) => {
      if (trigger === 'get') {
        console.log("get itemInfoByDoenetId",doenetId);
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
    ({ set }) =>
      async ({
        previousDoenetId,
        itemType,
        placeInFolderFlag = false,
      }) => {
        let newDoenetId;
        //Get selection information to know previous doenetId by order
        if (itemType == 'Activity') {
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
            set(itemInfoByDoenetId(data.doenetId), data.itemEntered);
            // set(courseOrderDataByCourseId(courseId), {completeOrder:activityData.order})
          }else if (itemType == 'Page') {
            console.log("page")
          }else if (itemType == 'Bank') {
            console.log("Bank")
          }else if (itemType == 'Section') {
  
            let { data } = await axios.get('/api/createCourseItem.php', {
              params: {
                previousDoenetId,
                courseId,
                itemType,
                placeInFolderFlag,
              },
            });
            console.log("sectionData",data)
            newDoenetId = data.doenetId;
            set(itemInfoByDoenetId(data.doenetId), data.itemEntered);
            // set(courseOrderDataByCourseId(courseId), {completeOrder:sectionData.order})
        }
        return newDoenetId;
      },
  );

  return { create };
};
