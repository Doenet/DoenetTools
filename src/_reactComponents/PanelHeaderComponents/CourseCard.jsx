// import axios from 'axios';
import {
  Box,
  Button,
  Icon,
  Text,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stack,
  FormLabel,
  Input,
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Card,
  CardBody,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useFetcher, useNavigate } from "react-router-dom";
import { GoKebabVertical } from "react-icons/go";

export function CourseCard({ course }) {
  const fetcher = useFetcher();
  const {
    isOpen: duplicateIsOpen,
    onOpen: duplicateOnOpen,
    onClose: duplicateOnClose,
  } = useDisclosure();
  const {
    isOpen: settingsIsOpen,
    onOpen: settingsOnOpen,
    onClose: settingsOnClose,
  } = useDisclosure();
  const firstField = useRef();

  //for duplicate form/drawer
  const [newLabel, setNewLabel] = useState();
  const [settingsRenameLabel, setSettingsRenameLabel] = useState();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [areValidDates, setAreValidDates] = useState(true);
  const [dateDifference, setDateDifference] = useState();

  useEffect(() => {
    let sourceStart = new Date(startDate);
    let newEnd = new Date(endDate);
    if (newEnd >= sourceStart) {
      setDateDifference(
        (newEnd.getTime() - sourceStart.getTime()) / (1000 * 3600 * 24),
      );
      setAreValidDates(true);
      return;
    }
    setAreValidDates(false);
  }, [startDate, endDate]);

  return (
    <>
      <Card width="200px" height="200px" p="0" m="0" data-test="Course Card">
        <Link to={`/course?tool=dashboard&courseId=${course.courseId}`}>
          <Image
            data-test="Card Image Link"
            height="134px"
            width="200px"
            src={`/drive_pictures/${course.image}`}
            objectFit="cover"
            borderTopRadius="md"
            cursor="pointer"
          />
        </Link>
        <CardBody p="1">
          <Flex columnGap="2px">
            <Flex
              flexDirection="column"
              fontSize="sm"
              rowGap="10px"
              p="1"
              width="170px"
            >
              <Text
                data-test="Course Label"
                height="20px"
                lineHeight="1.1"
                fontWeight="700"
                noOfLines={2}
                textAlign="left"
              >
                {course.label}
              </Text>
              <Text data-test="Course Role">{course.roleLabel}</Text>
            </Flex>
            {course.canModifyCourseSettings == "1" && (
              <Menu>
                <MenuButton height="30px" data-test="Card Menu Button">
                  <Icon color="#949494" as={GoKebabVertical} boxSize={4} />
                </MenuButton>
                <MenuList zIndex="10">
                  <MenuItem onClick={duplicateOnOpen}>Duplicate</MenuItem>
                  <MenuItem
                    onClick={() => {
                      fetcher.submit(
                        { _action: "Delete", courseId: course.courseId },
                        { method: "post" },
                      );
                    }}
                  >
                    Delete
                  </MenuItem>
                  <MenuItem onClick={settingsOnOpen}>Settings</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </CardBody>
      </Card>

      <Drawer
        isOpen={duplicateIsOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={duplicateOnClose}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Duplicate &quot;{course.label}&quot;
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing="24px">
              <FormControl isRequired isInvalid={!newLabel}>
                <FormLabel htmlFor="username">New Course Label</FormLabel>
                <Input
                  ref={firstField}
                  id="label"
                  placeholder="Please enter a new course label"
                  onChange={(e) => setNewLabel(e.currentTarget.value)}
                />
                {!newLabel && (
                  <FormErrorMessage>Course label is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="sourceStartDate">
                  Source Course Start Date
                </FormLabel>
                <Input
                  placeholder="Select source course start date"
                  size="md"
                  type="date"
                  onChange={(e) => setStartDate(e.currentTarget.value)}
                />
                <FormHelperText>
                  Start dates are used to adjust the new course&apos;s activity
                  dates.
                </FormHelperText>
              </FormControl>
              <FormControl isRequired isInvalid={endDate && !areValidDates}>
                <FormLabel htmlFor="newEndDate">New Course End Date</FormLabel>
                <Input
                  placeholder="Select new course end date"
                  size="md"
                  type="date"
                  onChange={(e) => setEndDate(e.currentTarget.value)}
                />
                {!areValidDates && (
                  <FormErrorMessage>
                    New course end date must be before source course start date.
                  </FormErrorMessage>
                )}
              </FormControl>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={duplicateOnClose}>
              Cancel
            </Button>
            <Button
              isDisabled={!newLabel || !areValidDates}
              onClick={() => {
                fetcher.submit(
                  {
                    _action: "Duplicate",
                    courseId: course.courseId,
                    newLabel: newLabel,
                    dateDifference,
                  },
                  { method: "post" },
                );
                duplicateOnClose();
              }}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={settingsIsOpen}
        placement="right"
        onClose={settingsOnClose}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Settings for &quot;{course.label}&quot;
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing="24px">
              <FormControl isRequired isInvalid={!settingsRenameLabel}>
                <FormLabel htmlFor="username">New Course Label</FormLabel>
                <Input
                  id="label"
                  placeholder="Please enter a new course label"
                  onChange={(e) =>
                    setSettingsRenameLabel(e.currentTarget.value)
                  }
                />
                {!settingsRenameLabel && (
                  <FormErrorMessage>Course label is required.</FormErrorMessage>
                )}
              </FormControl>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={settingsOnClose}>
              Cancel
            </Button>
            <Button
              isDisabled={!settingsRenameLabel || !areValidDates}
              onClick={() => {
                fetcher.submit(
                  {
                    _action: "settings",
                    courseId: course.courseId,
                    settingsRenameLabel: settingsRenameLabel,
                    dateDifference,
                  },
                  { method: "post" },
                );
                settingsOnClose();
              }}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
