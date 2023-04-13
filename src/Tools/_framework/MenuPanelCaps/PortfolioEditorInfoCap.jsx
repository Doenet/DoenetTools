import { Box, Image } from '@chakra-ui/react';
import React from 'react';
import { useLoaderData } from 'react-router';

export async function loader({ params }) {
  const doenetId = params.doenetId;
  const response = await fetch(
    `/api/getPortfolioActivityData.php?doenetId=${doenetId}`,
  );
  const data = await response.json();

  return { activityData: data.activityData };
}

export default function PortfolioEditorInfoCap() {
  let data = useLoaderData();

  let imagePath = '/activity_default.jpg';
  if (data?.activityData?.imagePath) {
    imagePath = data?.activityData?.imagePath;
  }

  return (
    <>
      <Box
        height="130px"
        width="100%"
        // width="180px"
        background="black"
        overflow="hidden"
        // border="2px solid #949494"
        // borderRadius= "6px"
        margin="auto"
      >
        <Image
          width="100%"
          height="100%"
          objectFit="contain"
          src={imagePath}
          alt="Activity Image"
        />
      </Box>
      <div style={{ marginBottom: '5px', padding: '1px 5px' }}>
        Portfolio Activity Editor
      </div>
      {/* <div style={{ marginBottom: "5px",padding:'1px 5px' }}>{data.label}</div> */}
    </>
  );
}
