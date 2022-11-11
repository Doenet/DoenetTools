import React, {useRef, useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
import cssesc from "../../_snowpack/pkg/cssesc.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const VideoStyling = styled.div`
&: focus {
  outline: 2px solid var(--canvastext);
  outline-offset: 2px;
}
`;
export default React.memo(function Video(props) {
  let {name, id, SVs, actions, callAction} = useDoenetRender(props);
  let player = useRef(null);
  let postSkipTime = useRef(null);
  let preSkipTime = useRef(null);
  let rates = useRef([]);
  let lastPlayerState = useRef(null);
  let pauseTimeoutId = useRef(null);
  let lastPausedTime = useRef(0);
  let lastPlayedTime = useRef(null);
  let pollIntervalId = useRef(null);
  let lastSetTimeAction = useRef(null);
  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: {isVisible}
    });
  };
  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: {isVisible: false}
      });
    };
  }, []);
  useEffect(() => {
    if (SVs.youtube) {
      let cName = cssesc(id);
      if (window.YT) {
        player.current = new window.YT.Player(cName, {
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onPlaybackRateChange
          }
        });
      }
    }
  }, [window.YT]);
  function pollCurrentTime() {
    let currentTime = player.current.getCurrentTime();
    let timeInterval;
    if (postSkipTime.current) {
      timeInterval = currentTime - postSkipTime.current;
    } else {
      timeInterval = currentTime - preSkipTime.current;
    }
    if (!(preSkipTime.current >= 0) || timeInterval > 0 && timeInterval < 1) {
      preSkipTime.current = currentTime;
      postSkipTime.current = null;
    } else if (timeInterval !== 0) {
      postSkipTime.current = currentTime;
    }
    let roundTime = Math.floor(currentTime);
    if (roundTime !== lastSetTimeAction.current) {
      lastSetTimeAction.current = roundTime;
      callAction({
        action: actions.setTime,
        args: {
          time: roundTime
        }
      });
    }
  }
  function onPlayerReady(event) {
    callAction({
      action: actions.recordVideoReady,
      args: {
        duration: player.current.getDuration()
      }
    });
  }
  function onPlayerStateChange(event) {
    let duration = player.current.getDuration();
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        if (lastPlayerState.current !== event.data) {
          let currentTime2 = player.current.getCurrentTime();
          clearInterval(pollIntervalId.current);
          pollIntervalId.current = window.setInterval(pollCurrentTime, 200);
          if (lastPlayerState.current === window.YT.PlayerState.PAUSED) {
            let timeSincePaused = currentTime2 - lastPausedTime.current;
            if (timeSincePaused < 0 || timeSincePaused > 0.5) {
              callAction({
                action: actions.recordVideoSkipped,
                args: {
                  beginTime: lastPausedTime.current,
                  endTime: currentTime2,
                  duration
                }
              });
            }
          }
          let rate = player.current.getPlaybackRate();
          rates.current = [{
            startingPoint: currentTime2,
            rate
          }];
          lastPlayedTime.current = currentTime2;
          preSkipTime.current = currentTime2;
          postSkipTime.current = null;
          callAction({
            action: actions.recordVideoStarted,
            args: {
              beginTime: player.current.getCurrentTime(),
              duration,
              rate
            }
          });
          lastPlayerState.current = event.data;
        }
        break;
      case window.YT.PlayerState.PAUSED:
        let lastState = lastPlayerState.current;
        let beginTime = lastPlayedTime.current;
        let pausedTime = player.current.getCurrentTime();
        pauseTimeoutId.current = setTimeout(function() {
          clearInterval(pollIntervalId.current);
          if (lastState === window.YT.PlayerState.PLAYING && pausedTime > beginTime) {
            rates.current[rates.current.length - 1].endingPoint = pausedTime;
            callAction({
              action: actions.recordVideoWatched,
              args: {
                beginTime,
                endTime: pausedTime,
                duration,
                rates: rates.current
              }
            });
            lastPlayedTime.current = null;
          }
          callAction({
            action: actions.recordVideoPaused,
            args: {
              endTime: pausedTime,
              duration
            }
          });
          lastPausedTime.current = pausedTime;
          lastPlayerState.current = event.data;
        }, 250);
        break;
      case window.YT.PlayerState.BUFFERING:
        clearTimeout(pauseTimeoutId.current);
        let currentTime = player.current.getCurrentTime();
        if (lastPlayedTime.current !== null) {
          let beginTime2 = lastPlayedTime.current;
          if (preSkipTime.current > beginTime2) {
            rates.current[rates.current.length - 1].endingPoint = preSkipTime.current;
            callAction({
              action: actions.recordVideoWatched,
              args: {
                beginTime: beginTime2,
                endTime: preSkipTime.current,
                duration,
                rates: rates.current
              }
            });
            beginTime2 = preSkipTime.current;
          }
          callAction({
            action: actions.recordVideoSkipped,
            args: {
              beginTime: beginTime2,
              endTime: currentTime,
              duration
            }
          });
          lastPlayerState.current = event.data;
          lastPlayedTime.current = null;
          preSkipTime.current = currentTime;
          postSkipTime.current = null;
        }
        break;
      case window.YT.PlayerState.ENDED:
        clearInterval(pollIntervalId.current);
        let begin = lastPlayedTime.current;
        let end = player.current.getCurrentTime();
        if (rates.current.length > 0 && begin !== null && end > begin) {
          rates.current[rates.current.length - 1].endingPoint = end;
          callAction({
            action: actions.recordVideoWatched,
            args: {
              beginTime: begin,
              endTime: end,
              duration,
              rates: rates.current
            }
          });
          lastPlayedTime.current = null;
        }
        callAction({
          action: actions.recordVideoCompleted,
          args: {
            duration
          }
        });
        lastPlayerState.current = event.data;
        break;
      case window.YT.PlayerState.UNSTARTED:
        lastPlayerState.current = event.data;
        break;
    }
  }
  function onPlaybackRateChange(event) {
    let currentTime = player.current.getCurrentTime();
    rates.current[rates.current.length - 1].endingPoint = currentTime;
    rates.current.push({
      startingPoint: currentTime,
      rate: event.data
    });
  }
  if (player.current?.getPlayerState) {
    let playerState = player.current.getPlayerState();
    if (SVs.state === "playing") {
      if (playerState === window.YT.PlayerState.UNSTARTED || playerState === window.YT.PlayerState.PAUSED || playerState === window.YT.PlayerState.CUED || playerState === window.YT.PlayerState.ENDED) {
        player.current.playVideo();
      }
    } else if (SVs.state === "stopped") {
      if (playerState === window.YT.PlayerState.PLAYING) {
        player.current.pauseVideo();
      }
    }
    if (SVs.time !== Number(lastSetTimeAction.current)) {
      let time = SVs.time;
      let duration = player.current.getDuration();
      if (time > duration) {
        time = Math.floor(duration);
        callAction({
          action: actions.setTime,
          args: {
            time
          }
        });
      }
      if (time !== Number(lastSetTimeAction.current)) {
        if (player.current.getPlayerState() === window.YT.PlayerState.CUED) {
          player.current.pauseVideo();
          player.current.seekTo(time, true);
          setTimeout(() => player.current.pauseVideo(), 200);
        } else {
          player.current.seekTo(time, true);
        }
        lastSetTimeAction.current = time;
      }
    }
  }
  if (SVs.hidden)
    return null;
  let outerStyle = {};
  if (SVs.displayMode === "inline") {
    outerStyle = {display: "inline-block", verticalAlign: "middle", margin: "12px 0"};
  } else {
    outerStyle = {display: "flex", justifyContent: SVs.horizontalAlign, margin: "12px 0"};
  }
  let videoStyle = {
    maxWidth: "100%",
    width: sizeToCSS(SVs.width),
    aspectRatio: String(SVs.aspectRatio)
  };
  let videoTag;
  if (SVs.youtube) {
    videoTag = /* @__PURE__ */ React.createElement("iframe", {
      id,
      style: videoStyle,
      src: "https://www.youtube.com/embed/" + SVs.youtube + "?enablejsapi=1&rel=0&modestbranding=1",
      allow: "autoplay; fullscreen"
    });
  } else if (SVs.source) {
    videoTag = /* @__PURE__ */ React.createElement("video", {
      className: "video",
      id,
      controls: true,
      style: videoStyle
    }, /* @__PURE__ */ React.createElement("source", {
      src: SVs.source,
      type: `video/${SVs.source.split("/").pop().split(".").pop()}`
    }), "Your browser does not support the <video> tag.");
  } else {
    videoTag = /* @__PURE__ */ React.createElement("span", {
      id
    });
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement(VideoStyling, {
    tabIndex: "0",
    style: outerStyle,
    id: id + "_outer"
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), videoTag));
});
