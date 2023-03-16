import { parser } from './doenet.js'

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
  function compileElement(cursor) {
    if (cursor.name !== "Element") {
      throw Error("compileElement() called on a non-Element");
    }
    cursor.firstChild();
    if (cursor.name === "OpenTag") {
      //skip the start tag node
      cursor.firstChild();
      cursor.nextSibling()
      let tagName = inText.substring(cursor.from, cursor.to);

      let tagOpenBegin = cursor.from;

      let attrs = {};
      while (cursor.nextSibling()) {

        //All of the siblings must b.name Attributes, but we're checking just in case the grammar changes
        if (cursor.name !== "Attribute") {
          let errorBegin = cursor.from;
          let errorEnd = cursor.to;
          // console.error(cursor);
          // console.error(showCursor(cursor));
          // console.error(cursor.name);
          // eslint-disable-next-line no-empty
          while (cursor.parent()) { }

          throw Error(`Invalid DoenetML at positions ${errorBegin} to ${errorEnd}. Error in opening <${tagName}> tag.  Found ${inText.slice(tagOpenBegin - 1, errorEnd)}`)
        }

        //Attributes always have exactly two children, an AttributeName and an Attribute Value
        //We scrape the content of both from the in string and add them to the attribute array here
        cursor.firstChild();
        let attrName = inText.substring(cursor.from, cursor.to);
        //skip the name and equals sign
        if (cursor.nextSibling() === false) {
          if (attrName in attrs) {
            throw Error(`Duplicate attribute ${attrName}.  Found in component of type ${tagName} at indices ${cursor.from}-${cursor.to}`)
          }
          attrs[attrName] = true;
        } else {
          cursor.nextSibling();
          //boundry fuddling to ignore the quotes
          let attrValue = inText.substring(cursor.from + 1, cursor.to - 1);

          if (attrName in attrs) {
            throw Error(`Duplicate attribute ${attrName}.  Found in component of type ${tagName} at indices ${cursor.from}-${cursor.to}`)
          }
          attrs[attrName] = attrValue;
        }
        //move out of Attribute to maintain loop invariant
        cursor.parent();
      }

      //get back to the level of OpenTag in order to parse tag body
      cursor.parent();

      let tagOpenEnd = cursor.to;

      let element = { componentType: tagName, props: { ...attrs }, children: [] }
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
            element.children.push(txt)
          }
        } else if (cursor.name === "Element") {
          element.children.push(compileElement(cursor.node.cursor))
        } else if (cursor.name === "CloseTag") {
          // Will always be the matching tag (and the last tag in the list)
          break;
        } else if (cursor.name === "Comment") {
          //ignore comments
          continue;
        } else if (cursor.name === "MismatchedCloseTag") {
          throw Error(`Invalid DoenetML at position ${cursor.from}. Mismatched closing tag.  Expected </${tagName}>.  Found ${inText.slice(cursor.from, cursor.to)}.`)
        } else {
          // console.log(`error is at position ${cursor.from}, ${cursor.to}`)
          // console.log(`error part: ${inText.slice(cursor.from, cursor.to)}`)
          // console.log(`Here is cursor: ${showCursor(cursor)}`)
          // There are a couple of other things in the entity non-terminal, but nothing of immediate importance
          throw Error(`Invalid DoenetML at position ${cursor.from}. Expected a closing </${tagName}> tag.  Instead found ${inText.slice(cursor.from, cursor.to)}.`)
        }
      }
      element.range = {
        openBegin: tagOpenBegin,
        openEnd: tagOpenEnd,
        closeBegin: cursor.from,
        closeEnd: cursor.to
      }
      return element;

    } else if (cursor.name === "SelfClosingTag") {
      cursor.firstChild();
      cursor.nextSibling();

      let tagName = inText.substring(cursor.from, cursor.to);

      let tagBegin = cursor.from;

      let attrs = {};
      while (cursor.nextSibling()) {
        //All of the siblings must be Attributes, but we're checking just in case the grammar changes
        if (cursor.name !== "Attribute") {
          throw Error(`Invalid DoenetML at positions ${cursor.from} to ${cursor.to}. Error in self-closing <${tagName}/> tag.`)
        }
        //Attributes always have exactly two children, an AttributeName and an Attribute Value
        //We scrape the content of both from the in string and add them to the attribute array here
        cursor.firstChild();
        let attrName = inText.substring(cursor.from, cursor.to);

        if (cursor.nextSibling() === false) {
          if (attrName in attrs) {
            throw Error(`Duplicate attribute ${attrName}.  Found in component of type ${tagName} at indices ${cursor.from}-${cursor.to}`)
          }
          attrs[attrName] = true;
        } else {
          cursor.nextSibling();
          if (attrName in attrs) {
            throw Error(`Duplicate attribute ${attrName}.  Found in component of type ${tagName} at indices ${cursor.from}-${cursor.to}`)
          }

          //fuddling to ignore the quotes
          let attrValue = inText.substring(cursor.from + 1, cursor.to - 1);
          attrs[attrName] = attrValue;
        }
        //move out of Attribute to maintain loop invariant
        cursor.parent();
      }

      let range = { selfCloseBegin: tagBegin, selfCloseEnd: cursor.to + 2 };

      // console.log(">>>toReturn", {componentType :  tagName, props : attrs, children : []});

      //I have no idea why attrs needs to be destructured
      // but if it isn't, it doesn't work ~50% of the time
      return { componentType: tagName, props: { ...attrs }, children: [], range };

    } else {
      //Unreachable case, see the grammar for why
      throw Error("Non SelfClosingTag/OpenTag in Element. How did you do that?");
    }
  }
  function compileTopLevel(tc) {
    if (tc.node.name === "Element") {
      return compileElement(tc.node.cursor);
    } else if (tc.node.name === "Comment") {
      //I miss result types
      return null;
    } else if (tc.node.name === "Text") {
      //TODO probably don't need to trim anymore?
      let txt = inText.substring(tc.node.from, tc.node.to);
      if (txt !== "") {
        return txt;
      }
    } else {
      throw Error(`Invalid DoenetML at positions ${tc.node.from} to ${tc.node.to}.  Found ${inText.substring(tc.node.from, tc.node.to)}`)
    }
  }
  if (!inText) {
    return [];
  }
  let tc = parse(inText);
  let out = [];
  if (!tc.firstChild()) {
    return out;
  }
  // console.log("intext",inText)
  // console.log("showCursor",showCursor(tc));

  let first = compileTopLevel(tc)
  if (first !== null && first !== undefined) {
    out.push(first);
  }
  while (tc.nextSibling()) {
    let next = compileTopLevel(tc);
    if (next !== null && next !== undefined) {
      out.push(next);
    }
  }
  return out;
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
  let str = node.name
  if (node.firstChild !== null) {
    str += "(" + showNode(node.firstChild) + ")"
  }
  if (node.nextSibling !== null) {
    str += "," + showNode(node.nextSibling)
  }
  return str

}
