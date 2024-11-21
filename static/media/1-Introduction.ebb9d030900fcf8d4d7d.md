# Constraints for Linked Open Data

Notes: use ctrl+k to change to presenter mode. | Forward arrow to got to the next slide

---

## UChicagoNode project

- A centralized platform for digital objects and collections at the University of Chicago
- Allow for display of these artifacts
- Allow for reuse of features between collections
- Allow for discoverability

Notes: UChicagoNode is a partnership between the Library and Forum for Digital Cultures. | We use OCHRE as the back end for importing and inputting data, and MarkLogic will be the server for the front end.

---

## Linked Open Data and UChicagoNode

- Link out to existing authorities (like Library of Congress's Linked Data service and Getty's Topographical Name service)
- Linked Data is one of the targets service to be good participants in a shared web of humanities data. (Matching Europeana's data model in key points)

Notes: UChicagoNode will be part of Linked open data. | The triples will eventually be machine accessible as triples.

---

## OWL vs SHACL

- OWL has an open world assumption. Just because we don't know the data doesn't mean we can't say it doesn't exist.
- But how do we make sure the data we do have is the data as we want it to be?
- "the axioms in an ontology are meant to _infer new knowledge_ rather than _trigger an inconsistency_" [Sirin 2010, 19].

Notes: How do SHACL and OWL differ? What data we want to ensure is part of the collection. What data must be? OWL is for the formal definition of a class. All edm:ProvidedCHO's have a title, but the title is not a sufficient and necessary arrangement for belonging to that class. The formal definition of the class is OWL. The requirement that these objects also have a title is a constraint we want for our data.

---

## Why add constraints for RDF data

- Reliability of querying
- Ensure data quality and reliability
- Ensure export process and CI/CD pipeline for data and integrations

Notes: Adding constraints for RDF data has several benefits. OPTIONAL clauses in SPARQL are very expensive, and by making sure all of the expected statements are present can improve quality.

---

## Why SHACL

- Allows for triples to be defined in triples
- Good tooling
- Part of the import process
- Allows for defining your data. It can force you to say what exactly your data should look like.

Notes: There are other ways of constraining data, but SHACL provides a couple of unique benefits. One that might be worth looking at, but not part of Node is the rdf-document-editor https://github.com/buda-base/rdf-document-editor.
