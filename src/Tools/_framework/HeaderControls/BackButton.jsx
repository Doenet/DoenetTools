import React from "react";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import { useNavigate } from "react-router";

export default function BackButton() {
  const navigate = useNavigate();
  return <Button onClick={() => navigate(-1)} value="Back" />;
}
