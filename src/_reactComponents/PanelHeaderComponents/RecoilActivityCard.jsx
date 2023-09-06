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
  Center,
  VStack,
} from "@chakra-ui/react";
import { GoKebabVertical } from "react-icons/go";
import { Link, useFetcher } from "react-router-dom";
import {
  // itemByDoenetId,
  useCourse,
} from "../Course/CourseActions";
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
  isNewActivity = false,
}) {
  const fetcher = useFetcher();
  const { compileActivity, updateAssignItem } = useCourse(courseId);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    fetcher.submit({ _action: "noop" }, { method: "post" });
    location.href = newHref;
  }

  const cardJSX = (
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

                    compileActivity({
                      activityDoenetId: doenetId,
                      isAssigned: true,
                      courseId,
                      activity: {
                        version,
                        isSinglePage: true,
                        content,
                      },
                      // successCallback: () => {
                      //   addToast('Activity Assigned.', toastType.INFO);
                      // },
                    });
                    updateAssignItem({
                      doenetId,
                      isAssigned: true,
                      successCallback: () => {
                        fetcher.submit(
                          { _action: "Make Public", doenetId },
                          { method: "post" },
                        );
                        //addToast(assignActivityToast, toastType.INFO);
                      },
                    });
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

  if (isNewActivity) {
    return (
      <VStack spacing={1}>
        {cardJSX}
        <Center
          width="180px"
          height="30px"
          p="10px"
          m="0"
          bg="blue.400"
          data-test="New Activity Indicator"
          borderBottomLeftRadius="lg"
          borderBottomRightRadius="lg"
          fontWeight="700"
          boxShadow="base"
        >
          NEW
        </Center>
      </VStack>
    );
  } else {
    return <>{cardJSX}</>;
  }
}
