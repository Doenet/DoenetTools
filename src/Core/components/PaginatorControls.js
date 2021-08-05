import BlockComponent from './abstract/BlockComponent';

export default class PaginatorControls extends BlockComponent {
  static componentType = "paginatorControls";
  static renderChildren = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.previousLabel = {
      createComponentOfType: "text",
      createStateVariable: "previousLabel",
      defaultValue: "Previous",
      forRenderer: true,
      public: true,
    }
    attributes.nextLabel = {
      createComponentOfType: "text",
      createStateVariable: "nextLabel",
      defaultValue: "Next",
      forRenderer: true,
      public: true,
    }
    attributes.pageLabel = {
      createComponentOfType: "text",
      createStateVariable: "pageLabel",
      defaultValue: "Page",
      forRenderer: true,
      public: true,
    }
    attributes.paginatorTname = {
      createPrimitiveOfType: "string"
    }

    return attributes;

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.paginatorTname = {
      returnDependencies: () => ({
        paginatorTname: {
          dependencyType: "attributePrimitive",
          attributeName: "paginatorTname"
        },
      }),
      definition({ dependencyValues }) {
        return { newValues: { paginatorTname: dependencyValues.paginatorTname } }
      }
    }


    stateVariableDefinitions.paginatorFullTname = {
      stateVariablesDeterminingDependencies: ["paginatorTname"],
      returnDependencies({ stateValues }) {
        if (stateValues.paginatorTname) {
          return {
            paginatorFullTname: {
              dependencyType: "expandTargetName",
              tName: stateValues.paginatorTname
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        return { newValues: { paginatorFullTname: dependencyValues.paginatorFullTname } }
      }
    }

    stateVariableDefinitions.currentPage = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["paginatorFullTname"],
      returnDependencies({ stateValues }) {
        if (!stateValues.paginatorFullTname) {
          return {}
        } else {
          return {
            paginatorPage: {
              dependencyType: "stateVariable",
              componentName: stateValues.paginatorFullTname,
              variableName: "currentPage"
            }
          }
        }
      },
      definition({ dependencyValues }) {
        if ("paginatorPage" in dependencyValues) {
          return {
            newValues: { currentPage: dependencyValues.paginatorPage }
          }
        } else {
          return { newValues: { currentPage: 1 } }
        }
      }
    }

    stateVariableDefinitions.nPages = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["paginatorFullTname"],
      returnDependencies({ stateValues }) {
        if (!stateValues.paginatorFullTname) {
          return {}
        } else {
          return {
            paginatorNPages: {
              dependencyType: "stateVariable",
              componentName: stateValues.paginatorFullTname,
              variableName: "nPages"
            }
          }
        }
      },
      definition({ dependencyValues }) {
        if ("paginatorNPages" in dependencyValues) {
          return {
            newValues: { nPages: dependencyValues.paginatorNPages }
          }
        } else {
          return { newValues: { nPages: 1 } }
        }
      }
    }

    return stateVariableDefinitions;

  }


  setPage({ number }) {

    if (this.stateValues.paginatorFullTname) {
      this.coreFunctions.requestAction({
        componentName: this.stateValues.paginatorFullTname,
        actionName: "setPage",
        args: { number }
      })
    }

  }

  actions = {
    setPage: this.setPage.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
  };


}
