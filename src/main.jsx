import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Dynamically add the favicon to the head
const link = document.createElement("link");
link.rel = "icon";
link.type = "image/svg+xml";
link.href = "/detour-logo.svg"; // Use the detour logo
document.head.appendChild(link);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
