import React, { useEffect } from "react";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";

import { DoenetEditor } from "@doenet/doenetml-iframe";

import {
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { BsPlayBtnFill } from "react-icons/bs";
import { CopyContentAndReportFinish } from "../popups/CopyContentAndReportFinish";
import axios from "axios";
import { SiteContext } from "./SiteHeader";
import { Content, DoenetmlVersion } from "../types";
import { ContentInfoDrawer } from "../drawers/ContentInfoDrawer";
import { MdOutlineInfo } from "react-icons/md";

export async function loader({
  params,
  request,
}: {
  params: any;
  request: any;
}) {
  const url = new URL(request.url);
  const queryParamDoenetML = url.searchParams.get("doenetml");

  if (!params.contentId) {
    return {
      doenetML: queryParamDoenetML,
    };
  }
  const { data: activityData } = await axios.get(
    `/api/getSharedEditorData/${params.contentId}`,
  );

  let docId = params.docId;
  if (!docId) {
    // If docId was not supplied in the url,
    // then use the first docId from the activity.
    // TODO: what happens if activity has no documents?
    docId = activityData.documents[0].id;
  }

  // If docId isn't in the activity, use the first docId
  let docInOrder = activityData.documents.map((x: any) => x.id).indexOf(docId);
  if (docInOrder === -1) {
    docInOrder = 0;
    docId = activityData.documents[docInOrder].id;
  }

  const doenetML = activityData.documents[docInOrder].source;
  const doenetmlVersion: DoenetmlVersion =
    activityData.documents[docInOrder].doenetmlVersion;

  return {
    activityData,
    doenetML,
    doenetmlVersion,
  };
}

export function CodeViewer() {
  const { doenetML, doenetmlVersion, activityData } = useLoaderData() as {
    doenetML: string;
    doenetmlVersion?: DoenetmlVersion;
    activityData?: Content;
  };

  const fetcher = useFetcher();
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

  const { user, allLicenses } = useOutletContext<SiteContext>();
  const navigate = useNavigate();

  const label = activityData?.name ?? "Public Editor";

  useEffect(() => {
    document.title = `${label} - Doenet`;
  }, [label]);

  return (
    <>
      {activityData ? (
        <>
          <CopyContentAndReportFinish
            isOpen={copyDialogIsOpen}
            onClose={copyDialogOnClose}
            fetcher={fetcher}
            contentIds={[activityData.contentId]}
            desiredParent={null}
            action="Copy"
          />
          <ContentInfoDrawer
            isOpen={infoIsOpen}
            onClose={infoOnClose}
            contentData={activityData}
            allLicenses={allLicenses}
          />
        </>
      ) : null}
      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header"
      "centerContent"
      `}
        templateRows="70px auto"
        position="relative"
      >
        <GridItem
          area="header"
          position="fixed"
          height="70px"
          background="doenet.canvas"
          width="100%"
          zIndex="500"
        >
          <>
            <Grid
              templateAreas={`"leftControls label rightControls"`}
              templateColumns="1fr 400px 1fr"
              width="100%"
              height="40px"
            >
              <GridItem area="leftControls">
                <HStack ml="10px" mt="4px">
                  {activityData !== undefined ? (
                    <Button
                      data-test="View Navigation Button"
                      ml="10px"
                      size="sm"
                      variant="outline"
                      leftIcon={<BsPlayBtnFill />}
                      onClick={() => {
                        navigate(`/activityViewer/${activityData.contentId}`);
                      }}
                    >
                      View
                    </Button>
                  ) : null}
                </HStack>
              </GridItem>
              <GridItem area="label">
                <Text width="400px" mt="8px" textAlign="center">
                  {label}
                </Text>
              </GridItem>
              <GridItem
                area="rightControls"
                display="flex"
                justifyContent="flex-end"
              >
                {/* <HStack mr="10px">
                
                </HStack> */}
              </GridItem>
            </Grid>
            <Center mt="2px" h="30px" background="doenet.mainGray">
              <HStack>
                {/*
                Assume if there is an activity ID, the user is exploring a longer and uneditable community activity. 
                The user should copy the activity into their Activities page to edit.

                Assume if there is no activity ID, the user is exploring a short and editable example and will not be saved.
                */}
                {!activityData ? (
                  <Center background="orange.100" pl="10px" pr="6px">
                    <WarningIcon color="orange.500" mr="6px" />

                    <Text size="xs" pl="4px" pr="4px">
                      Your code is not being saved in this view. Copy to one of
                      your activities to save changes.
                    </Text>
                  </Center>
                ) : (
                  <>
                    <Center background="orange.100" pl="10px" pr="6px">
                      <WarningIcon color="orange.500" mr="6px" />

                      <Text size="xs" pl="4px" pr="4px">
                        Copy to Activities to make your own edits.
                      </Text>
                    </Center>
                    {user ? (
                      <Button
                        data-test="Copy to Activities Button"
                        size="xs"
                        colorScheme="blue"
                        onClick={async () => {
                          copyDialogOnOpen();
                        }}
                      >
                        Copy to Activities
                      </Button>
                    ) : (
                      <Button
                        data-test="Nav to signIn"
                        size="xs"
                        colorScheme="blue"
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
                          infoOnOpen();
                        }}
                      />
                    </Tooltip>
                  </>
                )}
              </HStack>
            </Center>
          </>
        </GridItem>

        <GridItem area="centerContent">
          <DoenetEditor
            height={`calc(100vh - 110px)`}
            width="100%"
            doenetML={doenetML}
            readOnly={activityData !== undefined}
            doenetmlVersion={doenetmlVersion?.fullVersion}
            border="none"
            showFormatter={false}
            showErrorsWarnings={false}
          />
        </GridItem>
      </Grid>
    </>
  );
}
