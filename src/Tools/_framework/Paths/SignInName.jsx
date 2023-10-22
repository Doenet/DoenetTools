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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router";
import { useFetcher } from "react-router-dom";

export async function action({ params, request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  try {
    if (formObj._action == "submit email") {
      let { data } = await axios.get("/api/sendSignInEmail.php", {
        params: { emailaddress: formObj.emailAddress },
      });
      return {
        _action: formObj._action,
        deviceName: data.deviceName,
        emailAddress: formObj.emailAddress,
        staySignedIn: formObj.staySignedIn,
        success: true,
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

      if (data.hasFullName == 1) {
        //Redirect if we have their full name
        //and there wasn't an error with sign in
        // TODO: Redirect to portfolio
      }
      return {
        _action: formObj._action,
        isNewAccount: data.existed,
        hasFullName: data.hasFullName,
        success: true,
      };
    } else if (formObj._action == "submit name") {
      let { data } = await axios.get("/api/saveUsersName.php", {
        params: {
          firstName: formObj.firstName,
          lastName: formObj.lastName,
          email: formObj.emailAddress,
        },
      });
      console.log("data", data);
      return true;

      // TODO: Redirect to portfolio
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

function AskForEmailCard({ fetcher }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
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
  );
}

function EnterCodeCard({ fetcher, emailAddress, deviceName, staySignedIn }) {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  console.log("EnterCodeCard fetcher", fetcher);
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
                  //TODO: WHY NOT WORKING???
                  setIsExpired(false);
                  setCodeError(null);
                  setCode("");
                  console.log({
                    _action: "submit email",
                    emailAddress,
                    staySignedIn,
                  });
                  fetcher.submit(
                    {
                      _action: "submit email",
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
  );
}

function AskForNameCard({ fetcher, emailAddress, deviceName, staySignedIn }) {
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
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
              onChange={(e) => {
                if (e.target.value != "") {
                  setFirstNameError(null);
                }
                setFirstName(e.target.value);
              }}
            />
            <FormErrorMessage>{firstNameError}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={lastNameError} mt="20px">
            <FormLabel>Last Name:</FormLabel>
            <Input
              onChange={(e) => {
                if (e.target.value != "") {
                  setLastNameError(null);
                }
                setLastName(e.target.value);
              }}
            />
            <FormErrorMessage>{lastNameError}</FormErrorMessage>
          </FormControl>
        </CardBody>

        <CardFooter>
          <Flex w="100%" justifyContent="center">
            <Button
              variant="solid"
              colorScheme="blue"
              isDisabled={isDisabled}
              rightIcon={isDisabled ? <Spinner size="sm" /> : undefined}
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
                      emailAddress,
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
  );
}

export function SignInName() {
  // const { success } = useLoaderData();
  const fetcher = useFetcher();
  let formObj = {};
  if (fetcher.formData !== undefined) {
    formObj = Object.fromEntries(fetcher.formData);
  }
  console.log("fetcher.state", fetcher.state);
  console.log("fetcher.data", fetcher.data);
  console.log("formObj", formObj);
  console.log("---------------------\n");

  let emailAddress = useRef(null);
  let deviceName = useRef(null);
  let staySignedIn = useRef(null);
  //card is a ref because we need the card to stay
  // and not have to track every possible state

  //Enter Email
  let card = useRef(<AskForEmailCard fetcher={fetcher} />);
  if (fetcher.state === "idle") {
    if (
      (fetcher.data?._action === "submit email" && fetcher.data?.success) ||
      (fetcher.data?._action === "submit code" && !fetcher.data?.success)
    ) {
      //Enter Code
      emailAddress.current = fetcher.data.emailAddress;
      staySignedIn.current = fetcher.data.staySignedIn;
      deviceName.current = fetcher.data.deviceName;

      card.current = (
        <EnterCodeCard
          fetcher={fetcher}
          emailAddress={emailAddress.current}
          deviceName={deviceName.current}
          staySignedIn={staySignedIn.current}
        />
      );
    } else if (
      (fetcher.data?._action === "submit code" && fetcher.data?.success) ||
      (fetcher.data?._action === "submit name" && !fetcher.data?.success)
    ) {
      //Enter Name
      card.current = (
        <AskForNameCard
          fetcher={fetcher}
          emailAddress={emailAddress.current}
          deviceName={deviceName.current}
          staySignedIn={staySignedIn.current}
        />
      );
    }
  }

  // card = <EnterCodeCard fetcher={fetcher} emailAddress={emailAddress.current} deviceName={deviceName.current} />;

  // const setActivityByDoenetId = useSetRecoilState(itemByDoenetId(doenetId)); //TODO: remove after recoil is gone
  // const setPageByDoenetId = useSetRecoilState(itemByDoenetId(pageId)); //TODO: remove after recoil is gone

  // let location = useLocation();

  // const navigate = useNavigate();

  // const [recoilPageToolView, setRecoilPageToolView] =
  //   useRecoilState(pageToolViewAtom);

  // let navigateTo = useRef("");

  // if (navigateTo.current != "") {
  //   const newHref = navigateTo.current;
  //   navigateTo.current = "";
  //   location.href = newHref;
  //   navigate(newHref);
  // }

  //Optimistic UI
  // let effectiveLabel = activityData.pageLabel;
  // if (activityData.isSinglePage) {
  //   effectiveLabel = activityData.label;
  //   if (fetcher.data?._action == "update label") {
  //     effectiveLabel = fetcher.data.label;
  //   }
  // } else {
  //   if (fetcher.data?._action == "update page label") {
  //     effectiveLabel = fetcher.data.pageLabel;
  //   }
  // }

  return (
    <>
      <Box w="100vw" h="100vh" bg="gray.100">
        <AbsoluteCenter>{card.current}</AbsoluteCenter>
      </Box>
    </>
  );
}
