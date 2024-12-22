import React from "react";
import { License } from "../_utils/types";
import {
  HStack,
  Image,
  ListItem,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router";
import { MdCircle } from "react-icons/md";

export function SmallLicenseBadges({ license }: { license: License }) {
  if (license.isComposition) {
    return (
      <VStack spacing={1}>
        {license.composedOf.map((comp) => (
          <DisplaySmallLicenseBadge licenseItem={comp} key={comp.code} />
        ))}
      </VStack>
    );
  } else {
    return <DisplaySmallLicenseBadge licenseItem={license} />;
  }
}

function DisplaySmallLicenseBadge({
  licenseItem,
}: {
  licenseItem: {
    name: string;
    description: string;
    imageURL: string | null;
    smallImageURL: string | null;
    licenseURL: string | null;
  };
}) {
  let badge: React.JSX.Element | null = null;
  let imageURL = licenseItem.smallImageURL ?? licenseItem.imageURL;
  if (imageURL) {
    badge = (
      <Tooltip
        label={`Shared with ${licenseItem.name} license`}
        placement="bottom-end"
      >
        <Image
          src={imageURL}
          alt={`Badge for license: ${licenseItem.name}`}
          height="15px"
        />
      </Tooltip>
    );
  }

  if (licenseItem.licenseURL) {
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
