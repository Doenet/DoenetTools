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
import { createFullName } from "../../../_utils/names";

export default function ContributorsMenu({ contributorHistory, owner }) {
  let byLine = `by ${createFullName(owner)}`;

  let recentByLine = "";
  if (contributorHistory.length > 0) {
    let prevActivity = contributorHistory[0].prevDoc.document.activity;
    recentByLine = `remixed from ${prevActivity.name} by ${createFullName(prevActivity.owner)}`;
  }

  const avatars = [
    <Avatar
      key={`avatarauthor`}
      m={0}
      border="0"
      size="sm"
      name={createFullName(owner)}
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
        name={createFullName(contrib_hist.prevDoc.document.activity.owner)}
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
            to={`/sharedActivities/${owner.userId}`}
          >
            {avatars[0]} <Text ml="4px">{createFullName(owner)}</Text>
          </MenuItem>
          {contributorHistory.map((contrib_hist, i) => {
            let prevActivity = contrib_hist.prevDoc.document.activity;
            let label = `${prevActivity.name} by ${createFullName(prevActivity.owner)}`;
            const href = `/activityViewer/${prevActivity.id}`;

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
