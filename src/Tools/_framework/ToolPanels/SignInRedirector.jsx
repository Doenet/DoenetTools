import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';


export default function SignInRedirector() {
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

      axios.get(`/api/umn/shibToJWT.php`,{params:{doenetId}})
      .then(({data})=>{
        console.log("data",data);
        if (data.success){
          if (!data.isEnrolled){
            //SEND ERROR!!!
            return null;
          }
          if (data.needToClearOutPreviousUser){
            localStorage.clear(); //Clear out the profile
            indexedDB.deleteDatabase('keyval-store'); //Clear out the rest of the profile
          }
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
            

        // TODO: need to set the profile in local storage
      })

    return null;
}
 