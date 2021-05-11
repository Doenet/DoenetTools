import React, { useRef, useState, useEffect } from 'react';

import styled from "styled-components";
import useDoenetRender from './useDoenetRenderer';


export default function Slider(props) {
  let [name, SVs] = useDoenetRender(props);
  // console.log("name: ", name, " value: ", SVs);

  

  if(SVs.hidden){
    return null;
  }


  return "sideBySide!";
  
}
