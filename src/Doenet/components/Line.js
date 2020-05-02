import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class Line extends GraphicalComponent {
  constructor(args) {
    super(args);
    this.moveLine = this.moveLine.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
    this.actions = { moveLine: this.moveLine };
  }
  static componentType = "line";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["points"] };

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = { default: true, forRenderer: true };
    properties.variables = {
      componentType: "math",
      entryPrefixes: ["var"],
      dependentStateVariables: [{
        dependencyName: "nVariables",
        variableName: "nDimensions"
      }]
    }
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneEquation = childLogic.newLeaf({
      name: "exactlyOneEquation",
      componentType: 'equation',
      number: 1
    });

    let replaceWithEquationOrThrough = function ({ dependencyValues }) {
      // have matched a sequence of strings and maths
      // first, break up by commas
      // If only one piece, then make an equation out of it
      // If more than one piece, create a <though> with points
      let Nparens = 0;
      let pieces = [];
      let currentPiece = [];
      let toDelete = [];

      for (let component of dependencyValues.stringAndMathChildren) {
        if (component.componentType !== "string") {
          currentPiece.push({
            createdComponent: true,
            componentName: component.componentName
          });
          continue;
        }

        let s = component.stateValues.value.trim();
        let beginInd = 0;
        let deleteOriginalString = false;

        for (let ind = 0; ind < s.length; ind++) {
          let char = s[ind];
          if (char === "(") {
            Nparens++;
          }
          if (char === ")") {
            if (Nparens === 0) {
              // parens didn't match, so return failure
              return { success: false };
            }
            Nparens--
          }
          if (char === "," && Nparens === 0) {
            if (ind > beginInd) {
              currentPiece.push({
                componentType: "string",
                state: { value: s.substring(beginInd, ind) }
              });
            }
            pieces.push(currentPiece);
            currentPiece = [];
            beginInd = ind + 1;
            deleteOriginalString = true;
            toDelete.push(component.componentName);

          }
        }

        if (deleteOriginalString) {
          if (s.length > beginInd) {
            currentPiece.push({
              componentType: "string",
              state: { value: s.substring(beginInd, s.length) }
            });
          }
        } else {
          currentPiece.push({
            createdComponent: true,
            componentName: component.componentName
          });
        }

      }

      // parens didn't match, so return failure
      if (Nparens !== 0) {
        return { success: false };
      }

      pieces.push(currentPiece);

      let newChildren;

      if (pieces.length === 1) {
        // since just one piece (and no comma), make an equation
        newChildren = [{
          componentType: 'equation', children: pieces[0]
        }];
      } else {
        // more than one piece, make a through with points

        newChildren = [{
          componentType: "through",
          children: pieces.map(x => ({
            componentType: "point", children: [{
              componentType: "coords", children: x
            }]
          }))
        }]
      }

      return {
        success: true,
        toDelete: toDelete,
        newChildren: newChildren
      };
    }

    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastOneMath = childLogic.newLeaf({
      name: "atLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'or',
      propositions: [atLeastOneString, atLeastOneMath],
      requireConsecutive: true,
      isSugar: true,
      logicToWaitOnSugar: ["exactlyOneEquation", "exactlyOneThrough"],
      returnSugarDependencies: () => ({
        stringAndMathChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"]
        }
      }),
      replacementFunction: replaceWithEquationOrThrough,
    });

    let addThrough = function ({ activeChildrenMatched }) {
      // add <through> around points
      let throughChildren = [];
      for (let child of activeChildrenMatched) {
        throughChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "through", children: throughChildren }],
      }
    }


    let exactlyTwoPoints = childLogic.newLeaf({
      name: "exactlyTwoPoints",
      componentType: 'point',
      number: 2,
      isSugar: true,
      logicToWaitOnSugar: ["exactlyOneThrough"],
      replacementFunction: addThrough,
    });

    let exactlyOneThrough = childLogic.newLeaf({
      name: "exactlyOneThrough",
      componentType: 'through',
      number: 1
    });

    let noThrough = childLogic.newLeaf({
      name: "noThrough",
      componentType: 'through',
      number: 0,
      allowSpillover: false,
    });

    let equationXorThrough = childLogic.newOperator({
      name: "equationXorThrough",
      operator: 'xor',
      propositions: [exactlyOneEquation, exactlyOneThrough,
        exactlyTwoPoints, stringsAndMaths, noThrough],
    });

    let atMostOneVariables = childLogic.newLeaf({
      name: "atMostOneVariables",
      componentType: 'variables',
      comparison: 'atMost',
      number: 1
    });

    childLogic.newOperator({
      name: "lineLogic",
      operator: 'and',
      propositions: [equationXorThrough, atMostOneVariables],
      setAsBase: true,
    });

    return childLogic;

  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.styleDescription = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
      }),
      definition: function ({ dependencyValues }) {


        let lineDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          lineDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          lineDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          lineDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          lineDescription += "dotted ";
        }

        lineDescription += `${dependencyValues.selectedStyle.lineColor} `;

        return { newValues: { styleDescription: lineDescription } };
      }
    }

    // we make equation child be a state variable
    // as we need a state variable to determine other dependencies
    // using stateVariablesDeterminingDependencies
    stateVariableDefinitions.equationChild = {
      returnDependencies: () => ({
        equationChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneEquation"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.equationChild.length === 1) {
          return { newValues: { equationChild: dependencyValues.equationChild[0] } }
        } else {
          return { newValues: { equationChild: null } }
        }
      }
    }

    stateVariableDefinitions.points = {
      public: true,
      componentType: "point",
      isArray: true,
      entryPrefixes: ["point"],
      stateVariablesDeterminingDependencies: ["equationChild"],
      returnDependencies: function ({ stateValues, arrayKeys }) {
        if (stateValues.equationChild === null) {
          let arrayKey;
          if (arrayKeys) {
            arrayKey = Number(arrayKeys[0]);
          }
          if (arrayKey === undefined) {
            return ({
              throughChild: {
                dependencyType: "childStateVariables",
                childLogicName: "exactlyOneThrough",
                variableNames: ["points"]
              }
            })
          } else {
            return ({
              throughChild: {
                dependencyType: "childStateVariables",
                childLogicName: "exactlyOneThrough",
                variableNames: ["point" + (arrayKey + 1)]
              }
            })
          }
        } else {
          return ({
            coeff0: {
              dependencyType: "stateVariable",
              variableName: "coeff0"
            },
            coeffvar1: {
              dependencyType: "stateVariable",
              variableName: "coeffvar1"
            },
            coeffvar2: {
              dependencyType: "stateVariable",
              variableName: "coeffvar2"
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
            lastPointsFromInverting: {
              dependencyType: "stateVariable",
              variableName: "lastPointsFromInverting"
            }
          })
        }
      },
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {

        let freshByKey = freshnessInfo.points.freshByKey;

        // console.log('markStale for line points')
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (changes.throughChild) {


          if (changes.throughChild.componentIdentitiesChanged) {

            // if throughChild changed
            // then the entire points array of line is also changed
            for (let key in freshByKey) {
              delete freshByKey[key];
            }
          } else {

            let valuesChanged = changes.throughChild.valuesChanged[0];

            if (arrayKey === undefined) {

              if (valuesChanged.points) {
                // if have the same points from throughChild
                // then just check if any of those points values
                // are no longer fresh
                let newFreshByKey = valuesChanged.points.freshnessInfo.freshByKey;
                for (let key in freshByKey) {
                  if (!newFreshByKey[key]) {
                    delete freshByKey[key];
                  }
                }
              }
            } else {
              if (valuesChanged["point" + (arrayKey + 1)]) {
                delete freshByKey[arrayKey];
              }
            }

          }
        } else if (changes.coeff0) {
          for (let key in freshByKey) {
            delete freshByKey[key];
          }

        }

        if (arrayKey === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { points: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            return { partiallyFresh: { points: true } }
          }
        } else {
          // asked for just one component
          return { fresh: { points: freshByKey[arrayKey] === true } }
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
        let freshByKey = freshnessInfo.points.freshByKey;

        // console.log('definition of line points');
        // console.log(dependencyValues)
        // console.log(arrayKeys);
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(changes)

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if ("coeff0" in dependencyValues) {

          // if both points are fresh, don't return anything
          if (freshByKey[0] && freshByKey[1]) {
            return {};
          }

          let result = calculatePointsFromCoeffs(dependencyValues);

          if (!result.success) {
            return { newValues: { points: [] } }
          } else {
            for (let key in result.points) {
              freshByKey[key] = true;
            }
            return { newValues: { points: result.points } }
          }
        } else if (dependencyValues.throughChild.length === 1) {

          if (arrayKey === undefined) {
            let throughPoints = dependencyValues.throughChild[0].stateValues.points;

            if (changes.throughChild.componentIdentitiesChanged) {
              // send array to indicate that should overwrite entire array
              for (let key in throughPoints) {
                freshByKey[key] = true;
              }
              return {
                newValues: {
                  points: throughPoints
                }
              }
            }

            let newPointValues = {};
            for (let key in throughPoints) {
              if (!freshByKey[key]) {
                freshByKey[key] = true;
                newPointValues[key] = throughPoints[key]
              }
            }
            return { newValues: { points: newPointValues } }

          } else {
            // have an arrayKey defined

            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;
              return {
                newValues: {
                  points: {
                    [arrayKey]: dependencyValues.throughChild[0].stateValues["point" + (arrayKey + 1)]
                  }
                }
              }
            } else {
              // arrayKey asked for didn't change
              // don't need to report noChanges for array state variable
              return {};
            }
          }

        } else {
          return {
            newValues: { points: [] }
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues,
        stateValues, initialChange, arrayKeys
      }) {

        // console.log(`inverseDefinition of points`);
        // console.log(desiredStateVariableValues.points)
        // console.log(JSON.parse(JSON.stringify(stateValues)))
        // console.log(arrayKeys);

        // if not draggable, then disallow initial change 
        if (initialChange && !stateValues.draggable) {
          return { success: false };
        }

        if ("throughChild" in dependencyValues) {
          if (dependencyValues.throughChild.length !== 1) {
            console.log('cannot invert points for line not based on points')
            return { success: false }
          }

          let arrayKey;
          if (arrayKeys) {
            arrayKey = Number(arrayKeys[0]);
          }

          if (arrayKey === undefined) {
            // working with entire array

            return {
              success: true,
              instructions: [{
                setDependency: "throughChild",
                desiredValue: desiredStateVariableValues.points,
                childIndex: 0,
                variableIndex: 0
              }]
            }
          } else {

            // just have one arrayKey
            // so child variable of throughChild is an array entry (rather than array)
            return {
              success: true,
              instructions: [{
                setDependency: "throughChild",
                desiredValue: desiredStateVariableValues.points[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              }]
            }

          }
        } else {

          // dependencies are coeffs

          let desiredPoints = desiredStateVariableValues.points;

          let point1x, point1y, point2x, point2y;
          if (desiredPoints[0]) {
            point1x = desiredPoints[0].get_component(0);
            point1y = desiredPoints[0].get_component(1);
          } else {
            point1x = stateValues.points[0].get_component(0);
            point1y = stateValues.points[0].get_component(1);
          }
          if (desiredPoints[1]) {
            point2x = desiredPoints[1].get_component(0);
            point2y = desiredPoints[1].get_component(1);
          } else {
            point2x = stateValues.points[1].get_component(0);
            point2y = stateValues.points[1].get_component(1);
          }


          if (typeof point1x.tree === "number" && typeof point1y.tree === "number"
            && typeof point2x.tree === "number" && typeof point2y.tree === "number"
          ) {


            let numericalPoint1 = [point1x.tree, point1y.tree];
            let numericalPoint2 = [point2x.tree, point2y.tree];

            let coeffvar1 = numericalPoint1[1] - numericalPoint2[1];
            let coeffvar2 = numericalPoint2[0] - numericalPoint1[0];
            let coeff0 = numericalPoint1[0] * numericalPoint2[1] - numericalPoint1[1] * numericalPoint2[0];

            let prodDiff = Math.abs(coeffvar1 * stateValues.coeffvar2 - stateValues.coeffvar1 * coeffvar2);

            let instructions = [];

            if (prodDiff < Math.abs(coeffvar1 * stateValues.coeffvar2) * 1E-12) {
              // the slope didn't change, so line was translated
              // don't change coeffvar1 or coeffvar2, but just coeff0

              if (coeffvar1 !== 0) {
                coeff0 *= stateValues.coeffvar1 / coeffvar1;
              } else {
                coeff0 *= stateValues.coeffvar2 / coeffvar2
              }

              instructions.push({
                setDependency: "coeff0",
                desiredValue: coeff0,
                additionalDependencyValues: {
                  coeffvar1: stateValues.coeffvar1,
                  coeffvar2: stateValues.coeffvar2
                }
              })
            } else {
              instructions.push({
                setDependency: "coeff0",
                desiredValue: coeff0,
                additionalDependencyValues: {
                  coeffvar1, coeffvar2
                }
              })
            }

            instructions.push({
              setDependency: "lastPointsFromInverting",
              desiredValue: [numericalPoint1, numericalPoint2]
            })

            return {
              success: true,
              instructions
            }


          }


          let coeffvar1 = point1y.subtract(point2y).simplify();
          let coeffvar2 = point2x.subtract(point1x).simplify();
          let coeff0 = point1x.multiply(point2y).subtract(point1y.multiply(point2x)).simplify();

          return {
            success: true,
            instructions: [{
              setDependency: "coeff0",
              desiredValue: coeff0,
              additionalDependencyValues: {
                coeffvar1, coeffvar2
              }
            }],
          }
        }

      }
    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      stateVariablesDeterminingDependencies: ["equationChild"],
      returnDependencies: function ({ stateValues }) {
        if (stateValues.equationChild === null) {
          return {
            points: {
              dependencyType: "stateVariable",
              variableName: "points"
            }
          }
        } else {
          return {
            equationChild: {
              dependencyType: "childIdentity",
              childLogicName: "exactlyOneEquation"
            },
          }
        }
      },
      definition: function ({ dependencyValues, changes }) {

        // console.log('definition of nDimensions')

        // console.log(dependencyValues)
        // console.log(changes)

        // if have an equation, we must be 2D
        // (Haven't implemented a line in 3D determined by 2 equations)
        if (dependencyValues.equationChild) {
          if (changes.equationChild && changes.equationChild.componentIdentitiesChanged) {
            return {
              newValues: { nDimensions: 2 },
              checkForActualChange: ["nDimensions"]
            }
          } else {
            return { noChanges: ["nDimensions"] }
          }
        } else {
          if (dependencyValues.points.length > 0) {
            let nDimensions = dependencyValues.points[0].tree.length - 1;
            for (let i = 1; i < dependencyValues.points.length; i++) {
              if (dependencyValues.points[i].tree.length - 1 !== nDimensions) {
                console.warn("Can't have line through points of differing dimensions");
                nDimensions = NaN;
              }
            }
            return {
              newValues: { nDimensions },
              checkForActualChange: ["nDimensions"]
            }
          } else {
            // line through zero points
            return { newValues: { nDimensions: NaN } }
          }

        }
      }
    }


    stateVariableDefinitions.equation = {
      public: true,
      componentType: "equation",
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["equationChild"],
      additionalStateVariablesDefined: [
        {
          variableName: "coeff0",
          public: true,
          componentType: "math",
        },
        {
          variableName: "coeffvar1",
          public: true,
          componentType: "math",
        },
        {
          variableName: "coeffvar2",
          public: true,
          componentType: "math",
        }
      ],
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          variables: {
            dependencyType: "stateVariable",
            variableName: "variables"
          }
        }
        if (stateValues.equationChild === null) {
          dependencies.points = {
            dependencyType: "stateVariable",
            variableName: "points"
          };
          dependencies.nDimensions = {
            dependencyType: "stateVariable",
            variableName: "nDimensions"
          }
        } else {
          dependencies.equationChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneEquation",
            variableNames: ["value"],
          };
        }
        return dependencies;
      },
      definition: function ({ dependencyValues }) {

        // console.log('definition of equation')
        // console.log(dependencyValues);

        let variables = dependencyValues.variables;

        let blankMath = me.fromAst('\uff3f');


        if (dependencyValues.equationChild) {
          let equation = dependencyValues.equationChild[0].stateValues.value;

          let result = calculateCoeffsFromEquation({ equation, variables });

          if (!result.success) {
            return {
              newValues: {
                equation,
                coeff0: blankMath, coeffvar1: blankMath, coeffvar2: blankMath
              }
            }
          }

          let { coeff0, coeffvar1, coeffvar2 } = result;
          return {
            newValues: {
              equation, coeff0, coeffvar1, coeffvar2
            }
          }
        }


        if (dependencyValues.points.length === 0) {
          console.warn("Line through zero points, can't determine line");
          return {
            newValues: {
              equation: blankMath,
              coeff0: blankMath, coeffvar1: blankMath, coeffvar2: blankMath
            }
          }

        } else if (dependencyValues.points.length === 1) {
          console.warn("Line through just one point, can't determine line");
          return {
            newValues: {
              equation: blankMath,
              coeff0: blankMath, coeffvar1: blankMath, coeffvar2: blankMath
            }
          }
        } else if (dependencyValues.points.length > 2) {
          console.warn(`Can't create a line through more than 2 points (${dependencyValues.points.length} given)`);
          return {
            newValues: {
              equation: blankMath,
              coeff0: blankMath, coeffvar1: blankMath, coeffvar2: blankMath
            }
          }
        }

        // have two points
        let nDimens = dependencyValues.nDimensions;

        if (Number.isNaN(nDimens)) {
          console.warn("Line through points of different dimensions");
          return {
            newValues: {
              equation: blankMath,
              coeff0: blankMath, coeffvar1: blankMath, coeffvar2: blankMath
            }
          }
        }

        if (nDimens < 2) {
          console.warn("Line must be through points of at least two dimensions");
          return {
            newValues: {
              equation: blankMath,
              coeff0: blankMath, coeffvar1: blankMath, coeffvar2: blankMath
            }
          }
        }


        let point1 = dependencyValues.points[0];
        let point2 = dependencyValues.points[1];


        let varStrings = [...variables.map(x => x.toString())];

        for (let i = 0; i < nDimens; i++) {
          if (point1.variables().indexOf(varStrings[i]) !== -1 ||
            point2.variables().indexOf(varStrings[i]) !== -1) {
            console.warn("Points through line depend on variables: " + varStrings.join(", "));
            return {
              newValues: {
                equation: blankMath,
                coeff0: blankMath, coeffvar1: blankMath, coeffvar2: blankMath
              }
            }
          }
        }

        if (nDimens !== 2) {
          // no equation if not in 2D
          return {
            newValues: {
              equation: blankMath,
              coeff0: blankMath, coeffvar1: blankMath, coeffvar2: blankMath
            }
          }
        }

        if (point1.equals(point2)) {
          // points are equal, so equation is undefined.  Set all coordinates to 0
          let zero = me.fromAst(0);
          return {
            newValues: {
              equation: blankMath,
              coeff0: zero, coeffvar1: zero, coeffvar2: zero
            }
          }
        }

        let point1x = point1.get_component(0);
        let point1y = point1.get_component(1);
        let point2x = point2.get_component(0);
        let point2y = point2.get_component(1);

        // TODO: somehow normalize the equation for the line
        // at least for case where coeffs are numbers
        // Maybe detect case where coeffs are numbers so can do these calculation faster?

        let coeffvar1 = point1y.subtract(point2y).simplify();
        let coeffvar2 = point2x.subtract(point1x).simplify();
        let coeff0 = point1x.multiply(point2y).subtract(point1y.multiply(point2x)).simplify();
        // let equation = me.fromAst('ax+by+c=0').substitute({a:coeffvar1, b:coeffvar2, c: coeff0, x: var1, y:var2}).simplify();
        let equation = me.fromAst(['=', ['+', ['*', 'a', 'x'], ['*', 'b', 'y'], 'c'], 0]).substitute({
          a: coeffvar1, b: coeffvar2, c: coeff0, x: variables[0], y: variables[1]
        }).simplify();

        return {
          newValues: {
            equation, coeff0, coeffvar1, coeffvar2
          }
        }

      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        // console.log(`inverse definition of equation, coeffs`);
        // console.log(desiredStateVariableValues)

        if (dependencyValues.points) {
          console.log(`Haven't implemented inverse definition of equation of line based on points`);
          return { success: false };
        }

        if (desiredStateVariableValues.equation) {
          return {
            success: true,
            instructions: [{
              setDependency: "equationChild",
              desiredValue: desiredStateVariableValues.equation,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        }

        // if not inverting equation, must be inverting coeffs
        if (!("coeff0" in desiredStateVariableValues
          && "coeffvar1" in desiredStateVariableValues
          && "coeffvar2" in desiredStateVariableValues)
        ) {
          console.log(`Haven't implemented inverting coeffs if not specifying all of them`);
          return { success: false }
        }

        let equation = me.fromAst(['=', 0, ['+', ['*', 'a', 'x'], ['*', 'b', 'y'], 'c']]).substitute({
          a: desiredStateVariableValues.coeffvar1,
          b: desiredStateVariableValues.coeffvar2,
          c: desiredStateVariableValues.coeff0,
          x: dependencyValues.variables[0], y: dependencyValues.variables[1]
        }).simplify();

        return {
          success: true,
          instructions: [{
            setDependency: "equationChild",
            desiredValue: equation,
            childIndex: 0,
            variableIndex: 0
          }]
        }

      }

    }

    stateVariableDefinitions.numericalPoints = {
      isArray: true,
      entryPrefixes: ["numericalPoint"],
      forRenderer: true,
      returnDependencies: () => ({
        points: {
          dependencyType: "stateVariable",
          variableName: "points"
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        }
      }),
      definition: function ({ dependencyValues }) {
        if (Number.isNaN(dependencyValues.nDimensions)) {
          return { newValues: { numericalPoints: [] } }
        }

        let numericalPoints = [];
        for (let point of dependencyValues.points) {
          let numericalP = [];
          for (let ind = 0; ind < dependencyValues.nDimensions; ind++) {
            let val = point.get_component(ind).evaluate_to_constant();
            if (!Number.isFinite(val)) {
              val = NaN;
            }
            numericalP.push(val);
          }
          numericalPoints.push(numericalP);
        }

        return { newValues: { numericalPoints } }
      }
    }


    stateVariableDefinitions.numericalCoeff0 = {
      additionalStateVariablesDefined: ["numericalCoeffvar1", "numericalCoeffvar2"],
      returnDependencies: () => ({
        coeff0: {
          dependencyType: "stateVariable",
          variableName: "coeff0"
        },
        coeffvar1: {
          dependencyType: "stateVariable",
          variableName: "coeffvar1"
        },
        coeffvar2: {
          dependencyType: "stateVariable",
          variableName: "coeffvar2"
        }
      }),
      definition: function ({ dependencyValues }) {

        let numericalCoeff0 = dependencyValues.coeff0.evaluate_to_constant();
        if (!Number.isFinite(numericalCoeff0)) {
          numericalCoeff0 = NaN;
        }


        let numericalCoeffvar1 = dependencyValues.coeffvar1.evaluate_to_constant();
        if (!Number.isFinite(numericalCoeffvar1)) {
          numericalCoeffvar1 = NaN;
        }

        let numericalCoeffvar2 = dependencyValues.coeffvar2.evaluate_to_constant();
        if (!Number.isFinite(numericalCoeffvar2)) {
          numericalCoeffvar2 = NaN;
        }

        return { newValues: { numericalCoeff0, numericalCoeffvar1, numericalCoeffvar2 } }
      }
    }


    stateVariableDefinitions.slope = {
      public: true,
      componentType: "math",
      returnDependencies: () => ({
        coeffvar1: {
          dependencyType: "stateVariable",
          variableName: "coeffvar1"
        },
        coeffvar2: {
          dependencyType: "stateVariable",
          variableName: "coeffvar2"
        },
      }),
      definition: function ({ dependencyValues }) {
        let slope = me.fromAst(["-", ["/", "a", "b"]])
          .substitute({ a: dependencyValues.coeffvar1, b: dependencyValues.coeffvar2 })
          .simplify();

        return { newValues: { slope } }

      }
    }

    stateVariableDefinitions.xintercept = {
      public: true,
      componentType: "math",
      returnDependencies: () => ({
        coeff0: {
          dependencyType: "stateVariable",
          variableName: "coeff0"
        },
        coeffvar1: {
          dependencyType: "stateVariable",
          variableName: "coeffvar1"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          xintercept: me.fromAst(["-", ["/", "a", "b"]])
            .substitute({
              a: dependencyValues.coeff0,
              b: dependencyValues.coeffvar1
            })
            .simplify()
        }
      })
    }

    stateVariableDefinitions.yintercept = {
      public: true,
      componentType: "math",
      returnDependencies: () => ({
        coeff0: {
          dependencyType: "stateVariable",
          variableName: "coeff0"
        },
        coeffvar2: {
          dependencyType: "stateVariable",
          variableName: "coeffvar2"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          yintercept: me.fromAst(["-", ["/", "a", "b"]])
            .substitute({
              a: dependencyValues.coeff0,
              b: dependencyValues.coeffvar2
            })
            .simplify()

        }
      })
    }

    stateVariableDefinitions.lastPointsFromInverting = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          lastPointsFromInverting: {
            variableToCheck: "lastPointsFromInverting"
          }
        }
      }),
      inverseDefinition: ({ desiredStateVariableValues }) => ({
        success: true,
        instructions: [{
          setStateVariable: "lastPointsFromInverting",
          value: desiredStateVariableValues.lastPointsFromInverting
        }]
      })
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        throughChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneThrough"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.throughChild.length === 1) {
          return {
            newValues: {
              childrenToRender: [dependencyValues.throughChild[0].componentName]
            }
          }
        } else {
          return { newValues: { childrenToRender: [] } }
        }
      }
    }


    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        },
        numericalCoeff0: {
          dependencyType: "stateVariable",
          variableName: "numericalCoeff0"
        },
        numericalCoeffvar1: {
          dependencyType: "stateVariable",
          variableName: "numericalCoeffvar1"
        },
        numericalCoeffvar2: {
          dependencyType: "stateVariable",
          variableName: "numericalCoeffvar2"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nearestPoint: function (variables) {

            // only implemented in 2D for now
            if (dependencyValues.nDimensions !== 2) {
              return {};
            }

            // only implement for constant coefficients
            let a = dependencyValues.numericalCoeffvar1;
            let b = dependencyValues.numericalCoeffvar2;
            let c = dependencyValues.numericalCoeff0;

            if (!(Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c))) {
              return {};
            }

            let denom = a * a + b * b;

            if (denom === 0) {
              return {};
            }

            let x1 = variables.x1.evaluate_to_constant();
            let x2 = variables.x2.evaluate_to_constant();

            if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
              return {};
            }

            let result = {};
            result.x1 = (b * (b * x1 - a * x2) - a * c) / denom;
            result.x2 = (a * (-b * x1 + a * x2) - b * c) / denom;

            if (variables.x3 !== undefined) {
              result.x3 = 0;
            }

            return result;

          }
        }
      })
    }



    return stateVariableDefinitions;

  }

  calculateStateFromPoints() {

    if (this.state.points.length !== 2) {
      console.warn("Line not through two points");
      return { success: false };
    }

    let point1 = this.state.points[0];
    let point2 = this.state.points[1];

    let ndimens = this.state.ndimensions = point1.tree.length - 1;

    if (point2.tree.length - 1 !== ndimens) {
      console.warn("Line through points of different dimensions");
      return { success: false };
    }

    if (ndimens === 1) {
      console.warn("Line must be through points of at least two dimensions");
      return { success: false };
    }

    if (this.state.variableChild) {
      if (this.state.variableChild.state.ncomponents !== ndimens) {
        console.warn("For a line, number of variables specified must match dimension of points");
        return { success: false };
      }
    }

    let var1 = this.state.var1;
    let var2 = this.state.var2;
    let var1String = var1.toString();
    let var2String = var2.toString();

    let varStrings = [var1String, var2String];
    if (ndimens > 2) {
      if (this.state.variableChild) {
        for (let i = 2; i < ndimens; i++) {
          varStrings.push(this.state.variableChild.state.variables[i - 1].toString());
        }
      } else {
        // not clear what variable should come next if ndimens > 3
        if (this.state.var3 !== undefined) {
          varStrings.push(this.state.var3.toString())
        } else {
          varStrings.push("z");
        }
      }
    }

    for (let i = 0; i < ndimens; i++) {
      if (point1.variables().indexOf(varStrings[i]) !== -1 ||
        point2.variables().indexOf(varStrings[i]) !== -1) {
        console.warn("Points through line depend on variables: " + varStrings.join(", "));
        return { success: false };
      }
    }

    if (ndimens !== 2) {
      // no equation if not in 2D
      return { success: true };
    }

    if (point1.equals(point2)) {
      // points are equal, so equation is undefined.  Set all coordinates to 0
      let zero = me.fromAst(0);
      this.state.coeff0 = zero;
      this.state.coeffvar1 = zero;
      this.state.coeffvar2 = zero;
      return { success: true };
    }

    let point1x, point1y, point2x, point2y;
    try {
      point1x = point1.get_component(0);
      point1y = point1.get_component(1);
      point2x = point2.get_component(0);
      point2y = point2.get_component(1);
    } catch (e) {
      console.warn("Point through line don't have two dimensions");
      return { success: false };
    }

    this.state.coeffvar1 = point1y.subtract(point2y).simplify();
    this.state.coeffvar2 = point2x.subtract(point1x).simplify();
    this.state.coeff0 = point1x.multiply(point2y).subtract(point1y.multiply(point2x)).simplify();
    // let equation = me.fromAst('ax+by+c=0').substitute({a:coeffvar1, b:coeffvar2, c: coeff0, x: var1, y:var2}).simplify();
    this.state.equation = me.fromAst(['=', 0, ['+', ['*', 'a', 'x'], ['*', 'b', 'y'], 'c']]).substitute({
      a: this.state.coeffvar1, b: this.state.coeffvar2, c: this.state.coeff0, x: var1, y: var2
    }).simplify();

    return { success: true };

  }

  moveLine({ point1coords, point2coords }) {
    let point1 = me.fromAst(["vector", ...point1coords]);
    let point2 = me.fromAst(["vector", ...point2coords]);

    this.requestUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "points",
        value: [point1, point2]
      }]
    });

  }

  nearestPoint({ x1, x2, x3 }) {

  }
}


