import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RefObject, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { downloadStudentAccountCredentialsToCsv } from "../utils/csv";

export function AddStudents({
  folderId,
  isOpen,
  onClose,
  finalFocusRef,
}: {
  folderId: string;
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement | null>;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [numAccounts, setNumAccounts] = useState(1);
  const [created, setCreated] = useState(false);

  const addAccountsFetcher = useFetcher();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="md"
      returnFocusOnClose={false}
      initialFocusRef={cancelRef}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Add students</ModalHeader>
        <ModalBody pb="40px">
          {addAccountsFetcher.data?.data === undefined && (
            <HStack mt="20px">
              <Text>How many students?</Text>
              <NumberInput
                min={1}
                max={500}
                maxW={24}
                value={numAccounts}
                onChange={(v) => setNumAccounts(Number(v))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
          )}

          {addAccountsFetcher.data?.data !== undefined && (
            <VStack>
              <Button
                onClick={() =>
                  downloadStudentAccountCredentialsToCsv({
                    title: "Student accounts",
                    accounts: addAccountsFetcher.data.data.accounts,
                  })
                }
              >
                Download Passwords
              </Button>
              <Text>Passwords will never be downloadable again.</Text>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {addAccountsFetcher.data?.data === undefined && (
            <Button
              marginRight="4px"
              onClick={() => {
                addAccountsFetcher.submit(
                  {
                    path: "user/handles",
                    numAccounts,
                    folderId,
                  },
                  { method: "post", encType: "application/json" },
                );
                setCreated(true);
              }}
            >
              Create {numAccounts} accounts
            </Button>
          )}
          <Button
            data-test="Cancel Button"
            onClick={() => {
              onClose();
              setCreated(false);
              setNumAccounts(1);
            }}
            ref={cancelRef}
          >
            {created ? "Done" : "Cancel"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
