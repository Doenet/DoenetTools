import React from 'react';

export default function One(props){
  console.log(">>>props",props)
  return <div>This is One {props.text}</div>
}