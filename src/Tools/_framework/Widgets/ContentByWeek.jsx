import React, { useState, useEffect } from 'react';
import styled from "styled-components"
import DueDateBar from '../../../_reactComponents/PanelHeaderComponents/DueDateBar';
import Checkbox from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Container = styled.div`
  margin: 1.5rem 0;
  padding: 1.5rem 1rem;
  border: 1px solid var(--mainGray);
  border-radius: 10px;
`

const FlexBox = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent};
  align-items: center; 
  gap: ${props => props.gap};
  flex-direction: ${props => props.column && 'column'};
  padding: ${props => props.padding};
  margin-top:  ${props => props.mt};
  margin-bottom:  ${props => props.mb};
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
  text-align: ${props => props.textAlign}
`
const Row = styled.tr`
  border-bottom: 1px solid var(--mainGray);
`

const Col = styled.td`
  padding: .5rem 1rem; 
  text-align: ${props => props.textAlign};
  height: 90px;
  width: ${props => props.width};
  position: relative;
`

export default function ContentByWeek({ courseId }) {

  const [assignments, setAssignments] = useState([]);
  const [displayedAssignments, setDisplayedAssignments] = useState([]);
  const [pinnedAssignments, setPinnedAssignments] = useState([]);
  const [weekShift, setWeekShift] = useState(0); //-1 means 7 days before
  const [initialized, setInitialized] = useState(false);

  const loadAssignments = async courseId => {

    const { data } = await axios.get('/api/loadTODO.php', {
      params: { courseId },
    });
    // let completedAssignmentIDs = data.completed.map(assignment => assignment.doenetId);
    let amendedAssignments = data.assignments.map(assignment => {
      return {
        ...assignment, 
        isCompleted: data.completed.includes(assignment.doenetId)
      }
    })
    let amendedPinnedAssignments = data.pinned.map(assignment => {
      return {
        ...assignment, 
        isCompleted: data.completed.includes(assignment.doenetId)
      }
    })

    setPinnedAssignments(amendedPinnedAssignments);
    setAssignments(amendedAssignments);
  };
  

  const completeAssignment = async (assignment, isPinned) => {
    const { data } = await axios.get('/api/saveCompleted.php', {
      params: { doenetId: assignment.doenetId },
    });
    if (data.success) {
      if (isPinned) {
        let updatedPinnedAssignments = pinnedAssignments.map(assig => {
          return assig.doenetId === assignment.doenetId ? {...assig, isCompleted: !assig.isCompleted } : assig  
        })
        setPinnedAssignments(updatedPinnedAssignments);
        return;
      }
  
      let updatedAssignments = assignments.map(assig => {
        return assig.doenetId === assignment.doenetId ? {...assig, isCompleted: !assig.isCompleted } : assig  
      })
      setAssignments(updatedAssignments);
    } else {
      console.log("Server error");
    }
  }

  if (!initialized) {
    //Runs every time the page is returned to
    setInitialized(true); //prevent load on each refresh
    loadAssignments(courseId);
  }
  
  let today = new Date();
  let diff = today.getDay() == 0 ? -6 : 1 - today.getDay();
  //Start week on Monday
  let monday = new Date(
    today.getTime() +
      1000 * 60 * 60 * 24 * diff +
      1000 * 60 * 60 * 24 * weekShift * 7,
  );
  let sunday = new Date(monday.getTime() + 1000 * 60 * 60 * 24 * 6);
  const headerMonday = `${monday.getDate()} ${monday.toLocaleString('en-US', { month: 'short' })}`;
  const headerSunday = `${sunday.getDate()} ${sunday.toLocaleString('en-US', { month: 'short' })}`;

  //resets the assignments displayed when an assignment is completed or the week shifts
  useEffect(() => {
    setDisplayedAssignments(assignments.filter(assignment => new Date(assignment.dueDate) >= monday && new Date(assignment.dueDate) <= sunday));
  }, [assignments, weekShift])

  return (
    <>
      <Container>
        <FlexBox mb="1.5rem">
          <Text fontSize="1.3rem" >Pinned Content</Text>
        </FlexBox>
        <Table>
          <thead>
            <Row>
              <TableHead textAlign="left"><Text fontSize=".9rem">ACTIVITY NAME</Text></TableHead>
              {/* <TableHead><Text fontSize=".9rem">Score</Text></TableHead> */}
              <TableHead>
                <FlexBox justifyContent="space-between">
                  <Text fontSize=".9rem">ASSIGNED</Text>
                  <Text fontSize=".9rem">DUE</Text>
                </FlexBox>
              </TableHead>
              <TableHead><Text fontSize=".9rem">COMPLETED</Text></TableHead>
              <TableHead><Text fontSize=".9rem">VIEW RELATED</Text></TableHead>
            </Row>
          </thead>
          <tbody>
            {
              pinnedAssignments.map(assignment => (
                <Row key={`assignment-${assignment.doenetId}`}>
                  <Col width="30%">
                    <EllipsisText>{ assignment.label }</EllipsisText>
                  </Col>
                  {/* <Col textAlign="center">
                    {
                      assignment.gradeCategory && assignment.credit ?
                      <Text>{Math.round((assignment.creditOverride || assignment.credit) * (+assignment.totalPointsOrPercent) * 100) / 100}/{ +assignment.totalPointsOrPercent }</Text> :
                      <Text>-/{+assignment.totalPointsOrPercent}</Text>
                    }
                  </Col> */}
                  <Col>
                    <DueDateBar  
                      startDate={new Date(assignment.assignedDate)}
                      endDate={new Date(assignment.dueDate)}
                      isCompleted={assignment.isCompleted}
                      width="100%"
                    />
                  </Col>
                  <Col>
                    <FlexBox justifyContent="center">
                      <Checkbox
                        checked={assignment.isCompleted}
                        onClick={() => completeAssignment(assignment, true)}
                      />
                    </FlexBox>
                  </Col>
                </Row>
              ))
            }
          </tbody>
        
        </Table>
      </Container>
      <Container>
        <Text fontSize="1.3rem">{headerMonday} - {headerSunday}</Text>
        <FlexBox gap="5px" padding='5px 0' mt="10px" mb="1.5rem">
          <Button
            dataTest='Previous Week Button'
            onClick={() => setWeekShift(weekShift - 1)}
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
          />
          <Button
            dataTest='Next Week Button'
            onClick={() => setWeekShift(weekShift + 1)}
            icon={<FontAwesomeIcon icon={faChevronRight} />}
          />
          <Button 
            onClick={() => setWeekShift(0)} 
            value="This Week" 
          />
        </FlexBox>
        {
          displayedAssignments.length ? 
          <Table>
            <thead>
                <Row>
                  <TableHead textAlign="left"><Text fontSize=".9rem">ACTIVITY NAME</Text></TableHead>
                  {/* <TableHead><Text fontSize=".9rem">Score</Text></TableHead> */}
                  <TableHead>
                    <FlexBox justifyContent="space-between">
                      <Text fontSize=".9rem">ASSIGNED</Text>
                      <Text fontSize=".9rem">DUE</Text>
                    </FlexBox>
                  </TableHead>
                  <TableHead><Text fontSize=".9rem">COMPLETED</Text></TableHead>
                  {/* <TableHead><Text fontSize=".9rem">VIEW RELATED</Text></TableHead> */}
                </Row>
              </thead>
              <tbody>
                {
                  displayedAssignments.map(assignment => (
                    <Row key={`assignment-${assignment.doenetId}`}>
                      <Col width="30%">
                        <EllipsisText>{ assignment.label }</EllipsisText>
                      </Col>
                      {/* <Col textAlign="center">
                        {
                          assignment.gradeCategory && assignment.credit ?
                          <Text>{Math.round((assignment.creditOverride || assignment.credit) * (+assignment.totalPointsOrPercent) * 100) / 100}/{ +assignment.totalPointsOrPercent }</Text> :
                          <Text>-/{+assignment.totalPointsOrPercent}</Text>
                        }
                      </Col> */}
                      <Col>
                        <DueDateBar  
                          startDate={new Date(assignment.assignedDate)}
                          endDate={new Date(assignment.dueDate)}
                          isCompleted={assignment.isCompleted}
                          width="100%"
                        />
                      </Col>
                      <Col>
                        <FlexBox justifyContent="center">
                          <Checkbox
                            checked={assignment.isCompleted}
                            onClick={() => completeAssignment(assignment, false)}
                          />
                        </FlexBox>
                      </Col>
                    </Row>
                  ))
                }
              </tbody>
          </Table>
        :
          <FlexBox padding="2rem" justifyContent="center" align-items="center">
            <Text>NO ACTIVITIES THIS WEEK!</Text>
          </FlexBox>
      }
      </Container>
    </>
    
  )
}

