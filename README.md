# Constraints for Linked Open Data

This presentation is a demonstration of how the UChicagoNode project is using
SHACL to write constraints for the linked open data it is generating. This
presentation shows how SHACL can be used in specific cases through interactive
slides.

## Abstract

The University of Chicago Library is creating a single platform to support the
development of future digital humanities projects and to maintain existing
projects. This project is called UChicagoNode. The goal of the platform is to
increase the visibility and sustainability of digital humanities work of the
students and scholars at the university. At the forefront of making the data
more discoverable is adopting the RDF standards of Dublin Core and the Europeana
Data Model. However, how do we ensure that the data is accurate and standardized
for ease of search? We have adopted SHACL, the Shapes Constraint Language, to
validate the data in our RDF store and to ensure its accuracy. SHACL provides
some practical constraints for the open-world assumption of OWL. Providing
constraints on RDF data provides several benefits: better reliability in
querying the data, ensuring the quality of the data, and accuracy of data
integration pipelines. This presentation will show how SHACL fits into our
workflow, how SHACL aids the quality control over our linked open data, and some
examples of complex SHACL constraints.
