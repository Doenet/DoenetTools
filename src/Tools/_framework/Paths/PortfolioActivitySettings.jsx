import React from 'react';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';


const MainGrid = styled.div`
  display:grid;
  grid-template-rows: auto 10px [slot1-start] 40px [slot1-end] 20px [slot2-start] min-content [slot2-end] 20px [slot3-start] 40px [slot3-end] 10px auto;
  height: 100vh;
`

const Slot1 = styled.div`
  grid-row: slot1-start/slot1-end;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background: skyblue; */
`

const Slot2 = styled.div`
  grid-row: slot2-start/slot2-end;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background: lightcoral; */
`
const Slot3 = styled.div`
  grid-row: slot3-start/slot3-end;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background: greenyellow; */
`

const SideBySideButtons = styled.div`
  display: flex;
  column-gap: 20px;
`

const Table = styled.table`
     border:solid 1px var(--mainGray);
     padding:10px;
     border-radius: 6px;
`

const Th = styled.th`
    border-bottom:solid 1px var(--mainGray);
    max-width:420px;
    min-width:390px;
    text-align:left;
    padding:10px;
`
const Td = styled.td`
    border-bottom:solid 1px var(--mainGray);
    max-width:420px;
    min-width:390px;
    text-align:left;
    padding:10px;
`

export default function PortfolioActivitySettings(){

  return <>
  <MainGrid>
  <Slot1>
    <div><h1>Add Activity</h1></div>
  </Slot1>
  <Slot2>
  <Table>
    <thead>
      <tr>
        <Th>Property</Th>
        <Th>Setting</Th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <Td>Image</Td>
        <Td>Image bg here</Td>
      </tr>
      <tr>
        <Td>Activity Title</Td>
        <Td><input name="title" style={{width:"390px"}} type="text" placeholder='Activity 1'/></Td>
        </tr>
      <tr>
        <Td>Learning Outcomes</Td>
        <Td><textarea style={{width:"390px",resize: "vertical"}} placeholder='Description of Learning Outcomes'/></Td>
        </tr>
      <tr>
        <Td>Public</Td>
      </tr>
    </tbody>
  </Table>
  </Slot2>
  <Slot3>  
    <SideBySideButtons>
    <Button alert value="Cancel" onClick={() => navigate('/portfolio')}/>
    <Button value="Create" onClick={() => navigate('submitAddActivity')}/>
    </SideBySideButtons>
  </Slot3>
  </MainGrid>
  </>
}




