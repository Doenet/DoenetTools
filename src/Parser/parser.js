import {parser} from './doenet.js'

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
export function parseAndCompile(inText){
    function compileElement(cursor){
        if(cursor.name !== "Element"){
            throw Error("compileElement() called on a non-Element");
        }
        cursor.firstChild();

        if (cursor.name === "OpenTag"){
            //skip the start tag node
            cursor.firstChild();
            cursor.nextSibling()
            let tagName = inText.substring(cursor.from,cursor.to);

            let attrs = {};
            while(cursor.nextSibling()){

                //All of the siblings must b.name Attributes, but we're checking just in case the grammar changes
                if(cursor.name !== "Attribute"){
                    console.error(cursor);
                    console.error(cursor.name);
                    // eslint-disable-next-line no-empty
                    while(cursor.parent()){}
                    throw Error("Expected an Attribute in OpenTag, got ", cursor);
                }

                //Attributes always have exactly two children, an AttributeName and an Attribute Value
                //We scrape the content of both from the in string and add them to the attribute array here
                cursor.firstChild();
                let attrName = inText.substring(cursor.from,cursor.to);
                //skip the name and equals sign
                if(cursor.nextSibling() === false){
                    attrs[attrName] = true;
                } else {
                    cursor.nextSibling();
                    //boundry fuddling to ignore the quotes
                    let attrValue = inText.substring(cursor.from+1,cursor.to-1);

                    attrs[attrName] = attrValue;
                }
                //move out of Attribute to maintain loop invariant
                cursor.parent();
            }

            //get back to the level of OpenTag in order to parse tag body
            cursor.parent();

            let element = {componentType : tagName, props : {...attrs}, children : []}
            // now we go through all of the other non-terminals in this row until we get to the closing tag,
            // adding the compiled version of each non-terminal to the children section of the object we're going to return
            // for the time being we're just going to handle 2 cases:
            // the text case, in which case we'll just push a string into the children,
            // and the element case, in which case we recurse

            //Corrosponds to the entity non-terminal in the grammar
            while(cursor.nextSibling()){
                if(cursor.name === "Text"){
                    let txt = inText.substring(cursor.from,cursor.to);
                    if(txt !== ""){
                        element.children.push(txt)
                    }
                } else if (cursor.name === "Element") {
                    element.children.push(compileElement(cursor.node.cursor))
                } else if (cursor.name === "CloseTag") {
                    // Will always be the matching tag (and the last tag in the list)
                    break;
                } else if (cursor.name === "Macro"){
                    //add the macro to the children, ignoring the dollar sign in the name.
                    element.children.push(inText.substring(cursor.from,cursor.to))
                    // element.children.push({componentType: "macro", macroName : inText.substring(cursor.from+1,cursor.to)});
                } else if (cursor.name === "Comment") {
                    //ignore comments
                    continue;
                } else {
                    // There are a couple of other things in the entity non-terminal, but nothing of immediate importance
                    throw Error("Non text/element non-terminal not supported as child of compile Element");
                }
            }
            return element;

        } else if (cursor.name === "SelfClosingTag"){
            cursor.firstChild();
            cursor.nextSibling();

            let tagName = inText.substring(cursor.from,cursor.to);

            let attrs = {};
            while(cursor.nextSibling()){
                //All of the siblings must be Attributes, but we're checking just in case the grammar changes
                if(cursor.name !== "Attribute"){
                    throw Error("Expected an Attribute in SelfClosingTag");
                }
                //Attributes always have exactly two children, an AttributeName and an Attribute Value
                //We scrape the content of both from the in string and add them to the attribute array here
                cursor.firstChild();
                let attrName = inText.substring(cursor.from,cursor.to);
                
                if(cursor.nextSibling() === false){
                    attrs[attrName] = true;
                } else {
                    cursor.nextSibling();
                    //fuddling to ignore the quotes
                    let attrValue = inText.substring(cursor.from + 1,cursor.to - 1);

                    attrs[attrName] = attrValue;
                }
                //move out of Attribute to maintain loop invariant
                cursor.parent();
            }

            // console.log(">>>toReturn", {componentType :  tagName, props : attrs, children : []});

            //I have no idea why attrs needs to be destructured
            // but if it isn't, it doesn't work ~50% of the time
            return {componentType :  tagName, props : {...attrs}, children : []};

        } else {
            //Unreachable case, see the grammar for why
            throw Error("Non SelfClosingTag/OpenTag in Element. How did you do that?");
        }
    }
    function compileTopLevel(tc){
        if(tc.node.name === "Element"){
            return compileElement(tc.node.cursor);
        } else if (tc.node.name === "Comment") {
            return null;
        } else if (tc.node.name === "Macro") {
            return inText.substring(tc.from,tc.to)
        } else if(tc.node.name === "Text"){
            //TODO probably don't need to trim anymore?
            let txt = inText.substring(tc.node.from,tc.node.to);
            if(txt !== ""){
                return txt;
            }
        } else {
            return null;
        }
    }
    let tc = parse(inText);
    let out = [];
    if(!tc.firstChild()){
        return out;
    }
    console.log("intext",inText)
    console.log("showCursor",showCursor(tc));

    out.push(compileTopLevel(tc));
    while(tc.nextSibling()){
        let next = compileTopLevel(tc);
        if(next !== null || next !== undefined){
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
export function showCursor(cursor){
    return showNode(cursor.node);
}

export function showNode(node){
    let str = node.name
    if(node.firstChild !== null){
        str+= "(" + showNode(node.firstChild) + ")"
    }
    if(node.nextSibling !== null){
        str+= "," + showNode(node.nextSibling)
    }
    return str

}
