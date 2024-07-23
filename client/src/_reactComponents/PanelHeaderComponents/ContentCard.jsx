import React, { useState, useEffect } from "react";
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
  Input,
  Tooltip,
} from "@chakra-ui/react";
import { GoKebabVertical } from "react-icons/go";
import { Link, useFetcher } from "react-router-dom";

export default function ContentCard({
  imageLink = "",
  id,
  imagePath,
  isAssigned,
  isFolder,
  isPublic,
  title,
  ownerName,
  menuItems,
  suppressAvatar = false,
  showOwnerName = true,
  editableTitle = false,
  autoFocusTitle = false,
  showStatus = true,
}) {
  if (!imagePath) {
    imagePath = "/activity_default.jpg";
  }
  const [cardTitle, setCardTitle] = useState(title);
  const fetcher = useFetcher();

  useEffect(() => {
    setCardTitle(title);
  }, [title]);

  function saveUpdatedTitle() {
    fetcher.submit(
      { _action: "update title", id, cardTitle, isFolder },
      { method: "post" },
    );
  }

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
          {suppressAvatar ? null : (
            <Tooltip label={ownerName}>
              <Avatar size="sm" name={ownerName} />
            </Tooltip>
          )}

          <Box width="160px" minWidth="0px" p="1">
            {editableTitle ? (
              <Tooltip label={cardTitle}>
                <Input
                  value={cardTitle}
                  maxLength={191}
                  size="xs"
                  border="none"
                  padding="0"
                  margin="0"
                  height="1em"
                  fontWeight="bold"
                  autoFocus={autoFocusTitle}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setCardTitle(e.target.value)}
                  onBlur={saveUpdatedTitle}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      saveUpdatedTitle();
                      e.target.blur();
                    }
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip label={cardTitle}>
                <Text
                  data-test="Card Label"
                  lineHeight="1.1"
                  fontSize="xs"
                  fontWeight="700"
                  noOfLines={2}
                  textAlign="left"
                  overflow="hidden"
                >
                  {cardTitle}
                </Text>
              </Tooltip>
            )}
            {showOwnerName ? (
              <Text
                fontSize="xs"
                noOfLines={1}
                textAlign="left"
                data-test="Card Full Name"
              >
                {ownerName}
              </Text>
            ) : null}
            {showStatus ? (
              <Text
                fontSize="xs"
                noOfLines={1}
                textAlign="left"
                //data-test="Card Full Name"
              >
                {isPublic ? "Public" : "Private"}
                {isFolder ? "" : isAssigned ? " / Assigned" : " / Unassigned"}
              </Text>
            ) : null}
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
