/// <reference path="./component.d.ts" />

// Handle MathJax async typesetting errors that aren't critical for tests
Cypress.on("uncaught:exception", (err) => {
  // Suppress MathJax typesetting errors
  if (err.message?.includes("Typesetting failed")) {
    return false; // Suppress the error
  }
  // Let other errors fail the test
  return true;
});

// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import { ChakraProvider } from "@chakra-ui/react";
import "./commands";

import { mount } from "cypress/react";

import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "@doenet/doenetml-iframe";
import { theme } from "../../src/theme";

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

// Cypress.Commands.add('mount', mount)

Cypress.Commands.add("mount", (component, options = {}) => {
  const { routerProps = { initialEntries: ["/"] }, ...mountOptions } = options;

  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <ChakraProvider theme={theme}>
            <MathJaxContext version={4} config={mathjaxConfig}>
              {component as any}
            </MathJaxContext>
          </ChakraProvider>
        ),
      },
    ],
    routerProps as any,
  );

  const wrapped = <RouterProvider router={router} />;

  return mount(wrapped, mountOptions);
});

// Example use:
// cy.mount(<MyComponent />)
