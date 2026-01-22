import { Grid, GridItem } from "@chakra-ui/react";
import { ReactNode } from "react";

export function WithSideBanners({
  children,
  bgColor = "white",
  padding = "0px",
  gutterColumns = 2,
  leftGutterColumns,
  rightGutterColumns,
}: {
  children: ReactNode;
  bgColor?: string;
  padding?: string;
  /**
   * If `leftGutterColumns` or
   * `rightGutterColumns` are provided they override this value for that
   * side.
   */
  gutterColumns?: number;
  leftGutterColumns?: number;
  rightGutterColumns?: number;
}) {
  const left =
    leftGutterColumns !== undefined ? leftGutterColumns : gutterColumns;
  const right =
    rightGutterColumns !== undefined ? rightGutterColumns : gutterColumns;

  return (
    <Grid
      templateColumns={"repeat(12, 1fr)"}
      w="100%"
      bg={bgColor}
      pt={padding}
      pb={padding}
    >
      <GridItem
        colStart={{ base: 0, md: 1 + left }}
        colSpan={{ base: 12, md: 12 - left - right }}
      >
        {children}
      </GridItem>
    </Grid>
  );
}
