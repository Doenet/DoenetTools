import {indentNodeProp, LezerLanguage, LanguageSupport } from "@codemirror/language"
import {styleTags, tags as t} from "@codemirror/highlight"
import {indentLess} from "@codemirror/commands"
import {parser} from './doenet.js'

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
                    //this should have the correct behavior...
                    indentLess({state : context.state, dispatch: view.dispatch });
                    tagsToBeClosed.splice(index,1);
                    return context.baseIndent;
                }

            }
        })
    ]
})

const doenetLanguage = LezerLanguage.define({
    parser: parserWithMetadata,
    //TODO look into languageData (looks like there's more than this (undocumented ofc))
    languageData: {
        commentTokens: {block: {open: "<!--", close: "-->"}}
    }
})

export function doenet(view) {
    return new LanguageSupport(doenetLanguage(view), [])
}