import axios from 'axios';
import React, { useCallback, useRef, useState } from 'react';
import { redirect, useLoaderData, useNavigate } from 'react-router';
import { Form } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useDropzone } from 'react-dropzone';
import { FaFileImage } from 'react-icons/fa';
import {
  Card,
  Checkbox,
  Icon,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../NewToolRoot';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';

export async function action({ request, params }) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const referrer = urlParams.get('referrer');

  const formData = await request.formData();
  let updates = Object.fromEntries(formData);
  let response = await axios.post('/api/updatePortfolioActivitySettings.php', {
    ...updates,
    doenetId: params.doenetId,
  });

  if (referrer == 'portfolioeditor') {
    return redirect(
      `/portfolioeditor/${updates.doenetId}?tool=editor&doenetId=${updates.doenetId}&pageId=${updates.pageDoenetId}`,
    );
  } else {
    const portfolioCourseId = response.data.portfolioCourseId;
    return redirect(`/portfolio/${portfolioCourseId}`);
  }

  // if (response.ok) {
  //   // let { doenetId } = await response.json();
  // if (updates._source == "_source")
  // return redirect(`/portfolioeditor?tool=editor&doenetId=${updates.doenetId}&pageId=${updates.pageDoenetId}`)
  // return redirect(`/portfolioeditor?tool=editor&doenetId=${updates.doenetId}&pageId=${updates.pageDoenetId}`)
  // }else{
  //   return redirect(`/portfolio/${portfolioCourseId}`)
  // }
  // }else{
  //   throw Error(response.message)
  // }
}

export async function loader({ params }) {
  const response = await fetch(
    `/api/getPortfolioActivityData.php?doenetId=${params.doenetId}`,
  );
  const data = await response.json();
  return data.activityData;
}

export async function ErrorBoundry(whatdoIget) {
  console.log('whatdoIget', whatdoIget);
  return <p>Error</p>;
}

const MainGrid = styled.div`
  display: grid;
  grid-template-rows: auto 10px [slot1-start] 40px [slot1-end] 20px [slot2-start] min-content [slot2-end] 20px [slot3-start] 40px [slot3-end] 10px auto;
  height: 100vh;
`;

const Slot1 = styled.div`
  grid-row: slot1-start/slot1-end;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background: skyblue; */
`;

const Slot2 = styled.div`
  grid-row: slot2-start/slot2-end;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background: lightcoral; */
`;
const Slot3 = styled.div`
  grid-row: slot3-start/slot3-end;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* background: greenyellow; */
`;

const SideBySide = styled.div`
  display: flex;
  column-gap: 20px;
`;

