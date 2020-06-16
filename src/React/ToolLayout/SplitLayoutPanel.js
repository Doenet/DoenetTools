import React, {  useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
      faTimes , faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import SplitPanelContext from './SplitPanelContext';



const MainContent = styled.div`
  width: 100%;
  overflow:auto;
  background-color:white;
  height:100vh;
  display:flex;
  flex-direction:row;

`;

const SplitPanel = styled.div`
    // display: flex;
    // flex-direction: column;
    min-height: 1vh;
    overflow: hidden;
    width: ${props => props.width}%;
    border-right: 1px solid #e2e2e2;
`;

export default function SplitLayoutPanel(props){
//   static contextType =  SplitPanelContext;
  const splitcontext = useContext(SplitPanelContext);
  const showPanel = props.defaultVisible || splitcontext.splitPanel;

        //   let panelHeader = null;

        // console.log('*********splitcontext*************', splitcontext);


        return (
            showPanel ? <SplitPanel width={splitcontext.splitPanel ? props.width: 100}>

                {/* <div className='panels-header-content'>
                    <div className='panels-header-controls'>
                        {panelHeader}
                    </div>
                </div> */}


                <MainContent>
                    {props.children}
                </MainContent>

            </SplitPanel>:''

        );
    // }
}
