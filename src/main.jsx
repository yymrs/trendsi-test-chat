import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@chatui/core/dist/index.css";
import "@chatui/core/es/styles/index.less";
import "uno.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
