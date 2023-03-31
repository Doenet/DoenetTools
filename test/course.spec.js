import { useCourse, coursePermissionsAndSettings } from '../src/_reactComponents/Course/CourseActions';
import { renderHook } from '@testing-library/react';
import { RecoilRoot, useRecoilSetState } from 'recoil';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

test('test creating a course', () => {
    // https://recoiljs.org/docs/guides/testing/#testing-recoil-state-inside-a-custom-hook
    // doesn't work because we need a <RecoilRoot> in the render tree
    // let { course } = renderHook(() => useCourse(12345));



    // try to manually set course details, the call to axios is in an effect that isn't being called in the path of useCourse
    // from src/Api/defineDBAndUserAndCourseInfo.php
    /*

    $settings->sql = "SELECT
    c.courseId,
    c.label,
    c.isPublic,
    c.image,
    c.color,
    c.defaultRoleId,
    c.canAutoEnroll,
    cr.roleId,
    cr.label AS roleLabel,
    cr.isIncludedInGradebook,
    cr.canViewContentSource,
    cr.canEditContent,
    cr.canPublishContent,
    cr.canViewUnassignedContent,
    cr.canProctor,
    cr.canViewAndModifyGrades,
    cr.canViewActivitySettings,
    cr.canModifyActivitySettings,
    cr.canModifyCourseSettings,
    cr.canViewUsers,
    cr.canManageUsers,
    cr.canViewCourse,
    cr.isAdmin,
    cr.dataAccessPermission,
    cr.isOwner
    FROM course_role AS cr
    LEFT JOIN course_user as cu
    ON cu.roleId = cr.roleId
    RIGHT JOIN course AS c
    ON c.courseId = cu.courseId
    WHERE cu.userId = '$userId'
    AND c.isDeleted = '0'
    ORDER BY c.id DESC
    ";
    */

    axios.get.mockResolvedValue({data: {coursePermissionsAndSettings: [{ courseId: 12345, canEditContent : 1 }] }}); 
    //axios.put.mockResolvedValue({data: []}); 
    const resp = {success: true};
    axios.post.mockResolvedValue(resp); 

    act(() => {
    renderHook(() => {
            let { create } = useCourse(12345);
            create( { itemType: 'activity', 
                    parentDoenetId: '1', 
                    previousDoenetId: '2', 
                    previousContainingDoenetId: '3'
                },
                () => {console.log("successs!")}, //successCallback
                (e) => { console.log("something failed", e)} //failureCallback
            );
        },
        { wrapper: RecoilRoot}
    );
    });
});
