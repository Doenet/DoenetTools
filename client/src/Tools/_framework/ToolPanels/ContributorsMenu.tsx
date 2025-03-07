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
  Link as ChakraLink,
  Tooltip,
  HStack,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router";
import { createFullName } from "../../../_utils/names";
import { Content, ActivityHistoryItem } from "../../../_utils/types";

export default function ContributorsMenu({
  contributorHistory,
  activity,
}: {
  contributorHistory: ActivityHistoryItem[];
  activity: Content;
}) {
  if (!activity.owner) {
    return null;
  }

  const byLine = (
    <>
      by{" "}
      <Tooltip
        label={`Go to ${createFullName(activity.owner)}'s shared activities`}
        openDelay={1000}
      >
        <ChakraLink
          as={ReactRouterLink}
          to={`/sharedActivities/${activity.owner.userId}`}
          aria-label={`Go to ${createFullName(activity.owner)}'s shared activities`}
        >
          {createFullName(activity.owner)}
        </ChakraLink>
      </Tooltip>
    </>
  );

  let recentByLine: React.JSX.Element | null = null;
  if (contributorHistory.length > 0) {
    recentByLine = (
      <>
        remixed from{" "}
        <Tooltip
          label={`Go to ${contributorHistory[0].prevName}`}
          openDelay={1000}
        >
          <ChakraLink
            as={ReactRouterLink}
            to={`/activityViewer/${contributorHistory[0].prevContentId}`}
            aria-label={`Go to ${contributorHistory[0].prevName}`}
          >
            {contributorHistory[0].prevName} by{" "}
            {createFullName(contributorHistory[0].prevOwner)}
          </ChakraLink>
        </Tooltip>
      </>
    );
  }

  const avatars = [
    <Avatar
      key={`avatarauthor`}
      margin="6px 12px"
      border="0"
      size="sm"
      name={createFullName(activity.owner)}
    />,
  ];

  avatars.push(
    ...contributorHistory.map((contrib_hist, i) => (
      <Avatar
        key={`avatar${i}`}
        margin="6px 12px"
        border="0"
        size="sm"
        name={createFullName(contrib_hist.prevOwner)}
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
            padding="0px"
            paddingRight="12px"
            cursor="default"
          >
            <Tooltip
              label={`Go to ${createFullName(activity.owner)}'s shared activities`}
              openDelay={1000}
            >
              <ChakraLink
                as={ReactRouterLink}
                to={`/sharedActivities/${activity.owner.userId}`}
                aria-label={`Go to ${createFullName(activity.owner)}'s shared activities`}
              >
                {avatars[0]}{" "}
              </ChakraLink>
            </Tooltip>
            <HStack cursor="default">
              <Text noOfLines={1} maxWidth="400px">
                {activity.name}
              </Text>{" "}
              <Text>by {createFullName(activity.owner)}</Text>
            </HStack>
          </MenuItem>
          {contributorHistory.map((contrib_hist, i) => {
            const menuText = `${contrib_hist.prevName} by ${createFullName(contrib_hist.prevOwner)}`;
            const activityRef = `/activityViewer/${contrib_hist.prevContentId}`;
            const activityLabel = `Go to ${contrib_hist.prevName}`;
            const userRef = `/sharedActivities/${contrib_hist.prevOwner.userId}`;
            const userLabel = `Go to ${createFullName(contrib_hist.prevOwner)}'s shared activities`;
            return (
              <MenuItem
                key={`mi${i}`}
                data-test={`contributors menu item ${i}`}
                padding="0px"
                as={ReactRouterLink}
                to={activityRef}
                aria-label={activityLabel}
              >
                <Tooltip label={userLabel} openDelay={1000}>
                  <ChakraLink
                    as={ReactRouterLink}
                    to={userRef}
                    aria-label={userLabel}
                  >
                    {avatars[i + 1]}{" "}
                  </ChakraLink>
                </Tooltip>

                <Tooltip label={activityLabel} openDelay={1000}>
                  <ChakraLink
                    as={ReactRouterLink}
                    to={activityRef}
                    aria-label={activityLabel}
                  >
                    <Text padding="10px 0px">{menuText}</Text>
                  </ChakraLink>
                </Tooltip>
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
