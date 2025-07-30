import React, { ReactElement, useEffect } from "react";
import {
  useFetcher,
  Link as ReactRouterLink,
  useNavigate,
  ActionFunctionArgs,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useOutletContext,
  useSearchParams,
} from "react-router";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link as ChakraLink,
  Show,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import {
  MdDataset,
  MdModeEditOutline,
  MdOutlineContentCopy,
  MdOutlineEditOff,
  MdRemoveRedEye,
} from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaHistory, FaCog } from "react-icons/fa";
import { IoGitBranch } from "react-icons/io5";
import { LuLibraryBig } from "react-icons/lu";
import axios from "axios";
import { InfoIcon } from "@chakra-ui/icons";
import { AssignmentStatus, ContentType, ContentDescription } from "../../types";
import { contentTypeToName, getIconInfo } from "../../utils/activity";
import { CopyContentAndReportFinish } from "../../popups/CopyContentAndReportFinish";
import { SiteContext } from "../SiteHeader";
import {
  ActivateAuthorMode,
  activateAuthorModeActions,
} from "../../popups/ActivateAuthorMode";
import { compoundActivityEditorActions } from "../../views/CompoundActivityEditor";
import { ConfirmAssignModal } from "../../popups/ConfirmAssignModal";
import { ShareMyContentModal } from "../../popups/ShareMyContentModal";
import { NotificationDot } from "../../widgets/NotificationDot";
import { LibraryEditorControls } from "../../widgets/editor/LibraryEditorControls";
import { editorUrl } from "../../utils/url";
import { EditableName } from "../../widgets/EditableName";

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formObj = Object.fromEntries(formData);

  if (formObj._action == "update name") {
    //Don't let name be blank
    let name = formObj.name.toString().trim();
    if (name === "") {
      name = "Untitled";
    }

    await axios.post(`/api/updateContent/updateContentSettings`, {
      contentId: params.contentId,
      name,
    });
    return true;
  } else if (formObj._action === "go to data") {
    return redirect(`/assignmentData/${params.contentId}`);
  }

  const resultNAE = await compoundActivityEditorActions({ formObj });
  if (resultNAE) {
    return resultNAE;
  }

  const resultDM = await activateAuthorModeActions({ formObj });
  if (resultDM) {
    return resultDM;
  }

  return null;
}

export async function loader({
  params,
  request,
}: {
  params: any;
  request: Request;
}) {
  const { data } = await axios.get(`/api/editor/getEditor/${params.contentId}`);

  if (data.isNotEditable) {
    return redirect(`/activityEditor/${params.contentId}`);
  }

  const contentType: ContentType = data.contentType;
  const pageRoute = request.url.split("/")[0];

  if (pageRoute === "documentEditor" && contentType !== "singleDoc") {
    return redirect(`/compoundEditor/${params.contentId}`);
  } else if (pageRoute === "compoundEditor" && contentType === "singleDoc") {
    return redirect(`/documentEditor/${params.contentId}`);
  }

  const { data: contentDescription } = await axios.get(
    `/api/info/getContentDescription/${params.contentId}`,
  );

  return { contentDescription, ...data };
}

export type EditorContext = SiteContext & {
  contentId: string;
  contentType: ContentType;
  contentName: string;
  isPublic: boolean;
  assignmentStatus: AssignmentStatus;
  inLibrary: boolean;
};

/**
 * This is the header bar for the editor. All tabs/sub-pages in the editor use its context `EditorContext`. It works for both `/documentEditor` and `/compoundEditor`.
 */
