import React from "react";
import { Avatar, Text, Card, CardBody, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function AuthorCard({
  cardLink,
  authorName,
}: {
  cardLink: string;
  authorName: string;
}) {
  return (
    <Link to={cardLink}>
      <Card width="180px" height="180px" p="0" m="0">
        <Center
          height="120px"
          width="180px"
          borderTopRadius="md"
          background="black"
        >
          <Avatar w="100px" h="100px" fontSize="60pt" name={authorName} />
        </Center>
        <CardBody p="1">
          <Center h="50px">
            <Text fontSize="xs" noOfLines={1}>
              {authorName}
            </Text>
          </Center>
        </CardBody>
      </Card>
    </Link>
  );
}
