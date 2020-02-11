import BaseComponent from './abstract/BaseComponent';
import me from 'math-expressions';
import checkEquality from '../utils/checkEquality';

var textToAstUnsplit = new me.converters.textToAstObj({ splitSymbols: false });

export default class IfComponent extends BaseComponent {
  static componentType = "if";

  static alwaysContinueUpstreamUpdates = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    // properties.defaultType = { default: "math" };
    properties.matchPartial = { default: false };
    properties.symbolicEquality = { default: false };
    properties.expandOnCompare = { default: false, propagateToDescendants: true };
    properties.simplifyOnCompare = {
      default: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", "true": "full" },
      validValues: ["none", "full", "numbers", "numbersepreserveorder"],
      propagateToDescendants: true,
    };
    properties.unorderedCompare = { default: false, propagateToDescendants: true };
    properties.allowedErrorInNumbers = { default: 0 };
    properties.includeErrorInNumberExponents = { default: false };
    properties.allowedErrorIsAbsolute = { default: false };
    properties.nSignErrorsMatched = { default: 0 };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

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


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.parsedExpression = {
      additionalStateVariablesDefined: [
        "mathChildrenByCode", "mathlistChildrenByCode",
        "textChildrenByCode", "textlistChildrenByCode",
        "booleanChildrenByCode", "booleanlistChildrenByCode",
        "codePre"
      ],
      returnDependencies: () => ({
        stringMathTextBooleanChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsMathsTextsAndBooleans",
          variableNames: ["value",],
        },
      }),
      definition: buildParsedExpression
    };


    stateVariableDefinitions.conditionSatisfied = {
      additionalStateVariablesDefined: [
        "fractionSatisfied",
      ],
      returnDependencies: () => ({
        matchPartial: {
          dependencyType: "stateVariable",
          variableName: "matchPartial",
        },
        symbolicEquality: {
          dependencyType: "stateVariable",
          variableName: "symbolicEquality",
        },
        expandOnCompare: {
          dependencyType: "stateVariable",
          variableName: "expandOnCompare",
        },
        simplifyOnCompare: {
          dependencyType: "stateVariable",
          variableName: "simplifyOnCompare",
        },
        unorderedCompare: {
          dependencyType: "stateVariable",
          variableName: "unorderedCompare",
        },
        allowedErrorInNumbers: {
          dependencyType: "stateVariable",
          variableName: "allowedErrorInNumbers",
        },
        includeErrorInNumberExponents: {
          dependencyType: "stateVariable",
          variableName: "includeErrorInNumberExponents",
        },
        allowedErrorIsAbsolute: {
          dependencyType: "stateVariable",
          variableName: "allowedErrorIsAbsolute",
        },
        nSignErrorsMatched: {
          dependencyType: "stateVariable",
          variableName: "nSignErrorsMatched",
        },
        parsedExpression: {
          dependencyType: "stateVariable",
          variableName: "parsedExpression",
        },
        stringMathTextBooleanChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsMathsTextsAndBooleans",
          variableNames: ["value",],
        },
        mathChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMaths",
          variableNames: ["value", "unordered", "expand", "simplify"]
        },
        booleanChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "booleanChildrenByCode",
        },
        booleanlistChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "booleanlistChildrenByCode",
        },
        textChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "textChildrenByCode",
        },
        textlistChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "textlistChildrenByCode",
        },
        mathChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "mathChildrenByCode",
        },
        mathlistChildrenByCode: {
          dependencyType: "stateVariable",
          variableName: "mathlistChildrenByCode",
        },
      }),
      definition: evaluateLogic
    };


    return stateVariableDefinitions;
  }

}


function buildParsedExpression({ dependencyValues, componentInfoObjects }) {

  let inputString = "";
  let mathChildrenByCode = {};
  let mathlistChildrenByCode = {};
  let textChildrenByCode = {};
  let textlistChildrenByCode = {};
  let booleanChildrenByCode = {};
  let booleanlistChildrenByCode = {};
  let subnum = 0;

  let codePre = "comp";

  // make sure that codePre is not in any string piece
  let foundInString = false;
  do {
    foundInString = false;

    for (let child of dependencyValues.stringMathTextBooleanChildren) {
      if (child.componentType === "string" &&
        child.stateValues.value.includes(codePre) === true) {
        // found codePre in a string, so extend codePre and try again
        foundInString = true;
        codePre += "p";
        break;
      }
    }
  } while (foundInString);

  for (let child of dependencyValues.stringMathTextBooleanChildren) {
    if (child.componentType === "string") {
      inputString += " " + child.stateValues.value + " ";
    }
    else { // a math, mathlist, text, textlist, boolean, or booleanlist
      let code = codePre + subnum;

      // make sure code is surrounded by spaces
      // (the presence of numbers inside code will ensure that 
      // it is parsed as a multicharcter variable)
      inputString += " " + code + " ";

      let childClass = componentInfoObjects.allComponentClasses[child.componentType]

      if (child.componentType === "math" ||
        componentInfoObjects.allComponentClasses.math.isPrototypeOf(childClass)
      ) {
        mathChildrenByCode[code] = child;
      } else if (child.componentType === "mathlist" ||
        componentInfoObjects.allComponentClasses.mathlist.isPrototypeOf(childClass)
      ) {
        mathlistChildrenByCode[code] = child;
      } else if (child.componentType === "text" ||
        componentInfoObjects.allComponentClasses.text.isPrototypeOf(childClass)
      ) {
        textChildrenByCode[code] = child;
      } else if (child.componentType === "textlist" ||
        componentInfoObjects.allComponentClasses.textlist.isPrototypeOf(childClass)
      ) {
        textlistChildrenByCode[code] = child;
      } else if (child.componentType === "boolean" ||
        componentInfoObjects.allComponentClasses.boolean.isPrototypeOf(childClass)
      ) {
        booleanChildrenByCode[code] = child;
      } else {
        booleanlistChildrenByCode[code] = child;
      }
      subnum += 1;

    }
  }

  let parsedExpression = null;

  try {
    parsedExpression = me.fromAst(textToAstUnsplit.convert(inputString));
  } catch (e) {
  }

  return {
    newValues: {
      mathChildrenByCode, mathlistChildrenByCode,
      textChildrenByCode, textlistChildrenByCode,
      booleanChildrenByCode, booleanlistChildrenByCode,
      codePre, parsedExpression
    }
  }

}


