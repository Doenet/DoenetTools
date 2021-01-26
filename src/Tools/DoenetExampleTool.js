import React from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive from "../imports/Drive";
import AddItem from "../imports/AddItem";
import Switch from "../imports/Switch";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { supportVisible } from "../imports/Tool/SupportPanel";

function OverlayDataViwer() {
  const overlayData = useRecoilValue(openOverlayByName);

  return (
    <div>
      <h2>Data</h2>
      <ul>
        <li> target: {overlayData.target} </li>
        <li> action: {overlayData.instructions.action} </li>
        <li> courseId: {overlayData.instructions.courseId} </li>
        <li> branchId: {overlayData.instructions.branchId} </li>
      </ul>
    </div>
  );
}

export default function DoenetExampleTool() {
  const setSupportVisiblity = useSetRecoilState(supportVisible);
  const setOverlayOpen = useSetRecoilState(openOverlayByName);
  // console.log("=== DoenetExampleTool");

  return (
    <Tool>
      <navPanel>
        {/* <p>navigate to important stuff</p> */}
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" /> */}
        <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" />
        {/* <Drive types={['content','course']} /> */}
      </navPanel>

      <headerPanel title="my title">
        <p>header for important stuff</p>
        <Switch
          onChange={(e) => {
            setSupportVisiblity(e.target.checked);
          }}
        />
      </headerPanel>

      <mainPanel>
        <p>do the main important stuff</p>
        <BreadcrumbContainer />
        <AddItem />
        <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" />

        {/* <Drive types={['content','course']} /> */}
      </mainPanel>

      <supportPanel width="40%">
        <p>I'm here for support</p>
        {/* <GlobalSelectIndicator /> */}
      </supportPanel>

      <menuPanel title="edit">
        <button
          onClick={() => {
            // setOverlayOpen("George");
            setOverlayOpen({
              target: "editor",
              instructions: {
                action: "open",
                courseId: "c1",
                branchId: "b1",
              },
            });
          }}
        >
          Go to Overlay
        </button>
        <p>control important stuff</p>
      </menuPanel>

      <menuPanel title="other">
        <p>control more important stuff</p>
      </menuPanel>

      <overlay name="editor">
        <headerPanel title="my title">
          <Switch
            onChange={(e) => {
              setSupportVisiblity(e.target.checked);
            }}
          />
        </headerPanel>

        <mainPanel>
          <h1>Editor</h1>
          <h2>Data</h2>
          <OverlayDataViwer />

          {/* <BreadcrumbContainer /> */}
          {/* <Drive id="ZLHh5s8BWM2azTVFhazIH" /> */}
          {/* <Drive types={['content','course']} /> */}
        </mainPanel>

        <supportPanel width="40%">
          <p>Support Panel</p>
          {/* <GlobalSelectIndicator /> */}
        </supportPanel>

        <menuPanel title="edit">
          <p>control important stuff</p>
          <button
            onClick={() => {
              setOverlayOpen({
                instructions: {
                  action: "close",
                },
              });
            }}
          >
            Go Back
          </button>
          <div>
            <button
              onClick={() => {
                // setOverlayOpen("George");
                setOverlayOpen({
                  target: "cal",
                  instructions: {
                    action: "open",
                    courseId: "d1",
                    branchId: "e1",
                  },
                });
              }}
            >
              Go to cal
            </button>
          </div>
        </menuPanel>

        <menuPanel name="other">
          <p>control more important stuff</p>
        </menuPanel>
      </overlay>

      <overlay name="cal">
        <headerPanel title="my title">
          <Switch
            onChange={(e) => {
              setSupportVisiblity(e.target.checked);
            }}
          />
          <p>header for important stuff</p>
        </headerPanel>

        <mainPanel>
          <h1>calender</h1>
          <h2>Data</h2>
          <OverlayDataViwer />

          {/* <BreadcrumbContainer /> */}
          {/* <Drive id="ZLHh5s8BWM2azTVFhazIH" /> */}
          {/* <Drive types={['content','course']} /> */}
        </mainPanel>

        <supportPanel width="40%">
          <p>I'm here for support</p>
          {/* <GlobalSelectIndicator /> */}
        </supportPanel>

        <menuPanel title="edit">
          <p>control important stuff</p>
          <button
            onClick={() => {
              setOverlayOpen({
                instructions: {
                  action: "close",
                },
              });
            }}
          >
            Go Back
          </button>
        </menuPanel>

        <menuPanel name="other">
          <p>control more important stuff</p>
        </menuPanel>
      </overlay>
    </Tool>
  );
}
