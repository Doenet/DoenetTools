import { ReactNode, useState } from "react";
import {
  Grid,
  GridItem,
  HStack,
  Link as ChakraLink,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  VStack,
  SkipNavLink,
  SkipNavContent,
  Checkbox,
  Box,
  Tooltip,
  Spacer,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  IconButton,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { Outlet, useFetcher, useLoaderData, useLocation } from "react-router";
import { NavLink as ReactRouterLink } from "react-router";
import RouterLogo from "../RouterLogo";
import { HamburgerIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import axios from "axios";
import { createNameNoTag } from "../utils/names";
import { ContentDescription, DoenetmlVersion, License } from "../types";
import { WithSideBanners } from "../layout/WithSideBanners";

// Match the logo's rounded bold lettering with heavier nav text for consistency.
const navTextStyles = { fontWeight: 500, letterSpacing: "0.01em" };
const navBarHeight = "40px";
const navItemPaddingX = "1rem";
const navItemHoverBg = "doenet.lightGray";

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

type NavbarMenuOption = {
  label: string;
  to?: string; // for internal React Router links
  href?: string; // for external links
};

type NavItem = {
  label: string;
  to?: string; // for React Router links
  href?: string; // for external links
  children?: NavItem[]; // if present, renders as menu/dropdown
};

type NavSection = {
  heading?: string; // optional section label for mobile
  items: NavItem[];
};

export function SiteHeader() {
  const { user, allLicenses, allDoenetmlVersions } = useLoaderData() as {
    user?: User;
    allLicenses: License[];
    allDoenetmlVersions: DoenetmlVersion[];
  };

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

  const navSectionGeneral: NavItem[] = [
    { label: "Explore", to: "explore" },
    { label: "About", to: "about" },
    {
      label: "Get Involved",
      children: [
        { label: "How to get involved", href: "https://pages.doenet.org" },
        { label: "Community discussions", href: discussHref },
        { label: "Software/technical", href: "https://github.com/Doenet" },
      ],
    },
  ];

  const navSectionRole: NavItem[] = [
    {
      label: "Instructors",
      children: [{ label: "Get support", href: discussHref }],
    },
    {
      label: "Authors",
      children: [
        { label: "Authoring documentation", href: "https://docs.doenet.org" },
        { label: "Get support", href: discussHref },
      ],
    },
    {
      label: "Students",
      children: [{ label: "Join with code", to: "code" }],
    },
  ];

  const navSectionAccount: NavItem[] = [];
  if (user && !user.isAnonymous) {
    navSectionAccount.push({
      label: "My Activities",
      to: `activities/${user.userId}`,
    });
    navSectionAccount.push({ label: "Assigned to Me", to: "assigned" });
  }

  // Group navigation into sections
  const navSections: NavSection[] = [
    { items: navSectionGeneral },
    { heading: "By Role", items: navSectionRole },
  ];

  // Add account section if user is logged in
  if (navSectionAccount.length > 0) {
    navSections.push({ items: navSectionAccount });
  }

  const renderDesktopSections = (sections: NavSection[]) => {
    return sections.flatMap((section, sectionIndex) => {
      const items = section.items.map((item, index) => {
        if (item.children) {
          return (
            <DesktopNavbarMenu
              key={`${sectionIndex}-${index}`}
              label={item.label}
              options={item.children}
            />
          );
        } else {
          return (
            <DesktopNavbarItem
              key={`${sectionIndex}-${index}`}
              to={item.to || item.href || ""}
              dataTest={item.label}
            >
              {item.label}
            </DesktopNavbarItem>
          );
        }
      });

      // Add divider after general section (first section)
      if (sectionIndex === 0) {
        return [
          ...items,
          <Box
            key={`divider-${sectionIndex}`}
            w="1px"
            h="24px"
            bg="gray.300"
            alignSelf="center"
            mx="16px"
          />,
        ];
      }

      return items;
    });
  };

  const account = user ? (
    <AccountIconAndCard user={user} />
  ) : (
    <DesktopNavbarItem to="/signIn" dataTest="signIn">
      Sign up/Log In
    </DesktopNavbarItem>
  );

  const desktopNav = (
    <HStack h="100%" spacing="0px" display={{ base: "none", md: "flex" }}>
      <RouterLogo paddingRight="0.5rem" />
      {renderDesktopSections(navSections)}
      <Spacer />
      {account}
    </HStack>
  );

  const mobileNav = (
    <HStack
      h="100%"
      spacing="0px"
      display={{ base: "flex", md: "none" }}
      justifyContent="space-between"
      width="100%"
    >
      <RouterLogo paddingRight="0.5rem" />
      <HStack spacing="0.5rem">
        {user && <AccountIconAndCard user={user} />}
        <MobileNavbar sections={navSections} user={user} />
      </HStack>
    </HStack>
  );

  const header = (
    <>
      {desktopNav}
      {mobileNav}
    </>
  );

  return (
    <>
      <SkipNavLink zIndex="2000">Skip to content</SkipNavLink>
      <Grid
        templateAreas={`"siteHeader"
        "main"`}
        gridTemplateRows={`${navBarHeight} auto`}
        width="100vw"
        height="100vh"
      >
        <GridItem
          area="siteHeader"
          as="header"
          width="100vw"
          m="0"
          h={navBarHeight}
        >
          <WithSideBanners gutterColumns={1} padding="0px">
            {header}
          </WithSideBanners>
        </GridItem>
        <GridItem area="main" as="main" margin="0" overflowY="auto">
          <SkipNavContent />
          <Outlet context={siteContext} />
        </GridItem>
      </Grid>
    </>
  );
}

function DesktopNavbarItem({
  to,
  children,
  dataTest,
}: {
  to: string;
  children: ReactNode;
  dataTest: string;
}) {
  return (
    <ChakraLink
      as={ReactRouterLink}
      to={to}
      data-test={dataTest}
      h="100%"
      alignContent="center"
      _hover={{ backgroundColor: navItemHoverBg }}
    >
      <Text
        px={navItemPaddingX}
        fontSize="md"
        fontWeight={navTextStyles.fontWeight}
        letterSpacing={navTextStyles.letterSpacing}
      >
        {children}
      </Text>
    </ChakraLink>
  );
}

function DesktopNavbarMenu({
  label,
  options,
}: {
  label: string;
  options: NavbarMenuOption[];
}) {
  const button = (
    <MenuButton
      color="doenet.canvastext"
      fontWeight={navTextStyles.fontWeight}
      letterSpacing={navTextStyles.letterSpacing}
      h="100%"
      px={navItemPaddingX}
      borderRadius="0"
      _hover={{ backgroundColor: navItemHoverBg }}
    >
      {label}
    </MenuButton>
  );
  return (
    // Hack: setting gutter to -5 aligns dropdown with header bar
    <Menu gutter={-4}>
      {button}
      <MenuList borderRadius="0">
        {options.map((option, index) => (
          <MenuItem
            key={index}
            as={ReactRouterLink}
            backgroundColor="transparent"
            _hover={{ backgroundColor: navItemHoverBg }}
            to={option.to}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

function MobileNavbar({
  sections,
  user,
}: {
  sections: NavSection[];
  user?: User;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeSubmenu, setActiveSubmenu] = useState<NavItem | null>(null);

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      setActiveSubmenu(item);
    } else {
      onClose();
      setActiveSubmenu(null);
    }
  };

  const handleBack = () => {
    setActiveSubmenu(null);
  };

  return (
    <>
      <IconButton
        aria-label="Open navigation menu"
        icon={<HamburgerIcon />}
        onClick={onOpen}
        variant="ghost"
        size="sm"
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {activeSubmenu ? activeSubmenu.label : "Menu"}
          </DrawerHeader>
          <DrawerBody>
            {activeSubmenu ? (
              <VStack align="stretch" spacing={0}>
                <Box
                  as="button"
                  onClick={handleBack}
                  py={3}
                  px={4}
                  display="flex"
                  alignItems="center"
                  _hover={{ backgroundColor: navItemHoverBg }}
                  cursor="pointer"
                >
                  <ChevronLeftIcon mr={2} />
                  <Text fontWeight="medium">Back</Text>
                </Box>
                <Divider />
                {activeSubmenu.children?.map((child, index) => (
                  <MobileNavbarItem
                    key={index}
                    item={child}
                    onClick={() => handleItemClick(child)}
                  />
                ))}
              </VStack>
            ) : (
              <VStack align="stretch" spacing={0}>
                {sections.map((section, sectionIndex) => (
                  <Box key={sectionIndex}>
                    {section.heading && (
                      <Text
                        px={4}
                        py={2}
                        fontSize="xs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        color="gray.600"
                      >
                        {section.heading}
                      </Text>
                    )}
                    {section.items.map((item, itemIndex) => (
                      <MobileNavbarItem
                        key={itemIndex}
                        item={item}
                        onClick={() => handleItemClick(item)}
                      />
                    ))}
                    {sectionIndex < sections.length - 1 && <Divider my={2} />}
                  </Box>
                ))}
                {!user || user.isAnonymous ? (
                  <>
                    <Divider my={2} />
                    <MobileNavbarItem
                      item={{ label: "Sign up/Log In", to: "/signIn" }}
                      onClick={() =>
                        handleItemClick({
                          label: "Sign up/Log In",
                          to: "/signIn",
                        })
                      }
                    />
                  </>
                ) : null}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function MobileNavbarItem({
  item,
  onClick,
}: {
  item: NavItem;
  onClick: () => void;
}) {
  const hasChildren = !!item.children;

  const content = (
    <>
      <Text>{item.label}</Text>
      {hasChildren && <ChevronLeftIcon transform="rotate(180deg)" />}
    </>
  );

  const boxStyles = {
    py: 3,
    px: 4,
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    _hover: { backgroundColor: navItemHoverBg },
    cursor: "pointer" as const,
    minH: "44px",
  };

  if (item.to) {
    return (
      <Box as={ReactRouterLink} to={item.to} onClick={onClick} {...boxStyles}>
        {content}
      </Box>
    );
  } else if (item.href) {
    return (
      <Box as="a" href={item.href} onClick={onClick} {...boxStyles}>
        {content}
      </Box>
    );
  } else {
    return (
      <Box onClick={onClick} {...boxStyles}>
        {content}
      </Box>
    );
  }
}

function AccountIconAndCard({ user }: { user: NonNullable<User> }) {
  const currentPath = useLocation().pathname;
  const fetcher = useFetcher();

  return (
    <Menu>
      <MenuButton ml="0.5rem">
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
            {user.isAnonymous ? "[Anonymous]" : createNameNoTag(user)}
          </Text>
          <Text>
            {user.isAnonymous
              ? `Nickname: ${createNameNoTag(user)}`
              : user.email}
          </Text>
          {user.isAnonymous ? (
            <ChakraLink href={`/signIn`}>Sign in to save work</ChakraLink>
          ) : null}
          {!user.isAnonymous ? (
            <Box height="30px" alignContent="center" marginTop="20px">
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
        {user.isAnonymous && (
          <MenuItem
            as={ChakraLink}
            // When name change complete, redirect back to current page
            href={`/changeName?redirect=${currentPath}`}
          >
            Update name
          </MenuItem>
        )}
        <MenuItem
          as="a"
          href="/api/login/logout"
          onClick={() => {
            localStorage.removeItem("scratchPad");
          }}
        >
          {user.isAnonymous ? "Clear anonymous data" : "Log Out"}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
