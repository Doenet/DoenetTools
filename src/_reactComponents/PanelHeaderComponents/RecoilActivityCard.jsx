import React, { useRef } from "react";
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
import { Link, useFetcher } from "react-router-dom";

// import { useRecoilState, useSetRecoilState } from "recoil";
// import { pageToolViewAtom } from "../../Tools/_framework/NewToolRoot";

export default function RecoilActivityCard({
  doenetId,
  imagePath,
  label,
  pageDoenetId,
  fullName,
  isPublic,
  courseId,
  version,
  content,
  setDoenetId,
  onClose,
  onOpen,
}) {
  const fetcher = useFetcher();
  // const setItemByDoenetId = useSetRecoilState(itemByDoenetId(doenetId));

  // const [recoilPageToolView, setRecoilPageToolView] =
  //   useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    fetcher.submit({ _action: "noop" }, { method: "post" });
    location.href = newHref;
  }

  return (
    <Card width="180px" height="180px" p="0" m="0" data-test="Activity Card">
      <Link to={`/portfolioeditor/${doenetId}/${pageDoenetId}`}>
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
          <Avatar size="sm" name={fullName} />
          <Box width="120px" p="1">
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
              {fullName}
            </Text>
          </Box>

          <Menu>
            <MenuButton height="30px" data-test="Card Menu Button">
              <Icon color="#949494" as={GoKebabVertical} boxSize={4} />
            </MenuButton>
            <MenuList zIndex="1000">
              {isPublic ? (
                <MenuItem
                  data-test="Make Private Menu Item"
                  onClick={() => {
                    fetcher.submit(
                      { _action: "Make Private", doenetId },
                      { method: "post" },
                    );
                  }}
                >
                  Make Private
                </MenuItem>
              ) : (
                <MenuItem
                  data-test="Make Public Menu Item"
                  onClick={() => {
                    //THINGS WE NEED FROM THE DB
                    //- Version of DoenetML
                    //Eventually we want the content too (multipage)
                  }}
                >
                  Make Public
                </MenuItem>
              )}
              <MenuItem
                data-test="Delete Menu Item"
                onClick={() => {
                  fetcher.submit(
                    { _action: "Delete", doenetId },
                    { method: "post" },
                  );
                }}
              >
                Delete
              </MenuItem>
              <MenuItem
                data-test="Settings Menu Item"
                onClick={() => {
                  setDoenetId(doenetId);
                  onOpen();
                }}
              >
                Settings
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardBody>
    </Card>
  );
}
