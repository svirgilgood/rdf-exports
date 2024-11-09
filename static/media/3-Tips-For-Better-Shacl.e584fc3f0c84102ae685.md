## Principles for Better SHACL

---

## Define your data

- Try to avoid using `xsd:anyURI` and bare `xsd:string` as data types.
- Ask the question: what do you want this data to be?
- The more precise your definitions the better control you can have over the data

---

## Use Named Nodes and Not Blank Nodes

- Using Named Nodes provides better context for Error Messages

- This makes it easier to locate and understand why the message was generated

- All of the SHACL documentation uses blank nodes, but it is better to not use them for your Node Shapes and Property Shapes

---

## Use `sh:messages`

- `sh:message` is like a comment, it is returned in a failed validation report, use these as comments that will show why the message failed.

---

## Closed Shapes

- A Closed shape means that only the properties defined in the shape can be used on an instance of that shape.

- A closed shape breaks the Open World Assumption

- Closed Shapes allow for greater control over your constraints

- Closed shapes mean no additional data can be included
