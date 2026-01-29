const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createPaste(data) {
  const response = await fetch(`${API_BASE_URL}/api/pastes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  
  return response.json();
}
