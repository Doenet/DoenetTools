import { NavSection } from "./navbar.types";

export function mainSections(discussionsLink: string): NavSection[] {
  return [
    {
      items: [
        { label: "Explore", to: "/explore" },
        { label: "About", to: "/about" },
        {
          label: "Get Involved",
          subItems: [
            { label: "How to get involved", to: "https://pages.doenet.org" },
            { label: "Community discussions", to: discussionsLink },
            { label: "Software/technical", to: "https://github.com/Doenet" },
          ],
        },
      ],
    },
    {
      heading: "By Role",
      items: [
        // TODO: Add Instructors link on header once we have pages for them.
        // {
        //   label: "Instructors",
        //   subItems: [{ label: "Get support", to: ?? }],
        // },
        {
          label: "Authors",
          subItems: [
            { label: "Authoring documentation", to: "https://docs.doenet.org" },
            { label: "Get support", to: discussionsLink },
          ],
        },
        {
          label: "Students",
          subItems: [{ label: "Join with code", to: "/code" }],
        },
      ],
    },
  ];
}

export const navAccountPublic: NavSection = {
  heading: "My workspace",
  items: [{ label: "Sign up/Log In", to: "/signIn" }],
};

export const navAccountAnonymousUser: NavSection = {
  items: [],
};

export function navAccountUser(userId: string): NavSection {
  return {
    heading: "My workspace",
    items: [
      {
        label: "My Activities",
        to: `/activities/${userId}`,
      },
      { label: "Assigned to Me", to: "/assigned" },
    ],
  };
}

export function navAccountEditor(userId: string): NavSection {
  return {
    heading: "My workspace",
    items: [
      {
        label: "My Activities",
        to: `/activities/${userId}`,
      },
      { label: "Assigned to Me", to: "/assigned" },
      { label: "Curate", to: `/curate` },
    ],
  };
}
