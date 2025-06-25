import React from "react";
import {
  Box,
  Heading,
  Icon,
  ListItem,
  Text,
  Tooltip,
  UnorderedList,
} from "@chakra-ui/react";
import { Content, License } from "../types";
import { LicenseDrawerBox, LicenseDescription } from "../widgets/Licenses";
import { activityFeatureIcons } from "../utils/activity";

export function GeneralContentInfo({
  contentData,
  allLicenses,
}: {
  contentData: Content;
  allLicenses: License[];
}) {
  const containsFeatures = contentData.contentFeatures.length > 0;

  return (
    <Box>
      {contentData.type !== "folder" && containsFeatures && (
        <Box borderBottom="2px" marginBottom={4} paddingBottom={4}>
          <Heading size="sm">Activity features</Heading>
          <UnorderedList>
            {contentData.contentFeatures.map((feature) => {
              const featureCode = feature.code as
                | "isQuestion"
                | "isInteractive"
                | "containsVideo";
              return (
                <ListItem key={feature.code}>
                  <Tooltip label={feature.description}>
                    {feature.term}
                    <Icon
                      paddingLeft="5px"
                      as={activityFeatureIcons[featureCode]}
                      color="#666699"
                      boxSize={5}
                      verticalAlign="middle"
                    />
                  </Tooltip>
                </ListItem>
              );
            })}
          </UnorderedList>
        </Box>
      )}

      <LicenseDrawerBox>
        <LicenseDescription
          code={contentData.licenseCode}
          contentType={contentData.type}
          allLicenses={allLicenses}
          title={contentData.name}
          author={contentData.owner}
        />
      </LicenseDrawerBox>

      {contentData.type === "singleDoc" &&
        (contentData.numVariants ?? 1) > 1 && (
          <Text marginTop="20px">
            This document has {contentData.numVariants} variants.
          </Text>
        )}

      {contentData.type === "singleDoc" && (
        <Text marginTop="20px">
          DoenetML version: {contentData.doenetmlVersion.fullVersion}
        </Text>
      )}
    </Box>
  );
}
