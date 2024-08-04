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
import {
  Form,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import axios from "axios";
import { User } from "./SiteHeader";

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
  const navigateTo = "/";

  return { navigateTo };
}

export function ChangeName() {
  const { navigateTo } = useLoaderData() as {
    navigateTo: string | undefined;
  };

  const user = useOutletContext<User>();

  let navigate = useNavigate();

  const [firstNames, setFirstNames] = useState(user?.firstNames ?? "");
  const [lastNames, setLastNames] = useState(user?.lastNames ?? "");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (navigateTo && submitted) {
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
