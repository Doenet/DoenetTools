import { useIndexedDB } from 'react-indexed-db';
import axios from 'axios';
import { initDB } from 'react-indexed-db';


//callback(success) true or false
export function setSelected(selectCourseId,callback=()=>{}){

  getCourses(getCoursesCallback);
  function getCoursesCallback(courseListArray,selectedCourseObj){
    const {update} = useIndexedDB('SelectedCourse');
    let select = {};
    for (let course of courseListArray){
      if (course.courseId === selectCourseId){
        select = course;
        break;
      }
    }
    select.id = 1;
    update(select).then(
      event => { callback(true);  },
      error => { callback(false); console.log(error); }
    )

  }
}

//callback(courseListArray,selectedCourseObj)
export function getCourses(callback){


const courseListDB = useIndexedDB('CourseList');
const selectedCourseDB = useIndexedDB('SelectedCourse');

 //Put in useEffect function in another file
 courseListDB.getAll().then(courses => {
    if (courses.length === 0){
      //Load from database
      const phpUrl = '/api/loadUserCourses.php';

      axios.get(phpUrl)
        .then(resp => {
          // console.log('loadUserCourses resp',resp);
  
          if (resp.data.success && resp.data.courseInfo.length > 0){
          //Store in IndexedDB
          for (let courseInfo of resp.data.courseInfo){
            courseListDB.add(courseInfo).then(
              event => { //console.log('Add Course Event', event); 
            },
              error => { console.log(error); }
            )
          }
          //Select just the first one
          selectedCourseDB.add(resp.data.courseInfo[0]).then(
            event => { 
              courseListDB.getAll().then(courses => {
                selectedCourseDB.getAll().then(selected =>{
                  callback(courses,selected[0]);
                })
              })
              // console.log('Add Selected Event', event); 
            },
            error => { console.log(error); }
          )

          }else{ console.log("Couldn't gather courselist. Or it's empty."); }
        })
        .catch(error => { this.setState({ error: error }) });
    }else{
      selectedCourseDB.getAll().then(selected =>{

        callback(courses,selected[0]);
      })
    }

  })
}


export function initialize(){
  const DBConfig = {
    name: 'CoursesDB',
    version: 1,
    objectStoresMeta: [
      {
        store: 'CourseList',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'courseId', keypath: 'courseId', options: { unique: true } },
          { name: 'shortname', keypath: 'shortname', options: { unique: false } },
          { name: 'longname', keypath: 'longname', options: { unique: false } },
          { name: 'description', keypath: 'description', options: { unique: false } },
          { name: 'role', keypath: 'role', options: { unique: false } },
        ]
      },
      {
        store: 'SelectedCourse',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'courseId', keypath: 'courseId', options: { unique: true } },
          { name: 'shortname', keypath: 'shortname', options: { unique: false } },
          { name: 'longname', keypath: 'longname', options: { unique: false } },
          { name: 'description', keypath: 'description', options: { unique: false } },
          { name: 'role', keypath: 'role', options: { unique: false } },
        ]
      },
    ]
  };
  initDB(DBConfig);
}