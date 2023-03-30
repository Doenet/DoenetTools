// import axios from 'axios';
import { Avatar, Box, Image, Menu, MenuButton, MenuItem, MenuList, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { redirect, Form, useOutletContext, useLoaderData, Link, useFetcher } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { GoKebabVertical } from 'react-icons/go';
import { itemByDoenetId, useCourse } from '../../../_reactComponents/Course/CourseActions';
import { useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../NewToolRoot';

export async function action({request}) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj?._action == "Add Activity"){
      //Create a portfilio activity and redirect to the editor for it
      let response = await fetch("/api/createPortfolioActivity.php");
    
          if (response.ok) {
            let { doenetId, pageDoenetId } = await response.json();
            return redirect(`/portfolioeditor/${doenetId}?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`);
          }else{
            throw Error(response.message)
          }
  }else if (formObj?._action == "Delete"){
    let response = await fetch(`/api/deletePortfolioActivity.php?doenetId=${formObj.doenetId}`);
    
        if (response.ok) {
          // let respObj = await response.json();
          return true;
        }else{
          throw Error(response.message)
        }
  }else if (formObj?._action == "Make Public"){
    let response = await fetch(`/api/updateIsPublicActivity.php?doenetId=${formObj.doenetId}&isPublic=1`);
    
        if (response.ok) {
          // let respObj = await response.json();
          return true;
        }else{
          throw Error(response.message)
        }
  }else if (formObj?._action == "Make Private"){
    let response = await fetch(`/api/updateIsPublicActivity.php?doenetId=${formObj.doenetId}&isPublic=0`);
    
        if (response.ok) {
          // let respObj = await response.json();
          return true;
        }else{
          throw Error(response.message)
        }
  }

  throw Error(`Action "${formObj?._action}" not defined or not handled.`)
}

export async function loader({params}){

  //If we didn't create the course yet for this user then create it
  if (params.courseId == "not_created"){
    const response = await fetch('/api/createPortfolioCourse.php');
    const data = await response.json();
    return redirect(`/portfolio/${data.portfolioCourseId}`)
  }

  const response = await fetch(`/api/getPortfolio.php?courseId=${params.courseId}`);
  const data = await response.json();
  if (data.notMe){
    return redirect(`/portfolio/${params.courseId}/public`);
  }
  
  return {
    courseId:params.courseId,
    fullName:data.fullName,
    publicActivities:data.publicActivities,
    privateActivities:data.privateActivities,
  };
}

const PublicActivitiesSection = styled.div`
    grid-row: 2/3;
    display: flex;
    flex-direction: column;
    padding: 10px 10px 10px 10px;
    margin: 0px;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: var(--lightBlue);
`
const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 10px 10px 10px;
  margin: 0px;
  width: calc(100vw - 40px);
  `
const PrivateActivitiesSection = styled.div`
  grid-row: 3/4;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 10px;
  margin: 0px;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  background: var(--mainGray);
