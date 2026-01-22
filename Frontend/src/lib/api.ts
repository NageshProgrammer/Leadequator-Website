export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function predictIntent(payload: any) {
  const res = await fetch(`${API_BASE_URL}/api/ai/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to predict intent");
  }

  return res.json();
}
