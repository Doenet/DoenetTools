import React from 'react';

export default function Tool(props) {
    //console.log(props.responsiveControls, "props.responsiveControls in tool");
    const [panelDataIndex, setPanelDataIndex] = React.useState(-1);
    const [supportPanelObj,setSupportPanelObj] = React.useState({});
    const [navPanelObj, setNavPanelObj] = React.useState(null);
    const [showHideNavPanel, setShowHideNavPanel] = React.useState(false);

    const showHideMenuPanelContent = (index) => {
        setPanelDataIndex(index);
    }

    const hideNavPanel = (showHideNavPanelFlag) => {
        if(showHideNavPanelFlag !== undefined){
            setShowHideNavPanel(showHideNavPanelFlag);
        }
    }
    React.useEffect(()=> {
        if(props.children && Array.isArray(props.children)) {
            props.children.map((obj,index)=> {
                if(obj && obj.type && typeof(obj.type) === "function" && obj.type.name === "MenuPanel") {
                    if(panelDataIndex === -1){
                        setPanelDataIndex(prevState=> {
                            //console.log(prevState);
                            let oldIndex = prevState;
                            if(oldIndex === -1) {
                                return index;
                            }
                            return oldIndex;
                        })
                    }
                }
                if(obj && obj.type && typeof(obj.type) === "function" && obj.type.name === "SupportPanel") {
                    console.log(obj.props.children, "obj.props support panel");
                    setSupportPanelObj(React.cloneElement(obj, {responsiveControls: obj.props.responsiveControls}));
                }
                if(obj && obj.type && typeof(obj.type) === "function" && obj.type.name === "NavPanel") {
                    console.log(obj.props.children, "obj.props nav panel");   
                    setNavPanelObj(React.cloneElement(obj,{hideNavPanel:hideNavPanel}));
                }
            })
        }
    },[])

    const showNewOverlay = () =>{
		props.setShowHideNewOverLay(true);
	}

    return (
        <div style={{display: "flex" , height:"100vh"}}>
            {navPanelObj ? !showHideNavPanel ? navPanelObj : "" : ""}
            {props.children && Array.isArray(props.children) && props.children.map(obj=> {
                return (
                    obj && obj.type && typeof(obj.type) === "function" && obj.type.name !== "NavPanel" && obj.type.name !== "MenuPanel" && obj.type.name !== "SupportPanel" && (
                        <>
                            {obj.type.name === "MainPanel" ? 
                                React.cloneElement(obj,{onClick:()=>{props.setShowHideNewOverLay(true)},responsiveControlsFromTools: props.responsiveControls,responsiveControls: obj.props.responsiveControls,hideNavPanel:hideNavPanel, showHideNavPanel: showHideNavPanel, onUndo: props.onUndo, onRedo: props.onRedo,title:props.title,
                                     navPanelObj:navPanelObj,supportPanelObj:supportPanelObj, headerMenuPanels: props.headerMenuPanels}) : obj}
                        </>
                ))
            })}
            <div style={{width: "240px", height: "100vh",borderLeft:"1px solid black"}}>
                <div style={{height: "50px", display: "flex"}}>
                    {props.children && Array.isArray(props.children) && props.children.map((obj,index)=> {
                        return (
                            obj && obj.type && typeof(obj.type) === "function" && obj.type.name === "MenuPanel" && (
                                <div style={{width: "100%", borderBottom: "1px solid #3d3d3d", borderRight:"1px solid #3d3d3d"}}>
                                    <div style={{height:"50px",textAlign:"center"}}>
                                    <button style={{border:"none",backgroundColor:index === panelDataIndex ? "blue" : "white", width:"100%",height:"50px"}} onClick={()=> {showHideMenuPanelContent(index)}}>{obj.props.title}</button>
                                     </div>
                                </div>
                            )
                    )})}
                </div>

                <div style={{height:"calc(100vh - 50px)", overflow:"scroll"}}>
                    {panelDataIndex !== -1 ? props.children[panelDataIndex].props.children : ""}
                </div>
            </div>
        </div>
    )

}