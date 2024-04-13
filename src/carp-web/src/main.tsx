import React from 'react'
import { App } from './app'
import { createRoot } from 'react-dom/client';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./error-page";

const container = document.getElementById('app');

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <App />,
  //   errorElement: <ErrorPage />
  // },
  {
    path: "/*",
    element: <App />,
    errorElement: <ErrorPage />
  },
]);

const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
