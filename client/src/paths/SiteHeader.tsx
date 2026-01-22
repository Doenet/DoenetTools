import { useState } from "react";
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
import {
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
  Link as RouterLink,
} from "react-router";
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

type NavItem = {
  label: string;
  to?: string; // for React Router links
  href?: string; // for external links
  subItems?: NavItem[]; // if present, renders as menu/dropdown
};

type NavSection = {
  heading?: string; // optional section label for mobile
  items: NavItem[];
};

/**
 * Main site header component that provides responsive navigation.
 * Renders a horizontal navbar on desktop (md+) with dropdown menus,
 * and a hamburger menu with drill-down navigation on mobile.
 * Includes skip navigation link for accessibility.
 */
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
      subItems: [
        { label: "How to get involved", href: "https://pages.doenet.org" },
        { label: "Community discussions", href: discussHref },
        { label: "Software/technical", href: "https://github.com/Doenet" },
      ],
    },
  ];

  const navSectionRole: NavItem[] = [
    // TODO: Add Instructors link on header once we have pages for them.
    // {
    //   label: "Instructors",
    //   subItems: [{ label: "Get support", href: ?? }],
    // },
    {
      label: "Authors",
      subItems: [
        { label: "Authoring documentation", href: "https://docs.doenet.org" },
        { label: "Get support", href: discussHref },
      ],
    },
    {
      label: "Students",
      subItems: [{ label: "Join with code", to: "code" }],
    },
  ];

  const navSectionAccount: NavItem[] =
    user && !user.isAnonymous
      ? [
          {
            label: "My Activities",
            to: `activities/${user.userId}`,
          },
          { label: "Assigned to Me", to: "assigned" },
        ]
      : [];

  // Group navigation into sections
  const navSections: NavSection[] = [
    { items: navSectionGeneral },
    { heading: "By Role", items: navSectionRole },
  ];

  // Add account section if user is logged in
  if (navSectionAccount.length > 0) {
    navSections.push({ heading: "My Account", items: navSectionAccount });
  }

  const renderDesktopSections = (sections: NavSection[]) => {
    return sections.flatMap((section, sectionIndex) => {
      const items = section.items.map((item, index) => {
        if (item.subItems) {
          return (
            <DesktopNavMenu key={`${sectionIndex}-${index}`} navItem={item} />
          );
        } else {
          return (
            <DesktopNavLeaf key={`${sectionIndex}-${index}`} navItem={item} />
          );
        }
      });

      // Add divider if not first section
      if (sectionIndex !== 0) {
        return [
          <Box
            key={`divider-${sectionIndex}`}
            w="1px"
            h="24px"
            bg="gray.300"
            alignSelf="center"
            mx="16px"
          />,
          ...items,
        ];
      }

      return items;
    });
  };

  const account = user ? (
    <AccountIconAndCard user={user} />
  ) : (
    <DesktopNavLeaf navItem={{ label: "Sign up/Log In", to: "/signIn" }} />
  );

  const desktopNav = (
    <HStack
      h="100%"
      // Only show on larger screens
      display={{ base: "none", lg: "flex" }}
      spacing="0px"
    >
      <RouterLogo paddingRight="0.5rem" />
      {renderDesktopSections([navSections[0], navSections[1]])}
      <Spacer />
      {navSectionAccount.length > 0 &&
        renderDesktopSections([{ items: navSectionAccount }])}
      {account}
    </HStack>
  );

  const mobileNav = (
    <HStack
      // Only show on small screens
      display={{ base: "flex", lg: "none" }}
      h="100%"
      spacing="0px"
      justifyContent="space-between"
    >
      <RouterLogo />
      <HStack spacing="1rem">
        {user && <AccountIconAndCard user={user} />}
        <MobileNavAll sections={navSections} user={user} />
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
        <GridItem area="siteHeader" width="100vw" m="0" h={navBarHeight}>
          <WithSideBanners gutterColumns={1} padding="0px">
            {header}
          </WithSideBanners>
        </GridItem>
        <GridItem area="main" margin="0" overflowY="auto">
          <SkipNavContent />
          <Outlet context={siteContext} />
        </GridItem>
      </Grid>
    </>
  );
}

