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
import { Link, useFetcher } from 'react-router-dom';
import { itemByDoenetId, useCourse } from '../Course/CourseActions';
import { useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../../Tools/_framework/NewToolRoot';

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
}) {
  const fetcher = useFetcher();
  const setItemByDoenetId = useSetRecoilState(itemByDoenetId(doenetId));
  const { compileActivity, updateAssignItem } = useCourse(courseId);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  const imageLink = `/portfolioeditor/${doenetId}?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`;

  return (
    <Card width="180px" height="180px" p="0" m="0">
      <Link
        to={imageLink}
        onClick={() => {
          setPageToolView({
            page: 'portfolioeditor',
            tool: 'editor',
            view: '',
            params: {},
          });
        }}
      >
        <Image
          height="120px"
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
                      { _action: 'Make Private', doenetId },
                      { method: 'post' },
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

                    setItemByDoenetId({
                      version,
                      isSinglePage: true,
                      content,
                    });

                    compileActivity({
                      activityDoenetId: doenetId,
                      isAssigned: true,
                      courseId,
                      // successCallback: () => {
                      //   addToast('Activity Assigned.', toastType.INFO);
                      // },
                    });
                    updateAssignItem({
                      doenetId,
                      isAssigned: true,
                      successCallback: () => {
                        fetcher.submit(
                          { _action: 'Make Public', doenetId },
                          { method: 'post' },
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
                    { _action: 'Delete', doenetId },
                    { method: 'post' },
                  );
                }}
              >
                Delete
              </MenuItem>
              <MenuItem as={Link} to={`/portfolio/${doenetId}/settings`}>
                Settings
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardBody>
    </Card>
  );
}
