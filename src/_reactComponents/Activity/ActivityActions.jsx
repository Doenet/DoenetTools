import axios from 'axios';
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil';
import { useToast } from '../../Tools/_framework/Toast';
import { DateToUTCDateString, DateToUTCDateWithoutSecondsString } from '../../_utils/dateUtilityFunction';
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

        let updateDBObj = {...updateObject}

        //Update assigned date to UTC time for the database
        if (updateDBObj['assignedDate'] !== undefined &&
        updateDBObj['assignedDate'] !== null
        ){
          updateDBObj['assignedDate'] = DateToUTCDateString(new Date(updateDBObj['assignedDate']))
        }

        // Update due date to UTC time for the database
        if (updateDBObj['dueDate'] !== undefined &&
        updateDBObj['dueDate'] !== null
        ){
          updateDBObj['dueDate'] = DateToUTCDateWithoutSecondsString(new Date(updateDBObj['dueDate']))
        }

        // Update pinned After Date to UTC time for the database
        if (updateDBObj['pinnedAfterDate'] !== undefined &&
        updateDBObj['pinnedAfterDate'] !== null
        ){
          updateDBObj['pinnedAfterDate'] = DateToUTCDateString(new Date(updateDBObj['pinnedAfterDate']))
        }

        // Update pinned Until Date to UTC time for the database
        if (updateDBObj['pinnedUntilDate'] !== undefined &&
        updateDBObj['pinnedUntilDate'] !== null
        ){
          updateDBObj['pinnedUntilDate'] = DateToUTCDateString(new Date(updateDBObj['pinnedUntilDate']))
        }

        const resp = await axios.post('/api/updateAssignmentSettings.php', {
          ...updateDBObj,
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
