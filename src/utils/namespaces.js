import { DataFactory } from "n3";

const { namedNode } = DataFactory;
/*
@prefix dc: <http://purl.org/dc/elements/1.1/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix edm: <http://www.europeana.eu/schemas/edm/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix uchicago: <http://lib.uchicago.edu/> .
@prefix ucns: <http://lib.uchicago.edu/shapes/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix pres: <https://svirgilgood.github.io/constraining-linked-open-data/> .

@prefix ex: <http://example.com#> .
*/

const RDFBase = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const RDFSBase = "http://www.w3.org/2000/01/rdf-schema#";
const PresBase = "https://svirgilgood.github.io/constraining-linked-open-data/";
const ShaclBase = "http://www.w3.org/ns/shacl#";
const XsdBase = "http://www.w3.org/2001/XMLSchema#";

const namespaces = {
  rdf: {
    type: namedNode(RDFBase + "type"),
  },
  rdfs: {
    label: namedNode(RDFSBase + "label"),
  },

  sh: {
    property: namedNode(ShaclBase + "property"),
    NodeShape: namedNode(ShaclBase + "NodeShape"),
  },
  xsd: {
    string: namedNode(XsdBase + "string"),
  },
  pres: {
    containsShape: namedNode(PresBase + "containsShape"),
    containsData: namedNode(PresBase + "containsData"),
    hasScript: namedNode(PresBase + "hasScript"),
    order: namedNode(PresBase + "order"),
    ShaclSlide: namedNode(PresBase + "ShaclSlide"),
    SparqlSlide: namedNode(PresBase + "SparqlSlide"),
  },
};

export default namespaces;
