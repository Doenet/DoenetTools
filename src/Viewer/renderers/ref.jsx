import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PageContext, getURLFromRef } from "../PageViewer";
import useDoenetRenderer from "../useDoenetRenderer";
import styled from "styled-components";

// const LinkStyling = styled.a`
//     color: var(--mainBlue);
//     border-radius: 5px;
//     &: focus {
//       outline: 2px solid var(--mainBlue);
//     }
//   `;

const RefButton = styled.button`
  position: relative;
  height: 24px;
  display: inline-block;
  color: white;
  color: ${(props) => (props.disabled ? "var(--canvastext)" : "var(--canvas)")};
  background-color: ${(props) =>
    props.disabled ? "var(--mainGray)" : "var(--mainBlue)"};

  padding: 2px;
  border: none;
  border-radius: var(--mainBorderRadius);
  cursor: pointer;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  padding: 1px 6px 1px 6px;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
    color: ${(props) =>
      props.disabled ? "var(--canvastext)" : "var(--canvas)"};
  }

  &:focus {
    outline: 2px solid var(--mainBlue);
    outline-offset: 2px;
  }
`;

export default React.memo(function Ref(props) {
  let { name, id, SVs, children } = useDoenetRenderer(props);

  let {
    location = {},
    navigate,
    linkSettings,
    scrollableContainer,
  } = useContext(PageContext) || {};

  let search = location.search || "";

  if (SVs.hidden) {
    return null;
  }

  let linkContent = children;
  if (children.length === 0) {
    linkContent = SVs.linkText;
  }

  let { targetForATag, url, haveValidTarget, externalUri } = getURLFromRef({
    cid: SVs.cid,
    activityId: SVs.activityId,
    variantIndex: SVs.variantIndex,
    edit: SVs.edit,
    hash: SVs.hash,
    page: SVs.page,
    givenUri: SVs.uri,
    targetName: SVs.targetName,
    linkSettings,
    search,
    id,
  });

  if (SVs.createButton) {
    if (targetForATag === "_blank") {
      return (
        <span id={id}>
          <a name={id} />
          <RefButton
            id={id + "_button"}
            onClick={() => window.open(url, targetForATag)}
            disabled={SVs.disabled}
          >
            {SVs.linkText}
          </RefButton>
        </span>
      );
    } else {
      return (
        <span id={id}>
          <a name={id} />
          <RefButton
            id={id + "_button"}
            onClick={() => navigate(url)}
            disabled={SVs.disabled}
          >
            {SVs.linkText}
          </RefButton>
        </span>
      );
    }
  } else {
    if (haveValidTarget) {
      if (externalUri || url === "#") {
        // for some reason, if url = "#", the <Link>, below, causes a refresh
        // as it removes the # from the url.  So we use a <a> directly in this case.
        return (
          <a
            style={{
              color: "var(--mainBlue)",
              borderRadius: "5px",
            }}
            target={targetForATag}
            id={id}
            name={id}
            href={url}
          >
            {linkContent}
          </a>
        );
      } else {
        let scrollAttribute =
          scrollableContainer === window ? "scrollY" : "scrollTop";
        let stateObj = { fromLink: true };
        Object.defineProperty(stateObj, "previousScrollPosition", {
          get: () => scrollableContainer?.[scrollAttribute],
          enumerable: true,
        });
        return (
          <Link
            style={{
              color: "var(--mainBlue)",
              borderRadius: "5px",
            }}
            target={targetForATag}
            id={id}
            name={id}
            to={url}
            state={stateObj}
          >
            {linkContent}
          </Link>
        );
      }
    } else {
      return <span id={id}>{linkContent}</span>;
    }
  }
});
