import { Image, Link as ChakraLink } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

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
      data-test="Home"
    >
      <Image
        alt="Doenet Logo"
        src="/Doenet_Logo_Frontpage_color_small_text.png"
        height="45px"
        width="130px"
        marginLeft="10px"
        marginTop="-3px"
      />
    </ChakraLink>
  );
}
