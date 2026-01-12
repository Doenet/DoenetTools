/// <reference path="./component.d.ts" />

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
  const {
    routerProps = { initialEntries: ["/"] },
    action,
    ...mountOptions
  } = options;

  const safeActionWithDefault = async ({ request }: { request: Request }) => {
    try {
      // If the test provided a custom action, call it
      if (action) {
        return await action({ request });
      }

      // Otherwise, mock a simple JSON echo for POSTs
      if (request.method === "POST") {
        const contentType = request.headers.get("content-type") || "";
        let body: any = {};
        if (contentType.includes("application/json")) {
          body = await request.json();
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
          const formData = await request.formData();
          body = Object.fromEntries(formData.entries());
        }
        return { success: true, body };
      }
      return null;
    } catch (e: any) {
      // Prevent React Router ErrorBoundary from triggering
      // by returning a serializable object instead of throwing
      console.error("Mock route action error:", e);
      return { success: false, error: e?.message ?? String(e) };
    }
  };

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
        action: safeActionWithDefault,
      },
    ],
    routerProps as any,
  );

  const wrapped = <RouterProvider router={router} />;

  return mount(wrapped, mountOptions);
});

// Example use:
// cy.mount(<MyComponent />)
