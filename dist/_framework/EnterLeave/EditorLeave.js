import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {currentDraftSelectedAtom, selectedVersionIdAtom} from "../Menus/VersionHistory.js";
export default function EditorLeave() {
  const resetToCurrent = useRecoilCallback(({set}) => () => {
    set(currentDraftSelectedAtom, true);
    set(selectedVersionIdAtom, null);
  });
  resetToCurrent();
  return null;
}
