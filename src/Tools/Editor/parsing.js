//returns an object with three fields
//(1) pos: the buffer index of the open/self-closing tag corresponding to the tag containing the given document position
//  Returns the buffer index of the closing tag if no open tag is found
//  -1 indicates no tag contains position
//(2) tagname: The name of the tag containing position
//(3) open: Boolean indicating if an open tag was found.
function findTag(doc, tree, buff_offset, doc_offset) {
    let tag = {
        pos: -1, 
        tagname: "",
        tagend: -1,
        open: true};

    let buffer = tree.buffer;
    let types = tree.group.types;
    let sym_open = -1;
    let sym_close = -1;
    let sym_selfclose = -1;
    let sym_tagname = -1;
    let sym_mismatch = -1; //mismatched tag names

    //find symbols
    for (let i=0; i < types.length; i++) {
        switch(types[i].name) {
            case "OpenTag":
                sym_open = i;
                break;
            case "CloseTag":
                sym_close = i;
                break;
            case "SelfClosingTag":
                sym_selfclose = i;
                break;
            case "TagName":
                sym_tagname = i;
                break;
            case "MismatchedTagName":
                sym_mismatch = i;
                break;
        }
    }

    if (sym_tagname < 0) return tag;
    //find pos
    for (let i=0; i < buffer.length; i+=4) {
        if (buff_offset < buffer[i+1]) {
            break; //No more nodes will contain position in its range
        } else {
            if (buff_offset <= buffer[i+2] && (buffer[i]==sym_open || buffer[i]==sym_selfclose || buffer[i]==sym_close)) {
                tag.pos = i;
                if (buffer[i]==sym_close) tag.open = false;
                break;
            }
        }
    }
    if (tag.pos < 0) return tag;

    //find tagname
    for (let i=tag.pos; i < buffer.length; i+=4) {
        if (buffer[i+2] > buffer[tag.pos+2]) {
            break; 
        } else {
            if (buffer[i] == sym_tagname || buffer[i] == sym_mismatch) {
                tag.tagname = doc.sliceString(buffer[i+1]+doc_offset, buffer[i+2]+doc_offset);
                break;
            }
        }
    }

    //If in a closing tag find the open tag
    if (!tag.open) {
        let close_tag_i = tag.pos;
        let in_open_tag = false;
        let open_tag_end = 0;
        let possible_indices = [];
        for (let i=0; i < close_tag_i; i+=4) {
            if (in_open_tag && buffer[i+2] <= open_tag_end ) {
                if (buffer[i] == sym_tagname || buffer[i] == sym_mismatch) {
                    if (doc.sliceString(buffer[i+1]+doc_offset,buffer[i+2]+doc_offset) == tag.tagname) {
                        possible_indices.push(i);
                    }
                }
            } else {
                if (in_open_tag) in_open_tag = false;
                if (buffer[i] == sym_open) {
                    in_open_tag = true;
                    open_tag_end = buffer[i+2];
                } else if (buffer[i] == sym_close) {
                    possible_indices.pop();
                }
            }
        }

        let found_open_tag = possible_indices.pop();
        if (found_open_tag !== undefined) {
            tag.pos = found_open_tag;
            tag.open = true;
        }
    }

    if (tag.open) tag.tagend = buffer[tag.pos+2]+doc_offset; // set end of tag (for AddAttrButton)
    return tag;
}

