import React from 'react';

const BreadcrumbDivider = ({ children, ...props }) => {
  
  const breadcrumbDividerStyle = {
    color: "#040F1A",
    margin: "auto 6px",
    userSelect: "none",
    fontSize: "20px",
  }
  
  return (
    <li style={breadcrumbDividerStyle} {...props}>
      {children}
    </li>
  );
}

export default BreadcrumbDivider;