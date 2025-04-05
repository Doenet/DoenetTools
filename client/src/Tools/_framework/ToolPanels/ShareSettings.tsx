import React, { ReactElement, useEffect, useRef, useState } from "react";
import { FetcherWithComponents, Form, Link, useActionData } from "react-router";
import {
  Box,
  FormLabel,
  Select,
  Checkbox,
  FormControl,
  FormErrorMessage,
  Tooltip,
  Text,
  HStack,
  List,
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
  Button,
} from "@chakra-ui/react";
import { InfoIcon, WarningIcon } from "@chakra-ui/icons";
import axios from "axios";
import { createFullName } from "../../../_utils/names";
import { Content, License, LicenseCode } from "../../../_utils/types";
import { DisplayLicenseItem } from "../../../Widgets/Licenses";
import { contentTypeToName } from "../../../_utils/activity";

export async function sharingActions({ formObj }: { [k: string]: any }) {
  if (formObj._action == "make content public") {
    await axios.post("/api/share/makeContentPublic", {
      contentId: formObj.contentId,
      licenseCode: formObj.licenseCode,
    });

    return true;
  } else if (formObj._action == "make content private") {
    await axios.post("/api/share/makeContentPrivate", {
      contentId: formObj.contentId,
    });
    return true;
  } else if (formObj._action === "share content") {
    try {
      await axios.post("/api/share/shareContent", {
        contentId: formObj.contentId,
        licenseCode: formObj.licenseCode,
        email: formObj.email,
      });
    } catch (e) {
      if (e.response?.data?.error) {
        const error = e.response?.data?.error;
        const details = e.response?.data?.details;
        if (
          error === "Invalid data" &&
          details[0]?.message === "Invalid email"
        ) {
          return { email: formObj.email, status: "Invalid email" };
        } else if (
          error === "Invalid request" &&
          details === "User with email not found"
        ) {
          return { email: formObj.email, status: "Not found" };
        } else if (
          error === "Invalid request" &&
          details === "Cannot share with self"
        ) {
          return { status: "No self share" };
        }
      }
      throw e;
    }

    return { status: "Added", email: formObj.email };
  } else if (formObj._action === "unshare content") {
    await axios.post("/api/share/unshareContent", {
      contentId: formObj.contentId,
      userId: formObj.userId,
    });

    return true;
  } else if (formObj._action == "set license") {
    await axios.post("/api/share/setContentLicense", {
      contentId: formObj.contentId,
      licenseCode: formObj.licenseCode,
    });
    return true;
  }

  return null;
}

