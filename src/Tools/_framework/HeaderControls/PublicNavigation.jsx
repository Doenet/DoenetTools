import React, { Suspense } from "react";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import { useNavigate, useLoaderData } from "react-router";

export default function PublicNavigation() {
  const navigate = useNavigate();
  // const { isPortfolioCourse, doenetId, courseId } = useLoaderData();
  const { signedIn, portfolioCourseId } = useLoaderData();
  return (
    <Suspense fallback={<div>loading Breadcrumbs...</div>}>
      <div style={{ display: "flex", columnGap: "4px", marginRight: "16px" }}>
        <Button
          value="Home"
          onClick={() => {
            navigate("/");
          }}
        />
        <Button
          value="Community"
          onClick={() => {
            navigate("/community");
          }}
        />
        {signedIn ? (
          <>
            <Button
              value="Portfolio"
              onClick={() => {
                navigate(`/portfolio/${portfolioCourseId}`);
              }}
            />
          </>
        ) : null}
        {/* {isPortfolioCourse == '1' ? (
          <>
            <Button
              value="Portfolio"
              onClick={() => {
                navigate(`/publicportfolio/${courseId}`);
              }}
            />
            <Button
              value="Viewer"
              onClick={() => {
                navigate(`/portfolioviewer/${doenetId}`);
              }}
            />
          </>
        ) : null} */}
      </div>
    </Suspense>
  );
}
