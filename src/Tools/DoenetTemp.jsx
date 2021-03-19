import React, { useEffect } from "react";
import Tool from "../imports/Tool/Tool";
import { useToolControlHelper } from "../imports/Tool/ToolRoot";
import Drive, {encodeParams} from "../imports/Drive";
import DriveCards from "../imports/DriveCards";

import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { useToast } from "../imports/Tool/Toast";
import {
    useHistory
  } from "react-router-dom";

  function Container(props){
    return <div
    style={{
        maxWidth: "850px",
        // border: "1px red solid",
        margin: "20px",
    }
    }
    >
        {props.children}
    </div>
  }

export default function DoenetExampleTool(props) {
  // console.log("=== DoenetExampleTool");

  const { openOverlay, activateMenuPanel } = useToolControlHelper();
  const toast = useToast();
  const history = useHistory();

  useEffect(() => {
    activateMenuPanel(1);
  }, [activateMenuPanel]);

  let routePathDriveId = "";
  let urlParamsObj = Object.fromEntries(
    new URLSearchParams(props.route.location.search)
  );
  if (urlParamsObj?.path !== undefined) {
    [
      routePathDriveId
    ] = urlParamsObj.path.split(":");
  }

  const driveCardSelection = ({item}) => {
    let newParams = {};
    newParams["path"] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
    history.push("?" + encodeParams(newParams));
  }

  let driveOrDriveDriveCards = null;
  if (routePathDriveId === ""){
      driveOrDriveDriveCards = <DriveCards
      types={['course']}
      subTypes={['Administrator']}
      routePathDriveId={routePathDriveId}
      driveDoubleClickCallback={({item})=>{driveCardSelection({item})}}
      />
  }else{
    driveOrDriveDriveCards = <Container>
        <Drive types={['course']}  urlClickBehavior="select" 
        doenetMLDoubleClickCallback={(info)=>{
            console.log(">>>info",info)
        //   openOverlay({type:"editor",branchId: info.item.branchId,title: info.item.label});
          }}/>
    </Container>
  }

  return (
    <Tool>
      <navPanel>
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" /> */}
      </navPanel>

      <headerPanel title="Doenet Example Tool"></headerPanel>

      <mainPanel>
        <BreadcrumbContainer />
        {/* <div style={{marginBottom:"40px",height:"100vh"}} 
       onClick={useOutsideDriveSelector} > */}
       {driveOrDriveDriveCards}
      {/* </div> */}
      </mainPanel>

      {/* <supportPanel isInitOpen>
        <p>Support Panel</p>
      </supportPanel> */}

      <menuPanel title="edit">
        <button
          onClick={() => {
            toast("hello from Toast!", 0, null, 3000);
          }}
        >
          Toast!
        </button>
        <button
          onClick={() => {
            toast("Other Toast!", 0, null, 1000);
          }}
        >
          Other Toast!
        </button>
        <button
          onClick={() => {
            toast("hello from Toast!", 0, null, 2000);
          }}
        >
          Toast Test!
        </button>
        <button
          onClick={() => {
            openOverlay({ type: "calendar", title: "Cal", branchId: "fdsa" });
          }}
        >
          Go to calendar
        </button>
        <p>control important stuff</p>
      </menuPanel>

      <menuPanel title="other">
        <p>control more important stuff</p>
      </menuPanel>
    </Tool>
  );
}




