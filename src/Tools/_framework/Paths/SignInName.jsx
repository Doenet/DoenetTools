import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router";
import { useFetcher } from "react-router-dom";

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);
  const url = new URL(request.url);
  const portfolioId = url.searchParams.get("portfolioId");
  const emailAddress = url.searchParams.get("email");

  try {
    if (formObj._action == "submit name") {
      let { data } = await axios.get("/api/saveUsersName.php", {
        params: {
          firstName: formObj.firstName,
          lastName: formObj.lastName,
          email: emailAddress,
        },
      });

      //Redirect to portfolio
      return redirect(`/portfolio/${portfolioId}`);
    }

    return { success: true };
  } catch (e) {
    return {
      success: false,
      message: e.response.data.message,
      _action: formObj._action,
    };
  }
}

export function SignInName() {
  const fetcher = useFetcher();
  // let formObj = {};
  // if (fetcher.formData !== undefined) {
  //   formObj = Object.fromEntries(fetcher.formData);
  // }

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

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
                <Heading size="lg">Please Enter Your Name.</Heading>

                <FormControl isInvalid={firstNameError} mt="20px">
                  <FormLabel>First Name:</FormLabel>
                  <Input
                    data-test="firstNameInput"
                    onChange={(e) => {
                      if (e.target.value != "") {
                        setFirstNameError(null);
                      }
                      setFirstName(e.target.value);
                    }}
                  />
                  <FormErrorMessage data-test="firstNameError">
                    {firstNameError}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={lastNameError} mt="20px">
                  <FormLabel>Last Name:</FormLabel>
                  <Input
                    data-test="lastNameInput"
                    onChange={(e) => {
                      if (e.target.value != "") {
                        setLastNameError(null);
                      }
                      setLastName(e.target.value);
                    }}
                  />
                  <FormErrorMessage data-test="lastNameError">
                    {lastNameError}
                  </FormErrorMessage>
                </FormControl>
              </CardBody>

              <CardFooter>
                <Flex w="100%" justifyContent="center">
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    isDisabled={isDisabled}
                    rightIcon={isDisabled ? <Spinner size="sm" /> : undefined}
                    data-test="submitName"
                    onClick={() => {
                      if (firstName == "") {
                        setFirstNameError("Please enter your first name.");
                      }
                      if (lastName == "") {
                        setLastNameError("Please enter your last name.");
                      }
                      if (firstName != "" && lastName != "") {
                        setFirstNameError(null);
                        setLastNameError(null);
                        setIsDisabled(true);

                        fetcher.submit(
                          {
                            _action: "submit name",
                            firstName,
                            lastName,
                          },
                          { method: "post" },
                        );
                      }
                    }}
                  >
                    Submit Name
                  </Button>
                </Flex>
              </CardFooter>
            </Stack>
          </Card>
        </AbsoluteCenter>
      </Box>
    </>
  );
}
