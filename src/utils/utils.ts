import { Store, Writer, Parser, DataFactory } from "n3";
import { Quad, Term } from "n3/lib/N3DataFactory";
import { isBlankNode, isLiteral, isNamedNode } from "n3/lib/N3Util";

const { quad } = DataFactory;

type BNodeObj = {
  predicate: Term;
  object: Term;
}

type BlankNodeConstruction = {
  store: Store;
  qwad: Quad;
  accumulator: BNodeObj[];
}

///
/*
 *
*/
///
function constructBlankNode(args: BlankNodeConstruction) {
  let { store, qwad, accumulator } = args;
  const { predicate, object } = qwad;
  if (isNamedNode(object) || isLiteral(object)) {
    accumulator.push({ predicate, object });
    return accumulator;
  }
  for (const newQuad of store.getQuads(object)) {
    accumulator = constructBlankNode({ store, qwad: newQuad, accumulator });
  }
  return accumulator;
}

/*
 *
 */
function constructLists({ store, lists, focusNode, writer }) {
  // console.log("focusNode", focusNode);
  // console.log("focusNode values", lists[focusNode.value]);
  const list: Array<any> = [];
  lists[focusNode.value].forEach(async (listNode) => {
    if (isNamedNode(listNode) || isLiteral(listNode)) return listNode;
    const accumulator: BNodeObj[] = [];
    // console.log("store list nodes", store.getQuads(listNode));
    const savequads = store.getQuads(listNode).map((qwad) => {
      return constructBlankNode({ store, qwad, accumulator });
    });
    let blanks;
    if (savequads.length > 1) {
      blanks = writer.blank(savequads);
      list.push(blanks);
    } else {
      try {
        blanks = writer.blank(savequads[0]);
        list.push(blanks);
      } catch (error) {
        console.log("error", error);
        console.log("savequads", savequads);
      }
    }
  });
  // console.log("list", list);
  return list;
}

/**
 * returns a list of objects for RDF:lists and rdf_blank Nodes
 * Takes a qwad as an argument
 *
 */
function constructWriterQuads({ store, lists, qwad, writer }) {
  let { subject, predicate, object, graph } = qwad;
  if (isNamedNode(object) || isLiteral(object)) {
    writer.addQuad(qwad);
    return writer;
  }
  if (isBlankNode(object) && !(object.value in lists)) {
    const accumulator = [];
    const qwads = store.getQuads(object);
    qwads.forEach((qwad) => constructBlankNode({ store, qwad, accumulator }));
    object = accumulator;

    writer.addQuad(quad(subject, predicate, writer.blank([...object]), graph));
    return writer;
  }
  // console.log("write list", toWriteList);
  writer.addQuad(
    quad(
      subject,
      predicate,
      writer.list(constructLists({ store, lists, focusNode: object, writer })),
      graph,
    ),
  );
  return writer;
}

function serialize(store: Store, prefixes: { [key: string]: string }) {
  let writer;
  if (prefixes) {
    writer = new Writer({ prefixes: { ...prefixes } });
  } else {
    writer = new Writer();
  }
  // const quads = store.getQuads();
  let lists = store.extractLists();
  let subjects = store
    .getSubjects()
    .filter(
      (sub) => isNamedNode(sub) || store.getQuads(null, null, sub).length === 0,
    );
  subjects.forEach((sub) => {
    store.getQuads(sub).forEach((qwad) => {
      constructWriterQuads({ store, lists, qwad, writer });
    });
  });

  // console.log("writer", writer);

  return new Promise((resolve, reject) => {
    writer.end((error, result) => {
      if (error) reject(error);
      else {
        resolve(result);
      }
    });
  });
}
function parseTriples(triples: string) {
  const parser = new Parser();

  const quads: Array<Quad> = [];

  return new Promise((resolve, reject) => {
    parser.parse(
      triples,
      (error: Error, quad: Quad, prefixes: { [key: string]: string }) => {
        if (error !== null) reject(error);
        else if (quad) quads.push(quad);
        else resolve([quads, prefixes]);
      },
    );
  });
}
export { serialize, parseTriples };
