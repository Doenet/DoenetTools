import React, { useContext } from 'react';
import { ChooserContext, ChooserProvider } from './ChooserContext'
import DoenetChooser from '../DoenetChooser'

const TempWrapper = () => {
  const {data, appState, methods, flags} = useContext(ChooserContext);
  return (
    <DoenetChooser data={data} appState={appState} methods={methods} flags={flags}/>
  );
};

const ChooserManager = () => {
  return (
    <ChooserProvider>
      <TempWrapper />
    </ChooserProvider>
      
  );
};




export default ChooserManager;