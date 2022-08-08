import MathList from './MathList';
import { breakEmbeddedStringsIntoParensPieces } from './commonsugar/breakstrings';

export default class TupleList extends MathList {
  static componentType = "tupleList";
  static rendererType = "mathList";

  static includeBlankStringChildren = false;

  static returnSugarInstructions() {
    let sugarInstructions = [];

    let createTupleList = function ({ matchedChildren }) {

      let results = breakEmbeddedStringsIntoParensPieces({
        componentList: matchedChildren,
      });

      if (results.success !== true) {
        return { success: false }
      }

      return {
        success: true,
        newChildren: results.pieces.map(function (piece) {
          if (piece.length > 1 || typeof piece[0] === "string") {
            return {
              componentType: "math",
              children: piece
            }
          } else {
            return piece[0]
          }
        })
      }
    }

    sugarInstructions.push({
      replacementFunction: createTupleList
    });


    return sugarInstructions;

  }


}