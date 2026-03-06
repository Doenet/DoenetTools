import { useEffect } from "react";
import { Heading, Text, Link, VStack } from "@chakra-ui/react";
import { useOutletContext } from "react-router";
import { SiteContext } from "./SiteHeader";
import { getDiscourseUrl } from "../utils/discourse";
import { WithSideBanners } from "../layout/WithSideBanners";

const StyledLink = ({
  children,
  ...props
}: React.ComponentProps<typeof Link>) => (
  <Text pl="24px" fontSize="lg" textDecoration="underline">
    <Link {...props}>{children}</Link>
  </Text>
);

export function QuickLinks() {
  useEffect(() => {
    document.title = `Links - Doenet`;
  }, []);

  const { user } = useOutletContext<SiteContext>();
  const discussHref = getDiscourseUrl(user);

  return (
    <WithSideBanners bgColor="background">
      <VStack
        p="40px"
        w="100%"
        alignItems="start"
        spacing="16px"
        // Hack: ensure background color extends full height
        // Remove once we implement background color globally
        minH="calc(100vh - 40px)"
      >
        <Heading size="lg">Links</Heading>

        <Heading size="md">General</Heading>
        <StyledLink href="https://forms.gle/wSqsd8v355mj3GBH8">
          Sign up to receive email updates
        </StyledLink>
        <StyledLink href="/events">Upcoming events and workshops</StyledLink>

        <Heading size="md">Authoring resources</Heading>
        <StyledLink href="/scratchPad">Scratch pad</StyledLink>
        <StyledLink href="https://docs.doenet.org/">Documentation</StyledLink>

        <Heading size="md">Authoring support</Heading>
        <StyledLink href={discussHref}>Community discussions</StyledLink>
        <StyledLink href="https://mathtech.org/dropin">
          Office hours (Zoom link)
        </StyledLink>

        <Heading size="md">Social</Heading>
        <StyledLink href="https://www.facebook.com/groups/1592878455245652">
          Facebook
        </StyledLink>
        <StyledLink href="https://discord.gg/PUduwtKJ5h">Discord</StyledLink>
        <StyledLink href="/blog">Blog</StyledLink>

        <Heading size="md">Community</Heading>
        <StyledLink href="/get-involved">Get Involved</StyledLink>
        <StyledLink href="/about">About Doenet</StyledLink>

        <Heading size="md">Software developers</Heading>
        <StyledLink href="https://github.com/Doenet">
          GitHub (Doenet organization)
        </StyledLink>
        <StyledLink href="https://github.com/Doenet/DoenetML">
          GitHub (DoenetML)
        </StyledLink>
        <StyledLink href="https://github.com/Doenet/DoenetTools">
          GitHub (web app)
        </StyledLink>
        {/* <StyledLink href="https://github.com/Doenet/discussions">
          GitHub discussions
        </StyledLink> */}
      </VStack>
    </WithSideBanners>
  );
}
