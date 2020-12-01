import React from "react";
import styled from "styled-components";

const HeaderDiv = styled.div`
  grid-area: menuPanelHeader;
  display: flex;
  border-left: 1px solid black;
`;

const SectionDiv = styled.div`
  grid-area: menuPanel;
  overflow: scroll;
  border-left: 1px solid black;
`;

const ButtonDiv = styled.div`
  border-bottom: 1px solid #3D3D3D;
  border-right: 1px solid #3D3D3D;
  width: 100%;
`
const HeaderButton = styled.button`
  border: none;
  background-color: white;
  width: 100%;
  height: 100%;
`


export default function MenuPanel(props) {
  const showHideMenuPanelContent = (index) => {
    props.setPanelDataIndex(index);
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
          if (props.panelDataIndex === -1) {
            props.setPanelDataIndex((prevState) => {
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
  }, [props.panelDataIndex]);

  console.log(">>>MenuPanel Props:", props);
  return (
    <>
      <HeaderDiv>
        {props.children &&
          Array.isArray(props.children) &&
          props.children.map((obj, index) => {
            switch (obj?.type?.name) {
              case "MenuPanelSection":
                return (
                  <ButtonDiv key={index}>
                      <HeaderButton
                        onClick={() => {
                          showHideMenuPanelContent(index);
                        }}
                      >
                        {obj.props.title}
                      </HeaderButton>
                  </ButtonDiv>
                );
            }
          })}
      </HeaderDiv>
      <SectionDiv>
        {props.panelDataIndex !== -1
          ? props.children[props.panelDataIndex]
          : ""}
      </SectionDiv>
    </>
  );
}
