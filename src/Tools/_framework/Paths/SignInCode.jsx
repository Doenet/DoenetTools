import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  PinInput,
  PinInputField,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router";
import { useFetcher } from "react-router-dom";

export async function loader({ request }) {
  //Search Parameters to useLoaderData
  const url = new URL(request.url);
  const emailAddress = url.searchParams.get("email");
  const deviceName = url.searchParams.get("device");
  const staySignedIn = url.searchParams.get("stay");
  return { emailAddress, deviceName, staySignedIn };
}

export async function action({ params, request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  try {
    if (formObj._action == "send new code") {
      let { data } = await axios.get("/api/sendSignInEmail.php", {
        params: { emailaddress: formObj.emailAddress },
      });
      return {
        success: true,
        _action: formObj._action,
      };
    } else if (formObj._action == "submit code") {
      //TODO: need check credentials to give back the portfolio course id
      let { data } = await axios.get("/api/checkCredentials.php", {
        params: {
          emailaddress: formObj.emailAddress,
          nineCode: formObj.code,
          deviceName: formObj.deviceName,
        },
      });
      console.log("submit code data", data);

      //Attempt to store cookies!
      const { data: jwtdata } = await axios.get(
        `/api/jwt.php?emailaddress=${encodeURIComponent(
          formObj.emailAddress,
        )}&nineCode=${encodeURIComponent(formObj.code)}&deviceName=${
          formObj.deviceName
        }&newAccount=${data.existed}&stay=${
          formObj.staySignedIn == "true" ? "1" : "0"
        }`,
        { withCredentials: true },
      );

      console.log("jwtdata", jwtdata);

      //Redirect to portfolio
      //or ask for name
      if (data.hasFullName) {
        //Redirect to portfolio
        return redirect(`/portfolio/${data.portfolioCourseId}`);
      } else {
        //Redirect to askname
        return redirect(`/signinName`);
      }
    }
  } catch (e) {
    return {
      success: false,
      message: e.response.data.message,
      _action: formObj._action,
    };
  }
}

export function SignInCode() {
  const { emailAddress, deviceName, staySignedIn } = useLoaderData();

  const fetcher = useFetcher();
  let formObj = {};
  if (fetcher.formData !== undefined) {
    formObj = Object.fromEntries(fetcher.formData);
  }
  console.log("fetcher.state", fetcher.state);
  console.log("fetcher.data", fetcher.data);
  console.log("formObj", formObj);
  console.log("---------------------\n");

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  //Handle code entry errors
  if (fetcher.data?.success == false) {
    //Guard against an infinite loop
    if (codeError !== fetcher.data.message) {
      setCodeError(fetcher.data.message);
      setIsDisabled(false);
      if (fetcher.data.message == "Code expired.") {
        setIsExpired(true);
      }
    }
  }

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
                <Heading size="lg">Check your email for the code.</Heading>

                <FormControl isInvalid={codeError} mt="20px">
                  <FormLabel>Sign-in code (9 digit code):</FormLabel>
                  <HStack>
                    <PinInput value={code} onChange={(code) => setCode(code)}>
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                  <FormErrorMessage>{codeError}</FormErrorMessage>
                </FormControl>
              </CardBody>

              <CardFooter>
                <Flex w="100%" justifyContent="center">
                  {isExpired ? (
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      onClick={() => {
                        setIsExpired(false);
                        setCodeError(null);
                        setCode("");
                        fetcher.submit(
                          {
                            _action: "send new code",
                            emailAddress: "char0042@umn.edu",
                            staySignedIn: true,
                          },
                          { method: "post" },
                        );
                      }}
                    >
                      Send New Code
                    </Button>
                  ) : (
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      isDisabled={isDisabled}
                      rightIcon={isDisabled ? <Spinner size="sm" /> : undefined}
                      onClick={() => {
                        if (code == "") {
                          setCodeError(
                            "Please enter the nine digits sent to your email.",
                          );
                        } else if (code.length < 9) {
                          setCodeError("Please enter all nine digits.");
                        } else {
                          setCodeError(null);
                          setIsDisabled(true);
                          fetcher.submit(
                            {
                              _action: "submit code",
                              emailAddress,
                              deviceName,
                              staySignedIn,
                              code,
                            },
                            { method: "post" },
                          );
                        }
                      }}
                    >
                      Submit Code
                    </Button>
                  )}
                </Flex>
              </CardFooter>
            </Stack>
          </Card>
        </AbsoluteCenter>
      </Box>
    </>
  );
}
