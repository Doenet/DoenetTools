import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { pageToolViewAtom } from '../../Tools/_framework/NewToolRoot';
import { itemByDoenetId } from '../../_reactComponents/Course/CourseActions';
import { scrollableContainerAtom } from '../PageViewer';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function Ref(props) {
  let { name, id, SVs, children } = useDoenetRender(props);

  const pageToolView = useRecoilValue(pageToolViewAtom);
  const itemInCourse = useRecoilValue(itemByDoenetId(SVs.doenetId));
  const scrollableContainer = useRecoilValue(scrollableContainerAtom);

  let { search } = useLocation();
  let navigate = useNavigate();


  if (SVs.hidden) {
    return null;
  }

  let linkContent = children;
  if (children.length === 0) {
    linkContent = SVs.linkText;
  }

  let url = "";
  let targetForATag = "_blank";
  let haveValidTarget = false;
  let externalUri = false;
  if (SVs.cid || SVs.doenetId) {
    if (SVs.cid) {
      url = `cid=${SVs.cid}`
    } else {
      url = `doenetId=${SVs.doenetId}`
    }
    if (SVs.variantIndex) {
      url += `&variant=${SVs.variantIndex}`;
    }

    let usePublic = false;
    if (pageToolView.page === "public") {
      usePublic = true;
    } else if (Object.keys(itemInCourse).length === 0) {
      usePublic = true;
    }
    if (usePublic) {
      if (SVs.edit === true || SVs.edit === null && pageToolView.page === "public" && pageToolView.tool === "editor") {
        url = `tool=editor&${url}`;
      }
      url = `/public?${url}`
    } else {
      url = `?tool=assignment&${url}`
    }

    haveValidTarget = true;

    if (SVs.hash) {
      url += SVs.hash;
    } else {
      if (SVs.page) {
        url += `#page${SVs.page}`
        if (SVs.targetName) {
          url += SVs.targetName;
        }
      } else if (SVs.targetName) {
        url += '#' + SVs.targetName;
      }
    }
  } else if (SVs.uri) {
    url = SVs.uri;
    if (url.substring(0, 8) === "https://" || url.substring(0, 7) === "http://") {
      haveValidTarget = true;
      externalUri = true;
    }
  } else {
    url += search;

    if (SVs.page) {
      url += `#page${SVs.page}`
    } else {
      let firstSlash = id.indexOf("/");
      let prefix = id.substring(0, firstSlash);
      url += "#" + prefix;
    }
    url += SVs.targetName;
    targetForATag = null;
    haveValidTarget = true;
  }


  if (SVs.createButton) {
    if (externalUri) {
      return <span id={id}><a name={id} />
        <button id={id + "_button"} onClick={() => window.location.href = url} disabled={SVs.disabled}>{SVs.linkText}</button>
      </span>;
    } else {
      return <span id={id}><a name={id} />
        <button id={id + "_button"} onClick={() => navigate(url)} disabled={SVs.disabled}>{SVs.linkText}</button>
      </span>;
    }
    
  } else {
    if (haveValidTarget) {

      if (externalUri || url === "#") {
        // for some reason, if url = "#", the <Link>, below, causes a refresh
        // as it removes the # from the url.  So we use a <a> directly in this case.
        return <a target={targetForATag} id={name} name={name} href={url}>{linkContent}</a>
      } else {

        let scrollAttribute = scrollableContainer === window ? "scrollY" : "scrollTop";
        let stateObj = { fromLink: true }
        Object.defineProperty(stateObj, 'previousScrollPosition', { get: () => scrollableContainer?.[scrollAttribute], enumerable: true });
        return <Link target={targetForATag} id={id} name={id} to={url} state={stateObj}>{linkContent}</Link>
      }
    } else {
      return <span id={id}>{linkContent}</span>
    }
  }

})

