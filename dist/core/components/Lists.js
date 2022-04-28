import BlockComponent from './abstract/BlockComponent.js';
import BaseComponent from './abstract/BaseComponent.js';

export class Ol extends BlockComponent {
  static componentType = "ol";
  static rendererType = "list";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.label = {
      createComponentOfType: "text",
      createStateVariable: "label",
      defaultValue: null,
      public: true,
      forRenderer: true
    };
    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "lis",
      componentTypes: ["li"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numbered = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { numbered: true } })
    }

    return stateVariableDefinitions;

  }

}


export class Ul extends Ol {
  static componentType = "ul";
  static rendererType = "list";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numbered = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { numbered: false } })
    }

    return stateVariableDefinitions;

  }

}


export class Li extends BaseComponent {
  static componentType = "li";
  static rendererType = "list";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static returnChildGroups() {

    return [{
      group: "inlinesBlocks",
      componentTypes: ["_inline", "_block"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.item = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { item: true } })
    }

    return stateVariableDefinitions;

  }

}