import { useRecoilCallback } from "recoil";
import {
  currentDraftSelectedAtom,
  selectedVersionIdAtom,
} from "../Menus/VersionHistory";

export default function EditorLeave() {
  // console.log(">>>>===EditorLeave")
  const resetToCurrent = useRecoilCallback(({ set }) => () => {
    set(currentDraftSelectedAtom, true);
    set(selectedVersionIdAtom, null);
  });
  resetToCurrent();

  return null;
}
