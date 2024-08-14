import React, { useEffect, useRef, useState } from "react";
import {
  FetcherWithComponents,
  Form,
  Link,
  useActionData,
} from "react-router-dom";
import {
  Box,
  FormLabel,
  Select,
  Checkbox,
  FormControl,
  FormErrorMessage,
  Image,
  Tooltip,
  Text,
  HStack,
  List,
  ListItem,
  ListIcon,
  Input,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  CloseButton,
  Show,
  VStack,
  Hide,
} from "@chakra-ui/react";
import {
  ContentStructure,
  License,
  LicenseCode,
} from "../Paths/ActivityEditor";
import { InfoIcon } from "@chakra-ui/icons";
import { MdCircle } from "react-icons/md";
import axios from "axios";
import { createFullName } from "../../../_utils/names";

export async function sharingActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "make content public") {
    if (formObj.isFolder === "true") {
      await axios.post("/api/makeFolderPublic", {
        id: Number(formObj.id),
        licenseCode: formObj.licenseCode,
      });
    } else {
      await axios.post("/api/makeActivityPublic", {
        id: Number(formObj.id),
        licenseCode: formObj.licenseCode,
      });
    }
    return true;
  } else if (formObj._action == "make content private") {
    if (formObj.isFolder === "true") {
      await axios.post("/api/makeFolderPrivate", {
        id: Number(formObj.id),
      });
    } else {
      await axios.post("/api/makeActivityPrivate", {
        id: Number(formObj.id),
      });
    }
    return true;
  } else if (formObj._action === "share content") {
    try {
      if (formObj.isFolder === "true") {
        await axios.post("/api/shareFolder", {
          id: Number(formObj.id),
          licenseCode: formObj.licenseCode,
          email: formObj.email,
        });
      } else {
        await axios.post("/api/shareActivity", {
          id: Number(formObj.id),
          licenseCode: formObj.licenseCode,
          email: formObj.email,
        });
      }
    } catch (e) {
      if (e.response?.data === "User with email not found") {
        return { email: formObj.email, status: "Not found" };
      } else {
        throw e;
      }
    }
    return { status: "Added", email: formObj.email };
  } else if (formObj._action === "unshare content") {
    if (formObj.isFolder === "true") {
      await axios.post("/api/unshareFolder", {
        id: Number(formObj.id),
        userId: formObj.userId,
      });
    } else {
      await axios.post("/api/unshareActivity", {
        id: Number(formObj.id),
        userId: formObj.userId,
      });
    }

    return true;
  } else if (formObj._action == "set license") {
    if (formObj.isFolder === "true") {
      await axios.post("/api/setFolderLicense", {
        id: Number(formObj.id),
        licenseCode: formObj.licenseCode,
      });
    } else {
      await axios.post("/api/setActivityLicense", {
        id: Number(formObj.id),
        licenseCode: formObj.licenseCode,
      });
    }
    return true;
  }

  return null;
}

