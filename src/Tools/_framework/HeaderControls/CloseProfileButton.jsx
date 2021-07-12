import React from 'react';
import { profileToolViewStashAtom } from '../Profile';
import { useRecoilCallback } from 'recoil';
import { toolViewAtom } from '../NewToolRoot';



export default function CloseProfileButton(){
  const closeProfile = useRecoilCallback(({set,snapshot})=>async ()=>{
    let stash = await snapshot.getPromise(profileToolViewStashAtom);
    if (stash?.toolViewAtom){
      let newStash = {...stash.toolViewAtom}
      set(toolViewAtom,newStash)
      // console.log(">>>href",stash.href)
      window.history.pushState('','',stash.href)
      
    }else{
      //Go home if we started with settings
      location.href = '/new';
    }
    
  })
  
  return <button onClick={()=>closeProfile()}>Close</button>
}