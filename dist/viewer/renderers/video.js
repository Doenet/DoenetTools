import React, {useRef, useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
import cssesc from "../../_snowpack/pkg/cssesc.js";
export default React.memo(function Video(props) {
  let {name, SVs, actions, callAction} = useDoenetRender(props);
  let player = useRef(null);
  let skippedCurrentTime = useRef(null);
  let currentTime = useRef(null);
  let rates = useRef([]);
  let lastPlayerState = useRef(null);
  let timer = useRef(null);
  let lastPausedTime = useRef(0);
  let lastPlayedTime = useRef(0);
  useEffect(() => {
    if (SVs.youtube) {
      let cName = cssesc(name);
      player.current = new window.YT.Player(cName, {
        videoId: SVs.youtube,
        width: sizeToCSS(SVs.width),
        height: sizeToCSS(SVs.height),
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onPlaybackRateChange
        }
      });
    }
  }, []);
  function onPlayerReady(event) {
    window.setInterval(function() {
      let newTime = player.current.getCurrentTime();
      let timeInterval;
      if (skippedCurrentTime.current) {
        timeInterval = newTime - skippedCurrentTime.current;
      } else {
        timeInterval = newTime - currentTime.current;
      }
      if (!(currentTime.current >= 0) || timeInterval > 0 && timeInterval < 1) {
        currentTime.current = newTime;
        skippedCurrentTime.current = null;
      } else {
        skippedCurrentTime.current = newTime;
      }
    }, 200);
  }
  async function onPlayerStateChange(event) {
    let duration = player.current.getDuration();
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        if (lastPlayerState.current !== event.data) {
          let currentTime3 = player.current.getCurrentTime();
          if (lastPlayerState.current === window.YT.PlayerState.PAUSED) {
            let timeSincePaused = currentTime3 - lastPausedTime.current;
            if (timeSincePaused < 0 || timeSincePaused > 0.5) {
              callAction({
                action: actions.recordVideoSkipped,
                args: {
                  beginTime: lastPausedTime.current,
                  endTime: currentTime3,
                  duration
                }
              });
            }
          }
          let rate = player.current.getPlaybackRate();
          rates.current = [{
            startingPoint: currentTime3,
            rate
          }];
          lastPlayedTime.current = currentTime3;
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
        timer.current = setTimeout(async function() {
          let currentTime3 = player.current.getCurrentTime();
          if (lastPlayerState.current === window.YT.PlayerState.PLAYING) {
            rates.current[rates.current.length - 1].endingPoint = currentTime3;
            callAction({
              action: actions.recordVideoWatched,
              args: {
                beginTime: lastPlayedTime.current,
                endTime: currentTime3,
                duration,
                rates: rates.current
              }
            });
          }
          callAction({
            action: actions.recordVideoPaused,
            args: {
              endTime: currentTime3,
              duration
            }
          });
          lastPausedTime.current = currentTime3;
          lastPlayerState.current = event.data;
        }, 250);
        break;
      case window.YT.PlayerState.BUFFERING:
        clearTimeout(timer.current);
        let currentTime2 = player.current.getCurrentTime();
        if (lastPlayerState.current !== window.YT.PlayerState.UNSTARTED) {
          rates.current[rates.current.length - 1].endingPoint = currentTime2;
          callAction({
            action: actions.recordVideoWatched,
            args: {
              beginTime: lastPlayedTime.current,
              endTime: currentTime2,
              duration,
              rates: rates.current
            }
          });
          callAction({
            action: actions.recordVideoSkipped,
            args: {
              beginTime: lastPlayedTime.current,
              endTime: currentTime2,
              duration
            }
          });
          lastPlayerState.current = event.data;
        }
        break;
      case window.YT.PlayerState.ENDED:
        rates.current[rates.current.length - 1].endingPoint = player.current.getCurrentTime();
        callAction({
          action: actions.recordVideoWatched,
          args: {
            beginTime: lastPlayedTime.current,
            endTime: player.current.getCurrentTime(),
            duration,
            rates: rates.current
          }
        });
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
    let currentTime2 = player.current.getCurrentTime();
    rates.current[rates.current.length - 1].endingPoint = currentTime2;
    rates.current.push({
      startingPoint: currentTime2,
      rate: event.data
    });
  }
  if (SVs.hidden)
    return null;
  return /* @__PURE__ */ React.createElement("div", {
    style: {margin: "12px 0", display: "flex", justifyContent: "left", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement("a", {
    name
  }), SVs.youtube ? /* @__PURE__ */ React.createElement("div", {
    className: "video",
    id: name
  }) : SVs.source ? /* @__PURE__ */ React.createElement("video", {
    className: "video",
    id: name,
    controls: true,
    width: "100%"
  }, /* @__PURE__ */ React.createElement("source", {
    src: SVs.source,
    type: `video/${SVs.source.split("/").pop().split(".").pop()}`
  }), "Your browser does not support the <video> tag.") : /* @__PURE__ */ React.createElement("span", {
    id: name
  }, SVs.text));
});
