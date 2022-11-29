import axios from "../../_snowpack/pkg/axios.js";
import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {toastType, useToast} from "../../_framework/Toast.js";
import {fileByPageId} from "../../_reactComponents/Course/CourseActions.js";
import {textEditorDoenetMLAtom} from "../../_sharedRecoil/EditorViewerRecoil.js";
export function useSaveDraft() {
  const addToast = useToast();
  const saveDraft = useRecoilCallback(({snapshot, set}) => async ({pageId, courseId, backup = false}) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    try {
      const params = {
        doenetML,
        pageId,
        courseId,
        backup
      };
      const {
        data: {success, message}
      } = await axios.post("/api/saveDoenetML.php", params);
      if (!success)
        throw new Error(message);
      set(fileByPageId(pageId), doenetML);
      return {success};
    } catch (error) {
      addToast(error.message, toastType.ERROR);
      return {success: false};
    }
  }, [addToast]);
  return {saveDraft};
}
