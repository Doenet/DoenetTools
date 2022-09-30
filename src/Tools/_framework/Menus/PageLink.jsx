import React from 'react';
import copyToClipboard from 'copy-to-clipboard';
import { useRecoilValue } from 'recoil';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import { searchParamAtomFamily } from '../NewToolRoot';
import { toastType, useToast } from '../Toast';
import axios from 'axios';
import { courseIdAtom } from '../../../_reactComponents/Course/CourseActions';
import { viewerDoenetMLAtom } from '../../../_sharedRecoil/EditorViewerRecoil';

export default function PageLink() {
  const addToast = useToast();

  const pageId = useRecoilValue(searchParamAtomFamily('pageId'));
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const courseId = useRecoilValue(courseIdAtom);
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);

  async function savePageDoenetMLAndCopyLink() {

    let params = {
      doenetML: viewerDoenetML,
      pageId,
      courseId,
      saveAsCid: true,
    }

    const { data } = await axios.post("/api/saveDoenetML.php", params)
    if (!data.success) {
      console.error(data.message);
      addToast(data.message, toastType.ERROR)
      return;
    }

    let pageCid = data.cid;

    let linkText = `<copy uri="doenet:doenetId=${doenetId}&pageId=${pageId}&cid=${pageCid}" />`;

    copyToClipboard(linkText);

    addToast('Link copied to clipboard!', toastType.SUCCESS)
  }


  return <ActionButton
    width="menu"
    data-test="Copy Page Link"
    value="Copy Page Link"
    onClick={savePageDoenetMLAndCopyLink}
  />

}