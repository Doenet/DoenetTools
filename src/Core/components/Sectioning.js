import SectioningComponent from './abstract/SectioningComponent';

export class Section extends SectioningComponent {
  static componentType = "section";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.level.definition = () => ({
      setValue: { level: 1 }
    });

    return stateVariableDefinitions;
  }
}

export class Subsection extends SectioningComponent {
  static componentType = "subsection";
  static rendererType = "section";


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.level.definition = () => ({
      setValue: { level: 2 }
    });

    return stateVariableDefinitions;
  }

}

export class Subsubsection extends SectioningComponent {
  static componentType = "subsubsection";
  static rendererType = "section";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.level.definition = () => ({
      setValue: { level: 3 }
    });

    return stateVariableDefinitions;
  }

}

export class Paragraphs extends SectioningComponent {
  static componentType = "paragraphs";
  static rendererType = "section";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.level.definition = () => ({
      setValue: { level: 4 }
    });

    return stateVariableDefinitions;
  }

}

export class Aside extends SectioningComponent {
  static componentType = "aside";
  static rendererType = "section";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

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

    return stateVariableDefinitions;
  }

}

export class Problem extends SectioningComponent {
  static componentType = "problem";
  static rendererType = "section";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.aggregateScores.defaultValue = true;
    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.sectionName.definition = () => ({
      setValue: { sectionName: "Problem" }
    });

    stateVariableDefinitions.level.definition = () => ({
      setValue: { level: 3 }
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

    stateVariableDefinitions.level.definition = () => ({
      setValue: { level: 3 }
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