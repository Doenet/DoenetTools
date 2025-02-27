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
import { ContentDescription, Content } from "../../../_utils/types";
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
import {
  CreateContentMenu,
  createContentMenuActions,
} from "../ToolPanels/CreateContentMenu";
import {
  CopyContentAndReportFinish,
  copyContentAndReportFinishActions,
} from "../ToolPanels/CopyContentAndReportFinish";

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

  const resultCC = await copyContentAndReportFinishActions({ formObj });
  if (resultCC) {
    return resultCC;
  }

  const resultCCM = await createContentMenuActions({ formObj });
  if (resultCCM) {
    return resultCCM;
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`);
}

export async function loader({ params, request }) {
  const { data } = await axios.get(
    `/api/contentList/getSharedContent/${params.ownerId}/${params.parentId ?? ""}`,
  );

  const prefData = await axios.get(`/api/contentList/getPreferredFolderView`);
  const listViewPref = !prefData.data.cardView;

  const url = new URL(request.url);
  const addToId = url.searchParams.get("addTo");
  let addTo: ContentDescription | undefined = undefined;

  if (addToId) {
    try {
      const { data } = await axios.get(
        `/api/info/getContentDescription/${addToId}`,
      );
      addTo = data;
    } catch (_e) {
      console.error(`Could not get description of ${addToId}`);
    }
  }

  return {
    content: data.content,
    ownerId: params.ownerId,
    owner: data.owner,
    parent: data.parent,
    listViewPref,
    addTo,
  };
}

export function SharedActivities() {
  const { content, ownerId, owner, parent, listViewPref, addTo } =
    useLoaderData() as {
      content: Content[];
      ownerId: string;
      owner: {
        firstNames: string | null;
        lastNames: string;
      };
      parent: Content | null;
      listViewPref: boolean;
      addTo?: ContentDescription;
    };

  const { user } = useOutletContext<SiteContext>();

  const navigate = useNavigate();

  const [listView, setListView] = useState(listViewPref);

  const [selectedCards, setSelectedCards] = useState<ContentDescription[]>([]);
  const selectedCardsFiltered = selectedCards.filter((c) => c);
  const numSelected = selectedCardsFiltered.length;

  useEffect(() => {
    setSelectedCards((was) => {
      let foundMissing = false;
      const newList = content.map((c) => c.contentId);
      for (const c of was.filter((x) => x)) {
        if (!newList.includes(c.contentId)) {
          foundMissing = true;
          break;
        }
      }
      if (foundMissing) {
        return [];
      } else {
        return was;
      }
    });
  }, [content]);

  useEffect(() => {
    document.title = parent
      ? `Folder ${parent.name}`
      : `Shared Activities of ${createFullName(owner)} - Doenet`;
  }, [parent]);

  const fetcher = useFetcher();

  const [infoContentId, setInfoContentId] = useState<string | null>(null);

  const {
    isOpen: infoIsOpen,
    onOpen: infoOnOpen,
    onClose: infoOnClose,
  } = useDisclosure();

  let contentData: Content | undefined;
  if (infoContentId) {
    const index = content.findIndex((obj) => obj.contentId == infoContentId);
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
        fetcher={fetcher}
        isOpen={copyDialogIsOpen}
        onClose={copyDialogOnClose}
        contentIds={selectedCardsFiltered.map((sc) => sc.contentId)}
        desiredParent={addTo}
        action="Add"
      />
    ) : null;

  const headingText = parent ? (
    <>Folder: {parent.name}</>
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
          data-test="Folder Heading"
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
                fetcher={fetcher}
                sourceContent={selectedCardsFiltered}
                size="xs"
                colorScheme="blue"
                label="Add selected to"
              />
              <CreateContentMenu
                fetcher={fetcher}
                sourceContent={selectedCardsFiltered}
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
        {parent ? (
          <Link
            to={`/sharedActivities/${ownerId}${parent.parent ? "/" + parent.parent.contentId : ""}`}
            style={{
              color: "var(--mainBlue)",
            }}
          >
            {" "}
            &lt; Back to{" "}
            {parent.parent
              ? parent.parent.name
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

  const addToParams = addTo ? `?addTo=${addTo.contentId}` : "";
  const cardContent: CardContent[] = content.map((activity) => {
    const contentType = activity.type === "folder" ? "Folder" : "Activity";

    const menuItems = (
      <MenuItem
        data-test={`${contentType} Information`}
        onClick={() => {
          setInfoContentId(activity.contentId);
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
          ? `/sharedActivities/${activity.ownerId}/${activity.contentId}${addToParams}`
          : `/activityViewer/${activity.contentId}${addToParams}`,
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
      selectedCards={user ? selectedCards : undefined}
      setSelectedCards={setSelectedCards}
      disableSelectFor={addTo ? [addTo.contentId] : undefined}
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
        {parent ? (
          parent.license ? (
            parent.license.isComposition ? (
              <>
                <p>
                  <strong>{parent.name}</strong> by {owner.firstNames}{" "}
                  {owner.lastNames} is shared with these licenses:
                </p>
                <List spacing="20px" marginTop="10px">
                  {parent.license.composedOf.map((comp) => (
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
                  <strong>{parent.name}</strong> by {owner.firstNames}{" "}
                  {owner.lastNames} is shared using the license:
                </p>
                <List marginTop="10px">
                  <DisplayLicenseItem licenseItem={parent.license} />
                </List>
              </>
            )
          ) : (
            <p>
              <strong>{parent.name}</strong> by {owner.firstNames}{" "}
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
