import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
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
import { redirect } from "react-router";
import { useFetcher } from "react-router-dom";

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  try {
    if (formObj._action == "submit email") {
      let { data } = await axios.get("/api/sendSignInEmail.php", {
        params: { emailaddress: formObj.emailAddress },
      });
      return redirect(
        `/signinCode?email=${formObj.emailAddress}&device=${data.deviceName}&stay=${formObj.staySignedIn}`,
      );

      // return {
      //   _action: formObj._action,
      //   deviceName: data.deviceName,
      //   emailAddress: formObj.emailAddress,
      //   staySignedIn: formObj.staySignedIn,
      //   success: true,
      // };
    }
  } catch (e) {
    return {
      success: false,
      message: e.response.data.message,
      _action: formObj._action,
    };
  }
}

export function SignIn() {
  const fetcher = useFetcher();
  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
                <Heading size="lg">Sign In via Email</Heading>

                <FormControl isInvalid={emailError} mt="20px">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    size="md"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => {
                      let nextValue = e.target.value;
                      //Clear error if email is now good
                      if (emailError != null && emailRegex.test(nextValue)) {
                        setEmailError(null);
                      }
                      setEmailAddress(nextValue);
                    }}
                  />
                  <FormErrorMessage>{emailError}</FormErrorMessage>
                </FormControl>

                <Checkbox
                  isChecked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                >
                  Stay Signed In
                </Checkbox>
              </CardBody>

              <CardFooter>
                <Flex w="100%" justifyContent="center">
                  <Button
                    variant="solid"
                    isDisabled={isDisabled}
                    rightIcon={isDisabled ? <Spinner size="sm" /> : undefined}
                    colorScheme="blue"
                    onClick={() => {
                      if (emailAddress == "") {
                        setEmailError("Please enter your email address");
                      } else if (!emailRegex.test(emailAddress)) {
                        setEmailError("Invalid email format");
                      } else {
                        setEmailError(null);
                        setIsDisabled(true);
                        //Email is correct
                        fetcher.submit(
                          {
                            _action: "submit email",
                            emailAddress,
                            staySignedIn: isChecked,
                          },
                          { method: "post" },
                        );
                      }
                    }}
                  >
                    Send Email
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
