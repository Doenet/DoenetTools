import { allComponentClasses } from "../ComponentTypes";
import createComponentInfoObjects from "./componentInfoObjects";

export function getSchema() {
  let componentClasses = allComponentClasses();

  let componentInfoObjects = createComponentInfoObjects();

  for (let type in componentClasses) {
    let cClass = componentClasses[type];
    if (cClass.excludeFromSchema) {
      delete componentClasses[type];
    }
  }

  let inheritedTypes = {};

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
      }
    }
    inheritedTypes[type1] = inherited;
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
          if (type2 in inheritedTypes) {
            children.push(...inheritedTypes[type2]);
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
