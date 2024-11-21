import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-turtle";
import "prismjs/components/prism-sparql";
import { Box } from "spectacle";

import "./shacl-validation-style.css";

/* Should I use the react-simple-code-editor? https://github.com/react-simple-code-editor/react-simple-code-editor?tab=readme-ov-file
 * Also this would require prism.js which does have turtle syntax highlighting: https://prismjs.com/
 */
function CodeBox({
  code,
  updateCode,
  title,
  uri,
  language = "turtle",
  backgroundColor = "tertiary",
  isEditable = true,
}) {
  const [displayCode, setCode] = useState(code);
  const [savedCode, setSavedCode] = useState(code);

  const highlighter = (displayCode) => {
    try {
      return highlight(displayCode, languages.turtle);
    } catch (error) {
      console.log("error", error);
      console.log("display code", displayCode);
      return displayCode;
    }
  };
  const lang = language === "turtle" ? languages.turtle : languages.sparql;

  const saveCode = (displayCode) => {
    setSavedCode(displayCode);
    updateCode(displayCode, uri);
  };

  return (
    <Box backgroundColor={backgroundColor}>
      {title && <h2 style={{ color: "primary" }}>{title}</h2>}
      <div style={{ overflow: "auto", maxHeight: "400px" }}>
        <Editor
          value={displayCode}
          onValueChange={(displayCode) => setCode(displayCode)}
          highlight={(displayCode) => highlighter(displayCode, lang)}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: "14px",
            backgroundColor: "#124559",
            color: "#EFF6E0",
            overflow: "autao",
            caretColor: "#EFF6E0",
          }}
        />
      </div>
      {isEditable && (
        <button
          disabled={savedCode === displayCode}
          type="button"
          onClick={() => saveCode(displayCode)}
          className="button"
        >
          Save
        </button>
      )}
    </Box>
  );
}

export default CodeBox;
