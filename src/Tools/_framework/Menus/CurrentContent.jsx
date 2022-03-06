import React from 'react';
// import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { showCompletedAtom, showOverdueAtom } from '../Widgets/Next7Days';
import Checkbox from '../../../_reactComponents/PanelHeaderComponents/Checkbox';
import { useRecoilState } from 'recoil';

export default function CurrentContent() {
  const [overdue, setOverdue] = useRecoilState(showOverdueAtom);
  const [completed, setCompleted] = useRecoilState(showCompletedAtom);

  return (
    <div>
      <div>
        <Checkbox
          style={{ marginRight: '2px' }}
          checked={completed}
          onClick={(e) => {
            setCompleted(!completed);
          }}
        />
        Show Completed{' '}
      </div>
      <div>
        <Checkbox
          style={{ marginRight: '2px' }}
          checked={overdue}
          onClick={(e) => {
            setOverdue(!overdue);
          }}
        />
        Show Overdue{' '}
      </div>
    </div>
  );
}
