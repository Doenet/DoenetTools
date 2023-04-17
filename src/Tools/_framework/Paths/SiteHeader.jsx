import { Box, Center, Icon, Text } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { Outlet, useLoaderData, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { checkIfUserClearedOut } from '../../../_utils/applicationUtils';
import RouterLogo from '../RouterLogo';
import { pageToolViewAtom } from '../NewToolRoot';
import { useRecoilState } from 'recoil';
import { FaCog } from 'react-icons/fa';

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
    const response = await fetch('/api/getPorfolioCourseId.php');

    const data = await response.json();
    portfolioCourseId = data.portfolioCourseId;
    if (data.portfolioCourseId == '') {
      portfolioCourseId = 'not_created';
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

const TopContainer = styled.div`
  display: grid;
  grid-template-rows: 40px auto;
`;

//Minimal container.  The idea is the Outlet should provide its own layout.
const ContentContainer = styled.main`
  grid-row: 2 / 3;
  margin: 0;
`;

function MenuItem({ to, children, dataTest }) {
  return (
    <StyledMenuItem
      to={to}
      data-test={dataTest}
      className={({ isActive, isPending }) =>
        location.pathname === '/' || isActive
          ? 'active'
          : isPending
          ? 'pending'
          : ''
      }
    >
      {children}
    </StyledMenuItem>
  );
}

export function SiteHeader(props) {
  let data = useLoaderData();
  const isAdmin = data?.isAdmin;
  const navigate = useNavigate();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef('');

  if (navigateTo.current != '') {
    const newHref = navigateTo.current;
    navigateTo.current = '';
    location.href = newHref;
  }

  let signInButton = (
    <Button
      dataTest="Nav to course"
      size="medium"
      value="My Courses"
      onClick={() => {
        navigateTo.current = '/course';
        setRecoilPageToolView({
          page: 'course',
          tool: '',
          view: '',
          params: {},
        });
      }}
    />
  );
  if (!data.signedIn) {
    signInButton = (
      <Button
        dataTest="Nav to signin"
        size="medium"
        value="Sign In"
        onClick={() => {
          navigateTo.current = '/signin';
          setRecoilPageToolView({
            page: 'signin',
            tool: '',
            view: '',
            params: {},
          });
        }}
      />
    );
  }

  return (
    <>
      <TopContainer>
        <Box
          as="header"
          gridRow="1 / 2"
          backgroundColor="#fff"
          color="#000"
          height="40px"
          position="fixed"
          top="0"
          width="100%"
          margin="0"
          display="flex"
          justifyContent="space-between"
          borderBottom="1px solid var(--mainGray)"
          zIndex="1200"
        >
          {data.signedIn ? (
            <Center columnGap="6px">
              <RouterLogo />
              <Text>Doenet</Text>
              <Icon
                ml="10px"
                cursor="pointer"
                fontSize="16pt"
                as={FaCog}
                onClick={() => {
                  navigate('/settings');
                }}
              />
            </Center>
          ) : (
            <Branding>
              <RouterLogo />
              <Text>Doenet</Text>
            </Branding>
          )}
          <BarMenu>
            <MenuItem dataTest="Home" to="/">
              Home
            </MenuItem>
            <MenuItem dataTest="Community" to="community">
              Community
            </MenuItem>
            {data.signedIn ? (
              <MenuItem
                dataTest="Portfolio"
                to={`portfolio/${data.portfolioCourseId}`}
              >
                Portfolio
              </MenuItem>
            ) : null}
            {isAdmin ? <MenuItem to={`/admin`}>Admin</MenuItem> : null}
          </BarMenu>
          <SignInButtonContainer>{signInButton}</SignInButtonContainer>
        </Box>

        <ContentContainer>
          <Outlet context={{ signedIn: data.signedIn }} />
        </ContentContainer>
      </TopContainer>
    </>
  );
}
