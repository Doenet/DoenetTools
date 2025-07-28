import React from "react";
import axios from "axios";
import { PanelPair } from "../../widgets/PanelPair";
import { Remixes } from "../../drawerTabs/Remixes";
import { RemixSources } from "../../drawerTabs/RemixSources";
import { processRemixes } from "../../utils/processRemixes";
import { useLoaderData, useNavigate, useOutletContext } from "react-router";
import { ActivityRemixItem } from "../../types";
import {
  Box,
  Center,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";
import { EditorContext } from "./EditorHeader";

export async function loader({ params }: { params: any }) {
  const { data } = await axios.get(
    `/api/remix/getRemixSources/${params.contentId}`,
  );
  const sources = processRemixes(data.remixSources);

  const { data: data2 } = await axios.get(
    `/api/remix/getRemixes/${params.contentId}`,
  );
  const remixes = processRemixes(data2.remixes);

  return { remixes, sources };
}

/**
 * This page allows you to view your remix sources and remixes.
 * Context: `documentEditor`
 */
export function DocEditorRemixMode() {
  const { remixes, sources } = useLoaderData() as {
    remixes: ActivityRemixItem[];
    sources: ActivityRemixItem[];
  };

  const { contentName } = useOutletContext<EditorContext>();

  const haveChangedSource = sources.some(
    (source) => source.originContent.changed,
  );
  const haveChangedRemix = remixes.some((remix) => remix.remixContent.changed);

  const navigate = useNavigate();

  const sourcesPanel = (
    <Box margin="1rem">
      <Center>
        <Heading size="md">This document is remixed from:</Heading>
      </Center>
      <RemixSources
        contributorHistory={sources}
        haveChangedSource={haveChangedSource}
      />
    </Box>
  );
  const remixesPanel = (
    <Box margin="1rem">
      <Center>
        <Heading size="md">Others have remixed this document:</Heading>
      </Center>
      <Remixes remixes={remixes} haveChangedRemix={haveChangedRemix} />
    </Box>
  );

  return (
    <Modal
      size="full"
      motionPreset="none"
      isOpen={true}
      onClose={() => {
        navigate(-1);
      }}
    >
      <ModalContent>
        <ModalHeader>
          <Center>{contentName} - Remixes</Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PanelPair
            panelA={sourcesPanel}
            panelB={remixesPanel}
            preferredDirection="vertical"
            centerWidth="0px"
            height={`calc(100vh - 138px)`}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
