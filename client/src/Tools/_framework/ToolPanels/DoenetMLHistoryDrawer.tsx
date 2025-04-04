import React, {
  ReactElement,
  RefObject,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DoenetEditor } from "@doenet/doenetml-iframe";
import { PanelPair } from "../../../Widgets/PanelPair";
import { ContentRevision, DoenetmlVersion } from "../../../_utils/types";
import {
  Box,
  Button,
  Flex,
  Heading,
  Hide,
  Select,
  Show,
  Text,
  Tooltip,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@chakra-ui/react";
import { MdOutlineCameraAlt } from "react-icons/md";
import { FetcherWithComponents } from "react-router";

import {
  CreateRevisionModel,
  createRevisionModelActions,
} from "./DoenetMLHistoryModals/CreateRevisionModal";
import {
  RevisionInfoModal,
  revisionInfoModalActions,
} from "./DoenetMLHistoryModals/RevisionInfoModal";
import { DateTime } from "luxon";
import { cidFromText } from "../../../_utils/cid";
import {
  SetToRevisionModal,
  setToRevisionModalActions,
} from "./DoenetMLHistoryModals/SetToRevisionModal";

export async function doenetMLHistoryActions({
  formObj,
}: {
  [k: string]: any;
}) {
  const resultTSM = await createRevisionModelActions({ formObj });
  if (resultTSM) {
    return resultTSM;
  }

  const resultRM = await setToRevisionModalActions({ formObj });
  if (resultRM) {
    return resultRM;
  }

  const resultRIM = await revisionInfoModalActions({ formObj });
  if (resultRIM) {
    return resultRIM;
  }

  return null;
}

export function DoenetMLHistoryDrawer({
  doenetML,
  doenetmlChangeCallback,
  immediateDoenetmlChangeCallback,
  documentStructureCallback: _documentStructureCallback, /// TODO: how to handle document structure changes
  doenetmlVersion,
  isOpen,
  onClose,
  finalFocusRef,
  fetcher,
  contentId,
  activityName = "",
  revisions,
}: {
  doenetML: string;
  doenetmlChangeCallback: () => Promise<void>;
  immediateDoenetmlChangeCallback: (arg: string) => void;
  documentStructureCallback: (arg: any) => void;
  doenetmlVersion: DoenetmlVersion;
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  fetcher: FetcherWithComponents<any>;
  contentId: string;
  activityName?: string;
  revisions: ContentRevision[];
}) {
  const [revNum, setRevNum] = useState(0);

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

  const revisionRemixInfoModal = selectedRevision && (
    <RevisionInfoModal
      isOpen={revisionRemixInfoIsOpen}
      onClose={revisionRemixInfoOnClose}
      revision={selectedRevision}
      fetcher={fetcher}
      contentId={contentId}
    />
  );

  const {
    isOpen: setToRevisionIsOpen,
    onOpen: setToRevisionOnOpen,
    onClose: setToRevisionOnClose,
  } = useDisclosure();

  const setToRevisionModal = selectedRevision && (
    <SetToRevisionModal
      isOpen={setToRevisionIsOpen}
      onClose={setToRevisionOnClose}
      contentId={contentId}
      revision={selectedRevision}
      fetcher={fetcher}
      doenetmlChangeCallback={doenetmlChangeCallback}
      immediateDoenetmlChangeCallback={immediateDoenetmlChangeCallback}
      setRevNum={setRevNum}
    />
  );

  let updateButton: ReactElement | null = null;
  if (selectedRevision) {
    const message =
      (atSelectedRevision ? `Already at` : `Use`) + ` this save point`;
    const extendedMessage = message + ": " + selectedRevision.revisionName;

    updateButton = (
      <Tooltip label={extendedMessage} openDelay={500} placement="bottom-end">
        <Button
          size="xs"
          marginLeft="10px"
          aria-label={extendedMessage}
          isDisabled={atSelectedRevision}
          onClick={() => {
            setToRevisionOnOpen();
          }}
        >
          {message}
        </Button>
      </Tooltip>
    );
  }

  const revisionLabel = atLastRevision
    ? "Save point already created"
    : "Create a new save point from the current state of the activity";

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
            isDisabled={atLastRevision}
            leftIcon={<MdOutlineCameraAlt />}
            onClick={() => {
              createRevisionOnOpen();
            }}
          >
            Create save point
          </Button>
        </Tooltip>
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
          revisions.length > 0 ? "Select save point" : "No save point available"
        }
        size="sm"
        variant="filled"
        height="25px"
        marginLeft="5px"
        width="200px"
        value={revNum}
        onChange={(e) => {
          setRevNum(Number(e.target.value));
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
          marginLeft="10px"
          aria-label="Information on selected save point"
          onClick={() => {
            revisionRemixInfoOnOpen();
          }}
        >
          Save point info
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
      {updateButton}
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
          <Hide above="sm">above</Hide>. Select a save point to see its history.
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {createRevisionModel}
      {revisionRemixInfoModal}
      {setToRevisionModal}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={finalFocusRef}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton data-test="Close History Drawer Button" />
          <DrawerHeader textAlign="center" height="70px">
            Document history
            <Tooltip label={activityName} openDelay={1000}>
              <Text fontSize="smaller" noOfLines={1}>
                {activityName}
              </Text>
            </Tooltip>
          </DrawerHeader>

          <DrawerBody pb="0">
            <PanelPair
              panelA={currentEditor}
              panelB={otherEditor}
              height={`calc(100vh - 138px)`}
            />
          </DrawerBody>
          <DrawerFooter height="60px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
