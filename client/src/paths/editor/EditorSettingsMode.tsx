import React from "react";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "react-router";
import {
  AssignmentMode,
  ContentClassification,
  Category,
  DoenetmlVersion,
  LicenseCode,
} from "../../types";
import axios from "axios";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Heading,
  HStack,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BlueBanner } from "../../widgets/BlueBanner";
import { optimistic } from "../../utils/optimistic_ui";
import { processRemixes } from "../../utils/processRemixes";
import { EditorContext } from "./EditorHeader";
import { EditAssignmentSettings } from "../../widgets/editor/EditAssignmentSettings";
import { EditCategories } from "../../widgets/editor/EditCategories";
import { EditClassifications } from "../../widgets/editor/EditClassifications";
import { EditLicense } from "../../widgets/editor/EditLicense";
import { AuthorLicenseBox } from "../../widgets/Licenses";

export async function loader({ params }: { params: any }) {
  const { data } = await axios.get(
    `/api/editor/getEditorSettings/${params.contentId}`,
  );

  const {
    data: { allCategories },
  } = await axios.get(`/api/info/getAllCategories/`);

  // TODO: Add this information to `getEditorSettingsModeData` query
  // and return only the info we need
  const {
    data: { remixSources },
  } = await axios.get(`/api/remix/getRemixSources/${params.contentId}`);
  const sources = processRemixes(remixSources);
  const remixSourceLicenseCode = sources[0]?.withLicenseCode || null;

  const baseData = {
    isPublic: data.isPublic,
    isShared: data.isShared,
    assigned: data.assigned,
    mode: data.mode,
    maxAttempts: data.maxAttempts,
    individualizeByStudent: data.individualizeByStudent,
    licenseCode: data.licenseCode,
    categories: data.categories,
    classifications: data.classifications,
    remixSourceLicenseCode,
    allCategories,
  };

  if (data.doenetmlVersionId) {
    return {
      ...baseData,
      doenetmlVersionId: data.doenetmlVersionId,
    };
  } else {
    return baseData;
  }
}

/**
 * This page allows you to view and change the settings for your activity.
 * Context: `documentEditor` and `compoundEditor`
 */
export function EditorSettingsMode() {
  const {
    isPublic,
    isShared,
    assigned,
    mode,
    maxAttempts,
    individualizeByStudent,
    licenseCode,
    categories,
    classifications,
    remixSourceLicenseCode,
    allCategories,
    doenetmlVersionId,
  } = useLoaderData() as {
    isPublic: boolean;
    isShared: boolean;
    assigned: boolean;
    mode: AssignmentMode;
    maxAttempts: number;
    individualizeByStudent: boolean;
    licenseCode: LicenseCode | null;
    categories: Category[];
    classifications: ContentClassification[];
    remixSourceLicenseCode: LicenseCode | null;
    allCategories: Category[];
    doenetmlVersionId?: number;
  };

  const { allLicenses, allDoenetmlVersions, inLibrary, contentType } =
    useOutletContext<EditorContext>();

  const [searchParams, _] = useSearchParams();
  const showRequired = searchParams.get("showRequired") === null ? false : true;

  return (
    <BlueBanner>
      <VStack ml="10px" spacing="2rem" align="flex-start">
        <Box>
          <Heading size="md" pt="1rem">
            Assignment
          </Heading>
          <EditAssignmentSettings
            maxAttempts={maxAttempts}
            individualizeByStudent={individualizeByStudent}
            mode={mode}
            includeMode={contentType !== "singleDoc"}
          />
        </Box>

        <Box>
          <Heading size="md">Categories</Heading>
          {showRequired && (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>Required for sharing publicly</AlertTitle>
              <AlertDescription>Select at least 1 category</AlertDescription>
            </Alert>
          )}
          <Box ml="1rem">
            <EditCategories
              categories={categories}
              allCategories={allCategories}
            />
          </Box>
        </Box>

        <Box>
          <Heading size="md">Classifications</Heading>
          <Box ml="1rem">
            <EditClassifications classifications={classifications} />
          </Box>
        </Box>

        <Box>
          <Heading size="md">Licensing</Heading>
          <Box ml="1rem" mr="2rem">
            {inLibrary ? (
              <AuthorLicenseBox
                license={allLicenses.find((l) => l.code === licenseCode)!}
                contentTypeName={"document"}
                isShared={isPublic || isShared}
                skipExplanation={false}
              />
            ) : (
              <EditLicense
                code={licenseCode ?? null}
                remixSourceLicenseCode={remixSourceLicenseCode}
                isPublic={isPublic}
                isShared={isShared}
                allLicenses={allLicenses}
              />
            )}
          </Box>
        </Box>

        {doenetmlVersionId && (
          <Box>
            <Heading size="md">Version</Heading>
            <Box ml="1rem">
              <DoenetMLSelectionBox
                versionId={doenetmlVersionId}
                allVersions={allDoenetmlVersions}
                isAssigned={assigned}
              />
            </Box>
          </Box>
        )}

        <Box mt="5rem" />
      </VStack>
    </BlueBanner>
  );
}

function DoenetMLSelectionBox({
  versionId,
  allVersions,
  isAssigned,
}: {
  versionId: number;
  allVersions: DoenetmlVersion[];
  isAssigned: boolean;
}) {
  const fetcher = useFetcher();

  const optimisticVersionId = optimistic(
    fetcher,
    "doenetmlVersionId",
    versionId,
  );
  const optimisticVersion = allVersions.find(
    (v) => v.id === optimisticVersionId,
  )!;

  return (
    <>
      {optimisticVersion.deprecated && (
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>
            DoenetML version {optimisticVersion.displayedVersion} is deprecated.
          </AlertTitle>
          <AlertDescription>
            {optimisticVersion.deprecationMessage}
          </AlertDescription>
        </Alert>
      )}
      <HStack>
        <Text size="sm" color={fetcher.state !== "idle" ? "gray" : "black"}>
          Use DoenetML version
        </Text>
        <Select
          width="6rem"
          value={optimisticVersionId}
          isDisabled={isAssigned}
          onChange={(e) => {
            const newVersionId = Number(e.target.value);
            fetcher.submit(
              {
                path: "updateContent/updateContentSettings",
                doenetmlVersionId: newVersionId,
              },
              { method: "post", encType: "application/json" },
            );
          }}
        >
          {allVersions.map((version) => (
            <option value={version.id} key={version.id}>
              {version.displayedVersion}
            </option>
          ))}
        </Select>
      </HStack>

      {isAssigned && (
        <p>
          <strong>Note</strong>: Cannot modify DoenetML version since activity
          is assigned.
        </p>
      )}
    </>
  );
}
