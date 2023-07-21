import { parser } from "./doenet.js";

/**
 *  takes in a string an outputs a TreeCursor
 * @param {string} inText
 * @returns {TreeCursor}
 */
export function parse(inText) {
  return parser.parse(inText).cursor();
}
/**
 * parse string and output a convinent to use object.
 * ignores macros.
 * @param {string} inText
 */
export function parseAndCompile(inText) {
  let errors = [];
  let warnings = [];

  function compileElement(cursor) {
    if (cursor.name !== "Element") {
      throw Error("compileElement() called on a non-Element");
    }
    cursor.firstChild();
    if (cursor.name === "OpenTag") {
      //skip the start tag node
      cursor.firstChild();
      cursor.nextSibling();
      let tagName = inText.substring(cursor.from, cursor.to);
      let adjustedTagName = tagName;
      let adjustedRange = null;

      let tagOpenBegin = cursor.from;

      let message;

      let attrs = {};
      let attrRanges = {};
      while (cursor.nextSibling()) {
        //All of the siblings must b.name Attributes, but we're checking just in case the grammar changes
        if (cursor.name !== "Attribute") {
          // let errorBegin = cursor.from;
          let errorEnd = cursor.to;
          // console.error(cursor);
          // console.error(showCursor(cursor));
          // console.error(cursor.name);
          // eslint-disable-next-line no-empty
          // while (cursor.parent()) {}

          let textOfError = inText.slice(tagOpenBegin - 1, errorEnd).trimEnd();

          errorEnd = tagOpenBegin + textOfError.length - 1;

          message = `Invalid DoenetML. Error in opening <${tagName}> tag.  Found ${textOfError}`;

          errors.push({
            message,
            doenetMLrange: { begin: tagOpenBegin, end: errorEnd },
          });
          adjustedTagName = "_error";
          adjustedRange = { begin: tagOpenBegin, end: errorEnd };

          break;
        }

        //Attributes always have exactly two children, an AttributeName and an Attribute Value
        //We scrape the content of both from the in string and add them to the attribute array here
        cursor.firstChild();
        let attrName = inText.substring(cursor.from, cursor.to);
        let beginAttributeInd = cursor.from + 1;
        //skip the name and equals sign
        if (cursor.nextSibling() === false) {
          if (attrName in attrs) {
            message = `Duplicate attribute ${attrName}.`;
            errors.push({
              message,
              doenetMLrange: { begin: beginAttributeInd, end: cursor.to },
            });
            adjustedTagName = "_error";
          } else {
            attrs[attrName] = true;
          }
        } else {
          cursor.nextSibling();
          //boundry fuddling to ignore the quotes
          let attrValue = inText.substring(cursor.from + 1, cursor.to - 1);

          if (attrName in attrs) {
            message = `Duplicate attribute ${attrName}.`;
            errors.push({
              message,
              doenetMLrange: { begin: beginAttributeInd, end: cursor.to },
            });
            adjustedTagName = "_error";
          } else {
            attrs[attrName] = attrValue;
            attrRanges[attrName] = {
              begin: cursor.from + 2,
              end: cursor.to - 1,
            };
          }
        }
        //move out of Attribute to maintain loop invariant
        cursor.parent();
      }

      //get back to the level of OpenTag in order to parse tag body
      cursor.parent();

      let tagOpenEnd = cursor.to;

      let element = {
        componentType: adjustedTagName,
        props: {},
        children: [],
      };

      if (adjustedTagName === "_error") {
        element.state = { message };
      } else {
        element.props = { ...attrs };
        element.attributeRanges = { ...attrRanges };
      }

      // now we go through all of the other non-terminals in this row until we get to the closing tag,
      // adding the compiled version of each non-terminal to the children section of the object we're going to return
      // for the time being we're just going to handle 2 cases:
      // the text case, in which case we'll just push a string into the children,
      // and the element case, in which case we recurse

      //Corrosponds to the entity non-terminal in the grammar
      while (cursor.nextSibling()) {
        if (cursor.name === "Text") {
          let txt = inText.substring(cursor.from, cursor.to);
          if (txt !== "") {
            element.children.push(txt);
          }
        } else if (cursor.name === "Element") {
          element.children.push(compileElement(cursor.node.cursor));
        } else if (cursor.name === "CloseTag") {
          // Will always be the matching tag (and the last tag in the list)
          break;
        } else if (cursor.name === "Comment") {
          // return a comment that will be ignored,
          // but need it to calculate doenetMLrange
          // from any strings that follow it (needed in particular for macros)
          element.children.push({
            componentType: "_comment",
            state: { text: inText.substring(cursor.from, cursor.to) },
            doenetMLrange: {
              begin: cursor.from,
              end: cursor.to,
            },
          });
          //ignore comments
          continue;
        } else if (cursor.name === "MismatchedCloseTag") {
          let message = `Invalid DoenetML. Mismatched closing tag.  Expected </${tagName}>.  Found ${inText.slice(
            cursor.from,
            cursor.to,
          )}.`;
          errors.push({
            message,
            doenetMLrange: { begin: cursor.from, end: cursor.to },
          });

          if (adjustedRange) {
            element.doenetMLrange = { ...adjustedRange };
          } else {
            element.doenetMLrange = {
              openBegin: tagOpenBegin,
              openEnd: tagOpenEnd,
              closeBegin: cursor.from,
              closeEnd: cursor.to,
            };
          }
          element = {
            componentType: "_error",
            props: {},
            children: [element],
            state: { message },
          };
          break;
        } else if (cursor.name === "MissingCloseTag") {
          let message = `Invalid DoenetML.  Missing closing tag.  Expected </${tagName}>.`;
          errors.push({
            message,
            doenetMLrange: { begin: cursor.from, end: cursor.to },
          });

          if (adjustedRange) {
            element.doenetMLrange = { ...adjustedRange };
          } else {
            element.doenetMLrange = { begin: tagOpenBegin, end: cursor.to };
          }
          element = {
            componentType: "_error",
            props: {},
            children: [element],
            state: { message },
          };
          break;
        } else {
          // console.log(`error is at position ${cursor.from}, ${cursor.to}`)
          // console.log(`error part: ${inText.slice(cursor.from, cursor.to)}`)
          // console.log(`Here is cursor: ${showCursor(cursor)}`)
          // There are a couple of other things in the entity non-terminal, but nothing of immediate importance
          if (adjustedTagName !== "_error") {
            let message = `Invalid DoenetML.  Missing closing tag.  Expected </${tagName}>.`;
            errors.push({
              message,
              doenetMLrange: { begin: cursor.from, end: cursor.to },
            });

            if (adjustedRange) {
              element.doenetMLrange = { ...adjustedRange };
            } else {
              element.doenetMLrange = { begin: tagOpenBegin, end: cursor.to };
            }
            element = {
              componentType: "_error",
              props: {},
              children: [element],
              state: { message },
            };
            break;
          }
        }
      }
      if (adjustedRange) {
        element.doenetMLrange = adjustedRange;
      } else {
        element.doenetMLrange = {
          openBegin: tagOpenBegin,
          openEnd: tagOpenEnd,
          closeBegin: cursor.from,
          closeEnd: cursor.to,
        };
      }
      return element;
    } else if (cursor.name === "SelfClosingTag") {
      cursor.firstChild();
      cursor.nextSibling();

      let tagName = inText.substring(cursor.from, cursor.to);
      let adjustedTagName = tagName;

      let tagBegin = cursor.from;

      let message;

      let attrs = {};
      let attrRanges = {};
      while (cursor.nextSibling()) {
        //All of the siblings must be Attributes, but we're checking just in case the grammar changes
        if (cursor.name !== "Attribute") {
          // Note: not sure if can get to this condition.  Errors in self-closing tag
          // seem to prevent parser from recognizing that it is self-closing.
          let errorEnd = cursor.to;

          message = `Invalid DoenetML. Error in self-closing <${tagName}> tag.  Found ${inText.slice(
            tagBegin - 1,
            errorEnd,
          )}`;

          errors.push({
            message,
            doenetMLrange: { begin: tagBegin - 1, end: errorEnd },
          });
          adjustedTagName = "_error";

          break;
        }
        //Attributes always have exactly two children, an AttributeName and an Attribute Value
        //We scrape the content of both from the in string and add them to the attribute array here
        cursor.firstChild();
        let attrName = inText.substring(cursor.from, cursor.to);
        let beginAttributeInd = cursor.from + 1;

        if (cursor.nextSibling() === false) {
          if (attrName in attrs) {
            message = `Duplicate attribute ${attrName}.`;
            errors.push({
              message,
              doenetMLrange: { begin: beginAttributeInd, end: cursor.to },
            });
            adjustedTagName = "_error";
          } else {
            attrs[attrName] = true;
          }
        } else {
          cursor.nextSibling();
          if (attrName in attrs) {
            message = `Duplicate attribute ${attrName}.`;
            errors.push({
              message,
              doenetMLrange: { begin: beginAttributeInd, end: cursor.to },
            });
            adjustedTagName = "_error";
          } else {
            //fuddling to ignore the quotes
            let attrValue = inText.substring(cursor.from + 1, cursor.to - 1);
            attrs[attrName] = attrValue;
            attrRanges[attrName] = { begin: cursor.from + 1, end: cursor.to };
          }
        }
        //move out of Attribute to maintain loop invariant
        cursor.parent();
      }

      // Note: for some reason if the "/>" of a closing tag occurs at the beginning of a line,
      // (with only whitespace before it)
      // then cursor.to is shifted differently compared to other cases.
      // To compensate, we search for the location of the "/>"
      let selfCloseEnd = cursor.to;
      let match = inText.substring(cursor.to).match("/>");
      if (match) {
        selfCloseEnd += match.index + 2;
      }

      let doenetMLrange = {
        selfCloseBegin: tagBegin,
        selfCloseEnd,
      };

      // console.log(">>>toReturn", {componentType :  tagName, props : attrs, children : []});

      //I have no idea why attrs needs to be destructured
      // but if it isn't, it doesn't work ~50% of the time
      let element = {
        componentType: adjustedTagName,
        children: [],
        doenetMLrange,
      };
      if (adjustedTagName === "_error") {
        element.state = { message };
      } else {
        element.props = { ...attrs };
        element.attributeRanges = { ...attrRanges };
      }
      return element;
    } else {
      //Unreachable case, see the grammar for why
      throw Error(
        "Non SelfClosingTag/OpenTag in Element. How did you do that?",
      );
    }
  }
  function compileTopLevel(tc) {
    if (tc.node.name === "Element") {
      return compileElement(tc.node.cursor);
    } else if (tc.node.name === "Comment") {
      // return a comment that will be ignored,
      // but need it to calculate doenetMLrange
      // from any strings that follow it (needed in particular for macros)
      return {
        componentType: "_comment",
        state: { text: inText.substring(tc.from, tc.to) },
        doenetMLrange: {
          begin: tc.from,
          end: tc.to,
        },
      };
    } else if (tc.node.name === "Text") {
      //TODO probably don't need to trim anymore?
      let txt = inText.substring(tc.node.from, tc.node.to);
      if (txt !== "") {
        return txt;
      }
    } else {
      let message = `Invalid DoenetML.  Found ${inText.substring(
        tc.node.from,
        tc.node.to,
      )}`;
      errors.push({
        message,
        doenetMLrange: { begin: tc.node.from + 1, end: tc.node.to },
      });
      return {
        componentType: "_error",
        props: {},
        children: [],
        state: { message },
        doenetMLrange: { begin: tc.node.from + 1, end: tc.node.to },
      };
    }
  }
  if (!inText) {
    return { components: [], errors, warnings };
  }
  let tc = parse(inText);
  let out = [];
  if (!tc.firstChild()) {
    return { components: out, errors, warnings };
  }
  // console.log("intext",inText)
  // console.log("showCursor",showCursor(tc));

  let first = compileTopLevel(tc);
  if (first !== null && first !== undefined) {
    out.push(first);
  }
  while (tc.nextSibling()) {
    let next = compileTopLevel(tc);
    if (next !== null && next !== undefined) {
      out.push(next);
    }
  }

  return { components: out, errors, warnings };
}

/**
 * pretty-print the tree pointed to by a tree-cursor.
 * Intended for demonstration/debugging
 * @param {TreeCursor} cursor
 * @returns {string}
 */
export function showCursor(cursor) {
  return showNode(cursor.node);
}

export function showNode(node) {
  let str = node.name;
  if (node.firstChild !== null) {
    str += "(" + showNode(node.firstChild) + ")";
  }
  if (node.nextSibling !== null) {
    str += "," + showNode(node.nextSibling);
  }
  return str;
}
