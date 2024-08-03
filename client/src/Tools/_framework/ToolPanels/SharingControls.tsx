import React, { useEffect, useState } from "react";
import { FetcherWithComponents, Link } from "react-router-dom";
import {
  Box,
  Heading,
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
} from "@chakra-ui/react";
import {
  ContentStructure,
  License,
  LicenseCode,
} from "../Paths/ActivityEditor";
import { InfoIcon } from "@chakra-ui/icons";
import { MdCircle } from "react-icons/md";

export function SharingControls({
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

  return (
    <>
      <Box>
        <Box
          marginTop="10px"
          border="2px solid lightgray"
          background="lightgray"
          padding="10px"
        >
          {!contentData.isPublic ? (
            contentData.isFolder ? (
              <p>
                Folder is private. However, public items within the folder can
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
              <InfoIcon color="orange.500" mr="2px" /> {contentType} is publicly
              shared without specifying a license. Please select a license below
              to inform other how they can use your content.
            </Box>
          ) : (
            <>
              {license.isComposition ? (
                <>
                  <p>{contentType} is shared publicly with these licenses:</p>
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
                  <p>{contentType} is shared publicly using the license:</p>
                  <List marginTop="10px">
                    <DisplayLicenseItem licenseItem={license} />
                  </List>
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      {contentData.parentFolder?.isPublic ? (
        <Box>
          <Heading size="md" marginTop="10px">
            Sharing publicly
          </Heading>
          <p style={{ marginTop: "10px" }}>
            This {contentTypeLower} is inside a public folder and is shared
            publicly using that folder's license.
          </p>
        </Box>
      ) : (
        <Box>
          <Heading size="md" marginTop="10px">
            Sharing publicly
          </Heading>

          <p style={{ marginTop: "10px" }}>
            Sharing content publicly allows others to find it and adapt it.
          </p>

          <Checkbox
            marginTop="10px"
            isChecked={selectedIsPublic}
            onChange={() => {
              if (contentData.isPublic) {
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
            Make public
          </Checkbox>
          <FormControl isInvalid={missingLicense}>
            <FormLabel mt="16px">License</FormLabel>
            <Select
              placeholder={placeholder}
              value={selectedLicenseCode}
              disabled={!selectedIsPublic}
              onChange={(e) => {
                let newLicenseCode = e.target.value as LicenseCode;
                setSelectedLicenseCode(newLicenseCode);
                fetcher.submit(
                  {
                    _action: "make content public",
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
            <FormErrorMessage>
              A license is required to make public.
            </FormErrorMessage>
          </FormControl>
        </Box>
      )}
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
