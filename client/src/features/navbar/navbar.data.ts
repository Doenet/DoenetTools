import { NavSection } from "./navbar.types";

export function mainSections(discussionsLink: string): NavSection[] {
  return [
    {
      items: [
        { label: "Explore", to: "/explore" },
        { label: "Try Writing", to: "/scratchPad" },
        {
          label: "Help & Training",
          subItems: [
            { label: "Documentation", to: "https://docs.doenet.org" },
            { label: "Events & Workshops", to: "/events" },
            { label: "Ask a Question (Forums)", to: discussionsLink },
          ],
        },
        {
          label: "Community",
          subItems: [
            { label: "Community Discussions", to: discussionsLink },
            { label: "Blog", to: "/blog", reloadDocument: true },
            { label: "Get Involved", to: "/get-involved" },
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
        // {
        //   label: "Authors",
        //   subItems: [
        //     { label: "Scratch pad", to: "/scratchPad" },
        //     { label: "Authoring documentation", to: "https://docs.doenet.org" },
        //     { label: "Training workshops", to: "/events#workshops" },
        //     { label: "Get support", to: discussionsLink },
        //   ],
        // },
        {
          label: "Students",
          subItems: [{ label: "Join with code", to: "/code" }],
        },
      ],
    },
  ];
}

export const navAccountPublic: NavSection = {
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
