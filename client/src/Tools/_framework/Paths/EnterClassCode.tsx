import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
import { redirect, useLoaderData } from "react-router";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";

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

  if (formObj._action == "submit code") {
    let code: string = formObj.classCode.trim();
    while (code[code.length - 1] === ".") {
      code = code.substring(0, code.length - 1);
    }
    return redirect(`/code/${code}`);
  }

  return null;
}

export async function loader() {
  return {
    invalidClassCode: "",
  };
}

export function EnterClassCode() {
  const { invalidClassCode } = useLoaderData() as { invalidClassCode: string };

  useEffect(() => {
    document.title = `Enter class code - Doenet`;
  }, []);

  let [classCode, setClassCode] = useState(invalidClassCode);
  const haveInvalidClassCode = Boolean(invalidClassCode);

  return (
    <Center>
      <Box margin="20px">
        <Form method="post">
          <FormControl isRequired isInvalid={haveInvalidClassCode}>
            <FormLabel mt="16px">Enter class code:</FormLabel>
            <Input
              placeholder="Class Code"
              name="classCode"
              value={classCode}
              onChange={(e) => {
                setClassCode(e.target.value);
              }}
              size="sm"
              width={40}
            />
            <FormErrorMessage>
              Class code {invalidClassCode} not found
            </FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="blue" mt="8px" mr="12px" size="xs">
            Submit code
          </Button>
          <input type="hidden" name="_action" value="submit code" />
        </Form>
      </Box>
    </Center>
  );
}
