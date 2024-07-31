import React, { useRef } from "react";
import {
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  IconButton,
  HStack,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  VStack,
  Show,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HiOutlineMail } from "react-icons/hi";
import { BsGithub, BsDiscord } from "react-icons/bs";
import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import RouterLogo from "../RouterLogo";
import { ExternalLinkIcon, HamburgerIcon } from "@chakra-ui/icons";
import axios from "axios";
import { createFullName } from "../../../_utils/names";

export async function loader() {
  //Check if signedIn
  const profileInfo = await checkIfUserClearedOut();
  let signedIn = true;
  if (profileInfo.cookieRemoved) {
    signedIn = false;
  }
  let user = null;
  let isAdmin = false;
  if (signedIn) {
    const response = await axios.get("/api/getUser");
    let { data } = response;
    user = data;

    const isAdminResponse = await axios.get(`/api/checkForCommunityAdmin`);
    let { data: isAdminData } = isAdminResponse;
    isAdmin = isAdminData.isAdmin;
  }
  return { signedIn, user, isAdmin };
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

function NavLinkDropdownTab({ to, children, dataTest }) {
  // TODO: use end only when path is "/"
  return (
    <NavLink to={to} end data-test={dataTest}>
      {({ isActive, isPending }) => {
        // let spinner = null;
        // if (isPending) {
        //   spinner = <Spinner size="sm" />;
        // }
        let color = "doenet.canvastext";
        if (isActive) {
          color = "doenet.mainBlue";
        }

        return (
          <MenuItem>
            <Center
              h="40px"
              borderBottomStyle="none"
              borderBottomWidth="0px"
              borderBottomColor={color}
              p="4px"
            >
              <Text fontSize="md" color={color}>
                {children}
              </Text>
              {/* {spinner} */}
            </Center>
          </MenuItem>
        );
      }}
    </NavLink>
  );
}

export function SiteHeader(props) {
  let { signedIn, user, isAdmin } = useLoaderData();
  const { childComponent } = props;

  let location = useLocation();

  const navigate = useNavigate();

  let navigateTo = useRef("");

  const helpMenuShouldFocusFirst = useBreakpointValue(
    { base: false, md: true },
    { ssr: false },
  );

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
              </Center>
            </GridItem>
            <Show above="md">
              <GridItem area="menus">
                <HStack spacing={8}>
                  <NavLinkTab to="/" dataTest="Home">
                    Home
                  </NavLinkTab>
                  <NavLinkTab to="library" dataTest="Library">
                    Library
                  </NavLinkTab>
                  <NavLinkTab to="community" dataTest="Community">
                    Community
                  </NavLinkTab>
                  {!signedIn || user.anonymous ? (
                    <NavLinkTab to="classCode" dataTest="Class Code">
                      Class Code
                    </NavLinkTab>
                  ) : null}
                  {signedIn && !user.anonymous && (
                    <>
                      <NavLinkTab
                        to={`activities/${user.userId}`}
                        dataTest="Activities"
                      >
                        Activities
                      </NavLinkTab>
                      <NavLinkTab to={`assigned`} dataTest="Assigned">
                        Assigned
                      </NavLinkTab>
                      {isAdmin && (
                        <NavLinkTab to="admin" dataTest="Admin">
                          Admin
                        </NavLinkTab>
                      )}
                    </>
                  )}
                </HStack>
              </GridItem>
            </Show>
            <GridItem area="rightHeader">
              <Flex columnGap="10px">
                <Menu autoSelect={helpMenuShouldFocusFirst}>
                  <MenuButton as={Button} color="doenet.canvastext">
                    Help
                  </MenuButton>
                  <MenuList>
                    <Link href="mailto:info@doenet.org">
                      <MenuItem>
                        <HStack>
                          <HiOutlineMail fontSize="12pt" />
                          <Text>Email us</Text>
                        </HStack>
                      </MenuItem>
                    </Link>
                    <Link href="https://discord.gg/PUduwtKJ5h">
                      <MenuItem>
                        <HStack>
                          <BsDiscord fontSize="12pt" />
                          <Text>Join our Discord</Text>
                        </HStack>
                      </MenuItem>
                    </Link>

                    <Link
                      href="https://www.doenet.org/activityViewer/_7KL7tiBBS2MhM6k1OrPt4"
                      isExternal
                      data-test="Documentation Link"
                    >
                      <MenuItem>
                        <HStack>
                          <ExternalLinkIcon />
                          <Text>Authoring Docs</Text>
                        </HStack>
                      </MenuItem>
                    </Link>
                  </MenuList>
                </Menu>

                {signedIn ? (
                  <Center h="40px" mr="10px">
                    <Menu>
                      <MenuButton>
                        <Avatar size="sm" name={`${createFullName(user)}`} />
                      </MenuButton>
                      <MenuList>
                        <VStack mb="20px">
                          <Avatar size="xl" name={`${createFullName(user)}`} />
                          <Text>{createFullName(user)}</Text>
                          <Text>{user.anonymous ? "" : user.email}</Text>
                        </VStack>
                        <MenuItem as="a" href="/signOut">
                          Sign Out
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Center>
                ) : (
                  <Center h="40px" mr="10px">
                    <a href="/api/auth/google">Sign In</a>
                    {/* <NavLinkTab
                      to="http://localhost:8000/api/auth/google"
                      dataTest="signIn"
                    >
                      Sign In
                    </NavLinkTab> */}
                  </Center>
                )}
                <Show below="md">
                  <Center h="40px" mr="10px">
                    <Menu autoSelect={false}>
                      <MenuButton
                        as={IconButton}
                        aria-label="Menu"
                        icon={<HamburgerIcon boxSize="30px" />}
                      />
                      <MenuList>
                        <NavLinkDropdownTab to="/" dataTest="Home">
                          Home
                        </NavLinkDropdownTab>
                        <NavLinkDropdownTab to="library" dataTest="Library">
                          Library
                        </NavLinkDropdownTab>
                        <NavLinkDropdownTab to="community" dataTest="Community">
                          Community
                        </NavLinkDropdownTab>
                        {!signedIn || user.anonymous ? (
                          <NavLinkDropdownTab
                            to="classCode"
                            dataTest="Class Code"
                          >
                            Class Code
                          </NavLinkDropdownTab>
                        ) : null}
                        {signedIn && !user.anonymous && (
                          <>
                            <NavLinkDropdownTab
                              to={`activities/${user.userId}`}
                              dataTest="Activities"
                            >
                              Activities
                            </NavLinkDropdownTab>
                            <NavLinkDropdownTab
                              to={`assigned`}
                              dataTest="Assigned"
                            >
                              Assigned
                            </NavLinkDropdownTab>
                            {isAdmin && (
                              <NavLinkDropdownTab to="admin" dataTest="Admin">
                                Admin
                              </NavLinkDropdownTab>
                            )}
                          </>
                        )}
                      </MenuList>
                    </Menu>
                  </Center>
                </Show>
              </Flex>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="main" as="main" margin="0" overflowY="scroll">
          {/* <Box>test</Box> */}
          {childComponent ? childComponent : <Outlet context={{ signedIn }} />}
        </GridItem>
      </Grid>
    </>
  );
}
