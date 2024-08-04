import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Form, useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";

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

export async function loader({ params, request }) {
  let {
    data: { user },
  } = await axios.get("/api/getUser");

  const navigateTo = "/";

  return { user, navigateTo };
}

export function ChangeName() {
  const { user, navigateTo } = useLoaderData() as {
    user: { firstNames: string | null; lastNames: string } | undefined;
    navigateTo: string | undefined;
  };

  let navigate = useNavigate();

  const [firstNames, setFirstNames] = useState(user?.firstNames ?? "");
  const [lastNames, setLastNames] = useState(user?.lastNames ?? "");
  const [submitted, setSubmitted] = useState(false);

  console.log("navigateTo", navigateTo);

  useEffect(() => {
    if (navigateTo && submitted) {
      console.log("we shouldn't navigate anywhere!");
      setTimeout(() => {
        navigate(navigateTo);
      }, 100);
    }
  }, [submitted, navigateTo]);

  return (
    <Box margin="20px">
      <Heading size="lg">Enter your name</Heading>
      <Form
        method="post"
        onSubmit={() => {
          setSubmitted(true);
        }}
      >
        <Flex width="400px">
          <FormControl>
            <FormLabel mt="16px">First name(s):</FormLabel>
            <Input
              placeholder="First Name(s)"
              name="firstNames"
              size="sm"
              width={40}
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
        <Button type="submit" colorScheme="blue" mt="8px" mr="12px" size="xs">
          Submit
        </Button>
        <input type="hidden" name="_action" value="change user name" />
      </Form>
    </Box>
  );
}
