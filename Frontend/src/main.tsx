import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Read keys from Vite env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

// Log for debugging (optional)
console.log("Clerk Key Initialized:", !!PUBLISHABLE_KEY);
console.log("PayPal Key Initialized:", !!PAYPAL_CLIENT_ID);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// ✅ Setup PayPal Options
const initialPayPalOptions = {
  clientId: PAYPAL_CLIENT_ID || "test", // Fallback prevents crash if env is missing
  currency: "USD",
  intent: "capture",
};

createRoot(rootElement).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        // Force global redirects to the onboarding flow
        afterSignUpUrl="/onboarding"
        afterSignInUrl="/onboarding"
      >
        {/* ✅ Wrap App with PayPal Provider */}
        <PayPalScriptProvider options={initialPayPalOptions}>
          <App />
        </PayPalScriptProvider>
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