import React from "react";
import {
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

export default function ErrorWarningPopovers({ warningsObjs, errorsObjs }) {
  return (
    <>
      <Popover offset={[119, 5]}>
        <PopoverTrigger>
          <Tag
            m="4px 2px 4px 8px"
            data-test="Warning Button"
            tabIndex="0"
            cursor="pointer"
            size="md"
            colorScheme={warningsObjs.length == 0 ? "blackAlpha" : "yellow"}
          >
            {warningsObjs.length} Warning
            {warningsObjs.length != 1 && "s"}
          </Tag>
        </PopoverTrigger>
        {warningsObjs.length == 0 ? (
          <PopoverContent data-test="Warning Content">
            <PopoverHeader fontWeight="semibold">No Warnings</PopoverHeader>
          </PopoverContent>
        ) : (
          <PopoverContent data-test="Warning Content">
            <PopoverArrow />
            <PopoverHeader fontWeight="semibold">
              Warning
              {warningsObjs.length != 1 && "s"}
            </PopoverHeader>
            <PopoverBody maxH="40vh" overflow="scroll">
              <List spacing={2}>
                {warningsObjs.map((warningObj, i) => {
                  return (
                    <ListItem key={i} data-test={`Warning ${i}`}>
                      <ListIcon
                        as={WarningTwoIcon}
                        color="yellow.400"
                        marginBottom="2px"
                      />
                      Line #{warningObj?.doenetMLrange?.lineBegin}{" "}
                      {warningObj.message}
                    </ListItem>
                  );
                })}
              </List>
            </PopoverBody>
          </PopoverContent>
        )}
      </Popover>

      <Popover offset={[119, 5]}>
        <PopoverTrigger>
          <Tag
            m="4px 8px 4px 8px"
            data-test="Error Button"
            tabIndex="0"
            cursor="pointer"
            size="md"
            colorScheme={errorsObjs.length == 0 ? "blackAlpha" : "red"}
          >
            {errorsObjs.length} Error
            {errorsObjs.length != 1 && "s"}
          </Tag>
        </PopoverTrigger>
        {errorsObjs.length == 0 ? (
          <PopoverContent data-test="Error Content">
            <PopoverArrow />
            <PopoverHeader fontWeight="semibold">No Errors</PopoverHeader>
          </PopoverContent>
        ) : (
          <PopoverContent data-test="Error Content">
            <PopoverArrow />
            <PopoverHeader fontWeight="semibold">
              Error
              {errorsObjs.length != 1 && "s"}
            </PopoverHeader>
            <PopoverBody maxH="40vh" overflow="scroll">
              <List spacing={2}>
                {errorsObjs.map((errorObj, i) => {
                  return (
                    <ListItem key={i} data-test={`Error ${i}`}>
                      <ListIcon
                        as={WarningTwoIcon}
                        color="red.500"
                        marginBottom="2px"
                      />
                      Line #{errorObj?.doenetMLrange?.lineBegin}{" "}
                      {errorObj.message}
                    </ListItem>
                  );
                })}
              </List>
            </PopoverBody>
          </PopoverContent>
        )}
      </Popover>
    </>
  );
}