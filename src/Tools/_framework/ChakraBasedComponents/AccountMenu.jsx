import {
  Avatar,
  Center,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useColorMode,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import React from "react";
import { FaMoon, FaRobot, FaSun } from "react-icons/fa";

export default function AccountMenu({ firstName, lastName, email }) {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();

  return (
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
  );
}
