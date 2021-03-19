//TODO fubar'd because of lack of react-indexed-db
// import { useIndexedDB, initDB } from 'react-indexed-db';
import axios from 'axios';
import { nanoid } from 'nanoid';

//callback(courseListArray,selectedCourseObj)
export function getCourses_CI(callback){


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

//callback(success) true or false
export function setSelected_CI(selectCourseId,callback=()=>{}){

  getCourses_CI(getCoursesCallback);
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

//callback(success) true or false
export function updateCourses_CI(courseArray,callback=()=>{}){

    const courseListDB = useIndexedDB('CourseList');
    
    for (let courseObj of courseArray){
      courseListDB.update(courseObj);
    }

    const url = '/api/saveUserCourseModifications.php';

    axios.post(url, courseArray)
      .then((resp) => {
        // console.log("api dump", resp.data); //var_dump shows here
        callback(true);
      })
      .catch(function (error) {
        callback(false)
        console.log(error);
      })
    //needs to save to db post

    callback(true)
}

//callback(success) true or false
export function saveCourse_CI(courseInfo,callback=()=>{}){
  getCourses_CI((courseListArray,selectedCourseObj) => {
    let new_course = true;
    for (let course of courseListArray){
      if (course.courseId === courseInfo.courseId){
        new_course = false;
        break;
      }
    }
    persist_CI(new_course);
  });
  
  function persist_CI(new_course){
    if (new_course){
      courseInfo['role'] = "Instructor";
      courseInfo['overviewId'] = nanoid();
      courseInfo['overviewDocumentName'] = courseInfo.courseName + " Overview";
      courseInfo['syllabusId'] = nanoid();
      courseInfo['syllabusDocumentName'] = courseInfo.courseName + " Syllabus";
    }
    const courseListDB = useIndexedDB('CourseList');
    courseListDB.update(courseInfo);

    const data = {
      longName: courseInfo['courseName'],
      courseId: courseInfo['courseId'],
      shortName: courseInfo['courseCode'],
      term: courseInfo['term'],
      description: courseInfo['description'],
      overviewId: courseInfo['overviewId'],
      syllabusId: courseInfo['syllabusId'],
      department: courseInfo['department'],
      section: courseInfo['section']
    }
    axios.post('/api/saveCourse.php', data)
      .then(resp => {
        console.log('resp data',resp.data)
        callback();
    })
  }
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
          { name: 'color', keypath: 'color', options: { unique: false } },
          { name: 'imageUrl', keypath: 'imageUrl', options: { unique: false } },
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
          { name: 'color', keypath: 'color', options: { unique: false } },
          { name: 'imageUrl', keypath: 'imageUrl', options: { unique: false } },
        ]
      },
    ]
  };
  initDB(DBConfig);
}

