import React, { useEffect } from 'react';
import styled from "styled-components"
import DueDateBar from '../../../_reactComponents/PanelHeaderComponents/DueDateBar';
import Checkbox from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Container = styled.div`
  padding: 2rem;
`

const FlexBox = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent};
  align-items: center; 
  gap: ${props => props.gap};
`

const Text = styled.span`
  font-size: ${props => props.fontSize || "1rem"};
`

const EllipsisText = styled.span `
  font-size: 1rem;
  position: absolute;
  left: 1rem;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  width: ${props => props.width};
  position: relative;
`

export default function NewNext7Days() {

  let loadAssignmentArray = async (courseId) => {
    //Clear selection when click on main panel
    // set(mainPanelClickAtom, (was) => [
    //   ...was,
    //   { atom: clearDriveAndItemSelections, value: null },
    //   { atom: selectedMenuPanelAtom, value: null },
    // ]);

    const { data } = await axios.get('/api/loadTODO.php', {
      params: { courseId },
    });
    console.log('Next7 data: ', data);
    // console.log('Next7 first assignment: ', data.assignments[0]);
    // if (!data.success) {
    //   setProblemMessage(data.message);
    //   return;
    // }
    // if (data.assignments) {
    //   setAssignmentArray(data.assignments);
    //   setPinnedArray(data.pinned);
    // }
    // if (data.classTimes) {
    //   set(classTimesAtom, data.classTimes);
    // }
    // if (data.completed) {
    //   setCompletedArray(data.completed);
    // }
  };

  useEffect(() => {
    loadAssignmentArray("_boBjvqOCpfXZkOpfWzp19");
  }, [])
  return (
    <>
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
            <TableHead><Text fontSize=".9rem">Completed</Text></TableHead>
          </Row>
          <Row>
            <Col width="40%"><Text>Assignment 1</Text></Col>
            <Col textAlign="center"><Text>10/15</Text></Col>
            <Col>
              <DueDateBar  
                startDate={new Date("2022-01-01 00:00:00")}
                endDate={new Date("2022-12-31 00:00:00")}
                width="100%"
              />
            </Col>
            <Col>
              <FlexBox justifyContent="center">
                <Checkbox
                  onClick={(e) => e}
                />
              </FlexBox>
            </Col>
          </Row>
        </Table>
      </Container>
      <Container>
        <FlexBox gap="5px">
          <Button
            dataTest='previous week button'
            onClick={e => e}
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
          />
          <Button
            dataTest='next week button'
            onClick={e => e}
            icon={<FontAwesomeIcon icon={faChevronRight} />}
          />
          <Button onClick={e => e} value="This Week" />
          <Text fontSize="1.3rem">October 3rd - October 9th</Text>
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
            <TableHead><Text fontSize=".9rem">Completed</Text></TableHead>
          </Row>
          <Row>
            <Col width="40%"><Text>Assignment 1</Text></Col>
            <Col textAlign="center"><Text>10/15</Text></Col>
            <Col>
              <DueDateBar  
                startDate={new Date("2022-01-01 00:00:00")}
                endDate={new Date("2022-11-15 00:00:00")}
                isCompleted
                width="100%"
              />
            </Col>
            <Col>
              <FlexBox justifyContent="center">
                <Checkbox
                  checked={true}
                  onClick={(e) => e}
                />
              </FlexBox>
            </Col>
          </Row>
          <Row>
            <Col width="40%">
              <EllipsisText>
                Assignment with A REALLYYYYY REALLLYYYY LONGGGGGGG nameeeeeeeeeeeee
              </EllipsisText>
            </Col>
            <Col textAlign="center"><Text>-/15</Text></Col>
            <Col>
              <DueDateBar  
                startDate={new Date("2022-11-15 00:00:00")}
                endDate={new Date("2022-12-31 00:00:00")}
                width="100%"
              />
            </Col>
            <Col>
              <FlexBox justifyContent="center">
                <Checkbox
                  onClick={(e) => e}
                />
              </FlexBox>
            </Col>
          </Row>
          <Row>
            <Col width="40%"><Text>Assignment 3</Text></Col>
            <Col textAlign="center"><Text>10/15</Text></Col>
            <Col>
              <DueDateBar  
                startDate={new Date("2022-11-30 00:00:00")}
                endDate={new Date("2022-12-31 00:00:00")}
                width="100%"
              />
            </Col>
            <Col>
              <FlexBox justifyContent="center">
                <Checkbox
                  onClick={(e) => e}
                />
              </FlexBox>
            </Col>
          </Row>
          <Row>
            <Col width="40%"><Text>Assignment 4</Text></Col>
            <Col textAlign="center"><Text>10/15</Text></Col>
            <Col>
              <DueDateBar  
                startDate={new Date("2022-12-05 00:00:00")}
                endDate={new Date("2022-12-31 00:00:00")}
                width="100%"
              />
            </Col>
            <Col>
              <FlexBox justifyContent="center">
                <Checkbox
                  onClick={(e) => e}
                />
              </FlexBox>
            </Col>
          </Row>
          <Row>
            <Col width="40%"><Text>Assignment 5</Text></Col>
            <Col textAlign="center"><Text>10/15</Text></Col>
            <Col>
              <DueDateBar  
                startDate={new Date("2022-10-12 00:00:00")}
                endDate={new Date("2022-12-07 00:00:00")}
                width="100%"
              />
            </Col>
            <Col>
              <FlexBox justifyContent="center">
                <Checkbox
                  onClick={(e) => e}
                />
              </FlexBox>
            </Col>
          </Row>
        </Table>
      </Container>
    </>
    
  )
}

