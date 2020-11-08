import React from 'react'

import Editor from './Editor/Editor.js';
import play from './Editor/macbeth.js'

function DoenetEditor() {

    const content = "<outer>\n <inner>\n  I am inside\n </inner>\n</outer>";
    // const content = play;

    return(
        <Editor content={content} mountKey="mountkey-1"/>
    )
}

export default DoenetEditor;