function calculateCoeffsFromEquation({ equation, variables }) {

  // determine if equation is a linear equation in the variables

  let var1 = variables[0];
  let var2 = variables[1];
  let var1String = var1.toString();
  let var2String = var2.toString();

  equation = equation.expand().simplify();

  let rhs = me.fromAst(['+', equation.tree[2], ['-', equation.tree[1]]]).expand().simplify();
  // divide rhs into terms

  let terms = [];
  if (Array.isArray(rhs.tree) && rhs.tree[0] === '+') {
    terms = rhs.tree.slice(1);
  }
  else {
    terms = [rhs.tree];
  }

  let coeffvar1 = me.fromAst(0);
  let coeffvar2 = me.fromAst(0);
  let coeff0 = me.fromAst(0);

  for (let term of terms) {
    let coeffs = getTermCoeffs(term);
    if (!coeffs.success) {
      return { success: false }
    }
    coeffvar1 = coeffvar1.add(coeffs.coeffvar1);
    coeffvar2 = coeffvar2.add(coeffs.coeffvar2);
    coeff0 = coeff0.add(coeffs.coeff0);
  }
  coeffvar1 = coeffvar1.simplify();
  coeffvar2 = coeffvar2.simplify();
  coeff0 = coeff0.simplify();

  return { success: true, coeff0, coeffvar1, coeffvar2 }

  function getTermCoeffs(term) {
    let cv1 = 0, cv2 = 0, c0 = 0;

    if (typeof term === "string") {
      if (term === var1String) {
        cv1 = 1;
      }
      else if (term === var2String) {
        cv2 = 1;
      }
      else {
        c0 = term;
      }
    }
    else if (typeof term === "number") {
      c0 = term;
    }
    else if (!Array.isArray(term)) {
      console.warn("Invalid format for equation of line in variables " + var1 + " and " + var2);
      return { success: false };
    }
    else {
      let operator = term[0];
      let operands = term.slice(1);
      if (operator === '-') {
        let coeffs = getTermCoeffs(operands[0]);
        if (!coeffs.success) {
          return { success: false }
        }
        cv1 = ['-', coeffs.coeffvar1.tree];
        cv2 = ['-', coeffs.coeffvar2.tree];
        c0 = ['-', coeffs.coeff0.tree];
      }
      else if (operator === '+') {
        console.warn("Invalid format for equation of line in variables " + var1 + " and " + var2);
        return { success: false };
      }
      else if (operator === '*') {
        let var1ind = -1, var2ind = -1;
        for (let i = 0; i < operands.length; i++) {
          if (var1.equals(me.fromAst(operands[i]))) {
            var1ind = i;
            break;
          }
          else if (var2.equals(me.fromAst(operands[i]))) {
            var2ind = i;
            break;
          }
        }
        if (var1ind !== -1) {
          operands.splice(var1ind, 1);
          if (operands.length === 1) {
            cv1 = operands[0];
          }
          else {
            cv1 = ["*"].concat(operands);
          }
        }
        else if (var2ind !== -1) {
          operands.splice(var2ind, 1);
          if (operands.length === 1) {
            cv2 = operands[0];
          }
          else {
            cv2 = ["*"].concat(operands);
          }
        }
        else {
          c0 = term;
        }
      }
      else if (operator === "/") {
        let coeffs = getTermCoeffs(operands[0]);
        if (!coeffs.success) {
          return { success: false }
        }
        cv1 = ['/', coeffs.coeffvar1.tree, operands[1]];
        cv2 = ['/', coeffs.coeffvar2.tree, operands[1]];
        c0 = ['/', coeffs.coeff0.tree, operands[1]];
      }
      else if (operator === '_') {
        if (var1.equals(me.fromAst(term))) {
          cv1 = 1;
        }
        else if (var2.equals(me.fromAst(term))) {
          cv2 = 1;
        }
        else {
          c0 = term;
        }
      }
      else {
        c0 = term;
      }
    }
    return { success: true, coeffvar1: me.fromAst(cv1), coeffvar2: me.fromAst(cv2), coeff0: me.fromAst(c0) };

  }

}

