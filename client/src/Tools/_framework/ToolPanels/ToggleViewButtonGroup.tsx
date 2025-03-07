import { ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
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
    await axios.post(`/api/contentList/setPreferredFolderView`, {
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
    <ButtonGroup size="sm" isAttached variant="outline" marginBottom="2px">
      <Tooltip label="Toggle list view" openDelay={500}>
        <IconButton
          size="lg"
          isActive={listView === true}
          zIndex={1}
          icon={listView ? <FaListAlt /> : <FaRegListAlt />}
          boxSize="8"
          width="50px"
          aria-label="Toggle list view"
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
      </Tooltip>
      <Tooltip label="Toggle card view" placement="bottom-end" openDelay={500}>
        <IconButton
          size="lg"
          isActive={listView === false}
          zIndex={1}
          icon={listView ? <IoGridOutline /> : <IoGrid />}
          boxSize={8}
          width="50px"
          aria-label="Toggle card view"
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
      </Tooltip>
    </ButtonGroup>
  );
}
