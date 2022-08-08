import axios from 'axios';
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil';
import { useToast } from '../../Tools/_framework/Toast';
import { itemByDoenetId } from '../Course/CourseActions';

const dateFormatKeys = [
  'assignedDate',
  'dueDate',
  'pinnedUntilDate',
  'pinnedAfterDate',
];

export const useActivity = (courseId, doenetId) => {
  const addToast = useToast();
  const activity = useRecoilValueLoadable(itemByDoenetId(doenetId)).getValue();

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

        const resp = await axios.post('/api/updateAssignmentSettings.php', {
          ...updateObject,
          courseId,
          doenetId,
        });

        if (resp.data.success) {
          set(itemByDoenetId(doenetId), (prev) => ({
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
    [addToast, courseId, doenetId],
  );

  const updateActivityFlags = useRecoilCallback(
    ({ set }) =>
      async (...valuesWithDescriptionsToUpdateByKey) => {
        const updateObject = valuesWithDescriptionsToUpdateByKey.reduce(
          (obj, { keyToUpdate, value }) => {
            obj[keyToUpdate] = value;
            return obj;
          },
          {},
        );

        const resp = await axios.post('/api/updateContentFlags.php', {
          ...updateObject,
          courseId,
          doenetId,
        });

        if (resp.data.success) {
          set(itemByDoenetId(doenetId), (prev) => ({
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
    [addToast, courseId, doenetId],
  );

  return { value: activity, updateAssignmentSettings, updateActivityFlags };
};
