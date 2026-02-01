import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

function Provider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const syncUser = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName || "User",
          }),
        });
      } catch (err) {
        console.error("User sync failed", err);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  return <>{children}</>;
}

export default Provider;
