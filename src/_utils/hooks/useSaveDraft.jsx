import axios from 'axios';
import { useRecoilCallback } from 'recoil';
import { fileByPageId } from '../../_reactComponents/Course/CourseActions';
import { textEditorDoenetMLAtom } from '../../_sharedRecoil/EditorViewerRecoil';

export function useSaveDraft() {
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
          const { data } = await axios.post('/api/saveDoenetML.php', params);
          set(fileByPageId(pageId), doenetML);
          if (!data.success) {
            //   //TODO: Toast here
            console.log('ERROR', data.message);
          }
          return { success: data.success };
        } catch (error) {
          console.log('ERROR', error);
          return { success: false };
        }
      },
    [],
  );

  return { saveDraft };
}