function evaluateLogic({ dependencyValues, usedDefault }) {

  // evaluate logic in parsedExpression and return fraction correct

  if (dependencyValues.parsedExpression === undefined) {
    // if don't have parsed expression
    // (which could occur if have no children or if have invalid form)
    // return false
    return {
      newValues: {
        conditionSatisfied: false,
        fractionSatisfied: 0,
      }
    }
  }


  let unorderedCompare = dependencyValues.unorderedCompare;
  let simplifyOnCompare = dependencyValues.simplifyOnCompare;
  let expandOnCompare = dependencyValues.expandOnCompare;

  let canOverrideUnorderedCompare = usedDefault.unorderedCompare;
  let canOverrideSimplifyOnCompare = usedDefault.simplifyOnCompare;
  let canOverrideExpandOnCompare = usedDefault.expandOnCompare;

  // if compare attributes haven't been explicitly prescribed by <if>
  // or one of its ancestors
  // then any of the attributes can be turned on if there is a math
  // child with the comparable property

  for (let child of dependencyValues.mathChildren) {

    if (canOverrideUnorderedCompare && child.stateValues.unordered) {
      unorderedCompare = true;
    }

    if (canOverrideExpandOnCompare && child.stateValues.expand) {
      expandOnCompare = true;
    }

    if (canOverrideSimplifyOnCompare) {
      if (child.stateValues.simplify === "full") {
        simplifyOnCompare = "full";
      } else if (child.stateValues.simplify === "numbers") {
        if (simplifyOnCompare !== "full") {
          simplifyOnCompare = "numbers";
        }
      } else if (child.stateValues.simplify === "numberspreserveorder") {
        if (simplifyOnCompare !== "full" && simplifyOnCompare !== "numbers") {
          simplifyOnCompare = "numberspreserveorder";
        }
      }
    }

  }

  let fractionSatisfied = evaluateLogicSub({
    logicTree: dependencyValues.parsedExpression.tree,
    unorderedCompare: unorderedCompare,
    simplifyOnCompare: simplifyOnCompare,
    expandOnCompare: expandOnCompare,
    dependencyValues,
  });

  let conditionSatisfied = fractionSatisfied === 1;

  return {
    newValues: { fractionSatisfied, conditionSatisfied }
  }

}


