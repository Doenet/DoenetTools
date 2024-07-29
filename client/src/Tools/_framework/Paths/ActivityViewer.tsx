import React, { useEffect, useRef } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useLocation,
} from "react-router";
import { DoenetViewer } from "@doenet/doenetml-iframe";

import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  List,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import ContributorsMenu from "../ToolPanels/ContributorsMenu";
import { Link, useFetcher } from "react-router-dom";
import { ContentStructure, DoenetmlVersion, License } from "./ActivityEditor";
import { DisplayLicenseItem } from "../ToolPanels/SharingControls";

export async function action({ params, request }) {
  // TODO: it is confusing that the one "action" of this viewer is to duplicate.

  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "copy to activities") {
    let { data } = await axios.post(`/api/duplicateActivity`, {
      activityId: Number(params.activityId),
    });

    const { newActivityId } = data;

    // TODO: do not navigate to editor
    // Instead, navigate to activities with newly created activity highlighted
    return redirect(`/activityEditor/${newActivityId}`);
  }

  return null;
}

export async function loader({ params }) {
  //Check if signedIn
  const profileInfo = await checkIfUserClearedOut();
  let signedIn = true;
  if (profileInfo.cookieRemoved) {
    signedIn = false;
  }
  try {
    const { data: activityData } = await axios.get(
      `/api/getActivityView/${params.activityId}`,
    );

    let activityId = Number(params.activityId);
    let docId = Number(params.docId);
    if (!docId) {
      // If docId was not supplied in the url,
      // then use the first docId from the activity.
      // TODO: what happens if activity has no documents?
      docId = activityData.activity.documents[0].id;
    }

    const doenetML = activityData.activity.documents[0].source;

    const doenetmlVersion: DoenetmlVersion =
      activityData.activity.documents[0].doenetmlVersion;

    return {
      activityId,
      doenetML,
      signedIn,
      activity: activityData.activity,
      owner: activityData.owner,
      docId,
      contributorHistory: activityData.doc.contributorHistory,
      doenetmlVersion,
    };
  } catch (e) {
    if (e.response.status === 404) {
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
    signedIn,
    activity,
    owner,
    docId,
    contributorHistory,
    doenetmlVersion,
  } = useLoaderData() as {
    activityId: number;
    doenetML: string;
    signedIn: boolean;
    activity: ContentStructure;
    owner: {
      userId: number;
      email: string;
      firstNames: string | null;
      lastNames: string;
    };
    docId: number;
    contributorHistory: any;
    doenetmlVersion: DoenetmlVersion;
  };

  const fetcher = useFetcher();

  const navigate = useNavigate();
  const location = useLocation();

  let navigateTo = useRef("");

  // TODO: fix this navigation
  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    //@ts-ignore
    location.href = newHref;
  }

  useEffect(() => {
    document.title = `${activity.name} - Doenet`;
  }, [activity.name]);

  return (
    <>
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
                    <Flex width="100%">
                      <Text fontSize="1.4em" fontWeight="bold" noOfLines={1}>
                        {activity.name}
                      </Text>
                      <Spacer />
                      {activity.license ? (
                        <SmallLicenseBadges license={activity.license} />
                      ) : null}
                    </Flex>
                    <Flex mt="10px" width="100%">
                      <ContributorsMenu
                        owner={owner}
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
                              navigate(`/publicEditor/${activityId}/${docId}`);
                            }}
                          >
                            See Inside
                          </Button>
                          {signedIn ? (
                            <Button
                              data-test="Copy to Activities Button"
                              size="xs"
                              colorScheme="blue"
                              onClick={() => {
                                fetcher.submit(
                                  {
                                    _action: "copy to activities",
                                  },
                                  { method: "post" },
                                );
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
                                navigateTo.current = "/signIn";
                              }}
                            >
                              Sign In To Copy to Activities
                            </Button>
                          )}
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
                      editURL: "/publicEditor",
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
                <Box
                  background="gray"
                  width="100%"
                  color="var(--canvas)"
                  padding="20px"
                  minHeight="20vh"
                >
                  {activity.license ? (
                    activity.license.isComposition ? (
                      <>
                        <p>
                          <strong>{activity.name}</strong> by {owner.firstNames}{" "}
                          {owner.lastNames} is shared publicly with these
                          licenses:
                        </p>
                        <List spacing="20px" marginTop="10px">
                          {activity.license.composedOf.map((comp) => (
                            <DisplayLicenseItem
                              licenseItem={comp}
                              key={comp.code}
                            />
                          ))}
                        </List>
                        <p style={{ marginTop: "10px" }}></p>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>{activity.name}</strong> by {owner.firstNames}{" "}
                          {owner.lastNames} is shared publicly using the
                          license:
                        </p>
                        <List marginTop="10px">
                          <DisplayLicenseItem licenseItem={activity.license} />
                        </List>
                      </>
                    )
                  ) : (
                    <p>
                      <strong>{activity.name}</strong> by {owner.firstNames}{" "}
                      {owner.lastNames} is shared publicly, but a license was
                      not specified. Contact the author to determine in what
                      ways you can reuse this activity.
                    </p>
                  )}
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </Flex>
      </Box>
    </>
  );
}

export function SmallLicenseBadges({ license }: { license: License }) {
  if (license.isComposition) {
    return (
      <VStack spacing={1}>
        {license.composedOf.map((comp) => (
          <DisplaySmallLicenseBadge licenseItem={comp} key={comp.code} />
        ))}
      </VStack>
    );
  } else {
    return <DisplaySmallLicenseBadge licenseItem={license} />;
  }
}

function DisplaySmallLicenseBadge({
  licenseItem,
}: {
  licenseItem: {
    name: string;
    description: string;
    imageURL: string | null;
    smallImageURL: string | null;
    licenseURL: string | null;
  };
}) {
  let badge: React.JSX.Element | null = null;
  let imageURL = licenseItem.smallImageURL ?? licenseItem.imageURL;
  if (imageURL) {
    badge = (
      <Tooltip label={licenseItem.name} placement="bottom-end">
        <Image
          src={imageURL}
          alt={`Badge for license: ${licenseItem.name}`}
          height="15px"
        />
      </Tooltip>
    );
  }

  if (licenseItem.licenseURL) {
    badge = (
      <Link to={licenseItem.licenseURL} target="_blank">
        {badge}
      </Link>
    );
  }

  return badge;
}
