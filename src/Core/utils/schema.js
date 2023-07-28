import createComponentInfoObjects from "./componentInfoObjects";

// Create schema of DoenetML by extracting component, attributes and children
// from component classes.
// The results are currently just stringified and printed out,
// and then manually copied into src/Core/doenetSchema.json.
// CodeMirrror.jsx reads in the json file to form its autocompletion scheme.

export function getSchema() {
  let componentInfoObjects = createComponentInfoObjects();
  let componentClasses = componentInfoObjects.allComponentClasses;

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
        checkIfInheritOrAdapt({
          startingType: type2,
          destinationType: type1,
          componentInfoObjects,
        })
      ) {
        inherited.push(type2);
        continue;
      }

      let cClass = componentClasses[type2];

      if (
        componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: type2,
          baseComponentType: "_composite",
        }) &&
        cClass.allowInSchemaAsComponent
      ) {
        for (let alt_type of cClass.allowInSchemaAsComponent) {
          if (
            checkIfInheritOrAdapt({
              startingType: alt_type,
              destinationType: type1,
              componentInfoObjects,
            })
          ) {
            inherited.push(type2);
            break;
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

    if (
      componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: type,
        baseComponentType: "_composite",
      })
    ) {
      attributes.push({ name: "assignNames" });
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

    if (cClass.additionalSchemaChildren) {
      for (let type2 of cClass.additionalSchemaChildren) {
        if (type2 in inheritedOrAdaptedTypes) {
          children.push(...inheritedOrAdaptedTypes[type2]);
        }
      }
    }

    children = [...new Set(children)];

    elements.push({
      name: type,
      children,
      attributes,
      top: !cClass.inSchemaOnlyInheritAs,
    });
  }

  console.log(JSON.stringify({ elements }));
}

function checkIfInheritOrAdapt({
  startingType,
  destinationType,
  componentInfoObjects,
}) {
  let startingClass = componentInfoObjects.allComponentClasses[startingType];

  if (startingClass.inSchemaOnlyInheritAs) {
    if (
      startingType === destinationType ||
      startingClass.inSchemaOnlyInheritAs.includes(destinationType)
    ) {
      return true;
    }
  } else if (
    componentInfoObjects.isInheritedComponentType({
      inheritedComponentType: startingType,
      baseComponentType: destinationType,
    })
  ) {
    return true;
  }

  let numAdapters = startingClass.numAdapters;

  for (let n = 0; n < numAdapters; n++) {
    let adapterComponentType = startingClass.getAdapterComponentType(
      n,
      componentInfoObjects.publicStateVariableInfo,
    );

    let adapterClass =
      componentInfoObjects.allComponentClasses[adapterComponentType];

    if (adapterClass.inSchemaOnlyInheritAs) {
      if (
        adapterComponentType === destinationType ||
        adapterClass.inSchemaOnlyInheritAs.includes(destinationType)
      ) {
        return true;
      }
    } else if (
      componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: adapterComponentType,
        baseComponentType: destinationType,
      })
    ) {
      return true;
    }
  }
}
