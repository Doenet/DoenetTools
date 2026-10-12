import { submitOperation } from "./submitOperation";

describe("submitOperation()", { tags: ["@group1"] }, () => {
  it("sends the operation, its params and the options to genericAction", () => {
    const submit = cy.stub();

    submitOperation(submit, "getAssigned", {}, { redirectOnSuccess: "/x" });
    // Options in the params slot would be sent as params and the redirect
    // skipped, so it does not type-check.
    // @ts-expect-error getAssigned takes no params
    submitOperation(submit, "getAssigned", { redirectOnSuccess: "/x" });

    expect(submit.firstCall.args).to.deep.equal([
      { operation: "getAssigned", params: {}, redirectOnSuccess: "/x" },
      { method: "post", encType: "application/json" },
    ]);
  });
});
