import React, { useCallback, useEffect, useRef } from 'react';
import { faTh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  folderDictionary,
  fetchDrivesQuery,
  clearDriveAndItemSelections,
} from '../Drive/NewDrive'; //TODO: Migrate to parent component
import {
  useRecoilValue,
  atomFamily,
  selectorFamily,
  useSetRecoilState,
  useRecoilValueLoadable,
} from 'recoil';
import { pageToolViewAtom } from '../../Tools/_framework/NewToolRoot';
import styled from 'styled-components';

// import { assignmentData, studentData } from "../../Tools/_framework/ToolPanels/Gradebook"

const Breadcrumb = styled.ul`
  list-style: none;
  overflow: hidden;
  height: 22px;
  display: flex;
`;

const BreadcrumbItem = styled.li`
  float: left;
  &:last-of-type span {
    border-radius: 0px 15px 15px 0px;
    padding: 0px 25px 0px 45px;
    background: var(--lightblue);
    color: black;
  }
  &:first-of-type span {
    padding: 0px 0px 0px 30px;
  }
  &:only-child span {
    border-radius: 15px;
    padding: 0px 30px 0px 30px;
    background: var(--lightBlue);
    color: black;
  }
`;

const BreadcrumbSpan = styled.span`
  padding: 0px 0px 0px 45px;
  position: relative;
  float: left;
  color: white;
  background: var(--mainBlue);
  border-radius: 15px 0px 0px 15px;
  cursor: pointer;
  &::after {
    content: ' ';
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid var(--mainBlue);
    position: absolute;
    top: 50%;
    margin-top: -50px;
    left: 100%;
    z-index: 2;
  }
  &::before {
    content: ' ';
    width: 0;
    height: 0;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 30px solid white;
    position: absolute;
    top: 50%;
    margin-top: -50px;
    margin-left: 1px;
    left: 100%;
    z-index: 1;
  }
`;

const breadcrumbItemAtomFamily = atomFamily({
  key: 'breadcrumbItemAtomFamily',
  default: selectorFamily({
    key: 'breadcrumbItemAtomFamily/Default',
    get:
      ({ driveId, folderId }) =>
      ({ get }) => {
        let items = [];
        if (!driveId) {
          return items;
        }
        while (folderId) {
          let folderInfo = get(folderDictionary({ driveId, folderId }));
          if (!folderInfo.folderInfo.itemId) {
            break;
          }

          items.push({
            type: 'Folder',
            folderId: folderInfo.folderInfo.itemId,
            label: folderInfo.folderInfo.label,
          });
          folderId = folderInfo.folderInfo.parentFolderId;
        }
        const drivesInfo = get(fetchDrivesQuery);
        let driveObj = { type: 'Drive', folderId: driveId };
        for (let drive of drivesInfo.driveIdsAndLabels) {
          if (drive.driveId === driveId) {
            driveObj.label = drive.label;
            break;
          }
        }
        items.push(driveObj);
        return items;
      },
  }),
});

