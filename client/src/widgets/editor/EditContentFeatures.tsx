import React from "react";
import { Checkbox, HStack, Icon, Stack, Text, Tooltip } from "@chakra-ui/react";
import { useFetcher } from "react-router";
import { optimistic } from "../../utils/optimistic_ui";
import { ContentFeature } from "../../types";
import { activityFeatureIcons } from "../../utils/activity";

export function EditContentFeatures({
  contentFeatures,
  allContentFeatures,
}: {
  contentFeatures: ContentFeature[];
  allContentFeatures: ContentFeature[];
}) {
  const featureDisplays = [];
  for (const feature of allContentFeatures) {
    const isChecked = contentFeatures.find((v) => v.code === feature.code)
      ? true
      : false;

    featureDisplays.push(
      <ContentFeatureCheckbox
        key={feature.code}
        feature={feature}
        isChecked={isChecked}
      />,
    );
  }
  return <Stack>{featureDisplays}</Stack>;
}

/**
 * This widget allows owners to view and edit the content features of their activity - 1 checkbox for each feature.
 */
function ContentFeatureCheckbox({
  feature,
  isChecked,
}: {
  feature: ContentFeature;
  isChecked: boolean;
}) {
  const fetcher = useFetcher();
  const fallback: Record<string, boolean> = {};
  fallback[feature.code] = isChecked;
  const optimisticCheckedRecord = optimistic<Record<string, boolean>>(
    fetcher,
    "features",
    fallback,
  );
  const optimisticChecked = optimisticCheckedRecord[feature.code];
  const featureCode = feature.code as
    | "isQuestion"
    | "isInteractive"
    | "containsVideo";

  return (
    <>
      <Checkbox
        key={feature.code}
        data-test={`${feature.code} Checkbox`}
        isChecked={optimisticChecked}
        onChange={(event) => {
          const features: Record<string, boolean> = {};
          features[feature.code] = event.target.checked;

          fetcher.submit(
            {
              path: "updateContent/updateContentFeatures",
              features,
            },
            { method: "post", encType: "application/json" },
          );
        }}
      >
        <Tooltip label={feature.description}>
          <HStack>
            <Text color={fetcher.state === "idle" ? "black" : "gray"}>
              {feature.term}
            </Text>
            <Icon
              paddingLeft="5px"
              as={activityFeatureIcons[featureCode]}
              color="#666699"
              boxSize={5}
              verticalAlign="middle"
            />
          </HStack>
        </Tooltip>
      </Checkbox>
    </>
  );
}
