import React, { RefObject, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Center,
  Box,
  Flex,
} from "@chakra-ui/react";
import { QRCode } from "react-qrcode-logo";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdOutlineContentCopy } from "react-icons/md";
import { Content } from "../../../_utils/types";

export function AssignmentInvitation({
  isOpen,
  onClose,
  finalFocusRef,
  activityData,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  activityData: Content;
}) {
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    setUrlCopied(false);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={50} textAlign="center">
          {activityData.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize={30}>
          {activityData.assignmentStatus === "Open" ? (
            <Flex justifyContent="center">
              <Box width="500px">
                <p>To view this activity, go to </p>
                <Center marginTop="10px" fontSize={40}>
                  <code>doenet.org/code</code>
                </Center>
                <p>and enter the code</p>
                <Center marginTop="10px" fontSize={40}>
                  <code>{activityData.classCode}</code>
                </Center>
                <p>or scan the QR code.</p>
                <Center>
                  <QRCode
                    value={`https://doenet.org/code/${activityData.classCode}`}
                    logoImage={"/Doenet_Logo_Frontpage.png"}
                    removeQrCodeBehindLogo
                    logoPaddingStyle="circle"
                    logoWidth={100}
                    size={300}
                    style={{ maxWidth: "100%", marginTop: "30px" }}
                    ecLevel="Q"
                  />
                </Center>
              </Box>
            </Flex>
          ) : (
            <p>The activity is not available.</p>
          )}
        </ModalBody>

        <ModalFooter>
          <CopyToClipboard
            onCopy={() => {
              setUrlCopied(true);
            }}
            text={`https://doenet.org/code/${activityData.classCode}`}
          >
            <Button leftIcon={<MdOutlineContentCopy />} marginRight="10px">
              {urlCopied ? "URL copied" : "Copy URL"}
            </Button>
          </CopyToClipboard>

          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
