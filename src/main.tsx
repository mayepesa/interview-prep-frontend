import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./app/styles.css";

// Sin StrictMode a propósito: los contadores de render de los ejemplos de
// performance mostrarían el doble en desarrollo. El ejemplo de StrictMode
// (React · Experto) lo activa solo para su propio árbol.
createRoot(document.getElementById("root")!).render(<App />);
