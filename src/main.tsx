import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "highlight.js/styles/github-dark.css";
import "./app/styles.css";

// Sin StrictMode a propósito: los contadores de render de los ejemplos
// mostrarían el doble en desarrollo. La página de StrictMode lo activa
// solo dentro de su propio ejemplo.
createRoot(document.getElementById("root")!).render(<App />);
