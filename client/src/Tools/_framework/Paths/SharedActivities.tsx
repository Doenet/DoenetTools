import {
  Box,
  Flex,
  Heading,
  Tooltip,
  List,
  Spacer,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLoaderData, useFetcher, Link } from "react-router";

import { CardContent } from "../../../Widgets/Card";
import axios from "axios";
import { createFullName } from "../../../_utils/names";
import { ContentStructure } from "../../../_utils/types";
import {
  DisplayLicenseItem,
  SmallLicenseBadges,
} from "../../../Widgets/Licenses";
import { ContentInfoDrawer } from "../ToolPanels/ContentInfoDrawer";
import CardList from "../../../Widgets/CardList";
import {
  ToggleViewButtonGroup,
  toggleViewButtonGroupActions,
} from "../ToolPanels/ToggleViewButtonGroup";

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  const resultTLV = await toggleViewButtonGroupActions({ formObj });
  if (resultTLV) {
    return resultTLV;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params }) {
  const { data } = await axios.get(
    `/api/getSharedFolderContent/${params.ownerId}/${params.folderId ?? ""}`,
  );

  const prefData = await axios.get(`/api/getPreferredFolderView`);
  const listViewPref = !prefData.data.cardView;

  return {
    content: data.content,
    ownerId: params.ownerId,
    owner: data.owner,
    folder: data.folder,
    listViewPref,
  };
}

export function SharedActivities() {
  const { content, ownerId, owner, folder, listViewPref } = useLoaderData() as {
    content: ContentStructure[];
    ownerId: string;
    owner: {
      firstNames: string | null;
      lastNames: string;
    };
    folder: ContentStructure | null;
    listViewPref: boolean;
  };

  const [listView, setListView] = useState(listViewPref);

  useEffect(() => {
    document.title = folder
      ? `Folder ${folder.name}`
      : `Shared Activities of ${createFullName(owner)} - Doenet`;
  }, [folder]);

  const fetcher = useFetcher();

  const [infoContentId, setInfoContentId] = useState<string | null>(null);

  const {
    isOpen: infoIsOpen,
    onOpen: infoOnOpen,
    onClose: infoOnClose,
  } = useDisclosure();

  let contentData: ContentStructure | undefined;
  if (infoContentId) {
    const index = content.findIndex((obj) => obj.id == infoContentId);
    if (index != -1) {
      contentData = content[index];
    } else {
      //Throw error not found
    }
  }

  const infoDrawer =
    contentData && infoContentId ? (
      <ContentInfoDrawer
        isOpen={infoIsOpen}
        onClose={infoOnClose}
        contentData={contentData}
      />
    ) : null;

  const headingText = folder ? (
    <>Folder: {folder.name}</>
  ) : (
    `Shared Activities of ${createFullName(owner)}`
  );

  const heading = (
    <Box
      backgroundColor="#fff"
      color="#000"
      height="80px"
      width="100%"
      textAlign="center"
    >
      <Tooltip label={headingText}>
        <Heading as="h2" size="lg" paddingTop=".5em" noOfLines={1}>
          {headingText}
        </Heading>
      </Tooltip>

      {folder ? (
        <Flex
          width="100%"
          paddingLeft="15px"
          paddingRight="15px"
          paddingBottom="5px"
          boxSizing="border-box"
          marginTop="-45px"
          height="40px"
        >
          <Spacer />
          {folder.license ? (
            <SmallLicenseBadges license={folder.license} />
          ) : null}
        </Flex>
      ) : null}

      <Flex marginRight=".5em" alignItems="center" paddingLeft="15px">
        {folder ? (
          <Link
            to={`/sharedActivities/${ownerId}${folder.parentFolder ? "/" + folder.parentFolder.id : ""}`}
            style={{
              color: "var(--mainBlue)",
            }}
          >
            {" "}
            &lt; Back to{" "}
            {folder.parentFolder
              ? folder.parentFolder.name
              : `Shared Activities of ${createFullName(owner)}`}
          </Link>
        ) : null}
        <Spacer />
        <ToggleViewButtonGroup
          listView={listView}
          setListView={setListView}
          fetcher={fetcher}
        />
      </Flex>
    </Box>
  );

  const cardContent: CardContent[] = content.map((activity) => {
    const contentType = activity.isFolder ? "Folder" : "Activity";

    const menuItems = (
      <MenuItem
        data-test={`${contentType} Information`}
        onClick={() => {
          setInfoContentId(activity.id);
          infoOnOpen();
        }}
      >
        {contentType} information
      </MenuItem>
    );

    return {
      ...activity,
      title: activity.name,
      cardLink: activity.isFolder
        ? `/sharedActivities/${activity.ownerId}/${activity.id}`
        : `/activityViewer/${activity.id}`,
      cardType: activity.isFolder ? "folder" : "activity",
      menuItems,
    };
  });

  const mainPanel = (
    <CardList
      showOwnerName={false}
      showAssignmentStatus={false}
      showPublicStatus={false}
      showActivityFeatures={true}
      emptyMessage={"No Activities Yet"}
      listView={listView}
      content={cardContent}
    />
  );

  return (
    <>
      {infoDrawer}
      {heading}
      <Flex
        data-test="Shared Activities"
        padding=".5em 10px"
        margin="0"
        width="100%"
        background={
          listView && content.length > 0 ? "white" : "var(--lightBlue)"
        }
        minHeight="calc(80vh - 130px)"
        flexDirection="column"
      >
        {mainPanel}
      </Flex>
      <Box
        background="gray"
        width="100%"
        color="var(--canvas)"
        padding="20px"
        minHeight="20vh"
      >
        {folder ? (
          folder.license ? (
            folder.license.isComposition ? (
              <>
                <p>
                  <strong>{folder.name}</strong> by {owner.firstNames}{" "}
                  {owner.lastNames} is shared with these licenses:
                </p>
                <List spacing="20px" marginTop="10px">
                  {folder.license.composedOf.map((comp) => (
                    <DisplayLicenseItem licenseItem={comp} key={comp.code} />
                  ))}
                </List>
                <p style={{ marginTop: "10px" }}>
                  You are free to use either license when reusing this work.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>{folder.name}</strong> by {owner.firstNames}{" "}
                  {owner.lastNames} is shared using the license:
                </p>
                <List marginTop="10px">
                  <DisplayLicenseItem licenseItem={folder.license} />
                </List>
              </>
            )
          ) : (
            <p>
              <strong>{folder.name}</strong> by {owner.firstNames}{" "}
              {owner.lastNames} is shared, but a license was not specified.
              Contact the author to determine in what ways you can reuse this
              activity.
            </p>
          )
        ) : null}
      </Box>
    </>
  );
}
