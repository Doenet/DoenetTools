import React, { useState, useLayoutEffect } from 'react';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  authorCourseItemOrderByCourseId,
  courseIdAtom,
  findFirstPageOfActivity,
  itemByDoenetId,
  studentCourseItemOrderByCourseId,
} from '../../../_reactComponents/Course/CourseActions';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';

const itemOrderByCourseId = selectorFamily({
  key: 'itemOrderbyCourseId',
  get:
    (courseId) =>
    ({ get }) => {
      const { canViewUnassignedContent } = get(
        effectivePermissionsByCourseId(courseId),
      );
      if (canViewUnassignedContent === '1') {
        return get(authorCourseItemOrderByCourseId(courseId));
      } else {
        return get(studentCourseItemOrderByCourseId(courseId));
      }
    },
});

const activityOrderByCourseId = selectorFamily({
  key: 'activityOrderByCourseId',
  get:
    (courseId) =>
    ({ get, getCallback }) => {
      const itemOrder = get(itemOrderByCourseId(courseId));
      const activityOrder = itemOrder.filter(
        (doenetId) => get(itemByDoenetId(doenetId))?.type === 'activity',
      );

      const getInfoFromIndex = getCallback(({ snapshot }) => (idx) => {
        if (idx < 0 || idx >= activityOrder.length) return {};
        return snapshot
          .getLoadable(itemByDoenetId(activityOrder[idx]))
          .getValue();
      });

      const getFirstPageFromIndex = getCallback(({ snapshot }) => (idx) => {
        if (idx < 0 || idx >= activityOrder.length) return null;
        return findFirstPageOfActivity(
          snapshot.getLoadable(itemByDoenetId(activityOrder[idx])).getValue()
            ?.content ?? [],
        );
      });

      return {
        value: activityOrder,
        getInfoFromIndex,
        getFirstPageFromIndex,
      };
    },
});

export default function ActivityNavigationbuttons(props) {
  const [neighborParams, setNeighborParams] = useState({
    previous: null,
    next: null,
  });
  const courseId = useRecoilValue(courseIdAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const navigate = useSetRecoilState(pageToolViewAtom);
  const { value: activityOrder, getFirstPageFromIndex } = useRecoilValue(
    activityOrderByCourseId(courseId),
  );

  useLayoutEffect(() => {
    const itemIdx = activityOrder.indexOf(doenetId);
    setNeighborParams({
      previous:
        itemIdx > 0
          ? {
              doenetId: activityOrder[itemIdx - 1],
              pageId: getFirstPageFromIndex(itemIdx - 1),
            }
          : null,
      next:
        itemIdx < activityOrder.length - 1
          ? {
              doenetId: activityOrder[itemIdx + 1],
              pageId: getFirstPageFromIndex(itemIdx + 1),
            }
          : null,
    });
  }, [activityOrder, doenetId, getFirstPageFromIndex]);

  return (
    <ButtonGroup>
      <Button
        data-test="Previous Activity Button"
        value="Previous"
        onClick={() => {
          navigate((prev) => ({
            ...prev,
            params: { ...prev.params, ...neighborParams.previous },
          }));
        }}
        disabled={neighborParams.previous === null}
      />
      <Button
        data-test="Next Activity Button"
        value="Next"
        onClick={() => {
          navigate((prev) => ({
            ...prev,
            params: { ...prev.params, ...neighborParams.next },
          }));
        }}
        disabled={neighborParams.next === null}
      />
    </ButtonGroup>
  );
}
