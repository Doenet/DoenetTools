import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWaveSquare,
  faDatabase,
  faServer,
} from "@fortawesome/free-solid-svg-icons";
import Tool from "../imports/Tool/Tool";
import NavPanel from "../imports/Tool/NavPanel";
import MainPanel from "../imports/Tool/MainPanel";
import SupportPanel from "../imports/Tool/SupportPanel";
import MenuPanel from "../imports/Tool/MenuPanel";
import HeaderMenuPanelButton from "../imports/Tool/HeaderMenuPanelButton";
import ResponsiveControls from "../imports/Tool/ResponsiveControls";
import Overlay from "../imports/Tool/Overlay";
import CollapseSection from "../imports/CollapseSection";
import MenuPanelSection from "../imports/Tool/MenuPanelSection";
import ActionButton from "../imports/PanelHeaderComponents/ActionButton";
import MenuItem from "../imports/PanelHeaderComponents/MenuItem";
import Menu from "../imports/PanelHeaderComponents/Menu";
import SectionDivider from "../imports/PanelHeaderComponents/SectionDivider";
import { SelectedElementStore } from "./SelectedElementContext";

const alphabet =
  "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z ";

const finalIcon1 = (
  <FontAwesomeIcon
    icon={faServer}
    style={{
      width: "10px",
      padding: "2px",
      backgroundColor: "#e2e2e2",
      alignSelf: "center",
      fontSize: "16px",
      color: "grey",
    }}
  />
);

const finalIcon2 = (
  <FontAwesomeIcon
    icon={faDatabase}
    style={{
      width: "10px",
      padding: "2px",
      backgroundColor: "#e2e2e2",
      alignSelf: "center",
      fontSize: "16px",
      color: "grey",
    }}
  />
);
const finalIcon3 = (
  <FontAwesomeIcon
    icon={faWaveSquare}
    style={{
      width: "10px",
      padding: "2px",
      backgroundColor: "#e2e2e2",
      alignSelf: "center",
      fontSize: "16px",
      color: "grey",
    }}
  />
);

export default function DoenetExampleTool(props) {
  const [showHideNewOverLay, setShowHideNewOverLay] = useState(false);

  const showHideOverNewOverlayOnClick = () => {
    setShowHideNewOverLay(!showHideNewOverLay);
  };

  return (
    <SelectedElementStore>
      {!showHideNewOverLay ? (
        <Tool
          onUndo={() => {
            console.log(">>>undo clicked");
          }}
          onRedo={() => {
            console.log(">>>redo clicked");
          }}
          title={"My Doc"}
          // responsiveControls={[]}
          headerMenuPanels={[
            <HeaderMenuPanelButton buttonText="Add">
              {"content 1"}
            </HeaderMenuPanelButton>,
            <HeaderMenuPanelButton buttonText="Save">
              {"content 2"}
            </HeaderMenuPanelButton>,
          ]}
        >
          <NavPanel>Nav Panel</NavPanel>

          <MainPanel
            setShowHideNewOverLay={setShowHideNewOverLay}
            // responsiveControls={[]}
          >
            <div
              onClick={() => {
                showHideOverNewOverlayOnClick();
              }}
            >
              Click for Overlay
            </div>

            <h3> This is Main Panel</h3>
            <p>click Switch button in header to see support panel</p>
            <p>
              Define responsiveControls to see for standard components section
              which are responsive and collapses according the width available
            </p>

            <h2>Header Menu Panels </h2>
            <p>Click add and save to see header menu panels section </p>
          </MainPanel>

          <SupportPanel
          // responsiveControls={[]}
          >
            <h3>Support Panel Content</h3>

            <p>
              Define responsiveControls to see for standard components section
              which are responsive and collapses according the width available
            </p>
          </SupportPanel>
          <MenuPanel>
            <MenuPanelSection title="Font">
              <CollapseSection>
                <SectionDivider type="single">
                  <ActionButton
                    handleClick={() => {
                      alert();
                    }}
                  />
                  <Menu label="actions">
                    <MenuItem
                      value="Times"
                      onSelect={() => {
                        alert("Times Selected");
                      }}
                    />
                    <MenuItem
                      value="Ariel"
                      onSelect={() => {
                        alert("Ariel Selected");
                      }}
                    />
                  </Menu>
                </SectionDivider>
              </CollapseSection>
              <CollapseSection></CollapseSection>
            </MenuPanelSection>
            <MenuPanelSection title="style">
              Menu Panel Style Content
            </MenuPanelSection>
          </MenuPanel>
        </Tool>
      ) : (
        <Overlay
          isOpen={showHideNewOverLay}
          onUndo={() => {}}
          onRedo={() => {}}
          title={"my doc"}
          onClose={() => {
            setShowHideNewOverLay(false);
          }}
          // responsiveControls={[<ResponsiveControls/>]}
          headerMenuPanels={[]}
        >
          <MainPanel responsiveControls={[]}>Overlay Main panel</MainPanel>
          <SupportPanel responsiveControls={[]}>Overlay Support</SupportPanel>
          <MenuPanel>
            <MenuPanelSection title="Font">
              <CollapseSection>
                <SectionDivider type="single">
                  <ActionButton
                    handleClick={() => {
                      alert();
                    }}
                  />
                  <Menu label="actions">
                    <MenuItem
                      value="Times"
                      onSelect={() => {
                        alert("Times Selected");
                      }}
                    />
                    <MenuItem
                      value="Ariel"
                      onSelect={() => {
                        alert("Ariel Selected");
                      }}
                    />
                  </Menu>
                </SectionDivider>
              </CollapseSection>
              <CollapseSection></CollapseSection>
            </MenuPanelSection>
            <MenuPanelSection title="style">
              Menu Panel Style Content
            </MenuPanelSection>
          </MenuPanel>
        </Overlay>
      )}
    </SelectedElementStore>
  );
}
