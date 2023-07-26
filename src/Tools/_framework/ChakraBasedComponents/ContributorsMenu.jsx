import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Flex,
  AvatarGroup,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function ContributorsMenu({ contributors }) {
  const deduppedContributors = contributors.reduce((acc, current) => {
    const isDuplicate = acc.find((item) => item.courseId === current.courseId);
    if (!isDuplicate) {
      acc.push(current);
    }
    return acc;
  }, []);
  let byLine = `by ${contributors[0].firstName} ${contributors[0].lastName}`;
  if (contributors[0].isUserPortfolio == "0") {
    byLine = `in ${contributors[0].courseLabel}`;
  }
  let recentByLine = "";
  if (contributors.length > 1) {
    recentByLine = `remixed from ${contributors[1].firstName} ${contributors[1].lastName}`;
    if (contributors[1].isUserPortfolio == "0") {
      recentByLine = `remixed from  ${contributors[1].courseLabel}`;
    }
  }

  const avatars = deduppedContributors.map((contributor, i) => {
    const fullName = `${contributor.firstName} ${contributor.lastName}`;
    let avatar = (
      <Avatar key={i} m={0} border="0" size="sm" name={fullName} mr="4px" />
    );
    if (contributor.isUserPortfolio == "0") {
      if (contributor.courseColor == "none") {
        avatar = (
          <Avatar
            size="sm"
            border="0"
            borderRadius="md"
            src={`/drive_pictures/${contributor.courseImage}`}
          />
        );
      } else {
        avatar = (
          <Avatar
            size="sm"
            border="0"
            borderRadius="md"
            bg={`#${contributor.courseColor}`}
            icon={<></>}
          />
        );
      }
    }
    return avatar;
  });

  return (
    <Flex>
      <Menu>
        <MenuButton as="Button">
          <Flex>
            <AvatarGroup size="sm" max={2}>
              {avatars}
            </AvatarGroup>
            <Flex ml="4px" mt="10px">
              <ChevronDownIcon />
            </Flex>
          </Flex>
        </MenuButton>
        <MenuList maxHeight="40vh" overflowY="auto">
          {deduppedContributors.map((contributor, i) => {
            let label = `${contributor.firstName} ${contributor.lastName}`;
            const href = `/publicportfolio/${contributor.courseId}`;
            if (contributor.isUserPortfolio == "0") {
              label = contributor.courseLabel;
            }
            return (
              <MenuItem key={`mi${i}`} as={Link} to={href}>
                {avatars[i]} <Text ml="4px">{label}</Text>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
      <Flex flexDirection="column" pt="10px">
        <Text fontSize="14px" ml="4px" lineHeight="1">
          {byLine}
        </Text>
        <Text fontSize="12px" ml="4px" mt="0px">
          {recentByLine}
          {contributors.length > 2 && ", ..."}
        </Text>
      </Flex>
    </Flex>
  );
}
