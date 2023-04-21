import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  itemByDoenetId,
  courseIdAtom,
  useCourse,
} from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
// import { ClipboardLinkButtons } from '../ToolHandlers/CourseToolHandler';
import { find_image_label, find_color_label } from './util';

export default function EditorInfoCap() {
  const courseId = useRecoilValue(courseIdAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const pageId = useRecoilValue(searchParamAtomFamily('pageId'));
  let { color, image, label: course_label } = useCourse(courseId);

  const pageInfo = useRecoilValue(itemByDoenetId(pageId));
  const activityInfo = useRecoilValue(itemByDoenetId(doenetId));

  let accessible_name = 'course';

  if (!pageInfo || !image) {
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
        {activityInfo.label}
      </div>
      <div style={{ marginBottom: '1px', marginTop: '5px' }}>Page</div>
      <div style={{ marginBottom: '5px', padding: '1px 5px' }}>
        {pageInfo.label}
      </div>
    </>
  );

  if (activityInfo.isSinglePage) {
    activityPageJSX = (
      <>
        <div style={{ marginBottom: '1px', marginTop: '5px' }}>Activity</div>
        <div style={{ marginBottom: '5px', padding: '1px 5px' }}>
          {activityInfo.label}
        </div>
      </>
    );
  }

  if (activityInfo.type == 'bank') {
    activityPageJSX = (
      <>
        <div style={{ marginBottom: '1px', marginTop: '5px' }}>Collection</div>
        <div style={{ marginBottom: '5px', padding: '1px 5px' }}>
          {activityInfo.label}
        </div>
        <div style={{ marginBottom: '1px', marginTop: '5px' }}>Page</div>
        <div style={{ marginBottom: '5px', padding: '1px 5px' }}>
          {pageInfo.label}
        </div>
      </>
    );
  }

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
      <b>Editor</b>
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
