import styled from "styled-components";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

const LogoButton = styled.button`
  background-image:
    linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/Doenet_Logo_Frontpage_color_small_text.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 130px 45px;
  transition: 300ms;
  background-color: var(--canvas);
  width: 130px;
  height: 35px;
  display: inline-block;
  justify-content: center;
  border-radius: 2px;
  align-items: center;
  border-style: none;
  // border-radius: 50%;
  margin-top: 2px;
  margin-left: 10px;
  cursor: "pointer";
`;

export default function RouterLogo() {
  return (
    <ChakraLink
      as={ReactRouterLink}
      to="/"
      _hover={{ textDecoration: "none" }}
      justifyContent="center"
      height="100%"
      alignItems="center"
      aria-label="Home"
    >
      <LogoButton />
    </ChakraLink>
  );
}
