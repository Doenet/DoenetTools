import { compileActivityFromContent } from "./activity";
import { Content } from "../types";

// Every viewer path (ActivityViewer, AssignmentViewer, RawViewer,
// AssignmentResponseOverview) compiles the activity source with *this*
// function, while revisions and cids are compiled by the server twin in
// `apps/api/src/utils/contentStructure.ts`. The two must agree, or the same
// problem set renders differently depending on how it is opened. The
// assertions here are mirrored by "repeatInProblemSet survives into the
// compiled activity" and "A description is not one of the scored items" in
// `apps/api/src/test/activity.test.ts`.

function mkDoc(
  contentId: string,
  name: string,
  extra: Partial<Content> = {},
): Content {
  return {
    contentId,
    name,
    type: "singleDoc",
    doenetML: `<p>${name}</p>`,
    doenetmlVersion: { fullVersion: "0.7.24" },
    numVariants: 5,
    ...extra,
  } as unknown as Content;
}

function mkProblemSet(children: Content[]): Content {
  return {
    contentId: "ps",
    name: "My problem set",
    type: "sequence",
    shuffle: false,
    children,
  } as unknown as Content;
}

describe("compileActivityFromContent", { tags: ["@group4"] }, () => {
  it("compiles a document with its title and description flag", () => {
    const source = compileActivityFromContent(
      mkProblemSet([mkDoc("doc1", "Intro", { isDescription: true })]),
    );

    if (source.type !== "sequence") {
      throw Error("expected a sequence");
    }
    expect(source.items[0]).to.deep.equal({
      id: "doc1",
      type: "singleDoc",
      title: "Intro",
      isDescription: true,
      doenetML: "<p>Intro</p>",
      version: "0.7.24",
      numVariants: 5,
    });
  });

  it("defaults isDescription to false", () => {
    const source = compileActivityFromContent(
      mkProblemSet([mkDoc("doc1", "Problem")]),
    );
    if (source.type !== "sequence") {
      throw Error("expected a sequence");
    }
    const item = source.items[0];
    if (item.type !== "singleDoc") {
      throw Error("expected a singleDoc");
    }
    expect(item.isDescription).to.equal(false);
  });

  it("wraps a repeated document in a select, as the server does", () => {
    const source = compileActivityFromContent(
      mkProblemSet([mkDoc("doc1", "Problem", { repeatInProblemSet: 3 })]),
    );

    if (source.type !== "sequence") {
      throw Error("expected a sequence");
    }
    const item = source.items[0];
    if (item.type !== "select") {
      throw Error("expected a repeated document to compile to a select");
    }

    expect(item.id).to.equal("select_for_doc1");
    expect(item.title).to.equal("Repeat 3 times");
    expect(item.numToSelect).to.equal(3);
    expect(item.selectByVariant).to.equal(true);
    expect(item.items).to.have.length(1);
    expect(item.items[0].id).to.equal("doc1");
  });

  it("does not repeat a description", () => {
    // The viewer throws on a select whose items include a description
    // ("The case where a select contains a description is not implemented"),
    // and a description is not a scored item, so it never repeats.
    const source = compileActivityFromContent(
      mkProblemSet([
        mkDoc("doc1", "Intro", { isDescription: true, repeatInProblemSet: 3 }),
      ]),
    );
    if (source.type !== "sequence") {
      throw Error("expected a sequence");
    }
    expect(source.items[0].type).to.equal("singleDoc");
  });

  it("ignores isDescription outside a problem set", () => {
    // `isDescription` is a setting for a document in a problem set; a document
    // that carries the flag into a question bank is a normal scored item.
    const source = compileActivityFromContent({
      contentId: "bank",
      name: "My question bank",
      type: "select",
      numToSelect: 1,
      selectByVariant: false,
      children: [mkDoc("doc1", "Intro", { isDescription: true })],
    } as unknown as Content);

    if (source.type !== "select") {
      throw Error("expected a select");
    }
    const item = source.items[0];
    if (item.type !== "singleDoc") {
      throw Error("expected a singleDoc");
    }
    expect(item.isDescription).to.equal(false);
  });

  it("does not wrap when the document repeats once", () => {
    const source = compileActivityFromContent(
      mkProblemSet([mkDoc("doc1", "Problem", { repeatInProblemSet: 1 })]),
    );
    if (source.type !== "sequence") {
      throw Error("expected a sequence");
    }
    // A repeat of 1 must compile identically to no repeat at all, so that
    // existing saved student state keeps its source hash.
    expect(source.items[0].type).to.equal("singleDoc");
  });

  it("does not repeat a document inside a question bank", () => {
    // The bank already selects `numToSelect` of its documents, and the item
    // names count it as exactly that many items, so a nested select would put
    // more items in the activity than the gradebook has columns for. The
    // setting travels with a document copied out of a problem set, so the
    // compiler cannot assume it is absent here.
    const source = compileActivityFromContent({
      contentId: "bank",
      name: "My question bank",
      type: "select",
      numToSelect: 1,
      selectByVariant: false,
      children: [mkDoc("doc1", "Problem", { repeatInProblemSet: 3 })],
    } as unknown as Content);

    if (source.type !== "select") {
      throw Error("expected a select");
    }
    expect(source.items[0].type).to.equal("singleDoc");
  });

  it("repeats no more copies than the document has variants", () => {
    // Editing or reverting a document can lower `numVariants` below a repeat
    // saved earlier, and the editor then hides the repeat control (it is shown
    // only for multi-variant documents), so nothing else would correct it.
    const source = compileActivityFromContent(
      mkProblemSet([
        mkDoc("doc1", "Problem", { repeatInProblemSet: 3, numVariants: 2 }),
      ]),
    );
    if (source.type !== "sequence") {
      throw Error("expected a sequence");
    }
    const item = source.items[0];
    if (item.type !== "select") {
      throw Error("expected a select");
    }
    expect(item.numToSelect).to.equal(2);
    expect(item.title).to.equal("Repeat 2 times");
  });

  it("does not wrap a repeated document that has only one variant", () => {
    const source = compileActivityFromContent(
      mkProblemSet([
        mkDoc("doc1", "Problem", { repeatInProblemSet: 3, numVariants: 1 }),
      ]),
    );
    if (source.type !== "sequence") {
      throw Error("expected a sequence");
    }
    expect(source.items[0].type).to.equal("singleDoc");
  });
});
