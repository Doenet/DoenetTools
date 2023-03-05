import React, { useRef, useState } from 'react';
import { useOutletContext } from 'react-router';


export default function Community(props){
  let context = useOutletContext();

  if (context.signedIn == null){ return null;}
  
  return <div>Community</div>
}

