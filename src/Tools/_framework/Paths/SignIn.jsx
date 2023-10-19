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
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { useFetcher } from "react-router-dom";

export async function loader({ request, params }) {
  // const url = new URL(request.url);
  // const from = url.searchParams.get("from");
  try {
    return { success: true };
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

export async function action({ params, request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  console.log({ formObj });

  try {
    if (formObj._action == "submit email") {
      let { data } = await axios.get("/api/sendSignInEmail.php", {
        params: { email: formObj.emailAddress },
      });
      return {
        _action: formObj._action,
        deviceName: data.deviceName,
        success: true,
      };
    }

    return { success: true };
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

function AskForEmailCard({ fetcher }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
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
              colorScheme="blue"
              onClick={() => {
                if (emailAddress == "") {
                  setEmailError("Please enter your email address");
                } else if (!emailRegex.test(emailAddress)) {
                  setEmailError("Invalid email format");
                } else {
                  setEmailError(null);
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

function EnterCodeCard({ fetcher }) {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(null);
  console.log("code", code);
  console.log("codeError", codeError);
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
            <FormLabel>Code (9 digit code):</FormLabel>
            <HStack>
              <PinInput onChange={(code) => setCode(code)}>
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
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => {
                if (code == "") {
                  setCodeError(
                    "Please enter the nine digits sent to your email.",
                  );
                } else if (code.length < 9) {
                  setCodeError("Please enter all nine digits.");
                } else {
                  setCodeError(null);
                }
                //else if (!emailRegex.test(emailAddress)) {
                //   setEmailError("Invalid email format");
                // } else {
                //   setEmailError(null);
                //   //Email is correct
                //   fetcher.submit(
                //     {
                //       _action: "submit email",
                //       emailAddress,
                //       staySignedIn: isChecked,
                //     },
                //     { method: "post" },
                //   );
                // }
              }}
            >
              Submit Code
            </Button>
          </Flex>
        </CardFooter>
      </Stack>
    </Card>
  );
}

export function SignIn() {
  const { success } = useLoaderData();
  const fetcher = useFetcher();

  let card = <AskForEmailCard fetcher={fetcher} />;

  // console.log("fetcher", fetcher);
  if (fetcher.state === "idle" && fetcher.data?._action === "submit email") {
    card = <div>test</div>;
  }

  card = <EnterCodeCard fetcher={fetcher} />;

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
        <AbsoluteCenter>{card}</AbsoluteCenter>
      </Box>
    </>
  );
}
