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
  HStack,
  Heading,
  Image,
  PinInput,
  PinInputField,
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
  const url = new URL(request.url);
  const emailAddress = url.searchParams.get("email");
  const deviceName = url.searchParams.get("device");
  const staySignedIn = url.searchParams.get("stay");

  try {
    if (formObj._action == "send new code") {
      let { data } = await axios.get("/api/sendSignInEmail.php", {
        params: { emailaddress: emailAddress, deviceName },
      });

      return {
        success: true,
        _action: formObj._action,
      };
    } else if (formObj._action == "submit code") {
      //TODO: need check credentials to give back the portfolio course id
      let { data } = await axios.get("/api/checkCredentials.php", {
        params: {
          emailaddress: emailAddress,
          nineCode: formObj.code,
          deviceName: deviceName,
        },
      });

      //Attempt to store cookies!
      const { data: jwtdata } = await axios.get(
        `/api/jwt.php?emailaddress=${encodeURIComponent(
          emailAddress,
        )}&nineCode=${encodeURIComponent(
          formObj.code,
        )}&deviceName=${deviceName}&newAccount=${data.existed}&stay=${
          staySignedIn == "true" ? "1" : "0"
        }`,
        { withCredentials: true },
      );

      //Redirect to portfolio
      //or ask for name
      if (data.hasFullName) {
        //Redirect to portfolio
        return redirect(`/portfolio/${data.portfolioCourseId}`);
      } else {
        //Redirect to askname
        return redirect(
          `/signinName?email=${encodeURIComponent(
            emailAddress,
          )}&portfolioId=${encodeURIComponent(data.portfolioCourseId)}`,
        );
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
  const fetcher = useFetcher();

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  //Handle code entry errors
  if (fetcher.data?.success === false && fetcher.state === "idle") {
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
                    <PinInput
                      data-test="signinCodeInput"
                      value={code}
                      onChange={(code) => setCode(code)}
                    >
                      <PinInputField data-test="code-input-0" />
                      <PinInputField data-test="code-input-1" />
                      <PinInputField data-test="code-input-2" />
                      <PinInputField data-test="code-input-3" />
                      <PinInputField data-test="code-input-4" />
                      <PinInputField data-test="code-input-5" />
                      <PinInputField data-test="code-input-6" />
                      <PinInputField data-test="code-input-7" />
                      <PinInputField data-test="code-input-8" />
                    </PinInput>
                  </HStack>
                  <FormErrorMessage data-test="code-err">
                    {codeError}
                  </FormErrorMessage>
                </FormControl>
              </CardBody>

              <CardFooter>
                <Flex w="100%" justifyContent="center">
                  {isExpired ? (
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      data-test="sendNewCodeButton"
                      onClick={() => {
                        setIsExpired(false);
                        setCodeError(null);
                        setCode("");
                        fetcher.submit(
                          {
                            _action: "send new code",
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
                      data-test="submitCodeButton"
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
