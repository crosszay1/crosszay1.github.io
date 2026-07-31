export async function sendRequest(path: string) {
  const response = await fetch(path);
  return response.json();
}