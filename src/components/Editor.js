
import React from 'react';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

const ace = require('ace-builds/src-noconflict/ace');
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/");
ace.config.setModuleUrl('ace/mode/json_worker', "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-json.js");

export default function Editor(props) {
    return <AceEditor
        mode="json"
        theme="github"
        editorProps={{ $blockScrolling: true }}
        style={{
            width: "100%",
            height: "100%",
            ...props.style,
        }}
        {...props}
    />;
}