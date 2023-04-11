import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ToolRoot from './Tools/_framework/NewToolRoot';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from './Core/utils/math';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import DarkmodeController from './Tools/_framework/DarkmodeController';
import ErrorPage from './Tools/_framework/Paths/ErrorPage';

const theme = extendTheme({
  fonts: {
    body: 'Jost',
  },
  textStyles: {
    primary: {
      fontFamily: 'Jost',
    },
  },
});

const router = createBrowserRouter([
  {
    path: '*',
    // errorElement: <div>Error!</div>,
    element: (
      <DarkmodeController>
        <MathJaxContext
          version={2}
          config={mathjaxConfig}
          onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
        >
          <ChakraProvider theme={theme}>
            <ErrorPage />
          </ChakraProvider>
        </MathJaxContext>
      </DarkmodeController>
    ),
  },
]);

const root = createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>,
);
