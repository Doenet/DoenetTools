import React, { useRef } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";

import { useRecoilState } from "recoil";
import {
  Button,
  Center,
  Grid,
  GridItem,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

import axios from "axios";
import { pageToolViewAtom } from "../NewToolRoot";
import { serializedComponentsReviver } from "../../../Core/utils/serializedStateProcessing";

export async function loader({ params }) {
  const doenetId = params.doenetId;
  try {
    const { data } = await axios.get(
      `/api/getSurveyData.php?doenetId=${doenetId}`,
    );
    const { responses, courseId, label } = data;

    let columns = ["User's Name", "Email", "Student Id"];

    let svars_arr = [];
    for (let svObj of responses) {
      let svars = JSON.parse(svObj.stateVariables, serializedComponentsReviver);
      svars_arr.push(svars);
      // console.log("svars", svars);
      for (let key of Object.keys(svars)) {
        if (!columns.includes(key)) {
          let value = svars[key];
          if (
            value?.immediateValue ||
            value?.value ||
            value?.allSelectedIndices
          ) {
            columns.push(key);
          }
        }
      }
    }
    let rows = [];
    for (let [i, svars] of Object.entries(svars_arr)) {
      const response = responses[i];
      let row = [
        `${response.firstName} ${response.lastName}`,
        response.email,
        response.studentId,
      ];
      for (let [i, key] of Object.entries(columns)) {
        if (i > 2) {
          let value = svars[key];
          let response = "N/A";
          if (value?.immediateValue) {
            response = value.immediateValue;
          } else if (value?.value) {
            response = value.value;
          } else if (value?.allSelectedIndices) {
            response = value.allSelectedIndices[0];
          }
          row.push(response);
        }
      }
      rows.push(row);
    }

    return {
      courseId,
      doenetId,
      columns,
      rows,
      label,
    };
  } catch (e) {
    let message = e.message;
    //If php provides a message pass it along
    if (e.response?.data?.message) {
      message = e.response?.data?.message;
    }
    throw new Error(message);
  }
}

export function SurveyResults() {
  const { courseId, doenetId, columns, rows, label } = useLoaderData();

  let location = useLocation();

  const navigate = useNavigate();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
    navigate(newHref);
  }

  return (
    <>
      <Grid
        templateAreas={`"siteHeader" 
        "main"`}
        gridTemplateRows="40px auto"
        width="100vw"
        height="100vh"
      >
        <GridItem
          area="siteHeader"
          as="header"
          width="100vw"
          m="0"
          backgroundColor="#fff"
          color="#000"
          height="40px"
        >
          <Grid
            height="40px"
            position="fixed"
            top="0"
            zIndex="1200"
            borderBottom="1px solid var(--mainGray)"
            // paddingBottom="2px"
            width="100%"
            margin="0"
            display="flex"
            justifyContent="space-between"
            templateAreas={`"leftHeader menus rightHeader" 
        "main"`}
            gridTemplateColumns="1f auto 1f"
          >
            <GridItem area="leftHeader">
              <Text mt="10px" ml="10px">
                Survey Results for <b>{label}</b>
              </Text>
            </GridItem>
            {/* <GridItem area="menus"></GridItem> */}
            <GridItem area="rightHeader">
              <Button
                mt="4px"
                mr="10px"
                size="sm"
                onClick={() => {
                  navigateTo.current = `/course?tool=dashboard&courseId=${courseId}`;
                  setRecoilPageToolView({
                    page: "course",
                    tool: "dashboard",
                    view: "",
                    params: { courseId },
                  });
                }}
                data-test="Close"
                rightIcon={<CloseIcon />}
              >
                Close
              </Button>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="main" as="main" margin="0" overflowY="scroll">
          <Center mt="40px">
            <TableContainer width="90%">
              <Table variant="simple" size="sm">
                <TableCaption>
                  Latest Results For All Participants{" "}
                  <Button
                    size="xs"
                    onClick={() => {
                      let filename = `${label}.csv`;
                      let csvText = '"' + columns.join('","') + '"\n';

                      rows.forEach((row) => {
                        csvText += '"' + row.join('","') + '"\n';
                      });

                      var element = document.createElement("a");
                      element.setAttribute(
                        "href",
                        "data:text/plain;charset=utf-8, " +
                          encodeURIComponent(csvText),
                      );
                      element.setAttribute("download", filename);
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                  >
                    Download CSV
                  </Button>
                </TableCaption>
                <Thead>
                  <Tr>
                    {columns.map((column, i) => {
                      return (
                        <Th maxW="100px" isTruncated key={`header${i}`}>
                          {column}
                        </Th>
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  {rows.map((row, i) => {
                    return (
                      <Tr key={`tr${i}`}>
                        {row.map((info, i2) => {
                          return <Td key={`cell${(i, i2)}`}>{info}</Td>;
                        })}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Center>
        </GridItem>
      </Grid>
    </>
  );
}
