import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Form,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import axios from "axios";
import { User } from "./SiteHeader";
import { createFullName } from "../../../_utils/names";

export async function action({
  params,
  request,
  formData,
}: {
  params: any;
  request: any;
  formData?: any;
}) {
  if (!formData) {
    formData = await request.formData();
  }
  let formObj = Object.fromEntries(formData);

  if (formObj._action === "change user name") {
    await axios.post(`/api/updateUser`, {
      firstNames: formObj.firstNames,
      lastNames: formObj.lastNames,
    });
    return true;
  }

  return null;
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect");

  return { redirectTo };
}

export function ChangeName({
  hideHomeButton = false,
}: {
  hideHomeButton?: boolean;
}) {
  const { redirectTo } = useLoaderData() as {
    redirectTo: string | undefined;
  };

  const user = useOutletContext<User>();

  let navigate = useNavigate();

  const [firstNames, setFirstNames] = useState(user?.firstNames ?? "");
  const [lastNames, setLastNames] = useState(user?.lastNames ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    if (submitted) {
      if (user === undefined) {
        setStatusText("Cannot change name; no user logged in.");
      } else {
        setStatusText(`Name changed to ${createFullName(user)}`);
        if (
          redirectTo &&
          user.firstNames === firstNames &&
          user.lastNames === lastNames
        ) {
          navigate(redirectTo);
        } else {
          setSubmitted(false);
        }
      }
    }
  }, [user]);

  return (
    <Box margin="20px">
      <Heading size="lg">Enter your name</Heading>
      {statusText !== "" ? (
        <Box
          border="solid 1px lightgray"
          borderRadius="5px"
          padding="5px 10px"
          marginTop="10px"
          backgroundColor="orange.100"
        >
          {statusText}
        </Box>
      ) : null}

      <Form
        method="post"
        onSubmit={() => {
          setSubmitted(true);
        }}
      >
        <Flex width="400px" maxWidth="100%">
          <FormControl>
            <FormLabel mt="16px">First name(s):</FormLabel>
            <Input
              placeholder="First Name(s)"
              name="firstNames"
              size="sm"
              width={40}
              marginRight="5px"
              value={firstNames ?? ""}
              onChange={(e) => {
                setFirstNames(e.target.value);
              }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mt="16px">Last name(s):</FormLabel>
            <Input
              placeholder="Last Names"
              name="lastNames"
              size="sm"
              width={40}
              value={lastNames}
              onChange={(e) => {
                setLastNames(e.target.value);
              }}
            />
          </FormControl>
        </Flex>
        <Flex marginTop="8px">
          <Button
            type="submit"
            colorScheme="blue"
            mr="12px"
            size="xs"
            isDisabled={submitted}
          >
            Submit
          </Button>
          {!redirectTo && !hideHomeButton ? (
            <Button
              colorScheme="blue"
              mr="12px"
              size="xs"
              onClick={() => {
                navigate("/");
              }}
            >
              Go to home
            </Button>
          ) : null}
          <Spinner hidden={!submitted} />
        </Flex>
        <input type="hidden" name="_action" value="change user name" />
      </Form>
    </Box>
  );
}
