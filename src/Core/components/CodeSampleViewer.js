import { SectioningComponent } from "./abstract/SectioningComponent";

export default class CodeSampleViewer extends SectioningComponent {
  static componentType = "codeSampleViewer";

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addCodeViewerEditor = function ({ matchedChildren }) {
      let codeViewer = {
        componentType: "codeViewer",
        children: [{ componentType: "renderDoenetML" }],
      };
      let codeEditor = {
        componentType: "codeEditor",
      };

      let newChildren = [codeViewer, codeEditor, ...matchedChildren];

      return {
        success: true,
        newChildren,
      };
    };
    sugarInstructions.push({
      replacementFunction: addCodeViewerEditor,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "codeViewers",
        componentTypes: ["codeViewer"],
      },
      {
        group: "codeEditors",
        componentTypes: ["codeEditor"],
      },
      {
        group: "codes",
        componentTypes: ["code"],
      },
      {
        group: "variantControls",
        componentTypes: ["variantControl"],
      },
      {
        group: "titles",
        componentTypes: ["title"],
      },
      {
        group: "setups",
        componentTypes: ["setup"],
      },
      {
        group: "anything",
        componentTypes: ["_base"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.viewerHeight;

    stateVariableDefinitions.prefillForEditor = {
      returnDependencies: () => ({
        codeChildren: {
          dependencyType: "child",
          childGroups: ["codes"],
          variableNames: ["text"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            prefillForEditor:
              dependencyValues.codeChildren[0]?.stateValues.text || null,
          },
        };
      },
    };

    stateVariableDefinitions.codeSourceForViewer = {
      returnDependencies: () => ({
        codeEditorChildren: {
          dependencyType: "child",
          childGroups: ["codeEditors"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            codeSourceForViewer:
              dependencyValues.codeEditorChildren[0]?.componentName || null,
          },
        };
      },
    };

    stateVariableDefinitions.childIndicesToRender = {
      returnDependencies: () => ({
        allChildren: {
          dependencyType: "child",
          childGroups: [
            "codeViewers",
            "codeEditors",
            "codes",
            "titles",
            "variantControls",
            "setups",
            "anything",
          ],
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let childIndicesToRender = [];

        for (let [ind, child] of dependencyValues.allChildren.entries()) {
          if (
            !componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "code",
            })
          ) {
            childIndicesToRender.push(ind);
          }
        }
        return {
          setValue: {
            childIndicesToRender,
          },
        };
      },
    };

    stateVariableDefinitions.titleChildInd = {
      forRenderer: true,
      returnDependencies: () => ({
        allChildren: {
          dependencyType: "child",
          childGroups: [
            "codeViewers",
            "codeEditors",
            "codes",
            "titles",
            "variantControls",
            "setups",
            "anything",
          ],
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let titleChildInd = null;
        let ind = 0;

        for (let child of dependencyValues.allChildren) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "title",
            })
          ) {
            titleChildInd = ind;
            break;
          } else if (
            !componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "code",
            })
          ) {
            ind++;
          }
        }
        return {
          setValue: {
            titleChildInd,
          },
        };
      },
    };

    return stateVariableDefinitions;
  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
    this.coreFunctions.resolveAction({ actionId });
  }
}
