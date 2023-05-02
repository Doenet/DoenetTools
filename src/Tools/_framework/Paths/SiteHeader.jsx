import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Flex,
  Tab,
  TabList,
  Tabs,
  Text,
  Icon,
  useColorMode,
  useColorModeValue,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import RouterLogo from "../RouterLogo";
import { pageToolViewAtom } from "../NewToolRoot";
import { useRecoilState } from "recoil";
import { FaCog, FaMoon, FaSun } from "react-icons/fa";

export async function loader() {
  //Check if signedIn
  const profileInfo = await checkIfUserClearedOut();
  let signedIn = true;
  if (profileInfo.cookieRemoved) {
    signedIn = false;
  }
  let portfolioCourseId = null;
  let isAdmin = false;
  if (signedIn) {
    //Check on portfolio courseId
    const response = await fetch("/api/getPorfolioCourseId.php");

    const data = await response.json();
    portfolioCourseId = data.portfolioCourseId;
    if (data.portfolioCourseId == "") {
      portfolioCourseId = "not_created";
    }
    const isAdminResponse = await fetch(`/api/checkForCommunityAdmin.php`);
    const isAdminJson = await isAdminResponse.json();
    isAdmin = isAdminJson.isAdmin;
  }
  return { signedIn, portfolioCourseId, isAdmin };
}

function NavLinkTab({ to, children, datatest }) {
  // TODO: use end only when path is "/"
  return (
    <NavLink to={to} end datatest={datatest}>
      {({ isActive, isPending }) => {
        // let spinner = null;
        // if (isPending) {
        //   spinner = <Spinner size="sm" />;
        // }
        let color = "doenet.canvastext";
        let borderBottomStyle = "none";
        let borderBottomWidth = "0px";
        if (isActive) {
          color = "doenet.mainBlue";
          borderBottomWidth = "2px";
          borderBottomStyle = "solid";
        }

        return (
          <Center
            h="40px"
            borderBottomStyle={borderBottomStyle}
            borderBottomWidth={borderBottomWidth}
            borderBottomColor={color}
            p="3px"
          >
            <Text fontSize="md" color={color}>
              {children}
            </Text>
            {/* {spinner} */}
          </Center>
        );
      }}
    </NavLink>
  );
}

export function SiteHeader(props) {
  let data = useLoaderData();
  const isAdmin = data?.isAdmin;
  const { colorMode, toggleColorMode } = useColorMode();
  let location = useLocation();

  // const navColor = useColorModeValue("#ffffff", "gray.800");
  // const navigate = useNavigate();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
  }

  return (
    <>
      <Grid
        templateAreas={`"siteHeader" 
        "main"`}
        gridTemplateRows="40px auto"
        width="100vw"
        height="100vh"
      >
        <GridItem
          area="siteHeader"
          as="header"
          width="100vw"
          m="0"
          backgroundColor="#fff"
          color="#000"
          height="40px"
        >
          <Grid
            height="40px"
            position="fixed"
            top="0"
            zIndex="1200"
            borderBottom="1px solid var(--mainGray)"
            // paddingBottom="2px"
            width="100%"
            margin="0"
            display="flex"
            justifyContent="space-between"
            templateAreas={`"leftHeader menus rightHeader" 
        "main"`}
            gridTemplateColumns="1f auto 1f"
          >
            <GridItem area="leftHeader">
              <Center h="100%">
                {/* <Button display={{ base: "flex", md: "none" }}>
                  TABS HERE
                </Button> */}
                <RouterLogo />
                <Text ml={1}>Doenet</Text>
                <Button
                  size="xs"
                  variant="ghost"
                  borderRadius={5}
                  onClick={toggleColorMode}
                >
                  <Icon
                    as={colorMode === "light" ? FaMoon : FaSun}
                    h={4}
                    w={4}
                  />
                </Button>
              </Center>
            </GridItem>
            <GridItem area="menus">
              <HStack spacing={3}>
                <NavLinkTab to="/" datatest="Home">
                  Home
                </NavLinkTab>
                <NavLinkTab to="community" datatest="Community">
                  Community
                </NavLinkTab>
                {data.signedIn && (
                  <>
                    <NavLinkTab
                      to={`portfolio/${data.portfolioCourseId}`}
                      datatest="Portfolio"
                    >
                      Portfolio
                    </NavLinkTab>
                    <Center
                      fontSize="md"
                      onClick={() => {
                        navigateTo.current = "/course";
                        setRecoilPageToolView({
                          page: "course",
                          tool: "",
                          view: "",
                          params: {},
                        });
                      }}
                    >
                      My Courses
                    </Center>
                    {isAdmin && (
                      <NavLinkTab to="admin" datatest="Admin">
                        Admin
                      </NavLinkTab>
                    )}
                  </>
                )}
              </HStack>

              {/* {data.signedIn && (
                    <>
                      <Tab
                        as={NavLink}
                        to={`portfolio/${data.portfolioCourseId}`}
                        _focus={{ boxShadow: "none" }}
                        datatest="Portfolio"
                        className={({ isActive, isDisabled }) =>
                          `${isActive ? "active" : ""} ${
                            isDisabled ? "disabled" : ""
                          }`
                        }
                      >
                        Portfolio
                      </Tab>
                      <Tab
                        onClick={() => {
                          navigateTo.current = "/course";
                          setRecoilPageToolView({
                            page: "course",
                            tool: "",
                            view: "",
                            params: {},
                          });
                        }}
                      >
                        My Courses
                      </Tab>
                      {isAdmin && (
                        <Tab
                          as={NavLink}
                          to="admin"
                          _focus={{ boxShadow: "none" }}
                          datatest="Admin"
                        >
                          Admin
                        </Tab>
                      )}
                    </>
                  )}
                </TabList>
              </Tabs> */}
            </GridItem>
            <GridItem area="rightHeader">
              {data.signedIn ? (
                <Box>Avatar Menu</Box>
              ) : (
                <Center h="40px" mr="10px">
                  <Button
                    datatest="Nav to signin"
                    size="sm"
                    // variant="ghost"
                    variant="outline"
                    onClick={() => {
                      navigateTo.current = "/signin";
                      setRecoilPageToolView({
                        page: "signin",
                        tool: "",
                        view: "",
                        params: {},
                      });
                    }}
                  >
                    Sign In
                  </Button>
                </Center>
              )}
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="main" as="main" margin="0" overflowY="scroll">
          {/* <Box>test</Box> */}
          <Outlet context={{ signedIn: data.signedIn }} />
        </GridItem>
      </Grid>
    </>
  );
}
