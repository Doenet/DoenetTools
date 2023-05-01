import { Box, Center, Grid, GridItem, Icon, Text } from "@chakra-ui/react";
import React, { useRef } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import RouterLogo from "../RouterLogo";
import { pageToolViewAtom } from "../NewToolRoot";
import { useRecoilState } from "recoil";
import { FaCog } from "react-icons/fa";

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

const SignInButtonContainer = styled.div`
  margin: auto 10px auto 0px;
`;

const Branding = styled.span`
  margin: 4px 0px 4px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 110px;
  cursor: default;
  font-size: 16px;
`;

const StyledMenuItem = styled(NavLink)`
  padding: 8px;
  color: black;
  cursor: pointer;
  text-decoration: none;
  &.active {
    color: var(--mainBlue);
    border-bottom: 2px solid var(--mainBlue);
  }
`;

const BarMenu = styled.div`
  margin: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  column-gap: 20px;
`;

function MenuItem({ to, children, dataTest }) {
  return (
    <StyledMenuItem
      to={to}
      data-test={dataTest}
      className={({ isActive, isPending }) =>
        location.pathname === "/" || isActive
          ? "active"
          : isPending
          ? "pending"
          : ""
      }
    >
      {children}
    </StyledMenuItem>
  );
}

export function SiteHeader(props) {
  let data = useLoaderData();
  const isAdmin = data?.isAdmin;
  // const navigate = useNavigate();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
  }

  // onClick={() => {
  //   navigateTo.current = "/settings";
  //   setRecoilPageToolView({
  //     page: "settings",
  //     tool: "",
  //     view: "",
  //     params: {},
  //   });
  // }}

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
        >
          <Grid
            height="40px"
            position="fixed"
            top="0"
            zIndex="1200"
            borderBottom="1px solid var(--mainGray)"
            paddingBottom="1px"
            width="100%"
            margin="0"
            display="flex"
            justifyContent="space-between"
            templateAreas={`"leftHeader menus rightHeader" 
        "main"`}
            gridTemplateColumns="1f auto 1f"
          >
            <GridItem area="leftHeader">
              <Branding>
                <RouterLogo />
                <Text>Doenet</Text>
              </Branding>
            </GridItem>
            <GridItem area="menus">
              <BarMenu>
                <MenuItem dataTest="Home" to="/">
                  Home
                </MenuItem>
                <MenuItem dataTest="Community" to="community">
                  Community
                </MenuItem>
                {data.signedIn ? (
                  <>
                    <MenuItem
                      dataTest="Portfolio"
                      to={`portfolio/${data.portfolioCourseId}`}
                    >
                      Portfolio
                    </MenuItem>
                    <MenuItem
                      dataTest="My Courses"
                      to="course"
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
                    </MenuItem>
                  </>
                ) : null}
                {isAdmin ? <MenuItem to={`/admin`}>Admin</MenuItem> : null}
              </BarMenu>
            </GridItem>
            <GridItem area="rightHeader">
              {data.signedIn ? (
                <Box>Avatar Menu</Box>
              ) : (
                <Button
                  dataTest="Nav to signin"
                  size="medium"
                  value="Sign In"
                  onClick={() => {
                    navigateTo.current = "/signin";
                    setRecoilPageToolView({
                      page: "signin",
                      tool: "",
                      view: "",
                      params: {},
                    });
                  }}
                />
              )}
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="main" as="main" margin="0" overflowY="scroll">
          <Outlet context={{ signedIn: data.signedIn }} />
        </GridItem>
      </Grid>
    </>
  );
}
