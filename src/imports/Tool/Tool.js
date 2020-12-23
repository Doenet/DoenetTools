import React from "react";
import styled from "styled-components";

const ToolContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 60px 1fr auto;
  grid-template-areas: "navPanel header menuPanelHeader" "navPanel mainPanel menuPanel" "navPanel mainPanel menuPanelSecondary";
`;

export default function Tool(props) {
  //console.log(props.responsiveControls, "props.responsiveControls in tool");
  const [supportPanelObj, setSupportPanelObj] = React.useState({});

  React.useEffect(() => {
    if (props.children && Array.isArray(props.children)) {
      props.children.map((obj, index) => {
        if (
          obj &&
          obj.type &&
          typeof obj.type === "function" &&
          obj.type.name === "SupportPanel"
        ) {
          console.log(obj.props.children, "obj.props support panel");
          setSupportPanelObj(
            React.cloneElement(obj, {
              responsiveControls: obj.props.responsiveControls,
              key: index,
            })
          );
        }
      });
    }
  }, []);

  const showNewOverlay = () => {
    props.setShowHideNewOverLay(true);
  };

  console.log(">>>Tool Children: ", props.children);

  return (
    <ToolContainer>
      {props.children &&
        Array.isArray(props.children) &&
        props.children.map((obj, index) => {
          switch (obj?.type?.name) {
            case "MainPanel":
              return React.cloneElement(obj, {
                onClick: () => {
                  props.setShowHideNewOverLay(true);
                },
                responsiveControlsFromTools: props.responsiveControls,
                responsiveControls: obj.props.responsiveControls,
                onUndo: props.onUndo,
                onRedo: props.onRedo,
                title: props.title,
                supportPanelObj: supportPanelObj,
                headerMenuPanels: props.headerMenuPanels,
                initSupportPanelOpen: props.initSupportPanelOpen,
                key: index,
              });
            case "SupportPanel":
              return (null);
            case "NavPanel":
            case "MenuPanel":
            default:
              return React.cloneElement(obj, { key: index });
          }
        })}
    </ToolContainer>
  );
}
