import React, { useState } from "react";
import SHACLValidator from "rdf-validate-shacl";
import { Store } from "n3";
import { CodePane, Grid, Heading } from "spectacle";
import "./shacl-validation-style.css";
import Modal from "./Modal";
import { serialize, parseTriples } from "../utils/utils.ts";
import CodeBox from "./CodeBox";

/* Should I use the react-simple-code-editor? https://github.com/react-simple-code-editor/react-simple-code-editor?tab=readme-ov-file
 * Also this would require prism.js which does have turtle syntax highlighting: https://prismjs.com/
 */
// function CodeBox({ code, updateCode, title, uri }) {
//   const [displayCode, setCode] = useState(code);
//   const highlighter = (displayCode) => {
//     try {
//       return highlight(displayCode, languages.turtle);
//     } catch (error) {
//       console.log("error", error);
//       console.log("display code", displayCode);
//       return displayCode;
//     }
//   };
//   return (
//     <Box backgroundColor="tertiary">
//       <h2 style={{ color: "primary" }}>{title}</h2>
//       <Editor
//         value={displayCode}
//         onValueChange={(displayCode) => setCode(displayCode)}
//         highlight={(displayCode) => highlighter(displayCode)}
//         style={{
//           fontFamily: '"Fira code", "Fira Mono", monospace',
//           fontSize: 12,
//           maxHeight: "400px",
//           focus: "auto",
//           overflow: "auto",
//         }}
//       />
//       <button type="button" onClick={() => updateCode(displayCode, uri)}>
//         Update Graph
//       </button>
//     </Box>
//   );
// }

/* This component is the Slide that holds the interactive boxes for shapes and validation
 */
function ShaclValidationSlide({
  title,
  uri,
  shacl,
  shaclStore,
  data,
  dataStore,
  prefixes,
  updatePrefixes,
}) {
  const [isModalOpen, setModal] = useState(false);
  const [validationReport, setValidationReport] = useState("");
  const [shapeStore, setShapeStore] = useState(shaclStore);
  const [dataValidationStore, setDataStore] = useState(dataStore);
  const [showProgress, setProgress] = useState(false);
  // const [shapeGraph, setShapeGraph] = useState();
  /*               uri={slideUri}
              title={title}
              shaclStore={shaclStore}
              shacl={shacl}
              updateShacl={updateShacl}
              data={data}
              dataStore={dataStore}
              updateData={updateData}
              */

  // useEffect(() => {
  //   const shapeQuads = store.getQuads(null, null, null, focusNode);
  //   setShapeGraph(new Store(shapeQuads));
  // }, [focusNode]);
  const closeModal = () => {
    setModal(!isModalOpen);
  };
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const openModal = async () => {
    const validator = new SHACLValidator(shapeStore);
    const report = await validator.validate(dataValidationStore);
    const resultStore = new Store();
    for (const quad of report.dataset) {
      console.log(quad);
      resultStore.addQuad(quad);
    }
    const printableRes = await serialize(resultStore, prefixes);

    setProgress(true);
    setValidationReport(printableRes);
    closeModal();
    await delay(500);
    setProgress(false);
  };
  const updateShapes = async (displayShapes) => {
    const [quads, prefixes] = await parseTriples(displayShapes);
    updatePrefixes(prefixes);
    setShapeStore(new Store(quads));
  };
  const updateData = async (displayData) => {
    const [quads, prefixes] = await parseTriples(displayData);
    updatePrefixes(prefixes);
    setDataStore(new Store(quads));
  };
  return (
    <div>
      <Heading>{title}</Heading>
      <Grid gridTemplateColumns="50% 50%" gridColumnGap={15}>
        <CodeBox
          title="Shape Graph"
          code={shacl}
          updateCode={updateShapes}
          uri={uri}
        />
        <CodeBox
          title="Data Graph"
          code={data}
          updateCode={updateData}
          uri={uri}
        />
      </Grid>
      <button className="button" type="button" onClick={openModal}>
        Run Validation
      </button>
      <Modal isOpen={isModalOpen} hasCloseBtn={true} onClose={closeModal}>
        {showProgress ? (
          <progress value={null} />
        ) : (
          <CodeBox
            title={"Validation Report"}
            language="turtle"
            // showLineNumbers={true}
            code={validationReport}
            uri={"https://example.com/validationReport"}
            backgroundColor="quaternary"
            isEditable={false}
          />
        )}
      </Modal>
    </div>
  );
}

export default ShaclValidationSlide;
