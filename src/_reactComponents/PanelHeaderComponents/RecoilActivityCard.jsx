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
}) {
  const fetcher = useFetcher();
  // const setItemByDoenetId = useSetRecoilState(itemByDoenetId(doenetId));
  const { compileActivity, updateAssignItem } = useCourse(courseId);

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
              height="26px"
              lineHeight="1.1"
              fontSize="xs"
              fontWeight="700"
              noOfLines={2}
              textAlign="left"
            >
              {label}
            </Text>
            <Text fontSize="xs" noOfLines={1} textAlign="left">
              {fullName}
            </Text>
          </Box>

          <Menu>
            <MenuButton height="30px">
              <Icon color="#949494" as={GoKebabVertical} boxSize={4} />
            </MenuButton>
            <MenuList zIndex="1000">
              {isPublic ? (
                <MenuItem
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
