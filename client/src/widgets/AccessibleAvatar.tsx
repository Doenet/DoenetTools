import { Avatar as ChakraAvatar, AvatarProps } from "@chakra-ui/react";

/**
 * Accessible Avatar component that uses WCAG AA compliant colors (4.5:1 contrast with white text).
 * Wraps Chakra Avatar with a custom color palette to ensure text contrast meets accessibility standards.
 * Chakra 2's default Avatar colors have poor contrast, so this component provides accessible alternatives.
 */

// WCAG AA compliant colors (4.5:1 contrast ratio with white text #FFFFFF)
// These colors are dark enough to ensure readable initials on any Avatar size
const ACCESSIBLE_AVATAR_COLORS = [
  "#001a4d", // very dark blue
  "#22543d", // very dark green
  "#44337a", // very dark purple
  "#742a2a", // very dark red
  "#234e52", // very dark teal
  "#7c2d12", // very dark orange
  "#702459", // very dark pink
  "#3c366b", // very dark indigo
  "#0c3e47", // very dark cyan
  "#161e26", // very dark gray
];

export function AccessibleAvatar(props: AvatarProps) {
  // Generate a color index from the name to ensure consistent colors for the same name
  const generateColorIndex = (name?: string): number => {
    if (!name) return 0;

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash) % ACCESSIBLE_AVATAR_COLORS.length;
  };

  const colorIndex = generateColorIndex(props.name);
  const bgColor = ACCESSIBLE_AVATAR_COLORS[colorIndex];

  // If a custom bg color is provided, use it; otherwise use our accessible color
  const backgroundColor = props.bg ? props.bg : bgColor;
  // Always use white text for maximum contrast with dark backgrounds
  const textColor = props.color ? props.color : "white";

  return <ChakraAvatar {...props} bg={backgroundColor} color={textColor} />;
}
