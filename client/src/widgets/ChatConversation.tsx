import {
  Box,
  Text,
  Textarea,
  Button,
  Avatar,
  HStack,
  Heading,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import React, { useState } from "react";

type ChatMessage = {
  user: string;
  userIsMe: boolean;
  message: string;
  dateTime: DateTime;
};

export function ChatConversation({
  messages,
  conversationTitle = "Conversation",
  canComment,
  onAddComment,
}: {
  messages: ChatMessage[];
  conversationTitle?: string;
  canComment: boolean;
  onAddComment: (comment: string) => void;
}) {
  const [newComment, setNewComment] = useState<string>("");

  const { year: _, ...timeFormat } = DateTime.DATETIME_MED;

  return (
    <Box marginTop="30px">
      <Heading size="sm">{conversationTitle}</Heading>

      {messages.length === 0 ? (
        <Box padding="5px" marginLeft="20px">
          <Text as="i">No messages yet.</Text>
        </Box>
      ) : (
        <Grid templateColumns="repeat(5, 1fr)">
          {messages.map((msg, i) => (
            <>
              <GridItem>
                <HStack>
                  <Avatar
                    key={`avatar${i}`}
                    marginBottom="5px"
                    border="0"
                    size="sm"
                    name={msg.user}
                  />
                  <VStack>
                    <Text as="b" minWidth="7.5rem">
                      {msg.user}
                    </Text>
                  </VStack>
                </HStack>
              </GridItem>
              <GridItem colSpan={3}>
                <Text>{msg.message}</Text>
              </GridItem>
              <GridItem>
                <Text>{msg.dateTime.toLocaleString(timeFormat)}</Text>
              </GridItem>
            </>
          ))}
        </Grid>
      )}

      {canComment && (
        <>
          <Textarea
            display="inline-block"
            placeholder="Message"
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
            width="90%"
            onBlur={(e) => {
              if (e.target.value) {
                setNewComment(e.target.value);
              }
            }}
          />
          <Box>
            <Button
              justifySelf="right"
              isDisabled={newComment.trim() === ""}
              onClick={() => {
                onAddComment(newComment);
                setNewComment("");
              }}
            >
              Post
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
