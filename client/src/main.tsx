import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClientProvider } from "./ApolloClientProvider.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloClientProvider>
      <App />
    </ApolloClientProvider>
  </StrictMode>
);
