import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  VStack,
} from "@chakra-ui/react";
import React from "react";

export function AlertQueue({
  alerts = [],
  setAlerts = () => {},
  short = false,
}) {
  return (
    <>
      <VStack spacing={2} width="100%">
        {alerts.map(({ type, title, description, id }) => {
          return (
            <Alert
              key={`alert${id}`}
              status={type}
              pt={short ? 1 : undefined}
              pb={short ? 1 : undefined}
              mt={short ? "5px" : undefined}
            >
              <AlertIcon />
              <AlertTitle fontSize="md" data-test="Alert Title">
                {title}
              </AlertTitle>
              <AlertDescription fontSize="md" data-test="Alert Description">
                {description}
              </AlertDescription>
              <CloseButton
                data-test="Alert Close Button"
                position="absolute"
                right="8px"
                top={short ? "0px" : "8px"}
                onClick={() => {
                  setAlerts((preAlerts) =>
                    preAlerts.filter((alert) => alert.id !== id),
                  );
                }}
              />
            </Alert>
          );
        })}
      </VStack>
    </>
  );
}
