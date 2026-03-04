import { useCallback, useEffect, useRef, useState } from "react";

type UseMenuTooltipSuppressionArgs = {
  onOpen: () => void;
  onClose: () => void;
  suppressionDurationMs?: number;
};

/**
 * Prevents help-tooltip persistence when a Chakra menu closes.
 *
 * Behavior:
 * - Disable tooltip while menu open/close transitions occur
 * - Blur active trigger on close so hover/focus does not immediately re-open tooltip
 * - Re-enable tooltip automatically after a short delay
 */
export function useMenuTooltipSuppression({
  onOpen,
  onClose,
  suppressionDurationMs = 150,
}: UseMenuTooltipSuppressionArgs) {
  const [suppressTooltip, setSuppressTooltip] = useState(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const temporarilySuppressTooltip = useCallback(() => {
    setSuppressTooltip(true);
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = setTimeout(() => {
      setSuppressTooltip(false);
      resetTimeoutRef.current = null;
    }, suppressionDurationMs);
  }, [suppressionDurationMs]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handleMenuOpen = useCallback(() => {
    temporarilySuppressTooltip();
    onOpen();
  }, [onOpen, temporarilySuppressTooltip]);

  const handleMenuClose = useCallback(() => {
    temporarilySuppressTooltip();
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
    onClose();
  }, [onClose, temporarilySuppressTooltip]);

  const handleTriggerMouseEnter = useCallback(() => {
    setSuppressTooltip(false);
  }, []);

  return {
    suppressTooltip,
    handleMenuOpen,
    handleMenuClose,
    handleTriggerMouseEnter,
  };
}