function evaluateLogicSub({ logicTree, unorderedCompare, simplifyOnCompare, expandOnCompare, dependencyValues }) {

  let evaluateSub = x => evaluateLogicSub({
    logicTree: x,
    unorderedCompare, simplifyOnCompare,
    expandOnCompare, dependencyValues,

  });

  if (!Array.isArray(logicTree)) {
    // if don't have an array, then the only valid option is that the tree
    // is a single boolean component

    // TODO: should have a flag where one can set <if> to substitute math children at the beginning?
    // this would allow one to specify logic operators in the math
    // but it would prevent one from comparing expressions involving those operators

    if (typeof logicTree === "string") {
      let booleanChild = dependencyValues.booleanChildrenByCode[logicTree];
      if (booleanChild) {
        return booleanChild.stateValues.value ? 1 : 0;
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
    if (dependencyValues.matchPartial) {
      return operands.reduce((a, c) => a + evaluateSub(c), 0) / operands.length;
    } else {
      return operands.every(x => evaluateSub(x) === 1) ? 1 : 0;
    }
  }
  if (operator === 'or') {
    if (dependencyValues.matchPartial) {
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
      if (x in dependencyValues.mathChildrenByCode || x in dependencyValues.mathlistChildrenByCode) {
        foundMath = true;
      } else if (x in dependencyValues.textChildrenByCode || x in dependencyValues.textlistChildrenByCode) {
        foundText = true;
      } else if (x in dependencyValues.booleanChildrenByCode || x in dependencyValues.booleanlistChildrenByCode) {
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
        let child = dependencyValues.booleanChildrenByCode[x];
        if (child !== undefined) {
          return child.stateValues.value;
        }
        child = dependencyValues.booleanlistChildrenByCode[x];
        if (child !== undefined) {
          return child.stateValues.booleans;
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
      if (dependencyValues.matchPartial) {
        let results = operands.slice(1).map(x => checkEquality({
          object1: boolean1,
          object2: x,
          isUnordered: unorderedCompare,
          partialMatches: dependencyValues.matchPartial,
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
            partialMatches: dependencyValues.matchPartial,
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
          partialMatches: dependencyValues.matchPartial,
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
        let child = dependencyValues.textChildrenByCode[tree];
        if (child !== undefined) {
          return child.stateValues.value.trim();
        }
        child = dependencyValues.textlistChildrenByCode[tree];
        if (child !== undefined) {
          return child.stateValues.texts.map(x => x.trim());
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
      if (dependencyValues.matchPartial) {
        let results = operands.slice(1).map(x => checkEquality({
          object1: text1,
          object2: x,
          isUnordered: unorderedCompare,
          partialMatches: dependencyValues.matchPartial,
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
            partialMatches: dependencyValues.matchPartial,
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
          partialMatches: dependencyValues.matchPartial,
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
      let child = dependencyValues.mathChildrenByCode[tree];
      if (child !== undefined) {
        return child.stateValues.value.tree;
      }
      child = dependencyValues.mathlistChildrenByCode[tree];
      if (child !== undefined) {
        return ["list", ...child.stateValues.maths.map(x => x.tree)];
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
    if (dependencyValues.matchPartial) {
      let results = operands.slice(1).map(x => checkEquality({
        object1: expr,
        object2: x,
        isUnordered: unorderedCompare,
        partialMatches: dependencyValues.matchPartial,
        symbolicEquality: dependencyValues.symbolicEquality,
        simplify: simplifyOnCompare,
        expand: expandOnCompare,
        allowedErrorInNumbers: dependencyValues.allowedErrorInNumbers,
        includeErrorInNumberExponents: dependencyValues.includeErrorInNumberExponents,
        allowedErrorIsAbsolute: dependencyValues.allowedErrorIsAbsolute,
        nSignErrorsMatched: dependencyValues.nSignErrorsMatched,
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
          partialMatches: dependencyValues.matchPartial,
          symbolicEquality: dependencyValues.symbolicEquality,
          simplify: simplifyOnCompare,
          expand: expandOnCompare,
          allowedErrorInNumbers: dependencyValues.allowedErrorInNumbers,
          includeErrorInNumberExponents: dependencyValues.includeErrorInNumberExponents,
          allowedErrorIsAbsolute: dependencyValues.allowedErrorIsAbsolute,
          nSignErrorsMatched: dependencyValues.nSignErrorsMatched,
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
        partialMatches: dependencyValues.matchPartial,
        symbolicEquality: dependencyValues.symbolicEquality,
        simplify: simplifyOnCompare,
        expand: expandOnCompare,
        allowedErrorInNumbers: dependencyValues.allowedErrorInNumbers,
        includeErrorInNumberExponents: dependencyValues.includeErrorInNumberExponents,
        allowedErrorIsAbsolute: dependencyValues.allowedErrorIsAbsolute,
        nSignErrorsMatched: dependencyValues.nSignErrorsMatched,
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

    if (dependencyValues.matchPartial) {
      let results = operands.slice(1).map(x => checkEquality({
        object1: element,
        object2: me.fromAst(x),
        isUnordered: unorderedCompare,
        partialMatches: dependencyValues.matchPartial,
        symbolicEquality: dependencyValues.symbolicEquality,
        simplify: simplifyOnCompare,
        expand: expandOnCompare,
        allowedErrorInNumbers: dependencyValues.allowedErrorInNumbers,
        includeErrorInNumberExponents: dependencyValues.includeErrorInNumberExponents,
        allowedErrorIsAbsolute: dependencyValues.allowedErrorIsAbsolute,
        nSignErrorsMatched: dependencyValues.nSignErrorsMatched,
      }));

      let max_fraction = results.reduce((a, c) => Math.max(a, c.fraction_equal), 0);

      return max_fraction;

    } else {

      return set_tree.slice(1).some(x => checkEquality(
        {
          object1: element,
          object2: me.fromAst(x),
          isUnordered: unorderedCompare,
          partialMatches: dependencyValues.matchPartial,
          symbolicEquality: dependencyValues.symbolicEquality,
          simplify: simplifyOnCompare,
          expand: expandOnCompare,
          allowedErrorInNumbers: dependencyValues.allowedErrorInNumbers,
          includeErrorInNumberExponents: dependencyValues.includeErrorInNumberExponents,
          allowedErrorIsAbsolute: dependencyValues.allowedErrorIsAbsolute,
          nSignErrorsMatched: dependencyValues.nSignErrorsMatched,
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