export function ShareSettings({
  fetcher,
  contentData,
  allLicenses,
  remixedWithLicense,
}: {
  fetcher: FetcherWithComponents<any>;
  contentData: Content;
  allLicenses: License[];
  remixedWithLicense: LicenseCode | null;
}) {
  const license = contentData.license;

  const [selectedIsPublic, setSelectedIsPublic] = useState(
    contentData.isPublic,
  );
  const [selectedLicenseCode, setSelectedLicenseCode] = useState(license?.code);

  const [shareWithEmail, setShareWithEmail] = useState("");
  const [showSpinner, setShowSpinner] = useState<{
    type: string;
    id?: string;
  } | null>(null);

  const [statusText, setStatusText] = useState("");
  const nextStatusText = useRef("");
  const [errorMessage, setErrorMessage] = useState("");

  const initialActionResult = useRef(true);
  const shareSubmitButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSelectedLicenseCode(license?.code);
  }, [license?.code]);

  useEffect(() => {
    setSelectedIsPublic(contentData.isPublic);
  }, [contentData.isPublic]);

  const missingLicense = selectedIsPublic && selectedLicenseCode === undefined;

  const placeholder = missingLicense ? "Select license" : undefined;

  const contentTypeName = contentTypeToName[contentData.type];
  const contentTypeNameLower = contentTypeName.toLowerCase();

  const actionResult: any = useActionData();

  useEffect(() => {
    if (actionResult?.status === "Added") {
      setShareWithEmail("");
      setErrorMessage("");
    } else if (
      actionResult?.status === "Not found" ||
      actionResult?.status === "No self share" ||
      actionResult?.status === "Invalid email"
    ) {
      nextStatusText.current = "";
      setStatusText("");
      setShowSpinner(null);

      // Need this check so don't get old error message when reopening the controls
      if (!initialActionResult.current) {
        if (actionResult)
          if (actionResult.status === "No self share") {
            setErrorMessage("Cannot share with yourself");
          } else if (actionResult.status === "Invalid email") {
            setErrorMessage(`Invalid email: ${actionResult.email}`);
          } else {
            setErrorMessage(`User with email ${actionResult.email} not found`);
          }
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

  const licenseDeterminedFromRemix =
    selectedLicenseCode === remixedWithLicense &&
    remixedWithLicense !== "CCDUAL";

  const licenseNotMatchRemix =
    remixedWithLicense !== null &&
    remixedWithLicense !== "CCDUAL" &&
    selectedLicenseCode !== remixedWithLicense;

  let licenseWarning: ReactElement | null = null;
  if (licenseNotMatchRemix) {
    const remixedWithLicenseName = allLicenses.find(
      (l) => l.code === remixedWithLicense,
    )?.name;

    const selectedLicenseName = allLicenses.find(
      (l) => l.code === selectedLicenseCode,
    )?.name;

    licenseWarning = (
      <Box background="orange.100" marginTop="20px">
        <WarningIcon color="orange.500" mr="6px" />
        Selected license {selectedLicenseName} is not compatible with the
        license that this activity was remixed from: {remixedWithLicenseName}.{" "}
        <Link
          to="https://creativecommons.org/share-your-work/licensing-considerations/compatible-licenses/"
          target="_blank"
        >
          (More information)
        </Link>
      </Box>
    );
  }

  let chooseLicenseForm: ReactElement | null = null;
  if (licenseDeterminedFromRemix) {
    const licenseName = allLicenses.find(
      (l) => l.code === remixedWithLicense,
    )?.name;
    chooseLicenseForm = (
      <Box marginTop="20px" data-test="Cannot Change License">
        <p>License: {licenseName} </p>
        <p>
          (Cannot change license since remixed from activity with this license.)
        </p>
      </Box>
    );
  } else {
    chooseLicenseForm = (
      <FormControl isInvalid={missingLicense}>
        <FormLabel mt="20px">Change license</FormLabel>
        <HStack gap={5}>
          <Select
            width="90%"
            data-test="Select License"
            placeholder={placeholder}
            value={selectedLicenseCode}
            onChange={(e) => {
              setShowSpinner({ type: "license" });
              setStatusText("");
              nextStatusText.current = "Successfully changed license.";
              const newLicenseCode = e.target.value as LicenseCode;
              setSelectedLicenseCode(newLicenseCode);
              fetcher.submit(
                {
                  _action: "set license",
                  contentId: contentData.contentId,
                  licenseCode: newLicenseCode,
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
    );
  }

  return (
    <>
      <Box>
        {contentData.parent?.isPublic || contentData.parent?.isShared ? (
          <p style={{ marginTop: "10px" }}>
            This {contentTypeNameLower} is inside a shared{" "}
            {contentTypeToName[contentData.parent.type].toLowerCase()} and
            inherits its settings.
          </p>
        ) : null}

        <Box height="35px">
          {statusText !== "" ? (
            <Box
              data-test="Status message"
              border="solid 1px lightgray"
              borderRadius="5px"
              padding="5px 10px"
              backgroundColor="green.100"
            >
              {statusText}
            </Box>
          ) : null}
        </Box>

        {contentData.parent?.isPublic ? null : (
          <>
            <HStack gap={5}>
              <Checkbox
                marginTop="10px"
                isChecked={selectedIsPublic}
                data-test="Public Checkbox"
                onChange={() => {
                  setShowSpinner({ type: "public" });
                  if (contentData.isPublic) {
                    nextStatusText.current = "Stopped sharing publicly.";
                    fetcher.submit(
                      {
                        _action: "make content private",
                        contentId: contentData.contentId,
                      },
                      { method: "post" },
                    );
                    setSelectedIsPublic(false);
                  } else {
                    nextStatusText.current = "Successfully shared publicly.";
                    fetcher.submit(
                      {
                        _action: "make content public",
                        contentId: contentData.contentId,
                        licenseCode: selectedLicenseCode ?? "CCDUAL",
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
                marginTop="10px"
              />
            </HStack>
          </>
        )}

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
                        {contentData.parent?.isPublic ? (
                          <Text>(inherited)</Text>
                        ) : (
                          <Tooltip label={`Stop sharing publicly`}>
                            <CloseButton
                              type="submit"
                              aria-label={`Stop sharing publicly`}
                              onClick={() => {
                                nextStatusText.current =
                                  "Stopped sharing publicly.";
                                setShowSpinner({
                                  type: "unpublic",
                                });
                                fetcher.submit(
                                  {
                                    _action: "make content private",
                                    contentId: contentData.contentId,
                                  },
                                  { method: "post" },
                                );
                              }}
                            />
                          </Tooltip>
                        )}
                      </Td>
                      <Td width="60px">
                        <Spinner hidden={showSpinner?.type !== "unpublic"} />
                      </Td>
                    </Tr>
                  ) : null}
                  {contentData.sharedWith.map((user) => {
                    const sharedViaFolder =
                      (contentData.parent?.sharedWith.findIndex(
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
                                    nextStatusText.current = `Stopped sharing with ${createFullName(user)}.`;
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
                                name="contentId"
                                value={contentData.contentId}
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
            nextStatusText.current = `Successfully shared with ${shareWithEmail}.`;
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
                onBlur={(e) => {
                  if (e.target.value) {
                    shareSubmitButton.current?.click();
                  }
                }}
              />
              <Spinner hidden={showSpinner?.type !== "emailShare"} />
            </HStack>
            <Input type="hidden" name="_action" value="share content" />
            <Input
              type="hidden"
              name="contentId"
              value={contentData.contentId}
            />
            <Input
              type="hidden"
              name="licenseCode"
              value={selectedLicenseCode ?? "CCDUAL"}
            />
            <Button type="submit" ref={shareSubmitButton} hidden={true} />
            {errorMessage !== "" ? (
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            ) : null}
          </FormControl>
        </Form>

        {chooseLicenseForm}
        {licenseWarning}
      </Box>

      <Box>
        <Box
          marginTop="20px"
          border="2px solid lightgray"
          background="lightgray"
          padding="10px"
        >
          {!(contentData.isPublic || contentData.isShared) ? (
            contentData.type === "folder" ? (
              <p>
                Folder is private. However, shared items within the folder can
                still be found.
              </p>
            ) : contentData.type === "singleDoc" ? (
              <p>Activity is private.</p>
            ) : (
              <p>
                This {contentTypeNameLower} is private. However, shared items
                within the {contentTypeNameLower} can still be found.
              </p>
            )
          ) : license === null ? (
            <Box
              marginTop="10px"
              border="2px solid black"
              background="orange.100"
              padding="5px"
            >
              <InfoIcon color="orange.500" mr="2px" /> This{" "}
              {contentTypeNameLower} is shared without specifying a license.
              Please select a license below to inform other how they can use
              your content.
            </Box>
          ) : (
            <>
              {license.isComposition ? (
                <>
                  <p>
                    This {contentTypeNameLower} is shared with these licenses:
                  </p>
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
                  <p>
                    This {contentTypeNameLower} is shared using the license:
                  </p>
                  <List marginTop="10px">
                    <DisplayLicenseItem licenseItem={license} />
                  </List>
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