//Finds the attributes for a tag given its buffer index init_i
//Returns an array of attributes. Each entry has the 
//attr_name, attr_val, and document offsets of the attr_val
//for rewrites by the Info Panel
function getAttrs(doc, tree, init_i, doc_offset) {
    let attrs = [];

    let sym_attrname = -1;
    let sym_attrval = -1;
    let sym_unquoteval = -1;
    let sym_is = -1; // The '=' symbol after attrname

    let buffer = tree.buffer;
    let types = tree.group.types;

    for (let i=0; i < types.length; i++) {
        if (types[i].name == "AttributeName") {
            sym_attrname = i;
        } else if (types[i].name == "AttributeValue") {
            sym_attrval = i;
        } else if (types[i].name == "UnquotedAttributeValue") {
            sym_unquoteval = i;
        } else if (types[i].name == "Is") {
            sym_is = i;
        }
    }

    let subtree_end = buffer[init_i+2];
    let curr_index = -1;
    let name_exists = false;
    for (let i = init_i; i < buffer.length; i+= 4) {
        if (buffer[i+2] > subtree_end) break;

        if (buffer[i] == sym_attrname) {
            let curr_attr = doc.sliceString(buffer[i+1]+doc_offset, buffer[i+2]+doc_offset);
            attrs.push({
                attrname_props: [curr_attr, buffer[i+1]+doc_offset, buffer[i+2]+doc_offset], // attr name, begin offset, end offset
                attrval_props: ["", 0, 0, true] // attr val, begin offset, end offset, has quotes?
            });
            curr_index += 1;
            name_exists = true;
        } else if (name_exists && buffer[i] == sym_is) { // if there is an '=' give Info Panel ability to write attr val 
            let temp = buffer[i+2]+doc_offset;
            attrs[curr_index]["attrval_props"][1] = temp;
            attrs[curr_index]["attrval_props"][2] = temp;
        } else if (name_exists && buffer[i] == sym_attrval) {
            attrs[curr_index]["attrval_props"][0] = doc.sliceString(buffer[i+1]+doc_offset+1, buffer[i+2]+doc_offset-1); // +1 and -1 to remove quotes
            attrs[curr_index]["attrval_props"][1] = buffer[i+1]+doc_offset; // offsets keep track of quotes
            attrs[curr_index]["attrval_props"][2] = buffer[i+2]+doc_offset;
            name_exists = false;
        } else if (buffer[i] == sym_unquoteval) {
            attrs[curr_index]["attrval_props"][0] = doc.sliceString(buffer[i+1]+doc_offset, buffer[i+2]+doc_offset);
            attrs[curr_index]["attrval_props"][1] = buffer[i+1]+doc_offset;
            attrs[curr_index]["attrval_props"][2] = buffer[i+2]+doc_offset;
            attrs[curr_index]["attrval_props"][3] = false;
            name_exists = false;
        }
    }

    return attrs;
}

// Get the smallest Tree Buffer containing the position.
// Returns null if there is none.
function getTreeBuff(tree, position) {
    let curr_tree = tree;
    let buff_offset = position;
    while (curr_tree && curr_tree.buffer === undefined) {
        if (curr_tree.type.name === "Text") return null;
        let positions = curr_tree.positions;
        let infinum = 0;
        for (let i=1; i<positions.length; i++) {
            if (positions[i] > buff_offset) break;
            infinum = i;
        }
        curr_tree = curr_tree.children[infinum];
        buff_offset -= positions[infinum];
    }
    return {buffer: curr_tree, buff_offset: buff_offset, doc_offset: position-buff_offset};
}

// Returns an object representing the properties of a tag
// If given a closing tag it will only return the tag name
export function getTagProps(doc, tree, position) {
    // console.log("This is the init position. ", position);
    let tag_props = {
        tagname: "",
        tagend: -1,
        attrs: []
    };
    if (tree.children.length == 0) return tag_props;

    let bufferProps = getTreeBuff(tree, position);
    if (bufferProps === null) return tag_props;

    let tree_buff = bufferProps.buffer;
    let buff_offset = bufferProps.buff_offset;
    let doc_offset = bufferProps.doc_offset;

    // console.log(tree_buff);
    // console.log(buff_offset, doc_offset);

    let basic_tag_props = findTag(doc, tree_buff, buff_offset, doc_offset);
    if (basic_tag_props.pos < 0) return tag_props;
    tag_props.tagname = basic_tag_props.tagname;
    if (basic_tag_props.open) tag_props.tagend = basic_tag_props.tagend;
    
    if (!basic_tag_props.open) return tag_props;
    tag_props.attrs = getAttrs(doc, tree_buff, basic_tag_props.pos, doc_offset);
    return tag_props;
}