import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { RiEmotionSadLine } from "react-icons/ri";
import { useRouteError } from "react-router";

export default function ErrorPanel() {
  const error = useRouteError();
  const responseCode = error?.respose?.status;
  const message =
    error?.response?.data?.message ||
    "An internal error occurred " + responseCode;
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      alignContent="center"
      minHeight={200}
      background="doenet.canvas"
      padding={20}
      width="100%"
    >
      <Icon fontSize="48pt" as={RiEmotionSadLine} />
      <Text fontSize="36pt">{message}</Text>
    </Flex>
  );
}
