import { HStack, CloseButton, Button, Text } from "@chakra-ui/react";

type Action = {
  label: string;
  icon?: React.ReactElement;
  onClick: () => void;
  disabled?: boolean;
};

type Context = {
  description?: string;
  closeLabel: string;
  onClose: () => void;
};

/**
 * ActionBar component that displays a horizontal stack of action buttons
 * along with a close button and an optional description.
 * Meant to be at the page of a page or panel where actions can be taken.
 */
export function ActionBar({
  context,
  actions,
  isActive,
}: {
  context: Context;
  actions: Action[];
  isActive: boolean;
}) {
  return (
    <HStack
      spacing={3}
      align="center"
      backgroundColor={isActive ? "gray.100" : undefined}
      width="100%"
      height="2.3rem"
      mb="10px"
    >
      {isActive && (
        <CloseButton
          data-test="Stop Adding Items"
          size="sm"
          onClick={context.onClose}
        />
      )}

      {isActive && context.description && (
        <Text noOfLines={1} data-test="Action Bar Description">
          {context.description}
        </Text>
      )}

      {isActive &&
        actions.map((action) => (
          <Button
            key={action.label}
            data-test={action.label}
            isDisabled={action.disabled}
            size="xs"
            colorScheme="blue"
            leftIcon={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
    </HStack>
  );
}
