import React from "react";
import me from "math-expressions";
import { MathJax } from "better-react-mathjax";

export function parseAndFormatResponse(response: string): React.JSX.Element {
  const parsedResp = JSON.parse(response);

  return parsedResp.response.map((v, i) => {
    const componentType = parsedResp.componentTypes[i];
    if (componentType === "math" || componentType === "point") {
      const expr = me.fromAst(v);
      return (
        <div key={i}>
          <MathJax hideUntilTypeset={"first"} inline dynamic key={i}>
            {
              //@ts-ignore
              "\\(" + expr.toLatex() + "\\)"
            }
          </MathJax>
        </div>
      );
    } else {
      return (
        <div style={{ whiteSpace: "pre-line" }} key={i}>
          {String(v)}
        </div>
      );
    }
  });
}
