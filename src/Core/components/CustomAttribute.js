import CompositeComponent from "./abstract/CompositeComponent";
import * as serializeFunctions from "../utils/serializedStateProcessing";

export default class CustomAttribute extends CompositeComponent {
  static componentType = "customAttribute";

  static assignNamesToReplacements = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.componentType = {
      createPrimitiveOfType: "string",
    };
    attributes.attribute = {
      createPrimitiveOfType: "string",
    };
    attributes.defaultValue = {
      leaveRaw: true,
    };
    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.componentNameForAttributes = {
      returnDependencies: () => ({
        parentVariableContainingName: {
          dependencyType: "parentStateVariable",
          variableName: "componentNameForAttributes",
        },
      }),
      definition({ dependencyValues }) {
        let componentNameForAttributes =
          dependencyValues.parentVariableContainingName;
        return { setValue: { componentNameForAttributes } };
      },
    };

    stateVariableDefinitions.attributeName = {
      returnDependencies: () => ({
        attribute: {
          dependencyType: "attributePrimitive",
          attributeName: "attribute",
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { attributeName: dependencyValues.attribute } };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      stateVariablesDeterminingDependencies: ["componentNameForAttributes"],
      returnDependencies: ({ stateValues }) => ({
        componentIdentity: {
          dependencyType: "componentIdentity",
          componentName: stateValues.componentNameForAttributes,
        },
      }),
      definition() {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    components,
    workspace,
    componentInfoObjects,
    flags,
  }) {
    let errors = [];
    let warnings = [];

    let newNamespace = component.attributes.newNamespace?.primitive;

    let componentType =
      componentInfoObjects.componentTypeLowerCaseMapping[
        component.attributes.componentType.primitive.toLowerCase()
      ];
    let componentClass =
      componentInfoObjects.allComponentClasses[componentType];

    if (!componentClass) {
      warnings.push({
        message: `Could not find component type ${componentType}`,
      });
      return { replacements: [], errors, warnings };
    }

    let componentForAttribute =
      components[await component.stateValues.componentNameForAttributes];
    let attributeLowerCaseMapping = {};

    for (let attrName in componentForAttribute.attributes) {
      attributeLowerCaseMapping[attrName.toLowerCase()] = attrName;
    }

    let SVattributeName = await component.stateValues.attributeName;
    let attributeName =
      attributeLowerCaseMapping[SVattributeName.toLowerCase()];

    let attributeValue = componentForAttribute.attributes[attributeName];

    if (attributeValue === undefined) {
      if (component.attributes.defaultValue === undefined) {
        warnings.push({
          message:
            "Cannot create component from attribute if neither attribute nor default value specified",
        });
        return { replacements: [], errors, warnings };
      } else {
        attributeValue = component.attributes.defaultValue;
      }
    }

    // check if have attribute name is already defined for componentForAttribute's class
    // in which case setting via custom attributes won't work
    let containerClass = componentForAttribute.constructor;
    let containerAttrNames = Object.keys(
      containerClass.createAttributesObject(),
    ).map((x) => x.toLowerCase());
    containerAttrNames.push("name", "target", "assignnames");
    if (containerAttrNames.includes(SVattributeName.toLowerCase())) {
      warnings.push({
        message: `Cannot add attribute ${SVattributeName} of a ${containerClass.componentType} as it already exists in ${containerClass.componentType} class`,
      });
      return { replacements: [], errors, warnings };
    }

    let attrObj = {
      createComponentOfType: componentType,
    };

    let res = serializeFunctions.componentFromAttribute({
      attrObj,
      value: attributeValue,
      componentInfoObjects,
    });

    let serializedComponent = res.attribute.component;
    errors.push(...res.errors);
    warnings.push(...res.warnings);

    if (serializedComponent.children) {
      serializeFunctions.applyMacros(
        serializedComponent.children,
        componentInfoObjects,
      );
      if (newNamespace) {
        // modify targets to go back one namespace
        for (let child of serializedComponent.children) {
          if (child.componentType === "copy") {
            let target = child.doenetAttributes.target;
            if (/[a-zA-Z_]/.test(target[0])) {
              child.doenetAttributes.target = "../" + target;
            }
          }
        }
      }
    }

    serializeFunctions.applySugar({
      serializedComponents: [serializedComponent],
      isAttributeComponent: true,
      componentInfoObjects,
    });

    serializeFunctions.setTNamesToAbsolute([serializedComponent]);

    let processResult = serializeFunctions.processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: [serializedComponent],
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
      doenetMLrange: component.doenetMLrange,
    });
    errors.push(...processResult.errors);
    warnings.push(...processResult.warnings);

    return {
      replacements: processResult.serializedComponents,
      errors,
      warnings,
    };
  }
}
