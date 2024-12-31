import { Button, ButtonGroup, Icon, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { FaListAlt, FaRegListAlt } from "react-icons/fa";
import { IoGrid, IoGridOutline } from "react-icons/io5";
import { FetcherWithComponents } from "react-router";

export async function toggleViewButtonGroupActions({
  formObj,
}: {
  [k: string]: any;
}) {
  if (formObj?._action == "Set List View Preferred") {
    await axios.post(`/api/setPreferredFolderView`, {
      cardView: formObj.listViewPref === "false",
    });
    return true;
  }

  return null;
}

export function ToggleViewButtonGroup({
  fetcher,
  listView,
  setListView,
}: {
  fetcher: FetcherWithComponents<any>;
  listView: boolean;
  setListView: (arg: boolean) => void;
}) {
  return (
    <ButtonGroup size="sm" isAttached variant="outline" marginBottom=".5em">
      <Tooltip label="Toggle List View">
        <Button isActive={listView === true}>
          <Icon
            as={listView ? FaListAlt : FaRegListAlt}
            boxSize={10}
            p=".5em"
            cursor="pointer"
            onClick={() => {
              if (listView === false) {
                setListView(true);
                fetcher.submit(
                  {
                    _action: "Set List View Preferred",
                    listViewPref: true,
                  },
                  { method: "post" },
                );
              }
            }}
          />
        </Button>
      </Tooltip>
      <Tooltip label="Toggle Card View">
        <Button isActive={listView === false}>
          <Icon
            as={listView ? IoGridOutline : IoGrid}
            boxSize={10}
            p=".5em"
            cursor="pointer"
            onClick={() => {
              if (listView === true) {
                setListView(false);
                fetcher.submit(
                  {
                    _action: "Set List View Preferred",
                    listViewPref: false,
                  },
                  { method: "post" },
                );
              }
            }}
          />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
}
