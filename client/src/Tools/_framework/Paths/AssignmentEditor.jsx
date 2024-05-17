import React, { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";

import { DoenetML, cidFromText } from "@doenet/doenetml";

import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";
import { Form, useFetcher } from "react-router-dom";
import axios from "axios";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import { useLocation, useNavigate } from "react-router";

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  // console.log({ formObj });

  //Don't let name be blank
  let name = formObj?.name?.trim();
  if (name == "") {
    name = "Untitled";
  }

  if (formObj._action == "update name") {
    await axios.post(`/api/updateAssignmentName`, {
      assignmentId: Number(params.assignmentId),
      name,
    });
    return true;
  }

  if (formObj._action == "update general") {
    await axios.post("/api/updateAssignmentSettings", {
      name,
      imagePath: formObj.imagePath,
      assignmentId: Number(params.assignmentId),
    });

    return true;
  }

  return null;
}

export async function loader({ params }) {
  const { data: assignmentData } = await axios.get(
    `/api/getAssignmentEditorData/${params.assignmentId}`,
  );

  let assignmentId = Number(params.assignmentId);

  // TODO: what happens if assignment has no documents?
  let docId = assignmentData.assignmentItems[0].docId;

  const doenetML = activityData.documents[0].content;

  //Win, Mac or Linux
  let platform = "Linux";
  if (navigator.platform.indexOf("Win") != -1) {
    platform = "Win";
  } else if (navigator.platform.indexOf("Mac") != -1) {
    platform = "Mac";
  }

  return {
    platform,
    assignmentData,
    docId,
    doenetML,
    assignmentId,
  };
}

export function GeneralAssignmentControls({
  fetcher,
  assignmentId,
  docId,
  assignmentData,
}) {
  let { name, imagePath: dataImagePath } = assignmentData;

  let [imagePath, setImagePath] = useState(dataImagePath);

  let [nameValue, setName] = useState(name);
  let lastAcceptedNameValue = useRef(name);
  let [nameIsInvalid, setNameIsInvalid] = useState(false);

  function saveDataToServer() {
    let data = {};

    // Turn on/off name error messages and
    // use the latest valid name
    let nameToSubmit = nameValue;
    if (nameValue == "") {
      nameToSubmit = lastAcceptedNameValue.current;
      setNameIsInvalid(true);
    } else {
      if (nameIsInvalid) {
        setNameIsInvalid(false);
      }
    }
    lastAcceptedNameValue.current = nameToSubmit;

    data.name = nameToSubmit;

    fetcher.submit(
      {
        _action: "update general",
        assignmentId,
        docId,
        ...data,
      },
      { method: "post" },
    );
  }

  return (
    <>
      <Form method="post">
        <FormControl isRequired isInvalid={nameIsInvalid}>
          <FormLabel mt="16px">Name</FormLabel>

          <Input
            name="name"
            size="sm"
            // width="392px"
            width="100%"
            placeholder="Assignment 1"
            data-test="Assignment Name"
            value={nameValue}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onBlur={saveDataToServer}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                saveDataToServer();
              }
            }}
          />
          <FormErrorMessage>
            Error - A name for the assignment is required.
          </FormErrorMessage>
        </FormControl>

        <input type="hidden" name="imagePath" value={imagePath} />
        <input type="hidden" name="_action" value="update general" />
        <input type="hidden" name="assignmentId" value={assignmentId} />
      </Form>
    </>
  );
}

function AssignmentSettingsDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  controlsTabsLastIndex,
}) {
  const { assignmentId, docId, assignmentData } = useLoaderData();
  //Need fetcher at this level to get name refresh
  //when close drawer after changing name
  const fetcher = useFetcher();

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton data-test="Close Settings Button" />
        <DrawerHeader>
          <Center>
            {/* <Icon as={FaCog} mr="14px" /> */}
            <Text>Assignment Controls</Text>
          </Center>
        </DrawerHeader>

        <DrawerBody>
          <Tabs defaultIndex={controlsTabsLastIndex.current}>
            <TabList>
              <Tab
                onClick={() => (controlsTabsLastIndex.current = 0)}
                data-test="General Tab"
              >
                General
              </Tab>
              {/* <Tab onClick={() => (controlsTabsLastIndex.current = 2)}>
                Pages & Orders
              </Tab> */}
            </TabList>
            <Box overflowY="scroll" height="calc(100vh - 120px)">
              <TabPanels>
                <TabPanel>
                  <GeneralAssignmentControls
                    fetcher={fetcher}
                    assignmentId={assignmentId}
                    docId={docId}
                    assignmentData={assignmentData}
                  />
                </TabPanel>
                {/* <TabPanel>
                  <Button size="sm">Enable Pages & Orders</Button>
                </TabPanel> */}
              </TabPanels>
            </Box>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
//This is separate as <Editable> wasn't updating when defaultValue was changed
function EditableName({ dataTest }) {
  const { assignmentData } = useLoaderData();
  const [name, setName] = useState(assignmentData.name);
  const fetcher = useFetcher();

  let lastAssignmentDataName = useRef(assignmentData.name);

  //Update when something else updates the name
  if (assignmentData.name != lastAssignmentDataName.current) {
    if (name != assignmentData.name) {
      setName(assignmentData.name);
    }
  }
  lastAssignmentDataName.current = assignmentData.name;

  return (
    <Editable
      data-test={dataTest}
      mt="4px"
      value={name}
      textAlign="center"
      onChange={(value) => {
        setName(value);
      }}
      onSubmit={(value) => {
        let submitValue = value;

        fetcher.submit(
          { _action: "update name", name: submitValue },
          { method: "post" },
        );
      }}
    >
      <EditablePreview data-test="Editable Preview" />
      <EditableInput width="400px" data-test="Editable Input" />
    </Editable>
  );
}

export function AssignmentEditor() {
  const { platform, doenetML, assignmentData } = useLoaderData();

  const {
    isOpen: controlsAreOpen,
    onOpen: controlsOnOpen,
    onClose: controlsOnClose,
  } = useDisclosure();

  let controlsTabsLastIndex = useRef(0);

  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    document.title = `${assignmentData.name} - Doenet`;
  }, [assignmentData.name]);

  const controlsBtnRef = useRef(null);

  const [variants, setVariants] = useState({
    index: 1,
    numVariants: 1,
    allPossibleVariants: ["a"],
  });

  // console.log("variants", variants);

  return (
    <>
      <AssignmentSettingsDrawer
        isOpen={controlsAreOpen}
        onClose={controlsOnClose}
        finalFocusRef={controlsBtnRef}
        assignmentData={assignmentData}
        controlsTabsLastIndex={controlsTabsLastIndex}
      />

      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header header header"
      "leftGutter centerContent rightGutter"
      `}
        templateRows="40px auto"
        templateColumns=".06fr 1fr .06fr"
        position="relative"
      >
        <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
        <GridItem
          area="header"
          position="fixed"
          height="40px"
          background="doenet.canvas"
          width="100%"
          zIndex="500"
        >
          <Grid
            templateAreas={`"leftControls label rightControls"`}
            templateColumns="1fr 400px 1fr"
            width="100%"
          >
            <GridItem area="leftControls"></GridItem>
            <GridItem area="label">
              <EditableName dataTest="Assignment Name Editable" />
            </GridItem>
            <GridItem
              area="rightControls"
              display="flex"
              justifyContent="flex-end"
            >
              <HStack mr="10px">
                <Tooltip
                  hasArrow
                  label={
                    platform == "Mac"
                      ? "Open Controls cmd+u"
                      : "Open Controls ctrl+u"
                  }
                >
                  <Button
                    data-test="Controls Button"
                    mt="4px"
                    size="sm"
                    variant="outline"
                    leftIcon={<FaCog />}
                    onClick={controlsOnOpen}
                    ref={controlsBtnRef}
                  >
                    Controls
                  </Button>
                </Tooltip>
              </HStack>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem area="centerContent">
          <Grid
            width="100%"
            height="calc(100vh - 80px)"
            templateAreas={`"leftGutter viewer rightGutter"`}
            templateColumns={`1fr minmax(400px,850px) 1fr`}
            overflow="hidden"
          >
            <GridItem
              area="leftGutter"
              background="doenet.lightBlue"
              width="100%"
              paddingTop="10px"
              alignSelf="start"
            ></GridItem>
            <GridItem
              area="rightGutter"
              background="doenet.lightBlue"
              width="100%"
              paddingTop="10px"
              alignSelf="start"
            />
            <GridItem
              area="viewer"
              width="100%"
              placeSelf="center"
              minHeight="100%"
              maxWidth="850px"
              overflow="hidden"
            >
              <VStack
                spacing={0}
                margin="10px 0px 10px 0px" //Only need when there is an outline
              >
                {variants.numVariants > 1 && (
                  <Box bg="doenet.lightBlue" h="32px" width="100%">
                    <VariantSelect
                      size="sm"
                      menuWidth="140px"
                      syncIndex={variants.index}
                      array={variants.allPossibleVariants}
                      onChange={(index) =>
                        setVariants((prev) => {
                          let next = { ...prev };
                          next.index = index + 1;
                          return next;
                        })
                      }
                    />
                  </Box>
                )}
                <Box
                  h={
                    variants.numVariants > 1
                      ? "calc(100vh - 132px)"
                      : "calc(100vh - 100px)"
                  }
                  background="var(--canvas)"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="doenet.mediumGray"
                  padding="20px 5px 20px 5px"
                  flexGrow={1}
                  overflow="scroll"
                  w="100%"
                  id="viewer-container"
                >
                  <DoenetML
                    doenetML={doenetML}
                    flags={{
                      showCorrectness: true,
                      solutionDisplayMode: "button",
                      showFeedback: true,
                      showHints: true,
                      autoSubmit: false,
                      allowLoadState: false,
                      allowSaveState: false,
                      allowLocalState: false,
                      allowSaveSubmissions: false,
                      allowSaveEvents: false,
                    }}
                    attemptNumber={1}
                    generatedVariantCallback={setVariants}
                    requestedVariantIndex={variants.index}
                    idsIncludeActivityId={false}
                    paginate={true}
                    location={location}
                    navigate={navigate}
                    linkSettings={{
                      viewURL: "/activityViewer",
                      editURL: "/publicEditor",
                    }}
                    scrollableContainer={
                      document.getElementById("viewer-container") || undefined
                    }
                  />
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}
