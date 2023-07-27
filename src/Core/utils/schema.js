import { allComponentClasses } from "../ComponentTypes";
import createComponentInfoObjects from "./componentInfoObjects";

// Create schema of DoenetML by extracting component, attributes and children
// from component classes.
// The results are currently just stringified and printed out,
// and then manually copied into src/Core/doenetSchema.json.
// CodeMirrror.jsx reads in the json file to form its autocompletion scheme.

export function getSchema() {
  let componentClasses = allComponentClasses();

  let componentInfoObjects = createComponentInfoObjects();

  for (let type in componentClasses) {
    let cClass = componentClasses[type];
    if (cClass.excludeFromSchema) {
      delete componentClasses[type];
    }
  }

  let inheritedOrAdaptedTypes = {};

  for (let type1 in componentClasses) {
    let inherited = [];
    for (let type2 in componentClasses) {
      if (type2[0] == "_") {
        continue;
      }
      if (
        componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: type2,
          baseComponentType: type1,
        })
      ) {
        inherited.push(type2);
      } else {
        let cClass = componentClasses[type2];
        let numAdapters = cClass.numAdapters;

        for (let n = 0; n < numAdapters; n++) {
          let adapterComponentType = cClass.getAdapterComponentType(
            n,
            componentInfoObjects.publicStateVariableInfo,
          );

          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: adapterComponentType,
              baseComponentType: type1,
            })
          ) {
            if (!inherited.includes(adapterComponentType)) {
              inherited.push(adapterComponentType);
            }
          }
        }
      }
    }
    inheritedOrAdaptedTypes[type1] = inherited;
  }

  for (let type in componentClasses) {
    if (type[0] === "_") {
      delete componentClasses[type];
    }
  }

  let elements = [];

  for (let type in componentClasses) {
    let children = [];
    let attributes = [{ name: "name" }, { name: "copySource" }];

    let cClass = componentClasses[type];

    if (cClass.acceptTarget) {
      if (type === "copy" || type === "collect") {
        attributes.push({ name: "source" });
      } else {
        attributes.push({ name: "target" });
      }
    }

    let attrObj = cClass.createAttributesObject();

    for (let attrName in attrObj) {
      let attrDef = attrObj[attrName];

      if (!attrDef.excludeFromSchema) {
        let attrSpec = { name: attrName };

        if (attrDef.validValues) {
          attrSpec.values = attrDef.validValues;
        } else if (
          attrDef.createPrimitiveOfType === "boolean" ||
          attrDef.createComponentOfType === "boolean"
        ) {
          attrSpec.values = ["true", "false"];
        }

        attributes.push(attrSpec);
      }
    }

    let childGroups = cClass.returnChildGroups();

    for (let groupObj of childGroups) {
      if (!groupObj.excludeFromSchema) {
        for (let type2 of groupObj.componentTypes) {
          if (type2 in inheritedOrAdaptedTypes) {
            children.push(...inheritedOrAdaptedTypes[type2]);
          }
        }
      }
    }

    children = [...new Set(children)];

    elements.push({
      name: type,
      children,
      attributes,
    });
  }

  console.log(JSON.stringify({ elements }));
}
