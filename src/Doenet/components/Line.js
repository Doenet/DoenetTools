import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class Line extends GraphicalComponent {
  static componentType = "line";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["points", "var1", "var2"] };

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = { default: true };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneEquation = childLogic.newLeaf({
      name: "exactlyOneEquation",
      componentType: 'equation',
      number: 1
    });

    let replaceWithEquationOrThrough = function ({ activeChildrenMatched }) {
      // have matched a sequence of strings and maths
      // first, break up by commas
      // If only one piece, then make an equation out of it
      // If more than one piece, create a <though> with points
      let Nparens = 0;
      let pieces = [];
      let currentPiece = [];
      let toDelete = [];

      for (let component of activeChildrenMatched) {
        if (component.componentType !== "string") {
          currentPiece.push({
            createdComponent: true,
            componentName: component.componentName
          });
          continue;
        }

        let s = component.state.value.trim();
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

  updateState(args = {}) {
    if (args.init === true) {

      this.makePublicStateVariable({
        variableName: "slope",
        componentType: "math",
      });
      this.makePublicStateVariable({
        variableName: "xintercept",
        componentType: "math",
      });
      this.makePublicStateVariable({
        variableName: "yintercept",
        componentType: "math",
      });
      this.makePublicStateVariable({
        variableName: "equation",
        componentType: "equation",
      });
      this.makePublicStateVariable({
        variableName: "coeff0",
        componentType: "math",
      });
      this.makePublicStateVariable({
        variableName: "coeffvar1",
        componentType: "math",
      });
      this.makePublicStateVariable({
        variableName: "coeffvar2",
        componentType: "math",
      });
      this.makePublicStateVariable({
        variableName: "var1",
        componentType: "math",
      });
      this.makePublicStateVariable({
        variableName: "var2",
        componentType: "math",
      });

      this.makePublicStateVariableArray({
        variableName: "points",
        componentType: "point",
        stateVariableForRef: "coords",
        emptyForOutOfBounds: true,
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "point",
        arrayVariableName: "points",
      });
      this.makePublicStateVariable({
        variableName: "styledescription",
        componentType: "text",
      });


      this.moveLine = this.moveLine.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );

    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.slope = true;
      this.unresolvedState.xintercept = true;
      this.unresolvedState.yintercept = true;
      this.unresolvedState.equation = true;
      this.unresolvedState.coeff0 = true;
      this.unresolvedState.coeffvar1 = true;
      this.unresolvedState.coeffvar2 = true;
      this.unresolvedState.var1 = true;
      this.unresolvedState.var2 = true;
      this.unresolvedState.points = true;
      return;
    }

    delete this.unresolvedState.slope;
    delete this.unresolvedState.xintercept;
    delete this.unresolvedState.yintercept;
    delete this.unresolvedState.equation;
    delete this.unresolvedState.coeff0;
    delete this.unresolvedState.coeffvar1;
    delete this.unresolvedState.coeffvar2;
    delete this.unresolvedState.var1;
    delete this.unresolvedState.var2;
    delete this.unresolvedState.points;

    this.state.selectedStyle = this.styleDefinitions[this.state.stylenumber];
    if (this.state.selectedStyle === undefined) {
      this.state.selectedStyle = this.styleDefinitions[1];
    }

    let lineDescription = "";
    if (this.state.selectedStyle.lineWidth >= 4) {
      lineDescription += "thick ";
    } else if (this.state.selectedStyle.lineWidth <= 1) {
      lineDescription += "thin ";
    }
    if (this.state.selectedStyle.lineStyle === "dashed") {
      lineDescription += "dashed ";
    } else if (this.state.selectedStyle.lineStyle === "dotted") {
      lineDescription += "dotted ";
    }

    lineDescription += `${this.state.selectedStyle.lineColor} `;

    this.state.styledescription = lineDescription;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {

      // get variables from variable activeChildren if not from essential state variables
      let varResult = this.childLogic.returnMatches("atMostOneVariables");
      if (varResult.length === 1) {
        this.state.variableChild = this.activeChildren[varResult[0]];
      } else {
        delete this.state.variableChild;
        // default variables are x and y
        if (this._state.var1.essential !== true) {
          this.state.var1 = me.fromAst("x");
        }
        if (this._state.var2.essential !== true) {
          this.state.var2 = me.fromAst("y");
        }
      }

      this.state.definitionFrom = "";
      let exactlyOneEquation = this.childLogic.returnMatches("exactlyOneEquation");
      let exactlyOneThrough = this.childLogic.returnMatches("exactlyOneThrough");

      if (exactlyOneEquation.length === 1) {
        this.state.definitionFrom = "equation";
        this.state.equationChild = this.activeChildren[exactlyOneEquation[0]];
        delete this.state.throughChild;
      } else if (exactlyOneThrough.length === 1) {
        this.state.definitionFrom = "points";
        this.state.throughChild = this.activeChildren[exactlyOneThrough[0]];
        delete this.state.equationChild;
      } else {
        // no equation or through specified, must have either
        // - essential equation,
        // - essential coeff0, coeffvar1, and coeffvar2, or
        // - essential points
        delete this.state.equationChild;
        delete this.state.throughChild;

        if (this._state.equation.essential === true) {
          this.state.definitionFrom = "equation";
        } else if (this._state.coeff0.essential === true &&
          this._state.coeffvar1.essential === true &&
          this._state.coeffvar2.essential === true) {
          this.state.definitionFrom = "coeffs";
        } else if (this._state.points.essential === true) {
          this.state.definitionFrom = "points";
        } else {
          throw Error("Must specify equation for line or points along line.")
        }
      }
    }

    if (this.state.variableChild) {
      if (this.state.variableChild.unresolvedState.variables) {
        this.unresolvedState.var1 = true;
        this.unresolvedState.var2 = true;
      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.variableChild, variable: "variables"
      })) {
        if (this.state.variableChild.state.ncomponents < 2) {
          console.warn("Invalid format for variables of line: must have at least two variables");
          if (this.state.variableChild.state.ncomponents === 1) {
            this.state.var1 = this.state.variableChild.state.variables[0];
            if (this.state.var1.tree === "y") {
              this.state.var2 = me.fromAst("z");
            } else {
              this.state.var2 = me.fromAst("y");
            }
          } else {
            this.state.var1 = me.fromAst("x");
            this.state.var2 = me.fromAst("y");
          }
        }
        this.state.var1 = this.state.variableChild.state.variables[0];
        this.state.var2 = this.state.variableChild.state.variables[1];
      }
    }

    let recalculateLine = childrenChanged;

    if (this.state.equationChild) {
      if (this.state.equationChild.unresolvedState.value) {
        this.unresolvedState.slope = true;
        this.unresolvedState.xintercept = true;
        this.unresolvedState.yintercept = true;
        this.unresolvedState.equation = true;
        this.unresolvedState.coeff0 = true;
        this.unresolvedState.coeffvar1 = true;
        this.unresolvedState.coeffvar2 = true;
        this.unresolvedState.points = true;
        return;
      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.equationChild, variable: "value"
      })) {
        recalculateLine = true;
        this.state.equation = this.state.equationChild.state.value;
      }
    } else if (this.state.throughChild) {
      let throughState = this.state.throughChild.state;
      if (this.state.throughChild.unresolvedState.points ||
        throughState.points.some(x => x.unresolvedState.coords)) {
        this.unresolvedState.slope = true;
        this.unresolvedState.xintercept = true;
        this.unresolvedState.yintercept = true;
        this.unresolvedState.equation = true;
        this.unresolvedState.coeff0 = true;
        this.unresolvedState.coeffvar1 = true;
        this.unresolvedState.coeffvar2 = true;
        this.unresolvedState.points = true;
        return;
      }

      // calculate line from through points

      let pointsChanged = childrenChanged || this.state.points === undefined ||
        trackChanges.childrenChanged(this.state.throughChild.componentName);

      if (pointsChanged) {
        recalculateLine = true;

        if (throughState.nPoints === 0) {
          console.warn("Line through zero points, can't determine line");
          this.state.points = [
            me.fromAst(0), me.fromAst(0)
          ]
        } else if (throughState.nPoints === 1) {
          console.warn("Line through just one point, can't determine line");
          this.state.points = [
            throughState.points[0].state.coords.copy(),
            throughState.points[0].state.coords.copy(),
          ]
        } else if (throughState.nPoints === 2) {
          this.state.points = [
            throughState.points[0].state.coords.copy(),
            throughState.points[1].state.coords.copy(),
          ];
        } else {
          throw Error(`Can't create a line through more than 2 points (${throughState.nPoints} given)`);
        }
      } else {

        if (throughState.nPoints > 0) {
          if (trackChanges.getVariableChanges({
            component: throughState.points[0],
            variable: "coords"
          })) {
            recalculateLine = true;
            this.state.points[0] = throughState.points[0].state.coords.copy();
          }

          if (throughState.nPoints > 1) {
            if (trackChanges.getVariableChanges({
              component: throughState.points[1],
              variable: "coords"
            })) {
              recalculateLine = true;
              this.state.points[1] = throughState.points[1].state.coords.copy();
            }
          }
        }
      }

    } else {

      if (this.state.definitionFrom === "coeffs") {
        // no children
        if (this.state.equation === undefined ||
          trackChanges.getVariableChanges({ component: this, variable: "coeffvar1" }) ||
          trackChanges.getVariableChanges({ component: this, variable: "coeffvar2" }) ||
          trackChanges.getVariableChanges({ component: this, variable: "coeff0" })
        ) {
          recalculateLine = true;

        }
      } else if (this.state.definitionFrom === "equation") {
        if (trackChanges.getVariableChanges({ component: this, variable: "equation" })
        ) {
          recalculateLine = true;
        }
      } else {
        if (trackChanges.getVariableChanges({ component: this, variable: "points" })) {
          recalculateLine = true;
        }

      }

    }

    if (recalculateLine) {
      let result;
      if (this.state.definitionFrom === "coeffs") {
        result = this.calculateStateFromCoeffs()
      } else if (this.state.definitionFrom === "equation") {
        result = this.calculateStateFromEquation();
      } else {
        result = this.calculateStateFromPoints();
      }

      if (!result.success) {
        return;
      }

      this.calculateSlope();
      this.calculateIntercepts();
    }

  }

  calculateStateFromEquation() {
    // have equation but no points
    // determine if equation is a linear equation in the variables

    let var1 = this.state.var1;
    let var2 = this.state.var2;
    let var1String = var1.toString();
    let var2String = var2.toString();

    let equation = this.state.equation = this.state.equation.expand().simplify();

    let lhs = me.fromAst(['+', equation.tree[1], ['-', equation.tree[2]]]).expand().simplify();
    // divide lhs into terms

    let terms = [];
    if (Array.isArray(lhs.tree) && lhs.tree[0] === '+') {
      terms = lhs.tree.slice(1);
    }
    else {
      terms = [lhs.tree];
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
    this.state.coeffvar1 = coeffvar1 = coeffvar1.simplify();
    this.state.coeffvar2 = coeffvar2 = coeffvar2.simplify();
    this.state.coeff0 = coeff0 = coeff0.simplify();

    return this.calculateStateFromCoeffs(false);

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

  calculateStateFromCoeffs(calculateEquation = true) {

    // must be an equation in just two variables
    // so if variables were specified, check if exactly two variables
    if (this.state.variableChild) {
      if (this.state.variableChild.state.ncomponents !== 2) {
        console.warn("Only two variables can be specified for equation of a line");
        return { success: false };
      }
    }

    this.state.ndimensions = 2;

    let coeffvar1 = this.state.coeffvar1;
    let coeffvar2 = this.state.coeffvar2;
    let coeff0 = this.state.coeff0;

    let var1 = this.state.var1;
    let var2 = this.state.var2;
    let var1String = var1.toString();
    let var2String = var2.toString();

    if (calculateEquation) {
      this.state.equation = me.fromAst(
        ['=',
          ['+', ['*', coeffvar1.tree, var1.tree],
            ['*', coeffvar2.tree, var2.tree],
            coeff0], 0]
      );
    }

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

    // console.log("coefficient of " + var1 + " is " + coeffvar1.toString());
    // console.log("coefficient of " + var2 + " is " + coeffvar2.toString());
    // console.log("constant coefficient is " + coeff0.toString());

    // create two points that equation passes through
    let denom = coeffvar1.pow(2).add(coeffvar2.pow(2));
    let point1x = coeffvar2.multiply(2).subtract(coeffvar1.multiply(coeff0)).divide(denom);
    let point1y = coeffvar1.multiply(-2).subtract(coeffvar2.multiply(coeff0)).divide(denom);
    let point2x = coeffvar2.subtract(coeffvar1.multiply(coeff0)).divide(denom);
    let point2y = coeffvar1.add(coeffvar2.multiply(coeff0)).multiply(-1).divide(denom);

    this.state.points = [];

    this.state.points.push(me.fromAst(["tuple", point1x, point1y]));
    this.state.points.push(me.fromAst(["tuple", point2x, point2y]));

    return { success: true };

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
    this.state.equation = me.fromAst(['=', ['+', ['*', 'a', 'x'], ['*', 'b', 'y'], 'c'], 0]).substitute({
      a: this.state.coeffvar1, b: this.state.coeffvar2, c: this.state.coeff0, x: var1, y: var2
    }).simplify();

    return { success: true };

  }

  calculateSlope() {
    this.state.slope = me.fromAst(["-", ["/", "a", "b"]])
      .substitute({ a: this.state.coeffvar1, b: this.state.coeffvar2 })
      .simplify();
  }

  calculateIntercepts() {

    let cs = {
      "xintercept": this.state.coeffvar1,
      "yintercept": this.state.coeffvar2,
    }

    for (let intercept in cs) {
      this.state[intercept] = me.fromAst(["-", ["/", "a", "b"]])
        .substitute({ a: this.state.coeff0, b: cs[intercept] })
        .simplify();
    }

  }

  moveLine({ point1coords, point2coords }) {
    let point1 = me.fromAst(["tuple", ...point1coords]);
    let point2 = me.fromAst(["tuple", ...point2coords]);

    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          points: {
            isArray: true,
            changes: { arrayComponents: { 0: point1, 1: point2 } }
          }
        }
      }]
    });

  }

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    if (this.state.ndimensions === 2) {
      const actions = {
        moveLine: this.moveLine,
      }

      let point1x, point1y, point2x, point2y;
      try {
        point1x = this.state.points[0].get_component(0);
        point1y = this.state.points[0].get_component(1);
        point2x = this.state.points[1].get_component(0);
        point2y = this.state.points[1].get_component(1);
      } catch (e) {
        console.warn("Points through line don't have two dimensions");
        return;
      }

      this.renderer = new this.availableRenderers.line2d({
        key: this.componentName,
        label: this.state.label,
        draggable: this.state.draggable,
        layer: this.state.layer,
        visible: !this.state.hide,
        point1coords:
          [
            point1x.evaluate_to_constant(),
            point1y.evaluate_to_constant()
          ],
        point2coords:
          [
            point2x.evaluate_to_constant(),
            point2y.evaluate_to_constant()
          ],
        actions: actions,
        color: this.state.selectedStyle.lineColor,
        width: this.state.selectedStyle.lineWidth,
        style: this.state.selectedStyle.lineStyle,
      });
    }
  }

  updateRenderer() {
    let point1x, point1y, point2x, point2y;
    try {
      point1x = this.state.points[0].get_component(0);
      point1y = this.state.points[0].get_component(1);
      point2x = this.state.points[1].get_component(0);
      point2y = this.state.points[1].get_component(1);
    } catch (e) {
      console.warn("Point through line don't have two dimensions");
      return;
    }

    this.renderer.updateLine({
      visible: !this.state.hide,
      point1coords:
        [
          point1x.evaluate_to_constant(),
          point1y.evaluate_to_constant()
        ],
      point2coords:
        [
          point2x.evaluate_to_constant(),
          point2y.evaluate_to_constant()
        ],
    });
  }

  updateChildrenWhoRender() {
    if (this.state.throughChild !== undefined)
      this.childrenWhoRender = [this.state.throughChild.componentName];
  }

  allowDownstreamUpdates(status) {
    return ((status.initialChange === true && this.state.draggable === true) ||
      (status.initialChange !== true && this.state.modifyIndirectly === true));
  }

  get variablesUpdatableDownstream() {
    return ["points"];
  }


  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    let newStateVariables = {};
    let pointsChanged = new Set([]);

    let newPoints = Array(2);

    for (let varName in stateVariablesToUpdate) {
      if (varName === "points") {
        if (newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          pointsChanged.add(Number(ind));
          newPoints[ind] = newStateVariables[varName].changes.arrayComponents[ind] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      }
    }

    if (this.state.definitionFrom === "points") {

      // check if based on through
      if (this.state.throughChild !== undefined) {

        let throughPoints = this.state.throughChild.state.points;

        for (let ind = 0; ind < 2; ind++) {
          if (pointsChanged.has(ind)) {
            let pointName = throughPoints[ind].componentName;
            dependenciesToUpdate[pointName] = { coords: { changes: newPoints[ind] } };
          }
        }
      }
    } else {
      // line from equation or coefficients
      // need to recalculate equation from new point coords

      let var1 = this.state.var1;
      let var2 = this.state.var2;
      let point1x, point1y, point2x, point2y;
      if (pointsChanged.has(0)) {
        point1x = newPoints[0].get_component(0);
        point1y = newPoints[0].get_component(1);
      } else {
        point1x = this.state.points[0].get_component(0);
        point1y = this.state.points[0].get_component(1);
      }
      if (pointsChanged.has(1)) {
        point2x = newPoints[1].get_component(0);
        point2y = newPoints[1].get_component(1);
      } else {
        point2x = this.state.points[1].get_component(0);
        point2y = this.state.points[1].get_component(1);
      }

      let coeffvar1 = point1y.subtract(point2y).simplify();
      let coeffvar2 = point2x.subtract(point1x).simplify();
      let coeff0 = point1x.multiply(point2y).subtract(point1y.multiply(point2x)).simplify();

      if (this.state.definitionFrom === "coeffs") {
        newStateVariables.coeffvar1 = coeffvar1;
        newStateVariables.coeffvar2 = coeffvar2;
        newStateVariables.coeff0 = coeff0;
      } else {
        let equation = me.fromAst(['=', ['+', ['*', 'a', 'x'], ['*', 'b', 'y'], 'c'], 0]).substitute({
          a: coeffvar1, b: coeffvar2, c: coeff0, x: var1, y: var2
        }).simplify();

        if (this.state.equationChild !== undefined) {
          dependenciesToUpdate[this.state.equationChild.componentName] = { value: { changes: equation } };
        } else {
          newStateVariables.equation = { changes: equation };
        }
      }
    }


    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // add stateVariable to stateVariableChangesToSave if is essential
    // and no shadow sources were updated
    for (let varname in newStateVariables) {
      if (this._state[varname].essential === true &&
        !shadowedStateVariables.has(varname) && !isReplacement) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    return true;

  }

  nearestPoint({ x1, x2, x3 }) {

    // only implemented in 2D for now
    if (this.state.ndimensions !== 2) {
      return;
    }

    // only implement for constant coefficients
    let a = this.state.coeffvar1.evaluate_to_constant();
    let b = this.state.coeffvar2.evaluate_to_constant();
    let c = this.state.coeff0.evaluate_to_constant();

    if (!(Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c))) {
      return {};
    }

    let denom = a * a + b * b;

    if (denom === 0) {
      return {};
    }

    let result = {};
    result.x1 = (b * (b * x1 - a * x2) - a * c) / denom;
    result.x2 = (a * (-b * x1 + a * x2) - b * c) / denom;

    if (x3 !== undefined) {
      result.x3 = 0;
    }

    return result;

  }
}
