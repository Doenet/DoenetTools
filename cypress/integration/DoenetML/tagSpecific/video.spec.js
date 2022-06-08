
describe('Video Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('youtube video', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>An introduction to Doenet.</p>
  <video width="560 px" height="315px" youtube="tJ4ypc5L6uU" />

  `}, "*");
    });

    cy.get('#\\/_video1').invoke('attr', 'width').then((width) => expect(width).eq('560px'))
    cy.get('#\\/_video1').invoke('attr', 'height').then((height) => expect(height).eq('315px'))
    cy.get('#\\/_video1').invoke('attr', 'src').then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true))
  })

  it('video from external source', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <video width="560 px" height="315px" source="https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4" />
  `}, "*");
    });
    cy.get('#\\/_video1').invoke('attr', 'width').then((width) => expect(width).eq('560px'))
    cy.get('#\\/_video1').invoke('attr', 'height').then((height) => expect(height).eq('315px'))
    cy.get('#\\/_video1 source').invoke('attr', 'src').then((src) => expect(src).eq("https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4"));
    cy.get('#\\/_video1 source').invoke('attr', 'type').then((type) => expect(type).eq("video/mp4"));
  })

  it.skip('video from multiple sources', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <video width="560 px" height="315px">
   <source>https://flowergarden.noaa.gov/image_library/video/seaharew.mp4</source>
   <source>https://flowergarden.noaa.gov/image_library/video/seaharew.ogg</source>
   <source>https://flowergarden.noaa.gov/image_library/video/seaharew.webm</source>
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



})



