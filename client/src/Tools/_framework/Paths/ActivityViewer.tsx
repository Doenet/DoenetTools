import React, { useEffect, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router";
import { DoenetViewer } from "@doenet/doenetml-iframe";

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  List,
  ListItem,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import ContributorsMenu from "../ToolPanels/ContributorsMenu";

import { CopyActivityAndReportFinish } from "../ToolPanels/CopyActivityAndReportFinish";
import { User } from "./SiteHeader";
import { createFullName } from "../../../_utils/names";
import {
  ContentStructure,
  DocHistoryItem,
  DoenetmlVersion,
} from "../../../_utils/types";
import { processContributorHistory } from "../../../_utils/processRemixes";
import { DisplayLicenseItem } from "../../../Widgets/Licenses";
import { ContentInfoDrawer } from "../ToolPanels/ContentInfoDrawer";
import { MdOutlineInfo } from "react-icons/md";
import { getClassificationAugmentedDescription } from "../../../_utils/activity";

export async function loader({ params }) {
  try {
    const { data: activityData } = await axios.get(
      `/api/getActivityViewerData/${params.activityId}`,
    );

    const activityId = params.activityId;
    let docId = params.docId;
    if (!docId) {
      // If docId was not supplied in the url,
      // then use the first docId from the activity.
      // TODO: what happens if activity has no documents?
      docId = activityData.activity.documents[0].id;
    }

    const doenetML = activityData.activity.documents[0].source;

    const doenetmlVersion: DoenetmlVersion =
      activityData.activity.documents[0].doenetmlVersion;

    const contributorHistory = await processContributorHistory(
      activityData.docHistories[0],
    );

    return {
      activityId,
      doenetML,
      activity: activityData.activity,
      docId,
      contributorHistory,
      doenetmlVersion,
    };
  } catch (e) {
    if (e.response?.status === 404) {
      throw Error("Activity not found");
    } else {
      throw e;
    }
  }
}

export function ActivityViewer() {
  const {
    activityId,
    doenetML,
    activity,
    docId,
    contributorHistory,
    doenetmlVersion,
  } = useLoaderData() as {
    activityId: string;
    doenetML: string;
    activity: ContentStructure;
    docId: string;
    contributorHistory: DocHistoryItem[];
    doenetmlVersion: DoenetmlVersion;
  };

  const {
    isOpen: copyDialogIsOpen,
    onOpen: copyDialogOnOpen,
    onClose: copyDialogOnClose,
  } = useDisclosure();

  const {
    isOpen: infoIsOpen,
    onOpen: infoOnOpen,
    onClose: infoOnClose,
  } = useDisclosure();

  const [displayInfoTab, setDisplayInfoTab] = useState<
    "general" | "classifications"
  >("general");

  const navigate = useNavigate();
  const location = useLocation();

  const user = useOutletContext<User>();

  useEffect(() => {
    document.title = `${activity.name} - Doenet`;
  }, [activity.name]);

  const haveClassifications = activity.classifications.length > 0;

  return (
    <>
      <CopyActivityAndReportFinish
        isOpen={copyDialogIsOpen}
        onClose={copyDialogOnClose}
        activityData={activity}
      />
      <ContentInfoDrawer
        isOpen={infoIsOpen}
        onClose={infoOnClose}
        contentData={activity}
        displayTab={displayInfoTab}
      />
      <Box background="doenet.lightBlue" height="100%">
        <Flex
          background="doenet.lightBlue"
          alignItems="center"
          width="100%"
          direction="column"
        >
          <Grid
            templateAreas={`"header"
            "centerContent"
            `}
            templateRows="100px calc(100% - 100px)"
            width="100%"
            maxWidth="850px"
          >
            <GridItem area="header" height="100px" background="doenet.mainGray">
              <Grid
                width="100%"
                height="100px"
                templateAreas={`"leftHeader headerContent rightHeader"`}
                templateColumns={`1fr minmax(100px,800px) 1fr`}
                background="doenet.mainGray"
              >
                <GridItem
                  area="leftHeader"
                  paddingLeft="10px"
                  background="doenet.mainGray"
                ></GridItem>
                <GridItem
                  area="rightHeader"
                  paddingRight="10px"
                  background="doenet.mainGray"
                ></GridItem>
                <GridItem area="headerContent" maxWidth="800px" width="100%">
                  <Flex
                    flexDirection="column"
                    alignItems="flex-start"
                    mt="10px"
                  >
                    <Box width="100%" textAlign="center">
                      <Tooltip label={activity.name}>
                        <Text fontSize="1.4em" fontWeight="bold" noOfLines={1}>
                          {activity.name}
                        </Text>
                      </Tooltip>
                    </Box>
                    <Flex mt="10px" width="100%">
                      <ContributorsMenu
                        activity={activity}
                        contributorHistory={contributorHistory}
                      />
                      <Spacer />
                      <VStack mt="10px" alignItems="flex-end" spacing="4">
                        <HStack>
                          <Button
                            size="xs"
                            colorScheme="blue"
                            data-test="See Inside"
                            onClick={() => {
                              navigate(`/codeViewer/${activityId}/${docId}`);
                            }}
                          >
                            See Inside
                          </Button>
                          {user ? (
                            <Button
                              data-test="Copy to Activities Button"
                              size="xs"
                              colorScheme="blue"
                              onClick={() => {
                                copyDialogOnOpen();
                              }}
                            >
                              Copy to Activities
                            </Button>
                          ) : (
                            <Button
                              data-test="Nav to signIn"
                              colorScheme="blue"
                              size="xs"
                              onClick={() => {
                                navigate("/signIn");
                              }}
                            >
                              Sign In To Copy to Activities
                            </Button>
                          )}
                          <Tooltip
                            label={`Activity information`}
                            placement="bottom-end"
                          >
                            <IconButton
                              size="xs"
                              colorScheme="blue"
                              icon={<MdOutlineInfo />}
                              aria-label="Activity information"
                              data-test="Activity Information"
                              onClick={() => {
                                setDisplayInfoTab("general");
                                infoOnOpen();
                              }}
                            />
                          </Tooltip>
                        </HStack>
                      </VStack>
                    </Flex>
                  </Flex>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem area="centerContent">
              <VStack gap={0}>
                <Box background="var(--canvas)" width="100%" height="100%">
                  <DoenetViewer
                    key={`HPpageViewer`}
                    doenetML={doenetML}
                    doenetmlVersion={doenetmlVersion.fullVersion}
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
                    idsIncludeActivityId={false}
                    // setIsInErrorState={setIsInErrorState}
                    location={location}
                    navigate={navigate}
                    linkSettings={{
                      viewURL: "/activityViewer",
                      editURL: "/codeViewer",
                    }}
                    includeVariantSelector={false}
                  />
                </Box>
                <Box
                  width="100%"
                  height="30vh"
                  background="var(--canvas)"
                  padding="0px"
                  margin="0px"
                />
                <Flex
                  background="gray"
                  width="100%"
                  color="var(--canvas)"
                  padding="20px"
                  minHeight="20vh"
                >
                  <Box width={haveClassifications ? "70%" : "100%"}>
                    {activity.license ? (
                      activity.license.isComposition ? (
                        <>
                          <p>
                            <strong>{activity.name}</strong> by{" "}
                            {createFullName(activity.owner!)} is shared with
                            these licenses:
                          </p>
                          <List spacing="20px" marginTop="10px">
                            {activity.license.composedOf.map((comp) => (
                              <DisplayLicenseItem
                                licenseItem={comp}
                                key={comp.code}
                              />
                            ))}
                          </List>
                          <p style={{ marginTop: "10px" }}>
                            You are free to use either license when reusing this
                            work.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>{activity.name}</strong> by{" "}
                            {createFullName(activity.owner!)} is shared using
                            the license:
                          </p>
                          <List marginTop="10px">
                            <DisplayLicenseItem
                              licenseItem={activity.license}
                            />
                          </List>
                        </>
                      )
                    ) : (
                      <p>
                        <strong>{activity.name}</strong> by{" "}
                        {createFullName(activity.owner!)} is shared, but a
                        license was not specified. Contact the author to
                        determine in what ways you can reuse this activity.
                      </p>
                    )}
                  </Box>
                  {haveClassifications ? (
                    <Box
                      cursor="pointer"
                      onClick={() => {
                        setDisplayInfoTab("classifications");
                        infoOnOpen();
                      }}
                      marginLeft="40px"
                    >
                      <Heading size="sm">Classifications</Heading>
                      <List data-test="Classifications Footer">
                        {activity.classifications.map((classification, i) => {
                          return (
                            <Tooltip
                              key={i}
                              label={getClassificationAugmentedDescription(
                                classification,
                              )}
                            >
                              <ListItem>
                                {classification.code} (
                                {
                                  classification.descriptions[0].subCategory
                                    .category.system.shortName
                                }
                                )
                              </ListItem>
                            </Tooltip>
                          );
                        })}
                      </List>
                    </Box>
                  ) : null}
                </Flex>
              </VStack>
            </GridItem>
          </Grid>
        </Flex>
      </Box>
    </>
  );
}
