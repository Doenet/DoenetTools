
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

export const fetchCoursesQuery = atom({
  key: 'fetchCoursesQuery',
  default: ['test'],
});