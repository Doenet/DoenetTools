import React, { useEffect, useState } from 'react';
import { retrieveMediaForCid } from '../../Core/utils/retrieveMedia';
import useDoenetRender from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import VisibilitySensor from 'react-visibility-sensor-v2';

export default React.memo(function Image(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props, false);
  let [url, setUrl] = useState(null)

  let onChangeVisibility = isVisible => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible }
    })
  }

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false }
      })
    }
  }, [])

  useEffect(() => {
    if (SVs.cid) {
      retrieveMediaForCid(SVs.cid, SVs.mimeType).then(result => {
        // console.log('retrieved media')
        // console.log(result)
        setUrl(result.mediaURL);
      })
        .catch((e) => {
          //Ignore errors for now
        })
    }
  }, [])

  if (SVs.hidden) return null;

  let outerStyle = {};

  if (SVs.displayMode === "inline") {
    outerStyle = { display: "inline-block", verticalAlign: "middle", margin: "12px 0" }
  } else {
    outerStyle = { display: "flex", justifyContent: SVs.horizontalAlign, margin: "12px 0" };
  }

  let imageStyle = {
    maxWidth: '100%',
    width: sizeToCSS(SVs.width),
    aspectRatio: String(SVs.aspectRatio),
  }

  if (!(url || SVs.source)) {
    imageStyle.border = "var(--mainBorder)";
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div style={outerStyle}>
        <a name={id} />
        {
          url || SVs.source ?
            <img
              id={id}
              src={url ? url : SVs.source ? SVs.source : ""}
              style={imageStyle}
              alt={SVs.description}
            />
            :
            <div
              id={id}
              style={imageStyle}
            >
              {SVs.description}
            </div>
        }
      </div>
    </VisibilitySensor>
  )

})
