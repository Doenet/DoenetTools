
import axios from 'axios';
import { 
  atom,
  selector,
  // useRecoilCallback 
} from 'recoil';



export const fetchCoursesQueryOld = atom({
  key: 'fetchCoursesQueryOld',
  default: selector({
    key: 'fetchCoursesQueryOld/Default',
    get: async () => {
      const { data:oldData } = await axios.get(`/api/loadAvailableDrives.php`);
      console.log("oldData",oldData);
      return oldData;
    },
  }),
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