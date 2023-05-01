import {
  Box,
  Center,
  Icon,
  Text,
  useColorMode,
  Button,
  Flex,
  Tabs,
  Tab,
  TabList,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
// import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
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

// const SignInButtonContainer = styled.div`
//   margin: auto 10px auto 0px;
// `;

// const Branding = styled.span`
//   margin: 4px 0px 4px 10px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   width: 110px;
//   cursor: default;
//   font-size: 16px;
// `;

// const StyledMenuItem = styled(NavLink)`
//   padding: 8px;
//   color: black;
//   cursor: pointer;
//   text-decoration: none;
//   &.active {
//     color: var(--mainBlue);
//     border-bottom: 2px solid var(--mainBlue);
//   }
// `;

// const BarMenu = styled.div`
//   margin: 0px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   font-size: 16px;
//   column-gap: 20px;
// `;

// function MenuItem({ to, children, dataTest }) {
//   return (
//     <StyledMenuItem
//       to={to}
//       data-test={dataTest}
//       className={({ isActive, isPending }) =>
//         location.pathname === "/" || isActive
//           ? "active"
//           : isPending
//           ? "pending"
//           : ""
//       }
//     >
//       {children}
//     </StyledMenuItem>
//   );
// }

export function SiteHeader(props) {
  let data = useLoaderData();
  const isAdmin = data?.isAdmin;
  const { colorMode, toggleColorMode } = useColorMode();
  const [activeTab, setActiveTab] = useState(0);
  let location = useLocation();

   const navColor = useColorModeValue("#ffffff", "gray.800")
  // const navigate = useNavigate();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
  }

  // let signInButton = (
  //   <Button
  //     // dataTest="Nav to course"
  //     size="xs"
  //     borderRadius={20}
  //     onClick={() => {
  //       navigateTo.current = "/course";
  //       setRecoilPageToolView({
  //         page: "course",
  //         tool: "",
  //         view: "",
  //         params: {},
  //       });
  //     }}
  //   >
  //     <Text fontSize="xs">My Courses</Text>
  //   </Button>
  // );
  // if (!data.signedIn) {
  //   signInButton = (
  //     <Button
  //       // dataTest="Nav to signin"
  //       size="xs"
  //       onClick={() => {
  //         navigateTo.current = "/signin";
  //         setRecoilPageToolView({
  //           page: "signin",
  //           tool: "",
  //           view: "",
  //           params: {},
  //         });
  //       }}
  //     >
  //       <Text fontSize="xs">My Courses</Text>
  //     </Button>
  //   );
  // }

  return (
    <>
      <Box
        display="grid"
        gridTemplateRows="40px auto"
        width="100vw"
        height="100vh"
      >
        <Flex
          as="header"
          backgroundColor={navColor}
          opacity="90%"
          px={5}
          height="40px"
          position="fixed"
          top={0}
          left={0}
          right={0}
          justifyContent="space-between"
          alignItems="center"
          boxShadow="0 2px 2px -2px rgba(0,0,0,.2)"
          zIndex="10"
        >
          <Flex gap={3} justifyContent="center" alignItems="center">
            <Flex>
              <RouterLogo />
              <Text ml={1}>Doenet</Text>
            </Flex>
            <Button
              size="xs"
              variant="ghost"
              borderRadius={5}
              onClick={toggleColorMode}
            >
              <Icon as={colorMode === "light" ? FaMoon : FaSun} h={4} w={4}/>
            </Button>
            {data.signedIn && (
              <Button
                size="xs"
                variant="ghost"
                borderRadius={5}
                onClick={() => {
                  navigateTo.current = "/settings";
                  setRecoilPageToolView({
                    page: "settings",
                    tool: "",
                    view: "",
                    params: {},
                  });
                }}
              >
                <Icon as={FaCog} h={4} w={4}/>
              </Button>
            )}
          </Flex>

          <Tabs index={activeTab}> 
            <TabList
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              display={{ base: "none", md: "flex" }}
            >
              <Link to="/">
                <Tab onClick={() => setActiveTab(0)}>Home</Tab>
              </Link>
              <Link to="/community">
                <Tab onClick={() => setActiveTab(1)}>Community</Tab>
              </Link>
              {data.signedIn && (
                <Link to={`portfolio/${data.portfolioCourseId}`}>
                  <Tab onClick={() => setActiveTab(2)}>Portfolio</Tab>
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin">
                  <Tab onClick={() => setActiveTab(3)}>Admin</Tab>
                </Link>
              )}
            </TabList>
          </Tabs>
          <Box>
            <Button
              // dataTest="Nav to course"
              size="xs"
              borderRadius={20}
              onClick={() => {
                navigateTo.current = data.signedIn ? "/course" : "/signin";
                setRecoilPageToolView({
                  page: data.signedIn ? "course" : "signin",
                  tool: "",
                  view: "",
                  params: {},
                });
              }}
            >
              <Text fontSize="xs">My Courses</Text>
            </Button>
          </Box>
        </Flex>
        <Box h={40} w="100%" />
        <Outlet context={{ signedIn: data.signedIn }} />
      </Box>
    </>
  );
}
