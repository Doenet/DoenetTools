import { cesc } from "../../../src/_utils/url";

export function setupRegularPolygonScene({ attributes }) {
  let attributesString = Object.keys(attributes)
    .map((attr) => `${attr} = "${attributes[attr]}"`)
    .join(" ");

  cy.window().then(async (win) => {
    win.postMessage(
      {
        doenetML:
          `
  <text>a</text>

  <graph name="g1">
    <regularPolygon name="rp" ` +
          attributesString +
          `/>
  </graph>

  <graph name="g2">
    <point name="centerPoint" copySource="rp.center" />
    <copy source="rp.vertices" assignNames="v1 v2 v3 v4 v5 v6 v7 v8 v9 v10" />
  </graph>


  <p>circumradius: <mathinput name="micr" bindValueTo="$rp.circumradius" /> <number copySource="rp.circumradius" name="cr" /></p>
  <p>radius: <mathinput name="mir" bindValueTo="$rp.radius" /> <number copySource="rp.radius" name="r" /></p>

  <p>inradius: <mathinput name="miir" bindValueTo="$rp.inradius" /> <number copySource="rp.inradius" name="ir" /></p>
  <p>apothem: <mathinput name="miap" bindValueTo="$rp.apothem" /> <number copySource="rp.apothem" name="ap" /></p>

  <p>side length: <mathinput name="misl" bindValueTo="$rp.sideLength" /> <number copySource="rp.sideLength" name="sl" /></p>
  <p>perimeter: <mathinput name="mip" bindValueTo="$rp.perimeter" /> <number copySource="rp.perimeter" name="p" /></p>


  <p>area: <mathinput name="miar" bindValueTo="$rp.area" /> <number copySource="rp.area" name="ar" /></p>

  <p>n vertices: <mathinput name="minv" bindValueTo="$rp.numVertices" /> <number copySource="rp.numVertices" name="nv" /></p>
  <p>n sides: <mathinput name="mins" bindValueTo="$rp.numSides" /> <number copySource="rp.numSides" name="ns" /></p>


  <graph name="g3">
    <regularPolygon name="rp2" copySource="rp" />
  </graph>
  
  <graph name="g4" copySource="g3" newNamespace />
  `,
      },
      "*",
    );
  });
}

