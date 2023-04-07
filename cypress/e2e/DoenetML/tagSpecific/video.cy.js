import cssesc from 'cssesc';
import { widthsBySize } from '../../../../src/Core/utils/size';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Video Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })


  it('youtube video', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>An introduction to Doenet.</p>
  <video width="560 px" youtube="tJ4ypc5L6uU" />

  `}, "*");
    });
    cy.get('#\\/_video1').invoke('css', 'width')
      .then(width => parseInt(width)).should('be.gte', widthsBySize["large"] - 4).and('be.lte', widthsBySize["large"] + 1)

    // cy.get('#\\/_video1').invoke('attr', 'height').then((height) => expect(height).eq('315px'))
    cy.get('#\\/_video1').invoke('attr', 'src').then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true))
  })

  it('video from external source', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <video width="560 px" source="https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4" />
  `}, "*");
    });
    cy.get('#\\/_video1').invoke('css', 'width')
      .then(width => parseInt(width)).should('be.gte', widthsBySize["large"] - 4).and('be.lte', widthsBySize["large"] + 1)
    // cy.get('#\\/_video1').invoke('attr', 'height').then((height) => expect(height).eq('315px'))
    cy.get('#\\/_video1 source').invoke('attr', 'src').then((src) => expect(src).eq("https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4"));
    cy.get('#\\/_video1 source').invoke('attr', 'type').then((type) => expect(type).eq("video/mp4"));
  })

  it.skip('video from multiple sources', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <video width="560 px">
   <source>https://flowergarden.noaa.gov/video_library/video/seaharew.mp4</source>
   <source>https://flowergarden.noaa.gov/video_library/video/seaharew.ogg</source>
   <source>https://flowergarden.noaa.gov/video_library/video/seaharew.webm</source>
  </video>
  `}, "*");
    });
    cy.get('#\\/_video1').invoke('attr', 'width').then((width) => expect(width).eq('560px'))
    cy.get('#\\/_video1').invoke('attr', 'height').then((height) => expect(height).eq('315px'))
    cy.get('#\\/_video1 source:first-child').invoke('attr', 'src').then((src) => expect(src).eq("https://flowergarden.noaa.gov/image_library/video/seaharew.mp4"));
    cy.get('#\\/_video1 source:first-child').invoke('attr', 'type').then((type) => expect(type).eq("video/mp4"));
    cy.get('#\\/_video1 source:nth-child(2)').invoke('attr', 'src').then((src) => expect(src).eq("https://flowergarden.noaa.gov/image_library/video/seaharew.ogg"));
    cy.get('#\\/_video1 source:nth-child(2)').invoke('attr', 'type').then((type) => expect(type).eq("video/ogg"));
    cy.get('#\\/_video1 source:nth-child(3)').invoke('attr', 'src').then((src) => expect(src).eq("https://flowergarden.noaa.gov/image_library/video/seaharew.webm"));
    cy.get('#\\/_video1 source:nth-child(3)').invoke('attr', 'type').then((type) => expect(type).eq("video/webm"));
  })


  it('video sizes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <video youtube="tJ4ypc5L6uU" name="v" />

    <video youtube="tJ4ypc5L6uU" name="vtiny" size="tiny" />
    <video youtube="tJ4ypc5L6uU" name="vsmall" size="small" />
    <video youtube="tJ4ypc5L6uU" name="vmedium" size="medium" />
    <video youtube="tJ4ypc5L6uU" name="vlarge" size="large" />
    <video youtube="tJ4ypc5L6uU" name="vfull" size="full" />
    <video youtube="tJ4ypc5L6uU" name="vinvalid" size="vnvalid" />

    <video youtube="tJ4ypc5L6uU" name="va10" width="10" />
    <video youtube="tJ4ypc5L6uU" name="va100" width="100" />
    <video youtube="tJ4ypc5L6uU" name="va200" width="200" />
    <video youtube="tJ4ypc5L6uU" name="va300" width="300" />
    <video youtube="tJ4ypc5L6uU" name="va400" width="400" />
    <video youtube="tJ4ypc5L6uU" name="va500" width="500" />
    <video youtube="tJ4ypc5L6uU" name="va600" width="600" />
    <video youtube="tJ4ypc5L6uU" name="va700" width="700" />
    <video youtube="tJ4ypc5L6uU" name="va800" width="800" />
    <video youtube="tJ4ypc5L6uU" name="va900" width="900" />
    <video youtube="tJ4ypc5L6uU" name="va10000" width="10000" />

    <video youtube="tJ4ypc5L6uU" name="vp1" width="1%" />
    <video youtube="tJ4ypc5L6uU" name="vp10" width="10%" />
    <video youtube="tJ4ypc5L6uU" name="vp20" width="20%" />
    <video youtube="tJ4ypc5L6uU" name="vp30" width="30%" />
    <video youtube="tJ4ypc5L6uU" name="vp40" width="40%" />
    <video youtube="tJ4ypc5L6uU" name="vp50" width="50%" />
    <video youtube="tJ4ypc5L6uU" name="vp60" width="60%" />
    <video youtube="tJ4ypc5L6uU" name="vp70" width="70%" />
    <video youtube="tJ4ypc5L6uU" name="vp80" width="80%" />
    <video youtube="tJ4ypc5L6uU" name="vp90" width="90%" />
    <video youtube="tJ4ypc5L6uU" name="vp100" width="100%" />
    <video youtube="tJ4ypc5L6uU" name="vp1000" width="1000%" />

    <video youtube="tJ4ypc5L6uU" name="vbadwidth" width="bad" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let expectedSizes = {
      v: "full",
      vtiny: "tiny",
      vsmall: "small",
      vmedium: "medium",
      vlarge: "large",
      vfull: "full",
      vinvalid: "full",
      va10: "tiny",
      va100: "tiny",
      va200: "small",
      va300: "small",
      va400: "medium",
      va500: "medium",
      va600: "large",
      va700: "large",
      va800: "full",
      va900: "full",
      va10000: "full",
      vp1: "tiny",
      vp10: "tiny",
      vp20: "small",
      vp30: "small",
      vp40: "small",
      vp50: "medium",
      vp60: "medium",
      vp70: "large",
      vp80: "large",
      vp90: "full",
      vp100: "full",
      vp1000: "full",
      vbadwidth: "full",
    }

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let name in expectedSizes) {
        console.log(stateVariables);
        console.log("/" + name)
        expect(stateVariables["/" + name].stateValues.size).eq(expectedSizes[name])
      }

    });

    for (let name in expectedSizes) {
      cy.get(cesc("#/" + name)).invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', widthsBySize[expectedSizes[name]] - 4).and('be.lte', widthsBySize[expectedSizes[name]] + 1)
    }

  });

  it('horizontal align', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <video youtube="tJ4ypc5L6uU" name="v" />
    <video youtube="tJ4ypc5L6uU" name="vleft" horizontalAlign="left" />
    <video youtube="tJ4ypc5L6uU" name="vright" horizontalAlign="right" />
    <video youtube="tJ4ypc5L6uU" name="vcenter" horizontalAlign="center" />
    <video youtube="tJ4ypc5L6uU" name="vinvalid" horizontalAlign="vnvalid" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v"].stateValues.horizontalAlign).eq("center")
      expect(stateVariables["/vleft"].stateValues.horizontalAlign).eq("left")
      expect(stateVariables["/vright"].stateValues.horizontalAlign).eq("right")
      expect(stateVariables["/vcenter"].stateValues.horizontalAlign).eq("center")
      expect(stateVariables["/vinvalid"].stateValues.horizontalAlign).eq("center")

    });

    // TODO: anything to check in the DOM?

  });

  it('displayMode', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <video youtube="tJ4ypc5L6uU" name="v" />
    <video youtube="tJ4ypc5L6uU" name="vinline" displayMode="inline" />
    <video youtube="tJ4ypc5L6uU" name="vblock" displayMode="block" />
    <video youtube="tJ4ypc5L6uU" name="vinvalid" displayMode="vnvalid" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v"].stateValues.displayMode).eq("block")
      expect(stateVariables["/vinline"].stateValues.displayMode).eq("inline")
      expect(stateVariables["/vblock"].stateValues.displayMode).eq("block")
      expect(stateVariables["/vinvalid"].stateValues.displayMode).eq("block")

    });

    // TODO: anything to check in the DOM?

  });

  it('actions on youtube video', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>An introduction to Doenet.</p>
  <video youtube="tJ4ypc5L6uU" name="v" />

  <p>State: <copy prop="state" target="v" assignNames="state" /></p>
  <p>Time: <copy prop="time" target="v" assignNames="time" /></p>
  <p>Duration: <copy prop="duration" target="v" assignNames="duration" /></p>
  <p>Seconds watched:  <copy prop="secondsWatched" target="v" assignNames="secondsWatched" displayDecimals="0" /></p>
  <p>Fraction watched:  <copy prop="fractionWatched" target="v" assignNames="fractionWatched" displayDecimals="2" /></p>

  <p>Change time: <mathinput bindValueTo="$(v.time)" name="mi" /></p>


  <p>Control via setting state variables directly:
  <updateValue type="text" target="v" prop="state" newValue="playing" name="playUpdate">
    <label>play</label>
  </updateValue>
  <updateValue type="text" target="v" prop="state" newValue="stopped" name="pauseUpdate">
    <label>stop</label>
  </updateValue>
  </p>

  <p>Control with actions:
  <callAction target="v" actionName="playVideo" name="playAction"><label>Play action</label></callAction>
  <callAction target="v" actionName="pauseVideo" name="pauseAction"><label>Pause action</label></callAction>
  </p>
  `}, "*");
    });


    cy.get('#\\/v').invoke('css', 'width')
      .then(width => parseInt(width)).should('be.gte', widthsBySize["full"] - 4).and('be.lte', widthsBySize["full"] + 1)

    cy.get('#\\/v').invoke('attr', 'src').then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true))

    cy.get('#\\/state').contains("initializing")

    cy.log('clicking play action too early does not do anything (no error)')
    cy.get('#\\/playAction').click();
    cy.get('#\\/state').contains("stopped")
    cy.get('#\\/time').contains("0")
    cy.get('#\\/duration').should('have.text', '300');
    cy.get('#\\/secondsWatched').should('have.text', '0')
    cy.get('#\\/fractionWatched').should('have.text', '0')

    cy.wait(2000);
    cy.get('#\\/state').contains("stopped")
    cy.get('#\\/time').contains("0")
    cy.get('#\\/secondsWatched').should('have.text', '0')
    cy.get('#\\/fractionWatched').should('have.text', '0')


    cy.log('play via action')
    cy.get('#\\/playAction').click();

    cy.get('#\\/state').contains("playing")
    cy.get('#\\/time').contains("1")
    cy.get('#\\/time').contains("2")
    cy.get('#\\/time').contains("3")

    cy.log('pause via action')
    cy.get('#\\/pauseAction').click();

    cy.get('#\\/state').contains("stopped")
    cy.get('#\\/time').contains("3")
    cy.get('#\\/secondsWatched').should('have.text', '3')
    cy.get('#\\/fractionWatched').should('have.text', '0.01')


    cy.log('cue to first minute')
    cy.get('#\\/mi textarea').type("{end}{backspace}60{enter}", { force: true });

    cy.get('#\\/state').contains("stopped")
    cy.get('#\\/time').contains("60")
    cy.get('#\\/secondsWatched').should('have.text', '3')
    cy.get('#\\/fractionWatched').should('have.text', '0.01')

    cy.log('play via update')
    cy.get('#\\/playUpdate').click();

    cy.get('#\\/state').contains("playing")
    cy.get('#\\/time').contains("61")
    cy.get('#\\/time').contains("62")

    cy.log('pause via update')
    cy.get('#\\/pauseUpdate').click();

    cy.get('#\\/state').contains("stopped")
    cy.get('#\\/time').contains("62")
    cy.get('#\\/secondsWatched').contains(/5|6/)

    cy.get('#\\/fractionWatched').should('have.text', '0.02')


  })

  it('video segmentsWatched watched merged, youtube video', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>An introduction to Doenet.</p>
  <video youtube="tJ4ypc5L6uU" name="v" />

  <p>State: <copy prop="state" target="v" assignNames="state" /></p>
  <p>Time: <copy prop="time" target="v" assignNames="time" /></p>
  <p>Duration: <copy prop="duration" target="v" assignNames="duration" /></p>
  <p>Seconds watched:  <copy prop="secondsWatched" target="v" assignNames="secondsWatched" displayDecimals="0" /></p>

  <p>Change time: <mathinput bindValueTo="$(v.time)" name="mi" /></p>

  <p>Control with actions:
  <callAction target="v" actionName="playVideo" name="playAction"><label>Play action</label></callAction>
  <callAction target="v" actionName="pauseVideo" name="pauseAction"><label>Pause action</label></callAction>
  </p>
  `}, "*");
    });


    cy.get('#\\/v').invoke('css', 'width')
      .then(width => parseInt(width)).should('be.gte', widthsBySize["full"] - 4).and('be.lte', widthsBySize["full"] + 1)

    cy.get('#\\/v').invoke('attr', 'src').then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true))

    cy.get('#\\/state').should("have.text", "stopped")
    cy.get('#\\/time').should("have.text", "0")
    cy.get('#\\/secondsWatched').should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v"].stateValues.segmentsWatched).eq(null);
    })


    cy.log('play')
    cy.get('#\\/playAction').click();

    cy.get('#\\/state').should("have.text", "playing")
    cy.get('#\\/time').should("have.text", "1")

    cy.log('pause')
    cy.get('#\\/pauseAction').click();

    cy.get('#\\/state').should("have.text", "stopped")
    cy.get('#\\/time').should("have.text", "1")
    cy.get('#\\/secondsWatched').should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v"].stateValues.segmentsWatched.length).eq(1);
      let theSegment = stateVariables["/v"].stateValues.segmentsWatched[0];
      expect(theSegment[0]).lt(0.5)
      expect(theSegment[1]).gt(0.5).lt(1.5)
    })


    cy.log('play')
    cy.get('#\\/playAction').click();

    cy.get('#\\/state').should("have.text", "playing")
    cy.get('#\\/time').should("have.text", "3")

    cy.log('pause')
    cy.get('#\\/pauseAction').click();

    cy.get('#\\/state').should("have.text", "stopped")
    cy.get('#\\/time').should("have.text", "3")
    cy.get('#\\/secondsWatched').should('have.text', '3')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v"].stateValues.segmentsWatched.length).eq(1);
      let theSegment = stateVariables["/v"].stateValues.segmentsWatched[0];
      expect(theSegment[0]).lt(0.5)
      expect(theSegment[1]).gt(2.5).lt(3.5)
    })


    cy.log('play')
    cy.get('#\\/playAction').click();

    cy.get('#\\/state').should("have.text", "playing")
    cy.get('#\\/time').should("have.text", "4")

    cy.log('pause')
    cy.get('#\\/pauseAction').click();

    cy.get('#\\/state').should("have.text", "stopped")
    cy.get('#\\/time').should("have.text", "4")
    cy.get('#\\/secondsWatched').should('have.text', '4')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v"].stateValues.segmentsWatched.length).eq(1);
      let theSegment = stateVariables["/v"].stateValues.segmentsWatched[0];
      expect(theSegment[0]).lt(0.5)
      expect(theSegment[1]).gt(3.5).lt(4.5)
    })

    cy.log('cue to first minute')
    cy.get('#\\/mi textarea').type("{end}{backspace}60{enter}", { force: true });
    cy.get('#\\/time').should("have.text", "60")


    cy.log('play')
    cy.get('#\\/playAction').click();

    cy.get('#\\/state').should("have.text", "playing")
    cy.get('#\\/time').should("have.text", "62")

    cy.log('pause')
    cy.get('#\\/pauseAction').click();

    cy.get('#\\/state').should("have.text", "stopped")
    cy.get('#\\/time').should("have.text", "62")
    cy.get('#\\/secondsWatched').contains(/6|7/)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v"].stateValues.segmentsWatched.length).eq(2);
      let theSegment = stateVariables["/v"].stateValues.segmentsWatched[0];
      expect(theSegment[0]).lt(0.5)
      expect(theSegment[1]).gt(3.5).lt(4.5)
      theSegment = stateVariables["/v"].stateValues.segmentsWatched[1];
      expect(theSegment[0]).gt(59.5).lt(60.5)
      expect(theSegment[1]).gt(61.5).lt(62.5)
    })

    cy.log('play')
    cy.get('#\\/playAction').click();

    cy.get('#\\/state').should("have.text", "playing")
    cy.get('#\\/time').should("have.text", "63")

    cy.log('pause')
    cy.get('#\\/pauseAction').click();

    cy.get('#\\/state').should("have.text", "stopped")
    cy.get('#\\/time').should("have.text", "63")
    cy.get('#\\/secondsWatched').contains(/7|8/)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v"].stateValues.segmentsWatched.length).eq(2);
      let theSegment = stateVariables["/v"].stateValues.segmentsWatched[0];
      expect(theSegment[0]).lt(0.5)
      expect(theSegment[1]).gt(3.5).lt(4.5)
      theSegment = stateVariables["/v"].stateValues.segmentsWatched[1];
      expect(theSegment[0]).gt(59.5).lt(60.5)
      expect(theSegment[1]).gt(62).lt(63.5)
    })


    cy.log('replay part of beginning')

    cy.get('#\\/mi textarea').type("{end}{backspace}{backspace}1{enter}", { force: true });
    cy.get('#\\/time').should("have.text", "1")

    cy.log('play')
    cy.get('#\\/playAction').click();

    cy.get('#\\/state').should("have.text", "playing")
    cy.get('#\\/time').should("have.text", "3")

    cy.log('pause')
    cy.get('#\\/pauseAction').click();

    cy.get('#\\/state').should("have.text", "stopped")
    cy.get('#\\/time').should("have.text", "3")
    cy.get('#\\/secondsWatched').contains(/7|8/)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v"].stateValues.segmentsWatched.length).eq(2);
      let theSegment = stateVariables["/v"].stateValues.segmentsWatched[0];
      expect(theSegment[0]).lt(0.5)
      expect(theSegment[1]).gt(3.5).lt(4.5)
      theSegment = stateVariables["/v"].stateValues.segmentsWatched[1];
      expect(theSegment[0]).gt(59.5).lt(60.5)
      expect(theSegment[1]).gt(62.5).lt(63.5)
    })

    cy.log('play')
    cy.wait(100)  // for some reason, need this delay when headless for play button to be activated
    cy.get('#\\/playAction').click();

    cy.get('#\\/state').should("have.text", "playing")
    cy.get('#\\/time').should("have.text", "5")

    cy.log('pause')
    cy.get('#\\/pauseAction').click();

    cy.get('#\\/state').should("have.text", "stopped")
    cy.get('#\\/time').should("have.text", "5")
    cy.get('#\\/secondsWatched').contains(/8|9/)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v"].stateValues.segmentsWatched.length).eq(2);
      let theSegment = stateVariables["/v"].stateValues.segmentsWatched[0];
      expect(theSegment[0]).lt(0.5)
      expect(theSegment[1]).gt(4).lt(5.5)
      theSegment = stateVariables["/v"].stateValues.segmentsWatched[1];
      expect(theSegment[0]).gt(59.5).lt(60.5)
      expect(theSegment[1]).gt(62.5).lt(63.5)
    })

  })


})



