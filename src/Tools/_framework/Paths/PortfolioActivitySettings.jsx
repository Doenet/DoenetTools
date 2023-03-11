import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';


export async function loader({ params }){
  console.log({doenetId:params.doenetId})
  const response = await fetch(`/api/getPortfolioActivityData.php?doenetId=${params.doenetId}`);
  const data = await response.json();
  console.log("data",data)
  return data.activityData;
}

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

const SideBySide = styled.div`
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

export function PortfolioActivitySettings(){
  const navigate = useNavigate();
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
        <Td><SideBySide>Image <Button value="Upload" onClick={() => alert('upload')}/></SideBySide></Td>
        <Td><input name="imagePath" style={{width:"390px"}} type="text" placeholder='This will be an image preview'/></Td>
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
        <Td></Td>
      </tr>
    </tbody>
  </Table>
  </Slot2>
  <Slot3>  
    <SideBySide>
    <Button alert value="Cancel" onClick={() => navigate(-1)}/>
    <Button value="Create" onClick={() => navigate('submitAddActivity')}/>
    </SideBySide>
  </Slot3>
  </MainGrid>
  </>
}