export function runRegularPolygonTests({
  center,
  vertex1,
  numVertices,
  conservedWhenChangeNumVertices = "radius",
  abbreviated = false,
}) {
  cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

  cy.window().then(async (win) => {
    let stateVariables = await win.returnAllStateVariables1();

    let polygonName = "/rp";
    let centerPointName = "/centerPoint";
    let allVertexNames = [
      "/v1",
      "/v2",
      "/v3",
      "/v4",
      "/v5",
      "/v6",
      "/v7",
      "/v8",
      "/v9",
      "/v10",
    ];
    let polygonCopyName = "/rp2";
    let polygonCopy2Name = "/g4/rp2";

    let inputs = {
      polygonNames: [polygonName, polygonCopyName, polygonCopy2Name],
      vertexNames: allVertexNames.slice(0, numVertices),
      centerPointName,
    };

    cy.window().then(async (win) => {
      checkPolygonValues(
        inputs,
        {
          numVertices,
          vertex1,
          center,
        },
        stateVariables,
      );
    });

    cy.log("move vertices individually");

    for (let i = 0; i < 3; i++) {
      let index = (i * Math.round(numVertices / 3)) % numVertices;

      cy.window().then(async (win) => {
        let vertex = [index, index + 1];

        await win.callAction1({
          actionName: "movePolygon",
          componentName: polygonName,
          args: {
            pointCoords: { [index]: vertex },
          },
        });

        stateVariables = await win.returnAllStateVariables1();

        let angle = (-index * 2 * Math.PI) / numVertices;
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        let directionWithRadius = [
          vertex[0] - center[0],
          vertex[1] - center[1],
        ];

        vertex1 = [
          directionWithRadius[0] * c - directionWithRadius[1] * s + center[0],
          directionWithRadius[0] * s + directionWithRadius[1] * c + center[1],
        ];

        checkPolygonValues(
          inputs,
          {
            numVertices,
            vertex1,
            center,
          },
          stateVariables,
        );
      });
    }

    if (!abbreviated) {
      cy.log("move polygon points together");
      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();

        let dx = 3,
          dy = -2;

        let currentVertices = stateVariables[polygonName].stateValues.vertices;
        let pointCoords = {};

        for (let i = 0; i < numVertices; i++) {
          pointCoords[i] = [
            currentVertices[i][0] + dx,
            currentVertices[i][1] + dy,
          ];
        }

        vertex1 = pointCoords[0];
        center = [center[0] + dx, center[1] + dy];

        await win.callAction1({
          actionName: "movePolygon",
          componentName: polygonName,
          args: {
            pointCoords,
          },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkPolygonValues(
          inputs,
          {
            numVertices,
            vertex1,
            center,
          },
          stateVariables,
        );
      });

      cy.log("move center point");
      cy.window().then(async (win) => {
        vertex1 = [vertex1[0] - center[0], vertex1[1] - center[1]];
        center = [0, 0];

        await win.callAction1({
          actionName: "movePoint",
          componentName: centerPointName,
          args: { x: center[0], y: center[1] },
        });

        stateVariables = await win.returnAllStateVariables1();
        checkPolygonValues(
          inputs,
          {
            numVertices,
            vertex1,
            center,
          },
          stateVariables,
        );
      });

      cy.log("move copied vertices");
      for (let i = 0; i < 3; i++) {
        let index = (i * Math.round(numVertices / 3) + 1) % numVertices;
        cy.window().then(async (win) => {
          let vertex = [index / 2 + 3, -1.5 * index];

          await win.callAction1({
            actionName: "movePoint",
            componentName: allVertexNames[index],
            args: { x: vertex[0], y: vertex[1] },
          });

          stateVariables = await win.returnAllStateVariables1();

          let angle = (-index * 2 * Math.PI) / numVertices;
          let c = Math.cos(angle);
          let s = Math.sin(angle);

          let directionWithRadius = [
            vertex[0] - center[0],
            vertex[1] - center[1],
          ];

          vertex1 = [
            directionWithRadius[0] * c - directionWithRadius[1] * s + center[0],
            directionWithRadius[0] * s + directionWithRadius[1] * c + center[1],
          ];

          checkPolygonValues(
            inputs,
            {
              numVertices,
              vertex1,
              center,
            },
            stateVariables,
          );
        });
      }

      cy.log("move polygonCopy vertices individually");
      for (let i = 0; i < 3; i++) {
        let index = (i * Math.round(numVertices / 3) + 2) % numVertices;

        cy.window().then(async (win) => {
          let vertex = [-index - 1, 2 * index];

          await win.callAction1({
            actionName: "movePolygon",
            componentName: polygonCopyName,
            args: {
              pointCoords: { [index]: vertex },
            },
          });

          stateVariables = await win.returnAllStateVariables1();

          let angle = (-index * 2 * Math.PI) / numVertices;
          let c = Math.cos(angle);
          let s = Math.sin(angle);

          let directionWithRadius = [
            vertex[0] - center[0],
            vertex[1] - center[1],
          ];

          vertex1 = [
            directionWithRadius[0] * c - directionWithRadius[1] * s + center[0],
            directionWithRadius[0] * s + directionWithRadius[1] * c + center[1],
          ];

          checkPolygonValues(
            inputs,
            {
              numVertices,
              vertex1,
              center,
            },
            stateVariables,
          );
        });
      }
    }

    cy.log("polygonCopy vertices together");
    cy.window().then(async (win) => {
      stateVariables = await win.returnAllStateVariables1();

      let dx = -2,
        dy = -4;

      let currentVertices =
        stateVariables[polygonCopyName].stateValues.vertices;
      let pointCoords = {};

      for (let i = 0; i < numVertices; i++) {
        pointCoords[i] = [
          currentVertices[i][0] + dx,
          currentVertices[i][1] + dy,
        ];
      }

      vertex1 = pointCoords[0];
      center = [center[0] + dx, center[1] + dy];

      await win.callAction1({
        actionName: "movePolygon",
        componentName: polygonCopyName,
        args: {
          pointCoords,
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkPolygonValues(
        inputs,
        {
          numVertices,
          vertex1,
          center,
        },
        stateVariables,
      );
    });

    if (!abbreviated) {
      cy.log("move polygonCopy2 vertices individually");
      for (let i = 0; i < 3; i++) {
        let index = (i * Math.round(numVertices / 3) + 3) % numVertices;
        cy.window().then(async (win) => {
          let vertex = [-2 * index - 1, index + 4];

          await win.callAction1({
            actionName: "movePolygon",
            componentName: polygonCopy2Name,
            args: {
              pointCoords: { [index]: vertex },
            },
          });

          stateVariables = await win.returnAllStateVariables1();

          let angle = (-index * 2 * Math.PI) / numVertices;
          let c = Math.cos(angle);
          let s = Math.sin(angle);

          let directionWithRadius = [
            vertex[0] - center[0],
            vertex[1] - center[1],
          ];

          vertex1 = [
            directionWithRadius[0] * c - directionWithRadius[1] * s + center[0],
            directionWithRadius[0] * s + directionWithRadius[1] * c + center[1],
          ];

          checkPolygonValues(
            inputs,
            {
              numVertices,
              vertex1,
              center,
            },
            stateVariables,
          );
        });
      }

      cy.log("polygonCopy2 vertices together");
      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();

        let dx = 1,
          dy = -3;

        let currentVertices =
          stateVariables[polygonCopyName].stateValues.vertices;
        let pointCoords = {};

        for (let i = 0; i < numVertices; i++) {
          pointCoords[i] = [
            currentVertices[i][0] + dx,
            currentVertices[i][1] + dy,
          ];
        }

        vertex1 = pointCoords[0];
        center = [center[0] + dx, center[1] + dy];

        await win.callAction1({
          actionName: "movePolygon",
          componentName: polygonCopy2Name,
          args: {
            pointCoords,
          },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkPolygonValues(
          inputs,
          {
            numVertices,
            vertex1,
            center,
          },
          stateVariables,
        );
      });
    }

    cy.log("Change circumradius");
    cy.window().then(async (win) => {
      stateVariables = await win.returnAllStateVariables1();

      let oldCr = stateVariables[polygonName].stateValues.circumradius;

      let circumradius = 1;

      cy.get(cesc("#\\/micr") + " textarea").type(
        `{home}{shift+end}{backspace}${circumradius}{enter}`,
        { force: true },
      );
      cy.get(cesc("#\\/cr")).should("have.text", `${circumradius}`);

      vertex1 = [
        ((vertex1[0] - center[0]) * circumradius) / oldCr + center[0],
        ((vertex1[1] - center[1]) * circumradius) / oldCr + center[1],
      ];

      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();
        checkPolygonValues(
          inputs,
          {
            numVertices,
            vertex1,
            center,
          },
          stateVariables,
        );
      });
    });

    if (!abbreviated) {
      cy.log("Change radius");
      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();

        let oldR = stateVariables[polygonName].stateValues.circumradius;

        let radius = 3;

        cy.get(cesc("#\\/mir") + " textarea").type(
          `{home}{shift+end}{backspace}${radius}{enter}`,
          { force: true },
        );
        cy.get(cesc("#\\/r")).should("have.text", `${radius}`);

        vertex1 = [
          ((vertex1[0] - center[0]) * radius) / oldR + center[0],
          ((vertex1[1] - center[1]) * radius) / oldR + center[1],
        ];

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              numVertices,
              vertex1,
              center,
            },
            stateVariables,
          );
        });
      });

      cy.log("Change inradius");
      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();

        let oldIr = stateVariables[polygonName].stateValues.inradius;

        let inradius = 5;

        cy.get(cesc("#\\/miir") + " textarea").type(
          `{home}{shift+end}{backspace}${inradius}{enter}`,
          { force: true },
        );
        cy.get(cesc("#\\/ir")).should("have.text", `${inradius}`);

        vertex1 = [
          ((vertex1[0] - center[0]) * inradius) / oldIr + center[0],
          ((vertex1[1] - center[1]) * inradius) / oldIr + center[1],
        ];

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              numVertices,
              vertex1,
              center,
            },
            stateVariables,
          );
        });
      });

      cy.log("Change apothem");
      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();

        let oldAp = stateVariables[polygonName].stateValues.inradius;

        let apothem = 4;

        cy.get(cesc("#\\/miap") + " textarea").type(
          `{home}{shift+end}{backspace}${apothem}{enter}`,
          { force: true },
        );
        cy.get(cesc("#\\/ap")).should("have.text", `${apothem}`);

        vertex1 = [
          ((vertex1[0] - center[0]) * apothem) / oldAp + center[0],
          ((vertex1[1] - center[1]) * apothem) / oldAp + center[1],
        ];

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              numVertices,
              vertex1,
              center,
            },
            stateVariables,
          );
        });
      });

      cy.log("Change sideLength");
      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();

        let oldSl = stateVariables[polygonName].stateValues.sideLength;

        let sideLength = 2;

        cy.get(cesc("#\\/misl") + " textarea").type(
          `{home}{shift+end}{backspace}${sideLength}{enter}`,
          { force: true },
        );
        cy.get(cesc("#\\/sl")).should("have.text", `${sideLength}`);

        vertex1 = [
          ((vertex1[0] - center[0]) * sideLength) / oldSl + center[0],
          ((vertex1[1] - center[1]) * sideLength) / oldSl + center[1],
        ];

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              numVertices,
              vertex1,
              center,
            },
            stateVariables,
          );
        });
      });

      cy.log("Change perimeter");
      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();

        let oldSl = stateVariables[polygonName].stateValues.perimeter;

        let perimeter = 9;

        cy.get(cesc("#\\/mip") + " textarea").type(
          `{home}{shift+end}{backspace}${perimeter}{enter}`,
          { force: true },
        );
        cy.get(cesc("#\\/p")).should("have.text", `${perimeter}`);

        vertex1 = [
          ((vertex1[0] - center[0]) * perimeter) / oldSl + center[0],
          ((vertex1[1] - center[1]) * perimeter) / oldSl + center[1],
        ];

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              numVertices,
              vertex1,
              center,
            },
            stateVariables,
          );
        });
      });

      cy.log("Change area");
      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();

        let oldAr = stateVariables[polygonName].stateValues.area;

        let area = 13;

        cy.get(cesc("#\\/miar") + " textarea").type(
          `{home}{shift+end}{backspace}${area}{enter}`,
          { force: true },
        );
        cy.get(cesc("#\\/ar")).should("have.text", `${area}`);

        vertex1 = [
          (vertex1[0] - center[0]) * Math.sqrt(area / oldAr) + center[0],
          (vertex1[1] - center[1]) * Math.sqrt(area / oldAr) + center[1],
        ];

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              numVertices,
              vertex1,
              center,
            },
            stateVariables,
          );
        });
      });
    }

    cy.log("Add two vertices");
    cy.window().then(async (win) => {
      let result = adjustVertex1CenterWhenChangenumVertices(
        vertex1,
        center,
        numVertices,
        numVertices + 2,
        conservedWhenChangeNumVertices,
      );

      vertex1 = result.vertex1;
      center = result.center;

      numVertices += 2;

      cy.get(cesc("#\\/minv") + " textarea").type(`{end}+2{enter}`, {
        force: true,
      });
      cy.get(cesc("#\\/nv")).should("have.text", `${numVertices}`);

      inputs.vertexNames = allVertexNames.slice(0, numVertices);

      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();
        checkPolygonValues(
          inputs,
          {
            numVertices,
            vertex1,
            center,
          },
          stateVariables,
        );
      });
    });

    if (!abbreviated) {
      cy.log("Remove a side");
      cy.window().then(async (win) => {
        let result = adjustVertex1CenterWhenChangenumVertices(
          vertex1,
          center,
          numVertices,
          numVertices - 1,
          conservedWhenChangeNumVertices,
        );

        vertex1 = result.vertex1;
        center = result.center;

        numVertices -= 1;

        cy.get(cesc("#\\/mins") + " textarea").type(`{end}-1{enter}`, {
          force: true,
        });
        cy.get(cesc("#\\/ns")).should("have.text", `${numVertices}`);

        inputs.vertexNames = allVertexNames.slice(0, numVertices);

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              numVertices,
              vertex1,
              center,
            },
            stateVariables,
          );
        });
      });
    }
  });
}

