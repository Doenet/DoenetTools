import React from 'react';
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
} from '@chakra-ui/react';
import { GoKebabVertical } from 'react-icons/go';
import { Link } from 'react-router-dom';

export default function ActivityCard({
  imageLink,
  imagePath,
  label,
  fullName,
}) {
  return (
    <Card width="180px" height="180px" p="0" m="0">
      <Link to={imageLink}>
        <Image
          maxHeight="120px"
          maxWidth="180px"
          src={imagePath}
          alt="Activity Card Image"
          borderTopRadius="md"
          objectFit="cover"
        />
      </Link>
      <CardBody p="1">
        <Flex columnGap="2px">
          <Avatar size="sm" name={fullName} />
          <Box width="120px" p="1">
            <Text
              height="27px"
              lineHeight="1.1"
              fontSize="xs"
              fontWeight="700"
              noOfLines={2}
            >
              {label}
            </Text>
            <Text fontSize="xs" noOfLines={1}>
              {fullName}
            </Text>
          </Box>

          <Menu>
            <MenuButton height="30px">
              <Icon color="#949494" as={GoKebabVertical} boxSize={4} />
            </MenuButton>
            <MenuList zIndex="1000">
              <MenuItem>one</MenuItem>
              <MenuItem>two</MenuItem>
              <MenuItem>three</MenuItem>
              <MenuItem>four</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardBody>
    </Card>
  );
}
