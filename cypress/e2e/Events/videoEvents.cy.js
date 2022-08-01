// import {signIn} from '../DoenetSignin/DoenetSignin.cy';


describe('video events test', function () {
  const userId = "cyuserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";

  before(() => {
    // cy.clearAllOfAUsersActivities({userId})
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.createCourse({ userId, courseId });
  })
  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId })
    cy.createActivity({ courseId, doenetId, parentDoenetId: courseId, pageDoenetId });
    cy.clearEvents({ doenetId })

  })


  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  it('youtube player, play/pause/skip events', () => {
    const doenetML = `
  <video youtube="tJ4ypc5L6uU" name="v" />

  <p>State: <copy prop="state" target="v" assignNames="state" /></p>
  <p>Time: <copy prop="time" target="v" assignNames="time" /></p>

  <p>Change time: <mathinput bindValueTo="$(v{prop='time'})" name="mi" /></p>

  <p>Control with actions:
  <callAction target="v" actionName="playVideo" name="play"><label>Play</label></callAction>
  <callAction target="v" actionName="pauseVideo" name="pause"><label>Pause</label></callAction>
  </p>

  <p>Skip to time 157: <updateValue target="v" prop="time" newValue="157" name="skip1"><label>Skip 1</label></updateValue></p>
  <p>Skip to time 57: <updateValue target="v" prop="time" newValue="57" name="skip2"><label>Skip 2</label></updateValue></p>
  `
    cy.saveDoenetML({ doenetML, pageId: pageDoenetId, courseId });
    cy.visit(`http://localhost/course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`)
    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.get('[data-test="toast"]').contains('Activity Assigned');

    cy.visit(`http://localhost/course?tool=assignment&doenetId=${doenetId}`)
    //Interact with content

    cy.get('#\\/state').contains("stopped")
    cy.get('#\\/play').click();

    cy.get('#\\/time').contains("5");
    cy.get('#\\/pause').click();

    cy.log('skip forward while paused')
    cy.get("#\\/mi textarea").type("{home}{shift+end}{backspace}105{enter}", { force: true });
    cy.get('#\\/time').contains("105");

    cy.get('#\\/play').click();

    cy.log('skip forward without pausing')
    cy.get('#\\/time').contains("107");
    cy.get('#\\/skip1').click();

    cy.get('#\\/time').contains('160');
    cy.get('#\\/pause').click();

    cy.log('skip backward while paused')
    cy.get("#\\/mi textarea").type("{home}{shift+end}{backspace}141{enter}", { force: true });
    cy.get('#\\/time').contains("141");

    cy.get('#\\/play').click();

    cy.log('skip backward without pausing')
    cy.get('#\\/time').contains("143");
    cy.get('#\\/skip2').click();

    cy.get('#\\/time').contains('58');
    cy.get('#\\/pause').click();

    cy.log('play last seconds')
    cy.get("#\\/mi textarea").type("{home}{shift+end}{backspace}298{enter}", { force: true });
    cy.get('#\\/time').contains("298");

    cy.get('#\\/play').click();
    cy.get('#\\/time').contains('299');

    cy.wait(1000); //TODO: time travel instead of wait?
    //Test if interactions were recorded
    cy.request(`http://localhost/api/getEventData.php?doenetId[]=${doenetId}`)
      .then((resp) => {
        const events = resp.body.events;

        let videoEvents = events.filter(evt => ["played", "watched", "paused", "skipped", "completed"].includes(evt.verb));
        let videoVerbs = videoEvents.map(x => x.verb);

        console.log(...videoEvents);

        let playedInd = 1;
        let playedEvent = videoEvents.splice(0, playedInd)[0];
        videoVerbs.splice(0, playedInd);

        let context = JSON.parse(playedEvent.context);
        let object = JSON.parse(playedEvent.object);
        let result = JSON.parse(playedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        let startingPoint = context.startingPoint;

        expect(startingPoint).gte(0);
        expect(startingPoint).lt(0.5);
        expect(context.rate).eq(1);


        let watchedInd = videoVerbs.indexOf("watched");
        let watchedEvent = videoEvents.splice(watchedInd, 1)[0];
        videoVerbs.splice(watchedInd, 1);

        context = JSON.parse(watchedEvent.context);
        object = JSON.parse(watchedEvent.object);
        result = JSON.parse(watchedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);

        let endingPoint = context.endingPoint;
        expect(endingPoint).gt(4);
        expect(endingPoint).lt(6);

        let rates = context.rates;
        expect(rates.length).eq(1);
        expect(rates[0].startingPoint).closeTo(startingPoint, 0.5);
        expect(rates[0].endingPoint).closeTo(endingPoint, 0.5);
        expect(rates[0].rate).eq(1);


        let pausedInd = videoVerbs.indexOf("paused");
        let pausedEvent = videoEvents.splice(pausedInd, 1)[0];
        videoVerbs.splice(pausedInd, 1);

        context = JSON.parse(pausedEvent.context);
        object = JSON.parse(pausedEvent.object);
        result = JSON.parse(pausedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.endingPoint).closeTo(endingPoint, 0.5);


        let skippedInd = videoVerbs.indexOf("skipped");
        let skippedEvent = videoEvents.splice(skippedInd, 1)[0];
        videoVerbs.splice(skippedInd, 1);

        context = JSON.parse(skippedEvent.context);
        object = JSON.parse(skippedEvent.object);
        result = JSON.parse(skippedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(endingPoint, 0.5);

        startingPoint = context.endingPoint;  // endpoint point of skipped becomes next starting point
        expect(startingPoint).gt(104);
        expect(startingPoint).lt(106);


        playedInd = videoVerbs.indexOf("played");
        playedEvent = videoEvents.splice(playedInd, 1)[0];
        videoVerbs.splice(playedInd, 1);

        context = JSON.parse(playedEvent.context);
        object = JSON.parse(playedEvent.object);
        result = JSON.parse(playedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);
        expect(context.rate).eq(1);


        watchedInd = videoVerbs.indexOf("watched");
        watchedEvent = videoEvents.splice(watchedInd, 1)[0];
        videoVerbs.splice(watchedInd, 1);

        context = JSON.parse(watchedEvent.context);
        object = JSON.parse(watchedEvent.object);
        result = JSON.parse(watchedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);

        endingPoint = context.endingPoint;
        expect(endingPoint).gt(106);
        expect(endingPoint).lt(108);

        rates = context.rates;
        expect(rates.length).eq(1);
        expect(rates[0].startingPoint).closeTo(startingPoint, 0.5);
        expect(rates[0].endingPoint).closeTo(endingPoint, 0.5);
        expect(rates[0].rate).eq(1);


        skippedInd = videoVerbs.indexOf("skipped");
        skippedEvent = videoEvents.splice(skippedInd, 1)[0];
        videoVerbs.splice(skippedInd, 1);

        context = JSON.parse(skippedEvent.context);
        object = JSON.parse(skippedEvent.object);
        result = JSON.parse(skippedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(endingPoint, 0.5);

        startingPoint = context.endingPoint;  // endpoint point of skipped becomes next starting point
        expect(startingPoint).gt(156);
        expect(startingPoint).lt(158);


        playedInd = videoVerbs.indexOf("played");
        playedEvent = videoEvents.splice(playedInd, 1)[0];
        videoVerbs.splice(playedInd, 1);

        context = JSON.parse(playedEvent.context);
        object = JSON.parse(playedEvent.object);
        result = JSON.parse(playedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);
        expect(context.rate).eq(1);


        watchedInd = videoVerbs.indexOf("watched");
        watchedEvent = videoEvents.splice(watchedInd, 1)[0];
        videoVerbs.splice(watchedInd, 1);

        context = JSON.parse(watchedEvent.context);
        object = JSON.parse(watchedEvent.object);
        result = JSON.parse(watchedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);

        endingPoint = context.endingPoint;
        expect(endingPoint).gt(159);
        expect(endingPoint).lt(161);

        rates = context.rates;
        expect(rates.length).eq(1);
        expect(rates[0].startingPoint).closeTo(startingPoint, 0.5);
        expect(rates[0].endingPoint).closeTo(endingPoint, 0.5);
        expect(rates[0].rate).eq(1);


        pausedInd = videoVerbs.indexOf("paused");
        pausedEvent = videoEvents.splice(pausedInd, 1)[0];
        videoVerbs.splice(pausedInd, 1);

        context = JSON.parse(pausedEvent.context);
        object = JSON.parse(pausedEvent.object);
        result = JSON.parse(pausedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.endingPoint).closeTo(endingPoint, 0.5);


        skippedInd = videoVerbs.indexOf("skipped");
        skippedEvent = videoEvents.splice(skippedInd, 1)[0];
        videoVerbs.splice(skippedInd, 1);

        context = JSON.parse(skippedEvent.context);
        object = JSON.parse(skippedEvent.object);
        result = JSON.parse(skippedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(endingPoint, 0.5);

        startingPoint = context.endingPoint;  // endpoint point of skipped becomes next starting point
        expect(startingPoint).gt(140);
        expect(startingPoint).lt(142);


        playedInd = videoVerbs.indexOf("played");
        playedEvent = videoEvents.splice(playedInd, 1)[0];
        videoVerbs.splice(playedInd, 1);

        context = JSON.parse(playedEvent.context);
        object = JSON.parse(playedEvent.object);
        result = JSON.parse(playedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);
        expect(context.rate).eq(1);


        watchedInd = videoVerbs.indexOf("watched");
        watchedEvent = videoEvents.splice(watchedInd, 1)[0];
        videoVerbs.splice(watchedInd, 1);

        context = JSON.parse(watchedEvent.context);
        object = JSON.parse(watchedEvent.object);
        result = JSON.parse(watchedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);

        endingPoint = context.endingPoint;
        expect(endingPoint).gt(142);
        expect(endingPoint).lt(144);

        rates = context.rates;
        expect(rates.length).eq(1);
        expect(rates[0].startingPoint).closeTo(startingPoint, 0.5);
        expect(rates[0].endingPoint).closeTo(endingPoint, 0.5);
        expect(rates[0].rate).eq(1);


        skippedInd = videoVerbs.indexOf("skipped");
        skippedEvent = videoEvents.splice(skippedInd, 1)[0];
        videoVerbs.splice(skippedInd, 1);

        context = JSON.parse(skippedEvent.context);
        object = JSON.parse(skippedEvent.object);
        result = JSON.parse(skippedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(endingPoint, 0.5);

        startingPoint = context.endingPoint;  // endpoint point of skipped becomes next starting point
        expect(startingPoint).gt(56);
        expect(startingPoint).lt(58);


        playedInd = videoVerbs.indexOf("played");
        playedEvent = videoEvents.splice(playedInd, 1)[0];
        videoVerbs.splice(playedInd, 1);

        context = JSON.parse(playedEvent.context);
        object = JSON.parse(playedEvent.object);
        result = JSON.parse(playedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);
        expect(context.rate).eq(1);


        watchedInd = videoVerbs.indexOf("watched");
        watchedEvent = videoEvents.splice(watchedInd, 1)[0];
        videoVerbs.splice(watchedInd, 1);

        context = JSON.parse(watchedEvent.context);
        object = JSON.parse(watchedEvent.object);
        result = JSON.parse(watchedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);

        endingPoint = context.endingPoint;
        expect(endingPoint).gt(57);
        expect(endingPoint).lt(59);

        rates = context.rates;
        expect(rates.length).eq(1);
        expect(rates[0].startingPoint).closeTo(startingPoint, 0.5);
        expect(rates[0].endingPoint).closeTo(endingPoint, 0.5);
        expect(rates[0].rate).eq(1);


        pausedInd = videoVerbs.indexOf("paused");
        pausedEvent = videoEvents.splice(pausedInd, 1)[0];
        videoVerbs.splice(pausedInd, 1);

        context = JSON.parse(pausedEvent.context);
        object = JSON.parse(pausedEvent.object);
        result = JSON.parse(pausedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.endingPoint).closeTo(endingPoint, 0.5);



        skippedInd = videoVerbs.indexOf("skipped");
        skippedEvent = videoEvents.splice(skippedInd, 1)[0];
        videoVerbs.splice(skippedInd, 1);

        context = JSON.parse(skippedEvent.context);
        object = JSON.parse(skippedEvent.object);
        result = JSON.parse(skippedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(endingPoint, 0.5);

        startingPoint = context.endingPoint;  // endpoint point of skipped becomes next starting point
        expect(startingPoint).gt(297);
        expect(startingPoint).lt(299);


        playedInd = videoVerbs.indexOf("played");
        playedEvent = videoEvents.splice(playedInd, 1)[0];
        videoVerbs.splice(playedInd, 1);

        context = JSON.parse(playedEvent.context);
        object = JSON.parse(playedEvent.object);
        result = JSON.parse(playedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);
        expect(context.rate).eq(1);



        watchedInd = videoVerbs.indexOf("watched");
        watchedEvent = videoEvents.splice(watchedInd, 1)[0];
        videoVerbs.splice(watchedInd, 1);

        context = JSON.parse(watchedEvent.context);
        object = JSON.parse(watchedEvent.object);
        result = JSON.parse(watchedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(object.componentName).eq("/v");

        expect(context.startingPoint).closeTo(startingPoint, 0.5);

        endingPoint = context.endingPoint;
        expect(endingPoint).gt(298);
        expect(endingPoint).lt(300);

        rates = context.rates;
        expect(rates.length).eq(1);
        expect(rates[0].startingPoint).closeTo(startingPoint, 0.5);
        expect(rates[0].endingPoint).closeTo(endingPoint, 0.5);
        expect(rates[0].rate).eq(1);


        let completedInd = videoVerbs.indexOf("completed");
        let completedEvent = videoEvents.splice(completedInd, 1)[0];
        videoVerbs.splice(completedInd, 1);

        context = JSON.parse(completedEvent.context);
        object = JSON.parse(completedEvent.object);
        result = JSON.parse(completedEvent.result);

        expect(Object.keys(result).length).eq(0);
        expect(Object.keys(context).length).eq(0);
        expect(object.componentName).eq("/v");


      });


  })



})