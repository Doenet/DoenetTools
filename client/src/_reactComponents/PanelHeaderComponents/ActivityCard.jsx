import React from "react";
import {
  Box,
  Image,
  Avatar,
  Text,
  Card,
  CardBody,
  Flex,
  MenuItem,
  Menu,
  MenuButton,
  Icon,
  MenuList,
} from "@chakra-ui/react";
import { GoKebabVertical } from "react-icons/go";
import { Link } from "react-router-dom";

export default function ActivityCard({
  imageLink = "",
  imagePath,
  label,
  fullName,
  menuItems,
  isUserPortfolio,
  courseLabel,
  courseImage,
  courseColor,
}) {
  if (!imagePath) {
    imagePath = "/activity_default.jpg";
  }

  //Define the avatar
  let avatar = <Avatar size="sm" name={fullName} />;
  if (isUserPortfolio == "0") {
    if (courseColor == "none") {
      avatar = (
        <Avatar
          size="sm"
          borderRadius="md"
          src={`/drive_pictures/${courseImage}`}
        />
      );
    } else {
      avatar = (
        <Avatar
          size="sm"
          borderRadius="md"
          bg={`#${courseColor}`}
          icon={<></>}
        />
      );
    }
  }
  //<Avatar size="sm" name={fullName} />

  //Note: when we have a menu width 140px becomes 120px
  return (
    <Card width="180px" height="180px" p="0" m="0" data-test="Activity Card">
      <Link to={imageLink}>
        <Image
          data-test="Card Image Link"
          height="120px"
          width="180px"
          src={imagePath}
          alt="Activity Card Image"
          borderTopRadius="md"
          objectFit="cover"
          cursor="pointer"
        />
      </Link>
      <CardBody p="1">
        <Flex columnGap="2px">
          {avatar}

          <Box width="140px" p="1">
            <Text
              data-test="Card Label"
              height="26px"
              lineHeight="1.1"
              fontSize="xs"
              fontWeight="700"
              noOfLines={2}
              textAlign="left"
            >
              {label}
            </Text>
            <Text
              fontSize="xs"
              noOfLines={1}
              textAlign="left"
              data-test="Card Full Name"
            >
              {isUserPortfolio == "1" ? fullName : courseLabel}
            </Text>
          </Box>

          {menuItems ? (
            <Menu>
              <MenuButton height="30px" data-test="Card Menu Button">
                <Icon color="#949494" as={GoKebabVertical} boxSize={4} />
              </MenuButton>
              <MenuList zIndex="1000">{menuItems}</MenuList>
            </Menu>
          ) : null}
        </Flex>
      </CardBody>
    </Card>
  );
}
