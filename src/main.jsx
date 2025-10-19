import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // ← required for Tailwind v4 to apply

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