export function PortfolioActivitySettings() {
  let data = useLoaderData();
  const navigate = useNavigate();
  let numberOfFilesUploading = useRef(0);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const { compileActivity, updateAssignItem } = useCourse(data.courseId);
  let isMakePublic = useRef(false);

  let [imagePath, setImagePath] = useState(data.imagePath);

  const onDrop = useCallback(
    async (files) => {
      let success = true;
      const file = files[0];
      if (files.length > 1) {
        success = false;
        //Should we just grab the first one and ignore the rest
        console.log('Only one file upload allowed!');
      }

      //Only upload one batch at a time
      if (numberOfFilesUploading.current > 0) {
        console.log(
          'Already uploading files.  Please wait before sending more.',
        );
        success = false;
      }

      //If any settings aren't right then abort
      if (!success) {
        return;
      }

      numberOfFilesUploading.current = 1;

      let image = await window.BrowserImageResizer.readAndCompressImage(file, {
        quality: 0.9,
        maxWidth: 350,
        maxHeight: 234,
        debug: true,
      });
      // const convertToBase64 = (blob) => {
      //   return new Promise((resolve) => {
      //     var reader = new FileReader();
      //     reader.onload = function () {
      //       resolve(reader.result);
      //     };
      //     reader.readAsDataURL(blob);
      //   });
      // };
      // let base64Image = await convertToBase64(image);
      // console.log("image",image)
      // console.log("base64Image",base64Image)

      //Upload files
      const reader = new FileReader();
      reader.readAsDataURL(image); //This one could be used with image source to preview image

      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {
        const uploadData = new FormData();
        // uploadData.append('file',file);
        uploadData.append('file', image);
        uploadData.append('doenetId', data.doenetId);
        axios.post('/api/upload.php', uploadData).then(({ data }) => {
          // console.log("RESPONSE data>",data)

          //uploads are finished clear it out
          numberOfFilesUploading.current = 0;
          let { success, cid } = data;
          if (success) {
            setImagePath(`/media/${cid}.jpg`);
          }
        });
      };
    },
    [data.doenetId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <>
      <Form method="post">
        <MainGrid>
          <Slot1>
            <Text fontSize="24px" fontWeight="700">
              Activity Settings
            </Text>
            {/* <div><h1>Activity Settings</h1></div> */}
          </Slot1>
          <Slot2>
            <TableContainer
              borderWidth="1px"
              borderStyle="solid"
              borderColor="doenet.grey"
              p="10px"
              borderRadius="lg"
            >
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Property</Th>
                    <Th>Setting</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr key="drop" {...getRootProps()}>
                    {isDragActive ? (
                      <Td colSpan={2}>
                        <input {...getInputProps()} />
                        <VStack
                          spacing={4}
                          p="24px"
                          border="2px dashed #949494"
                          borderRadius="lg"
                          width="556px"
                        >
                          <Icon
                            fontSize="24pt"
                            color="#949494"
                            as={FaFileImage}
                          />
                          <Text color="#949494" fontSize="24pt">
                            Drop Image Here
                          </Text>
                        </VStack>
                      </Td>
                    ) : (
                      <>
                        <Td>
                          <input {...getInputProps()} />
                          <SideBySide>
                            <Text>Image</Text>
                            <Button
                              value="Upload"
                              onClick={(e) => e.preventDefault()}
                            />
                          </SideBySide>
                        </Td>
                        <Td>
                          <input {...getInputProps()} />
                          <Card width="180px" height="120px" p="0" m="0">
                            <Image
                              height="120px"
                              maxWidth="180px"
                              src={imagePath}
                              alt="Activity Card Image"
                              borderTopRadius="md"
                              objectFit="cover"
                            />
                          </Card>
                        </Td>
                      </>
                    )}
                  </Tr>

                  <Tr>
                    <Td>
                      <Text>Activity Label</Text>
                    </Td>
                    <Td>
                      <input
                        name="label"
                        style={{ width: '390px' }}
                        type="text"
                        placeholder="Activity 1"
                        defaultValue={data.label}
                      />
                    </Td>
                  </Tr>
                  {/* <Tr>
        <Td>Learning Outcomes</Td>
        <Td><textarea name="learningOutcomes" style={{width:"390px",resize: "vertical"}} placeholder='Description of Learning Outcomes' defaultValue={data.learningOutcomes}/></Td>
        </Tr> */}
                  <Tr>
                    <Td>
                      <Checkbox
                        size="lg"
                        name="public"
                        value="on"
                        defaultChecked={data.public == '1'}
                        onChange={(e) => {
                          //Need to track that it was not public and now it is
                          if (e.target.checked && data.public == 0) {
                            isMakePublic.current = true;
                          } else {
                            isMakePublic.current = false;
                          }
                        }}
                      >
                        Public
                      </Checkbox>
                    </Td>
                    <Td></Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Slot2>
          <Slot3>
            <SideBySide>
              <Button
                alert
                value="Cancel"
                onClick={(e) => {
                  e.preventDefault();
                  //Assume that they came from the editor to orient Tool Root
                  setPageToolView({
                    page: 'portfolioeditor',
                    tool: 'editor',
                    view: '',
                    params: {},
                  });
                  navigate(-1);
                }}
              />
              <Button
                type="submit"
                value="Update"
                onClick={() => {
                  //Assume that they came from the editor to orient Tool Root
                  setPageToolView({
                    page: 'portfolioeditor',
                    tool: 'editor',
                    view: '',
                    params: {},
                  });
                  // console.log("check isMakePublic",e.target.checked,data.public,isMakePublic.current)
                  if (isMakePublic.current) {
                    //"Making private a public activity
                    compileActivity({
                      activityDoenetId: data.doenetId,
                      isAssigned: true,
                      courseId: data.courseId,
                      successCallback: () => {
                        //   addToast('Activity Assigned.', toastType.INFO);
                      },
                    });
                    updateAssignItem({
                      doenetId: data.doenetId,
                      isAssigned: true,
                      successCallback: () => {
                        //addToast(assignActivityToast, toastType.INFO);
                      },
                    });
                  }
                }}
              />
            </SideBySide>
          </Slot3>
        </MainGrid>
        <input type="hidden" name="imagePath" value={imagePath}></input>
        <input type="hidden" name="doenetId" value={data.doenetId}></input>
        <input
          type="hidden"
          name="pageDoenetId"
          value={data.pageDoenetId}
        ></input>
        {/* <input type="hidden" name="_source" value="portfolio activity settings"></input> */}
      </Form>
    </>
  );
}
