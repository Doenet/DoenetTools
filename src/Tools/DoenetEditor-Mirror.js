import React from 'react';
import Editor from './Editor/Editor.js'

function DoenetEditor() {

    const content = "<cell rownum=3><outer>\n <inner>\n  I am inside\n </inner>\n</outer>";

    return(
        <Editor content={content} mountKey="mountkey-1"/>
    )
}

export default DoenetEditor;