function adjustVertex1CenterWhenChangenumVertices(
  vertex1,
  center,
  numVerticesOld,
  numVerticesNew,
  conservedWhenChangeNumVertices,
) {
  let radiusRatio = 1;

  if (conservedWhenChangeNumVertices === "inradius") {
    radiusRatio =
      Math.cos(Math.PI / numVerticesOld) / Math.cos(Math.PI / numVerticesNew);
  } else if (conservedWhenChangeNumVertices === "sideLength") {
    radiusRatio =
      (2 * Math.sin(Math.PI / numVerticesOld)) /
      (2 * Math.sin(Math.PI / numVerticesNew));
  } else if (conservedWhenChangeNumVertices === "perimeter") {
    radiusRatio =
      (2 * numVerticesOld * Math.sin(Math.PI / numVerticesOld)) /
      (2 * numVerticesNew * Math.sin(Math.PI / numVerticesNew));
  } else if (conservedWhenChangeNumVertices === "area") {
    radiusRatio = Math.sqrt(
      ((numVerticesOld / 2) * Math.sin((2 * Math.PI) / numVerticesOld)) /
        ((numVerticesNew / 2) * Math.sin((2 * Math.PI) / numVerticesNew)),
    );
  } else if (conservedWhenChangeNumVertices === "twoVertices") {
    // calculate vertex2
    let directionWithRadius = [vertex1[0] - center[0], vertex1[1] - center[1]];

    let angleOld = (2 * Math.PI) / numVerticesOld;
    let c = Math.cos(angleOld);
    let s = Math.sin(angleOld);

    let vertex2 = [
      directionWithRadius[0] * c - directionWithRadius[1] * s + center[0],
      directionWithRadius[0] * s + directionWithRadius[1] * c + center[1],
    ];

    // calculate center based on this vertex 2 and new numVertices
    let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
    let midpoint = [
      (vertex1[0] + vertex2[0]) / 2,
      (vertex1[1] + vertex2[1]) / 2,
    ];
    let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
    let inradius = sideLength / (2 * Math.tan(Math.PI / numVerticesNew));

    let inradiusDirection = [
      -sideVector[1] / sideLength,
      sideVector[0] / sideLength,
    ];

    center = [
      midpoint[0] + inradiusDirection[0] * inradius,
      midpoint[1] + inradiusDirection[1] * inradius,
    ];
  }

  vertex1 = [
    (vertex1[0] - center[0]) * radiusRatio + center[0],
    (vertex1[1] - center[1]) * radiusRatio + center[1],
  ];

  return { vertex1, center };
}

