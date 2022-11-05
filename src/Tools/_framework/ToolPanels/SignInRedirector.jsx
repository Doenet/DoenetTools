import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { clear as idb_clear } from 'idb-keyval';


export default function SignInRedirector() {
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  //TODO: Sign out then do shibToJWT.php

      axios.get(`/api/umn/shibToJWT.php`,{params:{doenetId}})
      .then(({data})=>{
        console.log("data",data);
        if (data.success){
          if (!data.isEnrolled){
            //SEND ERROR!!!
            console.log("ERROR!");
            return null;
          }

          if (data.needToClearOutPreviousUser){
            //Clear out just the local info not the new sign in
            localStorage.clear(); 
            idb_clear().then(()=>{
                //Redirect to exam
                setPageToolView(
                  {
                  page:"placementexam",
                  tool: 'exam',
                  view: '',
                  params: {
                    doenetId
                    }
                  }
                );
              });
          
          }else{
            //Redirect to exam
            setPageToolView(
              {
              page:"placementexam",
              tool: 'exam',
              view: '',
              params: {
                doenetId
              }
            }
            );
          }
          
        }
            

        // TODO: need to set the profile in local storage
      })

    return null;
}
 