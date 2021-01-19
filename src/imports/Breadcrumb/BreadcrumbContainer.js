import React from 'react'
import { useBreadcrumbItems } from './hooks/useBreadcrumbItems'
import BreadcrumbItem from './components/BreadcrumbItem'
import BreadcrumbDivider from './components/BreadcrumbDivider'

export const BreadcrumbContainer = ({ divider = '/', ...props }) => {
  const items = useBreadcrumbItems();
  
  let children = items.map((item, index) => (
    <BreadcrumbItem key={`breadcrumbItem${index}`}>
      {item.element}
    </BreadcrumbItem>
  ));

  const lastIndex = children.length - 1;
  children = children.reduce((acc, child, index) => {
    let notLast = index < lastIndex;
    if (notLast) {
      acc.push(
        child,
        <BreadcrumbDivider key={`breadcrumbDivider${index}`}>
          {divider}
        </BreadcrumbDivider>,
      )
    } else {
      acc.push(child);
    }
    return acc;
  }, [])

  const breadcrumbContainerStyle = {
    listStyle: "none",
    display: "flex",
    flexWrap: "wrap",
    overflow: "hidden",
    alignItems: "center",
    padding: "12px 0",
    width: "100%",
    borderBottom: "1px solid #cdcdcd",
    margin: "0",
  }

  return (<ol style={breadcrumbContainerStyle}>{children}</ol>);
};