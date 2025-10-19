// src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RecallioLandingEnterprise from "./RecallioLandingEnterprise.jsx";
import AuthSuccess from "./pages/AuthSuccess.jsx";
import AuthError from "./pages/AuthError.jsx";
import Connections from "./pages/Connections.jsx";

const router = createBrowserRouter([
  { path: "/", element: <RecallioLandingEnterprise /> },
  { path: "/auth/success", element: <AuthSuccess /> },
  { path: "/auth/error", element: <AuthError /> },
  { path: "/settings/connections", element: <Connections /> },
  { path: "*", element: <div style={{ padding: 24 }}>404 Not Found</div> }
]);

export default function App() {
  return <RouterProvider router={router} />;
}

