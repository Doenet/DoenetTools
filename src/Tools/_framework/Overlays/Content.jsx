/**
 * External dependencies
 */
import React from 'react';
import { atom, useRecoilValue } from 'recoil';

/**
 * Internal dependencies
 */
import Tool from '../Tool';
import DoenetViewer from '../../../Viewer/DoenetViewer';

const viewerContentDoenetMLAtom = atom({
  key: 'viewerContentDoenetMLAtom',
  default: { updateNumber: 0, doenetML: '' },
});

export default function Content({ branchId = '', contentId = '', title }) {
  function DoenetViewerPanel() {
    const viewerDoenetML = useRecoilValue(viewerContentDoenetMLAtom);

    let attemptNumber = 1;
    let requestedVariant = { index: attemptNumber };
    let assignmentId = 'myassignmentid';
    let solutionDisplayMode = 'button';

    return (
      <DoenetViewer
        key={'doenetviewer' + viewerDoenetML?.updateNumber}
        doenetML={viewerDoenetML?.doenetML}
        contentId={contentId ? contentId : branchId}
        flags={{
          showCorrectness: true,
          readOnly: false,
          solutionDisplayMode: solutionDisplayMode,
          showFeedback: true,
          showHints: true,
        }}
        attemptNumber={attemptNumber}
        assignmentId={assignmentId}
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
    </Tool>
  );
}