export default function BreadCrumb({ path, tool, tool2, doenetId, label, userId, attemptNumber, source, assignments, students}) {
  const [driveId, parentFolderId] = path.split(':');
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);

  const returnToCourseChooserRef = useRef(null);
  const returnToDashboardRef = useRef(null);
  const returnToToolHeadRef = useRef(null);
  const childrenRef = useRef(null);
  const returnToToolHead2Ref = useRef(null);
  const returnToIndividualViewRef = useRef(null);
  const returnToMixedViewRef = useRef(null);
  const returnToAttemptViewRef = useRef(null);
  // const breadcrumbRef = useRef(null);

  useEffect(() => {
    // if (breadcrumbRef.current) {
    //   const { current } = breadcrumbRef
    //   const boundingRect = current.getBoundingClientRect()
    //   const { width, height } = boundingRect
    //   console.log("width", width-40);
    // }
    var width = 0;
    if (returnToCourseChooserRef.current != null){
      width = returnToCourseChooserRef.current.offsetWidth;
      if (returnToDashboardRef.current != null) {
      width = returnToCourseChooserRef.current.offsetWidth + returnToDashboardRef.current.offsetWidth;
      if (returnToToolHeadRef.current != null) {
        width += returnToToolHeadRef.current.offsetWidth;
        // if (tool){
        //   let folders = [...items];
        //   folders.pop(); //First one is already covered with returnToToolHead
        //   [...folders].reverse().map((item) => (item.label = useRef(null)));}
        if (childrenRef.current != null) {
          width += childrenRef.current.offsetWidth;
          if (returnToToolHead2Ref.current != null) {
            width += returnToToolHead2Ref.current.offsetWidth;
            if (returnToIndividualViewRef.current != null) {
              width += returnToIndividualViewRef.current.offsetWidth;
              if (returnToMixedViewRef.current != null) {
                width += returnToMixedViewRef.current.offsetWidth;
                if (returnToAttemptViewRef.current != null) {
                  width += returnToAttemptViewRef.current.offsetWidth;
                }
              }
            }
          }
        }
      }
    }
    }
    console.log("width", width)
  }, []);


  //TODO reivew for multi drive
  const items = useRecoilValue(
    breadcrumbItemAtomFamily({
      driveId: driveId,
      folderId: parentFolderId,
    }),
  );

  const goToFolder = useCallback(
    (driveId, folderId) => {
      clearSelections();
      setPageToolView((was) => ({
        // ...was,
        page:was.page,
        tool:'navigation',
        view:was.view,
        params: {
          path: `${driveId}:${folderId}:${folderId}:Folder`,
        },
      }));
    },
    [setPageToolView, clearSelections],
  );

  //Don't show up if not in a drive
  // if (driveId === '') {
  //   return null;
  // }

  let courseTitle = items[items.length - 1]?.label;

  let returnToToolHead = null;

  if (tool){
    let toolName = '';
    let params = {
      path: `${driveId}:${driveId}:${driveId}:Drive`,
    }
    if (tool === 'Content'){
      toolName = 'navigation';
    }else if (tool === 'Enrollment'){
      toolName = 'enrollment';
      params = {driveId}
    }else if (tool === 'Gradebook'){
      toolName = 'gradebook';
      params = {driveId}
    }else if (tool === 'CourseChooser'){
      toolName = 'courseChooser';
      params = {}
    }

    
    returnToToolHead = 
      (
        <BreadcrumbItem 
        // ref={returnToToolHeadRef}
        >
          <BreadcrumbSpan
            role="button"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPageToolView((was) => ({ 
                  page:was.page,
                  tool:toolName,
                  view:was.view,
                  params,}));
              }
            }}
            onClick={() => {
              setPageToolView((was) => ({ 
                page:was.page,
                tool:toolName,
                view:was.view,
                params,}));
            }}
          >
            {tool}
          </BreadcrumbSpan>
        </BreadcrumbItem>
        
      )
    
  }

  const returnToCourseChooser = (
    <BreadcrumbItem 
    ref={returnToCourseChooserRef}
    >
      <BreadcrumbSpan
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setPageToolView({
              page: 'course',
              tool: 'courseChooser',
              view: '',
            });
          }
        }}
        onClick={() => {
          setPageToolView({ page: 'course', tool: 'courseChooser', view: '' });
        }}
      >
        <FontAwesomeIcon icon={faTh} />
      </BreadcrumbSpan>
    </BreadcrumbItem>
  );

  if (tool === 'CourseChooser'){
    return <Breadcrumb>{returnToCourseChooser} 
    {/* <BreadcrumbItem><BreadcrumbSpan></BreadcrumbSpan></BreadcrumbItem> */}
    </Breadcrumb>
  }

  const returnToDashboard = (
    <BreadcrumbItem ref = {returnToDashboardRef}>
      <BreadcrumbSpan
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setPageToolView((was) => ({ 
              page:was.page,
              tool:'dashboard',
              view:'',
              params: {
                path: `${driveId}:${driveId}:${driveId}:Drive`,
              },}));
          }
        }}
        onClick={() => {
          setPageToolView((was) => ({ 
            page:was.page,
            tool:'dashboard',
            view:'',
            params: {
              path: `${driveId}:${driveId}:${driveId}:Drive`,
            },}));
        }}
      >
        {courseTitle}
      </BreadcrumbSpan>
    </BreadcrumbItem>
  );

  let children = null;

  if (tool){
    let folders = [...items];
    folders.pop(); //First one is already covered with returnToToolHead
    // [...folders].reverse().map((item) => (item.label = useRef(null)));
    children = [...folders].reverse().map((item) => (
    <BreadcrumbItem key={item.folderId}>
      <BreadcrumbSpan 
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            goToFolder(driveId, item.folderId);
          }
        }}
        onClick={() => {
          goToFolder(driveId, item.folderId);
        }}
      >
        {item.label}
      </BreadcrumbSpan>
    </BreadcrumbItem>
  ));
      }

 
    let returnToToolHead2 = null;
    let tool2name = '';
    let params2 = {};

    if (tool2 === 'Assignment'){
      tool2name = 'assignment';
      params2 = {doenetId}
    }else if (tool2 === 'Editor'){
      tool2name = 'editor';
      params2 = {doenetId,path}
    }
    if (tool2){
      returnToToolHead2 = 
      (
        <BreadcrumbItem 
        ref={returnToToolHead2Ref}
        >
          <BreadcrumbSpan
            role="button"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPageToolView((was) => ({ 
                  page:was.page,
                  tool:tool2name,
                  view:'',
                  params:params2,}));
              }
            }}
            onClick={() => {
              setPageToolView((was) => ({ 
                page:was.page,
                tool:tool2name,
                view:'',
                params:params2,}));
            }}
          >
            {label}
          </BreadcrumbSpan>
        </BreadcrumbItem>
        
      )
        }
    

  let returnToAssignmentView = null

  if (tool === 'Gradebook' && doenetId !== null && doenetId !== '' && assignments.state === 'hasValue'){
    returnToAssignmentView = (
      <BreadcrumbItem key={doenetId} 
      ref={returnToIndividualViewRef}
      >
      <BreadcrumbSpan
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setPageToolView(() => ({ 
              page:'course',
              tool:'gradebookAssignment',
              view:'',
              params:{ driveId, doenetId },}));
          }
        }}
        onClick={() => {
          setPageToolView(() => ({ 
            page:'course',
            tool:'gradebookAssignment',
            view:'',
            params:{ driveId, doenetId },}));
        }}
      >
        {assignments.contents[doenetId]}
      </BreadcrumbSpan>
    </BreadcrumbItem>
    )
  }

  let returnToStudentView = null

  if (tool === 'Gradebook' && userId !== null && userId !== '' && students.state === 'hasValue'){
    // console.log(">>>> bc userid: ", userId)
    returnToStudentView = (
      <BreadcrumbItem key={userId+"*"} 
      ref={returnToIndividualViewRef}
      >
      <BreadcrumbSpan
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setPageToolView(() => ({ 
              page:'course',
              tool:'gradebookStudent',
              view:'',
              params:{ driveId, userId },}));
          }
        }}
        onClick={() => {
          setPageToolView(() => ({ 
            page:'course',
            tool:'gradebookStudent',
            view:'',
            params:{ driveId, userId },}));
        }}
      >
        {students.contents[userId].firstName + " " + students.contents[userId].lastName}
      </BreadcrumbSpan>
    </BreadcrumbItem>
    )
  }

  let returnToAttemptView = null

  if (tool === 'Gradebook' && doenetId !== null && doenetId !== '' && userId !== null && userId !== '' && attemptNumber !== null && attemptNumber !== ''){
    console.log(">>>>", {doenetId, userId, attemptNumber, })
    
    returnToAttemptView = (
    <BreadcrumbItem key={userId+"_"+attemptNumber} 
    ref={returnToAttemptViewRef}
    >
      <BreadcrumbSpan
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setPageToolView(() => ({ 
              page:'course',
              tool:'gradebookAttempt',
              view:'',
              params:{ driveId, doenetId, userId, attemptNumber, source },}));
          }
        }}
        onClick={() => {
          setPageToolView(() => ({ 
            page:'course',
            tool:'gradebookAttempt',
            view:'',
            params:{ driveId, doenetId, userId, attemptNumber, source },}));
        }}
      >
        {"Attempt " + attemptNumber}
      </BreadcrumbSpan>
    </BreadcrumbItem>
    )
  }


  let returnToIndividualView = null

  if(source === null || source === ''){
    if(returnToAssignmentView){
      returnToIndividualView = returnToAssignmentView
    }
    else{
      returnToIndividualView = returnToStudentView
    }
  }else if (source === 'assignment'){
    returnToIndividualView = returnToAssignmentView
  }else if (source === 'student'){
    returnToIndividualView = returnToStudentView
  }


  let returnToMixedView = null

  if (tool === 'Gradebook' && doenetId !== null && doenetId !== '' && userId !== null && userId !== '' && students.state === 'hasValue' && assignments.state === 'hasValue'){
    
    returnToMixedView = (
    <BreadcrumbItem key={userId+"_"+doenetId} 
    ref={returnToMixedViewRef}
    >
      <BreadcrumbSpan
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setPageToolView(() => ({ 
              page:'course',
              tool:'gradebookStudentAssignment',
              view:'',
              params:{ driveId, doenetId, userId, source },}));
          }
        }}
        onClick={() => {
          setPageToolView(() => ({ 
            page:'course',
            tool:'gradebookStudentAssignment',
            view:'',
            params:{ driveId, doenetId, userId, source},}));
        }}
      >
        {source === 'student' ? assignments.contents[doenetId] : students.contents[userId].firstName + " " + students.contents[userId].lastName}
      </BreadcrumbSpan>
    </BreadcrumbItem>
    )
  }


  return (
    
      <Breadcrumb 
      // ref={breadcrumbRef}
      >
      {returnToCourseChooser} {returnToDashboard} {returnToToolHead} {children} {returnToToolHead2} {returnToIndividualView} {returnToMixedView} {returnToAttemptView}
    </Breadcrumb>
 
      
    
  );
}
