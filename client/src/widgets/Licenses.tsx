import React from "react";
import { License } from "../types";
import { Box, HStack, Image, ListItem, Text, Tooltip } from "@chakra-ui/react";
import { Link } from "react-router";

export function SmallLicenseBadges({
  license,
  suppressLink = false,
}: {
  license: License;
  suppressLink?: boolean;
}) {
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
