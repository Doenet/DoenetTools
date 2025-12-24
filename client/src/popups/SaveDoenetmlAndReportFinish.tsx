import { RefObject, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  HStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useFetcher, useNavigate, useOutletContext } from "react-router";
import { SiteContext } from "../paths/SiteHeader";

/**
 * A modal that immediately upon opening saves the DoenetML into an new document in Activities
 *
 * When the save is finished, the modal allows the user to close it or navigate to Activities.
 */
export function SaveDoenetmlAndReportFinish({
  isOpen,
  onClose,
  finalFocusRef,
  DoenetML,
  documentName,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement | null>;
  DoenetML: string;
  documentName: string;
}) {
  const [newContentId, setNewContentId] = useState<string | null>(null);

  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");

  const fetcher = useFetcher();

  const { user, setAddTo } = useOutletContext<SiteContext>();

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.status === 200) {
        setNewContentId(fetcher.data.data.contentId);
      } else {
        const message = fetcher.data.message;
        setErrMsg(
          `An error occurred while saving${message ? ": " + message : ""}.`,
        );
      }

      document.body.style.cursor = "default";
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (isOpen) {
      if (newContentId === null) {
        document.body.style.cursor = "wait";

        fetcher.submit(
          {
            path: "updateContent/createContent",
            parentId: null,
            contentType: "singleDoc",
            doenetml: DoenetML,
            name: documentName,
          },
          { method: "post", encType: "application/json" },
        );
      }
    } else {
      setNewContentId(null);
      setErrMsg("");
    }
    // When we included all the dependencies here, it copied content several times
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const destinationAction = "Go to My Activities";
  const destinationUrl = `/activities/${user?.userId}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="md"
      closeOnOverlayClick={newContentId !== null}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" data-test="Copy Header">
          {newContentId === null
            ? errMsg === ""
              ? "Saving..."
              : "An error occurred"
            : `Save finished`}
        </ModalHeader>
        {newContentId !== null ? <ModalCloseButton /> : null}
        <ModalBody data-test="Copy Body">
          {errMsg === "" ? (
            newContentId === null ? (
              <HStack>
                <Text>Saving...</Text>
                <Spinner />
              </HStack>
            ) : (
              <>
                Successfully saved to new document "{documentName}" in My
                Activities
              </>
            )
          ) : (
            <>{errMsg}</>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            data-test="Go to Destination"
            marginRight="4px"
            onClick={() => {
              onClose();
              setAddTo(null);
              navigate(destinationUrl);
            }}
            isDisabled={newContentId === null && errMsg === ""}
          >
            {destinationAction}
          </Button>
          <Button
            data-test="Close Button"
            onClick={() => {
              onClose();
            }}
            isDisabled={newContentId === null && errMsg === ""}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
