import InlineComponent from './InlineComponent';

export default class InlineRenderInlineChildren extends InlineComponent {
  static componentType = "_inlinerenderinlinechildren";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "AtLeastZeroInline",
      componentType: "_inline",
      comparison: "atLeast",
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "childIdentity",
          childLogicName: "AtLeastZeroInline",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            childrenToRender: dependencyValues.inlineChildren.map(x => x.componentName)
          }
        };
      }
    }

    return stateVariableDefinitions;

  }

  static includeBlankStringChildren = true;


}