import {parser} from './doenet.js'
import {foldNodeProp, foldInside, indentNodeProp} from "@codemirror/language"
import {styleTags, tags as t} from "@codemirror/highlight"
import {indentLess} from "@codemirror/commands"

//A global that keeps the set of tags that need to still be closed (such that closing them decreases the indent)
let tagsToBeClosed = [];
//tags that are not indented
const noIndentTags = ["p"];


/**
 * parser that adds metadata on top of the basic parse for text editor integration
 */
let parserWithMetadata = ( view ) => parser.configure({
    props : [
        styleTags({
            Comment: t.comment,
            AttributeName: t.propertyName,
            AttributeValue: t.string,
            MismatchedCloseTag: t.invalid,
            "( )": t.paren
        }),
        indentNodeProp.add({
            OpenTag: context => {
                const tagNameNode = context.node.firstChild;
                const tagName = context.state.sliceDoc(tagNameNode.from,tagNameNode.to);
                if(noIndentTags.includes(tagName)){
                    return context.baseIndent;
                } else  {
                    tagsToBeClosed.push(tagName);
                    return context.baseIndent + context.unit;
                }
            },
            CloseTag: context => {
                const tagNameNode = context.node.firstChild;
                const tagName = context.state.sliceDoc(tagNameNode.from,tagNameNode.to);
                const index = tagsToBeClosed.indexOf(tagName);
                if(index === -1){
                    return context.baseIndent;
                } else {
                    //TODO deindent the current line (based off of context.pos (or tagNameNode.from))
                    //as a temporary work around i'm going to do a lessIndent command, but that might not have the right behavior
                    indentLess({state : context.state, dispatch: view.dispatch });
                    tagsToBeClosed.splice(index,1);
                    return context.baseIndent;
                }

            }
        })
    ]
})