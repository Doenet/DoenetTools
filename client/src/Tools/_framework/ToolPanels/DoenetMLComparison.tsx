import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { DoenetEditor } from "@doenet/doenetml-iframe";
import { PanelPair } from "../../../Widgets/PanelPair";
import {
  ActivityRemixItem,
  ContentRevision,
  DoenetmlVersion,
} from "../../../_utils/types";
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
import { FetcherWithComponents, useNavigate } from "react-router";
import axios from "axios";

import {
  TakeSnapshotModel,
  takeSnapshotModelActions,
} from "./DoenetMLComparisonModals/TakeSnapshotModal";
import { RevisionRemixInfoModal } from "./DoenetMLComparisonModals/RevisionRemixInfoModal";
import { ScratchpadInfoModal } from "./DoenetMLComparisonModals/ScratchpadInfoModal";
import { DateTime } from "luxon";
import { cidFromText } from "../../../_utils/cid";
import {
  SetToRevisionRemixModal,
  setToRevisionRemixModalActions,
} from "./DoenetMLComparisonModals/SetToRevisionRemixModal";
import { processRemixes } from "../../../_utils/processRemixes";
import { createFullName } from "../../../_utils/names";

export async function doenetMLComparisonActions({
  formObj,
}: {
  [k: string]: any;
}) {
  const resultTSM = await takeSnapshotModelActions({ formObj });
  if (resultTSM) {
    return resultTSM;
  }

  const resultRM = await setToRevisionRemixModalActions({ formObj });
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
  compare,
  revNum,
  remixId,
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
  compare: "revisions" | "remixSources" | "remixes" | "";
  revNum: number;
  remixId: string;
}) {
  const navigate = useNavigate();

  const selectedRevision = useMemo(() => {
    if (compare === "revisions") {
      return revisions.find((rev) => rev.revisionNum === revNum) ?? null;
    }
    return null;
  }, [compare, revisions, revNum]);

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

  const [remixSources, setRemixSources] = useState<ActivityRemixItem[] | null>(
    null,
  );
  const [remixes, setRemixes] = useState<ActivityRemixItem[] | null>(null);

  useEffect(() => {
    setRemixSources(null);
    setRemixes(null);
  }, [contentId]);

  async function getRemixSources() {
    const { data } = await axios.get(
      `/api/remix/getRemixSources/${contentId}?includeSource=true`,
    );

    const newRemixSources = processRemixes(data.remixSources);
    setRemixSources(newRemixSources);
    return newRemixSources;
  }

  async function getRemixes() {
    const { data } = await axios.get(
      `/api/remix/getRemixes/${contentId}?includeSource=true`,
    );

    const newRemixes = processRemixes(data.remixes);
    setRemixes(newRemixes);
    return newRemixes;
  }

  async function remixesChangedCallback() {
    await getRemixSources();
    await getRemixes();
  }

  useEffect(() => {
    if (compare === "remixSources") {
      if (remixSources === null) {
        getRemixSources();
      }
    } else if (compare === "remixes") {
      if (remixes === null) {
        getRemixes();
      }
    }
  }, [compare]);

  const selectedRemix = useMemo(() => {
    if (compare === "remixSources") {
      return (
        remixSources?.find((rem) => rem.originContent.contentId === remixId) ??
        null
      );
    } else if (compare === "remixes") {
      return (
        remixes?.find((rem) => rem.remixContent.contentId === remixId) ?? null
      );
    }
    return null;
  }, [compare, remixSources, remixes, remixId]);

  const [atSelectedRemix, setAtSelectedRemix] = useState(false);
  const [ignoreRemixUpdate, setIgnoreRemixUpdate] = useState(false);

  useEffect(() => {
    async function checkIfAtSelectedRemix() {
      if (selectedRemix) {
        const selectedCid =
          compare === "remixSources"
            ? selectedRemix.originContent.currentCid
            : selectedRemix.remixContent.currentCid;

        setAtSelectedRemix(selectedCid === currentCid);
      } else {
        setAtSelectedRemix(false);
      }
    }

    checkIfAtSelectedRemix();
  }, [currentCid, selectedRemix]);

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
    isOpen: revisionRemixInfoIsOpen,
    onOpen: revisionRemixInfoOnOpen,
    onClose: revisionRemixInfoOnClose,
  } = useDisclosure();

  const revisionRemixInfoModal = (selectedRevision || selectedRemix) && (
    <RevisionRemixInfoModal
      isOpen={revisionRemixInfoIsOpen}
      onClose={revisionRemixInfoOnClose}
      revision={selectedRevision}
      remix={selectedRemix}
      isRemixSource={compare === "remixSources"}
    />
  );

  const {
    isOpen: setToRevisionRemixIsOpen,
    onOpen: setToRevisionRemixOnOpen,
    onClose: setToRevisionRemixOnClose,
  } = useDisclosure();

  const setToRevisionRemixModal = (selectedRevision || selectedRemix) && (
    <SetToRevisionRemixModal
      isOpen={setToRevisionRemixIsOpen}
      onClose={setToRevisionRemixOnClose}
      contentId={contentId}
      activityName={activityName}
      revision={selectedRevision}
      remix={selectedRemix}
      isRemixSource={compare === "remixSources"}
      ignoreRemixUpdate={ignoreRemixUpdate}
      fetcher={fetcher}
      doenetmlChangeCallback={doenetmlChangeCallback}
      immediateDoenetmlChangeCallback={immediateDoenetmlChangeCallback}
      remixesChangedCallback={remixesChangedCallback}
    />
  );

  const {
    isOpen: scratchpadInfoIsOpen,
    onOpen: scratchpadInfoOnOpen,
    onClose: scratchpadInfoOnClose,
  } = useDisclosure();

  const scratchpadInfoModal = (
    <ScratchpadInfoModal
      isOpen={scratchpadInfoIsOpen}
      onClose={scratchpadInfoOnClose}
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
  } else if (selectedRemix) {
    const selectedHasUpdates =
      (compare === "remixSources" && selectedRemix.originContent.changed) ||
      (compare === "remixes" && selectedRemix.remixContent.changed);

    if (selectedHasUpdates) {
      const updateMessage =
        (atSelectedRemix ? `Already at` : `Update to`) +
        " current state of " +
        (compare === "remixSources"
          ? "activity that you remixed from."
          : "remixed activity");

      const ignoreMessage =
        "Ignore change in " +
        (compare === "remixSources"
          ? "activity that you remixed from."
          : "remixed activity");

      updateButtons = (
        <>
          <Tooltip label={updateMessage} openDelay={500}>
            <Button
              size="xs"
              marginLeft="10px"
              aria-label={updateMessage}
              isDisabled={atSelectedRemix}
              onClick={() => {
                setIgnoreRemixUpdate(false);
                setToRevisionRemixOnOpen();
              }}
            >
              {atSelectedRemix ? (
                <>Already up-to-date with &#x1f534;</>
              ) : (
                <>Update to &#x1f534;</>
              )}
            </Button>
          </Tooltip>
          <Tooltip label={ignoreMessage} openDelay={500}>
            <Button
              size="xs"
              marginLeft="10px"
              aria-label={ignoreMessage}
              onClick={() => {
                setIgnoreRemixUpdate(true);
                setToRevisionRemixOnOpen();
              }}
            >
              Ignore change &#x1f534;
            </Button>
          </Tooltip>
        </>
      );
    }
  }

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
        {updateButtons}
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

  if (compare === "revisions") {
    if (selectedRevision) {
      otherDoenetML = selectedRevision.source;
      otherDoenetmlVersion = selectedRevision.doenetmlVersion ?? "";
      haveOtherDoc = true;
    }
  } else if (compare === "remixSources") {
    if (selectedRemix) {
      otherDoenetML = selectedRemix.originContent.source ?? "";
      otherDoenetmlVersion = selectedRemix.originContent.doenetmlVersion ?? "";
      haveOtherDoc = true;
    }
  } else if (compare === "remixes") {
    if (selectedRemix) {
      otherDoenetML = selectedRemix.remixContent.source ?? "";
      otherDoenetmlVersion = selectedRemix.remixContent.doenetmlVersion ?? "";
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
        value={revNum}
        onChange={(e) => {
          navigate(
            `.?mode=Compare&compare=${compare}&revNum=${e.target.value}`,
            {
              replace: true,
            },
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
            revisionRemixInfoOnOpen();
          }}
        >
          Revision info
        </Button>
      )}
    </>
  );

  const remixSourcesSelector = remixSources && (
    <>
      <Select
        placeholder={
          remixSources.length > 0
            ? "Select activity"
            : "Not remixed from other activities"
        }
        size="sm"
        variant="filled"
        height="25px"
        marginLeft="5px"
        width="200px"
        value={remixId}
        onChange={(e) => {
          navigate(
            `.?mode=Compare&compare=${compare}&remix=${e.target.value}`,
            {
              replace: true,
            },
          );
        }}
      >
        {remixSources.map((rem) => (
          <option
            key={rem.originContent.contentId}
            value={rem.originContent.contentId}
          >
            {rem.originContent.changed && <>&#x1f534; </>}
            {rem.originContent.name} by{" "}
            {createFullName(rem.originContent.owner)}{" "}
          </option>
        ))}
      </Select>
      {selectedRemix && (
        <Button
          size="xs"
          marginLeft="5px"
          aria-label="Information on remix source"
          onClick={() => {
            revisionRemixInfoOnOpen();
          }}
        >
          Remix source info
        </Button>
      )}
    </>
  );

  const remixesSelector = remixes && (
    <>
      <Select
        placeholder={
          remixes.length > 0 ? "Select activity" : "No visible remixes (yet!)"
        }
        size="sm"
        variant="filled"
        height="25px"
        marginLeft="5px"
        width="200px"
        value={remixId}
        onChange={(e) => {
          navigate(
            `.?mode=Compare&compare=${compare}&remix=${e.target.value}`,
            {
              replace: true,
            },
          );
        }}
      >
        {remixes.map((rem) => (
          <option
            key={rem.remixContent.contentId}
            value={rem.remixContent.contentId}
          >
            {rem.remixContent.changed && <>&#x1f534; </>}
            {rem.remixContent.name} by {createFullName(rem.remixContent.owner)}{" "}
          </option>
        ))}
      </Select>
      {selectedRemix && (
        <Button
          size="xs"
          marginLeft="5px"
          aria-label="Information on remixed activity"
          onClick={() => {
            revisionRemixInfoOnOpen();
          }}
        >
          Remixed activity info
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
        width="160px"
        size="sm"
        variant="filled"
        height="25px"
        value={compare}
        placeholder="Select comparison"
        onChange={(e) => {
          navigate(`.?mode=Compare&compare=${e.target.value}`, {
            replace: true,
          });
        }}
      >
        <option value="revisions">Revisions</option>
        <option value="remixSources">Remix Sources</option>
        <option value="remixes">Remixes</option>
      </Select>
      {compare === "revisions" && revisionsSelector}
      {compare === "remixSources" && remixSourcesSelector}
      {compare === "remixes" && remixesSelector}
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
            {compare === "revisions" && selectedRevision && (
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
      {revisionRemixInfoModal}
      {scratchpadInfoModal}
      {setToRevisionRemixModal}
      <PanelPair
        panelA={currentEditor}
        panelB={otherEditor}
        height={`calc(100vh - ${headerHeight})`}
      />
    </>
  );
}
