import { useEffect, useState, useRef } from "react";
import { FetcherWithComponents } from "react-router";
import axios from "axios";
import { ContentType, UserInfoWithEmail } from "../types";
import { editorUrl } from "../utils/url";
import { loader as settingsLoader } from "../paths/editor/EditorSettingsMode";

export interface ShareStatusData {
  isPublic: boolean;
  parentIsPublic: boolean;
  sharedWith: UserInfoWithEmail[];
  parentSharedWith: UserInfoWithEmail[];
}

export interface UseLoadShareDataResult {
  shareStatusData: ShareStatusData | null;
  isLoadingShareStatus: boolean;
  isLoadingSettings: boolean;
  settingsData: Awaited<ReturnType<typeof settingsLoader>> | null;
}

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
): UseLoadShareDataResult {
  const [shareStatusData, setShareStatusData] =
    useState<ShareStatusData | null>(null);
  // State drives UI updates; refs track internal control-flow without re-rendering.
  const [isLoadingShareStatus, setIsLoadingShareStatus] = useState(false);
  // Whether we've kicked off the share-status request for the *current open session*.
  const hasFetchedRef = useRef(false);
  // Monotonic id to ignore stale async responses if the modal closes/reopens.
  const shareStatusRequestIdRef = useRef(0);
  // Tracks which contentId settings were last loaded to avoid redundant loads.
  const lastLoadedSettingsContentIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen && contentId) {
      // Fetch share status on initial open (only once per modal session).
      // `isLoadingShareStatus` is the UI signal; `hasFetchedRef` avoids re-requesting.
      if (!hasFetchedRef.current) {
        hasFetchedRef.current = true;
        setIsLoadingShareStatus(true);
        // Request id lets us ignore responses from earlier requests after close/reopen.
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
