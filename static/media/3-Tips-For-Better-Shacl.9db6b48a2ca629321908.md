## Principles for Better SHACL

---

## Define your data

- Try to avoid using `xsd:anyURI` and bare `xsd:string` as data types.
- Ask the question: what do you want this data to be?
- The more precise your definitions the better control you can have over the data

Notes: Explicit is better than implicit. SHACL can force you to ask the question: what is this data exactly? (for example TGN identifiers or TGN objects?)

---

## Use Named Nodes

- Using Named Nodes provides better context for Error Messages
- This makes it easier to locate and understand why the message was generated
- All of the SHACL documentation uses blank nodes, but it is better to not use them for your Node Shapes and Property Shapes

Notes: Explicit is better than implicit!

---

## Use `sh:messages`

- `sh:message` is like a comment, it is returned in a failed validation report, use these as comments that will show why the message failed.

Notes: It is really good practice to use sh:messages. These are difficult to word correctly, because they will come back with different errors, but they are worth having in the context of the error report.

---

## Closed shapes

- A Closed shape means that only the properties defined in the shape can be used on an instance of that shape.
- A closed shape breaks the Open World Assumption
- Closed shapes allow for greater control over your constraints
- Closed shapes mean no additional data can be included

Notes: Closed shapes have their advantages (for example spell checking if you are hand writing your triples!), but they also have some pretty heavy disadvantages.
