import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();
import React from "react";
import { Portfolio } from "../src/Tools/_framework/Paths/Portfolio";
import { Outlet, RouterProvider, createMemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import { RecoilRoot } from "recoil";
// import { useCourse, coursePermissionsAndSettings } from '../src/_reactComponents/Course/CourseActions';
// import { renderHook } from '@testing-library/react';
// import { RecoilRoot, useRecoilSetState } from 'recoil';
// import axios from 'axios';
// import { act } from 'react-dom/test-utils';

jest.mock("axios");

function createRouterWithOutlet(
  component,
  mockedLoaderData,
  outletContext,
  path,
) {
  return createMemoryRouter(
    [
      {
        path: path,
        element: <Outlet context={outletContext} />,
        children: [
          {
            path: path,
            element: <RecoilRoot>{component}</RecoilRoot>,
            loader: () => mockedLoaderData,
          },
        ],
      },
    ],
    { initialEntries: [path] },
  );
}

test("OLD test rendering the portfolio", async () => {
  const mockedLoaderData = { publicActivities: [], privateActivities: [] };
  const outletContext = { signedIn: true };

  const router = createRouterWithOutlet(
    <Portfolio />,
    mockedLoaderData,
    outletContext,
    "/portfolio",
  );

  render(<RouterProvider router={router} />);

  // ACT
  //await userEvent.click(screen.getByText("Load Greeting"));
  //await screen.findByRole("heading");

  await screen.findByRole("button", { name: "Add Activity" });
  // ASSERT
  expect(screen.getByText("No Public Activities")).exist;
  expect(screen.getByText("No Private Activities")).exist;
});
