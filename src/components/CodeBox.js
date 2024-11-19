import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-turtle";
import { Box } from "spectacle";

/* Should I use the react-simple-code-editor? https://github.com/react-simple-code-editor/react-simple-code-editor?tab=readme-ov-file
 * Also this would require prism.js which does have turtle syntax highlighting: https://prismjs.com/
 */
function CodeBox({ code, updateCode, title, uri }) {
  const [displayCode, setCode] = useState(code);
  const highlighter = (displayCode) => {
    try {
      return highlight(displayCode, languages.turtle);
    } catch (error) {
      console.log("error", error);
      console.log("display code", displayCode);
      return displayCode;
    }
  };
  return (
    <Box backgroundColor="tertiary">
      <h2 style={{ color: "primary" }}>{title}</h2>
      <Editor
        value={displayCode}
        onValueChange={(displayCode) => setCode(displayCode)}
        highlight={(displayCode) => highlighter(displayCode, languages.turtle)}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          maxHeight: "400px",
          focus: "auto",
          overflow: "auto",
        }}
      />
      <button type="button" onClick={() => updateCode(displayCode, uri)}>
        Update Graph
      </button>
    </Box>
  );
}

export default CodeBox;
