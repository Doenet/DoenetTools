import axios from 'axios';
import React from 'react';
import { redirect, useLoaderData, useNavigate } from 'react-router';
import { Form } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

export async function action({ request, params }) {
  const formData = await request.formData();
  let updates = Object.fromEntries(formData);
  let response = await axios.post("/api/updatePortfolioActivitySettings.php",{
    ...updates, doenetId:params.doenetId
  })
  // console.log("Create action!",updates,params.doenetId,response)

      // if (response.ok) {
      //   // let { doenetId } = await response.json();

        return redirect("/portfolio") 
      // }else{
      //   throw Error(response.message)
      // }
}

export async function loader({ params }){
  const response = await fetch(`/api/getPortfolioActivityData.php?doenetId=${params.doenetId}`);
  const data = await response.json();
  // console.log("loader",data)
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
  let data = useLoaderData();
  const navigate = useNavigate();

  return <>
    <Form id="portfolioActivitySettings" method="post">
  <MainGrid>
  <Slot1>
    <div>{data.isNew ? <h1>Add Activity</h1> : <h1>Activity Settings</h1>}</div>
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
        <Td><input name="imagePath" style={{width:"390px"}} type="text" placeholder='This will be an image preview' defaultValue={data.imagePath}/></Td>
      </tr>
      <tr>
        <Td>Activity Label</Td>
        <Td><input name="label" style={{width:"390px"}} type="text" placeholder='Activity 1' defaultValue={data.label}/></Td>
        </tr>
      <tr>
        <Td>Learning Outcomes</Td>
        <Td><textarea name="learningOutcomes" style={{width:"390px",resize: "vertical"}} placeholder='Description of Learning Outcomes' defaultValue={data.learningOutcomes}/></Td>
        </tr>
      <tr>
        <Td>Public <input name="public" type="checkbox" defaultChecked={data.public} /></Td>
        <Td></Td>
      </tr>
    </tbody>
  </Table>
  </Slot2>
  <Slot3>  
    
    {data.isNew ? <SideBySide>
      <Button alert value="Cancel" onClick={() => navigate(-1)}/>
      <Button type="submit" value="Create" />
      </SideBySide>
      :
      <SideBySide>
      <Button alert value="Cancel" onClick={() => navigate(-1)}/>
      <Button type="submit" value="Update" />
      </SideBySide>
    }
    
  </Slot3>
  </MainGrid>
  </Form>
  </>
}




