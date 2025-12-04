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
import { useState } from "react";
import { Form, replace, useLoaderData, useOutletContext } from "react-router";
import axios from "axios";
import { SiteContext } from "./SiteHeader";

export async function action({
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
  const formObj = Object.fromEntries(formData);

  if (formObj._action === "change user name") {
    await axios.post(`/api/user/updateUser`, {
      firstNames: formObj.firstNames,
      lastNames: formObj.lastNames,
    });
    return replace(formObj.redirectTo);
  }

  return null;
}

export async function loader({ request }: { request: any }) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect");

  return { redirectTo };
}

/**
 * A page that allows a user to change their name. There must already be a logged in user
 * for this page to work.
 *
 * Upon submissions, this page redirects to the search param address `redirect` or
 * the homepage if `redirect` is not provided.
 */
export function ChangeName() {
  const { redirectTo } = useLoaderData();

  const { user } = useOutletContext<SiteContext>();
  if (user === undefined) {
    throw Error("No user logged in.");
  }

  const [firstNames, setFirstNames] = useState(user?.firstNames ?? "");
  const [lastNames, setLastNames] = useState(user?.lastNames ?? "");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Box margin="20px">
      <Heading size="lg">Enter your name</Heading>

      <Form
        method="post"
        onSubmit={() => {
          setSubmitted(true);
        }}
      >
        <input type="hidden" name="_action" value="change user name" />
        <input type="hidden" name="redirectTo" value={redirectTo ?? "/"} />

        <Flex wrap="wrap">
          <FormControl width="13rem">
            <FormLabel mt="16px">First name(s):</FormLabel>
            <Input
              placeholder="First Name(s)"
              name="firstNames"
              size="sm"
              width="11rem"
              marginRight="5px"
              value={firstNames ?? ""}
              onChange={(e) => {
                setFirstNames(e.target.value);
              }}
            />
          </FormControl>
          <FormControl isRequired width="13rem">
            <FormLabel mt="16px">Last name(s):</FormLabel>
            <Input
              placeholder="Last Names"
              name="lastNames"
              size="sm"
              width="11rem"
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
          <Spinner hidden={!submitted} />
        </Flex>
      </Form>
    </Box>
  );
}
