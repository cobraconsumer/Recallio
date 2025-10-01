// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx"; // your existing landing page
import Integrations from "./pages/Integrations.jsx";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/integrations", element: <Integrations /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

