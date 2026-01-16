export async function predictIntent(payload: any) {
  const res = await fetch("http://localhost:5000/api/ai/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
