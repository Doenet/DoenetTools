import MathComponent from '../Math';

export default class ElectronConfiguration extends MathComponent {
  static componentType = "electronConfiguration";
  static rendererType = "math";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.latex = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        valueForDisplay: {
          dependencyType: "stateVariable",
          variableName: "valueForDisplay"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        let latex;
        try {
          latex = dependencyValues.valueForDisplay.toLatex();
        } catch (e) {
          latex = '\uff3f';
        }
        latex = latex.replaceAll('\\,', '')
        latex = latex.replaceAll('\\cdot', '~')
        return { setValue: { latex } };
      }
    }

    return stateVariableDefinitions;

  }
}