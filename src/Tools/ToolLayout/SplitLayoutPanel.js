import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import SplitPanelContext from './SplitPanelContext';



const MainContent = styled.div`
  overflow:auto;
  background-color:white;
  height:100vh;
  display:flex;
  flex-direction:row;

`;

export default function SplitLayoutPanel(props) {
    const splitcontext = useContext(SplitPanelContext);
    const showPanel = props.defaultVisible || splitcontext.splitPanel;
    let panelHeader;
    if (props.panelHeaderControls) {
        panelHeader = [...props.panelHeaderControls];
      }
    return (
        <>
            {/* <div className='panels-header-content'>
                    <div className='panels-header-controls'>
                        {panelHeader}
                    </div>
                </div> */}
            <MainContent>
                {props.children}
            </MainContent>
        </>
    );
}
