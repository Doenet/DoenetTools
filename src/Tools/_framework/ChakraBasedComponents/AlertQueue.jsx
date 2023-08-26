import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  VStack,
} from "@chakra-ui/react";
import React from "react";

export function AlertQueue({ alerts = [], setAlerts = () => {} }) {
  return (
    <>
      <VStack spacing={2} width="100%">
        {alerts.map(({ type, title, description, id }) => {
          return (
            <Alert key={`alert${id}`} status={type}>
              <AlertIcon />
              <AlertTitle fontSize="md">{title}</AlertTitle>
              <AlertDescription fontSize="md">{description}</AlertDescription>
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => {
                  setAlerts((preAlerts) => {
                    preAlerts.filter((alert) => alert.id == id);
                  });
                }}
              />
            </Alert>
          );
        })}
      </VStack>
    </>
  );
}
