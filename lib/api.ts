export async function sendRequest(path: string) {
  if (path === "/api/ip") {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) {
      return { ip: "Unknown" };
    }

    return response.json();
  }

  const response = await fetch(path);
  return response.json();
}