export function EditorHeader() {
  const {
    contentId,
    contentName,
    contentType,
    isPublic,
    assignmentStatus,
    assignmentClassCode,
    assignmentHasScoreData,
    parent,
    remixSourceHasChanged,
    inLibrary,
    contentDescription,
  } = useLoaderData() as {
    contentId: string;
    contentName: string;
    contentType: ContentType;
    isPublic: boolean;
    assignmentStatus: AssignmentStatus;
    assignmentClassCode: string;
    assignmentHasScoreData: boolean;
    parent: ContentDescription;
    remixSourceHasChanged: boolean;
    inLibrary: boolean;
    contentDescription: ContentDescription;
  };

  const context = useOutletContext<SiteContext>();
  const editorContext: EditorContext = {
    ...context,
    contentId,
    contentType,
    isPublic,
    contentName,
    assignmentStatus,
    inLibrary,
  };

  const location = useLocation();
  const tab = location.pathname.split("/").pop()?.toLowerCase();

  const [searchParams, _] = useSearchParams();
  const inCurateMode = searchParams.get("curate") === null ? false : true;

  const {
    isOpen: copyDialogIsOpen,
    onOpen: copyDialogOnOpen,
    onClose: copyDialogOnClose,
  } = useDisclosure();

  const {
    isOpen: authorModePromptIsOpen,
    onOpen: authorModePromptOnOpen,
    onClose: authorModePromptOnClose,
  } = useDisclosure();

  const {
    isOpen: confirmAssignIsOpen,
    onOpen: confirmAssignOnOpen,
    onClose: confirmAssignOnClose,
  } = useDisclosure();

  const {
    isOpen: shareContentIsOpen,
    onOpen: shareContentOnOpen,
    onClose: shareContentOnClose,
  } = useDisclosure();

  const isSubActivity = (parent?.type ?? "folder") !== "folder";
  const authorMode = context.user?.isAuthor || contentType !== "singleDoc";

  useEffect(() => {
    document.title = `${contentName} - Doenet`;
  }, [contentName]);

  const fetcher = useFetcher();
  const navigate = useNavigate();

  let editLabel: string;
  let editTooltip: string;
  let editIcon: ReactElement<any>;

  if (assignmentStatus === "Unassigned") {
    editIcon = <MdModeEditOutline size={20} />;
    editLabel = "Edit";
    if (authorMode) {
      editTooltip = "Edit activity";
    } else {
      editTooltip = "Turn on author mode to edit";
    }
  } else {
    editIcon = <MdOutlineEditOff size={20} />;
    if (authorMode) {
      if (contentType === "singleDoc") {
        editLabel = "See source code";
        editTooltip = "See read-only view of source code";
      } else {
        editLabel = "See list";
        editTooltip = `See read-only view of documents ${contentType === "sequence" ? "and question banks in the problem set" : "in the question bank"}`;
      }
    } else {
      editLabel = "See source code";
      editTooltip = "Turn on author mode to see read-only view of source code";
    }
  }

  const copyContentModal = (
    <CopyContentAndReportFinish
      fetcher={fetcher}
      isOpen={copyDialogIsOpen}
      onClose={copyDialogOnClose}
      contentIds={[contentId]}
      desiredParent={parent ? { ...parent, parent: null } : null}
      action="Copy"
      prependCopy={true}
    />
  );

  const authorModeModal = (
    <ActivateAuthorMode
      isOpen={authorModePromptIsOpen}
      onClose={authorModePromptOnClose}
      desiredAction="edit"
      assignmentStatus={assignmentStatus}
      user={context.user!}
      proceedCallback={() => {
        navigate(editorUrl(contentId, contentType, "edit", inCurateMode));
      }}
      allowNo={true}
      fetcher={fetcher}
    />
  );

  const contentTypeName = contentTypeToName[contentType];

  const { iconImage, iconColor } = getIconInfo(contentType, false);

  const typeIcon = (
    <Show above="sm">
      <Tooltip label={contentTypeName}>
        <Box>
          <Icon
            as={iconImage}
            color={iconColor}
            boxSizing="content-box"
            width="24px"
            height="24px"
            paddingRight="10px"
            verticalAlign="middle"
            aria-label={contentTypeName}
          />
        </Box>
      </Tooltip>
    </Show>
  );

  return (
    <>
      {copyContentModal}
      {authorModeModal}
      <ConfirmAssignModal
        contentDescription={contentDescription}
        userId={context.user!.userId}
        isOpen={confirmAssignIsOpen}
        onClose={confirmAssignOnClose}
      />
      <ShareMyContentModal
        contentId={contentId}
        contentType={contentType}
        isOpen={shareContentIsOpen}
        onClose={shareContentOnClose}
      />

      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header"
      "centerContent"
      `}
        templateRows="40px auto"
        position="relative"
      >
        <GridItem
          area="header"
          position="fixed"
          height="40px"
          background="doenet.canvas"
          width="100%"
          zIndex="300"
          borderBottom={tab === "view" ? "1px solid" : undefined}
          borderColor="doenet.mediumGray"
        >
          <Grid
            templateAreas={`"leftControls label rightControls"`}
            templateColumns={{
              base: "135px 1fr 230px",
              sm: "135px 1fr 230px",
              md: "150px 1fr 230px",
              lg: "370px 1fr 280px",
            }}
            width="100%"
          >
            <GridItem area="leftControls">
              <HStack ml={{ base: "5px", sm: "10px" }} mt="4px">
                <Show above="lg">
                  <ChakraLink
                    as={ReactRouterLink}
                    to={".."}
                    style={{
                      color: "var(--mainBlue)",
                    }}
                    mr="1rem"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(-1);
                    }}
                  >
                    <HStack spacing="0">
                      <IoMdArrowRoundBack />
                      <Text>Back</Text>
                    </HStack>
                  </ChakraLink>
                </Show>

                <ButtonGroup size="sm" isAttached variant="outline">
                  <Tooltip hasArrow label="View Activity">
                    <Button
                      data-test="View Mode Button"
                      isActive={tab === "view"}
                      size="sm"
                      pr={{ base: "0px", lg: "10px" }}
                      leftIcon={<MdRemoveRedEye size={20} />}
                      onClick={() => {
                        navigate(
                          editorUrl(
                            contentId,
                            contentType,
                            "view",
                            inCurateMode,
                          ),
                        );
                      }}
                    >
                      <Show above="lg">View</Show>
                    </Button>
                  </Tooltip>
                  <Tooltip hasArrow label={editTooltip}>
                    <Button
                      isActive={tab === "edit"}
                      data-test="Edit Mode Button"
                      size="sm"
                      pr={{ base: "0px", lg: "10px" }}
                      leftIcon={editIcon}
                      onClick={() => {
                        if (authorMode) {
                          navigate(
                            editorUrl(
                              contentId,
                              contentType,
                              "edit",
                              inCurateMode,
                            ),
                          );
                        } else {
                          authorModePromptOnOpen();
                        }
                        // }
                      }}
                    >
                      <Show above="lg">{editLabel}</Show>
                    </Button>
                  </Tooltip>
                  <Tooltip hasArrow label="Settings">
                    <Button
                      data-test="Settings Button"
                      isActive={tab === "settings"}
                      size="sm"
                      pr={{ base: "0px", lg: "10px" }}
                      leftIcon={<FaCog size={16} />}
                      onClick={() => {
                        navigate(
                          editorUrl(
                            contentId,
                            contentType,
                            "settings",
                            inCurateMode,
                          ),
                        );
                      }}
                    >
                      <Show above="lg">Settings</Show>
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </HStack>
            </GridItem>
            <GridItem area="label">
              <Flex
                justifyContent={{ base: "left", lg: "center" }}
                alignItems="center"
              >
                {typeIcon}
                <EditableName dataTest="Activity Name Editable" />
              </Flex>
            </GridItem>
            <GridItem
              area="rightControls"
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <ButtonGroup
                pr={{ base: "0rem", lg: "2rem" }}
                spacing="0"
                mt="2px"
              >
                {contentType === "singleDoc" && (
                  <Tooltip label="View edit history" openDelay={300}>
                    <IconButton
                      as={ReactRouterLink}
                      icon={<FaHistory />}
                      variant="ghost"
                      fontSize="1.0rem"
                      size="xs"
                      width="30px"
                      height="35px"
                      aria-label="View edit history"
                      to={editorUrl(
                        contentId,
                        contentType,
                        "history",
                        inCurateMode,
                      )}
                    />
                  </Tooltip>
                )}

                {contentType === "singleDoc" && (
                  <Tooltip
                    label="View library status"
                    isDisabled={inLibrary}
                    openDelay={300}
                  >
                    <IconButton
                      as={ReactRouterLink}
                      icon={<LuLibraryBig />}
                      fontSize="1.2rem"
                      variant="ghost"
                      size="xs"
                      width="30px"
                      height="35px"
                      aria-label="View library status"
                      isDisabled={inLibrary}
                      to={editorUrl(
                        contentId,
                        contentType,
                        "library",
                        inCurateMode,
                      )}
                    />
                  </Tooltip>
                )}

                <NotificationDot show={remixSourceHasChanged}>
                  <Tooltip label="View remixes" openDelay={300}>
                    <IconButton
                      as={ReactRouterLink}
                      icon={<IoGitBranch />}
                      fontSize="1.2rem"
                      variant="ghost"
                      size="xs"
                      width="30px"
                      height="35px"
                      aria-label="View remixes"
                      to={editorUrl(
                        contentId,
                        contentType,
                        "remixes",
                        inCurateMode,
                      )}
                    />
                  </Tooltip>
                </NotificationDot>
              </ButtonGroup>

              <ButtonGroup size="sm" mt="4px" mr={{ base: "5px", sm: "10px" }}>
                <Button
                  colorScheme="blue"
                  isDisabled={inLibrary}
                  onClick={confirmAssignOnOpen}
                >
                  {assignmentStatus === "Open"
                    ? "Close assignment"
                    : `Create assignment`}
                </Button>
                <Button
                  colorScheme="blue"
                  isDisabled={inLibrary}
                  onClick={() => shareContentOnOpen()}
                >
                  Share
                </Button>
              </ButtonGroup>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem area="centerContent">
          <VStack gap={0}>
            {assignmentStatus !== "Unassigned" ? (
              <Center
                background="orange.100"
                width="100%"
                height={{ base: "60px", sm: "40px" }}
                pl="4px"
                pr="4px"
              >
                <InfoIcon color="orange.300" mr="6px" />

                {assignmentStatus === "Open" &&
                  (isSubActivity ? (
                    <Text size="xs">
                      {`Activity is part of an open assignment. ${tab == "edit" ? "It cannot be edited." : ""}`}
                    </Text>
                  ) : (
                    <>
                      <Text size="xs">
                        {`Assignment is open with code ${assignmentClassCode}. ${tab == "edit" ? "Make a copy to create an editable version." : ""}`}
                      </Text>
                    </>
                  ))}
                {assignmentStatus === "Closed" && (
                  <Text size="xs">
                    {`Activity is ${isSubActivity ? "part of " : ""}a closed assignment. ${tab == "edit" ? "Make a copy to create an editable version." : "."}`}
                  </Text>
                )}
                {assignmentHasScoreData ? (
                  <Tooltip label="View data">
                    <Button
                      as={ReactRouterLink}
                      data-test="View Data Button"
                      colorScheme="blue"
                      mt="4px"
                      ml="4px"
                      size="xs"
                      leftIcon={<MdDataset />}
                      pr={{ base: "0px", md: "10px" }}
                      to={`/assignmentData/${contentId}`}
                    >
                      <Show above="md">View data</Show>
                    </Button>
                  </Tooltip>
                ) : null}
                {isSubActivity ? null : (
                  <Tooltip label="Make a copy">
                    <Button
                      data-test="Make Copy Button"
                      colorScheme="blue"
                      mt="4px"
                      ml="4px"
                      size="xs"
                      leftIcon={<MdOutlineContentCopy />}
                      pr={{ base: "0px", md: "10px" }}
                      onClick={() => {
                        copyDialogOnOpen();
                      }}
                    >
                      <Show above="md">Make a copy</Show>
                    </Button>
                  </Tooltip>
                )}
              </Center>
            ) : null}

            {inLibrary && inCurateMode ? (
              <Flex width="100%">
                <Outlet context={editorContext} />
                <LibraryEditorControls
                  contentId={contentId}
                  contentType={contentType}
                />
              </Flex>
            ) : (
              <Outlet context={editorContext} />
            )}
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
}
