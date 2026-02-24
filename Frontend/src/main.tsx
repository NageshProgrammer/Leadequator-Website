import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";

// Read keys from Vite env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Log for debugging (optional)
console.log("Clerk Key Initialized:", !!PUBLISHABLE_KEY);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        // Force global redirects to the onboarding flow
        afterSignUpUrl="/onboarding"
        afterSignInUrl="/onboarding"
      >
        <App />
      </ClerkProvider>
    ) : (
      <div
        style={{
          padding: "40px",
          fontFamily: "sans-serif",
          color: "red",
          textAlign: "center"
        }}
      >
        <h2>Clerk Publishable Key Missing</h2>
        <p>
          Please add <b>VITE_CLERK_PUBLISHABLE_KEY</b> to your{" "}
          <code>.env</code> file and restart the dev server.
        </p>
      </div>
    )}
  </StrictMode>
);