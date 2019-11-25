import BaseComponent from './abstract/BaseComponent';
import me from 'math-expressions';
import checkEquality from '../utils/checkEquality';

var textToAstUnsplit = new me.converters.textToAstObj({ splitSymbols: false });

export default class IfComponent extends BaseComponent {
  static componentType = "if";

  static alwaysContinueUpstreamUpdates = true;

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.defaulttype = { default: "math" };
    properties.matchpartial = { default: false };
    properties.symbolicequality = { default: false };
    properties.allowederrorinnumbers = { default: 0 };
    properties.includeerrorinnumberexponents = { default: false };
    properties.allowederrorisabsolute = { default: false };
    properties.nsignerrorsmatched = { default: 0 };
    return properties;
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.deleteAllLogic();

    let atLeastZeroStrings = childLogic.newLeaf({
      name: "atLeastZeroStrings",
      componentType: 'string',
      comparison: 'atLeast',
      number: 0,
    });

    let atLeastZeroMaths = childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroMathLists = childLogic.newLeaf({
      name: "atLeastZeroMathLists",
      componentType: 'mathlist',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroTextlists = childLogic.newLeaf({
      name: "atLeastZeroTextlists",
      componentType: 'textlist',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroBooleans = childLogic.newLeaf({
      name: "atLeastZeroBooleans",
      componentType: "boolean",
      comparison: "atLeast",
      number: 0,
    });

    let atLeastZeroBooleanlists = childLogic.newLeaf({
      name: "atLeastZeroBooleanlists",
      componentType: 'booleanlist',
      comparison: 'atLeast',
      number: 0
    });

    childLogic.newOperator({
      name: "stringsMathsTextsAndBooleans",
      operator: "and",
      propositions: [
        atLeastZeroStrings,
        atLeastZeroMaths,
        atLeastZeroMathLists,
        atLeastZeroTexts,
        atLeastZeroTextlists,
        atLeastZeroBooleans,
        atLeastZeroBooleanlists,
      ],
      setAsBase: true
    })

    return childLogic;
  }

  updateState(args = {}) {
    if (args.init) {
      if (!(this._state.justSubmitted && this._state.justSubmitted.essential)) {
        this.state.justSubmitted = false;
      }
      this._state.justSubmitted.trackChanges = true;
      this._state.justSubmitted.essential = true;

    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      return;
    }

    if (this.unresolvedState.defaulttype) {
      return;
    }

    // override defaulttype from shared parameters
    if (this._state.defaulttype.usedDefault) {
      let defaultTypeChild = this.sharedParameters.defaultTypeChild;
      if (defaultTypeChild) {
        if (defaultTypeChild.unresolvedState.value) {
          this.unresolvedState.defaulttype = true;
          return;
        }
        this.state.defaulttype = defaultTypeChild.state.value;
      } else if (this.sharedParameters.defaultType) {
        this.state.defaulttype = this.sharedParameters.defaultType;
      }
      delete this.unresolvedState.defaultType;
      // delete usedDefault so logic isn't repeated
      delete this._state.defaulttype.usedDefault;
    }

    // override default matchpartial from shared parameters
    if (this._state.matchpartial.usedDefault) {
      let matchpartialChild = this.sharedParameters.matchpartialChild;
      if (matchpartialChild) {
        if (matchpartialChild.unresolvedState.value) {
          this.unresolvedState.matchpartial = true;
          return;
        }
        this.state.matchpartial = matchpartialChild.state.value;
      } else if (this.sharedParameters.matchpartial) {
        this.state.matchpartial = this.sharedParameters.matchpartial;
      }
      delete this.unresolvedState.matchpartial;
      // delete usedDefault so logic isn't repeated
      delete this._state.matchpartial.usedDefault;
    }


    // override default symbolicequality from shared parameters
    if (this._state.symbolicequality.usedDefault) {
      let symbolicequalityChild = this.sharedParameters.symbolicequalityChild;
      if (symbolicequalityChild) {
        if (symbolicequalityChild.unresolvedState.value) {
          this.unresolvedState.symbolicequality = true;
          return;
        }
        this.state.symbolicequality = symbolicequalityChild.state.value;
      } else if (this.sharedParameters.symbolicequality) {
        this.state.symbolicequality = this.sharedParameters.symbolicequality;
      }
      delete this.unresolvedState.symbolicequality;
      // delete usedDefault so logic isn't repeated
      delete this._state.symbolicequality.usedDefault;
    }


    // override default allowederrorinnumbers from shared parameters
    if (this._state.allowederrorinnumbers.usedDefault) {
      let allowederrorinnumbersChild = this.sharedParameters.allowederrorinnumbersChild;
      if (allowederrorinnumbersChild) {
        if (allowederrorinnumbersChild.unresolvedState.number) {
          this.unresolvedState.allowederrorinnumbers = true;
          return;
        }
        this.state.allowederrorinnumbers = allowederrorinnumbersChild.state.number;
      } else if (this.sharedParameters.allowederrorinnumbers) {
        this.state.allowederrorinnumbers = this.sharedParameters.allowederrorinnumbers;
      }
      delete this.unresolvedState.allowederrorinnumbers;
      // delete usedDefault so logic isn't repeated
      delete this._state.allowederrorinnumbers.usedDefault;
    }


    // override default includeerrorinnumberexponents from shared parameters
    if (this._state.includeerrorinnumberexponents.usedDefault) {
      let includeerrorinnumberexponentsChild = this.sharedParameters.includeerrorinnumberexponentsChild;
      if (includeerrorinnumberexponentsChild) {
        if (includeerrorinnumberexponentsChild.unresolvedState.value) {
          this.unresolvedState.includeerrorinnumberexponents = true;
          return;
        }
        this.state.includeerrorinnumberexponents = includeerrorinnumberexponentsChild.state.value;
      } else if (this.sharedParameters.includeerrorinnumberexponents) {
        this.state.includeerrorinnumberexponents = this.sharedParameters.includeerrorinnumberexponents;
      }
      delete this.unresolvedState.includeerrorinnumberexponents;
      // delete usedDefault so logic isn't repeated
      delete this._state.includeerrorinnumberexponents.usedDefault;
    }


    // override default allowederrorisabsolute from shared parameters
    if (this._state.allowederrorisabsolute.usedDefault) {
      let allowederrorisabsoluteChild = this.sharedParameters.allowederrorisabsoluteChild;
      if (allowederrorisabsoluteChild) {
        if (allowederrorisabsoluteChild.unresolvedState.value) {
          this.unresolvedState.allowederrorisabsolute = true;
          return;
        }
        this.state.allowederrorisabsolute = allowederrorisabsoluteChild.state.value;
      } else if (this.sharedParameters.allowederrorisabsolute) {
        this.state.allowederrorisabsolute = this.sharedParameters.allowederrorisabsolute;
      }
      delete this.unresolvedState.allowederrorisabsolute;
      // delete usedDefault so logic isn't repeated
      delete this._state.allowederrorisabsolute.usedDefault;
    }


    // override default nsignerrorsmatched from shared parameters
    if (this._state.nsignerrorsmatched.usedDefault) {
      let nsignerrorsmatchedChild = this.sharedParameters.nsignerrorsmatchedChild;
      if (nsignerrorsmatchedChild) {
        if (nsignerrorsmatchedChild.unresolvedState.number) {
          this.unresolvedState.nsignerrorsmatched = true;
          return;
        }
        this.state.nsignerrorsmatched = nsignerrorsmatchedChild.state.number;
      } else if (this.sharedParameters.nsignerrorsmatched) {
        this.state.nsignerrorsmatched = this.sharedParameters.nsignerrorsmatched;
      }
      delete this.unresolvedState.nsignerrorsmatched;
      // delete usedDefault so logic isn't repeated
      delete this._state.nsignerrorsmatched.usedDefault;
    }


    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {

      let stringsMathsTextsAndBooleans = this.childLogic.returnMatches("stringsMathsTextsAndBooleans");

      this.state.stringMathTextBooleanChildren = stringsMathsTextsAndBooleans.map(x => this.activeChildren[x]);
      this.buildParsedExpression();
    }

    let justSubmitted = true;
    if (args.sourceOfUpdate !== undefined) {
      justSubmitted = false;
      let instructionsForThisComponent = args.sourceOfUpdate.instructionsByComponent[this.componentName];
      if (instructionsForThisComponent !== undefined) {
        if (instructionsForThisComponent.variableUpdates.justSubmitted !== undefined) {
          justSubmitted = instructionsForThisComponent.variableUpdates.justSubmitted.changes;
        }
      } else if (Object.keys(args.sourceOfUpdate.instructionsByComponent).length === 1) {
        let val = Object.values(args.sourceOfUpdate.instructionsByComponent)[0];
        let variableUpdates = val.variableUpdates;
        if (Object.keys(variableUpdates).length === 1 && Object.keys(variableUpdates)[0] === "rendererValueAsSubmitted") {
          // if only change was changing renderedValueAsSubmitted on some component
          // the don't change this.state.justSubmitted
          // (which we accomplish by setting justSubmitted to true)
          justSubmitted = true;
        }
      }
    }

    if (!justSubmitted) {
      this.state.justSubmitted = false;
    }
  }


  buildParsedExpression() {

    let inputString = "";
    this.state.mathChildrenByCode = {};
    this.state.mathlistChildrenByCode = {};
    this.state.textChildrenByCode = {};
    this.state.textlistChildrenByCode = {};
    this.state.booleanChildrenByCode = {};
    this.state.booleanlistChildrenByCode = {};
    let subnum = 0;

    this.state.codePre = "comp";

    // make sure that codePre is not in any string piece
    let foundInString = false;
    do {
      foundInString = false;

      for (let child of this.state.stringMathTextBooleanChildren) {
        if (child.componentType === "string" &&
          child.state.value.includes(this.state.codePre) === true) {
          // found codePre in a string, so extend codePre and try again
          foundInString = true;
          this.state.codePre += "p";
          break;
        }
      }
    } while (foundInString);

    for (let child of this.state.stringMathTextBooleanChildren) {
      if (child.componentType === "string") {
        inputString += " " + child.state.value + " ";
      }
      else { // a math, mathlist, text, textlist, boolean, or booleanlist
        let code = this.state.codePre + subnum;

        // make sure code is surrounded by spaces
        // (the presence of numbers inside code will ensure that 
        // it is parsed as a multicharcter variable)
        inputString += " " + code + " ";

        if (child instanceof this.allComponentClasses.math) {
          this.state.mathChildrenByCode[code] = child;
        } else if (child instanceof this.allComponentClasses.mathlist) {
          this.state.mathlistChildrenByCode[code] = child;
        } else if (child instanceof this.allComponentClasses.text) {
          this.state.textChildrenByCode[code] = child;
        } else if (child instanceof this.allComponentClasses.textlist) {
          this.state.textlistChildrenByCode[code] = child;
        } else if (child instanceof this.allComponentClasses.boolean) {
          this.state.booleanChildrenByCode[code] = child;
        } else {
          this.state.booleanlistChildrenByCode[code] = child;
        }
        subnum += 1;

      }
    }

    try {
      this.state.parsedExpression = me.fromAst(textToAstUnsplit.convert(inputString));
    } catch (e) {
      this.state.parsedExpression = undefined;
    }

  }

  evaluateLogic() {

    // evaluate logic in parsedExpression and return fraction correct

    if (!this.state.stringMathTextBooleanChildren || this.state.stringMathTextBooleanChildren.length === 0) {
      // child logic not satisfied, unresolved state, or no children
      // return false
      return 0;
    }


    // can't proceed if some children have unresolved values
    if (this.state.stringMathTextBooleanChildren.some(x => x.unresolvedState.value)) {
      return 0;
    }

    let unorderedCompare = false;
    let simplifyOnCompare = "none";
    let expandOnCompare = false;

    for (let child of this.state.stringMathTextBooleanChildren) {

      // TODO: better determination if unorderedCompare should be used
      // For now, any unordered math elicits unorderedCompare
      if (child.state.unordered) {
        unorderedCompare = true;
      }
      if (child.state.expand) {
        expandOnCompare = true;
      }

      if (child.state.simplify === "full") {
        simplifyOnCompare = "full";
      } else if (child.state.simplify === "numbers") {
        if (simplifyOnCompare !== "full") {
          simplifyOnCompare = "numbers";
        }
      } else if (child.state.simplify === "numberspreserveorder") {
        if (simplifyOnCompare !== "full" && simplifyOnCompare !== "numbers") {
          simplifyOnCompare = "numberspreserveorder";
        }
      }

    }

    if (this.state.parsedExpression === undefined) {
      return 0;
    } else {
      return this.evaluateLogicSub({
        logicTree: this.state.parsedExpression.tree,
        unorderedCompare: unorderedCompare,
        simplifyOnCompare: simplifyOnCompare,
        expandOnCompare: expandOnCompare
      });
    }
  }


  evaluateLogicSub({ logicTree, unorderedCompare, simplifyOnCompare, expandOnCompare }) {

    let evaluateSub = x => this.evaluateLogicSub({
      logicTree: x,
      unorderedCompare: unorderedCompare,
      simplifyOnCompare: simplifyOnCompare,
      expandOnCompare: expandOnCompare
    });

    if (!Array.isArray(logicTree)) {
      // if don't have an array, then the only valid option is that the tree
      // is a single boolean component

      // TODO: should have a flag where one can set <if> to substitute math children at the beginning?
      // this would allow one to specify logic operators in the math
      // but it would prevent one from comparing expressions involving those operators

      if (typeof logicTree === "string") {
        let booleanChild = this.state.booleanChildrenByCode[logicTree];
        if (booleanChild) {
          return booleanChild.state.value ? 1 : 0;
        } else if (logicTree.toLowerCase() === "true") {
          return 1;
        } else if (logicTree.toLowerCase() === "false") {
          return 0;
        }
      }

      console.warn("Invalid format for <if>");
      return 0;
    }

    let operator = logicTree[0];
    let operands = logicTree.slice(1);

    if (operator === "not") {
      if (operands.length !== 1) {
        console.warn("Invalid format for <if>");
        return 0;
      }
      return evaluateSub(operands[0]) === 0 ? 1 : 0;
    }
    if (operator === 'and') {
      if (this.state.matchpartial) {
        return operands.reduce((a, c) => a + evaluateSub(c), 0) / operands.length;
      } else {
        return operands.every(x => evaluateSub(x) === 1) ? 1 : 0;
      }
    }
    if (operator === 'or') {
      if (this.state.matchpartial) {
        return operands.reduce((a, c) => Math.max(evaluateSub(c), a), 0);
      } else {
        return operands.some(x => evaluateSub(x) === 1) ? 1 : 0;
      }
    }

    // TODO: other set operations

    if (!(["=", "ne", "<", ">", "le", "ge", "lts", "gts", "in"].includes(operator))) {
      console.warn("Invalid format for <if>");
      return 0;
    }


    let foundMath = false;
    let foundText = false;
    let foundBoolean = false;

    operands.forEach(function (x) {
      if (typeof x === "string") {
        if (x in this.state.mathChildrenByCode || x in this.state.mathlistChildrenByCode) {
          foundMath = true;
        } else if (x in this.state.textChildrenByCode || x in this.state.textlistChildrenByCode) {
          foundText = true;
        } else if (x in this.state.booleanChildrenByCode || x in this.state.booleanlistChildrenByCode) {
          foundBoolean = true;
        }
      }
    }.bind(this));


    if (foundBoolean) {
      if (foundMath || foundText) {
        console.warn("Invalid format for <if>");
        return 0;
      }

      let foundInvalidIf = false;
      // every operand must be a boolean, booleanstring, or a string that is true or false
      operands = operands.map(function (x) {
        if (typeof x === "string") {
          let child = this.state.booleanChildrenByCode[x];
          if (child !== undefined) {
            return child.state.value;
          }
          child = this.state.booleanlistChildrenByCode[x];
          if (child !== undefined) {
            return child.state.booleans;
          }
          x = x.toLowerCase().trim();
          if (x === "true" || x === 't') {
            return true;
          }
          if (x === "false" || x === 'f') {
            return false;
          }
          console.warn("Invalid format for <if>");
          foundInvalidIf = true;
          return 0;
        }
        console.warn("Invalid format for <if>");
        foundInvalidIf = true;
        return 0;
      }.bind(this));

      if (foundInvalidIf) {
        return 0;
      }

      if (operator === "=") {
        let boolean1 = operands[0];
        if (this.state.matchpartial) {
          let results = operands.slice(1).map(x => checkEquality({
            object1: boolean1,
            object2: x,
            isUnordered: unorderedCompare,
            partialMatches: this.state.matchpartial,
          }));

          // return average of fraction_equal
          let sum = results.reduce((a, c) => a + c.fraction_equal, 0);
          return sum / results.length;
        } else {
          return operands.slice(1).every(x => checkEquality(
            {
              object1: boolean1,
              object2: x,
              isUnordered: unorderedCompare,
              partialMatches: this.state.matchpartial,
            }
          ).fraction_equal === 1) ? 1 : 0;
        }
      } else if (operator === "ne") {
        if (operands.length !== 2) {
          console.warn("Invalid format for <if>");
          return 0;
        }
        let fraction_equal = checkEquality(
          {
            object1: operands[0],
            object2: operands[1],
            isUnordered: unorderedCompare,
            partialMatches: this.state.matchpartial,
          }
        ).fraction_equal;

        return fraction_equal === 0 ? 1 : 0;

      } else {
        console.warn("Invalid format for <if>");
        return 0;
      }

    } else if (foundText) {
      if (foundMath) {
        console.warn("Invalid format for <if>");
        return 0;
      }

      let foundInvalidIf = false;

      let extractText = function (tree, recurse = false) {
        if (typeof tree === "string") {
          let child = this.state.textChildrenByCode[tree];
          if (child !== undefined) {
            return child.state.value.trim();
          }
          child = this.state.textlistChildrenByCode[tree];
          if (child !== undefined) {
            return child.state.texts.map(x => x.trim());
          }
          return tree.trim();
        }

        // multiple words would become multiplication
        if (!(recurse && Array.isArray(tree) && tree[0] === "*")) {
          console.warn("Invalid format for <if>");
          foundInvalidIf = true;
          return '';
        }

        return tree.slice(1).map(extractText).join(' ');
      }.bind(this);

      // every operand must be a text or string that is true or false
      operands = operands.map(x => extractText(x, true));


      if (foundInvalidIf) {
        return 0;
      }

      if (operator === "=") {
        let text1 = operands[0];
        if (this.state.matchpartial) {
          let results = operands.slice(1).map(x => checkEquality({
            object1: text1,
            object2: x,
            isUnordered: unorderedCompare,
            partialMatches: this.state.matchpartial,
          }));

          // return average of fraction_equal
          let sum = results.reduce((a, c) => a + c.fraction_equal, 0);
          return sum / results.length;
        } else {
          return operands.slice(1).every(x => checkEquality(
            {
              object1: text1,
              object2: x,
              isUnordered: unorderedCompare,
              partialMatches: this.state.matchpartial,
            }
          ).fraction_equal === 1) ? 1 : 0;
        }
      } else if (operator === "ne") {
        if (operands.length !== 2) {
          console.warn("Invalid format for <if>");
          return 0;
        }

        let fraction_equal = checkEquality(
          {
            object1: operands[0],
            object2: operands[1],
            isUnordered: unorderedCompare,
            partialMatches: this.state.matchpartial,
          }
        ).fraction_equal;

        return fraction_equal === 0 ? 1 : 0;

      } else {
        console.warn("Invalid format for <if>");
        return 0;
      }
    }

    // no boolean or text, just math, mathlist, and strings

    let strict;
    if (operator === "lts" || operator === "gts") {
      strict = operands[1].slice(1);
      operands = operands[0].slice(1);
    }

    // // all operands should be numbers or strings
    // if (!operands.every(x => typeof x === "number" || typeof x === "string" ||
    //   (Array.isArray(x) && x[0] === "-" && typeof x[1] === "number"))) {
    //   throw Error("Invalid format for <if>");
    // }


    let replaceMath = function (tree) {
      if (typeof tree === "string") {
        let child = this.state.mathChildrenByCode[tree];
        if (child !== undefined) {
          return child.state.value.tree;
        }
        child = this.state.mathlistChildrenByCode[tree];
        if (child !== undefined) {
          return ["list", ...child.state.maths.map(x => x.tree)];
        }
        return tree;
      }
      if (!Array.isArray(tree)) {
        return tree;
      }

      return [tree[0], ...tree.slice(1).map(replaceMath)]

    }.bind(this);

    operands = operands.map(function (x) {
      return me.fromAst(replaceMath(x));
    });

    if (operator === "=") {
      let expr = operands[0];
      if (this.state.matchpartial) {
        let results = operands.slice(1).map(x => checkEquality({
          object1: expr,
          object2: x,
          isUnordered: unorderedCompare,
          partialMatches: this.state.matchpartial,
          symbolicEquality: this.state.symbolicequality,
          simplify: simplifyOnCompare,
          expand: expandOnCompare,
          allowederrorinnumbers: this.state.allowederrorinnumbers,
          includeerrorinnumberexponents: this.state.includeerrorinnumberexponents,
          allowederrorisabsolute: this.state.allowederrorisabsolute,
          nsignerrorsmatched: this.state.nsignerrorsmatched,
        }));

        // return average of fraction_equal
        let sum = results.reduce((a, c) => a + c.fraction_equal, 0);
        return sum / results.length;
      } else {
        return operands.slice(1).every(x => checkEquality(
          {
            object1: expr,
            object2: x,
            isUnordered: unorderedCompare,
            partialMatches: this.state.matchpartial,
            symbolicEquality: this.state.symbolicequality,
            simplify: simplifyOnCompare,
            expand: expandOnCompare,
            allowederrorinnumbers: this.state.allowederrorinnumbers,
            includeerrorinnumberexponents: this.state.includeerrorinnumberexponents,
            allowederrorisabsolute: this.state.allowederrorisabsolute,
            nsignerrorsmatched: this.state.nsignerrorsmatched,
          }
        ).fraction_equal === 1) ? 1 : 0;
      }
    }
    if (operator === "ne") {

      let fraction_equal = checkEquality(
        {
          object1: operands[0],
          object2: operands[1],
          isUnordered: unorderedCompare,
          partialMatches: this.state.matchpartial,
          symbolicEquality: this.state.symbolicequality,
          simplify: simplifyOnCompare,
          expand: expandOnCompare,
          allowederrorinnumbers: this.state.allowederrorinnumbers,
          includeerrorinnumberexponents: this.state.includeerrorinnumberexponents,
          allowederrorisabsolute: this.state.allowederrorisabsolute,
          nsignerrorsmatched: this.state.nsignerrorsmatched,
        }
      ).fraction_equal;

      return fraction_equal === 0 ? 1 : 0;
    }

    if (operator === "in") {

      let element = operands[0];
      let set = operands[1];
      let set_tree = set.tree;
      if (!(Array.isArray(set_tree) && set_tree[0] === "set")) {
        console.warn("Invalid format for <if>");
        return 0;
      }

      if (this.state.matchpartial) {
        let results = operands.slice(1).map(x => checkEquality({
          object1: element,
          object2: me.fromAst(x),
          isUnordered: unorderedCompare,
          partialMatches: this.state.matchpartial,
          symbolicEquality: this.state.symbolicequality,
          simplify: simplifyOnCompare,
          expand: expandOnCompare,
          allowederrorinnumbers: this.state.allowederrorinnumbers,
          includeerrorinnumberexponents: this.state.includeerrorinnumberexponents,
          allowederrorisabsolute: this.state.allowederrorisabsolute,
          nsignerrorsmatched: this.state.nsignerrorsmatched,
        }));

        let max_fraction = results.reduce((a, c) => Math.max(a, c.fraction_equal), 0);

        return max_fraction;

      } else {

        return set_tree.slice(1).some(x => checkEquality(
          {
            object1: element,
            object2: me.fromAst(x),
            isUnordered: unorderedCompare,
            partialMatches: this.state.matchpartial,
            symbolicEquality: this.state.symbolicequality,
            simplify: simplifyOnCompare,
            expand: expandOnCompare,
            allowederrorinnumbers: this.state.allowederrorinnumbers,
            includeerrorinnumberexponents: this.state.includeerrorinnumberexponents,
            allowederrorisabsolute: this.state.allowederrorisabsolute,
            nsignerrorsmatched: this.state.nsignerrorsmatched,
          }
        ).fraction_equal === 1) ? 1 : 0;
      }
    }


    // since have inequality, all operands must be numbers
    operands = operands.map(x => x.simplify().evaluate_to_constant());
    if (operands.some(x => (x === null || Number.isNaN(x)))) {
      return 0;
    }

    // at this point, all operands are numbers, Infinity, or -Infinity

    if (operator === "<") {
      return operands[0] < operands[1] ? 1 : 0;
    } else if (operator === ">") {
      return operands[0] > operands[1] ? 1 : 0;
    } else if (operator === "le") {
      return operands[0] <= operands[1] ? 1 : 0;
    } else if (operator === "ge") {
      return operands[0] >= operands[1] ? 1 : 0;
    }

    // have lts or gts
    for (let ind = 0; ind < strict.length; ind++) {
      if (operator === "lts") {
        if (strict[ind] === true) {
          if (!(operands[ind] < operands[ind + 1])) {
            return 0;
          }
        } else {
          if (!(operands[ind] <= operands[ind + 1])) {
            return 0;
          }
        }
      } else {
        if (strict[ind] === true) {
          if (!(operands[ind] > operands[ind + 1])) {
            return 0;
          }
        } else {
          if (!(operands[ind] >= operands[ind + 1])) {
            return 0;
          }
        }
      }
    }
    // all inequalities satisfied
    return 1;

  }

  allowDownstreamUpdates(status) {
    // allow only initial change, which would be setting the justSubmitted flag
    return (status.initialChange === true);
  }


  get variablesUpdatableDownstream() {
    // only allowed to change these state variables
    return ["justSubmitted"];
  }


  calculateDownstreamChanges({
    stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate
  }) {

    let shadowedResult = this.updateShadowSources({
      newStateVariables: stateVariablesToUpdate,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;

    // if didn't update a downstream referenceShadow then we're at the bottom
    // and we need to give core instructions to update its state variables explicitly
    // if the the update is successful
    if (shadowedStateVariables.size === 0) {
      Object.assign(stateVariableChangesToSave, stateVariablesToUpdate);
    }

    return true;

  }


}
