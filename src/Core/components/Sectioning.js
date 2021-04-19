import SectioningComponent from './abstract/SectioningComponent';

export class Section extends SectioningComponent {
  static componentType = "section";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.level.definition = () => ({
      newValues: { level: 1 }
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
      newValues: { level: 2 }
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
      newValues: { level: 3 }
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
      newValues: { level: 4 }
    });

    return stateVariableDefinitions;
  }

}

export class Aside extends SectioningComponent {
  static componentType = "aside";
  static rendererType = "section";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.collapsible.definition = () => ({
      newValues: { collapsible: true }
    });

    stateVariableDefinitions.open.defaultValue = false;

    stateVariableDefinitions.level.definition = () => ({
      newValues: { level: 3 }
    });

    stateVariableDefinitions.containerTag.definition = () => ({
      newValues: { containerTag: "aside" }
    });

    return stateVariableDefinitions;
  }

}

export class Problem extends SectioningComponent {
  static componentType = "problem";
  static rendererType = "section";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.aggregateScores = { default: true };

    return properties;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.sectionName.definition = () => ({
      newValues: { sectionName: "Problem" }
    });

    stateVariableDefinitions.level.definition = () => ({
      newValues: { level: 3 }
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
      newValues: { sectionName: "Exercise" }
    });

    return stateVariableDefinitions;
  }


}


export class Example extends SectioningComponent {
  static componentType = "Example";
  static rendererType = "section";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.sectionName.definition = () => ({
      newValues: { sectionName: "Example" }
    });

    stateVariableDefinitions.level.definition = () => ({
      newValues: { level: 3 }
    });

    return stateVariableDefinitions;
  }


}


export class AnswerSet extends SectioningComponent {
  static componentType = "answerSet";
  static rendererType = "section";


  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.aggregateScores = { default: true };
    properties.sectionWideCheckWork = { default: true, forRenderer: true, ignorePropagationFromAncestors: true };

    return properties;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.level.definition = () => ({
      newValues: { level: null }
    });

    stateVariableDefinitions.containerTag.definition = () => ({
      newValues: { containerTag: "none" }
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
      newValues: { level: 3 }
    });

    stateVariableDefinitions.containerTag.definition = () => ({
      newValues: { containerTag: "aside" }
    });

    return stateVariableDefinitions
  }

}