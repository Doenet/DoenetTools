import React from "react";
import { ContentType, License, LicenseCode, UserInfo } from "../types";
import {
  Box,
  HStack,
  Image,
  List,
  ListItem,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Link } from "react-router";
import { contentTypeToName } from "../utils/activity";
import { createNameCheckCurateTag } from "../utils/names";
import { InfoIcon } from "@chakra-ui/icons";

function findLicenseFromCode(code: LicenseCode, allLicenses: License[]) {
  const license = allLicenses.find((license) => license.code === code);
  if (!license) {
    throw "License not found";
  }
  return license;
}

export function SmallLicenseBadges({
  code,
  allLicenses,
  suppressLink = false,
}: {
  code: LicenseCode;
  allLicenses: License[];
  suppressLink?: boolean;
}) {
  const license = findLicenseFromCode(code, allLicenses);

  if (license.isComposition) {
    if (license.composedOf.length === 2) {
      return (
        <HStack spacing={0} width="80px">
          <DisplaySmallLicenseBadge
            licenseItem={license.composedOf[0]}
            suppressLink={suppressLink}
          />
          <Text fontSize="20px">/</Text>
          <DisplaySmallLicenseBadge
            licenseItem={license.composedOf[1]}
            suppressLink={suppressLink}
          />
        </HStack>
      );
    } else {
      return null;
    }
  } else {
    return (
      <Box width="80px">
        <DisplaySmallLicenseBadge
          licenseItem={license}
          suppressLink={suppressLink}
        />
      </Box>
    );
  }
}

function DisplaySmallLicenseBadge({
  licenseItem,
  suppressLink = false,
}: {
  licenseItem: {
    name: string;
    description: string;
    imageURL: string | null;
    smallImageURL: string | null;
    licenseURL: string | null;
  };
  suppressLink: boolean;
}) {
  let badge: React.JSX.Element | null = null;
  const imageURL = licenseItem.smallImageURL ?? licenseItem.imageURL;
  if (imageURL) {
    badge = (
      <Tooltip
        label={`Shared with ${licenseItem.name} license`}
        placement="bottom-end"
      >
        <Image
          src={imageURL}
          alt={`Badge for license: ${licenseItem.name}`}
          height="20px"
        />
      </Tooltip>
    );
  }

  if (licenseItem.licenseURL && !suppressLink) {
    badge = (
      <Link to={licenseItem.licenseURL} target="_blank">
        {badge}
      </Link>
    );
  }

  return badge;
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
      <HStack>{item}</HStack>
    </ListItem>
  );
}

export function LicenseDrawerBox({ children }: { children: React.ReactNode }) {
  return (
    <Box
      marginTop="20px"
      border="2px solid lightgray"
      background="lightgray"
      padding="10px"
    >
      {children}
    </Box>
  );
}
/**
 * A box that describes the license(s) for an activity
 * @param param0
 * @returns
 */
export function LicenseDescription({
  code,
  contentType,
  audience = "public",
  allLicenses,
  title,
  author,
}: {
  code: LicenseCode | null;
  contentType: ContentType;
  audience?: "author" | "public";
  title?: string;
  author?: UserInfo;
  allLicenses: License[];
}) {
  const name = title ? (
    <strong>{title}</strong>
  ) : (
    <span>This {contentTypeToName[contentType].toLowerCase()}</span>
  );

  const byLine = author ? ` by ${createNameCheckCurateTag(author)}` : "";

  // Technical debt: possibility that some content is shared without a license
  if (code === null && audience === "author") {
    return (
      <Box border="2px solid black" background="orange.100" padding="5px">
        <InfoIcon color="orange.500" mr="2px" />
        {name} is shared without specifying a license. Please select a license
        to inform others how they can use your content.
      </Box>
    );
  } else if (code === null) {
    return (
      <p>
        {name}
        {byLine} is shared, but a license was not specified. Contact the author
        to determine in what ways you can reuse this activity.
      </p>
    );
  }

  const license = findLicenseFromCode(code, allLicenses);
  const compositeExplanation =
    audience === "author"
      ? "(You authorize reuse under any of these licenses.)"
      : "You are free to use either license when reusing this work.";

  if (license.isComposition) {
    return (
      <>
        <p>
          {name}
          {byLine} is shared with these licenses:
        </p>
        <List spacing="20px" marginTop="10px">
          {license.composedOf.map((comp) => (
            <DisplayLicenseItem licenseItem={comp} key={comp.code} />
          ))}
        </List>
        <p style={{ marginTop: "10px" }}>{compositeExplanation}</p>
      </>
    );
  } else {
    return (
      <>
        <p>
          {name}
          {byLine} is shared using the license:
        </p>
        <List marginTop="10px">
          <DisplayLicenseItem licenseItem={license} />
        </List>
      </>
    );
  }
}
