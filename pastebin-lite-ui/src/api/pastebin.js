const API_BASE_URL = 'https://pastebin-production-2639.up.railway.app';

export async function createPaste(data) {
  const response = await fetch(`${API_BASE_URL}/api/pastes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to create paste');
  }

  return response.json();
}
