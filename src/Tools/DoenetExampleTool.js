import React from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive from "../imports/Drive";
import AddItem from "../imports/AddItem";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { BreadcrumbContainer } from "../imports/Breadcrumb";

//example data acessing
function OverlayDataViwer() {
  const overlayData = useRecoilValue(openOverlayByName);

  return (
    <div>
      <h2>Data</h2>
      <ul>
        <li> target: {overlayData.target} </li>
        <li> action: {overlayData.instructions.action} </li>
        <li> supportVisble: {overlayData.supportVisble} </li>
        <li> courseId: {overlayData.instructions.courseId} </li>
        <li> branchId: {overlayData.instructions.branchId} </li>
      </ul>
    </div>
  );
}

export default function DoenetExampleTool() {
  const setOverlayOpen = useSetRecoilState(openOverlayByName);
  // console.log("=== DoenetExampleTool");

  return (
    <Tool>
      <navPanel>
        <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" />
      </navPanel>

      <headerPanel title="my title"></headerPanel>

      <mainPanel>
        <BreadcrumbContainer />
        <AddItem />
        <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" />
      </mainPanel>

      <supportPanel width="40%">
        <p>Support Panel</p>
      </supportPanel>

      <menuPanel title="edit">
        <button
          onClick={() => {
            setOverlayOpen({
              target: "editor",
              instructions: {
                action: "open",
                supportVisble: true,
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
        <headerPanel title="my title"></headerPanel>

        <mainPanel>
          <h1>Editor</h1>
          <h2>Data</h2>
          <OverlayDataViwer />
        </mainPanel>

        <supportPanel width="40%">
          <p>Support Panel</p>
        </supportPanel>

        <menuPanel title="control">
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
                setOverlayOpen({
                  target: "cal",
                  instructions: {
                    action: "open",
                    supportVisble: false,
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

        <menuPanel title="extras">
          <p>control more important stuff</p>
        </menuPanel>
      </overlay>

      <overlay name="cal">
        <headerPanel title="my title"></headerPanel>

        <mainPanel>
          <h1>calender</h1>
          <h2>Data</h2>
          <OverlayDataViwer />
        </mainPanel>

        <supportPanel width="40%">
          <p>Support Panel</p>
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

        <menuPanel title="other">
          <p>control more important stuff</p>
        </menuPanel>
      </overlay>
    </Tool>
  );
}
