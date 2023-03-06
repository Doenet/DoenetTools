import BlockComponent from './abstract/BlockComponent';
import BaseComponent from './abstract/BaseComponent';

export class Ol extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });

  }
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

    attributes.level = {
      createComponentOfType: "integer",
    }

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

    stateVariableDefinitions.level = {
      forRenderer: true,
      returnDependencies: () => ({
        ancestorLevel: {
          dependencyType: "ancestor",
          componentType: "ol",
          variableNames: ["level"]
        },
        levelAttr: {
          dependencyType: "attributeComponent",
          attributeName: "level",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {
        let level = dependencyValues.levelAttr?.stateValues.value;

        if (!(level > 0)) {
          level = (dependencyValues.ancestorLevel?.stateValues.level || 0) + 1;
        }

        return { setValue: { level } }
      }
    }

    return stateVariableDefinitions;

  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
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
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });

  }
  static componentType = "li";
  static rendererType = "list";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static returnChildGroups() {

    return [{
      group: "anything",
      componentTypes: ["_base"]
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

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }

}