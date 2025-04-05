import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

const LogoButton = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/Doenet_Logo_Frontpage_color_small_text.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 130px 45px;
  transition: 300ms;
  background-color: var(--canvas);
  width: 130px;
  height: 35px;
  display: inline-block;
  justify-content: center;
  border-radius: 2px;
  align-items: center;
  border-style: none;
  // border-radius: 50%;
  margin-top: 2px;
  margin-left: 10px;
  cursor: ${(props) => (props.hasLink ? "pointer" : "default")};
  &:focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`;

export default function RouterLogo({ hasLink = true }) {
  let navigate = useNavigate();

  return (
    <LogoButton
      hasLink={hasLink}
      onClick={() => {
        if (hasLink) {
          navigate("/");
        }
      }}
    />
  );
}
