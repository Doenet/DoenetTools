import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  itemByDoenetId,
  courseIdAtom,
  useCourse,
  useInitCourseItems,
} from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
import { find_image_label, find_color_label } from './util';

export default function ContentInfoCap() {
  const courseId = useRecoilValue(courseIdAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  let { color, image, label: course_label } = useCourse(courseId);
  // const {getDataAndSetRecoil} = useInitCourseItems(courseId);

  const activityInfo = useRecoilValue(itemByDoenetId(doenetId));
  //need to load activityInfo if it's empty (due to refreshed page)
  // if (Object.keys(activityInfo).length == 0){
  //   getDataAndSetRecoil(courseId);
  // }

  // console.log("activityInfo",activityInfo);

  let accessible_name = 'course';

  if (!image) {
    return null;
  }

  if (image != 'none') {
    accessible_name = find_image_label(image);
    image = 'url(/drive_pictures/' + image + ')';
  }
  if (color != 'none') {
    accessible_name = find_color_label(color);
    color = '#' + color;
  }

  let activityPageJSX = (
    <>
      <div style={{ marginBottom: '1px', marginTop: '5px' }}>Activity</div>
      <div style={{ marginBottom: '5px', padding: '1px 5px' }}>
        {activityInfo?.label}
      </div>
    </>
  );

  return (
    <>
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
      <div style={{ marginBottom: '1px', marginTop: '5px' }}>Course</div>
      <div style={{ marginBottom: '5px', padding: '1px 5px' }}>
        {course_label}
      </div>
      {activityPageJSX}
      {/* <ClipboardLinkButtons doenetId={doenetId}/> */}
      {/* <div>Last saved (comming soon)</div> */}
    </>
  );
}
