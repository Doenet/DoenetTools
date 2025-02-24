import {
  Box,
  Flex,
  Heading,
  Tooltip,
  List,
  Spacer,
  MenuItem,
  useDisclosure,
  HStack,
  CloseButton,
  Text,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  useLoaderData,
  useFetcher,
  Link,
  useOutletContext,
  useNavigate,
} from "react-router";

import { CardContent } from "../../../Widgets/Card";
import axios from "axios";
import { createFullName } from "../../../_utils/names";
import {
  ContentDescription,
  Content,
  ContentType,
} from "../../../_utils/types";
import { DisplayLicenseItem } from "../../../Widgets/Licenses";
import { ContentInfoDrawer } from "../ToolPanels/ContentInfoDrawer";
import CardList from "../../../Widgets/CardList";
import {
  ToggleViewButtonGroup,
  toggleViewButtonGroupActions,
} from "../ToolPanels/ToggleViewButtonGroup";
import { menuIcons } from "../../../_utils/activity";
import { SiteContext } from "./SiteHeader";
import {
  AddContentToMenu,
  addContentToMenuActions,
} from "../ToolPanels/AddContentToMenu";
import { CreateContentMenu } from "../ToolPanels/CreateContentMenu";
import { CopyContentAndReportFinish } from "../ToolPanels/CopyContentAndReportFinish";

export async function action({ request }) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  const resultTLV = await toggleViewButtonGroupActions({ formObj });
  if (resultTLV) {
    return resultTLV;
  }

  const resultACM = await addContentToMenuActions({ formObj });
  if (resultACM) {
    return resultACM;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params, request }) {
  const { data } = await axios.get(
    `/api/getSharedFolderContent/${params.ownerId}/${params.folderId ?? ""}`,
  );

  const prefData = await axios.get(`/api/getPreferredFolderView`);
  const listViewPref = !prefData.data.cardView;

  const url = new URL(request.url);
  const addToId = url.searchParams.get("addTo");
  let addTo: ContentDescription | undefined = undefined;

  if (addToId) {
    try {
      const { data } = await axios.get(`/api/getContentDescription/${addToId}`);
      addTo = data;
    } catch (_e) {
      console.error(`Could not get description of ${addToId}`);
    }
  }

  return {
    content: data.content,
    ownerId: params.ownerId,
    owner: data.owner,
    folder: data.folder,
    listViewPref,
    addTo,
  };
}

export function SharedActivities() {
  const { content, ownerId, owner, folder, listViewPref, addTo } =
    useLoaderData() as {
      content: Content[];
      ownerId: string;
      owner: {
        firstNames: string | null;
        lastNames: string;
      };
      folder: Content | null;
      listViewPref: boolean;
      addTo?: ContentDescription;
    };

  const { user } = useOutletContext<SiteContext>();

  const navigate = useNavigate();

  const [listView, setListView] = useState(listViewPref);

  const [selectedCards, setSelectedCards] = useState<ContentDescription[]>([]);
  const numSelected = selectedCards.length;

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

  let contentData: Content | undefined;
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

  const {
    isOpen: copyDialogIsOpen,
    onOpen: copyDialogOnOpen,
    onClose: copyDialogOnClose,
  } = useDisclosure();

  const copyContentModal =
    addTo !== undefined ? (
      <CopyContentAndReportFinish
        isOpen={copyDialogIsOpen}
        onClose={copyDialogOnClose}
        sourceContent={selectedCards}
        desiredParent={addTo}
        action="Add"
      />
    ) : null;

  function selectCardCallback({
    id,
    name,
    checked,
    type,
  }: {
    id: string;
    name: string;
    checked: boolean;
    type: ContentType;
  }) {
    setSelectedCards((was) => {
      const arr = [...was];
      const idx = was.findIndex((c) => c.id === id);
      if (checked) {
        if (idx === -1) {
          arr.push({ id, name, type });
        } else {
          arr[idx] = { id, name, type };
        }
      } else if (idx !== -1) {
        arr.splice(idx, 1);
      }
      return arr;
    });
  }

  const headingText = folder ? (
    <>Folder: {folder.name}</>
  ) : (
    `Shared Activities of ${createFullName(owner)}`
  );

  const heading = (
    <Box
      backgroundColor="#fff"
      color="#000"
      height="120px"
      width="100%"
      textAlign="center"
    >
      <Tooltip label={headingText}>
        <Heading
          as="h2"
          size="lg"
          paddingTop="10px"
          noOfLines={1}
          height="46px"
        >
          {headingText}
        </Heading>
      </Tooltip>

      <Flex
        width="100%"
        height="40px"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          height="30px"
          width="100%"
          alignContent="center"
          hidden={numSelected === 0 && addTo === undefined}
          backgroundColor="gray.100"
          justifyContent="center"
        >
          {addTo !== undefined ? (
            <HStack hidden={numSelected > 0}>
              <CloseButton
                size="sm"
                onClick={() => {
                  navigate(`.`);
                }}
              />{" "}
              <Text noOfLines={1}>
                Adding items to: {menuIcons[addTo.type]}
                <strong>{addTo.name}</strong>
              </Text>
            </HStack>
          ) : null}
          <HStack hidden={numSelected === 0}>
            <CloseButton size="sm" onClick={() => setSelectedCards([])} />{" "}
            <Text>{numSelected} selected</Text>
            <HStack hidden={addTo !== undefined}>
              <AddContentToMenu
                sourceContent={selectedCards}
                size="xs"
                colorScheme="blue"
                label="Add selected to"
              />
              <CreateContentMenu
                sourceContent={selectedCards}
                size="xs"
                colorScheme="blue"
                label="Create from selected"
              />
            </HStack>
            {addTo !== undefined ? (
              <Button
                hidden={addTo === undefined}
                size="xs"
                colorScheme="blue"
                onClick={() => {
                  copyDialogOnOpen();
                }}
              >
                Add selected to {menuIcons[addTo.type]}
                <strong>
                  {addTo.name.substring(0, 10)}
                  {addTo.name.length > 10 ? "..." : ""}
                </strong>
              </Button>
            ) : null}
          </HStack>
        </Flex>
      </Flex>

      <Flex marginRight=".5em" alignItems="center" paddingLeft="15px">
        {folder ? (
          <Link
            to={`/sharedActivities/${ownerId}${folder.parent ? "/" + folder.parent.id : ""}`}
            style={{
              color: "var(--mainBlue)",
            }}
          >
            {" "}
            &lt; Back to{" "}
            {folder.parent
              ? folder.parent.name
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

  const addToParams = addTo ? `?addTo=${addTo.id}` : "";
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
      content: activity,
      cardLink:
        activity.type == "folder"
          ? `/sharedActivities/${activity.ownerId}/${activity.id}${addToParams}`
          : `/activityViewer/${activity.id}${addToParams}`,
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
      selectedCards={user ? selectedCards.map((c) => c.id) : undefined}
      selectCallback={selectCardCallback}
      disableSelectFor={addTo ? [addTo.id] : undefined}
    />
  );

  return (
    <>
      {infoDrawer}
      {copyContentModal}
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
