import { Box, Grid, GridItem } from "@chakra-ui/react";
import React from "react";

/**
 * This widget wraps its children with a blue banner on the left and right.
 */
export function BlueBanner({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      width="100%"
      templateAreas={`"leftGutter viewer rightGutter"`}
      templateColumns={`1fr minmax(300px,850px) 1fr`}
    >
      <GridItem
        area="leftGutter"
        background="doenet.lightBlue"
        width="100%"
        paddingTop="10px"
        alignSelf="start"
      />
      <GridItem
        area="rightGutter"
        background="doenet.lightBlue"
        width="100%"
        paddingTop="10px"
        alignSelf="start"
      />
      <GridItem
        area="viewer"
        width="100%"
        placeSelf="center"
        minHeight="100%"
        maxWidth="850px"
        overflow="hidden"
      >
        <Box
          background="var(--canvas)"
          padding="0px 0px 20px 0px"
          flexGrow={1}
          w="100%"
          id="viewer-container"
        >
          {children}
        </Box>
      </GridItem>
    </Grid>
  );
}
