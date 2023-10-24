import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Image,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  checkIfUserClearedOut,
  clearUsersInformationFromTheBrowser,
} from "../../../_utils/applicationUtils";

export async function loader() {
  await clearUsersInformationFromTheBrowser();
  const isSignedOutObj = await checkIfUserClearedOut();
  return { isSignedOutObj };
}

//TODO: inform if not signed out
export function SignOut() {
  const { isSignedOutObj } = useLoaderData();
  const navigate = useNavigate();

  return (
    <>
      <Box w="100vw" h="100vh" bg="gray.100">
        <AbsoluteCenter>
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            pt={4}
            pb={1}
          >
            <Flex alignItems="center" justifyContent="center">
              <Image
                objectFit="cover"
                w={{ base: "0px", lg: "160px", xl: "250px" }}
                h={{ base: "0px", lg: "160px", xl: "250px" }}
                alt="Doenet Logo"
                src={"/Doenet_Logo_Frontpage.png"}
              />
            </Flex>
            <Stack>
              <CardBody w="350px" p={2}>
                <Flex alignItems="center" justifyContent="center" mb="20px">
                  <Image
                    objectFit="cover"
                    w={{ base: "200px", lg: "0px" }}
                    h={{ base: "200px", lg: "0px" }}
                    alt="Doenet Logo"
                    src={"/Doenet_Logo_Frontpage.png"}
                  />
                </Flex>
                {isSignedOutObj.cookieRemoved &&
                isSignedOutObj.userInformationIsCompletelyRemoved ? (
                  <>
                    <Flex alignItems="center" justifyContent="center" mb="20px">
                      <Heading size="lg">You are Signed Out!</Heading>
                    </Flex>
                    <CardFooter>
                      <Flex w="100%" justifyContent="center">
                        <Button
                          colorScheme="blue"
                          onClick={() => navigate("/")}
                        >
                          Home
                        </Button>
                      </Flex>
                    </CardFooter>
                  </>
                ) : (
                  <>
                    <Flex alignItems="center" justifyContent="center" mb={4}>
                      <Heading size="md">You are NOT Signed Out!</Heading>
                    </Flex>
                    <Flex mb={6} alignItems="center" justifyContent="center">
                      <Text size="lg" as="b">
                        Hit refresh to try again.
                      </Text>
                    </Flex>

                    <Text size="lg">Errors</Text>
                    <UnorderedList>
                      {isSignedOutObj.messageArray.map((msg, i) => {
                        return (
                          <ListItem key={i} m={2}>
                            {msg}
                          </ListItem>
                        );
                      })}
                    </UnorderedList>
                  </>
                )}
              </CardBody>
            </Stack>
          </Card>
        </AbsoluteCenter>
      </Box>
    </>
  );
}
