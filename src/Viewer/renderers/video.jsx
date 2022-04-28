// youtube player code based on Ximera youtube player
// https://github.com/XimeraProject/server
// https://github.com/XimeraProject/server/blob/master/public/javascripts/youtube.js


import React, { useRef, useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import cssesc from 'cssesc';


export default function Video(props) {
  let { name, SVs, actions, callAction } = useDoenetRender(props);
  let player = useRef(null);
  let skippedCurrentTime = useRef(null);
  let currentTime = useRef(null);
  let rates = useRef([]);
  let lastPlayerState = useRef(null);
  let timer = useRef(null);
  let lastPausedTime = useRef(0);
  let lastPlayedTime = useRef(0);
  


  useEffect(()=>{
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
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onPlaybackRateChange': onPlaybackRateChange,
        }
      })

    }


  },[])

  function onPlayerReady(event){
    //setPlaybackQuality doesn't seem to work
    // event.target.setPlaybackQuality("hd720");
    // player.current.setPlaybackQuality("hd720");


    // To correctly capture the "watched" events, we need to know the last time
    // of the player before the user skips to a new spot
    // Since the callbacks only give the time after a skip,
    // we poll the player for the current time every 200 ms
    // to record the last time before a skip


    window.setInterval(function () {
      let newTime = player.current.getCurrentTime();
        let timeInterval;

      // if previously skipped a time (because the jump was too large)
      // we need to calculate the interval from that skipped time
      if (skippedCurrentTime.current) {
        timeInterval = newTime - skippedCurrentTime.current;
      } else {
        timeInterval = newTime - currentTime.current;
      }

      // We are polling every 200 ms,
      // hence if a jump was larger than a second (or negative),
      // we guess that a portion of the video was skipped
      // so don't update the current time for one cycle
      // (which is typically long enough for the state change listener
      // to be able to grab the current time to determine
      // the end of the watched segment)
      if (!(currentTime.current >= 0) || (timeInterval > 0 && timeInterval < 1)) {
        currentTime.current = newTime;
        skippedCurrentTime.current = null;
      } else {
        // jump was negative or longer than a second
        skippedCurrentTime.current = newTime;
      }
    }, 200);
  }

  async function onPlayerStateChange(event){
    //setPlaybackQuality doesn't seem to work
    // if (event.data == YT.PlayerState.BUFFERING) {
      // event.target.setPlaybackQuality('hd720');
  //     event.target.setPlaybackQuality('hd1080');
  // }


    let duration = player.current.getDuration();

    switch (event.data) {
      case (window.YT.PlayerState.PLAYING):

        if (lastPlayerState.current !== event.data) {
          let currentTime = player.current.getCurrentTime();

          if (lastPlayerState.current === window.YT.PlayerState.PAUSED) {
            let timeSincePaused = currentTime - lastPausedTime.current;

            // if the time has gone backward or move ahead more than a half-second,
            // we consider that a portion of the video was skipped
            // (When video is paused and immediately restarted, the time
            // skips forward a small amount, but less than a half-second)

            if (timeSincePaused < 0 || timeSincePaused > 0.5) {
              //  console.log("recordVideoSkipped",{
              //     beginTime: lastPausedTime.current,
              //     endTime: currentTime,
              //     duration,
              //   })

                callAction({
                  action:actions.recordVideoSkipped,
                  args:{
                    beginTime: lastPausedTime.current,
                    endTime: currentTime,
                    duration,
                  }
                })

            }
          }

          // lastPausedTime.current = currentTime;
          let rate = player.current.getPlaybackRate();
          rates.current = [{
            startingPoint: currentTime,
            rate
          }]

          // currentTime.current = NaN;  //TODO: Why reset this?
          lastPlayedTime.current = currentTime;

          // console.log("recordVideoStarted",{
          //     beginTime: player.current.getCurrentTime(),
          //     duration,
          //     rate,
          //   })
            callAction({
              action:actions.recordVideoStarted,
              args:{
                beginTime: player.current.getCurrentTime(),
                duration,
                rate,
              }
            })
    
          
          lastPlayerState.current = event.data;

        }

        break;

      case (window.YT.PlayerState.PAUSED):
        timer.current = setTimeout(
          async function () {
            let currentTime = player.current.getCurrentTime();

            if (lastPlayerState.current === window.YT.PlayerState.PLAYING) {
              rates.current[rates.current.length - 1].endingPoint = currentTime;

              // console.log("recordVideoWatched",{
              //     beginTime: lastPlayedTime.current,
              //     endTime: currentTime,
              //     duration,
              //     rates: rates.current,
              //   })
                callAction({
                  action:actions.recordVideoWatched,
                  args:{
                    beginTime: lastPlayedTime.current,
                    endTime: currentTime,
                    duration,
                    rates: rates.current,
                  }
                })
             
            }
            // console.log("recordVideoPaused",{
            //   endTime: currentTime,
            //   duration,
            // })
            callAction({
              action:actions.recordVideoPaused,
              args:{
                endTime: currentTime,
                duration,
              }
            })

            lastPausedTime.current = currentTime;
            lastPlayerState.current = event.data;

          }, 250);


        break;

      case (window.YT.PlayerState.BUFFERING):
        clearTimeout(timer.current);
        let currentTime = player.current.getCurrentTime();

        if (lastPlayerState.current !== window.YT.PlayerState.UNSTARTED) {


          rates.current[rates.current.length - 1].endingPoint = currentTime;

          // console.log("BUFFERING recordVideoWatched",{
          //   beginTime: lastPlayedTime.current,
          //   endTime: currentTime,
          //   duration,
          //   rates: rates.current,
          // })

          callAction({
            action:actions.recordVideoWatched,
            args:{
              beginTime: lastPlayedTime.current,
              endTime: currentTime,
              duration,
              rates: rates.current,
            }
          })


          // console.log("BUFFERING recordVideoSkipped",{
          //   beginTime: lastPlayedTime.current,
          //   endTime: currentTime,
          //   duration,
          // })

          callAction({
            action:actions.recordVideoSkipped,
            args:{
              beginTime: lastPlayedTime.current,
              endTime: currentTime,
              duration,
            }
          })


           lastPlayerState.current = event.data;


        }

        break;

      case (window.YT.PlayerState.ENDED):
        // BADBAD: We're treating ENDED as though it meant the user
        // completed the video, even thought it
        // doesn't necessarily mean the learner watched ALL the video


        rates.current[rates.current.length - 1].endingPoint = player.current.getCurrentTime();

        // console.log("recordVideoWatched",{
        //   beginTime: lastPlayedTime.current,
        //   endTime: player.current.getCurrentTime(),
        //   duration,
        //   rates: rates.current,
        // })
        callAction({
          action:actions.recordVideoWatched,
          args:{
            beginTime: lastPlayedTime.current,
            endTime: player.current.getCurrentTime(),
            duration,
            rates: rates.current,
          }
        })


        // console.log("recordVideoCompleted",{
        //   duration,
        // })
        callAction({
          action:actions.recordVideoCompleted,
          args:{
            duration,
          }
        })


        lastPlayerState.current = event.data;


        break;

      case (window.YT.PlayerState.UNSTARTED):
        lastPlayerState.current = event.data;

        break;
    }


  }

  function onPlaybackRateChange(event){

    let currentTime = player.current.getCurrentTime();

    rates.current[rates.current.length - 1].endingPoint = currentTime;
    rates.current.push({
      startingPoint: currentTime,
      rate: event.data
    })

  }

  if (SVs.hidden) return null;
  return (
    <div style={{ margin:"12px 0", display: "flex", justifyContent: "left", alignItems:"center"}}>
      <a name={name} />
      {
        SVs.youtube ? 
          <div className="video" id={name} />
        : SVs.source ? 
          <video className="video" id={name} controls width="100%" >
            <source src={SVs.source} type={`video/${SVs.source.split('/').pop().split('.').pop()}`} />
            Your browser does not support the &lt;video&gt; tag.
          </video>
        :
          <span id={name}>{SVs.text}</span>
      }
    </div>
  ) 

  // if (SVs.youtube) {
  //   return <>
  //     <a name={name} />
  //     <div className="video" id={name} />
  //   </>
  // } else if (SVs.source) {
  //   let extension = SVs.source.split('/').pop().split('.').pop();
    // let type;
    // if (extension === "ogg") {
    //   type = "video/ogg";
    // } else if (extension === "webm") {
    //   type = "video/webm";
    // } else if (extension === "mp4") {
    //   type = "video/mp4";
    // } else {
    //   console.warn("Haven't implemented video for any extension other than .ogg, .webm, .mp4");
    // }
    // if (!type) return null

    // return (
    // <React.Fragment>
    //   <a name={name} />
    //   <video className="video" id={name} style={{ objectFit: "fill" }} controls={true} width={sizeToCSS(SVs.width)} height={sizeToCSS(SVs.height)}>
    //     <source src={SVs.source} type={type} />
    //   Your browser does not support the &lt;video&gt; tag.
    // </video>
    // </React.Fragment>
    //   ) 
    
  

  // console.warn("No video returned youtube or no valid sources specified");
  // return null;


  // return <><a name={name} /><span id={name}>{SVs.text}</span></>
}


