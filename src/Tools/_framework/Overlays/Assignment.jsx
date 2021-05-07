/**
 * External dependencies
 */
import React from 'react';
import { atom, useRecoilValue, useRecoilValueLoadable } from 'recoil';

/**
 * Internal dependencies
 */
import Tool from '../Tool';
import DoenetViewer from '../../../Viewer/DoenetViewer';
import { assignmentDictionary } from '../../course/Course';

export const assignmentDoenetMLAtom = atom({
  key: 'assignmentDoenetMLAtom',
  default: { updateNumber: 0, doenetML: '', attemptnumber: 0 },
});

export default function Assignment({
  branchId = '',
  assignmentId = '',
  contentId = '',
  title,
}) {
  const assignmentInfo = useRecoilValueLoadable(assignmentDictionary());
  let aInfo = '';

  if (assignmentInfo?.state === 'hasValue') {
    aInfo = assignmentInfo?.contents;
    if (aInfo?.assignmentId) {
      assignmentId = aInfo?.assignmentId;
    }
  }
  function DoenetViewerPanel(props) {
    const assignmentDoenetML = useRecoilValue(assignmentDoenetMLAtom);
    let attemptNumber = 1;
    let requestedVariant = { index: attemptNumber };
    let solutionDisplayMode = 'button';

    return (
      <DoenetViewer
        key={'doenetviewer' + assignmentDoenetML?.updateNumber}
        doenetML={assignmentDoenetML?.doenetML}
        flags={{
          showCorrectness: true,
          readOnly: false,
          solutionDisplayMode: solutionDisplayMode,
          showFeedback: true,
          showHints: true,
        }}
        attemptNumber={attemptNumber}
        contentId={contentId ? contentId : branchId}
        assignmentId={assignmentId ? assignmentId : contentId}
        ignoreDatabase={true}
        requestedVariant={requestedVariant}
      />
    );
  }

  return (
    <Tool>
      <headerPanel title={title} />

      <mainPanel>
        <div style={{ overflowY: 'scroll', height: 'calc(100vh - 84px)' }}>
          <DoenetViewerPanel />
        </div>
      </mainPanel>

      <supportPanel></supportPanel>
    </Tool>
  );
}
