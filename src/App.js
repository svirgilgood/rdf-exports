import "./App.css";

import React, { useEffect, useState } from "react";

import { Deck, Slide, DefaultTemplate, MarkdownSlideSet } from "spectacle";
import ShaclValidationSlide from "./components/ShaclValidationSlide";
import { Parser, Store } from "n3";

import namespaces from "./utils/namespaces";
import { serialize } from "./utils/utils.ts";

//import raw from "data/ConstraintsFroLinkedOpenData.md";
// import raw from "./data/ConstraintsForLinkedOpenData.md";
import introRaw from "./data/1-Introduction.md";
import shaclExamplesRaw from "./data/2-Shacl-Examples.md";
import tipsRaw from "./data/3-Tips-For-Better-Shacl.md";
import bibliographyRaw from "./data/4-Bibliography.md";
import graphRaw from "./data/graph_data.trig";

const parser = new Parser();

const { rdf, rdfs, pres, sh } = namespaces;

function parseTriples(triples) {
  const parser = new Parser();

  const quads = [];

  return new Promise((resolve, reject) => {
    parser.parse(triples, (error, quad, prefixes) => {
      if (error !== null) reject(error);
      else if (quad) quads.push(quad);
      else resolve([quads, prefixes]);
    });
  });
}
async function loadText(rawMarkdown, setMd) {
  const response = await fetch(rawMarkdown);
  const text = await response.text();
  setMd(text);
}

async function createStoreAndDisplay({
  store,
  slideNode,
  setHookStore,
  stateStore,
  setHookDisplay,
  stateDisplay,
  prefixes,
  predicate,
}) {
  const slideUri = slideNode.value;
  const shapeNode = store.getObjects(slideNode, predicate).pop();
  const newStore = new Store(store.getQuads(null, null, null, shapeNode));
  setHookStore({ ...stateStore, [slideUri]: newStore });
  const newDisplayString = await serialize(newStore, prefixes);
  setHookDisplay({ ...stateDisplay, [slideUri]: newDisplayString });
}
function App() {
  const [introMd, setIntro] = useState("");
  const [shaclMd, setShaclMd] = useState("");
  const [tipsMd, setTips] = useState("");
  const [bibMd, setBib] = useState("");
  const [prefixes, setPrefixes] = useState({});
  const [shapeStoreObj, setShapeStore] = useState({});
  const [shapeDisplayObj, setShapeDisplay] = useState({});
  const [dataStoreObj, setDataStore] = useState({});
  const [dataDisplayObj, setDataDisplay] = useState({});
  const [shaclSlides, setShaclSlides] = useState([]);

  // use effect to load markdown files
  useEffect(() => {
    loadText(introRaw, setIntro);
    loadText(shaclExamplesRaw, setShaclMd);
    loadText(tipsRaw, setTips);
    loadText(bibliographyRaw, setBib);
  }, []);
  // use effect to load the store
  useEffect(() => {
    async function loadGraph(rawTrig) {
      const response = await fetch(rawTrig);
      const text = await response.text();
      const [quads, prefixes] = await parseTriples(text);
      setPrefixes(prefixes);
      const newStore = new Store();
      newStore.addQuads(quads);
      let shaclSlides = newStore.getSubjects(rdf.type, pres.ShaclSlide);
      shaclSlides = shaclSlides
        .map((subject) => newStore.getQuads(subject, pres.order).pop())
        .sort((a, b) => {
          if (a.object.value < b.object.value) return -1;
          if (a.object.value > b.object.value) return 1;
          return 0;
        });
      const slides = [];

      for (const slideOrderQuad of shaclSlides) {
        const { subject: slideNode } = slideOrderQuad;
        const slideUri = slideNode.value;
        // create shapes object
        const shapeNode = newStore
          .getObjects(slideNode, pres.containsShape)
          .pop();
        const shapeStore = new Store(
          newStore.getQuads(null, null, null, shapeNode),
        );
        const shapeDisplayString = await serialize(shapeStore, prefixes);
        // create data object
        const dataNode = newStore
          .getObjects(slideNode, pres.containsData)
          .pop();
        const dataStore = new Store(
          newStore.getQuads(null, null, null, dataNode),
        );
        const dataDisplayString = await serialize(dataStore, prefixes);

        const title = newStore.getObjects(slideNode, rdfs.label).pop().value;
        slides.push({
          title,
          slideUri,
          shapeStore,
          shapeDisplayString,
          dataStore,
          dataDisplayString,
        });
      }
      setShaclSlides(slides);
    }
    loadGraph(graphRaw);
  }, []);
  const updateShacl = (newCode, slideUri) => {
    const quads = parser.parse(newCode);
    const newStore = new Store(quads);
    setShapeStore({ ...shapeStoreObj, [slideUri]: newStore });
  };
  const updateData = (newCode, slideUri) => {
    const quads = parser.parse(newCode);
    const newStore = new Store(quads);
    setDataDisplay({ ...dataStoreObj, [slideUri]: newStore });
    console.log(dataStoreObj);
  };
  if (!shaclSlides || shaclSlides.length === 0) {
    return <div>Building</div>;
  }

  return (
    <Deck template={<DefaultTemplate />}>
      <MarkdownSlideSet>{introMd}</MarkdownSlideSet>
      <MarkdownSlideSet>{shaclMd}</MarkdownSlideSet>
      {shaclSlides.map(
        ({
          title,
          slideUri,
          shapeStore,
          shapeDisplayString,
          dataStore,
          dataDisplayString,
        }) => {
          return (
            <Slide key={slideUri}>
              <ShaclValidationSlide
                uri={slideUri}
                title={title}
                shaclStore={shapeStore}
                shacl={shapeDisplayString}
                data={dataDisplayString}
                dataStore={dataStore}
                prefixes={prefixes}
                updatePrefixes={setPrefixes}
              />
            </Slide>
          );
        },
      )}
      <MarkdownSlideSet>{tipsMd}</MarkdownSlideSet>
      <MarkdownSlideSet>{bibMd}</MarkdownSlideSet>
    </Deck>
  );
}

export default App;

/*

      // <MarkdownSlideSet>{md}</MarkdownSlideSet>
      <Slide>
        <Heading>Welcome to Spectacle</Heading>
      </Slide>
      <Slide>
        <Heading>This is a test</Heading>
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </Slide>
      {md != "" &&
        md.split("\n#").map((slideText) => {
          console.log(slideText);
          return (
            <Slide>
              <Markdown>{slideText}</Markdown>
            </Slide>
          );
        })}

         {md != "" &&
        md
          .split("\n#")
          .filter((txt) => txt != "")
        .map((slideText) => {
          console.log(slideText);
          return <MarkdownSlide animateListItems> {slideText}</MarkdownSlide>;
        })}
      {md.split("---").map((slide) => {
        if (slide[1] === "{") {
          console.log("slide", slide);
          const format = JSON.parse(slide.split("\n")[0]);
          console.log("json", format);
          // return <MarkdownSlide {...format}>{slide}</MarkdownSlide>;
          return (
            <MarkdownSlide componentProps={{ layout: "columns" }}>
              {slide}
            </MarkdownSlide>
          );
        }
        console.log("test");
        return <MarkdownSlide>{slide}</MarkdownSlide>;
      })}

  */
