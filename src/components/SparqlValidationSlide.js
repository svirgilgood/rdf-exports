import React, { useState, useEffect } from "react";
import { QueryEngine } from "@comunica/query-sparql";
import { Box, Grid, Heading } from "spectacle";
import CodeBox from "./CodeBox";
import Modal from "./Modal";
import { parseTriples } from "../utils/utils.ts";
import { Store } from "n3";
import { Tab, Tabs } from "./TabComponent";

const myEngine = new QueryEngine();

/*function ShaclValidationSlide({
  title,
  uri,
  shacl,
  shaclStore,
  data,
  dataStore,
  prefixes,
  updatePrefixes,
}) {
*/

function ResultRow({ binding, headings, setHeadings }) {
  const data = [];
  for (const [key, value] of binding) {
    if (!headings.includes(key.value)) {
      headings.push(key.value);
      setHeadings([...headings]);
    }
    data.push({ key, value });
  }
  return data.map(({ key, value }, i) => <td key={i}>{value.value}</td>);
}

function ResultsHeading({ headings }) {
  return (
    <thead>
      <tr>
        {headings.map((heading, idx) => {
          return <th key={idx}>{heading}</th>;
        })}
      </tr>
    </thead>
  );
}

function ResultTable({ bindings }) {
  const [headings, setHeadings] = useState([]);
  useEffect(() => {
    const headings = [];
    for (const [key, __] of bindings[0]) {
      headings.push(key.value);
    }
    setHeadings(headings);
  }, []);
  if (headings.length === 0) return null;

  return (
    <table>
      <ResultsHeading headings={headings} />

      <tbody>
        {bindings.map((binding, idx) => {
          return (
            <tr key={idx}>
              <ResultRow
                binding={binding}
                headings={headings}
                setHeadings={setHeadings}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SparqlSlide(props) {
  const {
    initialQuery,
    dataStore,
    dataDisplayString,
    uri,
    title,
    prefixes,
    shapeStore,
    shapeDisplayString,
    updatePrefixes,
  } = props;
  const [query, setQuery] = useState(initialQuery);

  const [bindings, setBindings] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [dataValidationStore, setDataStore] = useState(dataStore);
  const [activeTab, setActiveTab] = useState("shacl");

  const runQuery = async () => {
    const bindingsStream = await myEngine.queryBindings(query, {
      sources: [dataValidationStore],
    });
    const bindings = await bindingsStream.toArray();
    setBindings(bindings);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(!isModalOpen);
  };
  const updateQuery = (newCode) => {
    setQuery(newCode);
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
        <Box>
          <div className="tabs-container">
            <div className="tabs">
              <Tab
                label="Shacl"
                onClick={() => setActiveTab("shacl")}
                isActive={"shacl" === activeTab}
              >
                {"Shacl"}
              </Tab>
              <Tab
                label="Sparql"
                onClick={() => setActiveTab("sparql")}
                isActive={"sparql" === activeTab}
              >
                {"Sparql"}
              </Tab>
            </div>
            <div className="tab-content">
              {activeTab === "shacl" ? (
                <CodeBox
                  key="shacl"
                  uri={"https://example.com/shacl"}
                  title={"Shacl"}
                  code={shapeDisplayString}
                />
              ) : (
                <CodeBox
                  key="sparql"
                  uri={"https://example.com/sparql"}
                  title={"Sparql"}
                  code={query}
                />
              )}
            </div>
          </div>
        </Box>
        <CodeBox
          uri={uri}
          title={"Data"}
          code={dataDisplayString}
          updateCode={updateData}
        />
        {bindings.length > 0 && (
          <Modal isOpen={isModalOpen} hasCloseBtn={true} onClose={closeModal}>
            <ResultTable bindings={bindings} />
          </Modal>
        )}
        <button onClick={() => runQuery()}>Execute Query</button>
      </Grid>
    </div>
  );
}
export default SparqlSlide;
