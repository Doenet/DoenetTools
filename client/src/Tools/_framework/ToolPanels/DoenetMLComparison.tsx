import React, { useEffect, useState } from "react";
import { DoenetEditor } from "@doenet/doenetml-iframe";
import { PanelPair } from "../../../Widgets/PanelPair";
import { ContentRevision, DoenetmlVersion } from "../../../_utils/types";
import {
  Box,
  Button,
  Flex,
  Heading,
  Hide,
  IconButton,
  Select,
  Show,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { MdOutlineCameraAlt, MdOutlineInfo } from "react-icons/md";
import { FetcherWithComponents } from "react-router";
import {
  TakeSnapshotModel,
  takeSnapshotModelActions,
} from "./DoenetMLComparisonModals/TakeSnapshotModal";
import { RevisionInfoModal } from "./DoenetMLComparisonModals/RevisionInfoModal";
import { ScratchpadInfoModal } from "./DoenetMLComparisonModals/ScratchpadInfoModal";
import { DateTime } from "luxon";
import { cidFromText } from "../../../_utils/cid";
import {
  RevertToRevisionModal,
  revertToRevisionModalActions,
} from "./DoenetMLComparisonModals/RevertToRevisionModal";

export async function doenetMLComparisonActions({
  formObj,
}: {
  [k: string]: any;
}) {
  const resultTSM = await takeSnapshotModelActions({ formObj });
  if (resultTSM) {
    return resultTSM;
  }

  const resultRM = await revertToRevisionModalActions({ formObj });
  if (resultRM) {
    return resultRM;
  }

  return null;
}

export function DoenetMLComparison({
  doenetML,
  doenetmlChangeCallback,
  immediateDoenetmlChangeCallback,
  documentStructureCallback,
  doenetmlVersion,
  readOnly,
  revisions,
  contentId,
  activityName = "",
  headerHeight,
  fetcher,
}: {
  doenetML: string;
  doenetmlChangeCallback: () => Promise<void>;
  immediateDoenetmlChangeCallback: (arg: string) => void;
  documentStructureCallback: (arg: any) => void;
  doenetmlVersion: DoenetmlVersion;
  readOnly: boolean;
  revisions: ContentRevision[];
  contentId: string;
  activityName?: string;
  headerHeight: string;
  fetcher: FetcherWithComponents<any>;
}) {
  const [listType, setListType] = useState<
    "revisions" | "remixedFrom" | "remixes"
  >("revisions");
  const [selectedRevision, setSelectRevision] =
    useState<ContentRevision | null>(null);

  const [currentDoenetML, setCurrentDoenetML] = useState(doenetML);
  const [atLastRevision, setAtLastRevision] = useState(false);
  const [atSelectedRevision, setAtSelectedRevision] = useState(false);
  const [currentCid, setCurrentCid] = useState("");

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
      // Check to see if last revision has the same cid as the current activity.
      // If so, preload the take snapshot modal with information about that revision,
      // as it will be modifying that revision.

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
      // Check to see if last revision has the same cid as the current activity.
      // If so, preload the take snapshot modal with information about that revision,
      // as it will be modifying that revision.

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
    isOpen: snapshotIsOpen,
    onOpen: snapshotOnOpen,
    onClose: snapshotOnClose,
  } = useDisclosure();

  const takeSnapshotModal = (
    <TakeSnapshotModel
      isOpen={snapshotIsOpen}
      onClose={snapshotOnClose}
      revisions={revisions}
      contentId={contentId}
      atLastRevision={atLastRevision}
      fetcher={fetcher}
    />
  );

  const {
    isOpen: revisionInfoIsOpen,
    onOpen: revisionInfoOnOpen,
    onClose: revisionInfoOnClose,
  } = useDisclosure();

  const revisionInfoModal = selectedRevision && (
    <RevisionInfoModal
      isOpen={revisionInfoIsOpen}
      onClose={revisionInfoOnClose}
      revision={selectedRevision}
    />
  );

  const {
    isOpen: revertToRevisionIsOpen,
    onOpen: revertToRevisionOnOpen,
    onClose: revertToRevisionOnClose,
  } = useDisclosure();

  const revertToRevisionModal = selectedRevision && (
    <RevertToRevisionModal
      isOpen={revertToRevisionIsOpen}
      onClose={revertToRevisionOnClose}
      contentId={contentId}
      activityName={activityName}
      revision={selectedRevision}
      fetcher={fetcher}
      doenetmlChangeCallback={doenetmlChangeCallback}
      immediateDoenetmlChangeCallback={immediateDoenetmlChangeCallback}
    />
  );

  const {
    isOpen: scratchpadInfoIsOpen,
    onOpen: scratchpadInfoOnOpen,
    onClose: scratchpadInfoOnClose,
  } = useDisclosure();

  const scratchpadInfoModal = selectedRevision && (
    <ScratchpadInfoModal
      isOpen={scratchpadInfoIsOpen}
      onClose={scratchpadInfoOnClose}
    />
  );

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
        <Tooltip
          label="Take a snapshot of the current state of the activity"
          openDelay={500}
        >
          <Button
            size="xs"
            marginLeft="10px"
            aria-label="Take a snapshot of the current state of the activity"
            leftIcon={<MdOutlineCameraAlt />}
            onClick={() => {
              snapshotOnOpen();
            }}
          >
            Snapshot
          </Button>
        </Tooltip>
        {selectedRevision && (
          <Tooltip
            label={
              (atSelectedRevision ? `Already at` : `Revert to`) +
              ` revision: ${selectedRevision.revisionName}`
            }
            openDelay={500}
          >
            <Button
              size="xs"
              marginLeft="10px"
              aria-label={
                (atSelectedRevision ? `Already at` : `Revert to`) +
                ` revision: ${selectedRevision.revisionName}`
              }
              isDisabled={atSelectedRevision}
              onClick={() => {
                revertToRevisionOnOpen();
              }}
            >
              {atSelectedRevision
                ? "Already at revision"
                : "Revert to revision"}
            </Button>
          </Tooltip>
        )}
      </Flex>

      <DoenetEditor
        height="100%"
        width="100%"
        doenetML={doenetML}
        doenetmlChangeCallback={doenetmlChangeCallback}
        immediateDoenetmlChangeCallback={(s) => {
          immediateDoenetmlChangeCallback?.(s);
          setCurrentDoenetML(s);
        }}
        documentStructureCallback={documentStructureCallback}
        doenetmlVersion={doenetmlVersion.fullVersion}
        border="none"
        readOnly={readOnly}
        viewerLocation="bottom"
        showErrorsWarnings={false}
        showResponses={false}
      />
    </Box>
  );

  let otherDoenetML = "";
  let otherDoenetmlVersion = "";
  let haveOtherDoc = false;

  if (listType === "revisions") {
    if (selectedRevision) {
      otherDoenetML = selectedRevision.source;
      otherDoenetmlVersion = selectedRevision.doenetmlVersion ?? "";
      haveOtherDoc = true;
    }
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
        value={selectedRevision?.revisionNum ?? 0}
        onChange={(e) => {
          setSelectRevision(
            revisions.find(
              (rev) => rev.revisionNum.toString() === e.target.value,
            ) ?? null,
          );
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
            revisionInfoOnOpen();
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
      <Select
        width="140px"
        size="sm"
        variant="filled"
        height="25px"
        value={listType}
        onChange={(e) => {
          setListType(
            e.target.value as "revisions" | "remixedFrom" | "remixes",
          );
        }}
      >
        <option value="revisions">Revisions</option>
        <option value="remixedFrom">Remixed From</option>
        <option value="remixes">Remixes</option>
      </Select>
      {listType === "revisions" && revisionsSelector}
    </Flex>
  );

  const otherEditor = (
    <Box height="100%">
      {selectorBar}
      {haveOtherDoc ? (
        <>
          <Flex
            width="100%"
            height="30px"
            backgroundColor="doenet.mainGray"
            paddingLeft="10px"
            alignItems="center"
          >
            <Heading as="h3" size="sm">
              Scratchpad
            </Heading>
            <Tooltip
              hasArrow
              label="Information about scratchpad"
              placement="bottom-end"
            >
              <IconButton
                marginLeft="10px"
                data-test="Info IconButton"
                aria-label="Information about scratchpad"
                size="xs"
                icon={<MdOutlineInfo />}
                onClick={() => {
                  scratchpadInfoOnOpen();
                }}
              />
            </Tooltip>
            {listType === "revisions" && selectedRevision && (
              <Text marginLeft="10px">
                (Prepopulated with revision: {selectedRevision.revisionName})
              </Text>
            )}
          </Flex>
          <DoenetEditor
            height="100%"
            width="100%"
            doenetML={otherDoenetML}
            doenetmlVersion={otherDoenetmlVersion}
            border="none"
            viewerLocation="bottom"
            showErrorsWarnings={false}
            showResponses={false}
          />
        </>
      ) : (
        <Box margin="20px">
          To compare with current activity, <Show above="sm">at left</Show>
          <Hide above="sm">above</Hide>, select a revision, an activity it was
          remixed from, or an activity that remixed it, above.{" "}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {takeSnapshotModal}
      {revisionInfoModal}
      {scratchpadInfoModal}
      {revertToRevisionModal}
      <PanelPair
        panelA={currentEditor}
        panelB={otherEditor}
        height={`calc(100vh - ${headerHeight})`}
      />
    </>
  );
}
