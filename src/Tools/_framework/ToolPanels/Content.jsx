import React from 'react';

export default function Content(props){
  console.log(">>>===Content")
  
  return <div style={props.style}><h1>Content</h1>
  <p>put content here</p>
  </div>
}