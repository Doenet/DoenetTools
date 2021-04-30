import React, { useEffect ,useContext} from 'react';
import Tool from '../_framework/Tool';
import { ProfileContext, useToolControlHelper } from '../_framework/ToolRoot';
// import Drive from "../imports/Drive";
// import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { useToast } from '../_framework/Toast';
// import CollapseSection from "../imports/CollapseSection";
// import SectionDivider from "../imports/PanelHeaderComponents/SectionDivider";
import GlobalFont from '../../_utils/GlobalFont';

export default function  Course() {
  // console.log("=== DoenetExampleTool");

  const { openOverlay, activateMenuPanel } = useToolControlHelper();
  const [toast, toastType] = useToast();

  useEffect(() => {
    activateMenuPanel(1);
  }, [activateMenuPanel]);

  const profile = useContext(ProfileContext)
  console.log(">>>profile",profile)
  
    if (profile.signedIn === "0"){
      return (<>
       <GlobalFont/>
      <Tool>
  
        <headerPanel title="Course">
        </headerPanel>
  
        <mainPanel>
          <div style={{border:"1px solid grey",borderRadius:"20px",margin:"auto",marginTop:"10%",padding:"10px",width:"50%"}}>
            <div style={{textAlign:"center",alignItems:"center",marginBottom:"20px"}}>
            <h2>You are not signed in</h2>
            <h2>Course currently requires sign in for use</h2> 
            <button style={{background:"#1a5a99",borderRadius:"5px"}}><a href='/signin' style={{color:"white",textDecoration:"none"}}>Sign in with this link</a></button>
            </div>
            </div>
        </mainPanel>
      
       
      </Tool>
      </>
      )
    }
  return (
    <Tool>
     <headerPanel title="Course" />
     <mainPanel>
       Course Tool
      </mainPanel>
    </Tool>
  );
}
