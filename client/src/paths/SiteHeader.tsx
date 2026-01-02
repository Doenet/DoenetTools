import { ReactNode, useState } from "react";
import {
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  IconButton,
  HStack,
  Link as ChakraLink,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  VStack,
  Show,
  useBreakpointValue,
  SkipNavLink,
  SkipNavContent,
  Hide,
  Checkbox,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { HiOutlineMail } from "react-icons/hi";
import { BsDiscord } from "react-icons/bs";
import { Outlet, useFetcher, useLoaderData, useLocation } from "react-router";
import { NavLink } from "react-router";
import RouterLogo from "../RouterLogo";
import { ExternalLinkIcon, HamburgerIcon } from "@chakra-ui/icons";
import axios from "axios";
import { createNameNoTag } from "../utils/names";
import { ContentDescription, DoenetmlVersion, License } from "../types";

export type User =
  | {
      email: string;
      userId: string;
      firstNames: string | null;
      lastNames: string;
      isAnonymous: boolean;
      isEditor: boolean;
      isAuthor: boolean;
    }
  | undefined;

export type SiteContext = {
  user?: User;
  exploreTab: number | null;
  setExploreTab: (_: number | null) => void;
  addTo: ContentDescription | null;
  setAddTo: (_: ContentDescription | null) => void;
  allLicenses: License[];
  allDoenetmlVersions: DoenetmlVersion[];
};

export async function loader() {
  const {
    data: { user },
  } = await axios.get("/api/user/getMyUserInfo");

  const {
    data: { allLicenses },
  } = await axios.get("/api/info/getAllLicenses");

  const {
    data: { allDoenetmlVersions },
  } = await axios.get("/api/info/getAllDoenetmlVersions");

  return { user, allLicenses, allDoenetmlVersions };
}

function NavLinkTab({
  to,
  children,
  dataTest,
}: {
  to: string;
  children: ReactNode;
  dataTest: string;
}) {
  // TODO: use end only when path is "/"
  return (
    <NavLink to={to} end data-test={dataTest}>
      {({ isActive }) => {
        // let spinner = null;
        // if (isPending) {
        //   spinner = <Spinner size="sm" />;
        // }
        let color = "doenet.canvastext";
        let borderBottomStyle: "none" | "solid" = "none";
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

function NavLinkDropdownTab({
  to,
  children,
  dataTest,
}: {
  to: string;
  children: ReactNode;
  dataTest: string;
}) {
  // TODO: use end only when path is "/"
  return (
    <NavLink to={to} end data-test={dataTest}>
      {({ isActive }) => {
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

export function SiteHeader() {
  const { user, allLicenses, allDoenetmlVersions } = useLoaderData() as {
    user?: User;
    allLicenses: License[];
    allDoenetmlVersions: DoenetmlVersion[];
  };

  const currentPath = useLocation().pathname;

  const [exploreTab, setExploreTab] = useState<number | null>(null);

  const [addTo, setAddTo] = useState<ContentDescription | null>(null);

  const siteContext: SiteContext = {
    user,
    exploreTab,
    setExploreTab,
    addTo,
    setAddTo,
    allLicenses,
    allDoenetmlVersions,
  };

  const discussHref = `${import.meta.env.VITE_DISCOURSE_URL}${
    user && user?.isAnonymous === false ? "/session/sso" : ""
  }`;

  const helpMenuShouldFocusFirst = useBreakpointValue(
    { base: false, md: true },
    { ssr: false },
  );

  const fetcher = useFetcher();

  return (
    <>
      <SkipNavLink zIndex="2000">Skip to content</SkipNavLink>
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
          height="40px"
        >
          <Grid
            height="40px"
            position="fixed"
            top="0"
            zIndex="1000"
            backgroundColor="#ffffff"
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
                  <NavLinkTab to="explore" dataTest="Explore">
                    Explore
                  </NavLinkTab>
                  {!user || user.isAnonymous ? (
                    <NavLinkTab to="code" dataTest="Class Code">
                      Class Code
                    </NavLinkTab>
                  ) : null}
                  {user && !user.isAnonymous && (
                    <>
                      <NavLinkTab
                        to={`activities/${user.userId}`}
                        dataTest="Activities"
                      >
                        My Activities
                      </NavLinkTab>
                      <NavLinkTab to={`assigned`} dataTest="Assigned">
                        Assigned to Me
                      </NavLinkTab>
                      {user.isEditor && (
                        <NavLinkTab to="curate" dataTest="Curate">
                          Curate
                        </NavLinkTab>
                      )}
                    </>
                  )}
                  <ChakraLink
                    href={discussHref}
                    isExternal
                    data-test="Discourse Link"
                    _hover={{ textDecoration: "none" }}
                  >
                    <Center
                      h="40px"
                      borderBottomStyle="none"
                      borderBottomWidth="0px"
                      p="4px"
                    >
                      <Text fontSize="md" color="doenet.canvastext">
                        Discuss
                      </Text>
                    </Center>
                  </ChakraLink>
                </HStack>
              </GridItem>
            </Show>
            <GridItem area="rightHeader">
              <Flex columnGap="10px">
                <Menu autoSelect={helpMenuShouldFocusFirst}>
                  <MenuButton
                    as={Button}
                    color="doenet.canvastext"
                    variant="ghost"
                  >
                    Help
                  </MenuButton>
                  <MenuList>
                    <ChakraLink href="mailto:info@doenet.org">
                      <MenuItem>
                        <HStack>
                          <HiOutlineMail fontSize="12pt" />
                          <Text>Email us</Text>
                        </HStack>
                      </MenuItem>
                    </ChakraLink>
                    <ChakraLink href="https://discord.gg/PUduwtKJ5h">
                      <MenuItem>
                        <HStack>
                          <BsDiscord fontSize="12pt" />
                          <Text>Join our Discord</Text>
                        </HStack>
                      </MenuItem>
                    </ChakraLink>

                    <ChakraLink
                      href="https://docs.doenet.org"
                      isExternal
                      data-test="Documentation Link"
                    >
                      <MenuItem>
                        <HStack>
                          <ExternalLinkIcon />
                          <Text>Authoring Docs</Text>
                        </HStack>
                      </MenuItem>
                    </ChakraLink>
                  </MenuList>
                </Menu>

                {user ? (
                  <Center h="40px" mr="10px">
                    <Menu>
                      <MenuButton>
                        <Avatar
                          size="sm"
                          name={`${user.isAnonymous ? "?" : createNameNoTag(user)}`}
                        />
                      </MenuButton>
                      <MenuList>
                        <VStack mb="20px">
                          <Avatar
                            size="xl"
                            name={`${user.isAnonymous ? "?" : createNameNoTag(user)}`}
                          />
                          <Text>
                            {user.isAnonymous
                              ? "[Anonymous]"
                              : createNameNoTag(user)}
                          </Text>
                          <Text>
                            {user.isAnonymous
                              ? `Nickname: ${createNameNoTag(user)}`
                              : user.email}
                          </Text>
                          {user.isAnonymous ? (
                            <ChakraLink href={`/signIn`}>
                              Sign in to save work
                            </ChakraLink>
                          ) : null}
                          {!user.isAnonymous ? (
                            <Box
                              height="30px"
                              alignContent="center"
                              marginTop="20px"
                            >
                              <Tooltip
                                label="In author mode, activities default to displaying with their source code"
                                openDelay={500}
                                placement="bottom-end"
                              >
                                <label>
                                  Author mode:{" "}
                                  <Checkbox
                                    marginTop="3px"
                                    isChecked={user.isAuthor}
                                    onChange={() => {
                                      fetcher.submit(
                                        {
                                          path: "user/setIsAuthor",
                                          isAuthor: !user.isAuthor,
                                        },
                                        {
                                          method: "post",
                                          encType: "application/json",
                                        },
                                      );
                                    }}
                                  />
                                </label>
                              </Tooltip>
                            </Box>
                          ) : null}
                        </VStack>
                        {!user.isAnonymous && (
                          <MenuItem
                            as={ChakraLink}
                            // When name change complete, redirect back to current page
                            href={`/changeName?redirect=${currentPath}`}
                          >
                            Update name
                          </MenuItem>
                        )}
                        <MenuItem as="a" href="/api/login/logout">
                          {user.isAnonymous
                            ? "Clear anonymous data"
                            : "Log Out"}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Center>
                ) : (
                  <Center h="40px" mr="10px">
                    <NavLinkTab to="/signIn" dataTest="signIn">
                      Sign up/Log In
                    </NavLinkTab>
                  </Center>
                )}
                <Hide above="md">
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
                        <NavLinkDropdownTab to="explore" dataTest="Explore">
                          Explore
                        </NavLinkDropdownTab>
                        {!user || user.isAnonymous ? (
                          <NavLinkDropdownTab to="code" dataTest="Class Code">
                            Class Code
                          </NavLinkDropdownTab>
                        ) : null}
                        {user && !user.isAnonymous && (
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
                            {user.isEditor && (
                              <NavLinkDropdownTab to="curate" dataTest="Curate">
                                Curate
                              </NavLinkDropdownTab>
                            )}
                            <MenuItem>
                              <ChakraLink
                                href={discussHref}
                                isExternal
                                data-test="Discourse Link"
                                _hover={{ textDecoration: "none" }}
                                w="100%"
                              >
                                <Center
                                  h="40px"
                                  borderBottomStyle="none"
                                  borderBottomWidth="0px"
                                  p="4px"
                                >
                                  <Text fontSize="md" color="doenet.canvastext">
                                    Discuss
                                  </Text>
                                </Center>
                              </ChakraLink>
                            </MenuItem>
                          </>
                        )}
                      </MenuList>
                    </Menu>
                  </Center>
                </Hide>
              </Flex>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="main" as="main" margin="0" overflowY="auto">
          <SkipNavContent />
          <Outlet context={siteContext} />
        </GridItem>
      </Grid>
    </>
  );
}