function checkPolygonValues(
  { polygonNames, vertexNames, centerPointName },
  { numVertices, center, vertex1 },
  stateVariables,
) {
  let vertexCoords = [vertex1];

  let directionWithRadius = [vertex1[0] - center[0], vertex1[1] - center[1]];

  let circumradius = Math.sqrt(
    directionWithRadius[0] ** 2 + directionWithRadius[1] ** 2,
  );
  let inradius = circumradius * Math.cos(Math.PI / numVertices);
  let sideLength = circumradius * (2 * Math.sin(Math.PI / numVertices));
  let perimeter =
    circumradius * (2 * numVertices * Math.sin(Math.PI / numVertices));
  let area =
    circumradius ** 2 *
    ((numVertices / 2) * Math.sin((2 * Math.PI) / numVertices));

  for (let i = 1; i < numVertices; i++) {
    let angle = (i * 2 * Math.PI) / numVertices;
    let c = Math.cos(angle);
    let s = Math.sin(angle);

    vertexCoords.push([
      directionWithRadius[0] * c - directionWithRadius[1] * s + center[0],
      directionWithRadius[0] * s + directionWithRadius[1] * c + center[1],
    ]);
  }

  for (let polygonName of polygonNames) {
    let polygon = stateVariables[polygonName];
    for (let i = 0; i < numVertices; i++) {
      expect(polygon.stateValues.vertices[i][0]).closeTo(
        vertexCoords[i][0],
        1e-14 * Math.abs(vertexCoords[i][0]) + 1e-14,
      );
      expect(polygon.stateValues.vertices[i][1]).closeTo(
        vertexCoords[i][1],
        1e-14 * Math.abs(vertexCoords[i][1]) + 1e-14,
      );
    }
    expect(polygon.stateValues.center[0]).closeTo(
      center[0],
      1e-14 * Math.abs(center[0]) + 1e-14,
    );
    expect(polygon.stateValues.center[1]).closeTo(
      center[1],
      1e-14 * Math.abs(center[1]) + 1e-14,
    );

    expect(polygon.stateValues.numVertices).eq(numVertices);

    expect(polygon.stateValues.circumradius).closeTo(
      circumradius,
      1e-14 * circumradius,
    );
    expect(polygon.stateValues.inradius).closeTo(inradius, 1e-14 * inradius);
    expect(polygon.stateValues.sideLength).closeTo(
      sideLength,
      1e-14 * sideLength,
    );
    expect(polygon.stateValues.perimeter).closeTo(perimeter, 1e-14 * perimeter);
    expect(polygon.stateValues.area).closeTo(area, 1e-14 * area);
  }

  if (vertexNames) {
    for (let [i, vertexName] of vertexNames.entries()) {
      let vertex = stateVariables[vertexName];
      expect(vertex.stateValues.xs[0]).closeTo(
        vertexCoords[i][0],
        1e-14 * Math.abs(vertexCoords[i][0]) + 1e-14,
      );
      expect(vertex.stateValues.xs[1]).closeTo(
        vertexCoords[i][1],
        1e-14 * Math.abs(vertexCoords[i][1]) + 1e-14,
      );
    }
  }

  if (centerPointName) {
    let centerPoint = stateVariables[centerPointName];
    expect(centerPoint.stateValues.xs[0]).closeTo(
      center[0],
      1e-14 * Math.abs(center[0]) + 1e-14,
    );
    expect(centerPoint.stateValues.xs[1]).closeTo(
      center[1],
      1e-14 * Math.abs(center[1]) + 1e-14,
    );
  }
}