export function ShareSettings({
  fetcher,
  contentData,
  allLicenses,
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: ContentStructure;
  allLicenses: License[];
}) {
  let license = contentData.license;

  const [selectedIsPublic, setSelectedIsPublic] = useState(
    contentData.isPublic,
  );
  const [selectedLicenseCode, setSelectedLicenseCode] = useState(license?.code);

  const [shareWithEmail, setShareWithEmail] = useState("");
  const [showSpinner, setShowSpinner] = useState<{
    type: string;
    id?: number;
  } | null>(null);

  const [statusText, setStatusText] = useState("");
  const nextStatusText = useRef("");
  const [errorMessage, setErrorMessage] = useState("");

  const initialActionResult = useRef(true);

  useEffect(() => {
    setSelectedLicenseCode(license?.code);
  }, [license?.code]);

  useEffect(() => {
    setSelectedIsPublic(contentData.isPublic);
  }, [contentData.isPublic]);

  let missingLicense = selectedIsPublic && selectedLicenseCode === undefined;

  let placeholder = missingLicense ? "Select license" : undefined;

  let contentType = contentData.isFolder ? "Folder" : "Activity";
  let contentTypeLower = contentData.isFolder ? "folder" : "activity";

  const actionResult: any = useActionData();

  useEffect(() => {
    if (actionResult?.status === "Added") {
      setShareWithEmail("");
      setErrorMessage("");
    } else if (actionResult?.status === "Not found") {
      nextStatusText.current = "";
      setStatusText("");
      setShowSpinner(null);

      // Need this check so don't get old error message when reopening the controls
      if (!initialActionResult.current) {
        setErrorMessage(`User with email ${actionResult.email} not found`);
      }
    } else {
      setErrorMessage("");
    }
    initialActionResult.current = false;
  }, [actionResult]);

  useEffect(() => {
    setShowSpinner(null);
    setStatusText(nextStatusText.current);
  }, [contentData]);

  return (
    <>
      <Box>
        <Box
          marginTop="10px"
          border="2px solid lightgray"
          background="lightgray"
          padding="10px"
        >
          {!(contentData.isPublic || contentData.isShared) ? (
            contentData.isFolder ? (
              <p>
                Folder is private. However, shared items within the folder can
                still be found.
              </p>
            ) : (
              <p>Activity is private.</p>
            )
          ) : license === null ? (
            <Box
              marginTop="10px"
              border="2px solid black"
              background="orange.100"
              padding="5px"
            >
              <InfoIcon color="orange.500" mr="2px" /> {contentType} is shared
              without specifying a license. Please select a license below to
              inform other how they can use your content.
            </Box>
          ) : (
            <>
              {license.isComposition ? (
                <>
                  <p>{contentType} is shared with these licenses:</p>
                  <List spacing="20px" marginTop="10px">
                    {license.composedOf.map((comp) => (
                      <DisplayLicenseItem licenseItem={comp} key={comp.code} />
                    ))}
                  </List>
                  <p style={{ marginTop: "10px" }}>
                    (You authorize reuse under any of these licenses.)
                  </p>
                </>
              ) : (
                <>
                  <p>{contentType} is shared using the license:</p>
                  <List marginTop="10px">
                    <DisplayLicenseItem licenseItem={license} />
                  </List>
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      <Box>
        {contentData.parentFolder?.isPublic ||
        contentData.parentFolder?.isShared ? (
          <p style={{ marginTop: "10px" }}>
            This {contentTypeLower} is inside a shared folder and inherits its
            settings.
          </p>
        ) : null}

        {statusText !== "" ? (
          <Box
            data-test="Status message"
            border="solid 1px lightgray"
            borderRadius="5px"
            padding="5px 10px"
            marginTop="10px"
            backgroundColor="orange.100"
          >
            {statusText}
          </Box>
        ) : null}

        {contentData.isShared || contentData.isPublic ? (
          <>
            <TableContainer
              maxHeight="200px"
              overflowY="auto"
              marginBottom="20px"
              marginTop="20px"
              position="relative"
            >
              <Table size="sm">
                <Thead
                  position="sticky"
                  top={0}
                  backgroundColor="var(--canvas)"
                >
                  <Tr>
                    <Th
                      colSpan={3}
                      textTransform="none"
                      color="inherit"
                      fontSize="inherit"
                      fontWeight="inherit"
                      fontFamily="inherit"
                      paddingLeft="0px"
                      fontStyle="inherit"
                    >
                      People with access
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contentData.isPublic ? (
                    <Tr>
                      <Show above="sm">
                        <Td>Everyone</Td>
                        <Td>(shared publicly)</Td>
                      </Show>
                      <Hide above="sm">
                        <Td>
                          <VStack alignItems="left">
                            <Text>Everyone</Text>
                            <Text>(shared publicly)</Text>
                          </VStack>
                        </Td>
                      </Hide>
                      <Td>
                        {contentData.parentFolder?.isPublic ? (
                          <Text>(inherited)</Text>
                        ) : (
                          <Tooltip label={`Stop sharing publicly`}>
                            <CloseButton
                              type="submit"
                              aria-label={`Stop sharing publicly`}
                              onClick={() => {
                                nextStatusText.current =
                                  "Stopped sharing publicly";
                                setShowSpinner({
                                  type: "unshare",
                                  id: 0,
                                });
                                fetcher.submit(
                                  {
                                    _action: "make content private",
                                    id: contentData.id,
                                    isFolder: Boolean(contentData.isFolder),
                                  },
                                  { method: "post" },
                                );
                              }}
                            />
                          </Tooltip>
                        )}
                      </Td>
                      <Td width="60px">
                        <Spinner
                          hidden={
                            showSpinner?.type !== "unshare" ||
                            showSpinner.id !== 0
                          }
                        />
                      </Td>
                    </Tr>
                  ) : null}
                  {contentData.sharedWith.map((user) => {
                    const sharedViaFolder =
                      (contentData.parentFolder?.sharedWith.findIndex(
                        (cs) => cs.userId === user.userId,
                      ) ?? -1) !== -1;
                    return (
                      <Tr key={user.userId}>
                        <Show above="sm">
                          <Td>{createFullName(user)}</Td>
                          <Td>{user.email}</Td>
                        </Show>
                        <Hide above="sm">
                          <Td>
                            <VStack alignItems="left">
                              <Text>{createFullName(user)}</Text>
                              <Text>{user.email}</Text>
                            </VStack>
                          </Td>
                        </Hide>
                        <Td>
                          {sharedViaFolder ? (
                            <Text>(inherited)</Text>
                          ) : (
                            <Form method="post">
                              <Tooltip label={`Remove ${createFullName(user)}`}>
                                <CloseButton
                                  type="submit"
                                  aria-label={`Remove ${createFullName(user)}`}
                                  onClick={() => {
                                    setShowSpinner({
                                      type: "unshare",
                                      id: user.userId,
                                    });
                                    nextStatusText.current = `Stopped sharing with ${createFullName(user)}`;
                                  }}
                                />
                              </Tooltip>

                              <Input
                                type="hidden"
                                name="_action"
                                value="unshare content"
                              />
                              <Input
                                type="hidden"
                                name="id"
                                value={contentData.id}
                              />
                              <Input
                                type="hidden"
                                name="userId"
                                value={user.userId}
                              />
                              <Input
                                type="hidden"
                                name="email"
                                value={user.email}
                              />
                              <Input
                                type="hidden"
                                name="isFolder"
                                value={Boolean(contentData.isFolder).toString()}
                              />
                            </Form>
                          )}
                        </Td>
                        <Td width="60px">
                          <Spinner
                            hidden={
                              showSpinner?.type !== "unshare" ||
                              showSpinner.id !== user.userId
                            }
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        ) : null}

        <Form
          method="post"
          onSubmit={() => {
            setShowSpinner({ type: "emailShare" });
            nextStatusText.current = `Successfully shared with ${shareWithEmail}`;
          }}
        >
          <FormControl isInvalid={errorMessage !== ""} marginTop="20px">
            <FormLabel>Add people</FormLabel>
            <HStack>
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={shareWithEmail}
                data-test="Email address"
                onChange={(e) => setShareWithEmail(e.target.value)}
                width="90%"
              />
              <Spinner hidden={showSpinner?.type !== "emailShare"} />
            </HStack>
            <Input type="hidden" name="_action" value="share content" />
            <Input type="hidden" name="id" value={contentData.id} />
            <Input
              type="hidden"
              name="isFolder"
              value={Boolean(contentData.isFolder).toString()}
            />
            <Input
              type="hidden"
              name="licenseCode"
              value={selectedLicenseCode ?? "CCDUAL"}
            />
            {errorMessage !== "" ? (
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            ) : null}
          </FormControl>
        </Form>

        {contentData.parentFolder?.isPublic ? null : (
          <>
            <HStack gap={5}>
              <Checkbox
                marginTop="20px"
                isChecked={selectedIsPublic}
                onChange={() => {
                  setShowSpinner({ type: "public" });
                  if (contentData.isPublic) {
                    nextStatusText.current = "Stopped sharing publicly";
                    fetcher.submit(
                      {
                        _action: "make content private",
                        id: contentData.id,
                        isFolder: Boolean(contentData.isFolder),
                      },
                      { method: "post" },
                    );
                    setSelectedIsPublic(false);
                  } else {
                    nextStatusText.current = "Successfully shared publicly";
                    fetcher.submit(
                      {
                        _action: "make content public",
                        id: contentData.id,
                        licenseCode: selectedLicenseCode ?? "CCDUAL",
                        isFolder: Boolean(contentData.isFolder),
                      },
                      { method: "post" },
                    );
                    setSelectedIsPublic(true);
                  }
                }}
              >
                Share publicly
              </Checkbox>
              <Spinner
                hidden={showSpinner?.type !== "public"}
                marginTop="20px"
              />
            </HStack>
          </>
        )}

        {contentData.parentFolder?.isPublic ||
        contentData.parentFolder?.isShared ? null : (
          <FormControl isInvalid={missingLicense}>
            <FormLabel mt="20px">Change license</FormLabel>
            <HStack gap={5}>
              <Select
                width="90%"
                placeholder={placeholder}
                value={selectedLicenseCode}
                onChange={(e) => {
                  setShowSpinner({ type: "license" });
                  setStatusText("");
                  nextStatusText.current = "Successfully changed license.";
                  let newLicenseCode = e.target.value as LicenseCode;
                  setSelectedLicenseCode(newLicenseCode);
                  fetcher.submit(
                    {
                      _action: "set license",
                      id: contentData.id,
                      licenseCode: newLicenseCode,
                      isFolder: Boolean(contentData.isFolder),
                    },
                    { method: "post" },
                  );
                }}
              >
                {allLicenses.map((license) => (
                  <option value={license.code} key={license.code}>
                    {license.name}
                  </option>
                ))}
              </Select>
              <Spinner hidden={showSpinner?.type !== "license"} />
            </HStack>
            <FormErrorMessage>
              A license is required to make public.
            </FormErrorMessage>
          </FormControl>
        )}
      </Box>
    </>
  );
}

export function DisplayLicenseItem({
  licenseItem,
}: {
  licenseItem: {
    name: string;
    description: string;
    imageURL: string | null;
    licenseURL: string | null;
  };
}) {
  let image: React.JSX.Element | null = null;
  if (licenseItem.imageURL) {
    image = (
      <Image
        src={licenseItem.imageURL}
        alt={`Badge for license: ${licenseItem.name}`}
        width="100px"
      />
    );
  }

  let item = (
    <Tooltip label={licenseItem.description}>
      <HStack>
        {image}
        <Text>{licenseItem.name}</Text>
      </HStack>
    </Tooltip>
  );
  if (licenseItem.licenseURL) {
    item = (
      <Link to={licenseItem.licenseURL} target="_blank">
        {item}
      </Link>
    );
  }

  return (
    <ListItem>
      <HStack>
        <ListIcon as={MdCircle} margin="0px" />
        {item}
      </HStack>
    </ListItem>
  );
}
