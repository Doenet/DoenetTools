import React, { useEffect, useState } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
// import type { StyleFunctionProps } from '@chakra-ui/styled-system';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ToolRoot from './Tools/_framework/NewToolRoot';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from './Core/utils/math';
import DarkmodeController from './Tools/_framework/DarkmodeController';

const theme = extendTheme({
  fonts: {
    body: 'Jost',
  },
  textStyles: {
    primary: {
      fontFamily: 'Jost',
    },
  },
  components: {
    Button: {
      baseStyle: {
        margin: '1px',
        height: '30px',
      },
      variants: {
        transition: {
          bg: 'var(--mainBlue)',
          color: 'white',
        },
        letter: {
          flexBasis: '9.5%',
          // margin: '1px',
          // height: '30px',
          // outline: '2px solid var(--mainBlue)',
        },
        letterTransition: {
          flexBasis: '14%',
          // margin: '1px',
          // height: '30px',
          outline: '2px solid var(--mainBlue)',
        },
        space: {
          flexBasis: '49%',
          // margin: '1px',
          // height: '30px',
          outline: '2px solid var(--mainBlue)',
        },
      },
      defaultProps: {
        size: 'md',
        // variant: 'outline',
      },
    },
  },
});

const root = createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <DarkmodeController>
              <MathJaxContext
                version={2}
                config={mathjaxConfig}
                onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
              >
                <ChakraProvider theme={theme}>
                  <ToolRoot />
                </ChakraProvider>
              </MathJaxContext>
            </DarkmodeController>
          }
        />
      </Routes>
    </Router>
  </RecoilRoot>,
);
