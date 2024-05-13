import axios from "axios";
import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import styled from "styled-components";
import Papa from "papaparse";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Link,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import Searchbar from "../../../_reactComponents/PanelHeaderComponents/SearchBar";
import { Form, useFetcher } from "react-router-dom";

export async function loader() {
  let libraryContent = axios.get(`/library_content.csv`, {
    responseType: "text",
    transformResponse: [(data) => data],
  });
  let webworkTaxonomy = axios.get(`/webwork_taxonomy.csv`, {
    responseType: "text",
    transformResponse: [(data) => data],
  });

  let responses = await Promise.all([libraryContent, webworkTaxonomy]);
  libraryContent = responses[0].data;
  webworkTaxonomy = responses[1].data;

  libraryContent = Papa.parse(libraryContent, {
    // dynamicTyping: true,
  }).data;

  webworkTaxonomy = Papa.parse(webworkTaxonomy, {
    // dynamicTyping: true,
  }).data;

  //console.log(libraryContent);

  // no good dirty hack, didn't make the original code handle the letter prefixes, for now
  // transform the trig section labels like T1a into 101a, and make Probability P1a into 201a
  // TODO - ignoring the probability stuff, we have very little in those sections
  libraryContent = libraryContent.map((row) => {
    if (row[2]) {
      row[2] = row[2].replace("T", "10");
      //row[2] = row[2].replace("P", "20");
    }
    return row;
  });
  webworkTaxonomy = webworkTaxonomy.map((row) => {
    if (row[1]) {
      row[1] = row[1].replace("T", "10");
      //row[1] = row[1].replace("P", "20");
    }
    return row;
  });

  return {
    libraryContent,
    webworkTaxonomy,
  };
}

const PublicActivitiesSection = styled.div`
  grid-row: 2/3;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 10px;
  margin: 0px;
  margin-top: 40px;
  justify-content: flex-start;
  padding-left: 30px;
  padding-right: 30px;

  background: #ffffff;
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-rows: 80px auto;
  height: 100vh;
`;

export function Subsection({ label, activities }) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box
            as="span"
            flex="1"
            textAlign="left"
            style={{ color: activities.length == 0 ? "#aaaaaa" : "black" }}
          >
            {label}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {activities.map((activity) => {
          return (
            <Box key={activity.doenetId + label}>
              <Link
                key={activity.label}
                href={`https://www.doenet.org/portfolioviewer/${activity.doenetId}`}
              >
                {activity.label}
              </Link>
              <Divider />
            </Box>
          );
        })}
      </AccordionPanel>
    </AccordionItem>
  );
}

