import { useEffect, useState, useRef } from "react";
import { FetcherWithComponents } from "react-router";
import axios from "axios";
import { ContentType } from "../types";
import { editorUrl } from "../utils/url";
import { ShareStatusData } from "../popups/ShareMyContentModal";

/**
 * Custom hook to load share status and settings data when a share modal opens.
 * This hook manages the fetching of data from the API and settings loader.
 *
 * @param isOpen - Whether the share modal is open
 * @param contentId - The ID of the content to load share data for
 * @param contentType - The type of content (folder, singleDoc, etc.)
 * @param shareSettingsFetcher - Fetcher for loading settings (uses React Router loader)
 */
export function useLoadShareData(
  isOpen: boolean,
  contentId: string | null | undefined,
  contentType: ContentType,
  shareSettingsFetcher: FetcherWithComponents<any>,
) {
  const [shareStatusData, setShareStatusData] =
    useState<ShareStatusData | null>(null);
  const [isLoadingShareStatus, setIsLoadingShareStatus] = useState(false);
  const hasFetchedRef = useRef(false);
  const shareStatusRequestIdRef = useRef(0);
  const lastLoadedSettingsContentIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen && contentId) {
      // Fetch share status on initial open (only once per modal session)
      if (!hasFetchedRef.current) {
        hasFetchedRef.current = true;
        setIsLoadingShareStatus(true);
        const requestId = ++shareStatusRequestIdRef.current;
        axios
          .get(`/api/editor/getEditorShareStatus/${contentId}`)
          .then((response) => {
            if (shareStatusRequestIdRef.current !== requestId || !isOpen) {
              return;
            }
            setShareStatusData(response.data);
          })
          .catch((error) => {
            if (shareStatusRequestIdRef.current !== requestId || !isOpen) {
              return;
            }
            console.error("Error loading share status:", error);
          })
          .finally(() => {
            if (shareStatusRequestIdRef.current !== requestId || !isOpen) {
              return;
            }
            setIsLoadingShareStatus(false);
          });
      }

      // Load settings using the fetcher (React Router loader)
      if (contentType !== "folder" && shareSettingsFetcher.state === "idle") {
        const settingsContentId = shareSettingsFetcher.data?.contentId;
        const shouldReloadSettings =
          shareSettingsFetcher.data == null || settingsContentId !== contentId;

        if (
          shouldReloadSettings &&
          lastLoadedSettingsContentIdRef.current !== contentId
        ) {
          lastLoadedSettingsContentIdRef.current = contentId;
          shareSettingsFetcher.load(
            editorUrl(contentId, contentType, "settings"),
          );
        }
      }
    }
  }, [isOpen, contentId, contentType, shareSettingsFetcher]);

  // Reset data when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShareStatusData(null);
      hasFetchedRef.current = false;
      shareStatusRequestIdRef.current += 1;
      setIsLoadingShareStatus(false);
      lastLoadedSettingsContentIdRef.current = null;
    }
  }, [isOpen]);

  return {
    shareStatusData,
    isLoadingShareStatus,
    isLoadingSettings: shareSettingsFetcher.state !== "idle",
    settingsData: shareSettingsFetcher.data ?? null,
  };
}
