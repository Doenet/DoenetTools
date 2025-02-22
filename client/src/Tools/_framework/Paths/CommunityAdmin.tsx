import axios from "axios";
import { ContentStructure } from "../../../_utils/types";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  MenuItem,
  useDisclosure,
  Text,
  VStack,
  Wrap,
  FormLabel,
  DrawerFooter,
} from "@chakra-ui/react";
import React from "react";
import { Form, useFetcher } from "react-router";

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);
  const { desiredPosition, contentId, groupName, newGroupName, groupId } =
    formObj;

  let { currentlyFeatured, homepage } = formObj;

  // TODO: should this function exist?
  // Could be bad pattern to catch all API errors as browser alerts
  async function postApiAlertOnError(url, uploadData) {
    try {
      await axios.post(url, uploadData);
      return true;
    } catch (e) {
      console.log(e);
      alert("Error - " + e.response?.data);
      return false;
    }
  }

  switch (formObj?._action) {
    case "Ban Content":
      return postApiAlertOnError("/api/markContentAsBanned", { contentId });
    case "Remove Promoted Content":
      return postApiAlertOnError("/api/removePromotedContent", {
        contentId,
        groupId,
      });
    case "Move Promoted Content":
      return postApiAlertOnError("/api/movePromotedContent", {
        contentId,
        groupId,
        desiredPosition,
      });
    case "Move Promoted Group":
      return postApiAlertOnError("/api/movePromotedContentGroup", {
        groupId,
        desiredPosition,
      });
    case "New Group": {
      return postApiAlertOnError("/api/addPromotedContentGroup", { groupName });
    }
    case "Rename Group": {
      return postApiAlertOnError("/api/addPromotedContentGroup", {
        groupName,
      });
    }
    case "Promote Group": {
      // convert to real booleans
      currentlyFeatured =
        !currentlyFeatured || currentlyFeatured == "false" ? false : true;
      homepage = !homepage || homepage == "false" ? false : true;
      return postApiAlertOnError("/api/updatePromotedContentGroup", {
        groupId,
        newGroupName,
        currentlyFeatured,
        homepage,
      });
    }
    case "Delete Group": {
      return postApiAlertOnError("/api/deletePromotedContentGroup", {
        groupId,
      });
    }
  }
}

export function MoveToGroupMenuItem({
  contentId,
  carouselData,
}: {
  contentId: string;
  carouselData: {
    groupName: string;
    promotedGroupId: number;
    currentlyFeatured: boolean;
    homepage: boolean;
    promotedContent: ContentStructure[];
  }[];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  const fetcher = useFetcher();

  if (!carouselData) {
    carouselData = [];
  }

  const banContent = () => {
    if (window.confirm("Are you sure you want to ban this content?")) {
      fetcher.submit({ _action: "Ban Content", contentId }, { method: "post" });
    }
  };

  const promoteGroup = (groupInfo, currentlyFeatured) => {
    fetcher.submit(
      {
        _action: "Promote Group",
        // groupName: groupInfo.groupName,
        groupId: groupInfo.promotedGroupId,
        currentlyFeatured,
        homepage: false,
      },
      { method: "post" },
    );
  };

  const moveGroup = (groupInfo, desiredPosition) => {
    fetcher.submit(
      {
        _action: "Move Promoted Group",
        groupId: groupInfo.promotedGroupId,
        desiredPosition,
      },
      { method: "post" },
    );
  };

  const promoteContent = async (groupInfo) => {
    const uploadData = {
      groupId: groupInfo.promotedGroupId,
      contentId,
    };
    axios
      .post("/api/addPromotedContent", uploadData)
      .then(() => {
        onClose();
      })
      .catch((e) => {
        console.log(e);
        alert("Error - " + e.response?.data);
      });
  };

  const createGroup = () => {
    const groupName = window.prompt("Enter a new group name");
    if (groupName) {
      fetcher.submit({ _action: "New Group", groupName }, { method: "post" });
    }
  };

  const renameGroup = (groupInfo) => {
    const newGroupName = window.prompt(
      "Enter a new name for group " + groupInfo.groupName,
      groupInfo.groupName,
    );
    if (newGroupName) {
      fetcher.submit(
        {
          _action: "Promote Group",
          groupId: groupInfo.promotedGroupId,
          currentlyFeatured: groupInfo.currentlyFeatured,
          newGroupName,
          homepage: false,
        },
        { method: "post" },
      );
    }
  };

  const deleteGroup = (groupId, groupName) => {
    const shouldDelete = confirm(
      `Are you sure you want to delete ${groupName}? You can't undo this action afterwards.`,
    );
    if (shouldDelete) {
      fetcher.submit(
        {
          _action: "Delete Group",
          groupId,
        },
        { method: "post" },
      );
    }
  };

  return (
    <>
      <MenuItem ref={btnRef} onClick={onOpen}>
        Promote on Community Page
      </MenuItem>
      <MenuItem as="button" type="submit" ref={btnRef} onClick={banContent}>
        Remove from Community for TOS Violation
      </MenuItem>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Activity To Group</DrawerHeader>

          <DrawerBody>
            <VStack spacing="2">
              {carouselData.map((group) => {
                return (
                  <Button
                    margin="5px"
                    key={group.groupName}
                    onClick={() => promoteContent(group)}
                  >
                    Add to group "{group.groupName}"
                  </Button>
                );
              })}
              <br />
              <Button onClick={() => createGroup()}>Add New Group</Button>
            </VStack>
            <Box>
              <VStack spacing="2">
                <Text fontSize="xl">
                  Select which groups are shown on the community page
                </Text>

                <Form>
                  {carouselData.map((group, position) => {
                    return (
                      <Wrap key={group.promotedGroupId}>
                        <Checkbox
                          isDisabled={group.homepage}
                          isChecked={group.currentlyFeatured}
                          name={group.promotedGroupId.toString()}
                          onChange={(evt) =>
                            promoteGroup(group, evt.target.checked)
                          }
                        />
                        <FormLabel
                          htmlFor={group.promotedGroupId.toString()}
                          width="200px"
                        >
                          {group.groupName}
                        </FormLabel>
                        <Button onClick={() => renameGroup(group)}>
                          Rename
                        </Button>
                        <Button
                          isDisabled={position === 0}
                          onClick={() => moveGroup(group, position - 1)}
                        >
                          ↑
                        </Button>
                        <Button
                          isDisabled={position === carouselData.length - 1}
                          onClick={() => moveGroup(group, position + 1)}
                        >
                          ↓
                        </Button>
                        <Button
                          isDisabled={group.homepage}
                          onClick={() =>
                            deleteGroup(group.promotedGroupId, group.groupName)
                          }
                        >
                          Delete
                        </Button>
                      </Wrap>
                    );
                  })}
                </Form>
              </VStack>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
