import axios from "axios";
import { useRecoilCallback } from "recoil";
import { toastType, useToast } from "../../Tools/_framework/Toast";
import { fileByPageId } from "../../_reactComponents/Course/CourseActions";
import {
  textEditorDoenetMLAtom,
  textEditorLastKnownCidAtom,
} from "../../_sharedRecoil/EditorViewerRecoil";
import { cidFromText } from "../../Core/utils/cid";

export function useSaveDraft() {
  const addToast = useToast();
  const saveDraft = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ pageId, courseId, backup = false, doenetML, lastKnownCid }) => {
        if (doenetML == undefined) {
          doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
        }
        if (lastKnownCid == undefined) {
          lastKnownCid = await snapshot.getPromise(textEditorLastKnownCidAtom);
        }

        //Save in localStorage
        // localStorage.setItem(cid,doenetML)

        try {
          const params = {
            doenetML,
            pageId,
            courseId,
            backup,
            lastKnownCid,
          };
          const {
            data: { success, message },
          } = await axios.post("/api/saveDoenetML.php", params);

          if (!success) throw new Error(message);

          set(fileByPageId(pageId), doenetML);
          const cid = await cidFromText(doenetML);
          set(textEditorLastKnownCidAtom, cid);

          return { success, cid };
        } catch (error) {
          //addToast(error.message, toastType.ERROR);
          alert(error.message);
          return { success: false };
        }
      },
    [addToast],
  );

  return { saveDraft };
}
