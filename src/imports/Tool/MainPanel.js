import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import doenetImage from "../../media/Doenet_Logo_cloud_only.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faShare, faBars } from "@fortawesome/free-solid-svg-icons";
import Switch from "../Switch";
import HeaderMenuPanelContent from "./HeaderMenuPanelContent";
import { useCookies } from "react-cookie";
import axios from "axios";
import DoenetProfile from "../../../src/Tools/DoenetProfile";
import ResponsiveControlsWrapper from "../Tool/ResponsiveControlsWrapper";

const MenuContainer = styled.div`
  grid-area: mainPanel;
`;

export default function MainPanel(props) {
  const [showHideSupportPanel, setshowHideSupportPanel] = useState(false);
  const [showHideOverlay, setShowHideOverlay] = useState(false);
  const [activeHeaderPanelContent, setActiveHeaderPanelContent] = useState();
  const [headerCtrlGrpWidth, setHeaderCtrlGrpWidth] = useState(0);
  const [headerCtrlGroupEl, setHeaderCtrlGroupEl] = useState(null);
  const [mainPanelHeaderGrpWidth, setMainPanelHeaderGrpWidth] = useState(0);
  const [mainPanelHeaderCtrlGrpEl, setMainPanelHeaderCtrlGrpEl] = useState(
    null
  );
  // var headerCtrlGroupRef = null;
  // const [sliderVisible, setSliderVisible] = useState(false);
  // const [headerSectionCount, setHeaderSectionCount] = useState(1);
  const node = useRef();

  const [jwt, setjwt] = useCookies("JWT_JS");

  let isSignedIn = false;
  if (Object.keys(jwt).includes("JWT_JS")) {
    isSignedIn = true;
  }

  const [profile, setProfile] = useState({});

  const setHeaderCtrlGroupRef = (element) => {
    if (element) {
      setHeaderCtrlGroupEl(element);
      setHeaderCtrlGrpWidth(element.clientWidth);
      // console.log("element.clientWidth", element.clientWidth);
    }
  };

  const setMainHeaderCtrlGroupRef = (element) => {
    if (element) {
      setMainPanelHeaderCtrlGrpEl(element);
      setMainPanelHeaderGrpWidth(element.clientWidth);
      // console.log("element.clientWidth", element.clientWidth);
    }
  };

  const resizeWindowHanlder = () => {
    if (headerCtrlGroupEl) {
      console.log(
        headerCtrlGroupEl.offsetWidth,
        "headerCtrlGroupEl.clientWidth"
      );
      setHeaderCtrlGrpWidth(headerCtrlGroupEl.offsetWidth);
    }
    // if(mainPanelHeaderCtrlGrpEl) {
    //   console.log(mainPanelHeaderCtrlGrpEl.clientWidth, "mainPanelHeaderCtrlGrpEl.clientWidth");
    //   setHeaderCtrlGrpWidth(mainPanelHeaderCtrlGrpEl.clientWidth);
    // }
  };

  window.addEventListener("resize", resizeWindowHanlder);

  useEffect(() => {
    //Fires each time you change the tool
    //Need to load profile from database each time
    const phpUrl = "/api/loadProfile.php";
    const data = {};
    const payload = {
      params: data,
    };
    axios
      .get(phpUrl, payload)
      .then((resp) => {
        if (resp.data.success === "1") {
          setProfile(resp.data.profile);
        }
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  }, []);

  const onSwitchClick = () => {
    setshowHideSupportPanel(!showHideSupportPanel);
  };

  const showNavPanel = () => {
    props.hideNavPanel(false);
  };

  const showHideOverLayFunc = (obj) => {
    // console.log(obj, "Clciked object ");
    // setClickedButtonObj(obj);
    setActiveHeaderPanelContent(obj.props.children);
    setShowHideOverlay(!showHideOverlay);
  };

  const overlayOnClose = () => {
    setShowHideOverlay(!showHideOverlay);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, false);
    return () => {
      document.removeEventListener("click", handleClick, false);
    };
  });

  const handleClick = (e) => {
    // console.log(e.target);
    if (showHideOverlay) {
      setShowHideOverlay(false);
    }
  };

  const showCollapseMenu = (flag, count) => {
    // setSliderVisible(flag);
    // setHeaderSectionCount(count);
  };

  //Show loading if profile if not loaded yet (loads each time)
  if (Object.keys(profile).length < 1) {
    return <h1>Loading...</h1>;
  }
  console.log(">>>Main Panel props", props.children);
  console.log(">>>props from overlay", props.fromOverlayNew);
  console.log(">>>props from overlay", props);

  return (
    <MenuContainer>
      {props.showHideNavPanel !== undefined && props.showHideNavPanel ? (
        <button
          onClick={() => {
            showNavPanel();
          }}
          className="middleLeftButton circle"
        >
          <FontAwesomeIcon
            icon={faBars}
            style={{
              display: "block",
              alignSelf: "center",
              fontSize: "16px",
            }}
          />
        </button>
      ) : (
        ""
      )}
      {props.fromOverlayNew === undefined && (
        <HeaderMenuPanelContent
          open={showHideOverlay}
          onClose={() => {
            overlayOnClose();
          }}
          body={activeHeaderPanelContent}
        />
      )}
      <div>
        {props.fromOverlayNew === undefined ? (
          <div
            style={{
              display: "flex ",
              height: "50px",
              borderBottom: "1px solid black",
              width: "100%",
            }}
          >
            <div style={{ width: "135px", margin: "2px", padding: "4px" }}>
              <div style={{ display: "flex" }}>
                <img id="doenetLogo" src={doenetImage} height="40px" />
                <div style={{ display: "flex", padding: "4px" }}>
                  {props.onUndo ? (
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        height: "35px",
                        fontSize: "20px",
                      }}
                      onClick={props.onUndo}
                    >
                      <FontAwesomeIcon icon={faReply} />
                    </button>
                  ) : (
                    ""
                  )}
                  {props.onRedo ? (
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        height: "35px",
                        fontSize: "20px",
                      }}
                      onClick={props.onRedo}
                    >
                      <FontAwesomeIcon icon={faShare} />
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <div
                style={{ textAlign: "center", height: "14px", margin: "2px" }}
              >
                {props.title}
              </div>
              <div style={{ display: "flex", padding: "4px", margin: "2px" }}>
                {props.responsiveControlsFromTools ? (
                  <div /*ref={setHeaderCtrlGroupRef}*/
                    style={{
                      display: "flex",
                      width: "100%",
                      overflow: "auto",
                    }}
                  >
                    <ResponsiveControlsWrapper
                      mainPanelWidth={headerCtrlGrpWidth}
                    >
                      {props.responsiveControlsFromTools}
                    </ResponsiveControlsWrapper>
                  </div>
                ) : (
                  ""
                )}
                <div style={{ marginLeft: "auto" }}>
                  <Switch onChange={onSwitchClick} />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                width: props.headerMenuPanels && "300px",
              }}
            >
              <div style={{ height: "24px", padding: "4px" }}>
                <DoenetProfile
                  profile={profile}
                  cookies={jwt}
                  isSignedIn={isSignedIn}
                  showProfileOnly={true}
                  headerRoleFromLayout={props.headerRoleFromLayout}
                  headerChangesFromLayout={props.headerChangesFromLayout}
                  guestUser={props.guestUser}
                  onChange={showCollapseMenu}
                />
              </div>
              {props.headerMenuPanels && (
                <div
                  style={{
                    display: "flex",
                    width: "240px",
                    justifyContent: "space-between",
                    borderLeft: "1px solid black",
                  }}
                >
                  {props.headerMenuPanels &&
                    props.headerMenuPanels.map((hmpObj, index) =>
                      React.cloneElement(hmpObj, {
                        buttonText: hmpObj.props.buttonText,
                        buttonClick: () => {
                          showHideOverLayFunc(hmpObj);
                        },
                        key: index,
                      })
                    )}
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}

        <div
          style={{
            display:
              showHideSupportPanel || props.showHideOverlayFromOverlayNew
                ? "flex"
                : "block",
          }}
        >
          <div
            style={{
              width:
                showHideSupportPanel || props.showHideOverlayFromOverlayNew
                  ? "50%"
                  : "100%",
              height: "100%",
            }}
          >
            {props.responsiveControls ? (
              <div
                style={{
                  display: "flex",
                  height: "32px",
                  borderBottom: "1px solid black",
                }}
              >
                {/* <ResponsiveControlsWrapper mainPanelWidth={mainPanelHeaderGrpWidth}>{props.responsiveControls}</ResponsiveControlsWrapper> */}
                {props.responsiveControls}
              </div>
            ) : (
              ""
            )}

            <div
              style={{
                height: props.responsiveControls
                  ? "calc(100vh - 82px)"
                  : "calc(100vh - 50px)",
                overflow: "scroll",
              }}
            >
              {props.children}
            </div>
          </div>
          {showHideSupportPanel || props.showHideOverlayFromOverlayNew ? (
            <div
              style={{
                borderLeft: "1px solid black",
                width: "50%",
                overflow: "scroll",
              }}
            >
              {props.supportPanelObj}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </MenuContainer>
  );
}
