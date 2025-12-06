import { useEffect } from "react";
import { useLoaderData } from "react-router";
import {
  Button,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Link as ChakraLink,
  Tooltip,
  Icon,
  Box,
  Wrap,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router";
import axios from "axios";
import { lastNameFirst } from "../utils/names";
import { downloadScoresToCsv } from "../utils/scores";
import { getIconInfo } from "../utils/activity";
import { NameBar } from "../widgets/NameBar";

type AssignmentScore = {
  contentId: string;
  userScores: {
    score: number;
    user: {
      userId: string;
      firstNames: string | null;
      lastNames: string;
      email: string;
    };
  }[];
};

type OrderedActivity = {
  contentId: string;
  name: string;
  hasScores: boolean;
};

type StudentStructure = {
  userId: string;
  firstNames: string | null;
  lastNames: string;
  email: string;
  scores: Record<string, number>;
};

type Folder = {
  contentId: string;
  name: string;
};

export async function loader({
  params,
}: {
  params: {
    parentId?: string;
  };
}) {
  const { data } = await axios.get(
    `/api/assign/getAllAssignmentScores/${params.parentId ?? ""}`,
  );

  const { orderedActivities, assignmentScores, folder } = data as {
    orderedActivities: OrderedActivity[];
    assignmentScores: AssignmentScore[];
    folder: Folder;
  };

  const assignmentHasScores = new Set<string>([]);

  const studentData: Record<string, StudentStructure> = {};
  assignmentScores.forEach((scoreObj) => {
    if (scoreObj.userScores.length > 0) {
      assignmentHasScores.add(scoreObj.contentId);
    }
    scoreObj.userScores.forEach((score) => {
      if (!(score.user.userId in studentData)) {
        studentData[score.user.userId] = { ...score.user, scores: {} };
      }
      studentData[score.user.userId].scores[scoreObj.contentId] = score.score;
    });
  });

  // list of student ids (keys to studentData) ordered based on corresponding student name
  // sort by last names
  const studentIdsOrdered = Object.keys(studentData);
  studentIdsOrdered.sort((a, b) => {
    const nameA = lastNameFirst(studentData[a]).trim().toLowerCase();
    const nameB = lastNameFirst(studentData[b]).trim().toLowerCase();
    if (nameA > nameB) {
      return 1;
    } else if (nameA < nameB) {
      return -1;
    }
    return 0;
  });

  const assignments = orderedActivities.map((activity) => ({
    contentId: activity.contentId,
    name: activity.name,
    hasScores: assignmentHasScores.has(activity.contentId),
  }));

  return {
    assignments,
    students: studentData,
    studentIdsOrdered,
    folder,
  };
}

export function AllAssignmentScores() {
  const { assignments, students, studentIdsOrdered, folder } =
    useLoaderData() as {
      assignments: OrderedActivity[];
      students: Record<string, StudentStructure>;
      studentIdsOrdered: string[];
      folder: Folder | null;
    };

  const name = folder?.name ?? "My Activities";

  useEffect(() => {
    document.title = `${name} - Assignment Scores`;
  });

  const nameWidth = 150;
  const itemWidth = 50;

  const downloadScores = () => {
    const studentScores = Object.values(students).map((studentData) => {
      const assignmentScores: Record<string, number | null> = {};
      for (const assignment of assignments) {
        if (assignment.contentId in studentData.scores) {
          const score = studentData.scores[assignment.contentId];
          assignmentScores[assignment.name] = score;
        } else {
          assignmentScores[assignment.name] = null;
        }
      }

      return {
        firstNames: studentData.firstNames,
        lastNames: studentData.lastNames,
        email: studentData.email,
        studentId: studentData.userId,
        assignmentScores,
      };
    });

    downloadScoresToCsv(`Scores for ${name}`, studentScores);
  };

  const { iconImage: folderIcon, iconColor: folderColor } = getIconInfo(
    "folder",
    false,
  );
  const icon = (
    <Icon
      as={folderIcon}
      color={folderColor}
      boxSizing="content-box"
      width="24px"
      height="24px"
      mr="0.5rem"
      verticalAlign="middle"
      aria-label={"Folder"}
    />
  );

  return (
    <Box flex="1" width="100%" pt="30px" pb="30px" paddingLeft="15px">
      <Wrap align="center" spacing="1rem" mb="20px">
        <NameBar
          contentId={null}
          contentName={name + " -- Scores"}
          isEditable={false}
          leftIcon={icon}
          dataTest="Scores Heading"
          fontSizeMode="folder"
        />

        <Button colorScheme="blue" size="sm" onClick={downloadScores}>
          Download scores
        </Button>
      </Wrap>

      <Box width={`${nameWidth + itemWidth * assignments.length + 100}px`}>
        <TableContainer
          width={`${nameWidth + itemWidth * assignments.length + 100}px`}
          overflowX="hidden"
        >
          <Table
            size="sm"
            className="score-table"
            layout="fixed"
            width={`${nameWidth + itemWidth * assignments.length}px`}
          >
            <Thead>
              <Tr verticalAlign={"bottom"}>
                <Th
                  textTransform={"none"}
                  fontSize="large"
                  width={`${nameWidth}px`}
                >
                  Student
                </Th>
                {assignments.map((assignment) => {
                  const assignmentNameShortened =
                    assignment.name.length < 30
                      ? assignment.name
                      : assignment.name.substring(
                          0,
                          assignment.name.substring(0, 27).lastIndexOf(" "),
                        ) + "...";
                  return (
                    <Th
                      key={`assignment${assignment.contentId}`}
                      textTransform={"none"}
                    >
                      {assignment.hasScores ? (
                        <ChakraLink
                          as={ReactRouterLink}
                          to={`/assignmentData/${assignment.contentId}`}
                          display="block"
                          textDecoration="underline"
                          height="14em"
                          width="1em"
                          transform="rotate(315deg) translate(-4em, 11em)"
                          fontSize={14}
                        >
                          <Tooltip
                            label={assignment.name}
                            placement="bottom-end"
                            openDelay={500}
                          >
                            <Text textDecoration="underline">
                              {assignmentNameShortened}
                            </Text>
                          </Tooltip>
                        </ChakraLink>
                      ) : (
                        <Text
                          display="block"
                          height="14em"
                          width="1em"
                          transform="rotate(315deg) translate(-4em, 11em)"
                          fontSize={14}
                        >
                          <Tooltip
                            label={assignment.name}
                            placement="bottom-end"
                            openDelay={500}
                          >
                            {assignmentNameShortened}{" "}
                          </Tooltip>
                        </Text>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {studentIdsOrdered.map((studentId: string) => (
                <Tr
                  key={`student${studentId}`}
                  borderTopWidth={2}
                  borderTopColor={"#bbb"}
                >
                  <Td>
                    <ChakraLink
                      as={ReactRouterLink}
                      to={`/studentAssignmentScores/${studentId}${folder ? "/" + folder.contentId : ""}`}
                      textDecoration="underline"
                    >
                      {lastNameFirst(students[studentId])}
                    </ChakraLink>
                  </Td>
                  {
                    // if student has a score for this assignment, display it
                    assignments.map(function (assignment) {
                      if (assignment.contentId in students[studentId].scores) {
                        return (
                          <Td
                            key={`student${studentId}_assignment${assignment.contentId}`}
                          >
                            <ChakraLink
                              as={ReactRouterLink}
                              to={`/assignmentData/${assignment.contentId}/${studentId}`}
                              textDecoration="underline"
                            >
                              &nbsp;
                              {Math.round(
                                students[studentId].scores[
                                  assignment.contentId
                                ] * 1000,
                              ) / 10}
                              &nbsp;
                            </ChakraLink>
                          </Td>
                        );
                      } else {
                        return (
                          <Td
                            key={`student${studentId}_assignment${assignment.contentId}`}
                          >
                            &#8212;
                          </Td>
                        );
                      }
                    })
                  }
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      {studentIdsOrdered.length === 0 ? (
        <Box marginTop="20px">No students have taken assignments yet</Box>
      ) : null}
    </Box>
  );
}
