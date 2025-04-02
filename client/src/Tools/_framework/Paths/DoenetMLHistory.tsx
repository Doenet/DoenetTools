import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { DoenetEditor } from "@doenet/doenetml-iframe";
import { PanelPair } from "../../../Widgets/PanelPair";
import { ContentRevision, Doc, DoenetmlVersion } from "../../../_utils/types";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Hide,
  Link as ChakraLink,
  Select,
  Show,
  Text,
  Tooltip,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { MdOutlineCameraAlt } from "react-icons/md";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  Link as ReactRouterLink,
} from "react-router";
import axios from "axios";

import {
  CreateRevisionModel,
  createRevisionModelActions,
} from "../ToolPanels/DoenetMLHistoryModals/CreateRevisionModal";
import { RevisionInfoModal } from "../ToolPanels/DoenetMLHistoryModals/RevisionInfoModal";
import { DateTime } from "luxon";
import { cidFromText } from "../../../_utils/cid";
import {
  SetToRevisionModal,
  setToRevisionModalActions,
} from "../ToolPanels/DoenetMLHistoryModals/SetToRevisionModal";
import { contentTypeToName, getIconInfo } from "../../../_utils/activity";

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  const resultTSM = await createRevisionModelActions({ formObj });
  if (resultTSM) {
    return resultTSM;
  }

  const resultRM = await setToRevisionModalActions({ formObj });
  if (resultRM) {
    return resultRM;
  }

  return null;
}

export async function loader({ params, request }) {
  const {
    data: { content, revisions },
  } = await axios.get(`/api/info/getContentHistory/${params.contentId}`);

  const url = new URL(request.url);
  let revNum = 0;
  const revNumPar = url.searchParams.get("revNum");
  if (revNumPar) {
    revNum = Number(revNumPar);
    if (!Number.isInteger(revNum) || revNum <= 0) {
      revNum = 0;
    }
  }

  if (content.type !== "singleDoc") {
    throw Error("DoenetMLHistory implemented only for documents");
  }

  return {
    content,
    revisions,
    revNum,
    doenetML: content.doenetML,
    doenetmlVersion: content.doenetmlVersion,
  };
}

