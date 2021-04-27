import {parser} from './doenet.js'

/**
 *  takes in a string an outputs a TreeCursor
 * @param {string} inText 
 */
export function parse(inText) {
    return parser.parse(inText).cursor();
}

/**
 * parse string and output a convinent to use object. 
 * @param {string} inText
 */
//I think i'll just have to use substring to get the info I want out of the string...
//Because the parser gives to's and from's this is feasable if... kinda silly
export function parseAndCompile(inText){

    // Nested function so I don't need to pass inText in as an argument explicitly.
    // Mildly klduge-esq
    function compileElement(node){
        if(node.name != "Element"){
            console.error(">>>huh?",node);
            throw Error();
        }

        if (node.firstChild.name == "OpenTag"){

            let openTag = node.firstChild;

            //initially the tag name, but the siblings might be attributes
            let openTagParams = openTag.firstChild; 

            let tagName = inText.substring(openTagParams.from,openTagParams.to);

            if(openTagParams.nextSibling != null){
                //TODO handle attributes
            }
            let element = {tag : tagName, children : []}

            // now we go through all of the other non-terminals in this row until we get to the closing tag,
            // adding the compiled version of each non-terminal to the children section of the object we're going to return
            // for the time being we're just going to handle 2 cases:
            // the text case, in which case we'll just push a string into the children,
            // and the element case, in which case we recurse

            let openTagCursor = openTag.cursor;

            while(openTagCursor.nextSibling()){
                if(openTagCursor.name == "Text"){
                    element.children.push(inText.substring(openTagCursor.from,openTagCursor.to))
                } else if (openTagCursor.name == "Element") {
                    element.children.push(compileElement(openTagCursor.node))
                } else if (openTagCursor.name == "CloseTag") {
                    //Will always be the matching tag (I think...)
                    //also will the the last sibling, so this case doesn't (strictly speaking) need to do anything
                    break;
                } else {
                    console.error("Non text/element non-terminal not supported", openTagCursor)
                    throw Error();
                }
            }
            return element;

        } else if (node.firstChild.name == "SelfClosingTag"){
            let tagNameNode = node.firstChild.firstChild;
            return {tag : inText.substring(tagNameNode.from,tagNameNode.to), children : []};
            
        } else {
            throw Error(">>>Huh?");
        }
    }
     
    let tc = parser.parse(inText).cursor();
    let out = [];
    if(!tc.firstChild()){
        return out; 
    }
    // A kludge so I can use recusion
    // The proper way to do this will just traverse using the tree-cursor methods.
    // I don't think it will honestly be much more difficult, but we'll get there when we get there
    // the way the parser is structured is that the first row of the tree is just going to be Elements
    // We traverse the first row, each compiled Element it all to an array, and return that
    out.push(compileElement(tc.node))
    while(tc.nextSibling()){
        out.push(compileElement(tc.node));
    }
    return out;
}


export function showCursor(cursor){
    return showNode(cursor.node);
}

function showNode(node){
    let str = node.name
    if(node.firstChild != null){
        str+= "(" + showNode(node.firstChild) + ")"
    }
    if(node.nextSibling != null){
        str+= "," + showNode(node.nextSibling)
    }
    return str

}