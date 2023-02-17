import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { Carousel } from '../../_reactComponents/PanelHeaderComponents/Carousel';

const CarouselSection = styled.div`
      display: flex;
      flex-direction: column;
      padding: 60px 10px 60px 10px;
      margin: 0px;
      row-gap: 45px;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: var(--mainGray);
      height: 900px;
      /* @media (max-width: 800px) {
        height: 500px;
      }
      @media (max-width: 500px) {
        height: 1000px;
      } */
`

ReactDOM.render(
  <>
    <CarouselSection>
      {/* <Carousel title="demo" data={[
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 1', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 1', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 1', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 1', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 1', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 1', link: 'doenet.org' },
      ]} /> */}
      {/* <Carousel title="demo" data={[
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 1', link: 'doenet.org' },
      ]} />
      <Carousel title="demo" data={[
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 1', link: 'doenet.org' },
      ]} /> */}

      <Carousel title="demo" data={[
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 1', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 2', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 3', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 4', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 5', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 6', link: 'doenet.org' },
        { imagePath: 'https://www.warrenphotographic.co.uk/photography/sqrs/12777.jpg', text: 'slide 7', link: 'doenet.org' },
      ]} />
      {/* <Carousel title="demo" /> */}
    </CarouselSection>
  </>,
  document.getElementById('root'),
);

