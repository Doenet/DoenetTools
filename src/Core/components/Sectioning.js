import { SectioningComponent, SectioningComponentNumberWithSiblings, UnnumberedSectioningComponent } from './abstract/SectioningComponent';

export class Section extends SectioningComponentNumberWithSiblings {
  static componentType = "section";
  static rendererType = "section";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.includeParentNumber.defaultValue = true;
    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    return stateVariableDefinitions;
  }


}

export class Subsection extends Section {
  static componentType = "subsection";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.sectionName.definition = () => ({
      setValue: { sectionName: "Section" }
    });

    return stateVariableDefinitions;
  }

}
export class Subsubsection extends Section {
  static componentType = "subsubsection";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.sectionName.definition = () => ({
      setValue: { sectionName: "Section" }
    });

    return stateVariableDefinitions;
  }
}

export class Paragraphs extends SectioningComponentNumberWithSiblings {
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

export class Objectives extends SectioningComponent {
  static componentType = "objectives";
  static rendererType = "section";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.boxed.defaultValue = true;

    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.level.definition = () => ({
      setValue: { level: 3 }
    });

    stateVariableDefinitions.containerTag.definition = () => ({
      setValue: { containerTag: "article" }
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

    stateVariableDefinitions.containerTag.definition = () => ({
      setValue: { containerTag: "article" }
    });

    return stateVariableDefinitions;
  }

}

export class Exercise extends Problem {
  static componentType = "exercise";
}

export class Activity extends Problem {
  static componentType = "activity";
}

export class Example extends SectioningComponent {
  static componentType = "example";
  static rendererType = "section";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.containerTag.definition = () => ({
      setValue: { containerTag: "article" }
    });

    return stateVariableDefinitions;
  }

}

export class Definition extends Example {
  static componentType = "definition";
}

export class Note extends Example {
  static componentType = "note";
}

export class Theorem extends Example {
  static componentType = "theorem";
}

export class Proof extends UnnumberedSectioningComponent {
  static componentType = "proof";
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
      setValue: { containerTag: "article" }
    });

    return stateVariableDefinitions;
  }

}


export class Problems extends SectioningComponent {
  static componentType = "problems";
  static rendererType = "section";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.asList.defaultValue = true;
    return attributes;
  }

}


export class Exercises extends Problems {
  static componentType = "exercises";
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


export class externalContent extends SectioningComponent {
  static componentType = "externalContent";
  static rendererType = "section";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.includeAutoNameIfNoTitle.defaultValue = false;
    attributes.includeAutoNumberIfNoTitle.defaultValue = false;
    return attributes;
  }

}