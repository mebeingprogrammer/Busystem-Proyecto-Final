//bus

const API_URL = "http://localhost:5000";

export async function createBus(data) {
  const response = await fetch(`${API_URL}/buses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}