`

function Card({ 
  doenetId, 
  imagePath, 
  label, 
  pageDoenetId, 
  fullName, 
  isPublic, 
  courseId,
  version,
  content
 }) {
  const fetcher = useFetcher();
  //TODO: find the courseId
  const setItemByDoenetId = useSetRecoilState(itemByDoenetId(doenetId));
  const { compileActivity, updateAssignItem } = useCourse(courseId);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);


  // const activityLink = `/portfolio/${doenetId}/editor`;
  const activityLink = `/portfolioeditor/${doenetId}?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`;



  return (
      <Box 
      display="flex" 
      flexDirection="column"
      height="180px"
      width="180px"
      background="black"
      overflow="hidden"
      margin="10px"
      border="2px solid #949494"
      borderRadius= "6px"
      >
        <Box 
        position="relative"
        height="130px">
          <Link to={activityLink} onClick={()=>{
            setPageToolView({
              page: 'portfolioeditor',
              tool: 'editor',
              view: '',
              params:{},
            });
          }}>
          <Image 
            width="100%"
            height="100%"
            objectFit="contain"
            src={imagePath} 
            alt="Activity Card"
          />
          </Link>
          <Box 
          position="absolute"
          right="1px"
          top="4px"
          >
            <Menu>
              <MenuButton>
              {/* <MenuButton as={Button} > */}
                <Icon 
                color="#949494"
                as={GoKebabVertical} 
                boxSize={6}
                /> 
              </MenuButton>
              <MenuList>
                {isPublic ? 
                <MenuItem
                onClick={() => {
                  fetcher.submit({_action:"Make Private", doenetId}, { method: "post" });
                }}
                >Make Private</MenuItem> 
                : 
                <MenuItem
                onClick={() => {
                  //THINGS WE NEED FROM THE DB 
                  //- Version of DoenetML
                  //Eventually we want the content too (multipage)

                  setItemByDoenetId({
                    version,
                    isSinglePage:true,
                    content,
                  })

                  compileActivity({
                    activityDoenetId: doenetId,
                    isAssigned: true,
                    courseId,
                    // successCallback: () => {
                    //   addToast('Activity Assigned.', toastType.INFO);
                    // },
                  });
                  updateAssignItem({
                    doenetId,
                    isAssigned: true,
                    successCallback: () => {
                      fetcher.submit({_action:"Make Public", doenetId}, { method: "post" });
                      //addToast(assignActivityToast, toastType.INFO);
                    },
                  });
                }}
                >Make Public</MenuItem> }
                <MenuItem onClick={() => {
                  fetcher.submit({_action:"Delete", doenetId}, { method: "post" });
                }}>Delete</MenuItem>
                <MenuItem as={Link} to={`/portfolio/${doenetId}/settings`}>Settings</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>
        <Box
         height="50px"
         display="flex"
         justifyContent="flex-start"
         padding="2px"
         color="black"
         background="white"
        >
          <Box 
          width="40px"
          display="flex"
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          position="relative"
          >
            <Avatar size="sm" name={fullName} />
            <Box
            position="absolute"
            width="100px"
            left="8px"
            bottom="0px"
            >
              <Text fontSize='10px'>{fullName}</Text>
            </Box>
          </Box>
          <Box>
          <Text 
          fontSize='sm' 
          lineHeight='1' 
          noOfLines={2}
          >{label}</Text>
          </Box>
          
        </Box>
      </Box>
  );
}

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-rows: 80px min-content auto;
  /* grid-template-rows: 80px min-content min-content; */
  height: 100vh;
`

export function Portfolio(){
  let context = useOutletContext();
  let data = useLoaderData();
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  // const navigate = useNavigate();

  //Don't do more processing if we don't know if we are signed in or not
  if (context.signedIn == null){ return null;} 

  return <>
  <PortfolioGrid >
  <Box gridRow="1/2"
  backgroundColor="#fff"
  color="#000"
  height="80px"
  position="fixed"
  width="100%"
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
  textAlign="center"
  zIndex="1200"
  >
    <Text 
    fontSize="24px"
    fontWeight="700"
    >{data.fullName}</Text>
    <Text
    fontSize="16px"
    fontWeight="700"
    >Portfolio</Text>
    <div style={{position:"absolute", top:'48px',right:"10px"}}>
      <Form method="post">
      <Button value="Add Activity" onClick={()=>{
           setPageToolView({
             page: 'portfolioeditor',
             tool: 'editor',
             view: '',
             params:{},
           });
      }}/>
      <input type="hidden" name="_action" value="Add Activity" />
      </Form>
      </div>
    
  </Box>
  <PublicActivitiesSection>
  <Text
    fontSize="20px"
    fontWeight="700"
    >Public</Text>
    <CardsContainer>
      {data.publicActivities.length < 1 ? <div>No Public Activities</div>  :
    <>{data.publicActivities.map((activity)=>{
      return <Card 
      key={`Card${activity.doenetId}`} 
      {...activity} 
      fullName={data.fullName} 
      isPublic={true} 
      courseId={data.courseId} 
      />
    })}</>
     }
    </CardsContainer>
  </PublicActivitiesSection>

  <PrivateActivitiesSection>
  <Text
    fontSize="20px"
    fontWeight="700"
    >Private</Text>
    <CardsContainer>
      {data.privateActivities.length < 1 ? <div>No Private Activities</div>  :
    <>{data.privateActivities.map((activity)=>{
      return <Card 
      key={`Card${activity.doenetId}`} 
      {...activity} 
      fullName={data.fullName} 
      isPublic={false} 
      courseId={data.courseId} 
      />
    })}</>
     } 
    </CardsContainer>
  </PrivateActivitiesSection>
  </PortfolioGrid>
  </>
}

