import { Hide, Show } from "@chakra-ui/react";
import { UserInfoWithEmail } from "client/src/types";
import { getDiscourseUrl } from "client/src/utils/discourse";
import { NavbarDesktop } from "./NavbarDesktop";
import {
  mainSections,
  navAccountAnonymousUser,
  navAccountEditor,
  navAccountPublic,
  navAccountUser,
} from "./navbar.data";
import { NavSection } from "./navbar.types";
import { NavbarMobile } from "./NavbarMobile";

export function Navbar({ user }: { user?: UserInfoWithEmail }) {
  const discussHref = getDiscourseUrl(user);
  const main = mainSections(discussHref);

  let account: NavSection;
  if (!user) {
    account = navAccountPublic;
  } else if (user.isAnonymous) {
    account = navAccountAnonymousUser;
  } else if (user.isEditor) {
    account = navAccountEditor(user.userId);
  } else {
    account = navAccountUser(user.userId);
  }

  return (
    <>
      <Hide below="lg">
        <NavbarDesktop
          mainSections={main}
          accountSection={account}
          user={user}
        />
      </Hide>
      <Show below="lg">
        <NavbarMobile sections={[...main, account]} user={user} />
      </Show>
    </>
  );
}
