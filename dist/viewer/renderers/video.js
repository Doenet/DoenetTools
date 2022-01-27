import React from "../../_snowpack/pkg/react.js";
import DoenetRenderer from "./DoenetRenderer.js";
import cssesc from "../../_snowpack/pkg/cssesc.js";
import {sizeToCSS} from "./utils/css.js";
export default class Video extends DoenetRenderer {
  constructor(props) {
    super(props);
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.onPlaybackRateChange = this.onPlaybackRateChange.bind(this);
  }
  componentDidMount() {
    if (this.doenetSvData.youtube) {
      let cName = cssesc(this.componentName);
      this.player = new window.YT.Player(cName, {
        videoId: this.doenetSvData.youtube,
        width: sizeToCSS(this.doenetSvData.width),
        height: sizeToCSS(this.doenetSvData.height),
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0
        },
        events: {
          onReady: this.onPlayerReady,
          onStateChange: this.onPlayerStateChange,
          onPlaybackRateChange: this.onPlaybackRateChange
        }
      });
    }
  }
  render() {
    if (this.doenetSvData.hidden) {
      return null;
    }
    if (this.doenetSvData.youtube) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
        name: this.componentName
      }), /* @__PURE__ */ React.createElement("div", {
        className: "video",
        id: this.componentName
      }));
    } else if (this.doenetSvData.source) {
      let extension = this.doenetSvData.source.split("/").pop().split(".").pop();
      let type;
      if (extension === "ogg") {
        type = "video/ogg";
      } else if (extension === "webm") {
        type = "video/webm";
      } else if (extension === "mp4") {
        type = "video/mp4";
      } else {
        console.warn("Haven't implemented video for any extension other than .ogg, .webm, .mp4");
      }
      if (type) {
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
          name: this.componentName
        }), /* @__PURE__ */ React.createElement("video", {
          className: "video",
          id: this.componentName,
          style: {objectFit: "fill"},
          controls: true,
          width: sizeToCSS(this.doenetSvData.width),
          height: sizeToCSS(this.doenetSvData.height)
        }, /* @__PURE__ */ React.createElement("source", {
          src: this.doenetSvData.source,
          type
        }), "Your browser does not support the <video> tag."));
      } else {
        return null;
      }
    }
    console.warn("No video returned youtube or no valid sources specified");
    return null;
  }
  onPlayerReady() {
    let player = this.player;
    let renderer = this;
    player.setPlaybackQuality("hd720");
    window.setInterval(function() {
      let newTime = player.getCurrentTime();
      let timeInterval;
      if (renderer.skippedCurrentTime) {
        timeInterval = newTime - renderer.skippedCurrentTime;
      } else {
        timeInterval = newTime - renderer.currentTime;
      }
      if (!(renderer.currentTime >= 0) || timeInterval > 0 && timeInterval < 1) {
        renderer.currentTime = newTime;
        renderer.skippedCurrentTime = null;
      } else {
        renderer.skippedCurrentTime = newTime;
      }
    }, 200);
  }
  async onPlayerStateChange(event) {
    var lastPlayerState = this.lastPlayerState;
    let renderer = this;
    let player = this.player;
    let duration = player.getDuration();
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        if (this.lastEventState !== event.data) {
          let newTime = player.getCurrentTime();
          if (this.lastEventState === window.YT.PlayerState.PAUSED) {
            let timeSincePaused = newTime - this.lastPausedTime;
            if (timeSincePaused < 0 || timeSincePaused > 0.5) {
              await this.actions.recordVideoSkipped({
                beginTime: this.lastPausedTime,
                endTime: newTime,
                duration
              });
            }
          }
          this.lastPlayedTime = newTime;
          let rate = player.getPlaybackRate();
          this.rates = [{
            startingPoint: newTime,
            rate
          }];
          this.currentTime = NaN;
          await this.actions.recordVideoStarted({
            beginTime: player.getCurrentTime(),
            duration,
            rate
          });
          this.lastEventState = event.data;
        }
        break;
      case window.YT.PlayerState.PAUSED:
        var timer = setTimeout(async function() {
          let currentTime = player.getCurrentTime();
          if (renderer.lastEventState === window.YT.PlayerState.PLAYING) {
            renderer.rates[renderer.rates.length - 1].endingPoint = currentTime;
            await renderer.actions.recordVideoWatched({
              beginTime: renderer.lastPlayedTime,
              endTime: currentTime,
              duration,
              rates: renderer.rates
            });
          }
          await renderer.actions.recordVideoPaused({
            endTime: currentTime,
            duration
          });
          renderer.currentTime = NaN;
          renderer.lastEventState = event.data;
          renderer.lastPausedTime = currentTime;
        }, 250);
        this.timer = timer;
        break;
      case window.YT.PlayerState.BUFFERING:
        clearTimeout(this.timer);
        if (lastPlayerState !== window.YT.PlayerState.UNSTARTED && Number.isFinite(this.currentTime)) {
          let newTime = player.getCurrentTime();
          this.rates[this.rates.length - 1].endingPoint = this.currentTime;
          await this.actions.recordVideoWatched({
            beginTime: this.lastPlayedTime,
            endTime: this.currentTime,
            duration,
            rates: this.rates
          });
          await this.actions.recordVideoSkipped({
            beginTime: this.currentTime,
            endTime: newTime,
            duration
          });
          this.currentTime = NaN;
          this.lastEventState = event.data;
        }
        break;
      case window.YT.PlayerState.ENDED:
        this.rates[this.rates.length - 1].endingPoint = player.getCurrentTime();
        await this.actions.recordVideoWatched({
          beginTime: this.lastPlayedTime,
          endTime: player.getCurrentTime(),
          duration,
          rates: this.rates
        });
        await this.actions.recordVideoCompleted({
          duration
        });
        this.currentTime = NaN;
        this.lastEventState = event.data;
        break;
      case window.YT.PlayerState.UNSTARTED:
        break;
    }
    this.lastPlayerState = event.data;
  }
  onPlaybackRateChange(event) {
    this.rates[this.rates.length - 1].endingPoint = this.currentTime;
    this.rates.push({
      startingPoint: this.currentTime,
      rate: event.data
    });
  }
}
