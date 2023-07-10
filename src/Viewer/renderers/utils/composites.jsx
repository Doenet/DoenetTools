import React from "react";
import { cesc } from "../../../_utils/url";

// If consecutive children are from a composite with displayWithCommas set,
// then display those children separated by commas.
// compositeReplacementActiveChange is an array for each composite that
// contributed to the active children of the component.

export function addCommasForCompositeRanges({
  compositeReplacementActiveRange,
  children,
  startInd,
  endInd,
  removedInd = null,
}) {
  let newChildren = [];
  let lastChildInd = startInd - 1;

  let replacementRanges = [...compositeReplacementActiveRange];

  for (let rangeInd = 0; rangeInd < replacementRanges.length; rangeInd++) {
    let range = replacementRanges[rangeInd];

    let rangeFirstInd = range.firstInd;
    let rangeLastInd = range.lastInd;

    if (removedInd !== null) {
      if (rangeFirstInd === removedInd || rangeLastInd === removedInd) {
        continue;
      }
      if (rangeFirstInd > removedInd) {
        rangeFirstInd -= 1;
      }
      if (rangeLastInd > removedInd) {
        rangeLastInd -= 1;
      }
    }

    if (rangeFirstInd > lastChildInd && rangeLastInd <= endInd) {
      if (lastChildInd + 1 < rangeFirstInd) {
        newChildren.push(...children.slice(lastChildInd + 1, rangeFirstInd));
      }

      // If a composite produced composites that produced children,
      // then this outer composite is first in the array of replacement ranges.
      // We first process the children corresponding to any of these replacement composites,
      // which will wrap the replacements of each composite into a single child,
      // which may be separated according to the settings of that composite.

      // We remove the replacement range of the current composite (any all earlier ones)
      let subReplacementRange = replacementRanges.slice(rangeInd + 1);

      let childrenInRange = addCommasForCompositeRanges({
        compositeReplacementActiveRange: subReplacementRange,
        children,
        startInd: rangeFirstInd,
        endInd: rangeLastInd,
        removedInd,
      });

      if (range.displayWithCommas && childrenInRange.length > 1) {
        // add commas between all children from a single composite
        let newChildrenInRange = [childrenInRange[0]];
        let isNonBlankStringChild = childrenInRange.map(
          (child) => typeof child !== "string" || child.trim() !== "",
        );
        for (let [prevInd, child] of childrenInRange.slice(1).entries()) {
          if (
            isNonBlankStringChild[prevInd] &&
            isNonBlankStringChild.slice(prevInd + 1).some((x) => x)
          ) {
            // The previous child is not a blank string,
            // but it could have ended with a child that was a blank string.
            // To eliminate the space before the comma from that blank string,
            // remove any ending blank string children from that child
            newChildrenInRange[newChildrenInRange.length - 1] =
              removeEndingBlankStringChildren(
                newChildrenInRange[newChildrenInRange.length - 1],
              );
            newChildrenInRange.push(", ");
          }
          newChildrenInRange.push(child);
        }
        childrenInRange = newChildrenInRange;
      }

      // Whether or not we added commas, we still add a span and a anchor with the id of the composite
      // so that links to the composite name will scroll to the right location.
      let compositeId = cesc(range.compositeName);
      childrenInRange = (
        <React.Fragment key={compositeId}>
          <a name={compositeId} />
          <span id={compositeId}>{childrenInRange}</span>
        </React.Fragment>
      );
      newChildren.push(childrenInRange);
      lastChildInd = rangeLastInd;
    }
  }

  if (lastChildInd < endInd) {
    newChildren.push(...children.slice(lastChildInd + 1, endInd + 1));
  }
  return newChildren;
}

function removeEndingBlankStringChildren(component) {
  if (!(component.props?.children?.length > 0)) {
    return component;
  }

  let children = [...component.props.children];
  let originalLastChild = children[children.length - 1];
  let lastChild = originalLastChild;
  while (typeof lastChild === "string" && lastChild.trim() === "") {
    // the last child was a blank string so remove it,
    // looping to previous child if it exists
    children.pop();
    if (children.length === 0) {
      // we need to recreate component since React makes it read only
      component = { ...component };
      component.props = { ...component.props };
      component.props.children = [];
      return component;
    }
    lastChild = children[children.length - 1];
  }

  // recurse to remove any blank string children from lastChild
  lastChild = removeEndingBlankStringChildren(lastChild);

  if (lastChild !== originalLastChild) {
    // we need to recreate component since React makes it read only
    component = { ...component };
    component.props = { ...component.props };
    component.props.children = [
      ...children.slice(0, children.length - 1),
      lastChild,
    ];
  }

  return component;
}
