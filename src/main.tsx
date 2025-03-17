
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Track mouse position globally for popovers
declare global {
  interface Window {
    mouseX: number;
    mouseY: number;
  }
}

window.mouseX = 0;
window.mouseY = 0;

document.addEventListener('mousemove', (e) => {
  window.mouseX = e.clientX;
  window.mouseY = e.clientY;
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