export function DoenetMLHistory() {
  const { content, doenetML, doenetmlVersion, revisions, revNum } =
    useLoaderData() as {
      content: Doc;
      doenetML: string;
      doenetmlVersion: DoenetmlVersion;
      revisions: ContentRevision[];
      revNum: number;
    };
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const selectedRevision = useMemo(() => {
    return revisions.find((rev) => rev.revisionNum === revNum) ?? null;
  }, [revisions, revNum]);

  const [currentDoenetML, setCurrentDoenetML] = useState(doenetML);
  const [atLastRevision, setAtLastRevision] = useState(false);
  const [currentCid, setCurrentCid] = useState("");
  const [atSelectedRevision, setAtSelectedRevision] = useState(false);

  useEffect(() => {
    setCurrentDoenetML(doenetML);
  }, [doenetML]);

  useEffect(() => {
    async function calcCurrentCid() {
      setCurrentCid(
        await cidFromText(
          doenetmlVersion.id.toString() + "|" + currentDoenetML,
        ),
      );
    }
    calcCurrentCid();
  }, [doenetmlVersion, currentDoenetML]);

  useEffect(() => {
    async function checkIfAtLastRevision() {
      if (revisions.length > 0) {
        const lastRevision = revisions[0];
        const lastCid = lastRevision.cid;

        setAtLastRevision(lastCid === currentCid);
      } else {
        setAtLastRevision(false);
      }
    }

    checkIfAtLastRevision();
  }, [currentCid, revisions]);

  useEffect(() => {
    async function checkIfAtSelectedRevision() {
      if (selectedRevision) {
        const selectedCid = selectedRevision.cid;

        setAtSelectedRevision(selectedCid === currentCid);
      } else {
        setAtSelectedRevision(false);
      }
    }

    checkIfAtSelectedRevision();
  }, [currentCid, selectedRevision]);

  const {
    isOpen: createRevisionIsOpen,
    onOpen: createRevisionOnOpen,
    onClose: createRevisionOnClose,
  } = useDisclosure();

  const createRevisionModel = (
    <CreateRevisionModel
      isOpen={createRevisionIsOpen}
      onClose={createRevisionOnClose}
      revisions={revisions}
      contentId={content.contentId}
      atLastRevision={atLastRevision}
      fetcher={fetcher}
    />
  );

  const {
    isOpen: revisionRemixInfoIsOpen,
    onOpen: revisionRemixInfoOnOpen,
    onClose: revisionRemixInfoOnClose,
  } = useDisclosure();

  const revisionRemixInfoModal = selectedRevision && (
    <RevisionInfoModal
      isOpen={revisionRemixInfoIsOpen}
      onClose={revisionRemixInfoOnClose}
      revision={selectedRevision}
    />
  );

  const {
    isOpen: setToRevisionRemixIsOpen,
    onOpen: setToRevisionRemixOnOpen,
    onClose: setToRevisionRemixOnClose,
  } = useDisclosure();

  const setToRevisionRemixModal = selectedRevision && (
    <SetToRevisionModal
      isOpen={setToRevisionRemixIsOpen}
      onClose={setToRevisionRemixOnClose}
      contentId={content.contentId}
      activityName={content.name}
      revision={selectedRevision}
      fetcher={fetcher}
    />
  );

  let updateButtons: ReactElement | null = null;
  if (selectedRevision) {
    const message =
      (atSelectedRevision ? `Already at` : `Revert to`) + ` revision`;
    const extendedMessage = message + ": " + selectedRevision.revisionName;

    updateButtons = (
      <Tooltip label={extendedMessage} openDelay={500}>
        <Button
          size="xs"
          marginLeft="10px"
          aria-label={extendedMessage}
          isDisabled={atSelectedRevision}
          onClick={() => {
            setToRevisionRemixOnOpen();
          }}
        >
          {message}
        </Button>
      </Tooltip>
    );
  }

  const contentTypeName = contentTypeToName["singleDoc"];

  const { iconImage, iconColor } = getIconInfo("singleDoc");

  const typeIcon = (
    <Tooltip label={contentTypeName}>
      <Box>
        <Icon
          as={iconImage}
          color={iconColor}
          boxSizing="content-box"
          width="24px"
          height="24px"
          paddingRight="10px"
          verticalAlign="middle"
          aria-label={contentTypeName}
        />
      </Box>
    </Tooltip>
  );

  const revisionLabel = atLastRevision
    ? "Update details on the last revision"
    : "Create a new revision from the current state of the activity";

  const currentEditor = (
    <Box height="100%">
      <Flex
        width="100%"
        height="30px"
        backgroundColor="doenet.mainGray"
        paddingLeft="10px"
        alignItems="center"
      >
        <Heading as="h3" size="sm">
          Current Activity
        </Heading>
        <Tooltip label={revisionLabel} openDelay={500}>
          <Button
            size="xs"
            marginLeft="10px"
            aria-label={revisionLabel}
            leftIcon={<MdOutlineCameraAlt />}
            onClick={() => {
              createRevisionOnOpen();
            }}
          >
            {atLastRevision ? "Update current revision" : "Create new revision"}
          </Button>
        </Tooltip>
        {updateButtons}
      </Flex>

      <DoenetEditor
        height="100%"
        width="100%"
        doenetML={doenetML}
        doenetmlVersion={doenetmlVersion.fullVersion}
        border="none"
        readOnly={true}
        viewerLocation="bottom"
        showErrorsWarnings={false}
        showResponses={false}
      />
    </Box>
  );

  let otherDoenetML = "";
  let otherDoenetmlVersion = "";
  let haveOtherDoc = false;

  if (selectedRevision) {
    otherDoenetML = selectedRevision.source;
    otherDoenetmlVersion = selectedRevision.doenetmlVersion ?? "";
    haveOtherDoc = true;
  }

  const revisionsSelector = (
    <>
      <Select
        placeholder={
          revisions.length > 0 ? "Select revision" : "No revisions available"
        }
        size="sm"
        variant="filled"
        height="25px"
        marginLeft="5px"
        width="200px"
        value={revNum}
        onChange={(e) => {
          navigate(`.?mode=History&revNum=${e.target.value}`, {
            replace: true,
          });
        }}
      >
        {revisions.map((rev) => (
          <option key={rev.revisionNum.toString()} value={rev.revisionNum}>
            {rev.revisionName} (
            {DateTime.fromISO(rev.createdAt).toLocaleString(
              DateTime.DATE_SHORT,
            )}
            )
          </option>
        ))}
      </Select>
      {selectedRevision && (
        <Button
          size="xs"
          marginLeft="5px"
          aria-label="Information on selected revision"
          onClick={() => {
            revisionRemixInfoOnOpen();
          }}
        >
          Revision info
        </Button>
      )}
    </>
  );

  const selectorBar = (
    <Flex
      width="100%"
      height="30px"
      backgroundColor="doenet.mainGray"
      alignItems="center"
    >
      {revisionsSelector}
    </Flex>
  );

  const otherEditor = (
    <Box height="100%">
      {selectorBar}
      {haveOtherDoc ? (
        <>
          <DoenetEditor
            height="100%"
            width="100%"
            doenetML={otherDoenetML}
            doenetmlVersion={otherDoenetmlVersion}
            border="none"
            viewerLocation="bottom"
            showErrorsWarnings={false}
            showResponses={false}
            readOnly={true}
          />
        </>
      ) : (
        <Box margin="20px">
          The current state of the activity is shown{" "}
          <Show above="sm">at left</Show>
          <Hide above="sm">above</Hide>. Select a revision to see its history.
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {createRevisionModel}
      {revisionRemixInfoModal}
      {setToRevisionRemixModal}
      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header"
      "centerContent"
      `}
        templateRows="40px auto"
        position="relative"
      >
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
            templateColumns={{
              base: "5px 1fr 160px",
              sm: "10px 1fr 165px",
              md: "165px 1fr 165px",
            }}
            width="100%"
          >
            <GridItem area="leftControls" height="40px" alignContent="center">
              <Show above="md">
                <Box width="50px" marginLeft="15px">
                  <ChakraLink
                    as={ReactRouterLink}
                    to={".."}
                    style={{
                      color: "var(--mainBlue)",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(-1);
                    }}
                  >
                    {" "}
                    &lt; Back
                  </ChakraLink>
                </Box>
              </Show>
            </GridItem>
            <GridItem area="label">
              <Flex justifyContent="center" alignItems="center" height="40px">
                <Text marginRight="5px" fontWeight="bold">
                  Document history:
                </Text>{" "}
                {typeIcon}
                <Tooltip label={content.name} openDelay={500}>
                  <Text noOfLines={1}>{content.name}</Text>
                </Tooltip>
              </Flex>
            </GridItem>
            <GridItem
              area="rightControls"
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            ></GridItem>
          </Grid>
        </GridItem>

        <GridItem area="centerContent">
          <PanelPair
            panelA={currentEditor}
            panelB={otherEditor}
            height={`calc(100vh - 80px)`}
          />
        </GridItem>
      </Grid>
    </>
  );
}
