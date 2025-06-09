import React, { RefObject } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import {
  ContentFeature,
  PartialContentClassification,
  UserInfo,
} from "../types";
import { NavigateFunction } from "react-router";
import { FilterPanel } from "../widgets/FilterPanel";

export function ExploreFilterDrawer({
  isOpen,
  onClose,
  finalFocusRef,
  topAuthors,
  authorInfo,
  classificationBrowse,
  subCategoryBrowse,
  categoryBrowse,
  systemBrowse,
  classificationInfo,
  countByFeature,
  features,
  availableFeatures,
  search,
  navigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  topAuthors: UserInfo[] | null;
  authorInfo: UserInfo | null;
  classificationBrowse: PartialContentClassification[] | null;
  subCategoryBrowse: PartialContentClassification[] | null;
  categoryBrowse: PartialContentClassification[] | null;
  systemBrowse: PartialContentClassification[] | null;
  classificationInfo: PartialContentClassification | null;
  countByFeature: Record<
    string,
    { numCurated?: number; numCommunity?: number }
  >;
  features: Set<string>;
  availableFeatures: ContentFeature[];
  search: string;
  navigate: NavigateFunction;
}) {
  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton data-test="Close Filters Button" />

        <DrawerBody margin={0} padding={0}>
          <FilterPanel
            topAuthors={topAuthors}
            authorInfo={authorInfo}
            classificationBrowse={classificationBrowse}
            subCategoryBrowse={subCategoryBrowse}
            categoryBrowse={categoryBrowse}
            systemBrowse={systemBrowse}
            classificationInfo={classificationInfo}
            countByFeature={countByFeature}
            features={features}
            availableFeatures={availableFeatures}
            search={search}
            navigate={navigate}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
