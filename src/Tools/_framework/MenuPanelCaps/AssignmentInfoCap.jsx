import React, { useEffect, useState } from 'react';
import { find_image_label, find_color_label } from './util';
import { useRecoilValue } from 'recoil';
// import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
// import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
// import axios from 'axios';
// import { currentAttemptNumber } from '../ToolPanels/AssignmentViewer';
import {
  // itemByDoenetId,
  courseIdAtom,
  coursePermissionsAndSettingsByCourseId,
  // useCourse
} from '../../../_reactComponents/Course/CourseActions';

export default function AssignmentInfoCap() {
  const courseId = useRecoilValue(courseIdAtom);

  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));

  if (!course || Object.keys(course).length == 0) {
    return null;
  }
  // let roles = [...course.roleLabels];
  let color = course.color;
  let image = course.image;
  // let label = course.label;

  let accessible_name = 'course';

  if (image != 'none') {
    accessible_name = find_image_label(image);
    image = 'url(./drive_pictures/' + image + ')';
  }

  if (color != 'none') {
    accessible_name = find_color_label(color);
    color = '#' + color;
  }
  // let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  // let { page } = useRecoilValue(pageToolViewAtom);
  // const { numberOfAttemptsAllowed } = useRecoilValue(loadAssignmentSelector(doenetId));
  // const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);

  // let [courseId,setCourseId] = useState("");
  // let [contentLabel,setContentLabel] = useState("");
  // const { image, label: courseLabel}  = useCourse(courseId);
  // const {label: itemLabel} = useRecoilValue(itemByDoenetId(doenetId));

  // useEffect(()=>{
  //   axios.get('/api/findCourseIdAndParentDoenetId.php', {
  //     params: { doenetId },
  //   }).then((resp)=>{
  //     setCourseId(resp.data.courseId);
  //   })
  //   if (page === 'exam'){
  // axios.get('/api/getExamLabel.php', {
  //     params: { doenetId },
  //   }).then((resp)=>{
  //     setContentLabel(resp.data.label);
  //   })
  //   } else if (page === 'course') {
  //     setContentLabel(itemLabel)
  //   }

  // },[doenetId, itemLabel, page])

  //  let attemptsAllowedDescription = numberOfAttemptsAllowed;
  //  if (!numberOfAttemptsAllowed){
  //   attemptsAllowedDescription = "Unlimited";
  //  }

  //  let attemptInfo = null;
  //  if (recoilAttemptNumber){
  //   attemptInfo = <div>{recoilAttemptNumber} out of {attemptsAllowedDescription}</div>
  //  }
  //TODO: image and color defaults
  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '165px',
          overflow: 'hidden',
        }}
      >
        <img
          aria-label={accessible_name}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: image,
            backgroundColor: color,
          }}
        />
      </div>
      <b>Assignment</b>
      {/* <div style={{ padding:'16px 12px' }}>
      <span style={{ marginBottom: "15px" }}>{courseLabel ?? ''}</span> <br />
      <span style={{ marginBottom: "15px" }}>{contentLabel}</span> <br />
      <span>{ attemptInfo }</span>
    </div> */}
    </div>
  );
}
