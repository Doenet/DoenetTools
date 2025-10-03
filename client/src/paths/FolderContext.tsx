import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import { Outlet, useLocation, useOutletContext } from "react-router";
import { Link as ReactRouterLink } from "react-router";
import { SiteContext } from "./SiteHeader";
import { Text } from "@chakra-ui/react";

/**
 * This is the header bar for the editor. All tabs/sub-pages in the editor use its context `EditorContext`. It works for both `/documentEditor` and `/compoundEditor`.
 */
export function FolderContext() {
  const context = useOutletContext<SiteContext>();
  const location = useLocation();
  const activitiesPath = `/activities/${context.user?.userId ?? ""}`;
  const isActivitiesActive = location.pathname === activitiesPath;
  const isTrashActive = location.pathname.startsWith("/trash");

  const sidePanel = (
    <Flex
      minWidth={{ base: "100%", lg: "8rem", xl: "15rem" }}
      maxWidth={{ base: "100%", lg: "8rem", xl: "15rem" }}
      flexShrink={0}
      align="flex-start"
      borderRight={["none", "solid 2px black"]}
      p={{ base: "0px", xl: "30px" }}
      // spacing="0.25rem"
      minHeight={["fit-content", "75vh"]}
      flexDir={["row", "column"]}
    >
      <Button
        as={ReactRouterLink}
        to={activitiesPath}
        variant="ghost"
        justifyContent="flex-start"
        width="100%"
        backgroundColor={
          isActivitiesActive ? "doenet.lightBlue" : "transparent"
        }
        _hover={
          isActivitiesActive
            ? { backgroundColor: "doenet.lightBlue" }
            : { backgroundColor: "gray.50" }
        }
        borderLeftWidth={isActivitiesActive ? "4px" : "0"}
        borderLeftColor={isActivitiesActive ? "doenet.mainBlue" : "transparent"}
        aria-current={isActivitiesActive ? "page" : undefined}
      >
        <Text fontSize="large">My Activities</Text>
      </Button>

      <Button
        as={ReactRouterLink}
        to={`/trash`}
        variant="ghost"
        justifyContent="flex-start"
        width="100%"
        backgroundColor={isTrashActive ? "doenet.lightBlue" : "transparent"}
        _hover={
          isTrashActive
            ? { backgroundColor: "doenet.lightBlue" }
            : { backgroundColor: "gray.50" }
        }
        borderLeftWidth={isTrashActive ? "4px" : "0"}
        borderLeftColor={isTrashActive ? "doenet.mainBlue" : "transparent"}
        aria-current={isTrashActive ? "page" : undefined}
      >
        <Text fontSize="large">My trash</Text>
      </Button>
    </Flex>
  );

  return (
    <Flex align="flex-start" width="100%" flexDir={["column", "row"]}>
      {sidePanel}
      <Outlet context={context} />
    </Flex>
  );
}
