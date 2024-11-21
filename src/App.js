import "./App.css";

import React, { useEffect, useState } from "react";

import {
  Deck,
  Slide,
  DefaultTemplate,
  MarkdownSlideSet,
  Notes,
} from "spectacle";
import ShaclValidationSlide from "./components/ShaclValidationSlide";
import { Parser, Store } from "n3";

import namespaces from "./utils/namespaces";
import { serialize } from "./utils/utils.ts";

//import raw from "data/ConstraintsFroLinkedOpenData.md";
// import raw from "./data/ConstraintsForLinkedOpenData.md";
import introRaw from "./data/1-Introduction.md";
import tipsRaw from "./data/3-Tips-For-Better-Shacl.md";
import bibliographyRaw from "./data/4-Bibliography.md";
import graphRaw from "./data/graph_data.trig";
import SparqlSlide from "./components/SparqlValidationSlide";
import constrainingTheme from "./themes/constraining_theme";

const { rdf, rdfs, pres } = namespaces;

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

function App() {
  const [introMd, setIntro] = useState("");
  const [tipsMd, setTips] = useState("");
  const [bibMd, setBib] = useState("");
  const [prefixes, setPrefixes] = useState({});
  const [shaclSlides, setShaclSlides] = useState([]);
  const [sparqlSlides, setSparqlSlides] = useState([]);
  const [store, setStore] = useState();

  // use effect to load markdown files
  useEffect(() => {
    loadText(introRaw, setIntro);
    loadText(tipsRaw, setTips);
    loadText(bibliographyRaw, setBib);
  }, []);
  // use effectetto load the store
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
        const notes = newStore.getObjects(slideNode, pres.notes).pop()?.value;
        slides.push({
          title,
          slideUri,
          shapeStore,
          shapeDisplayString,
          dataStore,
          dataDisplayString,
          notes,
        });
      }
      setShaclSlides(slides);
      setStore(newStore);
    }
    loadGraph(graphRaw);
  }, []);

  // loading sparql slides and loading the graph should be
  // combined into one function there is no reason that these functions should be
  // split into two different useEffect statements
  useEffect(() => {
    if (!store) return;
    async function createSparqlSlides(store) {
      let sparqlSlides = store.getSubjects(rdf.type, pres.SparqlSlide);
      sparqlSlides = sparqlSlides
        .map((subject) => {
          return store.getQuads(subject, pres.order).pop();
        })
        .sort((a, b) => {
          if (a.object.value < b.object.value) return -1;
          if (a.object.value > b.object.value) return 1;
          return 0;
        });

      const slides = [];
      for (const qwad of sparqlSlides) {
        const shapeGraph = store
          .getObjects(qwad.subject, pres.containsShape)
          .pop();
        const shapeStore = new Store(
          store.getQuads(null, null, null, shapeGraph),
        );
        const shapeDisplayString = await serialize(shapeStore, prefixes);
        const dataGraph = store
          .getObjects(qwad.subject, pres.containsData)
          .pop();
        const dataStore = new Store(
          store.getQuads(null, null, null, dataGraph),
        );
        const dataDisplayString = await serialize(dataStore, prefixes);
        const initialQuery = store
          .getObjects(qwad.subject, pres.hasScript)
          .pop();
        const title = store.getObjects(qwad.subject, rdfs.label).pop();
        const uri = qwad.subject.value;
        const notes = store.getObjects(qwad.subject, pres.notes).pop()?.value;
        slides.push({
          shapeStore,
          shapeDisplayString,
          dataStore,
          dataDisplayString,
          initialQuery: initialQuery.value,
          title: title.value,
          uri,
          notes,
        });
      }
      setSparqlSlides(slides);
    }
    createSparqlSlides(store);
  }, [store, prefixes]);

  if (
    !shaclSlides ||
    shaclSlides.length === 0 ||
    !sparqlSlides ||
    sparqlSlides.length === 0
  ) {
    return <div>Building</div>;
  }

  return (
    <Deck theme={constrainingTheme} template={<DefaultTemplate />}>
      <MarkdownSlideSet>{introMd}</MarkdownSlideSet>
      {/*<MarkdownSlideSet>{shaclMd}</MarkdownSlideSet>*/}
      {shaclSlides.map(
        ({
          title,
          slideUri,
          shapeStore,
          shapeDisplayString,
          dataStore,
          dataDisplayString,
          notes,
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
              {notes && (
                <Notes>
                  <div dangerouslySetInnerHTML={{ __html: notes }}></div>
                </Notes>
              )}
            </Slide>
          );
        },
      )}

      {sparqlSlides.map(
        ({
          uri,
          initialQuery,
          shapeStore,
          shapeDisplayString,
          dataStore,
          dataDisplayString,
          title,
          notes,
        }) => {
          return (
            <Slide key={uri}>
              <SparqlSlide
                initialQuery={initialQuery}
                shapeStore={shapeStore}
                shapeDisplayString={shapeDisplayString}
                dataStore={dataStore}
                dataDisplayString={dataDisplayString}
                title={title}
                uri={uri}
                store={store}
                prefixes={prefixes}
                updatePrefixes={setPrefixes}
              />
              {notes && (
                <Notes>
                  <div dangerouslySetInnerHTML={{ __html: notes }}></div>
                </Notes>
              )}
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
