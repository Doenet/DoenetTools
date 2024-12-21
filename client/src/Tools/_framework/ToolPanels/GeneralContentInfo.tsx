import React from "react";
import { Box, List } from "@chakra-ui/react";
import { ContentStructure } from "../../../_utils/types";
import { InfoIcon } from "@chakra-ui/icons";
import { DisplayLicenseItem } from "../../../Widgets/Licenses";
import { createFullName } from "../../../_utils/names";

export function GeneralContentInfo({
  contentData,
}: {
  contentData: ContentStructure;
}) {
  let license = contentData.license;
  let contentType = contentData.isFolder ? "Folder" : "Activity";

  return (
    <Box>
      <Box borderBottom="2px" marginBottom={4} paddingBottom={4}>
        {license === null ? (
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
        ) : license.isComposition ? (
          <>
            <p>
              <em>{contentData.name}</em> by{" "}
              {createFullName(contentData.owner!)} is shared with these
              licenses:
            </p>
            <List spacing="20px" marginTop="10px">
              {license.composedOf.map((comp) => (
                <DisplayLicenseItem licenseItem={comp} key={comp.code} />
              ))}
            </List>
            <p style={{ marginTop: "10px" }}>
              (You are free to use either of these licenses when reusing this
              work.)
            </p>
          </>
        ) : (
          <>
            <p>
              <em>{contentData.name}</em> by{" "}
              {createFullName(contentData.owner!)} is shared with the license:
            </p>
            <List marginTop="10px">
              <DisplayLicenseItem licenseItem={license} />
            </List>
          </>
        )}
      </Box>

      {!contentData.isFolder
        ? `DoenetML version: ${contentData.documents[0].doenetmlVersion.fullVersion}`
        : null}
    </Box>
  );
}
