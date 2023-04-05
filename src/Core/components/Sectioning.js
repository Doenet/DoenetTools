import { SectioningComponent, SectioningComponentNumberWithSiblings } from './abstract/SectioningComponent';

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

export class Biographical extends Aside {
  static componentType = "biographical";
}

export class Historical extends Aside {
  static componentType = "historical";
}

export class Assemblage extends SectioningComponent {
  static componentType = "assemblage";
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

export class Objectives extends Assemblage {
  static componentType = "objectives";
}

export class Outcomes extends Objectives {
  static componentType = "outcomes";
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

export class Question extends Problem {
  static componentType = "question";
}

export class Activity extends Problem {
  static componentType = "activity";
}

export class Exploration extends Activity {
  static componentType = "exploration";
}

export class Project extends Activity {
  static componentType = "project";
}

export class Investigation extends Activity {
  static componentType = "investigation";
}

export class Exercises extends Section {
  static componentType = "exercises";
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

export class Remark extends Note {
  static componentType = "remark";
}

export class Convention extends Note {
  static componentType = "convention";
}

export class Observation extends Note {
  static componentType = "observation";
}

export class Warning extends Note {
  static componentType = "warning";
}

export class Insight extends Note {
  static componentType = "insight";
}

export class Theorem extends Example {
  static componentType = "theorem";
}

export class Corollary extends Theorem {
  static componentType = "corollary";
}

export class Lemma extends Theorem {
  static componentType = "lemma";
}

export class Algorithm extends Theorem {
  static componentType = "algorithm";
}

export class Proposition extends Theorem {
  static componentType = "proposition";
}

export class Claim extends Theorem {
  static componentType = "claim";
}

export class Fact extends Theorem {
  static componentType = "fact";
}

export class Identity extends Theorem {
  static componentType = "identity";
}


export class Axiom extends Example {
  static componentType = "axiom";
}

export class Conjecture extends Axiom {
  static componentType = "conjecture";
}

export class Principle extends Axiom {
  static componentType = "principle";
}

export class Heuristic extends Axiom {
  static componentType = "heuristic";
}

export class Hypothesis extends Axiom {
  static componentType = "hypothesis";
}

export class Assumption extends Axiom {
  static componentType = "assumption";
}

export class Proof extends Aside {
  static componentType = "proof";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.includeAutoNumberIfNoTitle.defaultValue = false;
    attributes.doNotNumber.defaultValue = true;
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