import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Center,
  Grid,
  GridItem,
  Text,
  Icon,
  useColorMode,
  useColorModeValue,
  HStack,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Box,
  VStack,
  ButtonGroup,
} from "@chakra-ui/react";
import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import RouterLogo from "../RouterLogo";
import { pageToolViewAtom } from "../NewToolRoot";
import { useRecoilState } from "recoil";
import { FaMoon, FaRobot, FaSun } from "react-icons/fa";
import axios from "axios";

export async function loader() {
  //Check if signedIn
  const profileInfo = await checkIfUserClearedOut();
  let signedIn = true;
  if (profileInfo.cookieRemoved) {
    signedIn = false;
  }
  let portfolioCourseId = null;
  let firstName = "";
  let lastName = "";
  let email = "";
  let isAdmin = false;
  if (signedIn) {
    //Check on portfolio courseId
    const response = await axios.get("/api/getPorfolioCourseId.php");
    let { data } = response;
    portfolioCourseId = data.portfolioCourseId;
    firstName = data.firstName;
    lastName = data.lastName;
    email = data.email;

    if (portfolioCourseId == "") {
      portfolioCourseId = "not_created";
    }
    const isAdminResponse = await fetch(`/api/checkForCommunityAdmin.php`);
    const isAdminJson = await isAdminResponse.json();
    isAdmin = isAdminJson.isAdmin;
  }
  return { signedIn, portfolioCourseId, isAdmin, firstName, lastName, email };
}

function NavLinkTab({ to, children, dataTest }) {
  // TODO: use end only when path is "/"
  return (
    <NavLink to={to} end data-test={dataTest}>
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
            p="4px"
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
  let { signedIn, portfolioCourseId, isAdmin, firstName, lastName, email } =
    useLoaderData();

  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  let location = useLocation();

  // const navColor = useColorModeValue("#ffffff", "gray.800");
  const navigate = useNavigate();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
    navigate(newHref);
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
              </Center>
            </GridItem>
            <GridItem area="menus">
              <HStack spacing={8}>
                <NavLinkTab to="/" dataTest="Home">
                  Home
                </NavLinkTab>
                <NavLinkTab to="community" dataTest="Community">
                  Community
                </NavLinkTab>
                {signedIn && (
                  <>
                    <NavLinkTab
                      to={`portfolio/${portfolioCourseId}`}
                      dataTest="Portfolio"
                    >
                      Portfolio
                    </NavLinkTab>
                    <Center
                      cursor="pointer"
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
                      <NavLinkTab to="admin" dataTest="Admin">
                        Admin
                      </NavLinkTab>
                    )}
                  </>
                )}
              </HStack>
            </GridItem>
            <GridItem area="rightHeader">
              {signedIn ? (
                <Center h="40px" mr="10px">
                  <Menu>
                    <MenuButton>
                      <Avatar size="sm" name={`${firstName} ${lastName}`} />
                    </MenuButton>
                    <MenuList>
                      <VStack mb="20px">
                        <Avatar size="xl" name={`${firstName} ${lastName}`} />
                        <Text>
                          {firstName} {lastName}
                        </Text>
                        <Text>{email}</Text>
                        <ButtonGroup size="sm" isAttached variant="outline">
                          <Button
                            leftIcon={<FaSun />}
                            onClick={toggleColorMode}
                            isDisabled={colorMode == "light"}
                          >
                            Light
                          </Button>
                          <Button
                            leftIcon={<FaMoon />}
                            onClick={toggleColorMode}
                            isDisabled={colorMode == "dark"}
                            // cursor="not-allowed"
                          >
                            Dark
                          </Button>
                          {/* <Button
                            leftIcon={<FaRobot />}
                            onClick={() => setColorMode("system")}
                            // isDisabled={colorMode == ""}
                            // cursor="not-allowed"
                          >
                            Auto
                          </Button> */}
                        </ButtonGroup>
                      </VStack>
                      <MenuItem as="a" href="/signout">
                        Sign Out
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Center>
              ) : (
                <Center h="40px" mr="10px">
                  <Button
                    data-test="Nav to signin"
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
          <Outlet context={{ signedIn }} />
        </GridItem>
      </Grid>
    </>
  );
}
