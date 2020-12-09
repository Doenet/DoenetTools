import React, { createContext } from 'react';

const SelectedElementContext = createContext({});

export const SelectedElementStore = ({children}) => {
  const [selectedElement, setSelectedElement] = useState({}); //TODO: call to database for previous selection

  const value = { //TODO: define data structure
    selectedElement: selectedElement,
    setSelectedElement: setSelectedElement,
  };

  return (
    <SelectedElementContext.Provider value={value}>
      {children}
    </SelectedElementContext.Provider>
  )
}

export default SelectedElementContext;