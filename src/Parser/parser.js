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
    function compileElement(cursor){
        if(cursor.name != "Element"){
            console.error(">>> Doesn't really make sense to call this on a non-element, right?",node);
            throw Error();
        }

        cursor.firstChild();
        if (cursor.name == "OpenTag"){
            cursor.firstChild();
            let tagName = inText.substring(cursor.from,cursor.to);

            let attrs = [];
            while(cursor.nextSibling()){
                //All of the siblings must be Attributes, but we're checking just in case the grammar changes
                //Things that could be solved with sum/product types...
                if(cursor.name != "Attribute"){
                    console.error("how could this possibly not be an Attribute",cursor);
                    throw Error("Expected an Attribute in OpenTag");
                }
                //Attributes always have exactly two children, an AttributeName and an Attribute Value
                //We scrape the content of both from the in string and add them to the attribute array here
                cursor.firstChild();
                let attrName = inText.substring(cursor.from,cursor.to);
                cursor.nextSibling();
                //fuddling to ignore the quotes
                let attrValue = inText.substring(cursor.from+1,cursor.to-1);

                cursor.parent();

                let attr = {};
                attr[attrName] = attrValue;

                attrs.push(attr);

            }
            //get back to the level of OpenTag
            cursor.parent();

            let element = {tag : tagName, attributes : attrs, children : []}
            // now we go through all of the other non-terminals in this row until we get to the closing tag,
            // adding the compiled version of each non-terminal to the children section of the object we're going to return
            // for the time being we're just going to handle 2 cases:
            // the text case, in which case we'll just push a string into the children,
            // and the element case, in which case we recurse

            while(cursor.nextSibling()){
                if(cursor.name == "Text"){
                    element.children.push(inText.substring(cursor.from,cursor.to))
                } else if (cursor.name == "Element") {
                    element.children.push(compileElement(cursor.node.cursor))
                } else if (cursor.name == "CloseTag") {
                    //Will always be the matching tag
                    break;
                } else {
                    //TODO
                    console.error("Non text/element non-terminal not supported", cursor)
                    throw Error();
                }
            }
            return element;

        } else if (cursor.name == "SelfClosingTag"){
            cursor.firstChild();

            let attrs = [];
            while(cursor.nextSibling()){
                //All of the siblings must be Attributes, but we're checking just in case the grammar changes
                if(cursor.name != "Attribute"){
                    console.error("how could this possibly not be an Attribute",cursor);
                    throw Error("Expected an Attribute in OpenTag");
                }
                //Attributes always have exactly two children, an AttributeName and an Attribute Value
                //We scrape the content of both from the in string and add them to the attribute array here
                cursor.firstChild();
                let attrName = inText.substring(cursor.from,cursor.to);
                cursor.nextSibling();
                //fuddling to ignore the quotes
                let attrValue = inText.substring(cursor.from + 1,cursor.to - 1);

                cursor.parent();

                let attr = {};
                attr[attrName] = attrValue;

                attrs.push(attr);

            }

            return {tag : inText.substring(cursor.from,cursor.to), attributes : attrs, children : []};
            
        } else {
            //Unreachable case, see the grammar for why
            throw Error(">>>Huh?");
        }
    }
     
    let tc = parse(inText);
    let out = [];
    if(!tc.firstChild()){
        return out; 
    }
    // the way the parser is structured is that the first row of the tree is just going to be Elements
    // We traverse the first row, each compiled Element it all to an array, and return that
    // We create a new cursor for each element to avoid having to worry about cursor state between elements 
    // This should only create n many pointers for n elements, which is a very small amount of memory in the grand scheme here
    out.push(compileElement(tc.node.cursor))
    while(tc.nextSibling()){
        out.push(compileElement(tc.node.cursor));
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