function calculatePointsFromCoeffs({ coeff0, coeffvar1, coeffvar2, variables, lastPointsFromInverting }) {

  let var1 = variables[0];
  let var2 = variables[1];
  let var1String = var1.toString();
  let var2String = var2.toString();

  // if any of the coefficients have var1 or var2 in them, then it's not a line
  if (coeffvar1.variables(true).indexOf(var1String) !== -1
    || coeffvar1.variables(true).indexOf(var2String) !== -1
    || coeffvar2.variables(true).indexOf(var1String) !== -1
    || coeffvar2.variables(true).indexOf(var2String) !== -1
    || coeff0.variables(true).indexOf(var1String) !== -1
    || coeff0.variables(true).indexOf(var2String) !== -1) {
    console.warn("Invalid format for equation of line in variables " + var1String + " and " + var2String);
    return { success: false };
  }
  let zero = me.fromAst(0);
  if (coeffvar1.equals(zero) && coeffvar2.equals(zero)) {
    console.warn("Invalid format for equation of line in variables " + var1String + " and " + var2String);
    return { success: false };
  }

  // console.log("coefficient of " + var1 + " is " + coeffvar1);
  // console.log("coefficient of " + var2 + " is " + coeffvar2);
  // console.log("constant coefficient is " + coeff0);

  let a = coeffvar1.evaluate_to_constant();
  let b = coeffvar2.evaluate_to_constant();
  let c = coeff0.evaluate_to_constant();

  let point1x, point1y, point2x, point2y;

  if (Number.isFinite(c) && Number.isFinite(a)
    && Number.isFinite(b)
  ) {


    let denom = a * a + b * b;
    if (denom === 0) {
      return { success: false };
    }

    if (lastPointsFromInverting) {

      let x1 = lastPointsFromInverting[0][0]
      let x2 = lastPointsFromInverting[0][1]
      point1x = (b * (b * x1 - a * x2) - a * c) / denom;
      point1y = (a * (-b * x1 + a * x2) - b * c) / denom;

      x1 = lastPointsFromInverting[1][0]
      x2 = lastPointsFromInverting[1][1]
      point2x = (b * (b * x1 - a * x2) - a * c) / denom;
      point2y = (a * (-b * x1 + a * x2) - b * c) / denom;

    } else {
      // create two points that equation passes through
      point1x = (2 * b - a * c) / denom;
      point1y = (-2 * a - b * c) / denom;
      point2x = (b - a * c) / denom;
      point2y = -(a + b * c) / denom;
    }

  } else {

    // create two points that equation passes through
    let denom = coeffvar1.pow(2).add(coeffvar2.pow(2));
    point1x = coeffvar2.multiply(2).subtract(coeffvar1.multiply(coeff0)).divide(denom);
    point1y = coeffvar1.multiply(-2).subtract(coeffvar2.multiply(coeff0)).divide(denom);
    point2x = coeffvar2.subtract(coeffvar1.multiply(coeff0)).divide(denom);
    point2y = coeffvar1.add(coeffvar2.multiply(coeff0)).multiply(-1).divide(denom);
  }

  let points = [];

  points.push(me.fromAst(["vector", point1x, point1y]));
  points.push(me.fromAst(["vector", point2x, point2y]));

  return { success: true, points };

}