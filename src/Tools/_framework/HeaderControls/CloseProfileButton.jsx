import React from 'react';
import { profileToolViewStashAtom } from '../Profile';
import { useRecoilCallback } from 'recoil';
import { toolViewAtom } from '../NewToolRoot';



export default function CloseProfileButton(props){
  const closeProfile = useRecoilCallback(({set,snapshot})=>async ()=>{
    let stash = await snapshot.getPromise(profileToolViewStashAtom);
    let newStash = {...stash}
    set(toolViewAtom,newStash)
  })
  
  return <button onClick={()=>closeProfile()}>Close</button>
}