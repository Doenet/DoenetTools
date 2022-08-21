import SectioningComponent from './abstract/SectioningComponent';

export class Section extends SectioningComponent {
  static componentType = "section";
  static rendererType = "section";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.includeParentNumber.defaultValue = true;
    return attributes;
  }

}

export class Subsection extends Section {
  static componentType = "subsection";
}
export class Subsubsection extends Section {
  static componentType = "subsubsection";
}

export class Paragraphs extends SectioningComponent {
  static componentType = "paragraphs";
  static rendererType = "section";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.suppressAutoNumber.defaultValue = true;
    attributes.suppressAutoName.defaultValue = true;
    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.level.definition = () => ({
      setValue: { level: 4 }
    });

    stateVariableDefinitions.sectionName.definition = () => ({
      setValue: { sectionName: "Paragraphs" }
    });
    
    return stateVariableDefinitions;
  }

}

export class Aside extends SectioningComponent {
  static componentType = "aside";
  static rendererType = "section";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.collapsible = {
      createComponentOfType: "boolean",
      createStateVariable: "collapsible",
      defaultValue: true,
      public: true,
      forRenderer: true,
    }
    attributes.startOpen = {
      createComponentOfType: "boolean",
      createStateVariable: "startOpen",
      defaultValue: false,
    }
    attributes.suppressAutoNumber.defaultValue = true;

    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.collapsible;

    stateVariableDefinitions.open.returnDependencies = () => ({
      startOpen: {
        dependencyType: "stateVariable",
        variableName: "startOpen"
      }
    })

    stateVariableDefinitions.open.definition = ({ dependencyValues }) => ({
      useEssentialOrDefaultValue: {
        open: {
          defaultValue: dependencyValues.startOpen,
        }
      }
    })

    stateVariableDefinitions.level.definition = () => ({
      setValue: { level: 3 }
    });

    stateVariableDefinitions.containerTag.definition = () => ({
      setValue: { containerTag: "aside" }
    });

    stateVariableDefinitions.sectionName.definition = () => ({
      setValue: { sectionName: "Aside" }
    });

    return stateVariableDefinitions;
  }

}

export class Problem extends SectioningComponent {
  static componentType = "problem";
  static rendererType = "section";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.aggregateScores.defaultValue = true;
    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.sectionName.definition = () => ({
      setValue: { sectionName: "Problem" }
    });

    return stateVariableDefinitions;
  }

}

export class Exercise extends Problem {
  static componentType = "exercise";
  static rendererType = "section";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.sectionName.definition = () => ({
      setValue: { sectionName: "Exercise" }
    });

    return stateVariableDefinitions;
  }


}


export class Example extends SectioningComponent {
  static componentType = "example";
  static rendererType = "section";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.sectionName.definition = () => ({
      setValue: { sectionName: "Example" }
    });

    return stateVariableDefinitions;
  }


}


export class StandinForFutureLayoutTag extends SectioningComponent {
  static componentType = "standinForFutureLayoutTag";
  static rendererType = "section";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.level.definition = () => ({
      setValue: { level: 3 }
    });

    stateVariableDefinitions.containerTag.definition = () => ({
      setValue: { containerTag: "aside" }
    });

    return stateVariableDefinitions
  }

}