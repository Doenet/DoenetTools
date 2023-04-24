import React from "react";
// import { useSetRecoilState } from 'recoil';
// import { pageToolViewAtom } from '../NewToolRoot';
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import { useNavigate } from "react-router";

export default function BackButton() {
  // const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const navigate = useNavigate();
  // return <Button onClick={()=>setPageToolView({back:true})} value='Back' />
  return <Button onClick={() => navigate(-1)} value="Back" />;
}
