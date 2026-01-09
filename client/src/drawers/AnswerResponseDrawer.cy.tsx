import { AnswerResponseDrawer } from "./AnswerResponseDrawer";
import { toMathJaxString } from "../utils/test";
import { DateTime } from "luxon";

describe("AnswerResponseDrawer component tests", () => {
  it("renders math correctly", () => {
    const responses = [
      {
        answerCreditAchieved: 0,
        response: `{"response":["x"],"componentTypes":["math"]}`,
        submittedAt: "2026-01-01T14:00:00Z",
      },
      {
        answerCreditAchieved: 1,
        response: `{"response":[["^", "y", 2]],"componentTypes":["math"]}`,
        submittedAt: "2026-01-01T14:01:00Z",
      },
    ];
    cy.intercept("/api/assign/getStudentSubmittedResponses/*/*", {
      responses,
    }).as("getData");

    cy.mount(
      <AnswerResponseDrawer
        isOpen={true}
        onClose={() => {}}
        itemName={null}
        assignment={{
          name: "Sample Assignment",
          type: "singleDoc",
          contentId: "xyz",
        }}
        student={{
          userId: "student1",
          firstNames: "Student",
          lastNames: "One",
        }}
        answerId={"answer123"}
        itemNumber={1}
        shuffledOrder={false}
        contentAttemptNumber={1}
        itemAttemptNumber={null}
      />,
    );

    cy.get("tbody > tr:nth-of-type(1) > td")
      .eq(0)
      .should("have.text", toMathJaxString("x"));
    cy.get("tbody > tr:nth-of-type(1) > td").eq(1).should("have.text", "0%");
    cy.get("tbody > tr:nth-of-type(1) > td")
      .eq(2)
      .should(
        "have.text",
        DateTime.fromISO(responses[0].submittedAt).toLocaleString(
          DateTime.DATETIME_MED,
        ),
      );

    cy.get("tbody > tr:nth-of-type(2) > td")
      .eq(0)
      .should("have.text", toMathJaxString("y2"));
    cy.get("tbody > tr:nth-of-type(2) > td").eq(1).should("have.text", "100%");
    cy.get("tbody > tr:nth-of-type(2) > td")
      .eq(2)
      .should(
        "have.text",
        DateTime.fromISO(responses[1].submittedAt).toLocaleString(
          DateTime.DATETIME_MED,
        ),
      );
  });

  it("renders text correctly", () => {
    const responses = [
      {
        answerCreditAchieved: 0,
        response: `{"response":["hello"],"componentTypes":["text"]}`,
        submittedAt: "2026-01-01T14:00:00Z",
      },
      {
        answerCreditAchieved: 1,
        response: `{"response":["world"],"componentTypes":["text"]}`,
        submittedAt: "2026-01-01T14:01:00Z",
      },
    ];
    cy.intercept("/api/assign/getStudentSubmittedResponses/*/*", {
      responses,
    }).as("getData");

    cy.mount(
      <AnswerResponseDrawer
        isOpen={true}
        onClose={() => {}}
        itemName={null}
        assignment={{
          name: "Sample Assignment",
          type: "singleDoc",
          contentId: "xyz",
        }}
        student={{
          userId: "student1",
          firstNames: "Student",
          lastNames: "One",
        }}
        answerId={"answer123"}
        itemNumber={1}
        shuffledOrder={false}
        contentAttemptNumber={1}
        itemAttemptNumber={null}
      />,
    );

    cy.get("tbody > tr:nth-of-type(1) > td").eq(0).should("have.text", "hello");
    cy.get("tbody > tr:nth-of-type(1) > td").eq(1).should("have.text", "0%");
    cy.get("tbody > tr:nth-of-type(1) > td")
      .eq(2)
      .should(
        "have.text",
        DateTime.fromISO(responses[0].submittedAt).toLocaleString(
          DateTime.DATETIME_MED,
        ),
      );

    cy.get("tbody > tr:nth-of-type(2) > td").eq(0).should("have.text", "world");
    cy.get("tbody > tr:nth-of-type(2) > td").eq(1).should("have.text", "100%");
    cy.get("tbody > tr:nth-of-type(2) > td")
      .eq(2)
      .should(
        "have.text",
        DateTime.fromISO(responses[1].submittedAt).toLocaleString(
          DateTime.DATETIME_MED,
        ),
      );
  });

  it("multiple part response", () => {
    const responses = [
      {
        answerCreditAchieved: 0.5,
        response: `{"response":["hello", ["^", "x", 2]],"componentTypes":["text", "math"]}`,
        submittedAt: "2026-01-01T14:00:00Z",
      },
    ];

    console.log("responses 2:", responses);
    cy.intercept("/api/assign/getStudentSubmittedResponses/*/*", {
      responses,
    }).as("getData");

    cy.mount(
      <AnswerResponseDrawer
        isOpen={true}
        onClose={() => {}}
        itemName={null}
        assignment={{
          name: "Sample Assignment",
          type: "singleDoc",
          contentId: "xyz",
        }}
        student={{
          userId: "student1",
          firstNames: "Student",
          lastNames: "One",
        }}
        answerId={"answer123"}
        itemNumber={1}
        shuffledOrder={false}
        contentAttemptNumber={1}
        itemAttemptNumber={null}
      />,
    );

    cy.get("tbody > tr:nth-of-type(1) > td")
      .eq(0)
      .should("have.text", "hello" + toMathJaxString("x2"));
    cy.get("tbody > tr:nth-of-type(1) > td").eq(1).should("have.text", "50%");
    cy.get("tbody > tr:nth-of-type(1) > td")
      .eq(2)
      .should(
        "have.text",
        DateTime.fromISO(responses[0].submittedAt).toLocaleString(
          DateTime.DATETIME_MED,
        ),
      );
  });
});
