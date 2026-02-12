export type NavSection = {
  heading?: string; // optional section label for mobile
  items: NavItem[];
};

// Note: UI only accounts for one level of nesting (subItems)
export type NavItem = {
  label: string;
  to?: string; // for links
  subItems?: NavItem[]; // if present, renders as menu/dropdown
};
