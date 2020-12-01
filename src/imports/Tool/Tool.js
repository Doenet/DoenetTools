import React from "react";
import styled from "styled-components";

const ToolContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 240px;
  grid-template-rows: 60px 1fr;
  grid-template-areas: "navPanel header menuPanelHeader" "navPanel mainPanel menuPanel";
`;

export default function Tool(props) {
  //console.log(props.responsiveControls, "props.responsiveControls in tool");
  const [supportPanelObj, setSupportPanelObj] = React.useState({});
  const [navPanelObj, setNavPanelObj] = React.useState(null);
  const [showHideNavPanel, setShowHideNavPanel] = React.useState(false);

  const hideNavPanel = (showHideNavPanelFlag) => {
    if (showHideNavPanelFlag !== undefined) {
      setShowHideNavPanel(showHideNavPanelFlag);
    }
  };

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
        if (
          obj &&
          obj.type &&
          typeof obj.type === "function" &&
          obj.type.name === "NavPanel"
        ) {
          console.log(obj.props.children, "obj.props nav panel");
          setNavPanelObj(
            React.cloneElement(obj, { hideNavPanel: hideNavPanel, key: index })
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
                hideNavPanel: hideNavPanel,
                showHideNavPanel: showHideNavPanel,
                onUndo: props.onUndo,
                onRedo: props.onRedo,
                title: props.title,
                navPanelObj: navPanelObj,
                supportPanelObj: supportPanelObj,
                headerMenuPanels: props.headerMenuPanels,
                key: index,
              });
            case "NavPanel":
              return navPanelObj ? (!showHideNavPanel ? navPanelObj : "") : "";
            case "SupportPanel":
              return (null);
            case "MenuPanel":
            default:
              return React.cloneElement(obj, { key: index });
          }
        })}
    </ToolContainer>
  );
}
