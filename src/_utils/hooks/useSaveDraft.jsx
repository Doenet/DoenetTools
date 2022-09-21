import axios from 'axios';
import { useRecoilCallback } from 'recoil';
import { toastType, useToast } from '../../Tools/_framework/Toast';
import { fileByPageId } from '../../_reactComponents/Course/CourseActions';
import { textEditorDoenetMLAtom } from '../../_sharedRecoil/EditorViewerRecoil';

export function useSaveDraft() {
  const addToast = useToast();
  const saveDraft = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ pageId, courseId, backup = false }) => {
        const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);

        //Save in localStorage
        // localStorage.setItem(cid,doenetML)

        try {
          const params = {
            doenetML,
            pageId,
            courseId,
            backup,
          };
          const {
            data: { success, message },
          } = await axios.post('/api/saveDoenetML.php', params);

          if (!success) throw new Error(message);

          set(fileByPageId(pageId), doenetML);

          return { success };
        } catch (error) {
          addToast(error.message, toastType.ERROR);
          return { success: false };
        }
      },
    [addToast],
  );

  return { saveDraft };
}