export function Section({ section, searchStr }) {
  const [index, setIndex] = useState([]);

  let filteredSubsections = section.subsections.filter(
    (subsection) => !searchStr || subsection.activities.length > 0,
  );

  useEffect(() => {
    let filteredSubsectionsInner = section.subsections.filter(
      (subsection) => !searchStr || subsection.activities.length > 0,
    );
    setIndex(
      !searchStr
        ? []
        : filteredSubsectionsInner.flatMap((sub, index) => {
            return sub.activities.length > 0 ? index : null;
          }),
    );
  }, [searchStr, section.subsections]);

  return (
    <Box
      style={{
        border: "1px black",
        padding: "10px",
        margin: "10px",
        width: "100%",
      }}
      key={section.label}
    >
      <Box
        style={{
          backgroundColor: section.color,
          color: "white",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <Text fontSize="22px" fontWeight="700">
          {section.label}
        </Text>
      </Box>
      <Accordion
        allowMultiple
        // only show the accordions open by default after a search
        // defaultIndex={filteredSubsections.flatMap(
        //   (sub, index) => {
        //     return searchStr && sub.activities.length > 0
        //       ? index
        //       : null;
        //   },
        // )}
        index={index}
        onChange={setIndex}
        //   searchStr
        //     ? [null]
        //     : (sub, index) => {
        //         return searchStr && sub.activities.length > 0
        //           ? index
        //           : null;
        //       }
        // }
      >
        {filteredSubsections.map((subsection) => {
          return <Subsection key={subsection.label} {...subsection} />;
        })}
      </Accordion>
    </Box>
  );
}

export function Library() {
  let loaderData = useLoaderData();
  let libraryContentOrig = loaderData.libraryContent;
  let webworkTaxonomyOrig = loaderData.webworkTaxonomy;
  let [searchStr, setSearchStr] = useState("");

  const libraryData = React.useMemo(() => {
    // added a columns with URLs, strip off first column to make the indexes below still work
    let libraryContent = libraryContentOrig.map((row) => row.slice(1));

    let parseSectionKey = (key) => {
      let numPart = key.match(/[0-9]+/)[0];
      let alphaPart = key.match(/[a-zA-Z]+/);
      if (alphaPart) alphaPart = alphaPart[0];
      return { numPart, alphaPart };
    };

    let webworkTaxonomy = webworkTaxonomyOrig.filter((row) =>
      String(row[1]).match(/^[0-9]+[a-zA-Z]*/),
    );

    let webworkSections = webworkTaxonomy.reduce((sections, sectionInfo) => {
      let { numPart, alphaPart } = parseSectionKey(String(sectionInfo[1]));
      let label = sectionInfo[0];
      // If we hit a section that hasn't been added yet
      let sectionDetails = sections.find((a) => {
        // this is using a sparse array for now, so we need to skip nulls
        return a && a.sectionNumber == numPart;
      });
      if (!sectionDetails) {
        sectionDetails = {
          sectionNumber: numPart,
          label,
          color: numPart > 100 ? "#c80808" : "#2f76d9",
          subsections: [],
        };
        sections[numPart - 1] = sectionDetails;
      }
      if (alphaPart) {
        sectionDetails.subsections.push({
          label,
          subSecLetter: alphaPart,
          activities: [],
        });
      }
      return sections;
    }, []);

    libraryContent = libraryContent.filter((row) => {
      return row[1] && String(row[1]).match(/^[0-9]+[a-zA-Z]*/);
    });

    if (searchStr) {
      libraryContent = libraryContent.filter((row) => {
        return (
          row[6] && row[6].toUpperCase().indexOf(searchStr.toUpperCase()) !== -1
        );
      });
    }

    libraryContent = libraryContent.flatMap((row) => {
      return row[1].includes(",")
        ? row[1].split(",").map((val) => {
            let newRow = [...row];
            newRow[1] = val.trim();
            return newRow;
          })
        : [row];
    });

    let groupedActivities = libraryContent.reduce((subsections, row) => {
      if (!subsections[row[1]]) subsections[row[1]] = [];
      subsections[row[1]].push(row);
      return subsections;
    }, {});

    for (const [subsectionKey, activities] of Object.entries(
      groupedActivities,
    )) {
      let { numPart, alphaPart } = parseSectionKey(String(subsectionKey));

      let matchingSubsection = webworkSections[
        Number(numPart) - 1
      ].subsections.find((subSec) => subSec.subSecLetter == alphaPart);
      if (!matchingSubsection) {
        console.log(webworkSections[Number(numPart) - 1]);
        console.log("Bad section key:" + subsectionKey);
        continue;
      }
      matchingSubsection.activities = activities.map((activityInfo) => {
        let label = activityInfo[6];

        // some of the problems start with a number followed by a colon or the string "Problem XX:",
        // instead of a number followed by a period, strip that off first, so it doesn't mess up the
        // search for another colon later in the string
        if (label.match(/^[0-9]+:/) || label.match(/^problem [0-9]+:/i)) {
          label = label.substring(label.indexOf(":") + 1);
        }
        // most of the problems have the MOLS collection name as a prefix, some have it with a colon
        // after the section name, others have a dash surrounded by spaces
        if (label.includes(":")) {
          label = label.substring(label.indexOf(":") + 1);
        } else if (label.includes(" - ")) {
          // Note the spaces around this dash are important, we want to preserve other uses of dash
          label = label.substring(label.indexOf(" - ") + 3);
        }
        label = label.trim();
        label = label.charAt(0).toUpperCase() + label.slice(1);
        return {
          doenetId: activityInfo[2],
          parentDoenetId: activityInfo[3],
          label,
        };
      });
    }

    return webworkSections.filter(
      (section) =>
        !searchStr ||
        section.subsections.filter((sub) => sub.activities.length > 0).length >
          0,
    );
  }, [libraryContentOrig, webworkTaxonomyOrig, searchStr]);

  return (
    <>
      <PortfolioGrid>
        <Box
          as="header"
          gridRow="1/2"
          backgroundColor="#fff"
          color="#000"
          height="120px"
          position="fixed"
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          zIndex="1200"
        >
          <Text fontSize="24px" fontWeight="700">
            Public Problem Library
          </Text>
          <Box maxW={400} minW={200}>
            <Box w={["300px", "300px", "400px"]} mt="20px">
              <Searchbar
                defaultValue={searchStr}
                dataTest="Search"
                onChange={(evt) => {
                  setSearchStr(evt.target.value);
                }}
              />
            </Box>
          </Box>
        </Box>
        <PublicActivitiesSection>
          {libraryData.length < 1 ? (
            <Text fontSize="28px">
              No Matching Library Activities Found
              <br />
              <br />
              Consider searching the{" "}
              <Link
                href={"/Community?q=" + searchStr}
                textDecoration="underline"
              >
                community contributed activities
              </Link>
              .
            </Text>
          ) : (
            <SimpleGrid columns={[1, 2, 2, 2, 3]} spacing="10px">
              {libraryData.map((section) => {
                return (
                  <Section
                    section={section}
                    searchStr={searchStr}
                    key={section.label}
                  />
                );
              })}
            </SimpleGrid>
          )}
        </PublicActivitiesSection>
      </PortfolioGrid>
    </>
  );
}
