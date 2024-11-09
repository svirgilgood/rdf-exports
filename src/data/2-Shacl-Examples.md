## Specific SHACL examples

---

## Using Regular Expressions to Validate Strings

- We are using ARK identifiers for each of our objects
- We want to make sure that these objects match the ark identifier minting pattern

```turtle
ucns:_ArkDctermsIdentifierProperty
  sh:datatype xsd:string ;
  sh:maxCount "1"^^xsd:integer ;
  sh:message "All resources with an ARK identifier need to have a match need to have an identifier." ;
  sh:minCount "1"^^xsd:integer ;
  sh:name "Identifier" ;
  sh:path dcterms:identifier ;
  sh:pattern "^https:\\/\\/n2t\\.net\\/ark:61001\\/[0-9a-zA-Z]{12}(\\/file(\\.(wav|tif)))?$" ;
  .

```

---

## Matching Different Possible Classes for Objects

```turtle
ucns:_DctermsSpatialProperty
  sh:message "The spatial property should have TGN identifier." ;
  sh:minCount "1"^^xsd:integer ;
  sh:name "Spatial" ;
  sh:path dcterms:spatial ;
  sh:or (
    [ sh:class gvo:PhysAdminPlaceConcept ]
    [ sh:class gvo:PhysPlaceConcept ]
    [ sh:class gvo:AdminPlaceConcept ]
    [ sh:hasValue "(:unav)" ]
    [ sh:hasValue "(:unkn)" ]
  )
  .
```

--- {"layout" : "columns"}

## Matching Agreement of One among Many

::section

- Embedding SPARQL queries inside SHACL for more robust validation
- This SPARQL query insures that the `dcterms:type` matches one of the `dc:type`.
- There can be multiple types, but each one needs to have a match among the other property.

::section

```turtle
  sh:sparql [
    a sh:SPARQLConstraint ;
    sh:message "Values of dcterms:Types match  the dc:type" ;
    sh:prefixes <http://lib.uchicago.edu/shapes/> ;
    sh:select """
      SELECT $this (dc:type AS ?path) ?dcValue
      WHERE {
        $this
            $PATH ?termsValue ;
        .
        FILTER NOT EXISTS {
          ?this dc:type ?termsValue .
        }
      }
    """ ;
  ] ;
```

---

## Constraining Classes for non-OWL Ontologies

- Uses the `sh:node` to show that it belongs to the `dcterms:DCMIType`
- Notice we are using two different validations.
- As long as the

```turtle
ucns:_DcTypeProperty
  sh:node [
    rdf:type sh:NodeShape ;
    sh:property [
      sh:path dcam:memberOf ;
      sh:hasValue dcterms:DCMIType ;
    ] ;
  ] ;
  sh:message "All term types should belong to the DCM class" ;
  sh:minCount "1"^^xsd:integer ;
  sh:name "Type" ;
  sh:path dc:type ;
  .

```