/**
 * Desktop navigation item for direct links.
 * Renders as a styled link in the horizontal navbar with hover effects.
 * Only visible on md breakpoint and above.
 */
function DesktopNavLeaf({ navItem }: { navItem: NavItem }) {
  const { to, href, label } = navItem;
  if (to) {
    return (
      <ChakraLink
        as={RouterLink}
        to={to}
        data-test={label}
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
          {label}
        </Text>
      </ChakraLink>
    );
  }

  if (href) {
    return (
      <ChakraLink
        href={href}
        data-test={label}
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
          {label}
        </Text>
      </ChakraLink>
    );
  }

  return (
    <ChakraLink
      data-test={label}
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
        {label}
      </Text>
    </ChakraLink>
  );
}

/**
 * Desktop dropdown menu for navigation items with children.
 * Displays a menu button that reveals a dropdown list on hover/click.
 * Only visible on md breakpoint and above.
 */
function DesktopNavMenu({ navItem }: { navItem: NavItem }) {
  const { label, subItems } = navItem;
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
        {subItems?.map((option, index) => {
          if (option.to) {
            return (
              <MenuItem
                key={index}
                as={RouterLink}
                to={option.to}
                backgroundColor="transparent"
                _hover={{ backgroundColor: navItemHoverBg }}
              >
                {option.label}
              </MenuItem>
            );
          }

          if (option.href) {
            return (
              <MenuItem
                key={index}
                as="a"
                href={option.href}
                backgroundColor="transparent"
                _hover={{ backgroundColor: navItemHoverBg }}
              >
                {option.label}
              </MenuItem>
            );
          }

          return (
            <MenuItem
              key={index}
              backgroundColor="transparent"
              _hover={{ backgroundColor: navItemHoverBg }}
            >
              {option.label}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

/**
 * Mobile navigation with hamburger menu and drawer.
 * Uses a right-side drawer with drill-down pattern for nested navigation.
 * When a parent item is clicked, the drawer transitions to show its children
 * with a back button. Only visible below md breakpoint.
 */
function MobileNavAll({
  sections,
  user,
}: {
  sections: NavSection[];
  user?: User;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeSubmenu, setActiveSubmenu] = useState<NavItem | null>(null);

  const handleItemClick = (navItem: NavItem) => {
    if (navItem.subItems) {
      setActiveSubmenu(navItem);
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
        icon={<HamburgerIcon width="full" height="full" p="5px" />}
        onClick={onOpen}
        variant="ghost"
        width={navBarHeight}
        height={navBarHeight}
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
                {activeSubmenu.subItems?.map((child, index) => (
                  <MobileNavLeaf
                    key={index}
                    navItem={child}
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
                      <MobileNavLeaf
                        key={itemIndex}
                        navItem={item}
                        onClick={() => handleItemClick(item)}
                      />
                    ))}
                    {sectionIndex < sections.length - 1 && <Divider my={2} />}
                  </Box>
                ))}
                {!user || user.isAnonymous ? (
                  <>
                    <Divider my={2} />
                    <MobileNavLeaf
                      navItem={{ label: "Sign up/Log In", to: "/signIn" }}
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

/**
 * Individual navigation item in the mobile drawer.
 * Renders as a touch-friendly link (44px min height) with optional chevron
 * indicator for items with children. Supports both internal routes and external links.
 */
function MobileNavLeaf({
  navItem,
  onClick,
}: {
  navItem: NavItem;
  onClick: () => void;
}) {
  const hasChildren = !!navItem.subItems;

  const content = (
    <>
      <Text>{navItem.label}</Text>
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

  if (navItem.to) {
    return (
      <Box as={RouterLink} to={navItem.to} onClick={onClick} {...boxStyles}>
        {content}
      </Box>
    );
  } else if (navItem.href) {
    return (
      <Box as="a" href={navItem.href} onClick={onClick} {...boxStyles}>
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

/**
 * User account menu with avatar icon.
 * Displays user avatar that opens a dropdown menu with account information,
 * settings (author mode toggle), and sign out option. Shows different options
 * for anonymous vs authenticated users.
 */
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
