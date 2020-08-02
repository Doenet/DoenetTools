import React from 'react';
import ReactDOM from 'react-dom';
import { initDB } from 'react-indexed-db';

import DoenetDashboard from '../Tools/DoenetDashboard';
const DBConfig = {
  name: 'CoursesDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'SelectedCourse',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'courseId', keypath: 'courseId', options: { unique: true } }
      ]
    },
    {
      store: 'CourseList',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'courseId', keypath: 'courseId', options: { unique: true } }
      ]
    },

  ]
};
initDB(DBConfig);

    ReactDOM.render(
      <DoenetDashboard/>
  ,document.getElementById('root'));
