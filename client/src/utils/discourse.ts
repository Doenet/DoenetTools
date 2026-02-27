import { SiteContext } from "../paths/SiteHeader";

export function getDiscourseUrl(
  user: SiteContext["user"],
  landingPage?: "support" | "discussion",
) {
  return `${import.meta.env.VITE_DISCOURSE_URL}${
    user && user?.isAnonymous === false ? "/session/sso" : ""
  }${landingPage ? `/c/${landingPage}` : ""}`;
}
