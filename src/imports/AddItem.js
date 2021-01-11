import React, {useContext, useState, useCallback, useRef, useEffect} from 'react';
import axios from "axios";
import nanoid from 'nanoid';
import './util.css';

import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  RecoilRoot,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from 'recoil';



export default function AddItem(props){
  console.log("=== AddItem")
  return <div>AddItem</div>
        //   <React.Fragment key={`drive${driveObj.driveId}${isNav}`} ><Router ><Switch>
        //    <Route path="/" render={(routeprops)=>
        //    <DriveRouted route={{...routeprops}} driveId={driveObj.driveId} label={driveObj.label} isNav={isNav} />
        //    }></Route>
        //  </Switch></Router></React.Fragment>)
       
}
