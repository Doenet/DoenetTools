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

function renderWithOutletContext(children, context, initEntries) {
  createMemoryRouter(
    [
      {
        path: "portfolio",
        element: <Outlet context={context} />,
        children: children,
      },
    ],
    initEntries,
  );
}

test.skip("test rendering the portfolio", async () => {
  const routes = [
    {
      path: "portfolio",
      element: <Portfolio />,
      loader: () => ({
        fullName: "Test User",
      }),
    },
  ];

  const router = renderWithOutletContext(
    routes,
    { singedIn: true },
    { initialEntries: ["/portfolio"] },
  );

  render(
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>,
  );

  // ACT
  //await userEvent.click(screen.getByText("Load Greeting"));
  //await screen.findByRole("heading");

  await screen.findByRole("heading");
  // ASSERT
  expect(screen.getByText("No Public Activities")).exist;
  expect(screen.getByRole("button")).toBeDisabled();
});

test("OLD test rendering the portfolio", async () => {
  const mockedLoaderData = { publicActivities: [], privateActivities: [] };
  const routes = [
    {
      path: "/portfolio",
      element: <Outlet context={{ signedIn: true }} />,
      children: [
        {
          path: "/portfolio",
          element: (
            <RecoilRoot>
              <Portfolio />
            </RecoilRoot>
          ),
          loader: () => mockedLoaderData,
        },
      ],
    },
  ];

  const router = createMemoryRouter(routes, { initialEntries: ["/portfolio"] });

  render(<RouterProvider router={router} />);

  // ACT
  //await userEvent.click(screen.getByText("Load Greeting"));
  //await screen.findByRole("heading");

  await screen.findByRole("button");
  // ASSERT
  expect(screen.getByText("No Public Activities")).exist;
  expect(screen.getByText("No Private Activities")).exist;
});
