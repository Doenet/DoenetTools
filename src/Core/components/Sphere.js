import { returnRoundingStateVariableDefinitions } from "../utils/rounding";
import GraphicalComponent from "./abstract/GraphicalComponent";

import me from "math-expressions";

export default class Sphere extends GraphicalComponent {
  static componentType = "sphere";
  static rendererType = "sphere";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.center = {
      createComponentOfType: "point",
      createStateVariable: "center",
      defaultValue: me.fromAst(["vector", 0, 0, 0]),
      public: true,
    };
    attributes.radius = {
      createComponentOfType: "number",
      createStateVariable: "radius",
      defaultValue: 1,
      public: true,
      forRenderer: true,
    };

    return attributes;
  }

  static returnChildGroups() {
    return GraphicalComponent.returnChildGroups();
  }

  static returnStateVariableDefinitions(args) {
    let stateVariableDefinitions =
      GraphicalComponent.returnStateVariableDefinitions(args);

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    stateVariableDefinitions.numericalCenter = {
      forRenderer: true,
      returnDependencies: () => ({
        center: {
          dependencyType: "stateVariable",
          variableName: "center",
        },
      }),
      definition({ dependencyValues }) {
        let numericalCenter = [];
        let warnings = [];
        if (dependencyValues.center.tree[0] !== "vector") {
          warnings.push({
            message: "Invalid center for sphere. Must be a 3D point.",
            level: 1,
          });
          numericalCenter = [NaN, NaN, NaN];
        } else {
          let nComps = dependencyValues.center.tree.length - 1;
          if (nComps < 3) {
            warnings.push({
              message:
                "Center of sphere has fewer than 3 components, padding with zeros",
              level: 1,
            });
          } else if (nComps > 3) {
            warnings.push({
              message:
                "Center of sphere has more than 3 components, ignoring extra components.",
              level: 1,
            });
          }

          for (let i = 0; i < 3; i++) {
            try {
              let comp = dependencyValues.center
                .get_component(i)
                .evaluate_to_constant();

              if (Number.isFinite(comp)) {
                numericalCenter.push(comp);
              } else {
                warnings.push({
                  message: "Invalid center for sphere. Coords",
                  level: 1,
                });
                numericalCenter = [NaN, NaN, NaN];
                break;
              }
            } catch (e) {
              warnings.push({
                message: "Invalid center for sphere. Coords",
                level: 1,
              });
              numericalCenter = [NaN, NaN, NaN];
            }
          }
        }

        return { setValue: { numericalCenter }, sendWarnings: warnings };
      },
    };

    return stateVariableDefinitions;
  }
}
