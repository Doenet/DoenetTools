import React, { createContext, useState, useContext } from 'react';
import './style.css';

const SwitchableContainerContext = createContext();

function SwitchableContainers(props) {
  const {
    initialValue,
    values = [],
    className = '',
    children,
    ...restProps
  } = props;

  const [activeContainer, changeContainer] = useState(initialValue);

  const nextContainer = () => {
    const nextActiveContainer = values[(values.indexOf(activeContainer) + 1) % values.length];
    changeContainer(nextActiveContainer);
  }

  const containerProviderValue = { activeContainer, nextContainer };

  const classNames = `switchable-containers ${className}`;

  return (
    <SwitchableContainerContext.Provider value={containerProviderValue}>
      <div className={classNames} {...restProps}>
        {children}
      </div>
    </SwitchableContainerContext.Provider>
  );
}

function SwitchableContainerList(props) {
  const { className = '', children, ...restProps } = props;

  const classNames = `switchable-container-list ${className}`;

  return (
    <div className={classNames} {...restProps}>
      {children}
    </div>
  );
}

function SwitchableContainer(props) {
  const {
    name,
    className = '',
    onClick = () => {},
    children,
    ...restProps
  } = props;

  const containerContext = useContext(SwitchableContainerContext);

  const classNames = `
  switchable-container
    ${containerContext.activeContainer === name ? 'active' : ''}
    ${className}
  `;

  const handleClick = event => {
    containerContext.nextContainer();
    onClick(event);
  };

  return (
    <span className={classNames} onClick={handleClick} {...restProps}>
      {children}
    </span>
  );
}

function SwitchableContainerPanel(props) {
  const { name, className = '', children, ...restProps } = props;

  const containerContext = useContext(SwitchableContainerContext);

  const classNames = `switchable-container-panel ${className}`;

  return (
    containerContext.activeContainer === name && (
      <div className={classNames} {...restProps}>
        {children}
      </div>
    )
  );
}

function SwitchableContainerDivider() {
  return <div className="switchable-container-divider" />;
}

SwitchableContainers.List = SwitchableContainerList;
SwitchableContainers.SwitchableContainer = SwitchableContainer;
SwitchableContainers.Panel = SwitchableContainerPanel;
SwitchableContainers.Divider = SwitchableContainerDivider;

export { SwitchableContainers, SwitchableContainerList, SwitchableContainer, SwitchableContainerPanel, SwitchableContainerDivider };
