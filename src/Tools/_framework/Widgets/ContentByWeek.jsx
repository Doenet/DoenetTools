import React, { useEffect } from 'react';
import styled from "styled-components"
import DueDateBar from '../../../_reactComponents/PanelHeaderComponents/DueDateBar';

const Container = styled.div`
  padding: 2rem;
`

const FlexBox = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent};
  align-items: center; 
`

const Text = styled.span`
  font-size: ${props => props.fontSize || "1rem"};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHead = styled.th`
  padding: .5rem 1rem; 
  font-weight: normal;
`
const Row = styled.tr`
  border-bottom: 1px solid var(--mainGray);
`

const Col = styled.td`
  padding: 0 1rem; 
  text-align: ${props => props.textAlign};
  height: 90px;
`


export default function NewNext7Days() {

  return (
    <Container>
      <FlexBox justifyContent="center" >
        <Text fontSize="1.3rem" >Pinned Content</Text>
      </FlexBox>
      <Table>
        <Row>
          <TableHead><Text fontSize=".9rem">Name</Text></TableHead>
          <TableHead><Text fontSize=".9rem">Score</Text></TableHead>
          <TableHead>
            <FlexBox justifyContent="space-between">
              <Text fontSize=".9rem">Assigned</Text>
              <Text fontSize=".9rem">Due</Text>
            </FlexBox>
          </TableHead>
        </Row>
        <Row>
          <Col>
            
              <Text>Assignment 1</Text>
            
          </Col>
          <Col><Text>10/15</Text></Col>
          <Col>
            <DueDateBar  
              startDate={new Date("2022-01-01 00:00:00")}
              endDate={new Date("2022-12-31 00:00:00")}
              isCompleted
            />
          </Col>
        </Row>
        <Row>
          <Col>
              <Text>Assignment with a really really really long long long long name</Text>
          </Col>
          <Col><Text>-/25</Text></Col>
          <Col>
            <DueDateBar  
              startDate={new Date("2022-11-01 00:00:00")}
              endDate={new Date("2022-12-31 00:00:00")}
            />
          </Col>
        </Row>
        <Row>
          <Col>
              <Text>Assignment 3</Text>
          </Col>
          <Col><Text>-/15</Text></Col>
          <Col>
            <DueDateBar  
              startDate={new Date("2022-11-01 00:00:00")}
              endDate={new Date("2022-12-31 00:00:00")}
            />
          </Col>
        </Row>
      </Table>
    </Container>
  )
}

