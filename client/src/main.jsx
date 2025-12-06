import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { App } from "./App";
import ScrollToTop from "./components/Global/ScrollToTop";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <ScrollToTop />
            <App />
        </AuthProvider>
    </BrowserRouter>
);
