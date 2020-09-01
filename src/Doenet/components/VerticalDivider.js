import React from 'react';

export default function VerticalDivider() {
  const verticalHeaderDivider = {
    borderRadius: '5px',
    borderLeft: '5px solid #3d3d3d',
    borderRight: '0px',
    height: '95px',
    width: '0px',
    display: 'inline-block',
    margin: '55px 5px 0px 5px',
    verticalAlign: 'middle'
  };
  return (
    <>
    <div style={verticalHeaderDivider}></div>
    </>
  );
};
      
