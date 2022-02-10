import React from "react";
import styled from "styled-components";

export default function ProgressBarNew(props) {
    const ProgressBarContainer = styled.div`
        background-color: #E2E2E2;
    `;

    const ProgressBar = styled.div`
        background-color: #1A5A99;
        width: 25%;
    `
    return (
        <ProgressBarContainer>
            <ProgressBar></ProgressBar>
        </ProgressBarContainer>
    )
}