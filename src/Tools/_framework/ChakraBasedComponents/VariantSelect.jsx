import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

export default function VariantSelect({
  size = "sm",
  menuWidth,
  array = [],
  onChange = () => {},
  syncIndex, //Optional attribute to keep several variant selects in sync
}) {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(array[index]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();

  const [showTooltip, setShowTooltip] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  useEffect(() => {
    if (syncIndex != undefined && index != syncIndex - 1) {
      setIndex(syncIndex - 1);
      setValue(array[syncIndex - 1]);
    }
  }, [index, syncIndex, array]);

  const filteredArray = array.filter((string) =>
    inputValue === "" ? true : string.includes(inputValue),
  );
  return (
    <>
      <HStack m={0} spacing={0} borderRadius="lg">
        <Text borderLeftRadius="md" bg="#EDF2F7" p="4px 5px 0px 5px" h="32px">
          Variant
        </Text>
        <Menu
          onOpen={() => {
            setShowTooltip(false);
            setMenuIsOpen(true);
          }}
          onClose={() => {
            setShowTooltip(false);
            setMenuIsOpen(false);
          }}
        >
          <Tooltip hasArrow label="Variant" isOpen={showTooltip}>
            <MenuButton
              data-test="Variant Select Menu Button"
              borderLeftRadius={0}
              size={size}
              as={Button}
              rightIcon={<ChevronDownIcon />}
              width={menuWidth ? menuWidth : undefined}
              onMouseEnter={() => {
                !menuIsOpen ? setShowTooltip(true) : null;
              }}
              onMouseLeave={() => {
                setShowTooltip(false);
              }}
            >
              {value}
            </MenuButton>
          </Tooltip>

          <MenuList pt={0} maxHeight="400px" overflowY="auto">
            <Input
              m={0}
              ref={inputRef}
              data-test="Variant Select Filter Input"
              placeholder="Filter"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                inputRef.current.focus();
              }}
            />
            {filteredArray.map((val, index) => {
              return (
                <MenuItem
                  key={`mi${index}`}
                  data-test={`Variant Select Menu Item ${index}`}
                  onClick={() => {
                    const index = array.indexOf(val);
                    setIndex(index);
                    setValue(val);
                    setInputValue("");
                    onChange(index);
                  }}
                >
                  {val}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      </HStack>
    </>
  );
}
