import {
  Box,
  Text,
  Textarea,
  Button,
  Avatar,
  HStack,
  Spacer,
  Tooltip,
  Heading,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useState } from "react";

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
        messages.map((msg, i) => (
          <Box justifyContent="left">
            <HStack justify="left">
              <Tooltip label={msg.user}>
                <Avatar
                  key={`avatar${i}`}
                  margin="6px 12px"
                  border="0"
                  size="sm"
                  name={msg.user}
                />
              </Tooltip>
              <Text>{msg.message}</Text>
              <Spacer />
              <Text>{msg.dateTime.toLocaleString(timeFormat)}</Text>
            </HStack>
          </Box>
        ))
      )}

      {canComment && (
        <Box>
          <Textarea
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
          <Button
            justifySelf="right"
            onClick={() => {
              onAddComment(newComment);
              setNewComment("");
            }}
          >
            Post
          </Button>
        </Box>
      )}
    </Box>
  );
}
