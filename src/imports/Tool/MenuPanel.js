import React from "react";
import styled from "styled-components";

const HeaderDiv = styled.div`
  grid-area: menuPanelHeader;
  width: 240px;
  display: flex;
  border-left: 1px solid black;
`;

const SectionDiv = styled.div`
  grid-area: menuPanel;
  width: 240px;
  overflow: scroll;
  border-left: 1px solid black;
`;

const ButtonDiv = styled.div`
  border-bottom: 1px solid #3d3d3d;
  border-right: 1px solid #3d3d3d;
  width: 100%;
`;
const HeaderButton = styled.button`
  border: none;
  background-color: white;
  width: 100%;
  height: 100%;
`;

export default function MenuPanel(props) {
  const [panelDataIndex, setPanelDataIndex] = React.useState(-1);

  const showHideMenuPanelContent = (index) => {
    setPanelDataIndex(index);
  };

  React.useEffect(() => {
    if (props.children && Array.isArray(props.children)) {
      props.children.map((obj, index) => {
        if (
          obj &&
          obj.type &&
          typeof obj.type === "function" &&
          obj.type.name === "MenuPanel"
        ) {
          if (panelDataIndex === -1) {
            setPanelDataIndex((prevState) => {
              //console.log(prevState);
              let oldIndex = prevState;
              if (oldIndex === -1) {
                return index;
              }
              return oldIndex;
            });
          }
        }
      });
    }
  }, [panelDataIndex]);

  console.log(">>>MenuPanel Props:", props);
  return (
    <>
      <HeaderDiv>
        {props.children &&
          Array.isArray(props.children) &&
          props.children.map((obj, index) => {
            switch (obj?.type?.name) {
              case "MenuPanelSection":
                let bg = index === panelDataIndex ? "#8FB8DE" : "#E2E2E2";
                return (
                  <ButtonDiv key={index}>
                    <HeaderButton
                      onClick={() => {
                        showHideMenuPanelContent(index);
                      }}
                      style={{backgroundColor: bg}}
                    >
                      {obj.props.title}
                    </HeaderButton>
                  </ButtonDiv>
                );
              default:
                return null;
            }
          })}
      </HeaderDiv>
      <SectionDiv>
        {panelDataIndex !== -1 ? props.children[panelDataIndex] : ""}
      </SectionDiv>
    </>
  );
}
