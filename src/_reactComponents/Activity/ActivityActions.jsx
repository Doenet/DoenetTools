import axios from 'axios';
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil';
import { useToast } from '../../Tools/_framework/Toast';
import { DateToUTCDateString } from '../../_utils/dateUtilityFunction';
import { authorItemByDoenetId } from '../Course/CourseActions';

export const useActivity = (courseId, doenetId) => {
  const addToast = useToast();
  const activity = useRecoilValueLoadable(
    authorItemByDoenetId(doenetId),
  ).getValue();
  const updateAssignmentSettings = useRecoilCallback(
    ({ set }) =>
      async (...valuesWithDescriptionsToUpdateByKey) => {
        const updateObject = valuesWithDescriptionsToUpdateByKey.reduce(
          (obj, { keyToUpdate, value }) => {
            obj[keyToUpdate] = value;
            return obj;
          },
          {},
        );

        const dateFormatKeys = [
          'assignedDate',
          'dueDate',
          'pinnedUntilDate',
          'pinnedAfterDate',
        ];

        for (let key of dateFormatKeys) {
          if (updateObject[key] && updateObject[key] !== null) {
            updateObject[key] = DateToUTCDateString(
              new Date(updateObject[key]),
            );
          }
        }

        const resp = await axios.post('/api/updateAssignmentSettings.php', {
          ...updateObject,
          courseId,
          doenetId,
        });

        if (resp.data.success) {
          set(authorItemByDoenetId(doenetId), (prev) => ({
            ...prev,
            ...updateObject,
          }));
          for (const {
            description,
            valueDescription,
            value,
            keyToUpdate,
          } of valuesWithDescriptionsToUpdateByKey) {
            if (valueDescription) {
              addToast(`Updated ${description} to ${valueDescription}`);
            } else if (description) {
              addToast(
                `Updated ${description} to ${
                  dateFormatKeys.includes(keyToUpdate)
                    ? new Date(value).toLocaleString()
                    : value
                }`,
              );
            }
          }
        }
      },
    [courseId, doenetId],
  );

  return { value: activity, updateAssignmentSettings };
};
