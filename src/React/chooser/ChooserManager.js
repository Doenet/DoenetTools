import React, { useContext } from 'react';
import { ChooserContext, ChooserProvider } from './ChooserContext'
import DoenetChooser from '../DoenetChooser'

const TempWrapper = () => {
  const {data, methods, flags} = useContext(ChooserContext);
  return (
    <DoenetChooser data={data} methods={methods} flags={flags}/>
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