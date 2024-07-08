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

export default function ContributorsMenu({ contributorHistory, owner }) {
  // TODO: add name once have it in database
  let byLine = `by ${owner.name}`;

  let recentByLine = "";
  if (contributorHistory.length > 0) {
    let prevActivity = contributorHistory[0].prevDoc.document.activity;
    recentByLine = `remixed from ${prevActivity.name} by ${prevActivity.owner.name}`;
  }

  const avatars = [
    <Avatar
      key={`avatarauthor`}
      m={0}
      border="0"
      size="sm"
      name={owner.name}
      mr="4px"
    />,
  ];

  avatars.push(
    ...contributorHistory.map((contrib_hist, i) => (
      <Avatar
        key={`avatar${i}`}
        m={0}
        border="0"
        size="sm"
        name={contrib_hist.prevDoc.document.activity.owner.name}
        mr="4px"
      />
    )),
  );

  return (
    <Flex>
      <Menu>
        <MenuButton as="button" data-test="contributors menu">
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
          <MenuItem
            key={"miauthor"}
            data-test={"contributors menu item author"}
            as={Link}
            to={`/publicActivities/${owner.userId}`}
          >
            {avatars[0]} <Text ml="4px">{owner.name}</Text>
          </MenuItem>
          {contributorHistory.map((contrib_hist, i) => {
            let prevActivity = contrib_hist.prevDoc.document.activity;
            let label = `${prevActivity.name} by ${prevActivity.owner.name}`;
            const href = `/activityViewer/${prevActivity.activityId}`;

            return (
              <MenuItem
                key={`mi${i}`}
                as={Link}
                to={href}
                data-test={`contributors menu item ${i}`}
              >
                {avatars[i + 1]} <Text ml="4px">{label}</Text>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
      <Flex flexDirection="column" pt="10px" data-test="info on contributors">
        <Text fontSize="14px" ml="4px" lineHeight="1">
          {byLine}
        </Text>
        <Text fontSize="12px" ml="4px" mt="0px">
          {recentByLine}
          {contributorHistory.length > 2 && ", ..."}
        </Text>
      </Flex>
    </Flex>
  );
}
