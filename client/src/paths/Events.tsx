import { useEffect } from "react";
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  VStack,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { WithSideBanners } from "../layout/WithSideBanners";

export function Events() {
  useEffect(() => {
    document.title = `Events - Doenet`;
  }, []);

  return (
    <>
      <WithSideBanners bgColor="background">
        <Box
          p="40px"
          w="100%"
          // Hack: ensure background color extends full height
          // Remove once we implement background color globally
          minH="calc(100vh - 40px)"
        >
          <Heading size="xl" mb={6}>
            Events
          </Heading>

          <VStack align="start" spacing={8}>
            {/* Virtual Office Hours Section */}
            <Box w="100%">
              <Heading size="lg" mb={3}>
                Virtual office hours
              </Heading>
              <VStack align="start" spacing={3}>
                <Text fontSize="1.3rem" lineHeight="1.3">
                  Join us for office hours to ask questions, get support, and
                  connect with the Doenet community. All are welcome!
                </Text>
                <Text fontSize="1.3rem" lineHeight="1.3">
                  Drop in anytime during the two hours.
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Dates:</strong> 2nd–5th Tuesday of each month
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Time:</strong> 2–4pm EST, 11am–1pm PST
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Location:</strong> Online, via Zoom. Link:{" "}
                  <ChakraLink
                    href="https://mathtech.org/dropin"
                    isExternal
                    textDecoration="underline"
                  >
                    https://mathtech.org/dropin
                  </ChakraLink>
                </Text>
              </VStack>
            </Box>

            {/* Training Workshops Section */}
            <Box w="100%" id="workshops">
              <Heading size="lg" mb={3} mt={5}>
                Virtual training workshops
              </Heading>

              <Text fontSize="1.3rem" lineHeight="1.3" mb={6}>
                Virtual training workshops are scheduled for the first Tuesday
                of the month.
              </Text>

              {/* Workshop 1 */}
              <VStack
                align="start"
                spacing={3}
                mb={6}
                pl={4}
                borderLeft="3px solid"
                borderColor="border"
              >
                <Heading size="md">
                  <ChakraLink
                    href="https://scholarlattice.org/collections/b428f8ce-9981-4f9b-bb32-526994c57caf"
                    isExternal
                    textDecoration="underline"
                  >
                    Getting started with Doenet{" "}
                  </ChakraLink>
                </Heading>
                <Text fontSize="1.3rem" lineHeight="1.3">
                  Learn the basics of how to write Doenet activities in this
                  introductory workshop.
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Date:</strong> Tuesday, March 3, 2026
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Time:</strong> 2–4pm EST, 11am–1pm PST
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <Button
                    as="a"
                    href="https://scholarlattice.org/collections/b428f8ce-9981-4f9b-bb32-526994c57caf"
                    colorScheme="blue"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More information and registration
                  </Button>
                </Text>
              </VStack>

              {/* Workshop 2 */}
              <VStack
                align="start"
                spacing={3}
                mb={6}
                pl={4}
                borderLeft="3px solid"
                borderColor="border"
              >
                <Heading size="md">
                  <ChakraLink
                    href="https://scholarlattice.org/collections/eab4d5ce-064d-409a-a576-bcab507f7836"
                    isExternal
                    textDecoration="underline"
                  >
                    Creating accessible activities in Doenet
                  </ChakraLink>
                </Heading>
                <Text fontSize="1.3rem" lineHeight="1.3">
                  In this workshop, we will discuss best practices for creating
                  accessible activities in Doenet, and how to use the
                  accessibility features of Doenet to make your activities more
                  inclusive.
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Date:</strong> Tuesday, April 7, 2026
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Time:</strong> 2–4pm EST, 11am–1pm PST
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <Button
                    as="a"
                    href="https://scholarlattice.org/collections/eab4d5ce-064d-409a-a576-bcab507f7836"
                    colorScheme="blue"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More information and registration
                  </Button>
                </Text>
              </VStack>

              {/* Workshop 3 */}
              <VStack
                align="start"
                spacing={3}
                pl={4}
                borderLeft="3px solid"
                borderColor="border"
              >
                <Heading size="md">
                  <ChakraLink
                    href="https://scholarlattice.org/collections/b8ec4af3-8f71-4e4a-b86e-838242e47058"
                    isExternal
                    textDecoration="underline"
                  >
                    Getting started with Doenet
                  </ChakraLink>
                </Heading>
                <Text fontSize="1.3rem" lineHeight="1.3">
                  Learn the basics of how to write Doenet activities in this
                  introductory workshop.
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Date:</strong> Tuesday, May 5, 2026
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Time:</strong> 2–4pm EST, 11am–1pm PST
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <Button
                    as="a"
                    href="https://scholarlattice.org/collections/b8ec4af3-8f71-4e4a-b86e-838242e47058"
                    colorScheme="blue"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More information and registration
                  </Button>
                </Text>
              </VStack>
            </Box>

            {/* In-person Workshops and Conferences Section */}
            <Box w="100%">
              <Heading size="lg" mb={3} mt={5}>
                In-person workshops and conferences
              </Heading>

              <Text fontSize="1.3rem" lineHeight="1.3" mb={6}>
                Doenet will be at the following workshops and conferences. We
                hope to see you there!
              </Text>

              {/* Event 1 */}
              <VStack
                align="start"
                spacing={3}
                mb={6}
                pl={4}
                borderLeft="3px solid"
                borderColor="border"
              >
                <Heading size="md">
                  2026 MAA Florida /FTYCMA Joint Annual Meeting
                </Heading>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Dates:</strong> February 20 – 21, 2026
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Location:</strong> State College of Florida /
                  Bradenton campus
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Doenet-related events:</strong>
                </Text>
                <List
                  fontSize="1rem"
                  lineHeight="1.4"
                  spacing={1}
                  pl={5}
                  styleType="disc"
                >
                  <ListItem>
                    Feb 20, 3:00–3:50pm:{" "}
                    <em>Different Ways of Looking at the Familiar</em>, talk by
                    Anurag Katyal
                  </ListItem>
                  <ListItem>
                    Feb 21, 9:00–10:45am:{" "}
                    <em>
                      Creating AI–Resistant Interactive Activities to Facilitate
                      Active Learning
                    </em>
                    , introduction to Doenet workshop by Anurag Katyal
                  </ListItem>
                </List>

                <Text fontSize="1rem" lineHeight="1.4">
                  <ChakraLink
                    href="https://www.florida.maa.org/events/2026-maa-florida-ftycma-joint-annual-meeting"
                    isExternal
                    textDecoration="underline"
                  >
                    More information
                  </ChakraLink>
                </Text>
              </VStack>

              {/* Event 2 */}
              <VStack
                align="start"
                spacing={3}
                mb={6}
                pl={4}
                borderLeft="3px solid"
                borderColor="border"
              >
                <Heading size="md">Doenet Community Workshop</Heading>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Dates:</strong> June 1–5 2026
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Location:</strong> University of Minnesota
                </Text>
                <Text fontSize="1.3rem" lineHeight="1.3">
                  More information coming soon!
                </Text>
              </VStack>

              {/* Event 3 */}
              <VStack
                align="start"
                spacing={3}
                pl={4}
                borderLeft="3px solid"
                borderColor="border"
              >
                <Heading size="md">MathFest 2026</Heading>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Dates:</strong> August 5–8, 2026
                </Text>
                <Text fontSize="1rem" lineHeight="1.4">
                  <strong>Location:</strong> Boston, MA
                </Text>
                <Text fontSize="1.3rem" lineHeight="1.3">
                  During MathFest, Doenet will be leading a minicourse:
                  Upgrading Online Assignments: Building Scaffolded Activities
                  for Conceptual Understanding
                </Text>
                <Text fontSize="1.3rem" lineHeight="1.3">
                  More information, including registration details, coming soon!
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </WithSideBanners>
    </>
  );
}
